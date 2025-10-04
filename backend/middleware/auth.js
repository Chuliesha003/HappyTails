const { verifyIdToken } = require('../config/firebase');

/**
 * Middleware to verify Firebase authentication token
 * Extracts token from Authorization header and verifies it
 */
const verifyToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'No token provided. Authorization header must be in format: Bearer <token>',
      });
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
      });
    }

    // Verify the token with Firebase
    const decodedToken = await verifyIdToken(token);

    // Attach user information to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    console.error('Token verification error:', error.message);

    if (error.code === 'auth/id-token-expired') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please sign in again.',
      });
    }

    if (error.code === 'auth/argument-error') {
      return res.status(401).json({
        success: false,
        message: 'Invalid token format',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Invalid or expired token.',
    });
  }
};

/**
 * Middleware to verify user role
 * Must be used after verifyToken middleware
 */
const checkRole = (...allowedRoles) => {
  return async (req, res, next) => {
    try {
      const User = require('../models/User');
      
      if (!req.user || !req.user.uid) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required. Please log in.',
        });
      }

      // Fetch user from database to get role
      const user = await User.findByFirebaseUid(req.user.uid);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found in database.',
        });
      }

      // Check if user has required role
      if (!allowedRoles.includes(user.role)) {
        return res.status(403).json({
          success: false,
          message: `Access denied. Required roles: ${allowedRoles.join(', ')}. Your role: ${user.role}`,
        });
      }

      // Attach user role to request for later use
      req.userRole = user.role;
      req.userDoc = user;

      next();
    } catch (error) {
      console.error('Check role error:', error);
      return res.status(500).json({
        success: false,
        message: 'Failed to verify user role',
        error: error.message,
      });
    }
  };
};

/**
 * Middleware to optionally verify token (for routes that work for both authenticated and guest users)
 */
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      // No token provided, continue as guest
      req.user = null;
      return next();
    }

    const token = authHeader.split('Bearer ')[1];

    if (!token) {
      req.user = null;
      return next();
    }

    // Verify the token with Firebase
    const decodedToken = await verifyIdToken(token);

    // Attach user information to request object
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
      emailVerified: decodedToken.email_verified,
    };

    next();
  } catch (error) {
    // If token verification fails, continue as guest
    console.warn('Optional auth token verification failed:', error.message);
    req.user = null;
    next();
  }
};

module.exports = {
  verifyToken,
  checkRole,
  optionalAuth,
};
