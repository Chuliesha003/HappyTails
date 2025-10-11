require('dotenv').config();
const Article = require('../models/Article');
const connectDB = require('../config/database');

async function checkArticles() {
  try {
    await connectDB();
    console.log('Connected to MongoDB');

    const articles = await Article.find({}).select('title category isPublished authorName');
    console.log(`\nFound ${articles.length} articles:\n`);

    articles.forEach((article, index) => {
      console.log(`${index + 1}. ${article.title}`);
      console.log(`   Category: ${article.category}`);
      console.log(`   Author: ${article.authorName || 'Unknown'}`);
      console.log(`   Status: ${article.isPublished ? 'Published' : 'Draft'}`);
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  } finally {
    process.exit(0);
  }
}

checkArticles();