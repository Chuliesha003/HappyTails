const rateLimit = require('express-rate-limit');
const mongoSanitize = require('express-mongo-sanitize');

/**
 * General API rate limiter
 * Applies to all requests
 */
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disable the `X-RateLimit-*` headers
  skipSuccessfulRequests: false,
  skipFailedRequests: false,
});

/**
 * Strict rate limiter for authentication endpoints
 * Prevents brute force attacks
 */
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: {
    success: false,
    message: 'Too many authentication attempts. Please try again after 15 minutes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // Don't count successful logins
});

/**
 * Rate limiter for AI/symptom checker endpoints
 * More restrictive to prevent API abuse
 */
const aiLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 10, // Limit each IP to 10 requests per hour
  message: {
    success: false,
    message: 'AI service usage limit exceeded. Please try again in an hour.',
  },
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: false,
});

/**
 * Rate limiter for resource-intensive operations
 * Like searches, filters, etc.
 */
const searchLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30, // Limit each IP to 30 requests per minute
  message: {
    success: false,
    message: 'Too many search requests. Please slow down.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for admin operations
 * More lenient for admin users
 */
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200, // Higher limit for admins
  message: {
    success: false,
    message: 'Admin rate limit exceeded. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * Rate limiter for creating resources
 * Prevents spam
 */
const createLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 20, // Limit to 20 creates per hour
  message: {
    success: false,
    message: 'Too many resources created. Please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

/**
 * MongoDB injection protection
 * Sanitizes user input to prevent NoSQL injection
 */
const sanitizeData = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`⚠️  Sanitized key "${key}" in request from ${req.ip}`);
  },
});

/**
 * Trusted proxy configuration
 * If behind a reverse proxy (Nginx, Cloudflare, etc.)
 */
const configureTrustedProxy = (app) => {
  if (process.env.TRUST_PROXY === 'true') {
    app.set('trust proxy', 1);
    console.log('✅ Trusted proxy enabled');
  }
};

module.exports = {
  generalLimiter,
  authLimiter,
  aiLimiter,
  searchLimiter,
  adminLimiter,
  createLimiter,
  sanitizeData,
  configureTrustedProxy,
};
