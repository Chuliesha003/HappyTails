const Review = require('../models/Review');
const User = require('../models/User');
const Vet = require('../models/Vet');
const Appointment = require('../models/Appointment');

/**
 * Create a new review for a vet
 */
const createReview = async (req, res) => {
  try {
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const { vetId, appointmentId, rating, comment, detailedRatings, tags } = req.body;

    // Validate required fields
    if (!vetId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'Vet ID and rating are required',
      });
    }

    // Validate rating range
    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        success: false,
        message: 'Rating must be between 1 and 5',
      });
    }

    // Check if vet exists
    const vet = await Vet.findById(vetId);
    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Vet not found',
      });
    }

    // Check if user already reviewed this vet
    const existingReview = await Review.findOne({ user: user._id, vet: vetId });
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this vet. Please update your existing review instead.',
      });
    }

    // If appointment ID provided, verify it exists and is completed
    let isVerified = false;
    if (appointmentId) {
      const appointment = await Appointment.findById(appointmentId);
      
      if (!appointment) {
        return res.status(404).json({
          success: false,
          message: 'Appointment not found',
        });
      }

      // Verify appointment belongs to user and vet
      if (appointment.user.toString() !== user._id.toString()) {
        return res.status(403).json({
          success: false,
          message: 'Unauthorized to review this appointment',
        });
      }

      if (appointment.vet.toString() !== vetId) {
        return res.status(400).json({
          success: false,
          message: 'Appointment is not with this vet',
        });
      }

      // Check if appointment is completed
      if (appointment.status === 'completed') {
        isVerified = true;
      }

      // Check if appointment already has a review
      const existingAppointmentReview = await Review.findOne({ appointment: appointmentId });
      if (existingAppointmentReview) {
        return res.status(400).json({
          success: false,
          message: 'This appointment has already been reviewed',
        });
      }
    }

    // Create review
    const reviewData = {
      vet: vetId,
      user: user._id,
      rating,
      comment,
      detailedRatings,
      tags,
      isVerified,
    };

    if (appointmentId) {
      reviewData.appointment = appointmentId;
    }

    const review = new Review(reviewData);
    await review.save();

    // Populate user and vet info for response
    await review.populate('user', 'fullName');
    await review.populate('vet', 'name specialization');

    res.status(201).json({
      success: true,
      review,
      message: 'Review submitted successfully',
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create review',
      error: error.message,
    });
  }
};

/**
 * Get all reviews for a vet
 */
const getVetReviews = async (req, res) => {
  try {
    const { vetId } = req.params;
    const { page = 1, limit = 10, sort = 'recent' } = req.query;

    // Check if vet exists
    const vet = await Vet.findById(vetId);
    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Vet not found',
      });
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort,
    };

    const reviews = await Review.getVetReviews(vetId, options);

    // Calculate rating summary
    const ratingStats = await Review.aggregate([
      { $match: { vet: vet._id, isPublished: true } },
      {
        $group: {
          _id: '$rating',
          count: { $sum: 1 },
        },
      },
    ]);

    const totalReviews = await Review.countDocuments({ vet: vetId, isPublished: true });

    res.status(200).json({
      success: true,
      reviews,
      stats: {
        averageRating: vet.rating || 0,
        totalReviews,
        ratingDistribution: ratingStats,
      },
      pagination: {
        page: options.page,
        limit: options.limit,
        total: totalReviews,
      },
    });
  } catch (error) {
    console.error('Get vet reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

/**
 * Get user's reviews
 */
const getUserReviews = async (req, res) => {
  try {
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const reviews = await Review.getUserReviews(user._id);

    res.status(200).json({
      success: true,
      reviews,
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch reviews',
      error: error.message,
    });
  }
};

/**
 * Update a review
 */
const updateReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Verify review belongs to user
    if (review.user.toString() !== user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to update this review',
      });
    }

    const { rating, comment, detailedRatings, tags } = req.body;

    // Update fields
    if (rating !== undefined) {
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          success: false,
          message: 'Rating must be between 1 and 5',
        });
      }
      review.rating = rating;
    }
    if (comment !== undefined) review.comment = comment;
    if (detailedRatings !== undefined) review.detailedRatings = detailedRatings;
    if (tags !== undefined) review.tags = tags;

    await review.save();

    res.status(200).json({
      success: true,
      review,
      message: 'Review updated successfully',
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update review',
      error: error.message,
    });
  }
};

/**
 * Delete a review
 */
const deleteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Verify review belongs to user or user is admin
    if (review.user.toString() !== user._id.toString() && user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to delete this review',
      });
    }

    await review.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully',
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete review',
      error: error.message,
    });
  }
};

/**
 * Vote on a review (helpful/not helpful)
 */
const voteReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { voteType } = req.body; // 'helpful' or 'not-helpful'
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    if (!['helpful', 'not-helpful'].includes(voteType)) {
      return res.status(400).json({
        success: false,
        message: 'Vote type must be "helpful" or "not-helpful"',
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Add vote
    if (voteType === 'helpful') {
      await review.addHelpfulVote(user._id);
    } else {
      await review.addNotHelpfulVote(user._id);
    }

    res.status(200).json({
      success: true,
      review,
      message: 'Vote recorded',
    });
  } catch (error) {
    console.error('Vote review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to record vote',
      error: error.message,
    });
  }
};

/**
 * Vet response to a review
 */
const respondToReview = async (req, res) => {
  try {
    const { reviewId } = req.params;
    const { responseText } = req.body;
    const user = await User.findByFirebaseUid(req.user.uid);
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    // Check if user is a vet
    if (user.role !== 'vet') {
      return res.status(403).json({
        success: false,
        message: 'Only vets can respond to reviews',
      });
    }

    const review = await Review.findById(reviewId);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found',
      });
    }

    // Get vet profile
    const vet = await Vet.findOne({ user: user._id });
    
    if (!vet) {
      return res.status(404).json({
        success: false,
        message: 'Vet profile not found',
      });
    }

    // Verify review is for this vet
    if (review.vet.toString() !== vet._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Unauthorized to respond to this review',
      });
    }

    if (!responseText || responseText.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Response text is required',
      });
    }

    // Add response
    review.response = {
      text: responseText,
      respondedBy: user._id,
      respondedAt: new Date(),
    };

    await review.save();

    res.status(200).json({
      success: true,
      review,
      message: 'Response added successfully',
    });
  } catch (error) {
    console.error('Respond to review error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add response',
      error: error.message,
    });
  }
};

module.exports = {
  createReview,
  getVetReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  voteReview,
  respondToReview,
};
