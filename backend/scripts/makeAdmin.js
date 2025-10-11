/**
 * Script to make a user an admin
 * Usage: node scripts/makeAdmin.js <email>
 */

require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function makeAdmin() {
  try {
    // Get email from command line argument
    const email = process.argv[2];
    
    if (!email) {
      console.log('❌ Please provide an email address');
      console.log('Usage: node scripts/makeAdmin.js <email>');
      process.exit(1);
    }

    // Connect to MongoDB
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find user by email
    const user = await User.findOne({ email: email.toLowerCase() });

    if (!user) {
      console.log(`❌ User not found with email: ${email}`);
      process.exit(1);
    }

    console.log(`\n📋 Current User Info:`);
    console.log(`   Email: ${user.email}`);
    console.log(`   Name: ${user.fullName || 'N/A'}`);
    console.log(`   Current Role: ${user.role}`);
    console.log(`   Firebase UID: ${user.firebaseUid}`);

    if (user.role === 'admin') {
      console.log('\n✅ User is already an admin!');
    } else {
      // Update role to admin
      user.role = 'admin';
      await user.save();
      console.log(`\n✅ User role updated to ADMIN successfully!`);
    }

    console.log('\n📋 Updated User Info:');
    console.log(`   Email: ${user.email}`);
    console.log(`   Role: ${user.role}`);
    console.log(`   Firebase UID: ${user.firebaseUid}`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

makeAdmin();
