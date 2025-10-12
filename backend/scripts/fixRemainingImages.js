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

const sourceDir = path.resolve(__dirname, '../../Images');
const destDir = path.resolve(__dirname, '../public/uploads/articles');

// Manual mappings for the 4 unmatched articles
const manualMappings = [
  {
    title: "Understanding Feline Nutritional Needs",
    category: "nutrition",
    imageFile: "cat raw foods.jpg"
  },
  {
    title: "The Importance of Omega Fatty Acids for Pets",
    category: "nutrition",
    imageFile: "dog weight.jpg"
  },
  {
    title: "Leash Training: How to Enjoy Walks with Your Dog",
    category: "training",
    imageFile: "dog Leash Training.jpg"
  },
  {
    title: "Clicker Training for Cats: Is It Possible?",
    category: "training",
    imageFile: "Clicker Training for Cats.jpg"
  }
];

async function run() {
  await connectDB();
  await fs.ensureDir(destDir);
  
  for (const mapping of manualMappings) {
    const article = await Article.findOne({ 
      title: mapping.title,
      category: mapping.category 
    });
    
    if (!article) {
      console.log(`[NOT FOUND] Article: "${mapping.title}"`);
      continue;
    }
    
    const srcPath = path.join(sourceDir, mapping.imageFile);
    if (!fs.existsSync(srcPath)) {
      console.log(`[NOT FOUND] Image: "${mapping.imageFile}"`);
      continue;
    }
    
    const ext = path.extname(mapping.imageFile);
    const destFilename = `${mapping.category}-${Date.now()}${ext}`;
    const destPath = path.join(destDir, destFilename);
    
    await fs.copy(srcPath, destPath, { overwrite: true });
    
    const localUrl = `/uploads/articles/${destFilename}`;
    article.imageUrl = localUrl;
    article.images = [localUrl];
    await article.save();
    
    console.log(`[OK] "${article.title}" (${article.category}) <- "${mapping.imageFile}"`);
  }
  
  console.log('\n✅ All 48 articles now have images!');
  console.log('Restart backend and refresh frontend.');
  process.exit(0);
}

run().catch(err => { console.error(err); process.exit(1); });
