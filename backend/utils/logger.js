const winston = require('winston');
const path = require('path');
const fs = require('fs');

// Create logs directory if it doesn't exist
const logsDir = path.join(__dirname, '../logs');
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir);
}

// Define log format
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.json()
);

// Define console format for development
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf(({ timestamp, level, message, ...meta }) => {
    let msg = `${timestamp} [${level}]: ${message}`;
    if (Object.keys(meta).length > 0) {
      msg += ` ${JSON.stringify(meta)}`;
    }
    return msg;
  })
);

// Create Winston logger
const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: { service: 'happytails-api' },
  transports: [
    // Error logs - only errors
    new winston.transports.File({
      filename: path.join(logsDir, 'error.log'),
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Combined logs - all levels
    new winston.transports.File({
      filename: path.join(logsDir, 'combined.log'),
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    
    // Warning logs
    new winston.transports.File({
      filename: path.join(logsDir, 'warn.log'),
      level: 'warn',
      maxsize: 5242880, // 5MB
      maxFiles: 3,
    }),
  ],
  
  // Handle exceptions and rejections
  exceptionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'exceptions.log'),
    }),
  ],
  rejectionHandlers: [
    new winston.transports.File({
      filename: path.join(logsDir, 'rejections.log'),
    }),
  ],
});

// Add console transport for development
if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new winston.transports.Console({
      format: consoleFormat,
    })
  );
}

// Create a stream object for Morgan
logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

/**
 * Log API request
 */
const logRequest = (req, duration) => {
  logger.info('API Request', {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('user-agent'),
    duration: `${duration}ms`,
    userId: req.user?.uid || 'guest',
  });
};

/**
 * Log API response
 */
const logResponse = (req, res, duration) => {
  const logData = {
    method: req.method,
    url: req.originalUrl,
    statusCode: res.statusCode,
    duration: `${duration}ms`,
    userId: req.user?.uid || 'guest',
  };

  if (res.statusCode >= 500) {
    logger.error('API Response - Server Error', logData);
  } else if (res.statusCode >= 400) {
    logger.warn('API Response - Client Error', logData);
  } else {
    logger.info('API Response', logData);
  }
};

/**
 * Log database query
 */
const logQuery = (query, duration) => {
  logger.debug('Database Query', {
    query: query.toString(),
    duration: `${duration}ms`,
  });
};

/**
 * Log slow query
 */
const logSlowQuery = (query, duration) => {
  logger.warn('Slow Database Query', {
    query: query.toString(),
    duration: `${duration}ms`,
    threshold: '100ms',
  });
};

/**
 * Log authentication attempt
 */
const logAuth = (type, success, userId, ip) => {
  const logData = {
    type,
    success,
    userId,
    ip,
  };

  if (success) {
    logger.info('Authentication Success', logData);
  } else {
    logger.warn('Authentication Failed', logData);
  }
};

/**
 * Log security event
 */
const logSecurity = (event, details) => {
  logger.warn('Security Event', {
    event,
    ...details,
  });
};

/**
 * Log rate limit exceeded
 */
const logRateLimit = (req) => {
  logger.warn('Rate Limit Exceeded', {
    ip: req.ip,
    url: req.originalUrl,
    userAgent: req.get('user-agent'),
  });
};

/**
 * Log external service call
 */
const logExternalService = (service, action, success, duration) => {
  const logData = {
    service,
    action,
    success,
    duration: duration ? `${duration}ms` : undefined,
  };

  if (success) {
    logger.info('External Service Call', logData);
  } else {
    logger.error('External Service Failed', logData);
  }
};

/**
 * Log system event
 */
const logSystem = (event, details) => {
  logger.info('System Event', {
    event,
    ...details,
  });
};

module.exports = {
  logger,
  logRequest,
  logResponse,
  logQuery,
  logSlowQuery,
  logAuth,
  logSecurity,
  logRateLimit,
  logExternalService,
  logSystem,
};
