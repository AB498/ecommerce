import express from 'express';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Product from '../models/Product.js';
import Order from '../models/Order.js';
import Category from '../models/Category.js';
import { adminAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/admin/dashboard
// @desc    Get dashboard statistics
// @access  Private (Admin)
router.get('/dashboard', adminAuth, async (req, res) => {
  try {
    // Get date range (default: last 30 days)
    const { period = '30d' } = req.query;
    
    let startDate = new Date();
    
    switch (period) {
      case '7d':
        startDate.setDate(startDate.getDate() - 7);
        break;
      case '30d':
        startDate.setDate(startDate.getDate() - 30);
        break;
      case '90d':
        startDate.setDate(startDate.getDate() - 90);
        break;
      case '1y':
        startDate.setFullYear(startDate.getFullYear() - 1);
        break;
      default:
        startDate.setDate(startDate.getDate() - 30);
    }
    
    // Get total users
    const totalUsers = await User.countDocuments();
    
    // Get new users in period
    const newUsers = await User.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    // Get total products
    const totalProducts = await Product.countDocuments();
    
    // Get low stock products
    const lowStockProducts = await Product.countDocuments({
      stockQuantity: { $lte: 5 },
      isActive: true
    });
    
    // Get total orders
    const totalOrders = await Order.countDocuments();
    
    // Get orders in period
    const newOrders = await Order.countDocuments({
      createdAt: { $gte: startDate }
    });
    
    // Get revenue statistics
    const revenueStats = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total.amount' },
          averageOrderValue: { $avg: '$total.amount' },
          count: { $sum: 1 }
        }
      }
    ]);
    
    const revenue = revenueStats.length > 0 ? revenueStats[0] : {
      totalRevenue: 0,
      averageOrderValue: 0,
      count: 0
    };
    
    // Get order status distribution
    const orderStatusStats = await Order.aggregate([
      {
        $group: {
          _id: '$orderStatus',
          count: { $sum: 1 }
        }
      }
    ]);
    
    const orderStatusDistribution = {};
    orderStatusStats.forEach(status => {
      orderStatusDistribution[status._id] = status.count;
    });
    
    // Get daily revenue for chart
    const dailyRevenue = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          revenue: { $sum: '$total.amount' },
          orders: { $sum: 1 }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get top selling products
    const topProducts = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: startDate }
        }
      },
      {
        $unwind: '$items'
      },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.price.amount', '$items.quantity'] } }
        }
      },
      {
        $sort: { totalQuantity: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    // Get top categories
    const topCategories = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'categories',
          as: 'products'
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          productCount: { $size: '$products' }
        }
      },
      {
        $sort: { productCount: -1 }
      },
      {
        $limit: 5
      }
    ]);
    
    res.json({
      success: true,
      stats: {
        users: {
          total: totalUsers,
          new: newUsers
        },
        products: {
          total: totalProducts,
          lowStock: lowStockProducts
        },
        orders: {
          total: totalOrders,
          new: newOrders,
          statusDistribution: orderStatusDistribution
        },
        revenue: {
          total: revenue.totalRevenue,
          averageOrderValue: revenue.averageOrderValue,
          count: revenue.count
        },
        charts: {
          dailyRevenue
        },
        topProducts,
        topCategories
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while fetching dashboard statistics' 
    });
  }
});

// @route   GET /api/admin/sales-report
// @desc    Get sales report
// @access  Private (Admin)
router.get('/sales-report', adminAuth, async (req, res) => {
  try {
    const { 
      startDate, 
      endDate, 
      groupBy = 'day' 
    } = req.query;
    
    // Validate date range
    if (!startDate || !endDate) {
      return res.status(400).json({ 
        success: false, 
        message: 'Start date and end date are required' 
      });
    }
    
    // Parse dates
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    // Validate groupBy
    const validGroupBy = ['day', 'week', 'month'];
    if (!validGroupBy.includes(groupBy)) {
      return res.status(400).json({ 
        success: false, 
        message: 'Invalid groupBy parameter. Must be day, week, or month.' 
      });
    }
    
    // Define date format based on groupBy
    let dateFormat;
    switch (groupBy) {
      case 'day':
        dateFormat = '%Y-%m-%d';
        break;
      case 'week':
        dateFormat = '%Y-%U'; // Year-Week
        break;
      case 'month':
        dateFormat = '%Y-%m';
        break;
    }
    
    // Get sales data
    const salesData = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: dateFormat, date: '$createdAt' } },
          revenue: { $sum: '$total.amount' },
          orders: { $sum: 1 },
          items: { $sum: { $size: '$items' } }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Get summary
    const summary = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$total.amount' },
          totalOrders: { $sum: 1 },
          averageOrderValue: { $avg: '$total.amount' }
        }
      }
    ]);
    
    // Get payment method distribution
    const paymentMethods = await Order.aggregate([
      {
        $match: {
          createdAt: { $gte: start, $lte: end },
          paymentStatus: 'paid'
        }
      },
      {
        $group: {
          _id: '$paymentMethod',
          count: { $sum: 1 },
          revenue: { $sum: '$total.amount' }
        }
      },
      {
        $sort: { revenue: -1 }
      }
    ]);
    
    res.json({
      success: true,
      report: {
        salesData,
        summary: summary.length > 0 ? summary[0] : {
          totalRevenue: 0,
          totalOrders: 0,
          averageOrderValue: 0
        },
        paymentMethods
      }
    });
  } catch (error) {
    console.error('Sales report error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while generating sales report' 
    });
  }
});

// @route   GET /api/admin/inventory-report
// @desc    Get inventory report
// @access  Private (Admin)
router.get('/inventory-report', adminAuth, async (req, res) => {
  try {
    // Get low stock products
    const lowStockProducts = await Product.find({
      stockQuantity: { $lte: 5 },
      isActive: true
    })
      .select('name slug stockQuantity price.amount images')
      .sort('stockQuantity');
    
    // Get out of stock products
    const outOfStockProducts = await Product.find({
      stockQuantity: 0,
      isActive: true
    })
      .select('name slug stockQuantity price.amount images')
      .sort('updatedAt');
    
    // Get inventory value
    const inventoryValue = await Product.aggregate([
      {
        $group: {
          _id: null,
          totalValue: { $sum: { $multiply: ['$price.amount', '$stockQuantity'] } },
          totalProducts: { $sum: 1 },
          totalItems: { $sum: '$stockQuantity' }
        }
      }
    ]);
    
    // Get inventory by category
    const inventoryByCategory = await Category.aggregate([
      {
        $lookup: {
          from: 'products',
          localField: '_id',
          foreignField: 'categories',
          as: 'products'
        }
      },
      {
        $unwind: '$products'
      },
      {
        $group: {
          _id: '$_id',
          name: { $first: '$name' },
          slug: { $first: '$slug' },
          totalProducts: { $sum: 1 },
          totalItems: { $sum: '$products.stockQuantity' },
          totalValue: { $sum: { $multiply: ['$products.price.amount', '$products.stockQuantity'] } }
        }
      },
      {
        $sort: { totalValue: -1 }
      }
    ]);
    
    res.json({
      success: true,
      report: {
        lowStockProducts,
        outOfStockProducts,
        inventoryValue: inventoryValue.length > 0 ? inventoryValue[0] : {
          totalValue: 0,
          totalProducts: 0,
          totalItems: 0
        },
        inventoryByCategory
      }
    });
  } catch (error) {
    console.error('Inventory report error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error while generating inventory report' 
    });
  }
});

export default router;
