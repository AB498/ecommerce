import express from 'express';
import mongoose from 'mongoose';
import Product from '../models/Product.js';
import Category from '../models/Category.js';
import { auth, adminAuth, staffAuth } from '../middleware/auth.js';

const router = express.Router();

// @route   GET /api/products/brands
// @desc    Get all unique brands
// @access  Public
router.get('/brands', async (req, res) => {
  try {
    // Find all unique brands that are not null or empty
    const brands = await Product.distinct('brand', {
      brand: { $ne: null },
      isActive: true
    });

    // Sort brands alphabetically
    const sortedBrands = brands
      .filter(brand => brand && brand.trim() !== '')
      .sort((a, b) => a.localeCompare(b));

    res.json({
      success: true,
      brands: sortedBrands
    });
  } catch (error) {
    console.error('Get brands error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching brands'
    });
  }
});

// @route   GET /api/products
// @desc    Get all products with filtering, sorting, and pagination
// @access  Public
router.get('/', async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      brand,
      inStock,
      onSale,
      featured,
      sort = '-createdAt',
      page = 1,
      limit = 10
    } = req.query;

    // Build query
    const query = {};

    // Search
    if (search) {
      // For short search terms (1-2 characters), use regex search
      if (search.length <= 2) {
        query.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { shortDescription: { $regex: search, $options: 'i' } },
          { brand: { $regex: search, $options: 'i' } },
          { 'tags': { $regex: search, $options: 'i' } }
        ];
      } else {
        // For longer search terms, use text index search
        query.$text = { $search: search };
      }
    }

    // Category filter
    if (category) {
      // Handle multiple category slugs
      const categoryValues = Array.isArray(category) ? category : [category];

      // Find all categories by slugs
      const categoryObjects = await Category.find({
        slug: { $in: categoryValues }
      });

      if (categoryObjects.length > 0) {
        // Get all category IDs and their subcategories
        const categoryIds = [];

        // Add the selected categories
        categoryIds.push(...categoryObjects.map(cat => cat._id));

        // Add subcategories for each selected category
        for (const cat of categoryObjects) {
          const subcategories = await Category.find({ parent: cat._id });
          categoryIds.push(...subcategories.map(subcat => subcat._id));
        }

        query.categories = { $in: categoryIds };
      }
    }

    // Price range
    if (minPrice || maxPrice) {
      query['price.amount'] = {};
      if (minPrice) query['price.amount'].$gte = Number(minPrice);
      if (maxPrice) query['price.amount'].$lte = Number(maxPrice);
    }

    // Brand filter
    if (brand) {
      query.brand = brand;
    }

    // Stock filter
    if (inStock === 'true') {
      query.stockQuantity = { $gt: 0 };
    }

    // Sale filter
    if (onSale === 'true') {
      query.onSale = true;
    }

    // Featured filter
    if (featured === 'true') {
      query.featured = true;
    }

    // Only show active products
    query.isActive = true;

    // Log the query for debugging
    console.log('Product search query:', JSON.stringify(query, null, 2));
    console.log('Sort:', sort, 'Page:', page, 'Limit:', limit);

    // Execute query with pagination
    const products = await Product.find(query)
      .sort(sort)
      .skip((Number(page) - 1) * Number(limit))
      .limit(Number(limit))
      .populate('categories', 'name slug');

    // Get total count for pagination
    const total = await Product.countDocuments(query);

    console.log(`Found ${total} products matching the query`);

    res.json({
      success: true,
      products,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get products error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching products'
    });
  }
});

// @route   GET /api/products/:id
// @desc    Get product by ID or slug
// @access  Public
router.get('/:idOrSlug', async (req, res) => {
  try {
    const { idOrSlug } = req.params;

    console.log('Product detail request received for:', idOrSlug);

    if (!idOrSlug) {
      console.error('Missing idOrSlug parameter');
      return res.status(400).json({
        success: false,
        message: 'Missing product ID or slug'
      });
    }

    let product;

    // Check if the parameter is a valid MongoDB ID
    if (mongoose.Types.ObjectId.isValid(idOrSlug)) {
      console.log('Looking up product by ID:', idOrSlug);
      product = await Product.findById(idOrSlug)
        .populate('categories', 'name slug')
        .populate('relatedProducts', 'name slug price images stockQuantity');
    } else {
      // If not a valid ID, try to find by slug
      console.log('Looking up product by slug:', idOrSlug);
      product = await Product.findOne({ slug: idOrSlug })
        .populate('categories', 'name slug')
        .populate('relatedProducts', 'name slug price images stockQuantity');
    }

    if (!product) {
      console.log('Product not found for:', idOrSlug);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('Product found:', product.name, '(ID:', product._id, ')');
    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching product'
    });
  }
});

// @route   POST /api/products
// @desc    Create a new product
// @access  Private (Admin/Staff)
router.post('/', staffAuth, async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      price,
      categories,
      tags,
      images,
      stockQuantity,
      sku,
      barcode,
      weight,
      dimensions,
      specifications,
      variants,
      brand,
      featured,
      onSale,
      seo
    } = req.body;

    // Generate slug from name
    const slug = name
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');

    // Check if slug already exists
    const existingProduct = await Product.findOne({ slug });
    if (existingProduct) {
      return res.status(400).json({
        success: false,
        message: 'A product with this name already exists'
      });
    }

    // Create new product
    const product = new Product({
      name,
      slug,
      description,
      shortDescription,
      price,
      categories,
      tags,
      images,
      stockQuantity,
      sku,
      barcode,
      weight,
      dimensions,
      specifications,
      variants,
      brand,
      featured,
      onSale,
      seo
    });

    // Save product to database
    await product.save();

    res.status(201).json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Create product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating product'
    });
  }
});

// @route   PUT /api/products/:id
// @desc    Update a product
// @access  Private (Admin/Staff)
router.put('/:id', staffAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by id
    let product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // If name is changed, update slug
    if (req.body.name && req.body.name !== product.name) {
      req.body.slug = req.body.name
        .toLowerCase()
        .replace(/[^\w ]+/g, '')
        .replace(/ +/g, '-');

      // Check if new slug already exists
      const existingProduct = await Product.findOne({
        slug: req.body.slug,
        _id: { $ne: id }
      });

      if (existingProduct) {
        return res.status(400).json({
          success: false,
          message: 'A product with this name already exists'
        });
      }
    }

    // Update product
    product = await Product.findByIdAndUpdate(
      id,
      { $set: req.body },
      { new: true }
    );

    res.json({
      success: true,
      product
    });
  } catch (error) {
    console.error('Update product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating product'
    });
  }
});

// @route   DELETE /api/products/:id
// @desc    Delete a product
// @access  Private (Admin)
router.delete('/:id', adminAuth, async (req, res) => {
  try {
    const { id } = req.params;

    // Find product by id
    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Delete product
    await Product.findByIdAndDelete(id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Delete product error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting product'
    });
  }
});

export default router;
