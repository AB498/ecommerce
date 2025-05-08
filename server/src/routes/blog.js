import express from 'express';
import mongoose from 'mongoose';
import { auth, adminAuth, staffAuth } from '../middleware/auth.js';

const router = express.Router();

// Create Blog Post Schema
const blogPostSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  slug: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  content: {
    type: String,
    required: true
  },
  excerpt: {
    type: String
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  featuredImage: {
    url: String,
    alt: String
  },
  categories: [{
    type: String
  }],
  tags: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['draft', 'published', 'archived'],
    default: 'draft'
  },
  publishedAt: {
    type: Date
  },
  seo: {
    title: String,
    description: String,
    keywords: [String]
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
blogPostSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  
  // Set publishedAt when status changes to published
  if (this.status === 'published' && !this.publishedAt) {
    this.publishedAt = Date.now();
  }
  
  next();
});

// Create text index for search
blogPostSchema.index({ 
  title: 'text', 
  content: 'text',
  excerpt: 'text',
  'tags': 'text'
});

const BlogPost = mongoose.model('BlogPost', blogPostSchema);

// @route   GET /api/blog
// @desc    Get all blog posts
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      tag, 
      status = 'published', 
      sort = '-publishedAt',
      page = 1,
      limit = 10
    } = req.query;
    
    // Build query
    const query = {};
    
    // Only show published posts to public
    if (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager')) {
      query.status = 'published';
    } else if (status) {
      query.status = status;
    }
    
    // Search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by category
    if (category) {
      query.categories = category;
    }
    
    // Filter by tag
    if (tag) {
      query.tags = tag;
    }
    
    // Execute query with pagination
    const posts = await BlogPost.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('author', 'firstName lastName username');
    
    // Get total count for pagination
    const total = await BlogPost.countDocuments(query);
    
    res.json({
      success: true,
      posts,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get blog posts error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching blog posts' 
    });
  }
});

// @route   GET /api/blog/:slugOrId
// @desc    Get blog post by slug or ID
// @access  Public
router.get('/:slugOrId', async (req, res) => {
  try {
    const { slugOrId } = req.params;
    
    let post;
    
    // Check if the parameter is a valid MongoDB ID
    if (mongoose.Types.ObjectId.isValid(slugOrId)) {
      post = await BlogPost.findById(slugOrId)
        .populate('author', 'firstName lastName username');
    } else {
      // If not a valid ID, try to find by slug
      post = await BlogPost.findOne({ slug: slugOrId })
        .populate('author', 'firstName lastName username');
    }
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    // Check if post is published or user is admin/manager
    if (post.status !== 'published' && 
        (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager'))) {
      return res.status(403).json({ 
        success: false, 
        message: 'This post is not published' 
      });
    }
    
    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Get blog post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching blog post' 
    });
  }
});

// @route   POST /api/blog
// @desc    Create a new blog post
// @access  Private (Admin/Staff)
router.post('/', staffAuth, async (req, res) => {
  try {
    const {
      title,
      content,
      excerpt,
      featuredImage,
      categories,
      tags,
      status,
      seo
    } = req.body;
    
    // Validate required fields
    if (!title || !content) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and content are required' 
      });
    }
    
    // Generate slug from title
    const slug = title
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    
    // Check if slug already exists
    const existingPost = await BlogPost.findOne({ slug });
    if (existingPost) {
      return res.status(400).json({ 
        success: false, 
        message: 'A post with this title already exists' 
      });
    }
    
    // Create new blog post
    const post = new BlogPost({
      title,
      slug,
      content,
      excerpt: excerpt || content.substring(0, 160),
      author: req.user.id,
      featuredImage,
      categories: categories || [],
      tags: tags || [],
      status: status || 'draft',
      seo
    });
    
    // Save post
    await post.save();
    
    res.status(201).json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Create blog post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating blog post' 
    });
  }
});

// @route   PUT /api/blog/:id
// @desc    Update a blog post
// @access  Private (Admin/Staff)
router.put('/:id', staffAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      content,
      excerpt,
      featuredImage,
      categories,
      tags,
      status,
      seo
    } = req.body;
    
    // Find post
    const post = await BlogPost.findById(id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    // Check if user is authorized to update this post
    if (post.author.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this post' 
      });
    }
    
    // If title is changed, update slug
    if (title && title !== post.title) {
      const newSlug = title
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
      
      // Check if new slug already exists
      const existingPost = await BlogPost.findOne({ 
        slug: newSlug,
        _id: { $ne: id }
      });
      
      if (existingPost) {
        return res.status(400).json({ 
          success: false, 
          message: 'A post with this title already exists' 
        });
      }
      
      post.slug = newSlug;
    }
    
    // Update post fields
    if (title) post.title = title;
    if (content) post.content = content;
    if (excerpt) post.excerpt = excerpt;
    else if (content && !post.excerpt) post.excerpt = content.substring(0, 160);
    if (featuredImage) post.featuredImage = featuredImage;
    if (categories) post.categories = categories;
    if (tags) post.tags = tags;
    if (status) post.status = status;
    if (seo) post.seo = seo;
    
    // Save post
    await post.save();
    
    res.json({
      success: true,
      post
    });
  } catch (error) {
    console.error('Update blog post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating blog post' 
    });
  }
});

// @route   DELETE /api/blog/:id
// @desc    Delete a blog post
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete post
    const post = await BlogPost.findByIdAndDelete(id);
    
    if (!post) {
      return res.status(404).json({ 
        success: false, 
        message: 'Blog post not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    });
  } catch (error) {
    console.error('Delete blog post error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting blog post' 
    });
  }
});

// @route   GET /api/blog/categories/list
// @desc    Get all blog categories
// @access  Public
router.get('/categories/list', async (req, res) => {
  try {
    // Get all unique categories with count
    const categories = await BlogPost.aggregate([
      {
        $match: { status: 'published' }
      },
      {
        $unwind: '$categories'
      },
      {
        $group: {
          _id: '$categories',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json({
      success: true,
      categories: categories.map(cat => ({
        name: cat._id,
        count: cat.count
      }))
    });
  } catch (error) {
    console.error('Get blog categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching blog categories' 
    });
  }
});

// @route   GET /api/blog/tags/list
// @desc    Get all blog tags
// @access  Public
router.get('/tags/list', async (req, res) => {
  try {
    // Get all unique tags with count
    const tags = await BlogPost.aggregate([
      {
        $match: { status: 'published' }
      },
      {
        $unwind: '$tags'
      },
      {
        $group: {
          _id: '$tags',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { count: -1 }
      }
    ]);
    
    res.json({
      success: true,
      tags: tags.map(tag => ({
        name: tag._id,
        count: tag.count
      }))
    });
  } catch (error) {
    console.error('Get blog tags error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching blog tags' 
    });
  }
});

export default router;
