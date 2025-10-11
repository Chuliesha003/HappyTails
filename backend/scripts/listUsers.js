require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');

async function listUsers() {
  try {
    console.log('🔄 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    const users = await User.find({}).select('email fullName role firebaseUid').sort({ createdAt: -1 });

    console.log(`\n📋 Found ${users.length} users:\n`);

    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.email} - ${user.fullName || 'N/A'} - Role: ${user.role}`);
      console.log(`   Firebase UID: ${user.firebaseUid}`);
      console.log('');
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

listUsers();