# Firebase Authentication Setup Guide

## Overview
This backend uses Firebase Admin SDK for user authentication. Firebase handles user registration, login, password management, and provides secure JWT tokens.

## Prerequisites
- Firebase project created at https://console.firebase.google.com
- Firebase Authentication enabled in your project

## Setup Steps

### 1. Create a Firebase Project
1. Go to https://console.firebase.google.com
2. Click "Add project"
3. Enter project name (e.g., "HappyTails")
4. Follow the setup wizard

### 2. Enable Authentication
1. In Firebase Console, go to **Authentication** → **Sign-in method**
2. Enable **Email/Password** authentication
3. (Optional) Enable other providers if needed

### 3. Generate Service Account Credentials
1. Go to **Project Settings** (gear icon) → **Service Accounts**
2. Click **Generate new private key**
3. Save the downloaded JSON file securely (e.g., `firebase-service-account.json`)
4. **IMPORTANT:** Never commit this file to version control

### 4. Configure Environment Variables

Open your `.env` file and update these values:

```env
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYourActualPrivateKeyHere\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxxxx@your-project.iam.gserviceaccount.com
```

#### Finding Your Credentials in the Service Account JSON:
```json
{
  "project_id": "<-- Copy to FIREBASE_PROJECT_ID",
  "private_key": "<-- Copy to FIREBASE_PRIVATE_KEY (keep quotes and \n characters)",
  "client_email": "<-- Copy to FIREBASE_CLIENT_EMAIL"
}
```

**IMPORTANT:** The private key must be in quotes and keep the `\n` characters. Example:
```
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG...\n-----END PRIVATE KEY-----\n"
```

## Testing Authentication

### 1. Register a User (Frontend)
Use Firebase Client SDK in your frontend:
```javascript
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

const auth = getAuth();
const userCredential = await createUserWithEmailAndPassword(auth, email, password);
const idToken = await userCredential.user.getIdToken();
```

### 2. Send Token to Backend
Include the token in Authorization header:
```javascript
fetch('http://localhost:5000/api/protected-route', {
  headers: {
    'Authorization': `Bearer ${idToken}`
  }
})
```

### 3. Protected Routes Example
```javascript
const { verifyToken } = require('./middleware/auth');

router.get('/api/user/profile', verifyToken, (req, res) => {
  // req.user contains { uid, email, emailVerified }
  res.json({ user: req.user });
});
```

## Middleware Usage

### Required Authentication (verifyToken)
Use for routes that require a logged-in user:
```javascript
const { verifyToken } = require('./middleware/auth');

router.post('/api/pets', verifyToken, petController.createPet);
```

### Optional Authentication (optionalAuth)
Use for routes that work for both guests and authenticated users:
```javascript
const { optionalAuth } = require('./middleware/auth');

router.get('/api/symptom-checker', optionalAuth, symptomController.analyze);
// req.user will be null for guests, or contain user info if authenticated
```

### Role-Based Access (checkRole)
Use for admin-only routes (implement after User model is created):
```javascript
const { verifyToken, checkRole } = require('./middleware/auth');

router.delete('/api/admin/users/:id', verifyToken, checkRole('admin'), adminController.deleteUser);
```

## Troubleshooting

### Error: "Firebase configuration incomplete"
- Check that all three Firebase environment variables are set correctly
- Verify private key is properly escaped with `\n` characters

### Error: "Token verification failed"
- Token may be expired (default: 1 hour)
- User needs to refresh their token on frontend
- Check that Firebase project ID matches

### Error: "auth/id-token-expired"
- User needs to sign in again to get a new token
- Implement token refresh logic on frontend

### Error: "auth/argument-error"
- Token format is invalid
- Ensure Authorization header is: `Bearer <token>`

## Security Best Practices

1. **Never commit** `firebase-service-account.json` or `.env` files
2. Use HTTPS in production
3. Implement token refresh logic on frontend
4. Set appropriate CORS origins
5. Use rate limiting for authentication endpoints
6. Validate user input before processing
7. Log authentication attempts for security monitoring

## Next Steps

After completing this setup:
1. Create User model in `models/User.js`
2. Create authentication routes in `routes/authRoutes.js`
3. Test registration and login flow
4. Implement role-based access control
