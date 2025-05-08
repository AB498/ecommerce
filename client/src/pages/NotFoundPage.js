import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiShoppingBag } from 'react-icons/fi';

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary-50 px-4">
      <div className="text-center">
        <h1 className="text-9xl font-bold text-primary-600">404</h1>
        <h2 className="text-3xl font-semibold mt-4 mb-6 text-secondary-800">Page Not Found</h2>
        <p className="text-secondary-600 mb-8 max-w-md mx-auto">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>
        <div className="flex flex-col sm:flex-row justify-center gap-4">
          <Link
            to="/"
            className="inline-flex items-center justify-center bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            <FiHome className="mr-2" /> Go Home
          </Link>
          <Link
            to="/products"
            className="inline-flex items-center justify-center bg-secondary-200 text-secondary-800 px-6 py-3 rounded-md font-medium hover:bg-secondary-300 transition-colors"
          >
            <FiShoppingBag className="mr-2" /> Browse Products
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
