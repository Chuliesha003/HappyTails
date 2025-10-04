const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const { verifyToken, optionalAuth } = require('../middleware/auth');
const { authLimiter } = require('../middleware/security');

/**
 * @route   POST /api/auth/register
 * @desc    Register new user or login existing user
 * @access  Public
 * @body    { idToken: string, fullName?: string }
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
