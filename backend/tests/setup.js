// Test setup and configuration
require('dotenv').config({ path: '.env.test' });

// Increase timeout for all tests
jest.setTimeout(30000);

// Mock Firebase Admin SDK
jest.mock('firebase-admin', () => ({
  credential: {
    cert: jest.fn(),
  },
  initializeApp: jest.fn(),
  auth: jest.fn(() => ({
    verifyIdToken: jest.fn((token) => {
      // Mock successful verification
      if (token === 'valid-token') {
        return Promise.resolve({
          uid: 'test-uid-123',
          email: 'test@example.com',
        });
      }
      // Mock failed verification
      return Promise.reject(new Error('Invalid token'));
    }),
    getUser: jest.fn((uid) => {
      return Promise.resolve({
        uid,
        email: 'test@example.com',
        displayName: 'Test User',
      });
    }),
  })),
}));

// Mock Google Generative AI
jest.mock('@google/generative-ai', () => ({
  GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
    getGenerativeModel: jest.fn(() => ({
      generateContent: jest.fn(() =>
        Promise.resolve({
          response: {
            text: () =>
              JSON.stringify({
                severity: 'moderate',
                possibleConditions: ['Test Condition'],
                recommendations: ['Test Recommendation'],
                urgency: 'Schedule appointment within 2-3 days',
                homeCareTips: ['Test home care tip'],
              }),
          },
        })
      ),
    })),
  })),
}));

// Suppress console output during tests (optional)
if (process.env.SUPPRESS_TEST_LOGS === 'true') {
  global.console = {
    ...console,
    log: jest.fn(),
    debug: jest.fn(),
    info: jest.fn(),
    warn: jest.fn(),
    error: jest.fn(),
  };
}

// Global test utilities
global.testUtils = {
  generateMockToken: () => 'valid-token',
  generateInvalidToken: () => 'invalid-token',
  mockUser: {
    uid: 'test-uid-123',
    email: 'test@example.com',
    displayName: 'Test User',
    role: 'user',
  },
  mockVet: {
    uid: 'test-vet-uid',
    email: 'vet@example.com',
    displayName: 'Dr. Test Vet',
    role: 'vet',
  },
  mockAdmin: {
    uid: 'test-admin-uid',
    email: 'admin@example.com',
    displayName: 'Admin User',
    role: 'admin',
  },
};

// Clean up after all tests
afterAll(async () => {
  // Close any open database connections
  const mongoose = require('mongoose');
  if (mongoose.connection.readyState !== 0) {
    await mongoose.connection.close();
  }
});
