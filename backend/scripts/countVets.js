/* eslint-disable no-console */
const mongoose = require('mongoose');
require('dotenv').config();

async function run() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI missing in .env');
    process.exit(1);
  }

  try {
    await mongoose.connect(uri);
    const db = mongoose.connection.db;
    const count = await db.collection('vets').countDocuments();
    console.log('vets count:', count);
    const samples = await db.collection('vets').find({}).limit(5).toArray();
    console.log('samples:', JSON.stringify(samples, null, 2));
    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error('error:', err.message || err);
    try { await mongoose.disconnect(); } catch {}
    process.exit(1);
  }
}

run();
