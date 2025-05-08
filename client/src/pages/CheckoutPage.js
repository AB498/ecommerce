import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { FiShoppingBag } from 'react-icons/fi';
import CheckoutForm from '../components/checkout/CheckoutForm';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const CheckoutPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { cart, loading: cartLoading } = useCart();
  const location = useLocation();
  const [isReady, setIsReady] = useState(false);

  // Calculate subtotal from cart items
  const calculateSubtotal = () => {
    if (!cart || !cart.items || !Array.isArray(cart.items)) {
      return 0;
    }

    return cart.items.reduce((total, item) => {
      const price = item.price?.amount || 0;
      const quantity = item.quantity || 0;
      return total + (price * quantity);
    }, 0);
  };

  // Calculate tax (10% of subtotal)
  const calculateTax = () => {
    return calculateSubtotal() * 0.1;
  };

  // Calculate total
  const calculateTotal = () => {
    const subtotal = calculateSubtotal();
    const tax = calculateTax();
    const shipping = 0; // Free shipping for now
    const discount = cart?.discount || 0;

    return subtotal + tax + shipping - discount;
  };

  // Check if cart is empty
  useEffect(() => {
    if (!authLoading && !cartLoading) {
      setIsReady(true);
    }
  }, [authLoading, cartLoading]);

  // Update page title
  useEffect(() => {
    document.title = 'Checkout | E-Commerce';

    return () => {
      document.title = 'E-Commerce';
    };
  }, []);

  // If not authenticated, redirect to login
  if (isReady && !authLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If cart is empty, redirect to cart page
  if (isReady && !cartLoading && (!cart || !cart.items || cart.items.length === 0)) {
    console.log('Redirecting to cart page because cart is empty:', cart);
    return <Navigate to="/cart" replace />;
  }

  // Add debugging to see what's in the cart
  console.log('Cart data in checkout page:', cart);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">Checkout</h1>

      {authLoading || cartLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <CheckoutForm />
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Summary</h2>

              {/* Order Items */}
              <div className="mb-6">
                <h3 className="text-sm font-medium text-secondary-900 mb-2">
                  Items ({cart && cart.items ? cart.items.reduce((acc, item) => acc + item.quantity, 0) : 0})
                </h3>
                <div className="space-y-3 max-h-64 overflow-y-auto pr-2">
                  {cart && cart.items && cart.items.map((item) => (
                    <div key={item._id} className="flex items-start">
                      <div className="w-12 h-12 flex-shrink-0 bg-secondary-100 rounded-md overflow-hidden">
                        <img
                          src={item.product?.images?.[0]?.url || 'https://via.placeholder.com/48'}
                          alt={item.product?.name || 'Product'}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="ml-3 flex-grow">
                        <p className="text-sm font-medium text-secondary-900 line-clamp-1">
                          {item.product?.name || 'Product'}
                        </p>
                        <p className="text-xs text-secondary-500">
                          Qty: {item.quantity} × ${item.price?.amount ? item.price.amount.toFixed(2) : '0.00'}
                        </p>
                      </div>
                      <div className="text-sm font-medium text-secondary-900">
                        ${item.price?.amount ? (item.price.amount * item.quantity).toFixed(2) : '0.00'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Price Details */}
              <div className="border-t border-secondary-200 pt-4 space-y-2">
                {/* Calculate subtotal from items if subtotal is not available */}
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Subtotal</span>
                  <span className="text-secondary-900">
                    ${calculateSubtotal().toFixed(2)}
                  </span>
                </div>

                {/* Only show discount if it exists and is greater than 0 */}
                {cart?.discount && cart.discount > 0 && (
                  <div className="flex justify-between text-sm">
                    <span className="text-secondary-600">
                      Discount
                      {cart.couponCode && <span className="text-xs ml-1">({cart.couponCode})</span>}
                    </span>
                    <span className="text-accent-600">-${cart.discount.toFixed(2)}</span>
                  </div>
                )}

                {/* Fixed shipping cost */}
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Shipping</span>
                  <span className="text-secondary-900">
                    $0.00
                  </span>
                </div>

                {/* Fixed tax rate (could be calculated based on subtotal) */}
                <div className="flex justify-between text-sm">
                  <span className="text-secondary-600">Tax</span>
                  <span className="text-secondary-900">
                    ${(calculateSubtotal() * 0.1).toFixed(2)}
                  </span>
                </div>

                {/* Calculate total */}
                <div className="flex justify-between pt-2 border-t border-secondary-200 font-medium">
                  <span className="text-secondary-900">Total</span>
                  <span className="text-secondary-900">
                    ${calculateTotal().toFixed(2)}
                  </span>
                </div>
              </div>

              {/* Secure Checkout */}
              <div className="mt-6 pt-6 border-t border-secondary-200">
                <div className="flex items-center justify-center text-xs text-secondary-500 mb-4">
                  <FiShoppingBag className="mr-1" />
                  <span>Secure Checkout</span>
                </div>
                <div className="flex justify-center space-x-2">
                  <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>
                  <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
                  <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">AMEX</div>
                  <div className="bg-blue-400 text-white px-2 py-1 rounded text-xs font-bold">PAYPAL</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CheckoutPage;
