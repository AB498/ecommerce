import Product from '../../models/Product.js';

export const seedHomeDecor = async (getCategoryIdBySlug) => {
  const homeDecor = [];

  // Home Decor 1
  homeDecor.push(
    new Product({
      name: 'Geometric Throw Pillow Set',
      slug: 'geometric-throw-pillow-set',
      description: 'Set of 2 decorative throw pillows featuring modern geometric patterns. Made from premium materials with hidden zipper closure and plush insert included.',
      shortDescription: 'Modern decorative throw pillow set',
      price: {
        amount: 39.99,
        currency: 'USD',
        compareAtPrice: 49.99
      },
      categories: [
        getCategoryIdBySlug('home'),
        getCategoryIdBySlug('home-decor')
      ],
      tags: ['pillows', 'throw pillows', 'home decor', 'geometric', 'modern'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1584898647426-9a292a24087f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Geometric Throw Pillow Set',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1616046229478-9901c5536a45?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Geometric Throw Pillow Set Detail'
        }
      ],
      stockQuantity: 50,
      sku: 'HOME-PILLOW-001',
      barcode: '6789012345678',
      weight: {
        value: 800,
        unit: 'g'
      },
      dimensions: {
        length: 45,
        width: 45,
        height: 15,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Material',
          value: 'Cover: 100% Cotton, Insert: 100% Polyester'
        },
        {
          name: 'Size',
          value: '18" x 18" (45cm x 45cm)'
        },
        {
          name: 'Closure',
          value: 'Hidden zipper'
        },
        {
          name: 'Care',
          value: 'Cover: Machine washable, Insert: Spot clean only'
        },
        {
          name: 'Includes',
          value: 'Set of 2 pillows with inserts'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Blue/Gray',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'HOME-PILLOW-001-BG'
            },
            {
              name: 'Black/White',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'HOME-PILLOW-001-BW'
            },
            {
              name: 'Terracotta/Beige',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'HOME-PILLOW-001-TB'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'ModernHome',
      rating: {
        average: 4.7,
        count: 68
      },
      seo: {
        title: 'Geometric Throw Pillow Set - Modern Home Decor',
        description: 'Add style to your space with our Geometric Throw Pillow Set. Set of 2 decorative pillows featuring modern patterns and premium materials.',
        keywords: ['throw pillows', 'decorative pillows', 'geometric pillows', 'home decor', 'ModernHome']
      }
    })
  );

  // Home Decor 2
  homeDecor.push(
    new Product({
      name: 'Minimalist Table Lamp',
      slug: 'minimalist-table-lamp',
      description: 'Elegant minimalist table lamp with a sleek design. Features a metal base, fabric shade, and adjustable brightness to create the perfect ambiance in any room.',
      shortDescription: 'Sleek modern table lamp',
      price: {
        amount: 79.99,
        currency: 'USD',
        compareAtPrice: 99.99
      },
      categories: [
        getCategoryIdBySlug('home'),
        getCategoryIdBySlug('home-decor'),
        getCategoryIdBySlug('lighting')
      ],
      tags: ['lamp', 'table lamp', 'lighting', 'minimalist', 'modern'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Minimalist Table Lamp',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1540932239986-30128078f3c5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Minimalist Table Lamp Detail'
        }
      ],
      stockQuantity: 35,
      sku: 'HOME-LAMP-001',
      barcode: '6789012345679',
      weight: {
        value: 1.5,
        unit: 'kg'
      },
      dimensions: {
        length: 25,
        width: 25,
        height: 45,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Material',
          value: 'Base: Metal, Shade: Fabric'
        },
        {
          name: 'Bulb Type',
          value: 'E26/E27, max 60W (bulb not included)'
        },
        {
          name: 'Cord Length',
          value: '1.8m'
        },
        {
          name: 'Switch Type',
          value: 'In-line dimmer switch'
        },
        {
          name: 'Power Source',
          value: 'Corded Electric'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Black/White',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'HOME-LAMP-001-BW'
            },
            {
              name: 'Brass/Beige',
              priceModifier: 10,
              stockQuantity: 10,
              sku: 'HOME-LAMP-001-BB'
            },
            {
              name: 'Matte Black',
              priceModifier: 0,
              stockQuantity: 10,
              sku: 'HOME-LAMP-001-MB'
            }
          ]
        }
      ],
      featured: true,
      onSale: true,
      isActive: true,
      brand: 'LuxLight',
      rating: {
        average: 4.8,
        count: 42
      },
      seo: {
        title: 'Minimalist Table Lamp - Modern Home Lighting',
        description: 'Illuminate your space with our Minimalist Table Lamp. Elegant design with metal base, fabric shade, and adjustable brightness for perfect ambiance.',
        keywords: ['table lamp', 'minimalist lamp', 'modern lighting', 'home decor', 'LuxLight']
      }
    })
  );

  // Home Decor 3
  homeDecor.push(
    new Product({
      name: 'Macrame Wall Hanging',
      slug: 'macrame-wall-hanging',
      description: 'Handcrafted macrame wall hanging made from 100% cotton rope. Each piece is carefully made with intricate knotting techniques to create a beautiful bohemian accent for your home.',
      shortDescription: 'Handcrafted bohemian wall decor',
      price: {
        amount: 49.99,
        currency: 'USD',
        compareAtPrice: 59.99
      },
      categories: [
        getCategoryIdBySlug('home'),
        getCategoryIdBySlug('home-decor'),
        getCategoryIdBySlug('wall-decor')
      ],
      tags: ['macrame', 'wall hanging', 'bohemian', 'handcrafted', 'wall decor'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1622163642998-1ea3ae2a5cd2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Macrame Wall Hanging',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1593853963555-013dbf33c060?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Macrame Wall Hanging in Room Setting'
        }
      ],
      stockQuantity: 25,
      sku: 'HOME-MACR-001',
      barcode: '6789012345680',
      weight: {
        value: 400,
        unit: 'g'
      },
      dimensions: {
        length: 60,
        width: 2,
        height: 90,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Material',
          value: '100% Cotton Rope'
        },
        {
          name: 'Size',
          value: 'Approximately 60cm wide x 90cm long'
        },
        {
          name: 'Hanging Method',
          value: 'Wooden dowel with cotton rope hanger'
        },
        {
          name: 'Care',
          value: 'Spot clean only, keep away from moisture'
        },
        {
          name: 'Handmade',
          value: 'Each piece is handcrafted and may have slight variations'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Natural',
              priceModifier: 0,
              stockQuantity: 10,
              sku: 'HOME-MACR-001-NAT'
            },
            {
              name: 'White',
              priceModifier: 0,
              stockQuantity: 10,
              sku: 'HOME-MACR-001-WHT'
            },
            {
              name: 'Gray',
              priceModifier: 5,
              stockQuantity: 5,
              sku: 'HOME-MACR-001-GRY'
            }
          ]
        },
        {
          name: 'Size',
          options: [
            {
              name: 'Medium',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'HOME-MACR-001-MED'
            },
            {
              name: 'Large',
              priceModifier: 20,
              stockQuantity: 10,
              sku: 'HOME-MACR-001-LRG'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'BohoHome',
      rating: {
        average: 4.9,
        count: 36
      },
      seo: {
        title: 'Macrame Wall Hanging - Handcrafted Bohemian Decor',
        description: 'Add bohemian charm to your space with our handcrafted Macrame Wall Hanging. Made from 100% cotton rope with intricate knotting techniques.',
        keywords: ['macrame', 'wall hanging', 'bohemian decor', 'handcrafted decor', 'BohoHome']
      }
    })
  );

  return homeDecor;
};
