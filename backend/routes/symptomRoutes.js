const express = require('express');
const router = express.Router();
const symptomController = require('../controllers/symptomController');
const { optionalAuth } = require('../middleware/auth');
const { aiLimiter } = require('../middleware/security');

/**
 * @swagger
 * /api/symptom-checker/analyze:
 *   post:
 *     summary: Analyze pet symptoms using AI
 *     description: Uses Google Gemini AI to analyze pet symptoms and provide recommendations. Rate limited to 10 requests per hour.
 *     tags: [Symptom Checker]
 *     security:
 *       - bearerAuth: []
 *       - {}
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - petType
 *               - symptoms
 *             properties:
 *               petType:
 *                 type: string
 *                 enum: [dog, cat, bird, rabbit, other]
 *                 example: dog
 *               age:
 *                 type: number
 *                 description: Age in years
 *                 example: 5
 *               symptoms:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["coughing", "lethargy", "loss of appetite"]
 *               duration:
 *                 type: string
 *                 example: "2 days"
 *               severity:
 *                 type: string
 *                 enum: [mild, moderate, severe]
 *                 example: moderate
 *               additionalInfo:
 *                 type: string
 *                 example: "Pet has been less active than usual"
 *     responses:
 *       200:
 *         description: Symptom analysis completed successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/SymptomAnalysis'
 *       400:
 *         description: Invalid input
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       429:
 *         description: Rate limit exceeded (10 requests per hour)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *       503:
 *         description: AI service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/analyze', aiLimiter, optionalAuth, symptomController.checkSymptoms);

/**
 * @route   POST /api/symptom-checker/advice
 * @desc    Get general pet health advice
 * @access  Public (with optional auth for usage tracking)
 * @body    { question, petType? }
 */
router.post('/advice', aiLimiter, optionalAuth, symptomController.getHealthAdvice);

/**
 * @route   POST /api/symptom-checker/emergency
 * @desc    Assess emergency situation
 * @access  Public
 * @body    { petType, symptoms, vitalSigns? }
 */
router.post('/emergency', aiLimiter, symptomController.checkEmergency);

/**
 * @route   GET /api/symptom-checker/usage
 * @desc    Get usage statistics for current user
 * @access  Public (with optional auth)
 */
router.get('/usage', optionalAuth, symptomController.getUsageStats);

module.exports = router;
