const mongoose = require('mongoose');
const { logQuery, logSlowQuery } = require('../utils/logger');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);

    // Enable query logging in development
    if (process.env.NODE_ENV === 'development') {
      mongoose.set('debug', function (collectionName, method, query, doc) {
        const queryString = `${collectionName}.${method}`;
        logQuery(queryString, 0); // Duration tracked by Mongoose internally
      });
    }

    // Monitor slow queries
    mongoose.plugin((schema) => {
      schema.pre(/^find/, function () {
        this._startTime = Date.now();
      });

      schema.post(/^find/, function () {
        if (this._startTime) {
          const duration = Date.now() - this._startTime;
          if (duration > 100) { // Log queries taking more than 100ms
            const queryString = `${this.mongooseCollection.name}.find`;
            logSlowQuery(queryString, duration);
          }
        }
      });
    });

  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    
    // In development, don't exit - allow server to run without DB
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    } else {
      console.warn('⚠️  Running in development mode without database connection');
    }
  }
};

// Handle connection events
mongoose.connection.on('disconnected', () => {
  console.log('⚠️  MongoDB disconnected');
  const { logSystem } = require('../utils/logger');
  logSystem('database_disconnected', {
    timestamp: new Date().toISOString(),
  });
});

mongoose.connection.on('error', (err) => {
  if (process.env.NODE_ENV !== 'production') {
    console.warn(`⚠️  MongoDB error (development): ${err.message}`);
  } else {
    console.error(`❌ MongoDB error: ${err}`);
  }
  const { logSystem } = require('../utils/logger');
  logSystem('database_error', {
    error: err.message,
    environment: process.env.NODE_ENV || 'development',
  });
});

// Graceful shutdown - only handle explicit termination signals
// Remove this handler as it may be causing premature exits
// The server.js will handle its own shutdown gracefully
/*
process.on('SIGINT', async () => {
  try {
    await mongoose.connection.close();
    console.log('MongoDB connection closed due to app termination');
  } catch (error) {
    console.log('MongoDB connection already closed');
  }
  process.exit(0);
});
*/

module.exports = connectDB;
