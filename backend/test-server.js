// Test server startup
require('dotenv').config();

console.log('1. Loading dependencies...');
const express = require('express');
const connectDB = require('./config/database');

console.log('2. Creating Express app...');
const app = express();

console.log('3. Connecting to MongoDB...');
connectDB()
  .then(() => {
    console.log('4. MongoDB connected successfully');
    
    console.log('5. Starting server...');
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
      console.log(`6. ✅ Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('4. MongoDB connection failed:', error);
    process.exit(1);
  });

console.log('Script continues...');
