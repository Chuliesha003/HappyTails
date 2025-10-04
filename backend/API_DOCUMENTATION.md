# HappyTails API Documentation

## Overview

The HappyTails API is a comprehensive RESTful API for pet care management, providing endpoints for:

- 🔐 User authentication and authorization
- 🐕 Pet records management
- 👨‍⚕️ Veterinarian profiles and search
- 📅 Appointment booking and management
- 🤖 AI-powered symptom analysis
- 📚 Educational resources and articles
- 🛡️ Admin dashboard and system management

## Base URL

- **Development**: `http://localhost:5000`
- **Production**: `https://api.happytails.com`

## Interactive Documentation

Access the interactive Swagger UI documentation at:

```
http://localhost:5000/api-docs
```

## Authentication

The API uses Firebase Authentication with JWT (JSON Web Tokens). Include the Firebase ID token in the Authorization header for protected endpoints:

```
Authorization: Bearer <your-firebase-id-token>
```

### Getting a Firebase ID Token

1. Authenticate with Firebase on the frontend
2. Get the ID token: `await user.getIdToken()`
3. Include it in API requests

### Example Request

```bash
curl -H "Authorization: Bearer eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk3..." \
  http://localhost:5000/api/auth/me
```

## Rate Limiting

The API implements rate limiting to prevent abuse:

| Endpoint Type | Limit |
|---------------|-------|
| General API | 100 requests per 15 minutes |
| Authentication | 5 requests per 15 minutes |
| AI/Symptom Checker | 10 requests per hour |
| Search | 30 requests per minute |
| Admin | 200 requests per 15 minutes |
| Create Operations | 20 requests per hour |

Rate limit information is included in response headers:
- `RateLimit-Limit`: Maximum requests allowed
- `RateLimit-Remaining`: Requests remaining
- `RateLimit-Reset`: Time when the limit resets

## Endpoints Summary

### Authentication (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/register` | Register new user or login | No |
| POST | `/login` | Login user (alias for register) | No |
| GET | `/me` | Get current user profile | Yes |
| PUT | `/profile` | Update user profile | Yes |
| DELETE | `/account` | Delete user account | Yes |
| GET | `/guest-limit` | Check guest usage limit | No |

### Pets (`/api/pets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all pets for current user | Yes |
| POST | `/` | Create new pet record | Yes |
| GET | `/:id` | Get specific pet by ID | Yes |
| PUT | `/:id` | Update pet information | Yes (Owner) |
| DELETE | `/:id` | Delete pet record | Yes (Owner) |
| POST | `/:id/medical-history` | Add medical history entry | Yes (Owner) |
| POST | `/:id/vaccinations` | Add vaccination record | Yes (Owner) |
| PUT | `/:id/weight` | Update pet weight | Yes (Owner) |

### Veterinarians (`/api/vets`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all veterinarians (with filters) | No |
| POST | `/` | Create vet profile | Yes (Vet) |
| GET | `/:id` | Get specific vet by ID | No |
| PUT | `/:id` | Update vet profile | Yes (Vet Owner) |
| DELETE | `/:id` | Delete vet profile | Yes (Vet Owner) |
| GET | `/search` | Search vets by criteria | No |
| PUT | `/:id/availability` | Update vet availability | Yes (Vet Owner) |
| POST | `/:id/reviews` | Add vet review | Yes |

### Appointments (`/api/appointments`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Get all appointments for user | Yes |
| POST | `/` | Book new appointment | Yes |
| GET | `/:id` | Get specific appointment | Yes |
| PUT | `/:id` | Update appointment | Yes |
| DELETE | `/:id` | Cancel appointment | Yes |
| PATCH | `/:id/status` | Update appointment status | Yes (Vet) |
| GET | `/vet/:vetId` | Get appointments for vet | Yes (Vet) |
| GET | `/upcoming` | Get upcoming appointments | Yes |

### Symptom Checker (`/api/symptom-checker`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/analyze` | Analyze pet symptoms with AI | No (Rate Limited) |
| POST | `/analyze-auth` | Analyze symptoms (authenticated) | Yes |

### Resources (`/api/resources`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/articles` | Get all published articles | No |
| POST | `/articles` | Create new article | Yes (Vet/Admin) |
| GET | `/articles/:id` | Get specific article | No |
| PUT | `/articles/:id` | Update article | Yes (Author/Admin) |
| DELETE | `/articles/:id` | Delete article | Yes (Author/Admin) |
| GET | `/articles/search` | Search articles | No |
| GET | `/articles/category/:category` | Get articles by category | No |
| PATCH | `/articles/:id/publish` | Publish article | Yes (Author/Admin) |

### Admin (`/api/admin`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/stats` | Get system statistics | Yes (Admin) |
| GET | `/users` | Get all users | Yes (Admin) |
| GET | `/users/:id` | Get specific user | Yes (Admin) |
| PUT | `/users/:id/role` | Update user role | Yes (Admin) |
| PATCH | `/users/:id/status` | Toggle user status | Yes (Admin) |
| DELETE | `/users/:id` | Delete user | Yes (Admin) |
| GET | `/appointments` | Get all appointments | Yes (Admin) |
| GET | `/vets` | Get all vets | Yes (Admin) |
| PATCH | `/vets/:id/verify` | Verify vet account | Yes (Admin) |
| GET | `/activity` | Get recent activity log | Yes (Admin) |

### Health Check

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/` | Root health check | No |
| GET | `/api/health` | Detailed health check | No |

## Response Format

### Success Response

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {
    // Response data
  }
}
```

### Error Response

```json
{
  "success": false,
  "status": "error",
  "message": "Error description",
  "error": {
    "statusCode": 400,
    "status": "error"
  },
  "stack": "Error stack trace (development only)"
}
```

### Validation Error Response

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

## Common Status Codes

| Code | Description |
|------|-------------|
| 200 | Success |
| 201 | Resource created successfully |
| 400 | Bad request (validation error) |
| 401 | Unauthorized (missing or invalid token) |
| 403 | Forbidden (insufficient permissions) |
| 404 | Resource not found |
| 409 | Conflict (duplicate resource) |
| 429 | Too many requests (rate limit exceeded) |
| 500 | Internal server error |

## Example Requests

### Register/Login User

```bash
POST /api/auth/register
Content-Type: application/json

{
  "idToken": "your-firebase-id-token",
  "fullName": "John Doe"
}
```

### Create Pet Record

```bash
POST /api/pets
Authorization: Bearer your-firebase-id-token
Content-Type: application/json

{
  "name": "Max",
  "species": "dog",
  "breed": "Golden Retriever",
  "birthDate": "2020-01-15",
  "gender": "male",
  "weight": 30.5,
  "allergies": ["peanuts"]
}
```

### Search Veterinarians

```bash
GET /api/vets?specialization=Surgery&isVerified=true&limit=10
```

### Book Appointment

```bash
POST /api/appointments
Authorization: Bearer your-firebase-id-token
Content-Type: application/json

{
  "pet": "pet-id",
  "vet": "vet-id",
  "appointmentDate": "2024-12-15T10:00:00Z",
  "reason": "Annual checkup",
  "type": "checkup",
  "notes": "First visit"
}
```

### Analyze Symptoms

```bash
POST /api/symptom-checker/analyze
Content-Type: application/json

{
  "petType": "dog",
  "age": 5,
  "symptoms": ["coughing", "lethargy", "loss of appetite"],
  "duration": "2 days",
  "severity": "moderate"
}
```

### Get Articles by Category

```bash
GET /api/resources/articles/category/nutrition?limit=10&page=1
```

## Security Features

### Input Sanitization

All user input is sanitized to prevent:
- NoSQL injection attacks
- XSS (Cross-Site Scripting)
- SQL injection (when applicable)

### Security Headers

The API uses Helmet.js to set security headers:
- Content Security Policy (CSP)
- X-Content-Type-Options
- X-Frame-Options
- X-XSS-Protection

### CORS

CORS is configured with a whitelist of allowed origins. Configure allowed origins in `.env`:

```
ALLOWED_ORIGINS=http://localhost:3000,http://localhost:5173,https://yourdomain.com
```

### Data Validation

All endpoints validate input data using express-validator with comprehensive validation rules.

## Error Handling

The API uses centralized error handling with custom error classes:

- `ValidationError`: Invalid input data (400)
- `AuthenticationError`: Authentication failed (401)
- `AuthorizationError`: Insufficient permissions (403)
- `NotFoundError`: Resource not found (404)
- `ConflictError`: Duplicate resource (409)
- `RateLimitError`: Rate limit exceeded (429)
- `DatabaseError`: Database operation failed (500)
- `ExternalServiceError`: External API failed (502)
- `InternalServerError`: Unexpected server error (500)

## Pagination

List endpoints support pagination with query parameters:

```bash
GET /api/resources/articles?page=1&limit=20
```

Response includes pagination metadata:

```json
{
  "success": true,
  "data": [...],
  "pagination": {
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 100,
    "itemsPerPage": 20,
    "hasNextPage": true,
    "hasPrevPage": false
  }
}
```

## Filtering and Sorting

Many endpoints support filtering and sorting:

```bash
# Filter
GET /api/vets?specialization=Surgery&isVerified=true

# Sort
GET /api/resources/articles?sortBy=createdAt&sortOrder=desc

# Combine
GET /api/appointments?status=scheduled&sortBy=appointmentDate&sortOrder=asc
```

## Environment Variables

Required environment variables:

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/happytails

# Firebase
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email

# AI Service
GEMINI_API_KEY=your-gemini-api-key

# Security
ALLOWED_ORIGINS=http://localhost:3000
TRUST_PROXY=false

# Logging
LOG_LEVEL=info
```

## Support

For API support or questions:
- Email: support@happytails.com
- Documentation: http://localhost:5000/api-docs
- GitHub: https://github.com/yourorg/happytails

## Changelog

### Version 1.0.0 (Current)
- Initial API release
- User authentication with Firebase
- Pet records management
- Vet profiles and search
- Appointment booking system
- AI-powered symptom checker
- Educational resources
- Admin dashboard
- Comprehensive security measures
- Logging and monitoring
- API documentation

---

**Note**: This is a development API. Always use HTTPS in production and never expose sensitive credentials.
