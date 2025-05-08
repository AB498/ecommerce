# E-Commerce Website

A full-stack e-commerce website built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features

- User authentication and authorization
- Product browsing and searching
- Shopping cart functionality
- Wishlist management
- Checkout process
- Order tracking
- Admin dashboard
- Responsive design

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT Authentication
- RESTful API

### Frontend
- React
- React Router
- Context API for state management
- Axios for API requests
- Tailwind CSS for styling

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. Clone the repository
   ```
   git clone https://github.com/yourusername/ecommerce.git
   cd ecommerce
   ```

2. Install dependencies
   ```
   npm install
   cd client
   npm install
   cd ..
   cd server
   npm install
   cd ..
   ```

3. Set up environment variables
   - Create a `.env` file in the server directory based on the `.env.example` file
   - Create a `.env` file in the client directory based on the `.env.example` file

4. Start the development servers
   ```
   # Start both client and server
   npm run dev
   
   # Start client only
   npm run dev:client
   
   # Start server only
   npm run dev:server
   ```

5. Open your browser and navigate to `http://localhost:3000`

## Project Structure

```
ecommerce/
├── client/               # Frontend React application
│   ├── public/           # Static assets
│   └── src/              # Source code
│       ├── components/   # Reusable UI components
│       ├── context/      # Context providers
│       ├── pages/        # Page components
│       └── services/     # API services
├── server/               # Backend Express application
│   ├── src/
│       ├── controllers/  # Request handlers
│       ├── middleware/   # Custom middleware
│       ├── models/       # Database models
│       ├── routes/       # API routes
│       ├── utils/        # Utility functions
│       └── index.js      # Entry point
└── package.json          # Project configuration
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/user` - Get current user

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create a new product (Admin)
- `PUT /api/products/:id` - Update a product (Admin)
- `DELETE /api/products/:id` - Delete a product (Admin)

### Categories
- `GET /api/categories` - Get all categories
- `GET /api/categories/:id` - Get category by ID
- `POST /api/categories` - Create a new category (Admin)
- `PUT /api/categories/:id` - Update a category (Admin)
- `DELETE /api/categories/:id` - Delete a category (Admin)

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart/items` - Add item to cart
- `PUT /api/cart/items/:id` - Update cart item
- `DELETE /api/cart/items/:id` - Remove item from cart
- `DELETE /api/cart` - Clear cart

### Wishlist
- `GET /api/wishlist` - Get user's wishlist
- `POST /api/wishlist` - Add product to wishlist
- `DELETE /api/wishlist/:id` - Remove product from wishlist
- `DELETE /api/wishlist` - Clear wishlist

### Orders
- `GET /api/orders` - Get user's orders
- `GET /api/orders/:id` - Get order by ID
- `POST /api/orders` - Create a new order
- `PUT /api/orders/:id` - Update order status (Admin)

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Acknowledgements

- [React](https://reactjs.org/)
- [Express](https://expressjs.com/)
- [MongoDB](https://www.mongodb.com/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React Icons](https://react-icons.github.io/react-icons/)
