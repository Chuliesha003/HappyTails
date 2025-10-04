const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Register new user or login existing user
 *     description: Authenticates user with Firebase ID token and creates/updates user record in database
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idToken
 *             properties:
 *               idToken:
 *                 type: string
 *                 description: Firebase authentication ID token
 *                 example: eyJhbGciOiJSUzI1NiIsImtpZCI6Ijk3...
 *               fullName:
 *                 type: string
 *                 description: User's full name (optional, for first-time registration)
 *                 example: John Doe
 *     responses:
 *       200:
 *         description: User registered/logged in successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: User authenticated successfully
 *                 user:
 *                   $ref: '#/components/schemas/User'
 *       400:
 *         description: Invalid ID token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       429:
 *         description: Too many authentication attempts
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/register', authLimiter, authController.registerOrLogin);

/**
 * @route   POST /api/auth/login
 * @desc    Login user (same as register - Firebase handles auth)
 * @access  Public
 * @body    { idToken: string }
 */
router.post('/login', authLimiter, authController.registerOrLogin);

/**
 * @route   GET /api/auth/me
 * @desc    Get current authenticated user profile
 * @access  Private
 * @headers Authorization: Bearer <firebase-token>
 */
router.get('/me', verifyToken, authController.getCurrentUser);

/**
 * @route   PUT /api/auth/profile
 * @desc    Update user profile
 * @access  Private
 * @body    { fullName?: string, phoneNumber?: string, profileImage?: string }
 */
router.put('/profile', verifyToken, authController.updateProfile);

/**
 * @route   DELETE /api/auth/account
 * @desc    Delete/deactivate user account
 * @access  Private
 */
router.delete('/account', verifyToken, authController.deleteAccount);

/**
 * @route   GET /api/auth/guest-limit
 * @desc    Check guest usage limit for symptom checker
 * @access  Public (optional auth)
 */
router.get('/guest-limit', optionalAuth, authController.checkGuestLimit);

module.exports = router;
