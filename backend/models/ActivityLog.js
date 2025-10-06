const mongoose = require('mongoose');

/**
 * ActivityLog Schema
 * 
 * Purpose: Track admin actions and system events for audit trail
 * 
 * Data Flow:
 * 1. Admin performs action (create, update, delete)
 * 2. Middleware/controller logs action
 * 3. Stored in this collection
 * 4. Admin can view activity history
 * 5. Used for security, compliance, debugging
 */

const activityLogSchema = new mongoose.Schema(
  {
    // User who performed the action
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    
    // Action performed
    action: {
      type: String,
      required: [true, 'Action is required'],
      index: true,
      enum: [
        'create',
        'update',
        'delete',
        'login',
        'logout',
        'register',
        'password_reset',
        'role_change',
        'approve',
        'reject',
        'suspend',
        'activate',
        'export',
        'import',
        'other',
      ],
    },
    
    // Target model being acted upon
    targetModel: {
      type: String,
      enum: ['User', 'Pet', 'Vet', 'Appointment', 'Article', 'Review', 'SymptomCheck', 'Notification'],
      index: true,
    },
    
    // Target document ID
    targetId: {
      type: mongoose.Schema.Types.ObjectId,
    },
    
    // Changes made (for update actions)
    changes: {
      before: {
        type: mongoose.Schema.Types.Mixed, // Any structure
      },
      after: {
        type: mongoose.Schema.Types.Mixed,
      },
    },
    
    // Request metadata
    metadata: {
      ipAddress: {
        type: String,
      },
      userAgent: {
        type: String,
      },
      method: {
        type: String, // HTTP method (GET, POST, PUT, DELETE)
      },
      endpoint: {
        type: String, // API endpoint called
      },
      statusCode: {
        type: Number, // HTTP response code
      },
    },
    
    // Human-readable description
    description: {
      type: String,
      trim: true,
      maxlength: [500, 'Description cannot exceed 500 characters'],
    },
    
    // Severity level (for filtering important events)
    severity: {
      type: String,
      enum: ['info', 'warning', 'error', 'critical'],
      default: 'info',
      index: true,
    },
    
    // Tags for categorization
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
    
    // Error details if action failed
    error: {
      message: String,
      stack: String,
      code: String,
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false }, // Only track creation time
  }
);

// Indexes for efficient queries
activityLogSchema.index({ user: 1, createdAt: -1 });
activityLogSchema.index({ action: 1, createdAt: -1 });
activityLogSchema.index({ targetModel: 1, targetId: 1, createdAt: -1 });
activityLogSchema.index({ severity: 1, createdAt: -1 });
activityLogSchema.index({ createdAt: -1 }); // For recent activity feed
activityLogSchema.index({ 'metadata.ipAddress': 1 }); // For security tracking

// TTL index to auto-delete old logs (optional - keeps last 90 days)
// activityLogSchema.index({ createdAt: 1 }, { expireAfterSeconds: 90 * 24 * 60 * 60 });

// Static method to log activity
activityLogSchema.statics.logActivity = async function (data) {
  try {
    const log = new this(data);
    await log.save();
    return log;
  } catch (error) {
    // Don't throw error - logging should never break the app
    console.error('Failed to log activity:', error);
    return null;
  }
};

// Static method to get user's activity
activityLogSchema.statics.getUserActivity = function (userId, options = {}) {
  const { limit = 50, skip = 0, action = null } = options;
  
  const query = { user: userId };
  if (action) query.action = action;
  
  return this.find(query)
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .exec();
};

// Static method to get recent activity (for admin dashboard)
activityLogSchema.statics.getRecentActivity = function (limit = 100) {
  return this.find()
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'fullName email role')
    .exec();
};

// Static method to get activity by model
activityLogSchema.statics.getModelActivity = function (modelName, modelId, limit = 50) {
  return this.find({ targetModel: modelName, targetId: modelId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'fullName email')
    .exec();
};

// Static method to get security events
activityLogSchema.statics.getSecurityEvents = function (options = {}) {
  const { limit = 100, severity = 'warning' } = options;
  
  return this.find({
    $or: [
      { action: { $in: ['login', 'logout', 'password_reset', 'role_change'] } },
      { severity: { $in: [severity, 'error', 'critical'] } },
    ],
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'fullName email role')
    .exec();
};

// Static method to get statistics
activityLogSchema.statics.getStatistics = async function (startDate, endDate) {
  const match = {
    createdAt: {
      $gte: startDate || new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // Default: last 30 days
      $lte: endDate || new Date(),
    },
  };
  
  const stats = await this.aggregate([
    { $match: match },
    {
      $group: {
        _id: '$action',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
  ]);
  
  const totalCount = await this.countDocuments(match);
  
  return {
    totalActions: totalCount,
    actionBreakdown: stats,
  };
};

// Helper method to format log for display
activityLogSchema.methods.toDisplayFormat = function () {
  return {
    id: this._id,
    user: this.user,
    action: this.action,
    target: this.targetModel && this.targetId ? `${this.targetModel}/${this.targetId}` : null,
    description: this.description || `${this.action} ${this.targetModel || ''}`.trim(),
    severity: this.severity,
    timestamp: this.createdAt,
    ipAddress: this.metadata?.ipAddress,
  };
};

const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

module.exports = ActivityLog;
