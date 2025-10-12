const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const axios = require('axios');
const Article = require('../models/Article');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected for image verification');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const fallbackImage = 'https://images.pexels.com/photos/574519/pexels-photo-574519.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop';

const checkUrlIsImage = async (url) => {
  if (!url) return false;
  try {
    // Try HEAD first (some hosts may not support HEAD)
    const head = await axios.head(url, { timeout: 10000, maxRedirects: 5 });
    const ct = head.headers['content-type'] || '';
    return head.status === 200 && ct.startsWith('image');
  } catch (headErr) {
    // Fallback to GET (stream) in case HEAD isn't allowed
    try {
      const res = await axios.get(url, { timeout: 10000, responseType: 'stream', maxRedirects: 5 });
      const ct = res.headers['content-type'] || '';
      // destroy the stream immediately to avoid downloading the whole file
      if (res.data && typeof res.data.destroy === 'function') res.data.destroy();
      return res.status === 200 && ct.startsWith('image');
    } catch (getErr) {
      return false;
    }
  }
};

const run = async () => {
  await connectDB();
  try {
    const articles = await Article.find({}).select('title imageUrl images category').lean();
    console.log(`Found ${articles.length} articles. Checking images...`);

    let fixedCount = 0;
    for (const a of articles) {
      const primary = (a.images && a.images.length > 0) ? a.images[0] : a.imageUrl;
      if (!primary) {
        console.log(`- [SKIP] "${a.title}" (${a.category}) has no image`);
        continue;
      }

      const ok = await checkUrlIsImage(primary);
      if (ok) {
        console.log(`- [OK]   "${a.title}" (${a.category})`);
        continue;
      }

      console.log(`- [FIX]  "${a.title}" (${a.category}) => broken image, replacing with fallback`);
      // Update the article to use the fallback image for both fields
      await Article.updateOne({ _id: a._id }, { $set: { imageUrl: fallbackImage, images: [fallbackImage] } });
      fixedCount++;
    }

    console.log(`\nDone. Fixed ${fixedCount} articles. If you prefer replacements with different images, edit this script's fallbackImage or update specific records.`);
    process.exit(0);
  } catch (err) {
    console.error('Error during verification/fix:', err);
    process.exit(1);
  }
};

run();
