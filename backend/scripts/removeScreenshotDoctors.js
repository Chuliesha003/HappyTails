// backend/scripts/removeScreenshotDoctors.js
// Usage: node -r dotenv/config scripts/removeScreenshotDoctors.js

const mongoose = require('mongoose');
const Vet = require('../models/Vet');

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing in .env');

    await mongoose.connect(uri, { dbName: undefined });
    console.log('✅ Connected to MongoDB');

    const namesToRemove = ['Dr. Kamal Perera', 'Dr. Nisha Fernando'];
    for (const name of namesToRemove) {
      const res = await Vet.deleteMany({ name: new RegExp(`^${name}$`, 'i') });
      console.log(`Removed ${res.deletedCount} documents for name: ${name}`);
    }

    await mongoose.disconnect();
    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error('Error removing doctors:', err.message);
    process.exit(1);
  }
})();
