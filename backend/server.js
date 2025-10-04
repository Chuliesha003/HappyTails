const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const { initializeFirebase } = require('./config/firebase');
const { initializeGemini } = require('./utils/geminiService');
const { errorHandler, notFound } = require('./middleware/errorHandler');
const { sanitize } = require('./middleware/validator');

const app = express();

// Connect to MongoDB
connectDB();

// Initialize Firebase
initializeFirebase();

// Initialize Gemini AI
initializeGemini();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Sanitization middleware
app.use(sanitize);

// Basic health check route
app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'HappyTails API is running',
    version: '1.0.0',
  });
});

// API health check
app.get('/api/health', (req, res) => {
  res.json({
    success: true,
    message: 'API is healthy',
    timestamp: new Date().toISOString(),
  });
});

// API Routes
const authRoutes = require('./routes/authRoutes');
const petRoutes = require('./routes/petRoutes');
const vetRoutes = require('./routes/vetRoutes');
const appointmentRoutes = require('./routes/appointmentRoutes');
const symptomRoutes = require('./routes/symptomRoutes');
const resourceRoutes = require('./routes/resourceRoutes');
const adminRoutes = require('./routes/adminRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/pets', petRoutes);
app.use('/api/vets', vetRoutes);
app.use('/api/appointments', appointmentRoutes);
app.use('/api/symptom-checker', symptomRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/admin', adminRoutes);

// Test routes (for authentication testing)
const testRoutes = require('./routes/testRoutes');
app.use('/api', testRoutes);

// 404 handler - must be after all routes
app.use(notFound);

// Global error handling middleware - must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});
module.exports = app;
