import Product from '../../models/Product.js';

export const seedMensClothing = async (getCategoryIdBySlug) => {
  const mensClothing = [];

  // Men's Clothing 1
  mensClothing.push(
    new Product({
      name: "Men's Classic Oxford Shirt",
      slug: 'mens-classic-oxford-shirt',
      description: 'Timeless oxford shirt made from premium cotton. Features a comfortable regular fit, button-down collar, and versatile design that can be dressed up or down.',
      shortDescription: 'Classic button-down oxford shirt for men',
      price: {
        amount: 59.99,
        currency: 'USD',
        compareAtPrice: 79.99
      },
      categories: [
        getCategoryIdBySlug('clothing'),
        getCategoryIdBySlug('mens-clothing')
      ],
      tags: ['shirt', 'oxford', 'men', 'business casual', 'cotton'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Men's Classic Oxford Shirt",
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Men's Classic Oxford Shirt Back View"
        }
      ],
      stockQuantity: 200,
      sku: 'MENS-SHIRT-001',
      barcode: '4567890123456',
      weight: {
        value: 300,
        unit: 'g'
      },
      dimensions: {
        length: 30,
        width: 25,
        height: 2,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Material',
          value: '100% Cotton'
        },
        {
          name: 'Fit',
          value: 'Regular Fit'
        },
        {
          name: 'Collar',
          value: 'Button-down'
        },
        {
          name: 'Cuff',
          value: 'Adjustable button cuff'
        },
        {
          name: 'Care',
          value: 'Machine washable'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'White',
              priceModifier: 0,
              stockQuantity: 50,
              sku: 'MENS-SHIRT-001-WHT'
            },
            {
              name: 'Light Blue',
              priceModifier: 0,
              stockQuantity: 50,
              sku: 'MENS-SHIRT-001-LBL'
            },
            {
              name: 'Navy',
              priceModifier: 0,
              stockQuantity: 50,
              sku: 'MENS-SHIRT-001-NVY'
            },
            {
              name: 'Pink',
              priceModifier: 0,
              stockQuantity: 50,
              sku: 'MENS-SHIRT-001-PNK'
            }
          ]
        },
        {
          name: 'Size',
          options: [
            {
              name: 'S',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'MENS-SHIRT-001-S'
            },
            {
              name: 'M',
              priceModifier: 0,
              stockQuantity: 60,
              sku: 'MENS-SHIRT-001-M'
            },
            {
              name: 'L',
              priceModifier: 0,
              stockQuantity: 60,
              sku: 'MENS-SHIRT-001-L'
            },
            {
              name: 'XL',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'MENS-SHIRT-001-XL'
            }
          ]
        }
      ],
      featured: true,
      onSale: true,
      isActive: true,
      brand: 'ClassicWear',
      rating: {
        average: 4.7,
        count: 128
      },
      seo: {
        title: "Men's Classic Oxford Shirt - Timeless Button-Down",
        description: 'Shop our premium cotton Oxford shirt for men. Versatile design that can be dressed up or down, featuring a comfortable regular fit and button-down collar.',
        keywords: ['oxford shirt', 'men shirt', 'button-down shirt', 'cotton shirt', 'ClassicWear']
      }
    })
  );

  // Men's Clothing 2
  mensClothing.push(
    new Product({
      name: "Men's Slim Fit Chino Pants",
      slug: 'mens-slim-fit-chino-pants',
      description: 'Modern slim fit chino pants made from stretch cotton twill. Versatile, comfortable, and perfect for both casual and smart-casual occasions.',
      shortDescription: 'Slim fit chino pants for men',
      price: {
        amount: 69.99,
        currency: 'USD',
        compareAtPrice: 89.99
      },
      categories: [
        getCategoryIdBySlug('clothing'),
        getCategoryIdBySlug('mens-clothing')
      ],
      tags: ['pants', 'chinos', 'men', 'slim fit', 'cotton'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Men's Slim Fit Chino Pants",
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1473966968600-fa801b869a1a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Men's Slim Fit Chino Pants Detail"
        }
      ],
      stockQuantity: 150,
      sku: 'MENS-PANTS-001',
      barcode: '4567890123457',
      weight: {
        value: 450,
        unit: 'g'
      },
      dimensions: {
        length: 40,
        width: 30,
        height: 3,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Material',
          value: '98% Cotton, 2% Elastane'
        },
        {
          name: 'Fit',
          value: 'Slim Fit'
        },
        {
          name: 'Closure',
          value: 'Button and zip fly'
        },
        {
          name: 'Pockets',
          value: 'Side pockets, back welt pockets'
        },
        {
          name: 'Care',
          value: 'Machine washable'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Khaki',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'MENS-PANTS-001-KHK'
            },
            {
              name: 'Navy',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'MENS-PANTS-001-NVY'
            },
            {
              name: 'Olive',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'MENS-PANTS-001-OLV'
            },
            {
              name: 'Black',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'MENS-PANTS-001-BLK'
            }
          ]
        },
        {
          name: 'Size',
          options: [
            {
              name: '30x30',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'MENS-PANTS-001-30-30'
            },
            {
              name: '32x30',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'MENS-PANTS-001-32-30'
            },
            {
              name: '34x30',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'MENS-PANTS-001-34-30'
            },
            {
              name: '36x30',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'MENS-PANTS-001-36-30'
            },
            {
              name: '32x32',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'MENS-PANTS-001-32-32'
            },
            {
              name: '34x32',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'MENS-PANTS-001-34-32'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'ModernFit',
      rating: {
        average: 4.6,
        count: 95
      },
      seo: {
        title: "Men's Slim Fit Chino Pants - Modern Casual Style",
        description: 'Shop our slim fit chino pants for men. Made from stretch cotton twill for comfort and style, perfect for both casual and smart-casual occasions.',
        keywords: ['chino pants', 'men pants', 'slim fit pants', 'casual pants', 'ModernFit']
      }
    })
  );

  // Men's Clothing 3
  mensClothing.push(
    new Product({
      name: "Men's Casual Crewneck Sweater",
      slug: 'mens-casual-crewneck-sweater',
      description: 'Soft and comfortable crewneck sweater made from premium cotton blend. Perfect for layering in cooler weather with a classic, versatile design.',
      shortDescription: 'Comfortable cotton blend sweater for men',
      price: {
        amount: 49.99,
        currency: 'USD',
        compareAtPrice: 64.99
      },
      categories: [
        getCategoryIdBySlug('clothing'),
        getCategoryIdBySlug('mens-clothing')
      ],
      tags: ['sweater', 'crewneck', 'men', 'casual', 'cotton'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1614975059251-992f11792b9f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Men's Casual Crewneck Sweater",
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1621072156002-e2fccdc0b176?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Men's Casual Crewneck Sweater Detail"
        }
      ],
      stockQuantity: 120,
      sku: 'MENS-SWTR-001',
      barcode: '4567890123458',
      weight: {
        value: 400,
        unit: 'g'
      },
      dimensions: {
        length: 28,
        width: 24,
        height: 2,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Material',
          value: '80% Cotton, 20% Polyester'
        },
        {
          name: 'Fit',
          value: 'Regular Fit'
        },
        {
          name: 'Neckline',
          value: 'Crew Neck'
        },
        {
          name: 'Sleeve',
          value: 'Long Sleeve'
        },
        {
          name: 'Care',
          value: 'Machine wash cold, tumble dry low'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Navy',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'MENS-SWTR-001-NVY'
            },
            {
              name: 'Gray',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'MENS-SWTR-001-GRY'
            },
            {
              name: 'Burgundy',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'MENS-SWTR-001-BRG'
            },
            {
              name: 'Forest Green',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'MENS-SWTR-001-FGN'
            }
          ]
        },
        {
          name: 'Size',
          options: [
            {
              name: 'S',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'MENS-SWTR-001-S'
            },
            {
              name: 'M',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'MENS-SWTR-001-M'
            },
            {
              name: 'L',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'MENS-SWTR-001-L'
            },
            {
              name: 'XL',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'MENS-SWTR-001-XL'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'ComfortWear',
      rating: {
        average: 4.5,
        count: 78
      },
      seo: {
        title: "Men's Casual Crewneck Sweater - Comfortable Cotton Blend",
        description: 'Shop our comfortable crewneck sweater for men. Made from premium cotton blend, perfect for layering in cooler weather with a classic design.',
        keywords: ['crewneck sweater', 'men sweater', 'casual sweater', 'cotton sweater', 'ComfortWear']
      }
    })
  );

  return mensClothing;
};
