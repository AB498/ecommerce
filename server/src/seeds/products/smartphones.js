import Product from '../../models/Product.js';

export const seedSmartphones = async (getCategoryIdBySlug) => {
  const smartphones = [];

  // Smartphone 1
  smartphones.push(
    new Product({
      name: 'Premium Smartphone X',
      slug: 'premium-smartphone-x',
      description: 'The latest flagship smartphone with cutting-edge features and performance.',
      shortDescription: 'High-end smartphone with advanced features',
      price: {
        amount: 999.99,
        currency: 'USD',
        compareAtPrice: 1099.99
      },
      categories: [
        getCategoryIdBySlug('electronics'),
        getCategoryIdBySlug('smartphones')
      ],
      tags: ['smartphone', 'mobile', 'flagship', 'premium'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Premium Smartphone X',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1592286927505-1def25115558?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Premium Smartphone X Side View'
        }
      ],
      stockQuantity: 50,
      sku: 'PHONE-X-001',
      barcode: '1234567890123',
      weight: {
        value: 180,
        unit: 'g'
      },
      dimensions: {
        length: 15,
        width: 7.5,
        height: 0.8,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Display',
          value: '6.7-inch OLED'
        },
        {
          name: 'Processor',
          value: 'Octa-core 2.8GHz'
        },
        {
          name: 'RAM',
          value: '8GB'
        },
        {
          name: 'Storage',
          value: '256GB'
        },
        {
          name: 'Battery',
          value: '4500mAh'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Black',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'PHONE-X-001-BLK'
            },
            {
              name: 'Silver',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'PHONE-X-001-SLV'
            },
            {
              name: 'Gold',
              priceModifier: 50,
              stockQuantity: 15,
              sku: 'PHONE-X-001-GLD'
            }
          ]
        },
        {
          name: 'Storage',
          options: [
            {
              name: '128GB',
              priceModifier: -100,
              stockQuantity: 25,
              sku: 'PHONE-X-001-128'
            },
            {
              name: '256GB',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'PHONE-X-001-256'
            },
            {
              name: '512GB',
              priceModifier: 200,
              stockQuantity: 10,
              sku: 'PHONE-X-001-512'
            }
          ]
        }
      ],
      featured: true,
      onSale: true,
      isActive: true,
      brand: 'TechBrand',
      rating: {
        average: 4.8,
        count: 125
      },
      seo: {
        title: 'Premium Smartphone X - Latest Flagship Phone',
        description: 'Experience the cutting-edge technology with Premium Smartphone X. High-performance, stunning display, and advanced camera system.',
        keywords: ['smartphone', 'premium phone', 'flagship phone', 'TechBrand']
      }
    })
  );

  // Smartphone 2
  smartphones.push(
    new Product({
      name: 'Budget Smartphone Pro',
      slug: 'budget-smartphone-pro',
      description: 'A feature-packed smartphone at an affordable price. Great camera, long battery life, and smooth performance.',
      shortDescription: 'Affordable smartphone with great features',
      price: {
        amount: 349.99,
        currency: 'USD',
        compareAtPrice: 399.99
      },
      categories: [
        getCategoryIdBySlug('electronics'),
        getCategoryIdBySlug('smartphones')
      ],
      tags: ['smartphone', 'mobile', 'budget', 'affordable'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1533228100845-08145b01de14?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Budget Smartphone Pro',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Budget Smartphone Pro Side View'
        }
      ],
      stockQuantity: 100,
      sku: 'PHONE-B-001',
      barcode: '1234567890124',
      weight: {
        value: 190,
        unit: 'g'
      },
      dimensions: {
        length: 15.5,
        width: 7.2,
        height: 0.9,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Display',
          value: '6.5-inch LCD'
        },
        {
          name: 'Processor',
          value: 'Octa-core 2.0GHz'
        },
        {
          name: 'RAM',
          value: '4GB'
        },
        {
          name: 'Storage',
          value: '64GB'
        },
        {
          name: 'Battery',
          value: '5000mAh'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Black',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'PHONE-B-001-BLK'
            },
            {
              name: 'Blue',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'PHONE-B-001-BLU'
            },
            {
              name: 'Green',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'PHONE-B-001-GRN'
            }
          ]
        },
        {
          name: 'Storage',
          options: [
            {
              name: '64GB',
              priceModifier: 0,
              stockQuantity: 60,
              sku: 'PHONE-B-001-64'
            },
            {
              name: '128GB',
              priceModifier: 50,
              stockQuantity: 40,
              sku: 'PHONE-B-001-128'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'ValueTech',
      rating: {
        average: 4.5,
        count: 210
      },
      seo: {
        title: 'Budget Smartphone Pro - Affordable Feature-Packed Phone',
        description: 'Get the best value with Budget Smartphone Pro. Great camera, long battery life, and smooth performance at an affordable price.',
        keywords: ['smartphone', 'budget phone', 'affordable phone', 'ValueTech']
      }
    })
  );

  // Smartphone 3
  smartphones.push(
    new Product({
      name: 'Ultra Slim Smartphone',
      slug: 'ultra-slim-smartphone',
      description: 'The thinnest smartphone on the market with premium build quality and excellent performance.',
      shortDescription: 'Ultra-thin premium smartphone',
      price: {
        amount: 799.99,
        currency: 'USD',
        compareAtPrice: 849.99
      },
      categories: [
        getCategoryIdBySlug('electronics'),
        getCategoryIdBySlug('smartphones')
      ],
      tags: ['smartphone', 'mobile', 'slim', 'premium'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1565849904461-04a58ad377e0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Ultra Slim Smartphone',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1529653762956-b0a27278529c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Ultra Slim Smartphone Side View'
        }
      ],
      stockQuantity: 60,
      sku: 'PHONE-S-001',
      barcode: '1234567890125',
      weight: {
        value: 150,
        unit: 'g'
      },
      dimensions: {
        length: 14.8,
        width: 7.0,
        height: 0.6,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Display',
          value: '6.4-inch AMOLED'
        },
        {
          name: 'Processor',
          value: 'Octa-core 2.5GHz'
        },
        {
          name: 'RAM',
          value: '6GB'
        },
        {
          name: 'Storage',
          value: '128GB'
        },
        {
          name: 'Battery',
          value: '4000mAh'
        },
        {
          name: 'Thickness',
          value: '6mm'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Midnight Black',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'PHONE-S-001-BLK'
            },
            {
              name: 'Frost Silver',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'PHONE-S-001-SLV'
            },
            {
              name: 'Rose Gold',
              priceModifier: 30,
              stockQuantity: 20,
              sku: 'PHONE-S-001-RSG'
            }
          ]
        },
        {
          name: 'Storage',
          options: [
            {
              name: '128GB',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'PHONE-S-001-128'
            },
            {
              name: '256GB',
              priceModifier: 100,
              stockQuantity: 30,
              sku: 'PHONE-S-001-256'
            }
          ]
        }
      ],
      featured: true,
      onSale: false,
      isActive: true,
      brand: 'SlimTech',
      rating: {
        average: 4.7,
        count: 95
      },
      seo: {
        title: 'Ultra Slim Smartphone - The Thinnest Premium Phone',
        description: 'Experience the Ultra Slim Smartphone, the thinnest phone on the market with premium build quality and excellent performance.',
        keywords: ['smartphone', 'slim phone', 'thin phone', 'premium phone', 'SlimTech']
      }
    })
  );

  return smartphones;
};
