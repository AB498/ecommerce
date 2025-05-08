import { seedSmartphones } from './smartphones.js';
import { seedLaptops } from './laptops.js';
import { seedHeadphones } from './headphones.js';
import { seedMensClothing } from './mensClothing.js';
import { seedWomensClothing } from './womensClothing.js';
import { seedHomeDecor } from './homeDecor.js';
import { seedAccessories } from './accessories.js';

export const seedAllProducts = async (categories) => {
  try {
    // Find category IDs by slug
    const getCategoryIdBySlug = (slug) => {
      const category = categories.find(cat => cat.slug === slug);
      return category ? category._id : null;
    };

    // Seed all product categories
    const smartphones = await seedSmartphones(getCategoryIdBySlug);
    const laptops = await seedLaptops(getCategoryIdBySlug);
    const headphones = await seedHeadphones(getCategoryIdBySlug);
    const mensClothing = await seedMensClothing(getCategoryIdBySlug);
    const womensClothing = await seedWomensClothing(getCategoryIdBySlug);
    const homeDecor = await seedHomeDecor(getCategoryIdBySlug);
    const accessories = await seedAccessories(getCategoryIdBySlug);

    // Combine all products
    const allProducts = [
      ...smartphones,
      ...laptops,
      ...headphones,
      ...mensClothing,
      ...womensClothing,
      ...homeDecor,
      ...accessories
    ];

    // Save all products to the database
    const savedProducts = await Promise.all(
      allProducts.map(product => product.save())
    );

    console.log(`Seeded ${savedProducts.length} products successfully`);
    return savedProducts;
  } catch (error) {
    console.error('Error seeding products:', error);
    throw error;
  }
};
