// backend/scripts/seedScreenshotDoctors.js
// Usage: node -r dotenv/config scripts/seedScreenshotDoctors.js

const mongoose = require('mongoose');
const Vet = require('../models/Vet');

const DOCTORS = [
  {
    name: 'Dr. Kamal Perera',
    licenseNumber: 'SCREEN-001',
    clinicName: 'Colombo Pet Hospital',
    email: 'dr.kamal@happytails.lk',
    phoneNumber: '+94 11 234 5678',
    specialization: ['General Practice', 'Surgery', 'Emergency Care'],
    yearsOfExperience: 15,
    location: {
      type: 'Point',
      coordinates: [79.8612, 6.9271],
      address: '123, Galle Road, Colombo 03, Western Province 00300',
      city: 'Colombo',
    },
    services: ['Consultation', 'Surgery', 'Emergency'],
    isActive: true,
    isVerified: true,
  },
  {
    name: 'Dr. Nisha Fernando',
    licenseNumber: 'SCREEN-002',
    clinicName: 'VetCare Colombo',
    email: 'dr.nisha@happytails.lk',
    phoneNumber: '+94 11 345 6789',
    specialization: ['Dermatology', 'Internal Medicine', 'Preventive Care'],
    yearsOfExperience: 10,
    location: {
      type: 'Point',
      coordinates: [79.8700, 6.9200],
      address: '456, Duplication Road, Colombo 04, Western Province 00400',
      city: 'Colombo',
    },
    services: ['Dermatology', 'Wellness'],
    isActive: true,
    isVerified: true,
  },
];

(async () => {
  try {
    const uri = process.env.MONGODB_URI;
    if (!uri) throw new Error('MONGODB_URI missing in .env');

    await mongoose.connect(uri, { dbName: undefined });
    console.log('✅ Connected to MongoDB');

    for (const d of DOCTORS) {
      const filter = { licenseNumber: d.licenseNumber };
      const update = { $set: d, $setOnInsert: { createdAt: new Date() } };
      const options = { upsert: true, new: true, setDefaultsOnInsert: true };
      await Vet.findOneAndUpdate(filter, update, options);
      console.log(`✔️  Upserted: ${d.name} (${d.clinicName})`);
    }

    await mongoose.disconnect();
    console.log('\n🎉 Done seeding screenshot doctors');
    process.exit(0);
  } catch (err) {
    console.error('❌ Seed error:', err.message || err);
    process.exit(1);
  }
})();
