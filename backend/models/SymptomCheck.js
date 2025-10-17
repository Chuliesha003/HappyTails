const mongoose = require('mongoose');

/**
 * SymptomCheck Schema
 * 
 * Purpose: Store AI-powered symptom analysis history
 * 
 * Data Flow:
 * 1. User submits symptoms via SymptomChecker form
 * 2. Frontend sends to POST /api/symptoms/check
 * 3. Backend calls Gemini AI for analysis
 * 4. Results saved in this collection
 * 5. User can view history in their dashboard
 */

const symptomCheckSchema = new mongoose.Schema(
  {
    // Reference to the user who submitted the symptom check
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      index: true,
      required: function() {
        // Required only if not a guest user
        return this.guestSession ? false : true;
      },
    },
    
    // Reference to the pet (if user selected one)
    pet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Pet',
      index: true,
    },
    
    // User's symptom description
    symptoms: {
      type: String,
      required: [true, 'Symptoms description is required'],
      trim: true,
      maxlength: [2000, 'Symptoms description cannot exceed 2000 characters'],
    },
    
    // Image URL if user uploaded a photo
    imageUrl: {
      type: String,
      trim: true,
    },
    
    // AI response from Gemini
    aiResponse: {
      // Possible conditions identified by AI
      possibleConditions: [
        {
          name: {
            type: String,
            required: true,
          },
          severity: {
            type: String,
            enum: ['low', 'moderate', 'high', 'emergency'],
            required: true,
          },
          confidence: {
            type: Number,
            min: 0,
            max: 100,
          },
          description: {
            type: String,
          },
          recommendations: [String],
        },
      ],
      
      // Overall urgency level
      urgencyLevel: {
        type: String,
        enum: ['low', 'medium', 'high', 'emergency'],
        required: true,
      },
      
      // General recommendations
      recommendations: [String],

      // Raw AI JSON (for traceability) - store the parsed JSON returned by Gemini
      rawAI: {
        type: Object,
      },
      
      // Medical disclaimer
      disclaimer: {
        type: String,
        default: 'This is an AI-powered analysis and should not replace professional veterinary advice. Please consult a licensed veterinarian for accurate diagnosis and treatment.',
      },
    },
    
    // Follow-up action taken
    followUpAction: {
      type: String,
      enum: ['none', 'monitor', 'schedule', 'emergency'],
      default: 'none',
    },
    
    // Whether user booked an appointment after this check
    appointmentBooked: {
      type: Boolean,
      default: false,
    },
    
    // Reference to appointment if booked
    relatedAppointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
    },
    
    // For guest users (before login)
    guestSession: {
      type: String,
      index: true,
    },
    
    // IP address for analytics and abuse prevention
    ipAddress: {
      type: String,
    },
  },
  {
    timestamps: true, // Auto-generate createdAt and updatedAt
  }
);

// Indexes for better query performance
symptomCheckSchema.index({ user: 1, createdAt: -1 });
symptomCheckSchema.index({ pet: 1, createdAt: -1 });
symptomCheckSchema.index({ guestSession: 1, createdAt: -1 });
symptomCheckSchema.index({ 'aiResponse.urgencyLevel': 1 });

// Virtual for calculating time since check
symptomCheckSchema.virtual('timeSince').get(function () {
  const now = new Date();
  const diff = now - this.createdAt;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days} day${days > 1 ? 's' : ''} ago`;
  if (hours > 0) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  return 'Just now';
});

// Method to check if urgent
symptomCheckSchema.methods.isUrgent = function () {
  return ['high', 'emergency'].includes(this.aiResponse.urgencyLevel);
};

// Static method to get user's recent checks
symptomCheckSchema.statics.getRecentChecks = function (userId, limit = 10) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('pet', 'name species breed')
    .exec();
};

// Static method to get urgent checks for admin dashboard
symptomCheckSchema.statics.getUrgentChecks = function (limit = 20) {
  return this.find({
    'aiResponse.urgencyLevel': { $in: ['high', 'emergency'] },
    appointmentBooked: false,
  })
    .sort({ createdAt: -1 })
    .limit(limit)
    .populate('user', 'fullName email')
    .populate('pet', 'name species')
    .exec();
};

const SymptomCheck = mongoose.model('SymptomCheck', symptomCheckSchema);

module.exports = SymptomCheck;
