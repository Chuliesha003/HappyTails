# HappyTails Backend

Backend API for the HappyTails pet care application built with Node.js, Express, MongoDB, Firebase Authentication, and Gemini AI.

## Project Structure

```
backend/
├── config/          # Configuration files (database, firebase, etc.)
├── controllers/     # Route controllers
├── models/          # Mongoose models
├── routes/          # API routes
├── middleware/      # Custom middleware (auth, validation, etc.)
├── utils/           # Utility functions
├── server.js        # Application entry point
├── .env             # Environment variables (not committed)
└── package.json     # Dependencies and scripts
```

## Tech Stack

- **Node.js** - Runtime environment
- **Express** - Web framework
- **MongoDB** - Database
- **Mongoose** - ODM for MongoDB
- **Firebase Admin** - Authentication
- **Gemini API** - AI-powered symptom analysis
- **JWT** - Token-based authentication

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Firebase project with service account
- Gemini API key

### Installation

1. Install dependencies:
```bash
npm install
```

2. Set up Firebase Authentication:
   - Follow the detailed guide in `FIREBASE_SETUP.md`
   - Download service account credentials from Firebase Console
   - Configure environment variables with Firebase credentials

3. Create `.env` file with required variables (see Environment Variables section)

4. Start development server:
```bash
npm run dev
```

5. Test authentication setup:
   - Navigate to `http://localhost:5000/api/test/auth/optional` (should work without token)
   - Protected route: `http://localhost:5000/api/test/auth/required` (requires Firebase token)

## Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# Server
PORT=5000
NODE_ENV=development

# MongoDB
MONGODB_URI=your_mongodb_connection_string

# Firebase
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=your_private_key
FIREBASE_CLIENT_EMAIL=your_client_email

# Gemini API
GEMINI_API_KEY=your_gemini_api_key

# JWT
JWT_SECRET=your_jwt_secret
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Pets
- `GET /api/pets` - Get all pets for user
- `POST /api/pets` - Create new pet
- `PUT /api/pets/:id` - Update pet
- `DELETE /api/pets/:id` - Delete pet

### Veterinarians
- `GET /api/vets` - Get all vets (with search/filter)
- `GET /api/vets/:id` - Get vet by ID
- `POST /api/vets` - Create new vet (admin only)

### Appointments
- `GET /api/appointments` - Get user appointments
- `POST /api/appointments` - Book appointment
- `PUT /api/appointments/:id` - Update appointment
- `DELETE /api/appointments/:id` - Cancel appointment

### Symptom Checker
- `POST /api/symptoms/analyze` - Analyze pet symptoms with AI

### Resources
- `GET /api/resources` - Get all articles (filtered by category)
- `GET /api/resources/:id` - Get article by ID
- `POST /api/resources` - Create article (admin only)

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/stats` - Get dashboard statistics
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user

## Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm test` - Run tests

## License

ISC
