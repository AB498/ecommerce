import User from '../models/User.js';

export const seedUsers = async () => {
  // Create admin user
  const adminUser = new User({
    username: 'admin',
    email: 'admin@example.com',
    password: 'admin123', // Will be automatically hashed by the User model pre-save middleware
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    isActive: true,
    addresses: [
      {
        type: 'billing',
        name: 'Admin User',
        street: '123 Admin St',
        city: 'Admin City',
        state: 'CA',
        postalCode: '12345',
        country: 'US',
        phone: '123-456-7890',
        isDefault: true
      }
    ],
    lastLogin: new Date()
  });

  // Create manager user
  const managerUser = new User({
    username: 'manager',
    email: 'manager@example.com',
    password: 'manager123', // Will be automatically hashed by the User model pre-save middleware
    firstName: 'Manager',
    lastName: 'User',
    role: 'manager',
    isActive: true,
    addresses: [
      {
        type: 'billing',
        name: 'Manager User',
        street: '456 Manager Ave',
        city: 'Manager City',
        state: 'NY',
        postalCode: '54321',
        country: 'US',
        phone: '987-654-3210',
        isDefault: true
      }
    ],
    lastLogin: new Date()
  });

  // Create regular user
  const regularUser = new User({
    username: 'user',
    email: 'user@example.com',
    password: 'user123', // Will be automatically hashed by the User model pre-save middleware
    firstName: 'Regular',
    lastName: 'User',
    role: 'user',
    isActive: true,
    addresses: [
      {
        type: 'billing',
        name: 'Regular User',
        street: '789 User Blvd',
        city: 'User City',
        state: 'TX',
        postalCode: '67890',
        country: 'US',
        phone: '555-123-4567',
        isDefault: true
      },
      {
        type: 'shipping',
        name: 'Regular User',
        street: '789 User Blvd',
        city: 'User City',
        state: 'TX',
        postalCode: '67890',
        country: 'US',
        phone: '555-123-4567',
        isDefault: true
      }
    ],
    lastLogin: new Date()
  });

  // Save users
  const users = await Promise.all([
    adminUser.save(),
    managerUser.save(),
    regularUser.save()
  ]);

  return users;
};
