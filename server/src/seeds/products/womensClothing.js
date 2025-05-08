import Product from '../../models/Product.js';

export const seedWomensClothing = async (getCategoryIdBySlug) => {
  const womensClothing = [];

  // Women's Clothing 1
  womensClothing.push(
    new Product({
      name: "Women's Floral Maxi Dress",
      slug: 'womens-floral-maxi-dress',
      description: 'Beautiful floral maxi dress perfect for summer days and special occasions. Features a flattering silhouette, lightweight fabric, and vibrant floral pattern.',
      shortDescription: 'Elegant floral maxi dress for women',
      price: {
        amount: 89.99,
        currency: 'USD',
        compareAtPrice: 119.99
      },
      categories: [
        getCategoryIdBySlug('clothing'),
        getCategoryIdBySlug('womens-clothing')
      ],
      tags: ['dress', 'maxi', 'floral', 'summer', 'women'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Women's Floral Maxi Dress",
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Women's Floral Maxi Dress Back View"
        }
      ],
      stockQuantity: 80,
      sku: 'WOMENS-DRESS-001',
      barcode: '5678901234567',
      weight: {
        value: 350,
        unit: 'g'
      },
      dimensions: {
        length: 35,
        width: 25,
        height: 2,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Material',
          value: '95% Polyester, 5% Elastane'
        },
        {
          name: 'Length',
          value: 'Maxi'
        },
        {
          name: 'Pattern',
          value: 'Floral'
        },
        {
          name: 'Neckline',
          value: 'V-neck'
        },
        {
          name: 'Sleeve',
          value: 'Short sleeve'
        },
        {
          name: 'Care',
          value: 'Machine washable, gentle cycle'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Blue Floral',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'WOMENS-DRESS-001-BLU'
            },
            {
              name: 'Pink Floral',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'WOMENS-DRESS-001-PNK'
            },
            {
              name: 'Green Floral',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'WOMENS-DRESS-001-GRN'
            }
          ]
        },
        {
          name: 'Size',
          options: [
            {
              name: 'XS',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'WOMENS-DRESS-001-XS'
            },
            {
              name: 'S',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'WOMENS-DRESS-001-S'
            },
            {
              name: 'M',
              priceModifier: 0,
              stockQuantity: 25,
              sku: 'WOMENS-DRESS-001-M'
            },
            {
              name: 'L',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'WOMENS-DRESS-001-L'
            },
            {
              name: 'XL',
              priceModifier: 0,
              stockQuantity: 5,
              sku: 'WOMENS-DRESS-001-XL'
            }
          ]
        }
      ],
      featured: true,
      onSale: true,
      isActive: true,
      brand: 'ElegantStyle',
      rating: {
        average: 4.8,
        count: 112
      },
      seo: {
        title: "Women's Floral Maxi Dress - Elegant Summer Style",
        description: 'Shop our beautiful floral maxi dress for women. Perfect for summer days and special occasions with a flattering silhouette and vibrant pattern.',
        keywords: ['maxi dress', 'floral dress', 'summer dress', 'women dress', 'ElegantStyle']
      }
    })
  );

  // Women's Clothing 2
  womensClothing.push(
    new Product({
      name: "Women's High-Waisted Skinny Jeans",
      slug: 'womens-high-waisted-skinny-jeans',
      description: 'Classic high-waisted skinny jeans with a comfortable stretch fit. Versatile style that pairs well with everything from casual tees to dressy blouses.',
      shortDescription: 'Comfortable high-waisted skinny jeans for women',
      price: {
        amount: 79.99,
        currency: 'USD',
        compareAtPrice: 99.99
      },
      categories: [
        getCategoryIdBySlug('clothing'),
        getCategoryIdBySlug('womens-clothing')
      ],
      tags: ['jeans', 'skinny', 'high-waisted', 'denim', 'women'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Women's High-Waisted Skinny Jeans",
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1584370848010-d7fe6bc767ec?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Women's High-Waisted Skinny Jeans Detail"
        }
      ],
      stockQuantity: 120,
      sku: 'WOMENS-JEANS-001',
      barcode: '5678901234568',
      weight: {
        value: 500,
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
          value: '92% Cotton, 6% Polyester, 2% Elastane'
        },
        {
          name: 'Rise',
          value: 'High-waisted'
        },
        {
          name: 'Fit',
          value: 'Skinny'
        },
        {
          name: 'Closure',
          value: 'Button and zip fly'
        },
        {
          name: 'Pockets',
          value: 'Five-pocket styling'
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
              name: 'Dark Blue',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'WOMENS-JEANS-001-DBL'
            },
            {
              name: 'Medium Blue',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'WOMENS-JEANS-001-MBL'
            },
            {
              name: 'Black',
              priceModifier: 0,
              stockQuantity: 40,
              sku: 'WOMENS-JEANS-001-BLK'
            }
          ]
        },
        {
          name: 'Size',
          options: [
            {
              name: '24',
              priceModifier: 0,
              stockQuantity: 15,
              sku: 'WOMENS-JEANS-001-24'
            },
            {
              name: '26',
              priceModifier: 0,
              stockQuantity: 25,
              sku: 'WOMENS-JEANS-001-26'
            },
            {
              name: '28',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'WOMENS-JEANS-001-28'
            },
            {
              name: '30',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'WOMENS-JEANS-001-30'
            },
            {
              name: '32',
              priceModifier: 0,
              stockQuantity: 20,
              sku: 'WOMENS-JEANS-001-32'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'DenimStyle',
      rating: {
        average: 4.6,
        count: 185
      },
      seo: {
        title: "Women's High-Waisted Skinny Jeans - Classic Denim Style",
        description: 'Shop our high-waisted skinny jeans for women. Comfortable stretch fit that pairs well with everything from casual tees to dressy blouses.',
        keywords: ['skinny jeans', 'high-waisted jeans', 'women jeans', 'denim jeans', 'DenimStyle']
      }
    })
  );

  // Women's Clothing 3
  womensClothing.push(
    new Product({
      name: "Women's Oversized Knit Cardigan",
      slug: 'womens-oversized-knit-cardigan',
      description: 'Cozy oversized knit cardigan perfect for layering. Features a soft, comfortable fabric, relaxed fit, and versatile style that works for any casual occasion.',
      shortDescription: 'Cozy oversized cardigan for women',
      price: {
        amount: 69.99,
        currency: 'USD',
        compareAtPrice: 89.99
      },
      categories: [
        getCategoryIdBySlug('clothing'),
        getCategoryIdBySlug('womens-clothing')
      ],
      tags: ['cardigan', 'knit', 'oversized', 'sweater', 'women'],
      images: [
        {
          url: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Women's Oversized Knit Cardigan",
          isPrimary: true
        },
        {
          url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=600&q=80',
          alt: "Women's Oversized Knit Cardigan Detail"
        }
      ],
      stockQuantity: 90,
      sku: 'WOMENS-CARD-001',
      barcode: '5678901234569',
      weight: {
        value: 550,
        unit: 'g'
      },
      dimensions: {
        length: 32,
        width: 28,
        height: 3,
        unit: 'cm'
      },
      specifications: [
        {
          name: 'Material',
          value: '70% Acrylic, 30% Wool'
        },
        {
          name: 'Fit',
          value: 'Oversized'
        },
        {
          name: 'Length',
          value: 'Mid-thigh'
        },
        {
          name: 'Sleeve',
          value: 'Long sleeve'
        },
        {
          name: 'Closure',
          value: 'Button front'
        },
        {
          name: 'Care',
          value: 'Hand wash cold, lay flat to dry'
        }
      ],
      variants: [
        {
          name: 'Color',
          options: [
            {
              name: 'Beige',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'WOMENS-CARD-001-BEI'
            },
            {
              name: 'Gray',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'WOMENS-CARD-001-GRY'
            },
            {
              name: 'Dusty Pink',
              priceModifier: 0,
              stockQuantity: 30,
              sku: 'WOMENS-CARD-001-DPK'
            }
          ]
        },
        {
          name: 'Size',
          options: [
            {
              name: 'S/M',
              priceModifier: 0,
              stockQuantity: 45,
              sku: 'WOMENS-CARD-001-SM'
            },
            {
              name: 'L/XL',
              priceModifier: 0,
              stockQuantity: 45,
              sku: 'WOMENS-CARD-001-LXL'
            }
          ]
        }
      ],
      featured: false,
      onSale: true,
      isActive: true,
      brand: 'CozyKnits',
      rating: {
        average: 4.7,
        count: 98
      },
      seo: {
        title: "Women's Oversized Knit Cardigan - Cozy Layering Essential",
        description: 'Shop our cozy oversized knit cardigan for women. Soft, comfortable fabric with a relaxed fit, perfect for layering in any casual occasion.',
        keywords: ['knit cardigan', 'oversized cardigan', 'women cardigan', 'sweater', 'CozyKnits']
      }
    })
  );

  return womensClothing;
};
