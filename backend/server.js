const express = require('express');
const cors = require('cors');
require('dotenv').config();
const connectDB = require('./config/database');
const { initializeFirebase } = require('./config/firebase');

const app = express();

// Connect to MongoDB
connectDB();

// Initialize Firebase
initializeFirebase();

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:8080',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
app.use('/api/auth', authRoutes);

// Test routes (for authentication testing)
const testRoutes = require('./routes/testRoutes');
app.use('/api', testRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`);
});

module.exports = app;
