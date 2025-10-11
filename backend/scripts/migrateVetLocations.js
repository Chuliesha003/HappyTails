const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

// Connect to MongoDB
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for migration');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    process.exit(1);
  }
};

// Migration function to convert vet location format
const migrateVetLocations = async () => {
  try {
    await connectDB();
    
    const db = mongoose.connection.db;
    const vetsCollection = db.collection('vets');
    
    // Find all vets with old location format
    const vets = await vetsCollection.find({
      'location.coordinates.latitude': { $exists: true }
    }).toArray();
    
    console.log(`📋 Found ${vets.length} vets to migrate`);
    
    let migrated = 0;
    let skipped = 0;
    
    for (const vet of vets) {
      const { latitude, longitude } = vet.location.coordinates || {};
      
      if (latitude && longitude) {
        // First, unset the old structure
        await vetsCollection.updateOne(
          { _id: vet._id },
          {
            $unset: {
              'location.coordinates': '',
            }
          }
        );
        
        // Then, set the new GeoJSON format
        await vetsCollection.updateOne(
          { _id: vet._id },
          {
            $set: {
              'location.type': 'Point',
              'location.coordinates': [longitude, latitude], // [lng, lat] for GeoJSON
            }
          }
        );
        console.log(`✅ Migrated: ${vet.name} (${vet.location.city})`);
        migrated++;
      } else {
        console.log(`⚠️  Skipped: ${vet.name} - Missing coordinates`);
        skipped++;
      }
    }
    
    // Create 2dsphere index if it doesn't exist
    await vetsCollection.createIndex({ 'location.coordinates': '2dsphere' });
    console.log('✅ Created 2dsphere index on location.coordinates');
    
    console.log(`\n📊 Migration Summary:`);
    console.log(`   - Migrated: ${migrated}`);
    console.log(`   - Skipped: ${skipped}`);
    console.log(`   - Total: ${vets.length}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Migration completed successfully');
  } catch (error) {
    console.error('❌ Migration error:', error);
    process.exit(1);
  }
};

// Run migration
migrateVetLocations();
