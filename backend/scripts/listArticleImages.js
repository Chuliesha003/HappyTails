require('dotenv').config();
const mongoose = require('mongoose');
const Article = require('../models/Article');

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to DB for verification');

    const articles = await Article.find({}).select('title imageUrl images category').lean();
    console.log(`Found ${articles.length} articles. Listing titles and main imageUrl:\n`);
    articles.forEach(a => {
      console.log(`- ${a.title} [${a.category}]`);
      console.log(`  imageUrl: ${a.imageUrl}`);
      if (a.images && a.images.length) console.log(`  images: ${JSON.stringify(a.images)}`);
      console.log('');
    });

    process.exit(0);
  } catch (err) {
    console.error('Verification error', err);
    process.exit(1);
  }
})();