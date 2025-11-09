// Reset a user's AI usage counter (guestUsageCount)
// Usage: node scripts/resetUsage.js <email>

const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '..', '.env') });
const User = require('../models/User');

(async () => {
  try {
    const email = process.argv[2];
    if (!email) {
      console.log('Usage: node scripts/resetUsage.js <email>');
      process.exit(1);
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    const user = await User.findByEmail(email);
    if (!user) {
      console.log(`User not found: ${email}`);
      process.exit(1);
    }

    user.guestUsageCount = 0;
    await user.save();

    console.log(`✅ Reset guestUsageCount for ${email}`);
    process.exit(0);
  } catch (err) {
    console.error('❌ Failed to reset usage:', err.message);
    process.exit(1);
  }
})();
