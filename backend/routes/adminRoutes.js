const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { verifyToken, checkRole } = require('../middleware/auth');
const { adminLimiter } = require('../middleware/security');

// All admin routes require authentication and admin role
router.use(adminLimiter);
router.use(verifyToken);
router.use(checkRole(['admin']));

/**
 * System Statistics
 */

// Get system-wide statistics
router.get('/stats', adminController.getStats);

// Get recent activity across the system
router.get('/activity', adminController.getRecentActivity);

/**
 * User Management
 */

// Get all users with pagination and filters
router.get('/users', adminController.getAllUsers);

// Get single user details
router.get('/users/:id', adminController.getUserById);

// Update user role
router.patch('/users/:id/role', adminController.updateUserRole);

// Ban/unban user
router.patch('/users/:id/ban', adminController.toggleUserBan);

// Toggle user active status (soft delete/restore)
router.patch('/users/:id/status', adminController.toggleUserStatus);

// Delete user permanently
router.delete('/users/:id', adminController.deleteUser);

/**
 * Appointment Management
 */

// Get all appointments with filters
router.get('/appointments', adminController.getAllAppointments);

/**
 * Veterinarian Management
 */

// Get all vets (admin view with stats)
router.get('/vets', adminController.getAllVetsAdmin);

// Get single vet details
router.get('/vets/:id', adminController.getVetById);

// Create new vet
router.post('/vets', adminController.createVet);

// Update vet
router.put('/vets/:id', adminController.updateVet);

// Delete vet
router.delete('/vets/:id', adminController.deleteVet);

// Toggle vet verification status
router.patch('/vets/:id/verify', adminController.toggleVetVerification);

// Toggle vet active status
router.patch('/vets/:id/status', adminController.toggleVetStatus);

/**
 * Pet Management
 */

// Get all pets with pagination and filters
router.get('/pets', adminController.getAllPets);

// Get single pet details
router.get('/pets/:id', adminController.getPetById);

// Create new pet
router.post('/pets', adminController.createPet);

// Update pet
router.put('/pets/:id', adminController.updatePet);

// Delete pet
router.delete('/pets/:id', adminController.deletePet);

// Toggle pet active status
router.patch('/pets/:id/status', adminController.togglePetStatus);

/**
 * Article Management
 */

// Get all articles (admin view)
router.get('/articles', adminController.getAllArticlesAdmin);

// Get single article details
router.get('/articles/:id', adminController.getArticleById);

// Create new article
router.post('/articles', adminController.createArticle);

// Update article
router.put('/articles/:id', adminController.updateArticle);

// Delete article
router.delete('/articles/:id', adminController.deleteArticle);

// Toggle article publish status
router.patch('/articles/:id/publish', adminController.toggleArticlePublish);

module.exports = router;
