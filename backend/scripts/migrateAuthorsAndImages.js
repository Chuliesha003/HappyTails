const mongoose = require('mongoose');
const User = require('../models/User');
const Article = require('../models/Article');
require('dotenv').config();

async function migrate() {
  await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/happytails');
  console.log('Connected to MongoDB for migration');

  const publishers = [
    { fullName: 'Vinuki Omalshara', email: 'vinuki@example.com', firebaseUid: 'migrate-vinuki' },
    { fullName: 'Kavidhi Perera', email: 'kavidhi@example.com', firebaseUid: 'migrate-kavidhi' },
    { fullName: 'Chuliesha Perera', email: 'chuliesha@example.com', firebaseUid: 'migrate-chuliesha' },
  ];

  // Ensure publisher user records exist
  const createdUsers = [];
  for (const p of publishers) {
    let u = await User.findByEmail(p.email);
    if (!u) {
      u = await User.create({
        firebaseUid: p.firebaseUid,
        email: p.email,
        fullName: p.fullName,
        role: 'admin',
      });
      console.log(`Created user ${p.fullName}`);
    } else {
      console.log(`Found existing user ${p.fullName}`);
    }
    createdUsers.push(u);
  }

  // Update articles: if images is empty but imageUrl exists, move it to images.
  // Also assign authors in a round-robin way and set authorName
  const articles = await Article.find({}).sort({ createdAt: 1 });
  console.log(`Found ${articles.length} articles`);

  for (let i = 0; i < articles.length; i++) {
    const art = articles[i];
    let changed = false;

    if ((!art.images || art.images.length === 0) && art.imageUrl) {
      art.images = [art.imageUrl];
      changed = true;
    }

    // assign author round-robin
    const pick = createdUsers[i % createdUsers.length];
    if (!art.author || String(art.author) !== String(pick._id)) {
      art.author = pick._id;
      art.authorName = pick.fullName;
      changed = true;
    }

    if (changed) {
      await art.save();
      console.log(`Updated article: ${art.title}`);
    }
  }

  console.log('Migration complete');
  await mongoose.disconnect();
}

migrate().catch(err => {
  console.error(err);
  process.exit(1);
});
