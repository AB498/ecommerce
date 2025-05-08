import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';
import Coupon from '../models/Coupon.js';
import { seedUsers } from './userSeeds.js';
import { seedCategories } from './categorySeeds.js';
import { seedProducts } from './productSeeds.js';
import { seedCoupons } from './couponSeeds.js';

// Load environment variables
dotenv.config();

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ecommerce')
  .then(() => console.log('MongoDB connected for seeding'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

// Seed database
const seedDatabase = async () => {
  try {
    // Clear existing data
    await User.deleteMany({});
    await Category.deleteMany({});
    await Product.deleteMany({});
    await Coupon.deleteMany({});
    
    console.log('Existing data cleared');
    
    // Seed users
    const users = await seedUsers();
    console.log(`${users.length} users seeded`);
    
    // Seed categories
    const categories = await seedCategories();
    console.log(`${categories.length} categories seeded`);
    
    // Seed products
    const products = await seedProducts(categories);
    console.log(`${products.length} products seeded`);
    
    // Seed coupons
    const coupons = await seedCoupons(products, categories);
    console.log(`${coupons.length} coupons seeded`);
    
    console.log('Database seeded successfully');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
