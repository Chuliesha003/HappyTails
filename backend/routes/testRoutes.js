const { verifyToken, optionalAuth } = require('../middleware/auth');

/**
 * Test authentication middleware
 * This route demonstrates how to use authentication
 */
const router = require('express').Router();

// Test route for verifyToken middleware
router.get('/test/auth/required', verifyToken, (req, res) => {
  res.json({
    success: true,
    message: 'Authentication successful! You are logged in.',
    user: req.user,
  });
});

// Test route for optionalAuth middleware
router.get('/test/auth/optional', optionalAuth, (req, res) => {
  if (req.user) {
    res.json({
      success: true,
      message: 'Authenticated user detected',
      user: req.user,
      isGuest: false,
    });
  } else {
    res.json({
      success: true,
      message: 'Guest user - no authentication token provided',
      user: null,
      isGuest: true,
    });
  }
});

module.exports = router;
