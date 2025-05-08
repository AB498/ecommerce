import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import { auth, adminAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/users/profile
// @desc    Get current user profile
// @access  Private
router.get('/profile', auth, async (req, res) => {
  try {
    // User is already available in req.user from auth middleware
    res.json({
      success: true,
      user: req.user
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching profile' 
    });
  }
});

// @route   PUT /api/users/profile
// @desc    Update user profile
// @access  Private
router.put('/profile', auth, async (req, res) => {
  try {
    const { firstName, lastName, phone, preferences } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (phone) user.phone = phone;
    if (preferences) {
      user.preferences = {
        ...user.preferences,
        ...preferences
      };
    }
    
    // Save user
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(req.user.id).select('-password');
    
    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating profile' 
    });
  }
});

// @route   PUT /api/users/password
// @desc    Update user password
// @access  Private
router.put('/password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    
    // Validate input
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password and new password are required' 
      });
    }
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Check current password
    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      return res.status(400).json({ 
        success: false, 
        message: 'Current password is incorrect' 
      });
    }
    
    // Update password
    user.password = newPassword;
    await user.save();
    
    res.json({
      success: true,
      message: 'Password updated successfully'
    });
  } catch (error) {
    console.error('Update password error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating password' 
    });
  }
});

// @route   GET /api/users/addresses
// @desc    Get user addresses
// @access  Private
router.get('/addresses', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('addresses');
    
    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Get addresses error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching addresses' 
    });
  }
});

// @route   POST /api/users/addresses
// @desc    Add a new address
// @access  Private
router.post('/addresses', auth, async (req, res) => {
  try {
    const { 
      type, 
      name, 
      street, 
      city, 
      state, 
      postalCode, 
      country, 
      phone, 
      isDefault 
    } = req.body;
    
    // Validate required fields
    if (!type || !name || !street || !city || !state || !postalCode || !phone) {
      return res.status(400).json({ 
        success: false, 
        message: 'All fields are required' 
      });
    }
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Create new address
    const newAddress = {
      type,
      name,
      street,
      city,
      state,
      postalCode,
      country: country || 'US',
      phone,
      isDefault: isDefault || false
    };
    
    // If this is the first address or isDefault is true, update other addresses
    if (isDefault || user.addresses.length === 0) {
      // Set all addresses of the same type to not default
      user.addresses.forEach(address => {
        if (address.type === type) {
          address.isDefault = false;
        }
      });
      
      // Set new address as default
      newAddress.isDefault = true;
    }
    
    // Add address to user
    user.addresses.push(newAddress);
    
    // Save user
    await user.save();
    
    res.status(201).json({
      success: true,
      address: newAddress,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Add address error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while adding address' 
    });
  }
});

// @route   PUT /api/users/addresses/:id
// @desc    Update an address
// @access  Private
router.put('/addresses/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { 
      type, 
      name, 
      street, 
      city, 
      state, 
      postalCode, 
      country, 
      phone, 
      isDefault 
    } = req.body;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Find address
    const addressIndex = user.addresses.findIndex(
      address => address._id.toString() === id
    );
    
    if (addressIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Address not found' 
      });
    }
    
    // Update address fields
    if (type) user.addresses[addressIndex].type = type;
    if (name) user.addresses[addressIndex].name = name;
    if (street) user.addresses[addressIndex].street = street;
    if (city) user.addresses[addressIndex].city = city;
    if (state) user.addresses[addressIndex].state = state;
    if (postalCode) user.addresses[addressIndex].postalCode = postalCode;
    if (country) user.addresses[addressIndex].country = country;
    if (phone) user.addresses[addressIndex].phone = phone;
    
    // Handle default status
    if (isDefault) {
      // Set all addresses of the same type to not default
      user.addresses.forEach(address => {
        if (address.type === user.addresses[addressIndex].type) {
          address.isDefault = false;
        }
      });
      
      // Set this address as default
      user.addresses[addressIndex].isDefault = true;
    }
    
    // Save user
    await user.save();
    
    res.json({
      success: true,
      address: user.addresses[addressIndex],
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Update address error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating address' 
    });
  }
});

// @route   DELETE /api/users/addresses/:id
// @desc    Delete an address
// @access  Private
router.delete('/addresses/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find user
    const user = await User.findById(req.user.id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Find address
    const addressIndex = user.addresses.findIndex(
      address => address._id.toString() === id
    );
    
    if (addressIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: 'Address not found' 
      });
    }
    
    // Check if this is a default address
    const isDefault = user.addresses[addressIndex].isDefault;
    const addressType = user.addresses[addressIndex].type;
    
    // Remove address
    user.addresses.splice(addressIndex, 1);
    
    // If this was a default address, set a new default
    if (isDefault && user.addresses.length > 0) {
      const sameTypeAddresses = user.addresses.filter(
        address => address.type === addressType
      );
      
      if (sameTypeAddresses.length > 0) {
        sameTypeAddresses[0].isDefault = true;
      }
    }
    
    // Save user
    await user.save();
    
    res.json({
      success: true,
      addresses: user.addresses
    });
  } catch (error) {
    console.error('Delete address error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while deleting address' 
    });
  }
});

// @route   GET /api/users
// @desc    Get all users (admin)
// @access  Private (Admin)
router.get('/', adminAuth, async (req, res) => {
  try {
    const { 
      search, 
      role, 
      isActive, 
      sort = '-createdAt',
      page = 1,
      limit = 20
    } = req.query;
    
    // Build query
    const query = {};
    
    // Search by name or email
    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }
    
    // Filter by role
    if (role) {
      query.role = role;
    }
    
    // Filter by active status
    if (isActive === 'true') {
      query.isActive = true;
    } else if (isActive === 'false') {
      query.isActive = false;
    }
    
    // Execute query with pagination
    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit));
    
    // Get total count for pagination
    const total = await User.countDocuments(query);
    
    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching users' 
    });
  }
});

// @route   GET /api/users/:id
// @desc    Get user by ID (admin)
// @access  Private (Admin)
router.get('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find user
    const user = await User.findById(id).select('-password');
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    res.json({
      success: true,
      user
    });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching user' 
    });
  }
});

// @route   PUT /api/users/:id
// @desc    Update user (admin)
// @access  Private (Admin)
router.put('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const { firstName, lastName, email, username, role, isActive } = req.body;
    
    // Find user
    const user = await User.findById(id);
    
    if (!user) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }
    
    // Check if email is already taken
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email });
      if (emailExists) {
        return res.status(400).json({ 
          success: false, 
          message: 'Email is already taken' 
        });
      }
      user.email = email;
    }
    
    // Check if username is already taken
    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) {
        return res.status(400).json({ 
          success: false, 
          message: 'Username is already taken' 
        });
      }
      user.username = username;
    }
    
    // Update user fields
    if (firstName) user.firstName = firstName;
    if (lastName) user.lastName = lastName;
    if (role) user.role = role;
    if (isActive !== undefined) user.isActive = isActive;
    
    // Save user
    await user.save();
    
    // Return updated user without password
    const updatedUser = await User.findById(id).select('-password');
    
    res.json({
      success: true,
      user: updatedUser
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while updating user' 
    });
  }
});

export default router;
