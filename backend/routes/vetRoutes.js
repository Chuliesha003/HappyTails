const express = require('express');
const router = express.Router();
const vetController = require('../controllers/vetController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { searchLimiter, createLimiter } = require('../middleware/security');

/**
 * @route   GET /api/vets
 * @desc    Get all vets with optional filters (city, specialization, search)
 * @access  Public
 * @query   city, specialization, search, sort, page, limit
 */
router.get('/', searchLimiter, vetController.getAllVets);

/**
 * @route   GET /api/vets/nearby
 * @desc    Search for nearby vets based on user's geolocation
 * @access  Public
 * @query   latitude, longitude, maxDistance (in km, default: 50)
 */
router.get('/nearby', searchLimiter, vetController.searchNearbyVets);

/**
 * GET /api/vets/google-nearby
 * Server-side proxy to Google Places Nearby Search
 * Query: latitude, longitude, radiusMeters
 */
router.get('/google-nearby', searchLimiter, vetController.searchNearbyVetsGoogle);

/**
 * @route   GET /api/vets/specializations
 * @desc    Get list of all specializations (for filter dropdown)
 * @access  Public
 */
router.get('/specializations', vetController.getSpecializations);

/**
 * @route   GET /api/vets/cities
 * @desc    Get list of all cities (for filter dropdown)
 * @access  Public
 */
router.get('/cities', vetController.getCities);

/**
 * @route   GET /api/vets/:id
 * @desc    Get a single vet by ID with reviews
 * @access  Public
 */
router.get('/:id', vetController.getVetById);

/**
 * @route   POST /api/vets
 * @desc    Create a new vet (admin only)
 * @access  Private (Admin)
 * @body    { name, email, phoneNumber, clinicName, specialization, licenseNumber, etc. }
 */
router.post('/', createLimiter, verifyToken, checkRole('admin'), vetController.createVet);

/**
 * @route   PUT /api/vets/:id
 * @desc    Update a vet (admin only)
 * @access  Private (Admin)
 * @body    { name?, email?, phoneNumber?, specialization?, etc. }
 */
router.put('/:id', verifyToken, checkRole('admin'), vetController.updateVet);

/**
 * @route   DELETE /api/vets/:id
 * @desc    Delete a vet (admin only - soft delete)
 * @access  Private (Admin)
 */
router.delete('/:id', verifyToken, checkRole('admin'), vetController.deleteVet);

/**
 * @route   POST /api/vets/:id/reviews
 * @desc    Add review to a vet
 * @access  Private
 * @body    { rating, comment? }
 */
router.post('/:id/reviews', verifyToken, vetController.addReview);

module.exports = router;
