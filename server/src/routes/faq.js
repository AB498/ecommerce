import express from 'express';
import mongoose from 'mongoose';
import { auth, adminAuth, staffAuth } from '../middleware/auth.js';

const router = express.Router();

// Create FAQ Schema
const faqSchema = new mongoose.Schema({
  question: {
    type: String,
    required: true,
    trim: true
  },
  answer: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
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
faqSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Create text index for search
faqSchema.index({ 
  question: 'text', 
  answer: 'text',
  category: 'text'
});

const FAQ = mongoose.model('FAQ', faqSchema);

// @route   GET /api/faq
// @desc    Get all FAQs
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { 
      search, 
      category, 
      isActive = 'true', 
      sort = 'category order',
      page = 1,
      limit = 50
    } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by active status
    if (isActive === 'true') {
      query.isActive = true;
    } else if (isActive === 'false' && req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
      query.isActive = false;
    } else {
      query.isActive = true;
    }
    
    // Search
    if (search) {
      query.$text = { $search: search };
    }
    
    // Filter by category
    if (category) {
      query.category = category;
    }
    
    // Execute query with pagination
    const faqs = await FAQ.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await FAQ.countDocuments(query);
    
    res.json({
      success: true,
      faqs,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get FAQs error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching FAQs' 
    });
  }
});

// @route   GET /api/faq/categories
// @desc    Get all FAQ categories
// @access  Public
router.get('/categories', async (req, res) => {
  try {
    // Get all unique categories with count
    const categories = await FAQ.aggregate([
      {
        $match: { isActive: true }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
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
    console.error('Get FAQ categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching FAQ categories' 
    });
  }
});

// @route   GET /api/faq/:id
// @desc    Get FAQ by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find FAQ
    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return res.status(404).json({ 
        success: false, 
        message: 'FAQ not found' 
      });
    }
    
    // Check if FAQ is active or user is admin/manager
    if (!faq.isActive && 
        (!req.user || (req.user.role !== 'admin' && req.user.role !== 'manager'))) {
      return res.status(403).json({ 
        success: false, 
        message: 'This FAQ is not active' 
      });
    }
    
    res.json({
      success: true,
      faq
    });
  } catch (error) {
    console.error('Get FAQ error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching FAQ' 
    });
  }
});

// @route   POST /api/faq
// @desc    Create a new FAQ
// @access  Private (Admin/Staff)
router.post('/', staffAuth, async (req, res) => {
  try {
    const {
      question,
      answer,
      category,
      order,
      isActive
    } = req.body;
    
    // Validate required fields
    if (!question || !answer || !category) {
      return res.status(400).json({ 
        success: false, 
        message: 'Question, answer, and category are required' 
      });
    }
    
    // Create new FAQ
    const faq = new FAQ({
      question,
      answer,
      category,
      order: order || 0,
      isActive: isActive !== undefined ? isActive : true
    });
    
    // Save FAQ
    await faq.save();
    
    res.status(201).json({
      success: true,
      faq
    });
  } catch (error) {
    console.error('Create FAQ error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating FAQ' 
    });
  }
});

// @route   PUT /api/faq/:id
// @desc    Update a FAQ
// @access  Private (Admin/Staff)
router.put('/:id', staffAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      question,
      answer,
      category,
      order,
      isActive
    } = req.body;
    
    // Find FAQ
    const faq = await FAQ.findById(id);
    
    if (!faq) {
      return res.status(404).json({ 
        success: false, 
        message: 'FAQ not found' 
      });
    }
    
    // Update FAQ fields
    if (question) faq.question = question;
    if (answer) faq.answer = answer;
    if (category) faq.category = category;
    if (order !== undefined) faq.order = order;
    if (isActive !== undefined) faq.isActive = isActive;
    
    // Save FAQ
    await faq.save();
    
    res.json({
      success: true,
      faq
    });
  } catch (error) {
    console.error('Update FAQ error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating FAQ' 
    });
  }
});

// @route   DELETE /api/faq/:id
// @desc    Delete a FAQ
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete FAQ
    const faq = await FAQ.findByIdAndDelete(id);
    
    if (!faq) {
      return res.status(404).json({ 
        success: false, 
        message: 'FAQ not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'FAQ deleted successfully'
    });
  } catch (error) {
    console.error('Delete FAQ error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting FAQ' 
    });
  }
});

export default router;
