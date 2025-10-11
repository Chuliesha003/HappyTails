const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Title is required'],
      trim: true,
      minlength: [10, 'Title must be at least 10 characters long'],
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    content: {
      type: String,
      required: [true, 'Content is required'],
      minlength: [100, 'Content must be at least 100 characters long'],
    },
    excerpt: {
      type: String,
      maxlength: [500, 'Excerpt cannot exceed 500 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      enum: ['nutrition', 'diseases', 'training', 'grooming', 'behavior', 'general'],
      index: true,
    },
    tags: [
      {
        type: String,
        trim: true,
        lowercase: true,
      },
    ],
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    authorName: {
      type: String,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
      images: [
        {
          type: String,
          trim: true,
        },
      ],
    readTime: {
      type: Number, // In minutes
      min: [1, 'Read time must be at least 1 minute'],
    },
    viewCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    likeCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    isPublished: {
      type: Boolean,
      default: false,
      index: true,
    },
    publishedAt: {
      type: Date,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    metaDescription: {
      type: String,
      maxlength: [160, 'Meta description cannot exceed 160 characters'],
    },
    metaKeywords: [
      {
        type: String,
        trim: true,
      },
    ],
  },
  {
    timestamps: true,
  }
);

// Indexes for better query performance
articleSchema.index({ category: 1, isPublished: 1 });
articleSchema.index({ createdAt: -1 });
articleSchema.index({ viewCount: -1 });
articleSchema.index({ title: 'text', content: 'text', tags: 'text' });

// Pre-save hook to generate slug
articleSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  // Set publishedAt when first published
  if (this.isPublished && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  
  // Calculate read time based on content (average reading speed: 200 words/minute)
  if (this.isModified('content') && !this.readTime) {
    const wordCount = this.content.split(/\s+/).length;
    this.readTime = Math.ceil(wordCount / 200);
  }
  
  // Generate excerpt from content if not provided
  if (this.isModified('content') && !this.excerpt) {
    this.excerpt = this.content.substring(0, 300) + '...';
  }
  
  next();
});

// Method to increment view count
articleSchema.methods.incrementViews = function () {
  this.viewCount += 1;
  return this.save();
};

// Method to increment like count
articleSchema.methods.incrementLikes = function () {
  this.likeCount += 1;
  return this.save();
};

// Method to publish article
articleSchema.methods.publish = function () {
  this.isPublished = true;
  this.publishedAt = new Date();
  return this.save();
};

// Method to unpublish article
articleSchema.methods.unpublish = function () {
  this.isPublished = false;
  return this.save();
};

// Method to get safe article object
articleSchema.methods.toSafeObject = function () {
  return {
    id: this._id,
    title: this.title,
    slug: this.slug,
    excerpt: this.excerpt,
    category: this.category,
    tags: this.tags,
    author: this.author,
    authorName: this.authorName,
    imageUrl: this.imageUrl,
    readTime: this.readTime,
    viewCount: this.viewCount,
    likeCount: this.likeCount,
    isFeatured: this.isFeatured,
    publishedAt: this.publishedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
      images: this.images || [],
  };
};

// Static method to find published articles
articleSchema.statics.findPublished = function (options = {}) {
  const query = { isPublished: true };
  
  if (options.category) {
    query.category = options.category;
  }
  
  if (options.featured) {
    query.isFeatured = true;
  }
  
  if (options.tags && options.tags.length > 0) {
    query.tags = { $in: options.tags };
  }
  
  return this.find(query).populate('author', 'fullName profileImage').sort({ publishedAt: -1 });
};

// Static method to search articles
articleSchema.statics.searchArticles = function (searchQuery) {
  return this.find(
    { $text: { $search: searchQuery }, isPublished: true },
    { score: { $meta: 'textScore' } }
  )
    .populate('author', 'fullName profileImage')
    .sort({ score: { $meta: 'textScore' } });
};

// Static method to find by category
articleSchema.statics.findByCategory = function (category) {
  return this.find({ category, isPublished: true })
    .populate('author', 'fullName profileImage')
    .sort({ publishedAt: -1 });
};

// Static method to get popular articles
articleSchema.statics.getPopular = function (limit = 10) {
  return this.find({ isPublished: true })
    .populate('author', 'fullName profileImage')
    .sort({ viewCount: -1 })
    .limit(limit);
};

const Article = mongoose.model('Article', articleSchema);

module.exports = Article;
