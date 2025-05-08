import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiArrowLeft } from 'react-icons/fi';
import CartItem from '../components/cart/CartItem';
import CartSummary from '../components/cart/CartSummary';
import ProductList from '../components/products/ProductList';
import { useCart } from '../context/CartContext';
import api from '../services/api';

const CartPage = () => {
  const { cart, loading, error: cartError } = useCart();
  const [recommendedProducts, setRecommendedProducts] = useState([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  // Fetch recommended products
  useEffect(() => {
    const fetchRecommendedProducts = async () => {
      if (!cart || cart.items.length === 0) return;

      setLoadingRecommendations(true);

      try {
        // Get product IDs from cart
        const productIds = cart.items.map(item => item.product._id);

        // Fetch recommended products based on cart items
        const response = await api.get('/products/recommended', {
          params: { products: productIds.join(','), limit: 4 }
        });

        setRecommendedProducts(response.data.products);
      } catch (error) {
        console.error('Error fetching recommended products:', error);
      } finally {
        setLoadingRecommendations(false);
      }
    };

    fetchRecommendedProducts();
  }, [cart]);

  // Update page title
  useEffect(() => {
    document.title = 'Shopping Cart | E-Commerce';

    return () => {
      document.title = 'E-Commerce';
    };
  }, []);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Shopping Cart</h1>

      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
        </div>
      ) : cartError ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-md my-8">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{cartError}</p>
        </div>
      ) : cart.items.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiShoppingCart className="w-16 h-16 text-secondary-400" />
          </div>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">Your cart is empty</h2>
          <p className="text-secondary-600 mb-6">
            Looks like you haven't added any products to your cart yet.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="p-6 border-b border-secondary-200">
                <h2 className="text-xl font-semibold text-secondary-900">
                  Cart Items ({cart.items.reduce((acc, item) => acc + item.quantity, 0)})
                </h2>
              </div>

              <div className="p-6">
                {cart.items.map((item) => (
                  <CartItem key={item._id} item={item} />
                ))}
              </div>

              <div className="p-6 bg-secondary-50 border-t border-secondary-200">
                <Link
                  to="/products"
                  className="inline-flex items-center text-primary-600 hover:text-primary-800"
                >
                  <FiArrowLeft className="mr-2" /> Continue Shopping
                </Link>
              </div>
            </div>
          </div>

          {/* Cart Summary */}
          <div className="lg:col-span-1">
            <CartSummary />
          </div>
        </div>
      )}

      {/* Recommended Products */}
      {recommendedProducts.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">You Might Also Like</h2>
          <ProductList
            products={recommendedProducts}
            loading={loadingRecommendations}
            error={null}
          />
        </div>
      )}
    </div>
  );
};

export default CartPage;
