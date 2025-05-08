import Product from '../../models/Product.js';

export const seedHeadphones = async (getCategoryIdBySlug) => {
  const headphones = [];

  // Headphones 1
  headphones.push(
    new Product({
      name: 'NoiseCancel Pro Headphones',
      slug: 'noisecancel-pro-headphones',
      description: 'Premium noise-cancelling headphones with exceptional sound quality, comfortable design, and long battery life. Perfect for travel, work, or enjoying your favorite music.',
      shortDescription: 'Premium noise-cancelling headphones',
      price: {
        amount: 299.99,
        currency: 'USD',
        compareAtPrice: 349.99
      },
      categories: [
        getCategoryIdBySlug('electronics'),
        getCategoryIdBySlug('audio')
      ],
      tags: ['headphones', 'noise-cancelling', 'premium', 'wireless'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'NoiseCancel Pro Headphones',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'NoiseCancel Pro Headphones Side View'
        }
      ],
      stockQuantity: 75,
      sku: 'AUDIO-HP-001',
      barcode: '3456789012345',
      weight: {
        value: 250,
        unit: 'g'
      },
      dimensions: {
        length: 18,
        width: 15,
        height: 8,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Type',
          value: 'Over-ear'
        },
        {
          name: 'Connectivity',
          value: 'Bluetooth 5.0, 3.5mm jack'
        },
        {
          name: 'Battery Life',
          value: '30 hours'
        },
        {
          name: 'Noise Cancellation',
          value: 'Active Noise Cancellation (ANC)'
        },
        {
          name: 'Microphone',
          value: 'Built-in with voice assistant support'
        },
        {
          name: 'Charging',
          value: 'USB-C'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Black',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'AUDIO-HP-001-BLK'
            },
            {
              name: 'Silver',
              priceModifier: 0,
              stockQuantity: 25,
              sku: 'AUDIO-HP-001-SLV'
            },
            {
              name: 'Blue',
              priceModifier: 20,
              stockQuantity: 20,
              sku: 'AUDIO-HP-001-BLU'
            }
          ]
        }
      ],
      featured: true,
      onSale: true,
      isActive: true,
      brand: 'AudioPro',
      rating: {
        average: 4.8,
        count: 156
      },
      seo: {
        title: 'NoiseCancel Pro Headphones - Premium Noise-Cancelling Experience',
        description: 'Experience exceptional sound quality with NoiseCancel Pro Headphones. Premium noise-cancelling technology, comfortable design, and long battery life.',
        keywords: ['headphones', 'noise-cancelling headphones', 'wireless headphones', 'AudioPro']
      }
    })
  );

  // Headphones 2
  headphones.push(
    new Product({
      name: 'Wireless Earbuds Sport',
      slug: 'wireless-earbuds-sport',
      description: 'Sweat-resistant wireless earbuds designed for sports and active lifestyles. Secure fit, excellent sound quality, and long battery life to power through your workouts.',
      shortDescription: 'Wireless earbuds for sports and workouts',
      price: {
        amount: 129.99,
        currency: 'USD',
        compareAtPrice: 149.99
      },
      categories: [
        getCategoryIdBySlug('electronics'),
        getCategoryIdBySlug('audio')
      ],
      tags: ['earbuds', 'wireless', 'sports', 'waterproof'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1606220588913-b3aacb4d2f46?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Wireless Earbuds Sport',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1608156639585-b3a032ef9689?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Wireless Earbuds Sport with Case'
        }
      ],
      stockQuantity: 100,
      sku: 'AUDIO-EB-001',
      barcode: '3456789012346',
      weight: {
        value: 60,
        unit: 'g'
      },
      dimensions: {
        length: 6,
        width: 4,
        height: 3,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Type',
          value: 'In-ear'
        },
        {
          name: 'Connectivity',
          value: 'Bluetooth 5.1'
        },
        {
          name: 'Battery Life',
          value: '8 hours (24 hours with charging case)'
        },
        {
          name: 'Water Resistance',
          value: 'IPX7 (sweat and water resistant)'
        },
        {
          name: 'Microphone',
          value: 'Built-in with noise reduction'
        },
        {
          name: 'Charging',
          value: 'USB-C, Wireless Qi compatible'
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
              sku: 'AUDIO-EB-001-BLK'
            },
            {
              name: 'White',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'AUDIO-EB-001-WHT'
            },
            {
              name: 'Red',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'AUDIO-EB-001-RED'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'SportSound',
      rating: {
        average: 4.6,
        count: 203
      },
      seo: {
        title: 'Wireless Earbuds Sport - Perfect for Workouts',
        description: 'Power through your workouts with Wireless Earbuds Sport. Sweat-resistant, secure fit, and excellent sound quality for active lifestyles.',
        keywords: ['wireless earbuds', 'sports earbuds', 'workout headphones', 'SportSound']
      }
    })
  );

  // Headphones 3
  headphones.push(
    new Product({
      name: 'Studio Monitor Headphones',
      slug: 'studio-monitor-headphones',
      description: 'Professional-grade studio monitor headphones with flat frequency response for accurate audio reproduction. Ideal for music production, mixing, and critical listening.',
      shortDescription: 'Professional headphones for audio production',
      price: {
        amount: 199.99,
        currency: 'USD',
        compareAtPrice: null
      },
      categories: [
        getCategoryIdBySlug('electronics'),
        getCategoryIdBySlug('audio')
      ],
      tags: ['headphones', 'studio', 'professional', 'wired'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Studio Monitor Headphones',
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: 'Studio Monitor Headphones Side View'
        }
      ],
      stockQuantity: 40,
      sku: 'AUDIO-SM-001',
      barcode: '3456789012347',
      weight: {
        value: 300,
        unit: 'g'
      },
      dimensions: {
        length: 20,
        width: 18,
        height: 9,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Type',
          value: 'Over-ear, closed-back'
        },
        {
          name: 'Connectivity',
          value: 'Wired, 3.5mm with 6.3mm adapter'
        },
        {
          name: 'Frequency Response',
          value: '5Hz - 40kHz'
        },
        {
          name: 'Impedance',
          value: '38 ohms'
        },
        {
          name: 'Cable',
          value: 'Detachable, 3m coiled and 1.2m straight included'
        },
        {
          name: 'Sensitivity',
          value: '96 dB/mW'
        }
      ],
      variants: [],
      featured: false,
      onSale: false,
      isActive: true,
      brand: 'ProAudio',
      rating: {
        average: 4.9,
        count: 87
      },
      seo: {
        title: 'Studio Monitor Headphones - Professional Audio Production',
        description: 'Get accurate audio reproduction with Studio Monitor Headphones. Professional-grade quality for music production, mixing, and critical listening.',
        keywords: ['studio headphones', 'monitor headphones', 'professional headphones', 'ProAudio']
      }
    })
  );

  return headphones;
};
