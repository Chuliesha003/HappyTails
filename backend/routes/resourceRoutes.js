const express = require('express');
const router = express.Router();
const resourceController = require('../controllers/resourceController');
const { verifyToken, optionalAuth, checkRole } = require('../middleware/auth');
const { searchLimiter, createLimiter } = require('../middleware/security');

/**
 * Public Routes
 */

// Get all published articles (with filters and search)
router.get('/', searchLimiter, optionalAuth, resourceController.getAllArticles);

// Get popular articles
router.get('/popular', resourceController.getPopularArticles);

// Get featured articles
router.get('/featured', resourceController.getFeaturedArticles);

// Get categories with counts
router.get('/categories', resourceController.getCategories);

// Get articles by category
router.get('/category/:category', resourceController.getArticlesByCategory);

// Get single article by ID or slug
router.get('/:id', optionalAuth, resourceController.getArticleById);

/**
 * Authenticated Routes
 */

// Like an article
router.post('/:id/like', verifyToken, resourceController.likeArticle);

/**
 * Admin-only Routes
 */

// Create new article
router.post('/', createLimiter, verifyToken, checkRole(['admin']), resourceController.createArticle);

// Update article
router.put('/:id', verifyToken, checkRole(['admin']), resourceController.updateArticle);

// Delete article
router.delete('/:id', verifyToken, checkRole(['admin']), resourceController.deleteArticle);

// Toggle publish status
router.patch('/:id/publish', verifyToken, checkRole(['admin']), resourceController.togglePublish);

module.exports = router;
