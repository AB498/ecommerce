import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Middleware to authenticate user with JWT
export const auth = async (req, res, next) => {
  try {
    // Get token from header
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'No authentication token, access denied' 
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    
    // Find user by id
    const user = await User.findById(decoded.id).select('-password');
    
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token is valid, but user no longer exists' 
      });
    }
    
    if (!user.isActive) {
      return res.status(403).json({ 
        success: false, 
        message: 'User account is deactivated' 
      });
    }
    
    // Add user to request object
    req.user = user;
    req.token = token;
    
    next();
  } catch (error) {
    res.status(401).json({ 
      success: false, 
      message: 'Invalid authentication token' 
    });
  }
};

// Middleware to check if user is admin
export const adminAuth = async (req, res, next) => {
  try {
    // First run the auth middleware
    await auth(req, res, () => {
      // Check if user is admin
      if (req.user && req.user.role === 'admin') {
        next();
      } else {
        res.status(403).json({ 
          success: false, 
          message: 'Access denied. Admin privileges required' 
        });
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during admin authentication' 
    });
  }
};

// Middleware to check if user is admin or manager
export const staffAuth = async (req, res, next) => {
  try {
    // First run the auth middleware
    await auth(req, res, () => {
      // Check if user is admin or manager
      if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
        next();
      } else {
        res.status(403).json({ 
          success: false, 
          message: 'Access denied. Staff privileges required' 
        });
      }
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Server error during staff authentication' 
    });
  }
};
