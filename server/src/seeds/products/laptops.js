import Product from '../../models/Product.js';

export const seedLaptops = async (getCategoryIdBySlug) => {
  const laptops = [];

  // Laptop 1
  laptops.push(
    new Product({
      name: 'UltraBook Pro 15',
      slug: 'ultrabook-pro-15',
      description: 'Powerful and lightweight laptop for professionals and creatives. Features a stunning display, all-day battery life, and exceptional performance.',
      shortDescription: 'Premium lightweight laptop for professionals',
      price: {
        amount: 1499.99,
        currency: 'USD',
        compareAtPrice: 1699.99
      },
      categories: [
        getCategoryIdBySlug('electronics'),
        getCategoryIdBySlug('laptops')
      ],
      tags: ['laptop', 'ultrabook', 'premium', 'professional'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'UltraBook Pro 15',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'UltraBook Pro 15 Open View'
        }
      ],
      stockQuantity: 30,
      sku: 'LAPTOP-PRO-001',
      barcode: '2345678901234',
      weight: {
        value: 1.5,
        unit: 'kg'
      },
      dimensions: {
        length: 35,
        width: 24,
        height: 1.5,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Display',
          value: '15.6-inch 4K IPS'
        },
        {
          name: 'Processor',
          value: 'Intel Core i7-11800H'
        },
        {
          name: 'RAM',
          value: '16GB DDR4'
        },
        {
          name: 'Storage',
          value: '512GB SSD'
        },
        {
          name: 'Graphics',
          value: 'NVIDIA RTX 3060'
        },
        {
          name: 'Battery',
          value: '10 hours'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Space Gray',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'LAPTOP-PRO-001-GRY'
            },
            {
              name: 'Silver',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'LAPTOP-PRO-001-SLV'
            }
          ]
        },
        {
          name: 'RAM',
          options: [
            {
              name: '16GB',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'LAPTOP-PRO-001-16GB'
            },
            {
              name: '32GB',
              priceModifier: 300,
              stockQuantity: 10,
              sku: 'LAPTOP-PRO-001-32GB'
            }
          ]
        },
        {
          name: 'Storage',
          options: [
            {
              name: '512GB',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'LAPTOP-PRO-001-512'
            },
            {
              name: '1TB',
              priceModifier: 200,
              stockQuantity: 10,
              sku: 'LAPTOP-PRO-001-1TB'
            },
            {
              name: '2TB',
              priceModifier: 400,
              stockQuantity: 5,
              sku: 'LAPTOP-PRO-001-2TB'
            }
          ]
        }
      ],
      featured: true,
      onSale: true,
      isActive: true,
      brand: 'TechPro',
      rating: {
        average: 4.7,
        count: 89
      },
      seo: {
        title: 'UltraBook Pro 15 - Premium Laptop for Professionals',
        description: 'Experience exceptional performance with the UltraBook Pro 15. Powerful, lightweight, and perfect for professionals and creatives.',
        keywords: ['laptop', 'ultrabook', 'professional laptop', 'TechPro']
      }
    })
  );

  // Laptop 2
  laptops.push(
    new Product({
      name: 'Gaming Laptop Elite',
      slug: 'gaming-laptop-elite',
      description: 'High-performance gaming laptop with the latest graphics card, powerful processor, and immersive display for the ultimate gaming experience.',
      shortDescription: 'Powerful gaming laptop for enthusiasts',
      price: {
        amount: 1899.99,
        currency: 'USD',
        compareAtPrice: 2099.99
      },
      categories: [
        getCategoryIdBySlug('electronics'),
        getCategoryIdBySlug('laptops')
      ],
      tags: ['laptop', 'gaming', 'high-performance', 'premium'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1603302576837-37561b2e2302?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Gaming Laptop Elite',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1593642702821-c8da6771f0c6?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Gaming Laptop Elite Open View'
        }
      ],
      stockQuantity: 25,
      sku: 'LAPTOP-GAME-001',
      barcode: '2345678901235',
      weight: {
        value: 2.5,
        unit: 'kg'
      },
      dimensions: {
        length: 36,
        width: 26,
        height: 2.0,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Display',
          value: '17.3-inch 165Hz IPS'
        },
        {
          name: 'Processor',
          value: 'Intel Core i9-11900H'
        },
        {
          name: 'RAM',
          value: '32GB DDR4'
        },
        {
          name: 'Storage',
          value: '1TB NVMe SSD'
        },
        {
          name: 'Graphics',
          value: 'NVIDIA RTX 3080'
        },
        {
          name: 'Battery',
          value: '6 hours gaming, 10 hours regular use'
        },
        {
          name: 'Cooling',
          value: 'Advanced thermal design with dual fans'
        }
      ],
      variants: [
        {
          name: 'RAM',
          options: [
            {
              name: '16GB',
              priceModifier: -200,
              stockQuantity: 10,
              sku: 'LAPTOP-GAME-001-16GB'
            },
            {
              name: '32GB',
              priceModifier: 0,
              stockQuantity: 10,
              sku: 'LAPTOP-GAME-001-32GB'
            },
            {
              name: '64GB',
              priceModifier: 400,
              stockQuantity: 5,
              sku: 'LAPTOP-GAME-001-64GB'
            }
          ]
        },
        {
          name: 'Storage',
          options: [
            {
              name: '1TB',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'LAPTOP-GAME-001-1TB'
            },
            {
              name: '2TB',
              priceModifier: 300,
              stockQuantity: 10,
              sku: 'LAPTOP-GAME-001-2TB'
            }
          ]
        }
      ],
      featured: true,
      onSale: true,
      isActive: true,
      brand: 'GameMaster',
      rating: {
        average: 4.9,
        count: 76
      },
      seo: {
        title: 'Gaming Laptop Elite - Ultimate Gaming Experience',
        description: 'Dominate your games with the Gaming Laptop Elite. Featuring the latest graphics card, powerful processor, and immersive display.',
        keywords: ['gaming laptop', 'high-performance laptop', 'gaming computer', 'GameMaster']
      }
    })
  );

  // Laptop 3
  laptops.push(
    new Product({
      name: 'Student Laptop Essential',
      slug: 'student-laptop-essential',
      description: 'Affordable and reliable laptop perfect for students. Long battery life, lightweight design, and all the essential features for studying and everyday tasks.',
      shortDescription: 'Budget-friendly laptop for students',
      price: {
        amount: 599.99,
        currency: 'USD',
        compareAtPrice: 699.99
      },
      categories: [
        getCategoryIdBySlug('electronics'),
        getCategoryIdBySlug('laptops')
      ],
      tags: ['laptop', 'student', 'budget', 'lightweight'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Student Laptop Essential',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1542393545-10f5cde2c810?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Student Laptop Essential Open View'
        }
      ],
      stockQuantity: 50,
      sku: 'LAPTOP-STU-001',
      barcode: '2345678901236',
      weight: {
        value: 1.3,
        unit: 'kg'
      },
      dimensions: {
        length: 32,
        width: 22,
        height: 1.8,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Display',
          value: '14-inch Full HD'
        },
        {
          name: 'Processor',
          value: 'Intel Core i5-1135G7'
        },
        {
          name: 'RAM',
          value: '8GB DDR4'
        },
        {
          name: 'Storage',
          value: '256GB SSD'
        },
        {
          name: 'Graphics',
          value: 'Intel Iris Xe Graphics'
        },
        {
          name: 'Battery',
          value: '12 hours'
        },
        {
          name: 'Ports',
          value: '2x USB-A, 1x USB-C, HDMI, Audio jack'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Silver',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'LAPTOP-STU-001-SLV'
            },
            {
              name: 'Blue',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'LAPTOP-STU-001-BLU'
            },
            {
              name: 'Black',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'LAPTOP-STU-001-BLK'
            }
          ]
        },
        {
          name: 'Storage',
          options: [
            {
              name: '256GB',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'LAPTOP-STU-001-256'
            },
            {
              name: '512GB',
              priceModifier: 100,
              stockQuantity: 20,
              sku: 'LAPTOP-STU-001-512'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'EduTech',
      rating: {
        average: 4.5,
        count: 142
      },
      seo: {
        title: 'Student Laptop Essential - Affordable Laptop for Students',
        description: 'Get the perfect student companion with the Student Laptop Essential. Affordable, reliable, with long battery life and lightweight design.',
        keywords: ['student laptop', 'budget laptop', 'lightweight laptop', 'EduTech']
      }
    })
  );

  return laptops;
};
