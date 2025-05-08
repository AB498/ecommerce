import express from 'express';
import Category from '../models/Category.js';
import { auth, adminAuth, staffAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/categories
// @desc    Get all categories
// @access  Public
router.get('/', async (req, res) => {
  try {
    const { active, parent } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by active status
    if (active === 'true') {
      query.isActive = true;
    }
    
    // Filter by parent
    if (parent) {
      if (parent === 'root') {
        query.parent = null;
      } else {
        query.parent = parent;
      }
    }
    
    // Get categories
    const categories = await Category.find(query)
      .sort('order')
      .populate('parent', 'name slug');
    
    res.json({
      success: true,
      categories
    });
  } catch (error) {
    console.error('Get categories error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching categories' 
    });
  }
});

// @route   GET /api/categories/tree
// @desc    Get category tree
// @access  Public
router.get('/tree', async (req, res) => {
  try {
    // Get all categories
    const categories = await Category.find({ isActive: true })
      .sort('order')
      .lean();
    
    // Build tree
    const buildTree = (items, parentId = null) => {
      return items
        .filter(item => 
          (parentId === null && item.parent === null) || 
          (item.parent && item.parent.toString() === parentId)
        )
        .map(item => ({
          ...item,
          children: buildTree(items, item._id.toString())
        }));
    };
    
    const tree = buildTree(categories);
    
    res.json({
      success: true,
      categoryTree: tree
    });
  } catch (error) {
    console.error('Get category tree error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching category tree' 
    });
  }
});

// @route   GET /api/categories/:idOrSlug
// @desc    Get category by ID or slug
// @access  Public
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;
    
    // Find category by id or slug
    const category = await Category.findOne({
      $or: [
        { _id: idOrSlug },
        { slug: idOrSlug }
      ]
    }).populate('parent', 'name slug');
    
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Get category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching category' 
    });
  }
});

// @route   POST /api/categories
// @desc    Create a new category
// @access  Private (Admin/Staff)
router.post('/', staffAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      parent,
      image,
      icon,
      isActive,
      order,
      seo
    } = req.body;
    
    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
    
    // Check if slug already exists
    const existingCategory = await Category.findOne({ slug });
    if (existingCategory) {
      return res.status(400).json({ 
        success: false, 
        message: 'A category with this name already exists' 
      });
    }
    
    // Calculate level
    let level = 0;
    if (parent) {
      const parentCategory = await Category.findById(parent);
      if (parentCategory) {
        level = parentCategory.level + 1;
      }
    }
    
    // Create new category
    const category = new Category({
      name,
      slug,
      description,
      parent,
      level,
      image,
      icon,
      isActive,
      order,
      seo
    });
    
    // Save category to database
    await category.save();
    
    res.status(201).json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Create category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating category' 
    });
  }
});

// @route   PUT /api/categories/:id
// @desc    Update a category
// @access  Private (Admin/Staff)
router.put('/:id', staffAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find category by id
    let category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    // If name is changed, update slug
    if (req.body.name && req.body.name !== category.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');
      
      // Check if new slug already exists
      const existingCategory = await Category.findOne({ 
        slug: req.body.slug,
        _id: { $ne: id }
      });
      
      if (existingCategory) {
        return res.status(400).json({ 
          success: false, 
          message: 'A category with this name already exists' 
        });
      }
    }
    
    // If parent is changed, update level
    if (req.body.parent !== undefined && req.body.parent !== category.parent?.toString()) {
      if (!req.body.parent) {
        req.body.level = 0;
      } else {
        const parentCategory = await Category.findById(req.body.parent);
        if (parentCategory) {
          req.body.level = parentCategory.level + 1;
        }
      }
    }
    
    // Update category
    category = await Category.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );
    
    res.json({
      success: true,
      category
    });
  } catch (error) {
    console.error('Update category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating category' 
    });
  }
});

// @route   DELETE /api/categories/:id
// @desc    Delete a category
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find category by id
    const category = await Category.findById(id);
    if (!category) {
      return res.status(404).json({ 
        success: false, 
        message: 'Category not found' 
      });
    }
    
    // Check if category has children
    const childrenCount = await Category.countDocuments({ parent: id });
    if (childrenCount > 0) {
      return res.status(400).json({ 
        success: false, 
        message: 'Cannot delete category with subcategories' 
      });
    }
    
    // Delete category
    await Category.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Category deleted successfully'
    });
  } catch (error) {
    console.error('Delete category error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting category' 
    });
  }
});

export default router;
