const morgan = require('morgan');
const { logger, logResponse } = require('../utils/logger');

/**
 * Morgan middleware for HTTP request logging
 * Uses Winston stream for consistent logging
 */
const requestLogger = morgan(
  ':method :url :status :res[content-length] - :response-time ms',
  {
    stream: logger.stream,
    skip: (req, res) => {
      // Skip health check endpoints in production
      if (process.env.NODE_ENV === 'production') {
        return req.url === '/' || req.url === '/api/health';
      }
      return false;
    },
  }
);

/**
 * Custom request/response logging middleware
 * Tracks request timing and logs detailed information
 */
const detailedLogger = (req, res, next) => {
  const startTime = Date.now();

  // Log when response finishes
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    logResponse(req, res, duration);
  });

  next();
};

/**
 * Performance monitoring middleware
 * Logs slow requests
 */
const performanceMonitor = (req, res, next) => {
  const startTime = Date.now();

  res.on('finish', () => {
    const duration = Date.now() - startTime;
    
    // Log slow requests (> 1000ms)
    if (duration > 1000) {
      logger.warn('Slow Request Detected', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
      });
    }
    
    // Log very slow requests (> 3000ms) as errors
    if (duration > 3000) {
      logger.error('Very Slow Request', {
        method: req.method,
        url: req.originalUrl,
        duration: `${duration}ms`,
        statusCode: res.statusCode,
      });
    }
  });

  next();
};

/**
 * Error logging middleware
 * Should be placed after error handler
 */
const errorLogger = (err, req, res, next) => {
  logger.error('Unhandled Error', {
    error: err.message,
    stack: err.stack,
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userId: req.user?.uid || 'guest',
  });

  next(err);
};

module.exports = {
  requestLogger,
  detailedLogger,
  performanceMonitor,
  errorLogger,
};
