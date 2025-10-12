const Article = require('../models/Article');
const User = require('../models/User');
// Doctor model removed — articles will continue to use authorName for display

// Get all articles (published for users, all for admins)
exports.getAllArticles = async (req, res) => {
  try {
    const { category, tag, search, featured, published, page = 1, limit = 10, sort = '-publishedAt' } = req.query;
    
    const query = {};
    
    // Only show published articles for non-admin users
    if (!req.userRole || req.userRole !== 'admin') {
      query.isPublished = true;
    } else if (published !== undefined) {
      query.isPublished = published === 'true';
    }
    
    // Apply filters
    if (category) {
      query.category = category;
    }
    
    if (tag) {
      query.tags = tag;
    }
    
    if (featured === 'true') {
      query.isFeatured = true;
    }
    
    // Handle search
    let articles;
    if (search) {
      articles = await Article.searchArticles(search)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    } else {
      articles = await Article.find(query)
        .populate('author', 'fullName profileImage email')
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(parseInt(limit));
    }
    
    const total = await Article.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalArticles: total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get all articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles',
      error: error.message,
    });
  }
};

// Get single article by ID or slug
exports.getArticleById = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Try to find by ID or slug
    let article = await Article.findById(id)
      .populate('author', 'fullName profileImage email bio');

    if (!article) {
      article = await Article.findOne({ slug: id })
        .populate('author', 'fullName profileImage email bio');
    }
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }
    
    // Check if user can view unpublished articles
    if (!article.isPublished && (!req.userRole || req.userRole !== 'admin')) {
      return res.status(403).json({
        success: false,
        message: 'This article is not published',
      });
    }
    
    // Increment view count (don't await to avoid slowing response)
    article.incrementViews().catch((err) => console.error('Failed to increment views:', err));
    
    res.status(200).json({
      success: true,
      data: article,
    });
  } catch (error) {
    console.error('Get article error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch article',
      error: error.message,
    });
  }
};

// Create new article (admin only)
exports.createArticle = async (req, res) => {
  try {
    const { title, content, excerpt, category, tags, imageUrl, isPublished, isFeatured, metaDescription, metaKeywords } = req.body;
    
    // Validate required fields
    if (!title || !content || !category) {
      return res.status(400).json({
        success: false,
        message: 'Title, content, and category are required',
      });
    }
    
    // Get author info
    const author = await User.findById(req.userDoc._id);
    
    const article = new Article({
      title,
      content,
      excerpt,
      category,
      tags,
      imageUrl,
      author: author._id,
      authorName: author.fullName,
      isPublished: isPublished || false,
      isFeatured: isFeatured || false,
      metaDescription,
      metaKeywords,
    });
    
    await article.save();
    
    const populatedArticle = await Article.findById(article._1d)
      .populate('author', 'fullName profileImage email');
    
    res.status(201).json({
      success: true,
      message: 'Article created successfully',
      data: populatedArticle,
    });
  } catch (error) {
    console.error('Create article error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Article with this slug already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create article',
      error: error.message,
    });
  }
};

// Update article (admin only)
exports.updateArticle = async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    
    // Find article
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }
    
    // Update fields
    Object.keys(updates).forEach((key) => {
      if (updates[key] !== undefined && key !== '_id' && key !== '__v' && key !== 'author') {
        article[key] = updates[key];
      }
    });
    
    await article.save();
    
    const updatedArticle = await Article.findById(article._id)
      .populate('author', 'fullName profileImage email');
    
    res.status(200).json({
      success: true,
      message: 'Article updated successfully',
      data: updatedArticle,
    });
  } catch (error) {
    console.error('Update article error:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation failed',
        errors: Object.values(error.errors).map((err) => err.message),
      });
    }
    
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'Article with this slug already exists',
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update article',
      error: error.message,
    });
  }
};

// Delete article (admin only)
exports.deleteArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }
    
    await Article.findByIdAndDelete(id);
    
    res.status(200).json({
      success: true,
      message: 'Article deleted successfully',
    });
  } catch (error) {
    console.error('Delete article error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete article',
      error: error.message,
    });
  }
};

// Toggle publish status (admin only)
exports.togglePublish = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }
    
    if (article.isPublished) {
      await article.unpublish();
    } else {
      await article.publish();
    }
    
    const updatedArticle = await Article.findById(article._id)
      .populate('author', 'fullName profileImage email');
    
    res.status(200).json({
      success: true,
      message: `Article ${article.isPublished ? 'published' : 'unpublished'} successfully`,
      data: updatedArticle,
    });
  } catch (error) {
    console.error('Toggle publish error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to toggle publish status',
      error: error.message,
    });
  }
};

// Get popular articles
exports.getPopularArticles = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const articles = await Article.getPopular(parseInt(limit));
    
    res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error('Get popular articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch popular articles',
      error: error.message,
    });
  }
};

// Get featured articles
exports.getFeaturedArticles = async (req, res) => {
  try {
    const articles = await Article.find({ isPublished: true, isFeatured: true })
      .populate('author', 'fullName profileImage')
      .sort({ publishedAt: -1 })
      .limit(10);
    
    res.status(200).json({
      success: true,
      data: articles,
    });
  } catch (error) {
    console.error('Get featured articles error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch featured articles',
      error: error.message,
    });
  }
};

// Get articles by category
exports.getArticlesByCategory = async (req, res) => {
  try {
    const { category } = req.params;
    const { page = 1, limit = 10 } = req.query;
    
    const articles = await Article.findByCategory(category)
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Article.countDocuments({ category, isPublished: true });
    
    res.status(200).json({
      success: true,
      data: articles,
      pagination: {
        currentPage: parseInt(page),
        totalPages: Math.ceil(total / limit),
        totalArticles: total,
        hasMore: page * limit < total,
      },
    });
  } catch (error) {
    console.error('Get articles by category error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch articles',
      error: error.message,
    });
  }
};

// Get available categories with counts
exports.getCategories = async (req, res) => {
  try {
    const categories = await Article.aggregate([
      { $match: { isPublished: true } },
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ]);
    
    res.status(200).json({
      success: true,
      data: categories.map((cat) => ({
        category: cat._id,
        count: cat.count,
      })),
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch categories',
      error: error.message,
    });
  }
};

// Like article
exports.likeArticle = async (req, res) => {
  try {
    const { id } = req.params;
    
    const article = await Article.findById(id);
    
    if (!article) {
      return res.status(404).json({
        success: false,
        message: 'Article not found',
      });
    }
    
    await article.incrementLikes();
    
    res.status(200).json({
      success: true,
      message: 'Article liked successfully',
      data: {
        likeCount: article.likeCount,
      },
    });
  } catch (error) {
    console.error('Like article error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to like article',
      error: error.message,
    });
  }
};
