const mongoose = require('mongoose');
const User = require('../../models/User');
const { connect, closeDatabase, clearDatabase } = require('../helpers/db');

describe('User Model Tests', () => {
  // Setup database before tests
  beforeAll(async () => {
    await connect();
  });

  // Clean database between tests
  afterEach(async () => {
    await clearDatabase();
  });

  // Close database after all tests
  afterAll(async () => {
    await closeDatabase();
  });

  describe('User Creation', () => {
    it('should create a new user with valid data', async () => {
      const userData = {
        uid: 'test-uid-123',
        email: 'test@example.com',
        displayName: 'Test User',
        role: 'user',
      };

      const user = await User.create(userData);

      expect(user).toBeDefined();
      expect(user.uid).toBe(userData.uid);
      expect(user.email).toBe(userData.email);
      expect(user.displayName).toBe(userData.displayName);
      expect(user.role).toBe('user');
      expect(user.isActive).toBe(true); // default value
      expect(user.createdAt).toBeDefined();
    });

    it('should create user with default role if not specified', async () => {
      const userData = {
        uid: 'test-uid-456',
        email: 'user@example.com',
        displayName: 'Another User',
      };

      const user = await User.create(userData);

      expect(user.role).toBe('user');
    });

    it('should fail to create user without required fields', async () => {
      const userData = {
        displayName: 'Incomplete User',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });

    it('should fail to create user with duplicate uid', async () => {
      const userData = {
        uid: 'duplicate-uid',
        email: 'user1@example.com',
        displayName: 'User One',
      };

      await User.create(userData);

      const duplicateUser = {
        uid: 'duplicate-uid',
        email: 'user2@example.com',
        displayName: 'User Two',
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    it('should fail to create user with duplicate email', async () => {
      const userData = {
        uid: 'uid-1',
        email: 'duplicate@example.com',
        displayName: 'User One',
      };

      await User.create(userData);

      const duplicateUser = {
        uid: 'uid-2',
        email: 'duplicate@example.com',
        displayName: 'User Two',
      };

      await expect(User.create(duplicateUser)).rejects.toThrow();
    });

    it('should create user with valid phone number', async () => {
      const userData = {
        uid: 'test-uid-phone',
        email: 'phone@example.com',
        displayName: 'Phone User',
        phoneNumber: '+1234567890',
      };

      const user = await User.create(userData);

      expect(user.phoneNumber).toBe(userData.phoneNumber);
    });

    it('should create user with address', async () => {
      const userData = {
        uid: 'test-uid-address',
        email: 'address@example.com',
        displayName: 'Address User',
        address: '123 Main St, City, State 12345',
      };

      const user = await User.create(userData);

      expect(user.address).toBe(userData.address);
    });
  });

  describe('User Roles', () => {
    it('should accept valid role: user', async () => {
      const user = await User.create({
        uid: 'role-test-1',
        email: 'user@example.com',
        displayName: 'Regular User',
        role: 'user',
      });

      expect(user.role).toBe('user');
    });

    it('should accept valid role: vet', async () => {
      const user = await User.create({
        uid: 'role-test-2',
        email: 'vet@example.com',
        displayName: 'Vet User',
        role: 'vet',
      });

      expect(user.role).toBe('vet');
    });

    it('should accept valid role: admin', async () => {
      const user = await User.create({
        uid: 'role-test-3',
        email: 'admin@example.com',
        displayName: 'Admin User',
        role: 'admin',
      });

      expect(user.role).toBe('admin');
    });

    it('should reject invalid role', async () => {
      const userData = {
        uid: 'role-test-invalid',
        email: 'invalid@example.com',
        displayName: 'Invalid Role User',
        role: 'invalid-role',
      };

      await expect(User.create(userData)).rejects.toThrow();
    });
  });

  describe('User Status', () => {
    it('should set isActive to true by default', async () => {
      const user = await User.create({
        uid: 'status-test-1',
        email: 'active@example.com',
        displayName: 'Active User',
      });

      expect(user.isActive).toBe(true);
    });

    it('should allow setting isActive to false', async () => {
      const user = await User.create({
        uid: 'status-test-2',
        email: 'inactive@example.com',
        displayName: 'Inactive User',
        isActive: false,
      });

      expect(user.isActive).toBe(false);
    });

    it('should allow updating user status', async () => {
      const user = await User.create({
        uid: 'status-test-3',
        email: 'update@example.com',
        displayName: 'Update User',
        isActive: true,
      });

      user.isActive = false;
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.isActive).toBe(false);
    });
  });

  describe('User Updates', () => {
    it('should update user display name', async () => {
      const user = await User.create({
        uid: 'update-test-1',
        email: 'update1@example.com',
        displayName: 'Original Name',
      });

      user.displayName = 'Updated Name';
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.displayName).toBe('Updated Name');
    });

    it('should update user phone number', async () => {
      const user = await User.create({
        uid: 'update-test-2',
        email: 'update2@example.com',
        displayName: 'Phone Update User',
      });

      user.phoneNumber = '+9876543210';
      await user.save();

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.phoneNumber).toBe('+9876543210');
    });

    it('should update timestamps on save', async () => {
      const user = await User.create({
        uid: 'timestamp-test',
        email: 'timestamp@example.com',
        displayName: 'Timestamp User',
      });

      const originalUpdatedAt = user.updatedAt;

      // Wait a bit to ensure timestamp changes
      await new Promise(resolve => setTimeout(resolve, 100));

      user.displayName = 'Updated';
      await user.save();

      expect(user.updatedAt.getTime()).toBeGreaterThan(originalUpdatedAt.getTime());
    });
  });

  describe('User Deletion', () => {
    it('should delete user successfully', async () => {
      const user = await User.create({
        uid: 'delete-test',
        email: 'delete@example.com',
        displayName: 'Delete User',
      });

      await User.findByIdAndDelete(user._id);

      const deletedUser = await User.findById(user._id);
      expect(deletedUser).toBeNull();
    });
  });

  describe('User Queries', () => {
    beforeEach(async () => {
      // Create multiple test users
      await User.create([
        {
          uid: 'query-1',
          email: 'user1@example.com',
          displayName: 'User One',
          role: 'user',
        },
        {
          uid: 'query-2',
          email: 'vet1@example.com',
          displayName: 'Vet One',
          role: 'vet',
        },
        {
          uid: 'query-3',
          email: 'admin1@example.com',
          displayName: 'Admin One',
          role: 'admin',
        },
      ]);
    });

    it('should find user by uid', async () => {
      const user = await User.findOne({ uid: 'query-1' });
      expect(user).toBeDefined();
      expect(user.email).toBe('user1@example.com');
    });

    it('should find user by email', async () => {
      const user = await User.findOne({ email: 'vet1@example.com' });
      expect(user).toBeDefined();
      expect(user.role).toBe('vet');
    });

    it('should find users by role', async () => {
      const users = await User.find({ role: 'user' });
      expect(users).toHaveLength(1);
      expect(users[0].role).toBe('user');
    });

    it('should count users', async () => {
      const count = await User.countDocuments();
      expect(count).toBe(3);
    });
  });
});
