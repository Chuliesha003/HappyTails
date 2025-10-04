const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoServer;

/**
 * Connect to in-memory MongoDB database for testing
 */
const connect = async () => {
  // Disconnect from any existing connection
  await mongoose.disconnect();

  // Create new in-memory MongoDB instance
  mongoServer = await MongoMemoryServer.create();
  const mongoUri = mongoServer.getUri();

  await mongoose.connect(mongoUri, {
    // useNewUrlParser and useUnifiedTopology are no longer needed in Mongoose 6+
  });
};

/**
 * Close database connection and stop MongoDB instance
 */
const closeDatabase = async () => {
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.dropDatabase();
    await mongoose.connection.close();
  }
  if (mongoServer) {
    await mongoServer.stop();
  }
};

/**
 * Clear all collections in the database
 */
const clearDatabase = async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    const collection = collections[key];
    await collection.deleteMany({});
  }
};

/**
 * Seed test data
 */
const seedTestData = async () => {
  const User = require('../models/User');
  const Pet = require('../models/Pet');
  const Vet = require('../models/Vet');

  // Create test user
  const testUser = await User.create({
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'user',
  });

  // Create test vet user
  const testVetUser = await User.create({
    uid: 'test-vet-uid',
    email: 'vet@example.com',
    displayName: 'Dr. Test Vet',
    role: 'vet',
  });

  // Create test admin user
  const testAdmin = await User.create({
    uid: 'test-admin-uid',
    email: 'admin@example.com',
    displayName: 'Admin User',
    role: 'admin',
  });

  // Create test pet
  const testPet = await Pet.create({
    owner: testUser._id,
    name: 'Max',
    species: 'dog',
    breed: 'Golden Retriever',
    birthDate: new Date('2020-01-15'),
    gender: 'male',
    weight: 30.5,
  });

  // Create test vet profile
  const testVet = await Vet.create({
    userId: testVetUser._id,
    name: 'Dr. Test Vet',
    email: 'vet@example.com',
    phone: '+1234567890',
    licenseNumber: 'VET-2024-TEST',
    specializations: ['General Practice'],
    experience: 5,
    isVerified: true,
  });

  return {
    testUser,
    testVetUser,
    testAdmin,
    testPet,
    testVet,
  };
};

module.exports = {
  connect,
  closeDatabase,
  clearDatabase,
  seedTestData,
};
