import Product from '../../models/Product.js';

export const seedAccessories = async (getCategoryIdBySlug) => {
  const accessories = [];

  // Accessory 1
  accessories.push(
    new Product({
      name: 'Minimalist Leather Watch',
      slug: 'minimalist-leather-watch',
      description: 'Elegant minimalist watch featuring a genuine leather strap, stainless steel case, and precision quartz movement. Perfect for everyday wear with a timeless design that complements any outfit.',
      shortDescription: 'Elegant minimalist watch with leather strap',
      price: {
        amount: 129.99,
        currency: 'USD',
        compareAtPrice: 159.99
      },
      categories: [
        getCategoryIdBySlug('accessories'),
        getCategoryIdBySlug('watches')
      ],
      tags: ['watch', 'leather', 'minimalist', 'accessories', 'unisex'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Minimalist Leather Watch',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1522312346375-d1a52e2b99b3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Minimalist Leather Watch on Wrist'
        }
      ],
      stockQuantity: 50,
      sku: 'ACC-WATCH-001',
      barcode: '7890123456789',
      weight: {
        value: 80,
        unit: 'g'
      },
      dimensions: {
        length: 24,
        width: 4,
        height: 1,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Case Material',
          value: 'Stainless Steel'
        },
        {
          name: 'Case Diameter',
          value: '40mm'
        },
        {
          name: 'Band Material',
          value: 'Genuine Leather'
        },
        {
          name: 'Movement',
          value: 'Japanese Quartz'
        },
        {
          name: 'Water Resistance',
          value: '3 ATM (30 meters)'
        },
        {
          name: 'Battery Life',
          value: 'Approximately 2 years'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Black/Silver',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'ACC-WATCH-001-BS'
            },
            {
              name: 'Brown/Gold',
              priceModifier: 10,
              stockQuantity: 15,
              sku: 'ACC-WATCH-001-BG'
            },
            {
              name: 'Navy/Silver',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'ACC-WATCH-001-NS'
            }
          ]
        }
      ],
      featured: true,
      onSale: true,
      isActive: true,
      brand: 'TimeClassic',
      rating: {
        average: 4.7,
        count: 86
      },
      seo: {
        title: 'Minimalist Leather Watch - Elegant Timepiece',
        description: 'Discover our elegant Minimalist Leather Watch. Featuring genuine leather strap, stainless steel case, and precision quartz movement for everyday style.',
        keywords: ['minimalist watch', 'leather watch', 'unisex watch', 'TimeClassic']
      }
    })
  );

  // Accessory 2
  accessories.push(
    new Product({
      name: 'Premium Leather Wallet',
      slug: 'premium-leather-wallet',
      description: 'Handcrafted premium leather wallet with multiple card slots, bill compartments, and RFID blocking technology. Made from full-grain leather that develops a beautiful patina over time.',
      shortDescription: 'Handcrafted full-grain leather wallet with RFID protection',
      price: {
        amount: 79.99,
        currency: 'USD',
        compareAtPrice: 99.99
      },
      categories: [
        getCategoryIdBySlug('accessories')
      ],
      tags: ['wallet', 'leather', 'RFID', 'accessories', 'men'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1627123424574-724758594e93?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Premium Leather Wallet',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1606503825008-909a67e63c3d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Premium Leather Wallet Open View'
        }
      ],
      stockQuantity: 60,
      sku: 'ACC-WALLET-001',
      barcode: '7890123456790',
      weight: {
        value: 120,
        unit: 'g'
      },
      dimensions: {
        length: 11.5,
        width: 9,
        height: 1.5,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Material',
          value: 'Full-grain Leather'
        },
        {
          name: 'Card Slots',
          value: '8'
        },
        {
          name: 'Bill Compartments',
          value: '2'
        },
        {
          name: 'ID Window',
          value: 'Yes'
        },
        {
          name: 'RFID Protection',
          value: 'Yes'
        },
        {
          name: 'Care',
          value: 'Wipe with leather conditioner periodically'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Dark Brown',
              priceModifier: 0,
              stockQuantity: 25,
              sku: 'ACC-WALLET-001-DB'
            },
            {
              name: 'Black',
              priceModifier: 0,
              stockQuantity: 25,
              sku: 'ACC-WALLET-001-BLK'
            },
            {
              name: 'Tan',
              priceModifier: 0,
              stockQuantity: 10,
              sku: 'ACC-WALLET-001-TAN'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'LeatherCraft',
      rating: {
        average: 4.8,
        count: 72
      },
      seo: {
        title: 'Premium Leather Wallet - Handcrafted with RFID Protection',
        description: 'Carry your essentials in style with our Premium Leather Wallet. Handcrafted from full-grain leather with RFID protection and multiple compartments.',
        keywords: ['leather wallet', 'RFID wallet', 'men wallet', 'handcrafted wallet', 'LeatherCraft']
      }
    })
  );

  // Accessory 3
  accessories.push(
    new Product({
      name: 'Designer Sunglasses',
      slug: 'designer-sunglasses',
      description: 'Stylish designer sunglasses with polarized lenses and UV protection. Features a lightweight frame, comfortable fit, and timeless design that complements any face shape.',
      shortDescription: 'Stylish polarized sunglasses with UV protection',
      price: {
        amount: 149.99,
        currency: 'USD',
        compareAtPrice: 189.99
      },
      categories: [
        getCategoryIdBySlug('accessories')
      ],
      tags: ['sunglasses', 'polarized', 'UV protection', 'accessories', 'unisex'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1577803645773-f96470509666?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Designer Sunglasses',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1625591339971-4c9a87a66871?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Designer Sunglasses Side View'
        }
      ],
      stockQuantity: 40,
      sku: 'ACC-SUNGLASS-001',
      barcode: '7890123456791',
      weight: {
        value: 30,
        unit: 'g'
      },
      dimensions: {
        length: 15,
        width: 5,
        height: 5,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Frame Material',
          value: 'Acetate'
        },
        {
          name: 'Lens Material',
          value: 'Polarized Glass'
        },
        {
          name: 'UV Protection',
          value: '100% UVA/UVB'
        },
        {
          name: 'Frame Width',
          value: '142mm'
        },
        {
          name: 'Lens Width',
          value: '52mm'
        },
        {
          name: 'Includes',
          value: 'Protective case and cleaning cloth'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Black/Gray',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'ACC-SUNGLASS-001-BG'
            },
            {
              name: 'Tortoise/Brown',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'ACC-SUNGLASS-001-TB'
            },
            {
              name: 'Clear/Blue',
              priceModifier: 10,
              stockQuantity: 10,
              sku: 'ACC-SUNGLASS-001-CB'
            }
          ]
        }
      ],
      featured: true,
      onSale: true,
      isActive: true,
      brand: 'VisionStyle',
      rating: {
        average: 4.6,
        count: 58
      },
      seo: {
        title: 'Designer Sunglasses - Polarized with UV Protection',
        description: 'Protect your eyes in style with our Designer Sunglasses. Featuring polarized lenses, UV protection, and a lightweight comfortable frame.',
        keywords: ['designer sunglasses', 'polarized sunglasses', 'UV protection sunglasses', 'VisionStyle']
      }
    })
  );

  return accessories;
};
