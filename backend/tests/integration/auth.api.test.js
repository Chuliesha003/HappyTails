const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../server');
const User = require('../../models/User');
const { connect, closeDatabase, clearDatabase } = require('../helpers/db');

describe('Authentication API Integration Tests', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  describe('POST /api/auth/register', () => {
    it('should register a new user with valid token', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          idToken: 'valid-token',
          fullName: 'Test User',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.user.displayName).toBe('Test User');

      // Verify user was created in database
      const user = await User.findOne({ uid: 'test-uid-123' });
      expect(user).toBeDefined();
      expect(user.email).toBe('test@example.com');
    });

    it('should return existing user on subsequent login', async () => {
      // Create user first
      await User.create({
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Existing User',
        role: 'user',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          idToken: 'valid-token',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.displayName).toBe('Existing User');
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          idToken: 'invalid-token',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return current user with valid token', async () => {
      // Create user first
      await User.create({
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user',
      });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user).toBeDefined();
      expect(response.body.user.email).toBe('test@example.com');
    });

    it('should reject request without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should reject invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 404 if user not found in database', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer valid-token')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.message).toContain('User not found');
    });
  });

  describe('PUT /api/auth/profile', () => {
    beforeEach(async () => {
      // Create test user before each test
      await User.create({
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user',
      });
    });

    it('should update user profile with valid data', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({
          displayName: 'Updated Name',
          phoneNumber: '+1234567890',
          address: '123 Test St',
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.user.displayName).toBe('Updated Name');
      expect(response.body.user.phoneNumber).toBe('+1234567890');
      expect(response.body.user.address).toBe('123 Test St');

      // Verify update in database
      const user = await User.findOne({ uid: 'test-uid-123' });
      expect(user.displayName).toBe('Updated Name');
      expect(user.phoneNumber).toBe('+1234567890');
    });

    it('should update only provided fields', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({
          displayName: 'Only Name Updated',
        })
        .expect(200);

      expect(response.body.user.displayName).toBe('Only Name Updated');
      expect(response.body.user.email).toBe('test@example.com'); // Unchanged
    });

    it('should reject unauthorized request', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .send({
          displayName: 'Unauthorized Update',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should not allow updating protected fields', async () => {
      const response = await request(app)
        .put('/api/auth/profile')
        .set('Authorization', 'Bearer valid-token')
        .send({
          role: 'admin', // Should not be allowed
          uid: 'new-uid', // Should not be allowed
        })
        .expect(200);

      // Verify role and uid were not changed
      const user = await User.findOne({ uid: 'test-uid-123' });
      expect(user.role).toBe('user'); // Original role
      expect(user.uid).toBe('test-uid-123'); // Original uid
    });
  });

  describe('DELETE /api/auth/account', () => {
    beforeEach(async () => {
      // Create test user before each test
      await User.create({
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user',
      });
    });

    it('should deactivate user account', async () => {
      const response = await request(app)
        .delete('/api/auth/account')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('deactivated');

      // Verify user was deactivated (not deleted)
      const user = await User.findOne({ uid: 'test-uid-123' });
      expect(user).toBeDefined(); // Still exists
      expect(user.isActive).toBe(false); // But deactivated
    });

    it('should reject unauthorized request', async () => {
      const response = await request(app)
        .delete('/api/auth/account')
        .expect(401);

      expect(response.body.success).toBe(false);

      // Verify user was not deactivated
      const user = await User.findOne({ uid: 'test-uid-123' });
      expect(user.isActive).toBe(true);
    });
  });

  describe('Rate Limiting', () => {
    it('should enforce rate limit on auth endpoints', async () => {
      // Make multiple requests quickly
      const requests = [];
      for (let i = 0; i < 6; i++) {
        requests.push(
          request(app)
            .post('/api/auth/register')
            .send({ idToken: 'valid-token' })
        );
      }

      const responses = await Promise.all(requests);

      // Check if any request was rate limited (429 status)
      const rateLimited = responses.some(res => res.status === 429);
      expect(rateLimited).toBe(true);
    });
  });

  describe('Health Checks', () => {
    it('should return API health status', async () => {
      const response = await request(app)
        .get('/api/health')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('healthy');
      expect(response.body.uptime).toBeDefined();
      expect(response.body.environment).toBeDefined();
      expect(response.body.memory).toBeDefined();
    });

    it('should return root health check', async () => {
      const response = await request(app)
        .get('/')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('running');
    });
  });
});
