const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');
const { optionalAuth } = require('../middleware/auth');

/**
 * @route   POST /api/symptom-checker/analyze
 * @desc    Analyze pet symptoms using AI
 * @access  Public (with optional auth for usage tracking)
 * @body    { petType, symptoms, duration?, severity?, additionalInfo? }
 */
router.post('/analyze', optionalAuth, symptomController.checkSymptoms);

/**
 * @route   POST /api/symptom-checker/advice
 * @desc    Get general pet health advice
 * @access  Public (with optional auth for usage tracking)
 * @body    { question, petType? }
 */
router.post('/advice', optionalAuth, symptomController.getHealthAdvice);

/**
 * @route   POST /api/symptom-checker/emergency
 * @desc    Assess emergency situation
 * @access  Public
 * @body    { petType, symptoms, vitalSigns? }
 */
router.post('/emergency', symptomController.checkEmergency);

/**
 * @route   GET /api/symptom-checker/usage
 * @desc    Get usage statistics for current user
 * @access  Public (with optional auth)
 */
router.get('/usage', optionalAuth, symptomController.getUsageStats);

module.exports = router;
