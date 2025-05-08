import express from 'express';
import mongoose from 'mongoose';
import Review from '../models/Review.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { auth, adminAuth, staffAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/reviews/product/:productId
// @desc    Get reviews for a product
// @access  Public
router.get('/product/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    const { sort = '-createdAt', page = 1, limit = 10 } = req.query;
    
    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid product ID' 
      });
    }
    
    // Find reviews
    const reviews = await Review.find({ 
      product: productId,
      isApproved: true
    })
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('user', 'firstName lastName username');
    
    // Get total count for pagination
    const total = await Review.countDocuments({ 
      product: productId,
      isApproved: true
    });
    
    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get product reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching reviews' 
    });
  }
});

// @route   GET /api/reviews/user
// @desc    Get reviews by current user
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('product', 'name slug images');
    
    res.json({
      success: true,
      reviews
    });
  } catch (error) {
    console.error('Get user reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching reviews' 
    });
  }
});

// @route   GET /api/reviews/admin
// @desc    Get all reviews (admin)
// @access  Private (Admin/Staff)
router.get('/admin', staffAuth, async (req, res) => {
  try {
    const { 
      approved, 
      productId, 
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by approval status
    if (approved === 'true') {
      query.isApproved = true;
    } else if (approved === 'false') {
      query.isApproved = false;
    }
    
    // Filter by product
    if (productId) {
      query.product = productId;
    }
    
    // Execute query with pagination
    const reviews = await Review.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('user', 'firstName lastName username email')
      .populate('product', 'name slug images');
    
    // Get total count for pagination
    const total = await Review.countDocuments(query);
    
    res.json({
      success: true,
      reviews,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get admin reviews error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching reviews' 
    });
  }
});

// @route   POST /api/reviews
// @desc    Create a new review
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const { productId, orderId, rating, title, comment, images } = req.body;
    
    // Validate rating
    if (rating < 1 || rating > 5) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }
    
    // Check if product exists
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    // Check if user has already reviewed this product
    const existingReview = await Review.findOne({
      user: req.user.id,
      product: productId
    });
    
    if (existingReview) {
      return res.status(400).json({ 
        success: false, 
        message: 'You have already reviewed this product' 
      });
    }
    
    // Check if user has purchased the product
    let isVerifiedPurchase = false;
    let order = null;
    
    if (orderId) {
      order = await Order.findOne({
        _id: orderId,
        user: req.user.id,
        'items.product': productId,
        orderStatus: { $in: ['delivered', 'completed'] }
      });
      
      if (order) {
        isVerifiedPurchase = true;
      }
    } else {
      // If no orderId provided, check if user has any completed order with this product
      order = await Order.findOne({
        user: req.user.id,
        'items.product': productId,
        orderStatus: { $in: ['delivered', 'completed'] }
      });
      
      if (order) {
        isVerifiedPurchase = true;
      }
    }
    
    // Create new review
    const review = new Review({
      user: req.user.id,
      product: productId,
      order: order ? order._id : null,
      rating,
      title,
      comment,
      images: images || [],
      isVerifiedPurchase,
      // Auto-approve verified purchases, otherwise require admin approval
      isApproved: isVerifiedPurchase
    });
    
    // Save review
    await review.save();
    
    // Update product rating
    const allReviews = await Review.find({ 
      product: productId,
      isApproved: true
    });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
    
    await Product.findByIdAndUpdate(productId, {
      'rating.average': averageRating,
      'rating.count': allReviews.length
    });
    
    res.status(201).json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Create review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating review' 
    });
  }
});

// @route   PUT /api/reviews/:id
// @desc    Update a review
// @access  Private
router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { rating, title, comment, images } = req.body;
    
    // Find review
    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }
    
    // Check if user is authorized to update this review
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this review' 
      });
    }
    
    // Validate rating
    if (rating && (rating < 1 || rating > 5)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Rating must be between 1 and 5' 
      });
    }
    
    // Update review
    review.rating = rating || review.rating;
    review.title = title || review.title;
    review.comment = comment || review.comment;
    review.images = images || review.images;
    
    // If user is not admin, set isApproved to false for re-review
    if (req.user.role !== 'admin') {
      review.isApproved = review.isVerifiedPurchase;
    }
    
    // Save review
    await review.save();
    
    // Update product rating
    const productId = review.product;
    const allReviews = await Review.find({ 
      product: productId,
      isApproved: true
    });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
    
    await Product.findByIdAndUpdate(productId, {
      'rating.average': averageRating,
      'rating.count': allReviews.length
    });
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Update review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating review' 
    });
  }
});

// @route   PUT /api/reviews/:id/approve
// @desc    Approve a review
// @access  Private (Admin/Staff)
router.put('/:id/approve', staffAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find and update review
    const review = await Review.findByIdAndUpdate(
      id,
      { isApproved: true },
      { new: true }
    );
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }
    
    // Update product rating
    const productId = review.product;
    const allReviews = await Review.find({ 
      product: productId,
      isApproved: true
    });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
    
    await Product.findByIdAndUpdate(productId, {
      'rating.average': averageRating,
      'rating.count': allReviews.length
    });
    
    res.json({
      success: true,
      review
    });
  } catch (error) {
    console.error('Approve review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while approving review' 
    });
  }
});

// @route   DELETE /api/reviews/:id
// @desc    Delete a review
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find review
    const review = await Review.findById(id);
    
    if (!review) {
      return res.status(404).json({ 
        success: false, 
        message: 'Review not found' 
      });
    }
    
    // Check if user is authorized to delete this review
    if (review.user.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this review' 
      });
    }
    
    // Delete review
    await Review.findByIdAndDelete(id);
    
    // Update product rating
    const productId = review.product;
    const allReviews = await Review.find({ 
      product: productId,
      isApproved: true
    });
    
    const totalRating = allReviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = allReviews.length > 0 ? totalRating / allReviews.length : 0;
    
    await Product.findByIdAndUpdate(productId, {
      'rating.average': averageRating,
      'rating.count': allReviews.length
    });
    
    res.json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error('Delete review error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting review' 
    });
  }
});

export default router;
