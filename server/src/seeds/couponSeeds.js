import Coupon from '../models/Coupon.js';

export const seedCoupons = async (products, categories) => {
  // Find category IDs by slug
  const getCategoryIdBySlug = (slug) => {
    const category = categories.find(cat => cat.slug === slug);
    return category ? category._id : null;
  };
  
  // Create coupons
  const welcomeCoupon = new Coupon({
    code: 'WELCOME10',
    type: 'percentage',
    value: 10,
    minPurchase: 50,
    maxDiscount: 100,
    validFrom: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 3)), // Valid for 3 months
    usageLimit: 1000,
    usageCount: 0,
    isActive: true,
    description: 'Welcome discount for new customers'
  });
  
  const summerSaleCoupon = new Coupon({
    code: 'SUMMER25',
    type: 'percentage',
    value: 25,
    minPurchase: 100,
    maxDiscount: 200,
    validFrom: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 2)), // Valid for 2 months
    usageLimit: 500,
    usageCount: 0,
    isActive: true,
    applicableCategories: [
      getCategoryIdBySlug('clothing'),
      getCategoryIdBySlug('mens-clothing'),
      getCategoryIdBySlug('womens-clothing')
    ],
    description: 'Summer sale discount on clothing'
  });
  
  const electronicsDiscountCoupon = new Coupon({
    code: 'TECH15',
    type: 'percentage',
    value: 15,
    minPurchase: 200,
    maxDiscount: 300,
    validFrom: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 1)), // Valid for 1 month
    usageLimit: 300,
    usageCount: 0,
    isActive: true,
    applicableCategories: [
      getCategoryIdBySlug('electronics'),
      getCategoryIdBySlug('smartphones'),
      getCategoryIdBySlug('laptops'),
      getCategoryIdBySlug('audio-devices')
    ],
    description: 'Discount on electronics'
  });
  
  const freeShippingCoupon = new Coupon({
    code: 'FREESHIP',
    type: 'fixed',
    value: 10,
    minPurchase: 75,
    validFrom: new Date(),
    validUntil: new Date(new Date().setMonth(new Date().getMonth() + 6)), // Valid for 6 months
    usageLimit: 2000,
    usageCount: 0,
    isActive: true,
    description: 'Free shipping on orders over $75'
  });
  
  // Save coupons
  const coupons = await Promise.all([
    welcomeCoupon.save(),
    summerSaleCoupon.save(),
    electronicsDiscountCoupon.save(),
    freeShippingCoupon.save()
  ]);
  
  return coupons;
};
