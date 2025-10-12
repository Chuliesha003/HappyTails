const path = require('path');
const fs = require('fs-extra');
require('dotenv').config({ path: path.join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Article = require('../models/Article');

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected');
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
};

const sourceDir = path.resolve(__dirname, '../../Images'); // adjust if needed
const destDir = path.resolve(__dirname, '../public/uploads/articles');

// Helper: normalize string for matching
const normalize = (str) => str.toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();

// Helper: score match between filename and article
const scoreMatch = (filename, article) => {
  const fnNorm = normalize(filename);
  const titleNorm = normalize(article.title);
  const catNorm = normalize(article.category);
  
  let score = 0;
  
  // Category match (high priority)
  if (fnNorm.includes(catNorm)) score += 10;
  
  // Title word matches
  const titleWords = titleNorm.split(' ').filter(w => w.length > 3);
  for (const word of titleWords) {
    if (fnNorm.includes(word)) score += 2;
  }
  
  // Content keyword matches (first 100 chars)
  const contentNorm = normalize(article.content.substring(0, 100));
  const contentWords = contentNorm.split(' ').filter(w => w.length > 4);
  for (const word of contentWords.slice(0, 5)) {
    if (fnNorm.includes(word)) score += 1;
  }
  
  return score;
};

async function run() {
  await connectDB();
  
  // Ensure dest dir exists
  await fs.ensureDir(destDir);
  
  // Read all image files from source
  const allFiles = await fs.readdir(sourceDir);
  const imageFiles = allFiles.filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  
  console.log(`Found ${imageFiles.length} images in source folder.`);
  
  if (imageFiles.length < 48) {
    console.warn(`⚠️  Warning: Expected 48 images, found ${imageFiles.length}.`);
  }
  
  // Fetch all articles (sorted consistently)
  const articles = await Article.find({}).sort({ category: 1, createdAt: 1 });
  console.log(`Found ${articles.length} articles in DB.\n`);
  
  if (articles.length !== 48) {
    console.warn(`⚠️  Warning: Expected 48 articles, found ${articles.length}.\n`);
  }
  
  // Build match matrix
  const matches = [];
  const usedImages = new Set();
  
  // For each article, find best matching unused image
  for (const article of articles) {
    let bestScore = 0;
    let bestImage = null;
    
    for (const imgFile of imageFiles) {
      if (usedImages.has(imgFile)) continue;
      const score = scoreMatch(imgFile, article);
      if (score > bestScore) {
        bestScore = score;
        bestImage = imgFile;
      }
    }
    
    matches.push({ article, image: bestImage, score: bestScore });
    if (bestImage) usedImages.add(bestImage);
  }
  
  // Process matches: copy images and update DB
  let successCount = 0;
  for (let i = 0; i < matches.length; i++) {
    const { article, image, score } = matches[i];
    
    if (!image) {
      console.log(`[NO MATCH] "${article.title}" (${article.category})`);
      continue;
    }
    
    // Generate clean destination filename
    const ext = path.extname(image);
    const destFilename = `${article.category}-${(i % 8) + 1}${ext}`;
    const srcPath = path.join(sourceDir, image);
    const destPath = path.join(destDir, destFilename);
    
    // Copy file
    await fs.copy(srcPath, destPath, { overwrite: true });
    
    // Update article
    const localUrl = `/uploads/articles/${destFilename}`;
    article.imageUrl = localUrl;
    article.images = [localUrl];
    await article.save();
    
    console.log(`[OK] "${article.title}" (${article.category}) <- "${image}" (score: ${score})`);
    successCount++;
  }
  
  console.log(`\n✅ Successfully mapped ${successCount}/${articles.length} articles.`);
  console.log('Restart backend and refresh frontend to see images.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });