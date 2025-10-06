const mongoose = require('mongoose');

/**
 * Review Schema
 * 
 * Purpose: User reviews and ratings for veterinarians
 * 
 * Data Flow:
 * 1. User completes appointment
 * 2. Frontend shows review form
 * 3. User submits rating and comment
 * 4. Stored in this collection
 * 5. Vet's average rating updated
 * 6. Reviews displayed on vet profile
 */

const reviewSchema = new mongoose.Schema(
  {
    // Veterinarian being reviewed
    vet: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Vet',
      required: [true, 'Veterinarian is required'],
      index: true,
    },
    
    // User who wrote the review
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User is required'],
      index: true,
    },
    
    // Related appointment (if review is post-appointment)
    appointment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Appointment',
      index: true,
    },
    
    // Rating (1-5 stars)
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
      index: true,
    },
    
    // Review comment
    comment: {
      type: String,
      trim: true,
      maxlength: [1000, 'Comment cannot exceed 1000 characters'],
    },
    
    // Specific ratings (optional detailed breakdown)
    detailedRatings: {
      professionalism: {
        type: Number,
        min: 1,
        max: 5,
      },
      communication: {
        type: Number,
        min: 1,
        max: 5,
      },
      facility: {
        type: Number,
        min: 1,
        max: 5,
      },
      value: {
        type: Number,
        min: 1,
        max: 5,
      },
    },
    
    // Vet's response to the review
    response: {
      text: {
        type: String,
        trim: true,
        maxlength: [500, 'Response cannot exceed 500 characters'],
      },
      respondedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      respondedAt: {
        type: Date,
      },
    },
    
    // Review verification (for completed appointments)
    isVerified: {
      type: Boolean,
      default: false,
      index: true,
    },
    
    // Review moderation
    isPublished: {
      type: Boolean,
      default: true,
      index: true,
    },
    
    // Reason if review is hidden
    moderationReason: {
      type: String,
      enum: ['spam', 'offensive', 'fake', 'duplicate', 'other'],
    },
    
    // Helpfulness votes
    helpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    notHelpful: {
      type: Number,
      default: 0,
      min: 0,
    },
    
    // Users who voted (to prevent duplicate voting)
    votes: [{
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
      type: {
        type: String,
        enum: ['helpful', 'not-helpful'],
      },
    }],
    
    // Tags for categorization
    tags: [{
      type: String,
      trim: true,
      lowercase: true,
    }],
  },
  {
    timestamps: true,
  }
);

// Compound indexes
reviewSchema.index({ vet: 1, isPublished: 1, createdAt: -1 });
reviewSchema.index({ user: 1, vet: 1 }, { unique: true }); // One review per user per vet
reviewSchema.index({ appointment: 1 }, { unique: true, sparse: true }); // One review per appointment

// Virtual for net helpful score
reviewSchema.virtual('helpfulScore').get(function () {
  return this.helpful - this.notHelpful;
});

// Method to add helpful vote
reviewSchema.methods.addHelpfulVote = async function (userId) {
  // Check if user already voted
  const existingVote = this.votes.find(v => v.user.toString() === userId.toString());
  
  if (existingVote) {
    if (existingVote.type === 'helpful') {
      return { success: false, message: 'Already voted as helpful' };
    }
    // Change from not-helpful to helpful
    existingVote.type = 'helpful';
    this.notHelpful = Math.max(0, this.notHelpful - 1);
    this.helpful += 1;
  } else {
    this.votes.push({ user: userId, type: 'helpful' });
    this.helpful += 1;
  }
  
  await this.save();
  return { success: true, message: 'Vote recorded' };
};

// Method to add not-helpful vote
reviewSchema.methods.addNotHelpfulVote = async function (userId) {
  const existingVote = this.votes.find(v => v.user.toString() === userId.toString());
  
  if (existingVote) {
    if (existingVote.type === 'not-helpful') {
      return { success: false, message: 'Already voted as not helpful' };
    }
    existingVote.type = 'not-helpful';
    this.helpful = Math.max(0, this.helpful - 1);
    this.notHelpful += 1;
  } else {
    this.votes.push({ user: userId, type: 'not-helpful' });
    this.notHelpful += 1;
  }
  
  await this.save();
  return { success: true, message: 'Vote recorded' };
};

// Static method to calculate vet's average rating
reviewSchema.statics.calculateVetRating = async function (vetId) {
  const result = await this.aggregate([
    { 
      $match: { 
        vet: mongoose.Types.ObjectId(vetId), 
        isPublished: true 
      } 
    },
    {
      $group: {
        _id: '$vet',
        averageRating: { $avg: '$rating' },
        count: { $sum: 1 },
      },
    },
  ]);
  
  if (result.length > 0) {
    // Update vet's rating
    const Vet = mongoose.model('Vet');
    await Vet.findByIdAndUpdate(vetId, {
      rating: Math.round(result[0].averageRating * 10) / 10, // Round to 1 decimal
      reviewCount: result[0].count,
    });
    
    return {
      rating: result[0].averageRating,
      count: result[0].count,
    };
  }
  
  return { rating: 0, count: 0 };
};

// Static method to get vet's reviews
reviewSchema.statics.getVetReviews = function (vetId, options = {}) {
  const { limit = 10, skip = 0, sort = 'recent' } = options;
  
  let sortObj = { createdAt: -1 }; // Default: most recent first
  
  if (sort === 'helpful') {
    sortObj = { helpful: -1, createdAt: -1 };
  } else if (sort === 'rating-high') {
    sortObj = { rating: -1, createdAt: -1 };
  } else if (sort === 'rating-low') {
    sortObj = { rating: 1, createdAt: -1 };
  }
  
  return this.find({ vet: vetId, isPublished: true })
    .sort(sortObj)
    .skip(skip)
    .limit(limit)
    .populate('user', 'fullName profileImage')
    .exec();
};

// Static method to get user's reviews
reviewSchema.statics.getUserReviews = function (userId) {
  return this.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate('vet', 'name clinicName profileImage')
    .exec();
};

// Post-save hook to update vet rating
reviewSchema.post('save', async function () {
  await this.constructor.calculateVetRating(this.vet);
});

// Post-remove hook to update vet rating
reviewSchema.post('remove', async function () {
  await this.constructor.calculateVetRating(this.vet);
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
