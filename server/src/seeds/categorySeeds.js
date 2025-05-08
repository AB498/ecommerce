import Category from '../models/Category.js';

export const seedCategories = async () => {
  // Create parent categories
  const electronics = new Category({
    name: 'Electronics',
    slug: 'electronics',
    description: 'Electronic devices and accessories',
    level: 0,
    image: {
      url: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Electronics'
    },
    icon: 'laptop',
    isActive: true,
    order: 1,
    seo: {
      title: 'Electronics - Shop the Latest Gadgets',
      description: 'Explore our wide range of electronic devices and accessories.',
      keywords: ['electronics', 'gadgets', 'devices', 'technology']
    }
  });

  const clothing = new Category({
    name: 'Clothing',
    slug: 'clothing',
    description: 'Apparel and fashion items',
    level: 0,
    image: {
      url: 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Clothing'
    },
    icon: 'shirt',
    isActive: true,
    order: 2,
    seo: {
      title: 'Clothing - Shop the Latest Fashion',
      description: 'Discover trendy apparel and fashion items for all seasons.',
      keywords: ['clothing', 'fashion', 'apparel', 'clothes']
    }
  });

  const home = new Category({
    name: 'Home & Kitchen',
    slug: 'home-kitchen',
    description: 'Home goods and kitchen appliances',
    level: 0,
    image: {
      url: 'https://images.unsplash.com/photo-1556911220-bda9f7f7597b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Home & Kitchen'
    },
    icon: 'home',
    isActive: true,
    order: 3,
    seo: {
      title: 'Home & Kitchen - Essential Products for Your Home',
      description: 'Find everything you need for your home and kitchen.',
      keywords: ['home', 'kitchen', 'appliances', 'furniture', 'decor']
    }
  });

  const books = new Category({
    name: 'Books',
    slug: 'books',
    description: 'Books, e-books, and audiobooks',
    level: 0,
    image: {
      url: 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Books'
    },
    icon: 'book',
    isActive: true,
    order: 4,
    seo: {
      title: 'Books - Explore Our Collection',
      description: 'Browse our extensive collection of books, e-books, and audiobooks.',
      keywords: ['books', 'reading', 'literature', 'e-books', 'audiobooks']
    }
  });

  // Save parent categories
  const savedParents = await Promise.all([
    electronics.save(),
    clothing.save(),
    home.save(),
    books.save()
  ]);

  // Create subcategories for Electronics
  const smartphones = new Category({
    name: 'Smartphones',
    slug: 'smartphones',
    description: 'Mobile phones and accessories',
    parent: savedParents[0]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Smartphones'
    },
    icon: 'smartphone',
    isActive: true,
    order: 1
  });

  const laptops = new Category({
    name: 'Laptops',
    slug: 'laptops',
    description: 'Notebook computers and accessories',
    parent: savedParents[0]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Laptops'
    },
    icon: 'laptop',
    isActive: true,
    order: 2
  });

  const audioDevices = new Category({
    name: 'Audio Devices',
    slug: 'audio-devices',
    description: 'Headphones, speakers, and audio equipment',
    parent: savedParents[0]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Audio Devices'
    },
    icon: 'headphones',
    isActive: true,
    order: 3
  });

  // Create subcategories for Clothing
  const mensClothing = new Category({
    name: "Men's Clothing",
    slug: 'mens-clothing',
    description: 'Clothing for men',
    parent: savedParents[1]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: "Men's Clothing"
    },
    icon: 'man',
    isActive: true,
    order: 1
  });

  const womensClothing = new Category({
    name: "Women's Clothing",
    slug: 'womens-clothing',
    description: 'Clothing for women',
    parent: savedParents[1]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92f1?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: "Women's Clothing"
    },
    icon: 'woman',
    isActive: true,
    order: 2
  });

  const accessories = new Category({
    name: 'Accessories',
    slug: 'accessories',
    description: 'Fashion accessories',
    parent: savedParents[1]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Accessories'
    },
    icon: 'watch',
    isActive: true,
    order: 3
  });

  // Create subcategories for Home & Kitchen
  const furniture = new Category({
    name: 'Furniture',
    slug: 'furniture',
    description: 'Home furniture',
    parent: savedParents[2]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Furniture'
    },
    icon: 'chair',
    isActive: true,
    order: 1
  });

  const kitchenAppliances = new Category({
    name: 'Kitchen Appliances',
    slug: 'kitchen-appliances',
    description: 'Appliances for the kitchen',
    parent: savedParents[2]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1556911220-bda9f7f1555ed?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Kitchen Appliances'
    },
    icon: 'blender',
    isActive: true,
    order: 2
  });

  const homeDecor = new Category({
    name: 'Home Decor',
    slug: 'home-decor',
    description: 'Decorative items for the home',
    parent: savedParents[2]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1584898647426-9a292a24087f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Home Decor'
    },
    icon: 'lamp',
    isActive: true,
    order: 3
  });

  // Create subcategories for Books
  const fiction = new Category({
    name: 'Fiction',
    slug: 'fiction',
    description: 'Fiction books',
    parent: savedParents[3]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Fiction'
    },
    icon: 'book-open',
    isActive: true,
    order: 1
  });

  const nonFiction = new Category({
    name: 'Non-Fiction',
    slug: 'non-fiction',
    description: 'Non-fiction books',
    parent: savedParents[3]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: 'Non-Fiction'
    },
    icon: 'book',
    isActive: true,
    order: 2
  });

  const childrenBooks = new Category({
    name: "Children's Books",
    slug: 'childrens-books',
    description: 'Books for children',
    parent: savedParents[3]._id,
    level: 1,
    image: {
      url: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&h=200&q=80',
      alt: "Children's Books"
    },
    icon: 'book-open',
    isActive: true,
    order: 3
  });

  // Save subcategories
  const savedSubcategories = await Promise.all([
    smartphones.save(),
    laptops.save(),
    audioDevices.save(),
    mensClothing.save(),
    womensClothing.save(),
    accessories.save(),
    furniture.save(),
    kitchenAppliances.save(),
    homeDecor.save(),
    fiction.save(),
    nonFiction.save(),
    childrenBooks.save()
  ]);

  return [...savedParents, ...savedSubcategories];
};
