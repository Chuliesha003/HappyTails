const express = require('express');
const router = express.Router();
const appointmentController = require('../controllers/appointmentController');
const { verifyToken } = require('../middleware/auth');

// All appointment routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/appointments
 * @desc    Get all appointments for authenticated user
 * @access  Private
 * @query   status, upcoming, past
 */
router.get('/', appointmentController.getUserAppointments);

/**
 * @route   GET /api/appointments/available-slots
 * @desc    Get available time slots for a vet on a specific date
 * @access  Private
 * @query   vetId, date
 */
router.get('/available-slots', appointmentController.getAvailableSlots);

/**
 * @route   GET /api/appointments/:id
 * @desc    Get a single appointment by ID
 * @access  Private (must be owner)
 */
router.get('/:id', appointmentController.getAppointmentById);

/**
 * @route   POST /api/appointments
 * @desc    Book a new appointment
 * @access  Private
 * @body    { vetId, petId, dateTime, duration?, reason, symptoms?, notes? }
 */
router.post('/', appointmentController.bookAppointment);

/**
 * @route   PUT /api/appointments/:id
 * @desc    Update an appointment
 * @access  Private (must be owner)
 * @body    { dateTime?, duration?, reason?, symptoms?, notes? }
 */
router.put('/:id', appointmentController.updateAppointment);

/**
 * @route   DELETE /api/appointments/:id
 * @desc    Cancel an appointment
 * @access  Private (must be owner)
 * @body    { reason? }
 */
router.delete('/:id', appointmentController.cancelAppointment);

module.exports = router;
