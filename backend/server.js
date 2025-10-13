const express = require('express');
const path = require('path');
const cors = require('cors');
const helmet = require('helmet');
const swaggerUi = require('swagger-ui-express');
require('dotenv').config();

// Check for required environment variables
if (!process.env.GEMINI_API_KEY) {
  console.error('❌ Missing GEMINI_API_KEY in .env');
  process.exit(1);
}

const connectDB = require('./config/database');
const { initializeFirebase } = require('./config/firebase');
const { initializeGemini } = require('./utils/geminiService');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { sanitize } = require('./middleware/validator');
const { 
  generalLimiter, 
  sanitizeData, 
  configureTrustedProxy 
} = require('./middleware/security');
const { 
  requestLogger, 
  detailedLogger, 
  performanceMonitor 
} = require('./middleware/logging');
const { logger, logSystem } = require('./utils/logger');
const swaggerSpec = require('./config/swagger');

const app = express();

// Configure trusted proxy if behind reverse proxy
configureTrustedProxy(app);

// Connect to MongoDB
connectDB()
  .then(() => {
    logSystem('database_connection', {
      status: 'connected',
      database: 'MongoDB',
      environment: process.env.NODE_ENV || 'development',
    });
  })
  .catch((error) => {
    logSystem('database_connection', {
      status: 'failed',
      error: error.message,
      environment: process.env.NODE_ENV || 'development',
    });
  });

// Initialize Firebase
try {
  initializeFirebase();
  logSystem('firebase_initialized', {
    status: 'success',
    service: 'Firebase Admin SDK',
  });
} catch (error) {
  logSystem('firebase_initialized', {
    status: 'failed',
    error: error.message,
  });
}

// Initialize Gemini AI
try {
  initializeGemini();
  logSystem('gemini_initialized', {
    status: 'success',
    service: 'Google Gemini AI',
    model: 'gemini-pro',
  });
} catch (error) {
  logSystem('gemini_initialized', {
    status: 'failed',
    error: error.message,
  });
}

// Security Middleware
// Helmet - Sets various HTTP headers for security
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  crossOriginEmbedderPolicy: false,
}));

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:8080', 'http://localhost:3000', 'http://localhost:5173'];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (mobile apps, Postman, etc.)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) === -1) {
      const msg = 'The CORS policy for this site does not allow access from the specified origin.';
      return callback(new Error(msg), false);
    }
    return callback(null, true);
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  exposedHeaders: ['RateLimit-Limit', 'RateLimit-Remaining', 'RateLimit-Reset'],
}));

// Body parser middleware with size limits
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Data sanitization against NoSQL injection
app.use(sanitizeData);

// Input validation sanitization
app.use(sanitize);

// Logging middleware (before routes)
app.use(requestLogger);
app.use(detailedLogger);
app.use(performanceMonitor);

// Apply general rate limiting to all routes
app.use(generalLimiter);

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HappyTails API is running',
    version: '1.0.0',
  });
});

// API health check with system metrics
app.get('/api/health', (req, res) => {
  const healthInfo = {
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV || 'development',
    memory: {
      total: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + ' MB',
      used: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + ' MB',
    },
    version: '1.0.0',
  };

  // Log health check if not in production (to avoid log spam)
  if (process.env.NODE_ENV !== 'production') {
    logSystem('health_check', healthInfo);
  }

  res.json(healthInfo);
});

// API Documentation with Swagger
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'HappyTails API Documentation',
}));

// Swagger JSON endpoint
app.get('/api-docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const vetRoutes = require('./routes/vetRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const adminRoutes = require('./routes/adminRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const reviewRoutes = require('./routes/reviewRoutes');
const aiRoutes = require('./routes/aiRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/symptom-checker', symptomRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/ai', aiRoutes);

// Test routes (for authentication testing)
const testRoutes = require('./routes/testRoutes');
app.use('/api', testRoutes);

// Static file serving for uploads
app.use('/uploads', express.static(path.join(__dirname, 'public', 'uploads')));

// 404 handler - must be after all routes
app.use(notFound);

// Global error handling middleware - must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`🌐 Access the API at: http://localhost:${PORT}`);
  console.log("✅ GEMINI API loaded:", !!process.env.GEMINI_API_KEY);

  
  // Log server startup
  logSystem('server_started', {
    port: PORT,
    environment: process.env.NODE_ENV || 'development',
    nodeVersion: process.version,
    platform: process.platform,
    timestamp: new Date().toISOString(),
  });
});

// Handle server errors
server.on('error', (error) => {
  console.error('❌ Server error:', error);
  if (error.code === 'EADDRINUSE') {
    console.error(`❌ Port ${PORT} is already in use. Please close the other process or use a different port.`);
  }
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
  process.exit(1);
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  console.error('❌ Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

module.exports = app;
