import express from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order.js';
import Payment from '../models/Payment.js';
import { auth, adminAuth, staffAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/payments/user
// @desc    Get user's payments
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user.id })
      .sort('-createdAt')
      .populate('order', 'orderNumber total.amount orderStatus');
    
    res.json({
      success: true,
      payments
    });
  } catch (error) {
    console.error('Get payments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching payments' 
    });
  }
});

// @route   GET /api/payments/admin
// @desc    Get all payments (admin)
// @access  Private (Admin/Staff)
router.get('/admin', staffAuth, async (req, res) => {
  try {
    const { 
      status, 
      method, 
      startDate, 
      endDate, 
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;
    
    // Build query
    const query = {};
    
    // Filter by payment status
    if (status) {
      query.status = status;
    }
    
    // Filter by payment method
    if (method) {
      query.method = method;
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
    const payments = await Payment.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('user', 'firstName lastName email')
      .populate('order', 'orderNumber total.amount orderStatus');
    
    // Get total count for pagination
    const total = await Payment.countDocuments(query);
    
    res.json({
      success: true,
      payments,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get admin payments error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching payments' 
    });
  }
});

// @route   GET /api/payments/:id
// @desc    Get payment by ID
// @access  Private
router.get('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find payment
    const payment = await Payment.findById(id)
      .populate('user', 'firstName lastName email')
      .populate('order', 'orderNumber total.amount orderStatus items shippingAddress');
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }
    
    // Check if user is authorized to view this payment
    if (payment.user._id.toString() !== req.user.id && 
        req.user.role !== 'admin' && 
        req.user.role !== 'manager') {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to view this payment' 
      });
    }
    
    res.json({
      success: true,
      payment
    });
  } catch (error) {
    console.error('Get payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching payment' 
    });
  }
});

// @route   POST /api/payments/process
// @desc    Process a payment
// @access  Private
router.post('/process', auth, async (req, res) => {
  try {
    const { 
      orderId, 
      method, 
      amount, 
      currency = 'USD',
      transactionId,
      paymentDetails,
      billingAddress
    } = req.body;
    
    // Validate required fields
    if (!orderId || !method || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Order ID, payment method, and amount are required' 
      });
    }
    
    // Find order
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ 
        success: false, 
        message: 'Order not found' 
      });
    }
    
    // Check if user is authorized to pay for this order
    if (order.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to pay for this order' 
      });
    }
    
    // Check if order is already paid
    if (order.paymentStatus === 'paid') {
      return res.status(400).json({ 
        success: false, 
        message: 'Order is already paid' 
      });
    }
    
    // Create new payment
    const payment = new Payment({
      order: orderId,
      user: req.user.id,
      amount,
      currency,
      method,
      status: 'completed', // Assuming payment is successful
      transactionId,
      paymentDetails,
      billingAddress: billingAddress || order.billingAddress
    });
    
    // Save payment
    await payment.save();
    
    // Update order payment status
    order.paymentStatus = 'paid';
    
    // If order is pending, update to processing
    if (order.orderStatus === 'pending') {
      order.orderStatus = 'processing';
    }
    
    // Save order
    await order.save();
    
    res.status(201).json({
      success: true,
      payment,
      order
    });
  } catch (error) {
    console.error('Process payment error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while processing payment' 
    });
  }
});

// @route   POST /api/payments/refund
// @desc    Process a refund
// @access  Private (Admin/Staff)
router.post('/refund', staffAuth, async (req, res) => {
  try {
    const { 
      paymentId, 
      amount, 
      reason
    } = req.body;
    
    // Validate required fields
    if (!paymentId || !amount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Payment ID and refund amount are required' 
      });
    }
    
    // Find payment
    const payment = await Payment.findById(paymentId);
    
    if (!payment) {
      return res.status(404).json({ 
        success: false, 
        message: 'Payment not found' 
      });
    }
    
    // Check if payment can be refunded
    if (payment.status !== 'completed') {
      return res.status(400).json({ 
        success: false, 
        message: 'Only completed payments can be refunded' 
      });
    }
    
    // Check if refund amount is valid
    if (amount > payment.amount - payment.refundAmount) {
      return res.status(400).json({ 
        success: false, 
        message: 'Refund amount exceeds available amount' 
      });
    }
    
    // Update payment
    payment.refundAmount += amount;
    payment.refundReason = reason;
    payment.refundDate = Date.now();
    
    // Update payment status
    if (payment.refundAmount === payment.amount) {
      payment.status = 'refunded';
    } else if (payment.refundAmount > 0) {
      payment.status = 'partially_refunded';
    }
    
    // Save payment
    await payment.save();
    
    // Update order payment status
    const order = await Order.findById(payment.order);
    
    if (order) {
      if (payment.status === 'refunded') {
        order.paymentStatus = 'refunded';
      } else if (payment.status === 'partially_refunded') {
        order.paymentStatus = 'partially_refunded';
      }
      
      // Save order
      await order.save();
    }
    
    res.json({
      success: true,
      payment,
      order
    });
  } catch (error) {
    console.error('Process refund error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while processing refund' 
    });
  }
});

export default router;
