const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/auth');
const {
  createReview,
  getVetReviews,
  getUserReviews,
  updateReview,
  deleteReview,
  voteReview,
  respondToReview,
} = require('../controllers/reviewController');

/**
 * @route   POST /api/reviews
 * @desc    Create a new review for a vet
 * @access  Private
 * @body    { vetId, appointmentId?, rating, comment?, detailedRatings?, tags? }
 */
router.post('/', verifyToken, createReview);

/**
 * @route   GET /api/reviews/vet/:vetId
 * @desc    Get all reviews for a specific vet
 * @access  Public
 * @query   page, limit, sort
 */
router.get('/vet/:vetId', getVetReviews);

/**
 * @route   GET /api/reviews/my-reviews
 * @desc    Get all reviews by the authenticated user
 * @access  Private
 */
router.get('/my-reviews', verifyToken, getUserReviews);

/**
 * @route   PUT /api/reviews/:reviewId
 * @desc    Update a review
 * @access  Private (review owner only)
 * @body    { rating?, comment?, detailedRatings?, tags? }
 */
router.put('/:reviewId', verifyToken, updateReview);

/**
 * @route   DELETE /api/reviews/:reviewId
 * @desc    Delete a review
 * @access  Private (review owner or admin)
 */
router.delete('/:reviewId', verifyToken, deleteReview);

/**
 * @route   POST /api/reviews/:reviewId/vote
 * @desc    Vote on a review (helpful/not helpful)
 * @access  Private
 * @body    { voteType: 'helpful' | 'not-helpful' }
 */
router.post('/:reviewId/vote', verifyToken, voteReview);

/**
 * @route   POST /api/reviews/:reviewId/respond
 * @desc    Vet responds to a review
 * @access  Private (vet only)
 * @body    { responseText }
 */
router.post('/:reviewId/respond', verifyToken, respondToReview);

module.exports = router;
