import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import Coupon from '../models/Coupon.js';
import { auth, adminAuth, staffAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/orders
// @desc    Get user's orders
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const {
      status,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = { user: req.user.id };

    // Filter by order status
    if (status) {
      query.orderStatus = status;
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('user', 'firstName lastName email');

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/admin
// @desc    Get all orders (admin)
// @access  Private (Admin/Staff)
router.get('/admin', staffAuth, async (req, res) => {
  try {
    const {
      status,
      paymentStatus,
      startDate,
      endDate,
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;

    // Build query
    const query = {};

    // Filter by order status
    if (status) {
      query.orderStatus = status;
    }

    // Filter by payment status
    if (paymentStatus) {
      query.paymentStatus = paymentStatus;
    }

    // Filter by date range
    if (startDate || endDate) {
      query.createdAt = {};
      if (startDate) {
        query.createdAt.$gte = new Date(startDate);
      }
      if (endDate) {
        query.createdAt.$lte = new Date(endDate);
      }
    }

    // Execute query with pagination
    const orders = await Order.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('user', 'firstName lastName email');

    // Get total count for pagination
    const total = await Order.countDocuments(query);

    res.json({
      success: true,
      orders,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get admin orders error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching orders'
    });
  }
});

// @route   GET /api/orders/:id
// @desc    Get order by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order ID'
      });
    }

    // Find order
    const order = await Order.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('items.product', 'name slug images');

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    // Check if user is authorized to view this order
    if (req.user.role !== 'admin' && req.user.role !== 'manager' &&
        order.user._id.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this order'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Get order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching order'
    });
  }
});

// @route   POST /api/orders
// @desc    Create a new order
// @access  Private
router.post('/', auth, async (req, res) => {
  try {
    const {
      shippingAddress,
      billingAddress,
      paymentMethod,
      shippingMethod,
      notes
    } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ user: req.user.id })
      .populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Your cart is empty'
      });
    }

    // Check if all products are in stock
    for (const item of cart.items) {
      const product = item.product;

      if (product.stockQuantity < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock. Only ${product.stockQuantity} available.`
        });
      }
    }

    // Calculate order totals
    let subtotal = 0;
    const orderItems = [];

    for (const item of cart.items) {
      const product = item.product;
      const price = product.price.amount;
      const itemTotal = price * item.quantity;

      subtotal += itemTotal;

      orderItems.push({
        product: product._id,
        name: product.name,
        quantity: item.quantity,
        price: {
          amount: price,
          currency: product.price.currency
        },
        selectedVariants: item.selectedVariants,
        sku: product.sku,
        image: product.images[0]?.url || ''
      });

      // Update product stock
      await Product.findByIdAndUpdate(product._id, {
        $inc: { stockQuantity: -item.quantity }
      });
    }

    // Apply coupon if exists
    let discount = { amount: 0, currency: 'USD', code: null };

    if (cart.couponCode) {
      const coupon = await Coupon.findOne({
        code: cart.couponCode,
        isActive: true,
        validFrom: { $lte: new Date() },
        validUntil: { $gte: new Date() }
      });

      if (coupon) {
        if (coupon.type === 'percentage') {
          discount.amount = (subtotal * coupon.value) / 100;
        } else {
          discount.amount = coupon.value;
        }

        // Apply max discount if set
        if (coupon.maxDiscount && discount.amount > coupon.maxDiscount) {
          discount.amount = coupon.maxDiscount;
        }

        discount.code = coupon.code;
      }
    }

    // Calculate tax (example: 10%)
    const taxRate = 0.1;
    const tax = {
      amount: subtotal * taxRate,
      currency: 'USD'
    };

    // Calculate shipping cost based on method
    let shippingCost = 0;

    switch (shippingMethod) {
      case 'standard':
        shippingCost = 5.99;
        break;
      case 'express':
        shippingCost = 14.99;
        break;
      case 'overnight':
        shippingCost = 24.99;
        break;
      default:
        shippingCost = 5.99;
    }

    const shipping = {
      amount: shippingCost,
      currency: 'USD',
      method: shippingMethod || 'standard'
    };

    // Calculate total
    const total = {
      amount: subtotal + tax.amount + shipping.amount - discount.amount,
      currency: 'USD'
    };

    // Create new order
    const order = new Order({
      user: req.user.id,
      items: orderItems,
      subtotal: {
        amount: subtotal,
        currency: 'USD'
      },
      tax,
      shipping,
      discount,
      total,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes
    });

    // Save order
    await order.save();

    // Clear cart
    cart.items = [];
    cart.couponCode = null;
    await cart.save();

    res.status(201).json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Create order error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating order'
    });
  }
});

// @route   PUT /api/orders/:id/status
// @desc    Update order status
// @access  Private (Admin/Staff)
router.put('/:id/status', staffAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { orderStatus } = req.body;

    // Validate status
    const validStatuses = ['pending', 'processing', 'shipped', 'delivered', 'cancelled', 'returned'];

    if (!validStatuses.includes(orderStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid order status'
      });
    }

    // Find and update order
    const order = await Order.findByIdAndUpdate(
      id,
      { orderStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Update order status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating order status'
    });
  }
});

// @route   PUT /api/orders/:id/payment
// @desc    Update payment status
// @access  Private (Admin/Staff)
router.put('/:id/payment', staffAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { paymentStatus } = req.body;

    // Validate status
    const validStatuses = ['pending', 'paid', 'failed', 'refunded', 'partially_refunded'];

    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid payment status'
      });
    }

    // Find and update order
    const order = await Order.findByIdAndUpdate(
      id,
      { paymentStatus },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    res.json({
      success: true,
      order
    });
  } catch (error) {
    console.error('Update payment status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating payment status'
    });
  }
});

export default router;
