import express from 'express';
import mongoose from 'mongoose';
import Coupon from '../models/Coupon.js';
import { auth, adminAuth, staffAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/coupons
// @desc    Get all coupons (admin)
// @access  Private (Admin/Staff)
router.get('/', staffAuth, async (req, res) => {
  try {
    const { 
      isActive, 
      type, 
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by active status
    if (isActive === 'true') {
      query.isActive = true;
    } else if (isActive === 'false') {
      query.isActive = false;
    }
    
    // Filter by coupon type
    if (type) {
      query.type = type;
    }
    
    // Execute query with pagination
    const coupons = await Coupon.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('applicableProducts', 'name slug')
      .populate('applicableCategories', 'name slug');
    
    // Get total count for pagination
    const total = await Coupon.countDocuments(query);
    
    res.json({
      success: true,
      coupons,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get coupons error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching coupons' 
    });
  }
});

// @route   GET /api/coupons/:id
// @desc    Get coupon by ID
// @access  Private (Admin/Staff)
router.get('/:id', staffAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find coupon
    const coupon = await Coupon.findById(id)
      .populate('applicableProducts', 'name slug')
      .populate('applicableCategories', 'name slug');
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        message: 'Coupon not found' 
      });
    }
    
    res.json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error('Get coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching coupon' 
    });
  }
});

// @route   POST /api/coupons/validate
// @desc    Validate a coupon code
// @access  Public
router.post('/validate', async (req, res) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon code is required' 
      });
    }
    
    // Find coupon
    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
      validFrom: { $lte: new Date() },
      validUntil: { $gte: new Date() }
    });
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        message: 'Invalid or expired coupon code' 
      });
    }
    
    // Check usage limit
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon usage limit reached' 
      });
    }
    
    res.json({
      success: true,
      coupon: {
        code: coupon.code,
        type: coupon.type,
        value: coupon.value,
        minPurchase: coupon.minPurchase,
        maxDiscount: coupon.maxDiscount,
        validUntil: coupon.validUntil,
        applicableProducts: coupon.applicableProducts,
        applicableCategories: coupon.applicableCategories
      }
    });
  } catch (error) {
    console.error('Validate coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while validating coupon' 
    });
  }
});

// @route   POST /api/coupons
// @desc    Create a new coupon
// @access  Private (Admin/Staff)
router.post('/', staffAuth, async (req, res) => {
  try {
    const {
      code,
      type,
      value,
      minPurchase,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      isActive,
      applicableProducts,
      applicableCategories,
      description
    } = req.body;
    
    // Validate required fields
    if (!code || !type || !value || !validUntil) {
      return res.status(400).json({ 
        success: false, 
        message: 'Code, type, value, and validUntil are required' 
      });
    }
    
    // Check if coupon code already exists
    const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
    if (existingCoupon) {
      return res.status(400).json({ 
        success: false, 
        message: 'Coupon code already exists' 
      });
    }
    
    // Create new coupon
    const coupon = new Coupon({
      code: code.toUpperCase(),
      type,
      value,
      minPurchase: minPurchase || 0,
      maxDiscount: maxDiscount || null,
      validFrom: validFrom || new Date(),
      validUntil,
      usageLimit: usageLimit || null,
      usageCount: 0,
      isActive: isActive !== undefined ? isActive : true,
      applicableProducts: applicableProducts || [],
      applicableCategories: applicableCategories || [],
      description
    });
    
    // Save coupon
    await coupon.save();
    
    res.status(201).json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error('Create coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating coupon' 
    });
  }
});

// @route   PUT /api/coupons/:id
// @desc    Update a coupon
// @access  Private (Admin/Staff)
router.put('/:id', staffAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const {
      code,
      type,
      value,
      minPurchase,
      maxDiscount,
      validFrom,
      validUntil,
      usageLimit,
      isActive,
      applicableProducts,
      applicableCategories,
      description
    } = req.body;
    
    // Find coupon
    const coupon = await Coupon.findById(id);
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        message: 'Coupon not found' 
      });
    }
    
    // Check if coupon code already exists (if changing code)
    if (code && code.toUpperCase() !== coupon.code) {
      const existingCoupon = await Coupon.findOne({ code: code.toUpperCase() });
      if (existingCoupon) {
        return res.status(400).json({ 
          success: false, 
          message: 'Coupon code already exists' 
        });
      }
      coupon.code = code.toUpperCase();
    }
    
    // Update coupon fields
    if (type) coupon.type = type;
    if (value) coupon.value = value;
    if (minPurchase !== undefined) coupon.minPurchase = minPurchase;
    if (maxDiscount !== undefined) coupon.maxDiscount = maxDiscount;
    if (validFrom) coupon.validFrom = validFrom;
    if (validUntil) coupon.validUntil = validUntil;
    if (usageLimit !== undefined) coupon.usageLimit = usageLimit;
    if (isActive !== undefined) coupon.isActive = isActive;
    if (applicableProducts) coupon.applicableProducts = applicableProducts;
    if (applicableCategories) coupon.applicableCategories = applicableCategories;
    if (description) coupon.description = description;
    
    // Save coupon
    await coupon.save();
    
    res.json({
      success: true,
      coupon
    });
  } catch (error) {
    console.error('Update coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating coupon' 
    });
  }
});

// @route   DELETE /api/coupons/:id
// @desc    Delete a coupon
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and delete coupon
    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return res.status(404).json({ 
        success: false, 
        message: 'Coupon not found' 
      });
    }
    
    res.json({
      success: true,
      message: 'Coupon deleted successfully'
    });
  } catch (error) {
    console.error('Delete coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting coupon' 
    });
  }
});

export default router;
