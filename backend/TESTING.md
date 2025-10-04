# Testing Guide for HappyTails Backend

## Overview

This document describes the testing setup and guidelines for the HappyTails backend API.

## Testing Stack

- **Jest**: Testing framework
- **Supertest**: HTTP assertions for integration tests
- **MongoDB Memory Server**: In-memory MongoDB for isolated testing
- **@types/jest**: TypeScript definitions for Jest

## Test Structure

```
tests/
├── setup.js                    # Global test configuration
├── helpers/
│   └── db.js                   # Database helper functions
├── unit/
│   └── user.model.test.js      # Unit tests for models
└── integration/
    └── auth.api.test.js        # Integration tests for API endpoints
```

## Running Tests

```bash
# Run all tests with coverage
npm test

# Run tests in watch mode
npm run test:watch

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Run tests in CI environment
npm run test:ci
```

## Test Configuration

### Jest Configuration (`jest.config.js`)

- **Test Environment**: Node.js
- **Coverage Threshold**: 70% for branches, functions, lines, and statements
- **Test Timeout**: 30 seconds
- **Coverage Output**: Text, LCOV, HTML, JSON

### Environment Variables (`.env.test`)

Test-specific environment variables with mocked values:
- MongoDB: Overridden by mongodb-memory-server
- Firebase: Mocked in test setup
- Gemini AI: Mocked in test setup

## Test Setup (`tests/setup.js`)

### Mocked Services

1. **Firebase Admin SDK**: Mocked authentication
   - `valid-token` returns successful verification
   - Any other token returns authentication error

2. **Google Generative AI**: Mocked symptom analysis
   - Returns predefined symptom analysis response

### Global Test Utilities

```javascript
global.testUtils = {
  generateMockToken: () => 'valid-token',
  generateInvalidToken: () => 'invalid-token',
  mockUser: { uid: 'test-uid-123', email: 'test@example.com', ...},
  mockVet: { uid: 'test-vet-uid', email: 'vet@example.com', ...},
  mockAdmin: { uid: 'test-admin-uid', email: 'admin@example.com', ...},
};
```

## Database Helpers (`tests/helpers/db.js`)

### Functions

- `connect()`: Connect to in-memory MongoDB
- `closeDatabase()`: Close connection and stop MongoDB instance
- `clearDatabase()`: Clear all collections
- `seedTestData()`: Seed database with test data

### Usage Example

```javascript
describe('My Test Suite', () => {
  beforeAll(async () => {
    await connect();
  });

  afterEach(async () => {
    await clearDatabase();
  });

  afterAll(async () => {
    await closeDatabase();
  });

  it('should test something', async () => {
    const testData = await seedTestData();
    // ... test logic
  });
});
```

## Writing Tests

### Unit Tests (Models)

Unit tests should test model validation, defaults, methods, and virtuals in isolation.

**Example Structure:**

```javascript
const Model = require('../../models/Model');
const { connect, closeDatabase, clearDatabase } = require('../helpers/db');

describe('Model Tests', () => {
  beforeAll(async () => await connect());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  describe('Creation', () => {
    it('should create with valid data', async () => {
      const item = await Model.create({ /* data */ });
      expect(item).toBeDefined();
    });

    it('should fail without required fields', async () => {
      await expect(Model.create({})).rejects.toThrow();
    });
  });

  describe('Validation', () => {
    // Validation tests
  });

  describe('Methods', () => {
    // Instance method tests
  });
});
```

### Integration Tests (API Endpoints)

Integration tests should test the complete request/response cycle including middleware, controllers, and database operations.

**Example Structure:**

```javascript
const request = require('supertest');
const app = require('../../server');
const { connect, closeDatabase, clearDatabase, seedTestData } = require('../helpers/db');

describe('API Endpoint Tests', () => {
  beforeAll(async () => await connect());
  afterEach(async () => await clearDatabase());
  afterAll(async () => await closeDatabase());

  describe('GET /api/resource', () => {
    it('should return resources', async () => {
      await seedTestData();

      const response = await request(app)
        .get('/api/resource')
        .set('Authorization', 'Bearer valid-token')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toBeDefined();
    });

    it('should require authentication', async () => {
      await request(app)
        .get('/api/resource')
        .expect(401);
    });
  });
});
```

## Coverage

Coverage reports are generated in the `coverage/` directory:
- `coverage/lcov-report/index.html`: Interactive HTML report
- `coverage/lcov.info`: LCOV format for CI tools
- `coverage/coverage-summary.json`: JSON summary

View coverage:
```bash
npm test
# Then open coverage/lcov-report/index.html in a browser
```

## Current Test Status

### Implemented Tests

1. **Unit Tests**
   - User Model Tests (22 test cases)
     - User creation with valid/invalid data
     - Role validation
     - Status management
     - Field updates
     - Deletion
     - Queries

2. **Integration Tests**
   - Authentication API Tests (17 test cases)
     - User registration/login
     - Profile retrieval
     - Profile updates
     - Account deletion
     - Rate limiting
     - Health checks

### Known Issues

1. **Model Schema Mismatch**: Test data needs to be updated to match actual model fields:
   - User model uses `firebaseUid` not `uid`
   - User model requires `fullName`

2. **MongoDB Memory Server Timeout**: Integration tests timeout during database setup
   - Need to increase timeout or optimize setup

3. **Server Import Issue**: Server starts when imported in tests
   - Need to separate server creation from server start
   - Export app without listening

### To Do

1. Fix User model tests to use correct field names
2. Optimize MongoDB Memory Server connection
3. Separate Express app from server listening
4. Add tests for:
   - Pet model and API
   - Vet model and API
   - Appointment model and API
   - Symptom checker
   - Resource/Article management
   - Admin endpoints
   - Middleware (auth, validation, security)
   - Utility functions
   - Error handlers

5. Increase code coverage to 70%+

## Best Practices

1. **Isolation**: Each test should be independent
2. **Cleanup**: Always clean up after tests (close connections, clear data)
3. **Descriptive Names**: Use clear, descriptive test names
4. **Arrange-Act-Assert**: Follow AAA pattern
5. **Mock External Services**: Don't make real API calls
6. **Test Edge Cases**: Include error scenarios, edge cases, and happy paths
7. **Use Factories**: Create test data factories for complex objects
8. **Async/Await**: Use async/await for cleaner async tests

## CI/CD Integration

The test suite is configured for CI/CD with:
- `npm run test:ci`: Optimized for CI environments
- Coverage reports in multiple formats
- Exit on completion
- Limited workers for resource constraints

### GitHub Actions Example

```yaml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test:ci
      - uses: codecov/codecov-action@v2
        with:
          file: ./coverage/lcov.info
```

## Debugging Tests

### Debug Single Test

```bash
# Run specific test file
npm test -- user.model.test.js

# Run specific test by name
npm test -- -t "should create a new user"
```

### Debug with Node Inspector

```bash
node --inspect-brk node_modules/.bin/jest --runInBand
```

### Verbose Output

```bash
npm test -- --verbose
```

### Watch Mode

```bash
npm run test:watch
```

## Resources

- [Jest Documentation](https://jestjs.io/docs/getting-started)
- [Supertest Documentation](https://github.com/visionmedia/supertest)
- [MongoDB Memory Server](https://github.com/nodkz/mongodb-memory-server)
- [Testing Best Practices](https://github.com/goldbergyoni/javascript-testing-best-practices)

## Support

For questions or issues with tests:
- Check this documentation
- Review existing tests for examples
- Consult Jest/Supertest documentation
- Ask team for help

---

**Note**: Testing is an ongoing process. Continue to add tests as new features are developed and aim to maintain >70% code coverage.
