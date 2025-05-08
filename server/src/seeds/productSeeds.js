import { seedAllProducts } from './products/index.js';

export const seedProducts = async (categories) => {
  return await seedAllProducts(categories);
};
