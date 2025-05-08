import express from 'express';
import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { auth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/cart
// @desc    Get user's cart
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name slug price images stockQuantity sku'
      });
    
    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
      await cart.save();
    }
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Get cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching cart' 
    });
  }
});

// @route   POST /api/cart/items
// @desc    Add item to cart
// @access  Private
router.post('/items', auth, async (req, res) => {
  try {
    const { productId, quantity = 1, selectedVariants = [] } = req.body;
    
    // Validate product
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    // Check if product is in stock
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not enough stock available' 
      });
    }
    
    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    // If cart doesn't exist, create a new one
    if (!cart) {
      cart = new Cart({ user: req.user.id, items: [] });
    }
    
    // Check if product already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.product.toString() === productId
    );
    
    if (existingItemIndex > -1) {
      // Update quantity if product already in cart
      cart.items[existingItemIndex].quantity += quantity;
      
      // Update selected variants if provided
      if (selectedVariants.length > 0) {
        cart.items[existingItemIndex].selectedVariants = selectedVariants;
      }
    } else {
      // Add new item to cart
      cart.items.push({
        product: productId,
        quantity,
        price: {
          amount: product.price.amount,
          currency: product.price.currency
        },
        selectedVariants
      });
    }
    
    // Save cart
    await cart.save();
    
    // Populate product details
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price images stockQuantity sku'
    });
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Add to cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding to cart' 
    });
  }
});

// @route   PUT /api/cart/items/:itemId
// @desc    Update cart item quantity
// @access  Private
router.put('/items/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    const { quantity, selectedVariants } = req.body;
    
    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }
    
    // Find item in cart
    const itemIndex = cart.items.findIndex(
      item => item._id.toString() === itemId
    );
    
    if (itemIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Item not found in cart' 
      });
    }
    
    // Get product to check stock
    const product = await Product.findById(cart.items[itemIndex].product);
    
    if (!product) {
      return res.status(404).json({ 
        success: false, 
        message: 'Product not found' 
      });
    }
    
    // Check if product is in stock
    if (product.stockQuantity < quantity) {
      return res.status(400).json({ 
        success: false, 
        message: 'Not enough stock available' 
      });
    }
    
    // Update quantity
    cart.items[itemIndex].quantity = quantity;
    
    // Update selected variants if provided
    if (selectedVariants) {
      cart.items[itemIndex].selectedVariants = selectedVariants;
    }
    
    // Save cart
    await cart.save();
    
    // Populate product details
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price images stockQuantity sku'
    });
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Update cart item error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating cart item' 
    });
  }
});

// @route   DELETE /api/cart/items/:itemId
// @desc    Remove item from cart
// @access  Private
router.delete('/items/:itemId', auth, async (req, res) => {
  try {
    const { itemId } = req.params;
    
    // Find user's cart
    let cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }
    
    // Remove item from cart
    cart.items = cart.items.filter(
      item => item._id.toString() !== itemId
    );
    
    // Save cart
    await cart.save();
    
    // Populate product details
    cart = await Cart.findById(cart._id).populate({
      path: 'items.product',
      select: 'name slug price images stockQuantity sku'
    });
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Remove cart item error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while removing cart item' 
    });
  }
});

// @route   DELETE /api/cart
// @desc    Clear cart
// @access  Private
router.delete('/', auth, async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }
    
    // Clear cart items
    cart.items = [];
    cart.couponCode = null;
    
    // Save cart
    await cart.save();
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Clear cart error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while clearing cart' 
    });
  }
});

// @route   POST /api/cart/coupon
// @desc    Apply coupon to cart
// @access  Private
router.post('/coupon', auth, async (req, res) => {
  try {
    const { couponCode } = req.body;
    
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate({
        path: 'items.product',
        select: 'name slug price images stockQuantity sku categories'
      });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }
    
    // Find coupon
    const coupon = await Coupon.findOne({
      code: couponCode.toUpperCase(),
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
    
    // Calculate cart subtotal
    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.price.amount * item.quantity);
    }, 0);
    
    // Check minimum purchase
    if (subtotal < coupon.minPurchase) {
      return res.status(400).json({ 
        success: false, 
        message: `Minimum purchase of $${coupon.minPurchase} required for this coupon` 
      });
    }
    
    // Check if coupon is applicable to products in cart
    if (coupon.applicableProducts.length > 0 || coupon.applicableCategories.length > 0) {
      const productIds = cart.items.map(item => item.product._id.toString());
      const categoryIds = cart.items.flatMap(item => 
        item.product.categories ? item.product.categories.map(cat => cat.toString()) : []
      );
      
      const hasApplicableProduct = coupon.applicableProducts.some(id => 
        productIds.includes(id.toString())
      );
      
      const hasApplicableCategory = coupon.applicableCategories.some(id => 
        categoryIds.includes(id.toString())
      );
      
      if (!hasApplicableProduct && !hasApplicableCategory) {
        return res.status(400).json({ 
          success: false, 
          message: 'Coupon not applicable to items in your cart' 
        });
      }
    }
    
    // Apply coupon to cart
    cart.couponCode = couponCode.toUpperCase();
    await cart.save();
    
    // Increment coupon usage count
    coupon.usageCount += 1;
    await coupon.save();
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Apply coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while applying coupon' 
    });
  }
});

// @route   DELETE /api/cart/coupon
// @desc    Remove coupon from cart
// @access  Private
router.delete('/coupon', auth, async (req, res) => {
  try {
    // Find user's cart
    const cart = await Cart.findOne({ user: req.user.id });
    
    if (!cart) {
      return res.status(404).json({ 
        success: false, 
        message: 'Cart not found' 
      });
    }
    
    // Remove coupon
    cart.couponCode = null;
    await cart.save();
    
    res.json({
      success: true,
      cart
    });
  } catch (error) {
    console.error('Remove coupon error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while removing coupon' 
    });
  }
});

export default router;
