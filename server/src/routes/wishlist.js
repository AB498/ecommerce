import express from 'express';
import Wishlist from '../models/Wishlist.js';
import Product from '../models/Product.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/wishlist
// @desc    Get user's wishlist
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find user's wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id })
      .populate({
        path: 'products',
        select: 'name slug price images stockQuantity brand'
      });
    
    // If wishlist doesn't exist, create a new one
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
      await wishlist.save();
    }
    
    res.json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Get wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching wishlist' 
    });
  }
});

// @route   POST /api/wishlist
// @desc    Add product to wishlist
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId } = req.body;
    
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    // Find user's wishlist
    let wishlist = await Wishlist.findOne({ user: req.user.id });
    
    // If wishlist doesn't exist, create a new one
    if (!wishlist) {
      wishlist = new Wishlist({ user: req.user.id, products: [] });
    }
    
    // Check if product already exists in wishlist
    if (wishlist.products.includes(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Product already in wishlist' 
      });
    }
    
    // Add product to wishlist
    wishlist.products.push(productId);
    
    // Save wishlist
    await wishlist.save();
    
    // Populate product details
    wishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name slug price images stockQuantity brand'
    });
    
    res.json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Add to wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding to wishlist' 
    });
  }
});

// @route   DELETE /api/wishlist/:productId
// @desc    Remove product from wishlist
// @access  Private
router.delete('/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wishlist not found' 
      });
    }
    
    // Remove product from wishlist
    wishlist.products = wishlist.products.filter(
      product => product.toString() !== productId
    );
    
    // Save wishlist
    await wishlist.save();
    
    // Populate product details
    const populatedWishlist = await Wishlist.findById(wishlist._id).populate({
      path: 'products',
      select: 'name slug price images stockQuantity brand'
    });
    
    res.json({
      success: true,
      wishlist: populatedWishlist
    });
  } catch (error) {
    console.error('Remove from wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while removing from wishlist' 
    });
  }
});

// @route   DELETE /api/wishlist
// @desc    Clear wishlist
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.status(404).json({ 
        success: false, 
        message: 'Wishlist not found' 
      });
    }
    
    // Clear wishlist
    wishlist.products = [];
    
    // Save wishlist
    await wishlist.save();
    
    res.json({
      success: true,
      wishlist
    });
  } catch (error) {
    console.error('Clear wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while clearing wishlist' 
    });
  }
});

// @route   GET /api/wishlist/check/:productId
// @desc    Check if product is in wishlist
// @access  Private
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const { productId } = req.params;
    
    // Find user's wishlist
    const wishlist = await Wishlist.findOne({ user: req.user.id });
    
    if (!wishlist) {
      return res.json({
        success: true,
        inWishlist: false
      });
    }
    
    // Check if product is in wishlist
    const inWishlist = wishlist.products.some(
      product => product.toString() === productId
    );
    
    res.json({
      success: true,
      inWishlist
    });
  } catch (error) {
    console.error('Check wishlist error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while checking wishlist' 
    });
  }
});

export default router;
