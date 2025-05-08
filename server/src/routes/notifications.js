import express from 'express';
import mongoose from 'mongoose';
import Notification from '../models/Notification.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/notifications
// @desc    Get user's notifications
// @access  Private
router.get('/', auth, async (req, res) => {
  try {
    const { page = 1, limit = 20, unread } = req.query;
    
    // Build query
    const query = { user: req.user.id };
    
    // Filter by read status
    if (unread === 'true') {
      query.isRead = false;
    }
    
    // Execute query with pagination
    const notifications = await Notification.find(query)
      .sort('-createdAt')
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await Notification.countDocuments(query);
    
    // Get unread count
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });
    
    res.json({
      success: true,
      notifications,
      unreadCount,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get notifications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching notifications' 
    });
  }
});

// @route   GET /api/notifications/unread-count
// @desc    Get user's unread notification count
// @access  Private
router.get('/unread-count', auth, async (req, res) => {
  try {
    // Get unread count
    const unreadCount = await Notification.countDocuments({
      user: req.user.id,
      isRead: false
    });
    
    res.json({
      success: true,
      unreadCount
    });
  } catch (error) {
    console.error('Get unread count error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching unread count' 
    });
  }
});

// @route   PUT /api/notifications/:id/read
// @desc    Mark notification as read
// @access  Private
router.put('/:id/read', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find notification
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    // Check if user is authorized to update this notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to update this notification' 
      });
    }
    
    // Update notification
    notification.isRead = true;
    await notification.save();
    
    res.json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Mark notification as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating notification' 
    });
  }
});

// @route   PUT /api/notifications/read-all
// @desc    Mark all notifications as read
// @access  Private
router.put('/read-all', auth, async (req, res) => {
  try {
    // Update all unread notifications
    await Notification.updateMany(
      { user: req.user.id, isRead: false },
      { isRead: true }
    );
    
    res.json({
      success: true,
      message: 'All notifications marked as read'
    });
  } catch (error) {
    console.error('Mark all notifications as read error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating notifications' 
    });
  }
});

// @route   DELETE /api/notifications/:id
// @desc    Delete a notification
// @access  Private
router.delete('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find notification
    const notification = await Notification.findById(id);
    
    if (!notification) {
      return res.status(404).json({ 
        success: false, 
        message: 'Notification not found' 
      });
    }
    
    // Check if user is authorized to delete this notification
    if (notification.user.toString() !== req.user.id) {
      return res.status(403).json({ 
        success: false, 
        message: 'Not authorized to delete this notification' 
      });
    }
    
    // Delete notification
    await Notification.findByIdAndDelete(id);
    
    res.json({
      success: true,
      message: 'Notification deleted successfully'
    });
  } catch (error) {
    console.error('Delete notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting notification' 
    });
  }
});

// @route   DELETE /api/notifications/clear-all
// @desc    Delete all notifications
// @access  Private
router.delete('/clear-all', auth, async (req, res) => {
  try {
    // Delete all user's notifications
    await Notification.deleteMany({ user: req.user.id });
    
    res.json({
      success: true,
      message: 'All notifications cleared'
    });
  } catch (error) {
    console.error('Clear all notifications error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while clearing notifications' 
    });
  }
});

// @route   POST /api/notifications/admin
// @desc    Create a notification for a user (admin)
// @access  Private (Admin)
router.post('/admin', adminAuth, async (req, res) => {
  try {
    const { userId, title, message, type, link, metadata } = req.body;
    
    // Validate required fields
    if (!userId || !title || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'User ID, title, and message are required' 
      });
    }
    
    // Create new notification
    const notification = new Notification({
      user: userId,
      title,
      message,
      type: type || 'system',
      link,
      metadata
    });
    
    // Save notification
    await notification.save();
    
    res.status(201).json({
      success: true,
      notification
    });
  } catch (error) {
    console.error('Create notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while creating notification' 
    });
  }
});

// @route   POST /api/notifications/broadcast
// @desc    Broadcast a notification to all users (admin)
// @access  Private (Admin)
router.post('/broadcast', adminAuth, async (req, res) => {
  try {
    const { title, message, type, link, metadata, roles } = req.body;
    
    // Validate required fields
    if (!title || !message) {
      return res.status(400).json({ 
        success: false, 
        message: 'Title and message are required' 
      });
    }
    
    // Build query for users
    const query = {};
    
    // Filter by roles if provided
    if (roles && roles.length > 0) {
      query.role = { $in: roles };
    }
    
    // Get all users
    const User = mongoose.model('User');
    const users = await User.find(query).select('_id');
    
    // Create notifications for all users
    const notifications = users.map(user => ({
      user: user._id,
      title,
      message,
      type: type || 'system',
      link,
      metadata
    }));
    
    // Save notifications
    await Notification.insertMany(notifications);
    
    res.status(201).json({
      success: true,
      message: `Notification broadcast to ${users.length} users`
    });
  } catch (error) {
    console.error('Broadcast notification error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while broadcasting notification' 
    });
  }
});

export default router;
