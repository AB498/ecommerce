import express from 'express';
import authRoutes from './auth.js';
import productRoutes from './products.js';
import orderRoutes from './orders.js';
import cartRoutes from './cart.js';
import wishlistRoutes from './wishlist.js';
import reviewRoutes from './reviews.js';
import userRoutes from './users.js';
import paymentRoutes from './payments.js';
import couponRoutes from './coupons.js';
import categoryRoutes from './categories.js';
import blogRoutes from './blog.js';
import faqRoutes from './faq.js';
import adminRoutes from './admin.js';
import notificationRoutes from './notifications.js';

const router = express.Router();

// API Routes
router.use('/auth', authRoutes);
router.use('/products', productRoutes);
router.use('/orders', orderRoutes);
router.use('/cart', cartRoutes);
router.use('/wishlist', wishlistRoutes);
router.use('/reviews', reviewRoutes);
router.use('/users', userRoutes);
router.use('/payments', paymentRoutes);
router.use('/coupons', couponRoutes);
router.use('/categories', categoryRoutes);
router.use('/blog', blogRoutes);
router.use('/faq', faqRoutes);
router.use('/admin', adminRoutes);
router.use('/notifications', notificationRoutes);

export default router;
