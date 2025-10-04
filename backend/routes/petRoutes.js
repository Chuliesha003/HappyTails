const express = require('express');
const router = express.Router();
const petController = require('../controllers/petController');
const { verifyToken } = require('../middleware/auth');

// All pet routes require authentication
router.use(verifyToken);

/**
 * @route   GET /api/pets
 * @desc    Get all pets for authenticated user
 * @access  Private
 */
router.get('/', petController.getAllPets);

/**
 * @route   GET /api/pets/:id
 * @desc    Get a single pet by ID
 * @access  Private (must be owner)
 */
router.get('/:id', petController.getPetById);

/**
 * @swagger
 * /api/pets:
 *   post:
 *     summary: Create a new pet record
 *     description: Creates a new pet record for the authenticated user
 *     tags: [Pets]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Pet'
 *           example:
 *             name: Max
 *             species: dog
 *             breed: Golden Retriever
 *             birthDate: "2020-01-15"
 *             gender: male
 *             weight: 30.5
 *             color: Golden
 *             allergies: ["peanuts"]
 *     responses:
 *       201:
 *         description: Pet created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                 message:
 *                   type: string
 *                 pet:
 *                   $ref: '#/components/schemas/Pet'
 *       400:
 *         description: Validation error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ValidationError'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 */
router.post('/', petController.createPet);

/**
 * @route   PUT /api/pets/:id
 * @desc    Update a pet
 * @access  Private (must be owner)
 * @body    { name?, species?, breed?, age?, weight?, etc. }
 */
router.put('/:id', petController.updatePet);

/**
 * @route   DELETE /api/pets/:id
 * @desc    Delete a pet (soft delete)
 * @access  Private (must be owner)
 */
router.delete('/:id', petController.deletePet);

/**
 * @route   POST /api/pets/:id/medical-records
 * @desc    Add medical record to a pet
 * @access  Private (must be owner)
 * @body    { date, condition, diagnosis, treatment, veterinarian, notes, medications }
 */
router.post('/:id/medical-records', petController.addMedicalRecord);

/**
 * @route   POST /api/pets/:id/vaccinations
 * @desc    Add vaccination to a pet
 * @access  Private (must be owner)
 * @body    { name, date, nextDueDate, administeredBy, notes }
 */
router.post('/:id/vaccinations', petController.addVaccination);

module.exports = router;
