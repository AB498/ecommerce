import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiChevronRight, FiTag, FiCheck } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';

const CartSummary = () => {
  const { cart, calculateTotals, applyCoupon, removeCoupon } = useCart();
  const { isAuthenticated } = useAuth();
  const [couponCode, setCouponCode] = useState('');
  const [couponError, setCouponError] = useState('');
  const [isApplying, setIsApplying] = useState(false);
  const navigate = useNavigate();

  const { subtotal, discount, tax, shipping, total } = calculateTotals();

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) {
      setCouponError('Please enter a coupon code');
      return;
    }

    setIsApplying(true);
    setCouponError('');

    try {
      const result = await applyCoupon(couponCode);
      if (!result.success) {
        setCouponError(result.error || 'Invalid coupon code');
      }
    } catch (error) {
      setCouponError('Error applying coupon');
      console.error('Apply coupon error:', error);
    } finally {
      setIsApplying(false);
    }
  };

  const handleRemoveCoupon = async () => {
    try {
      await removeCoupon();
      setCouponCode('');
    } catch (error) {
      console.error('Remove coupon error:', error);
    }
  };

  const handleCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: '/checkout' } });
    } else {
      navigate('/checkout');
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Summary</h2>

      {/* Order Details */}
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-secondary-700">
          <span>Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} items)</span>
          <span>${subtotal.toFixed(2)}</span>
        </div>

        {discount > 0 && (
          <div className="flex justify-between text-accent-600">
            <span>Discount</span>
            <span>-${discount.toFixed(2)}</span>
          </div>
        )}

        <div className="flex justify-between text-secondary-700">
          <span>Shipping</span>
          {shipping > 0 ? (
            <span>${shipping.toFixed(2)}</span>
          ) : (
            <span className="text-green-600">Free</span>
          )}
        </div>

        <div className="flex justify-between text-secondary-700">
          <span>Tax</span>
          <span>${tax.toFixed(2)}</span>
        </div>

        <div className="border-t border-secondary-200 pt-3 flex justify-between font-semibold text-lg text-secondary-900">
          <span>Total</span>
          <span>${total.toFixed(2)}</span>
        </div>
      </div>

      {/* Coupon Code */}
      <div className="mb-6">
        <h3 className="text-sm font-medium text-secondary-900 mb-2">Coupon Code</h3>

        {cart.couponCode ? (
          <div className="flex items-center justify-between bg-green-50 border border-green-200 rounded-md p-3">
            <div className="flex items-center">
              <FiCheck className="text-green-600 mr-2" />
              <span className="text-green-800 font-medium">{cart.couponCode}</span>
            </div>
            <button
              onClick={handleRemoveCoupon}
              className="text-sm text-secondary-700 hover:text-secondary-900"
            >
              Remove
            </button>
          </div>
        ) : (
          <div>
            <div className="flex">
              <div className="relative flex-grow">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiTag className="text-secondary-400" />
                </div>
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter coupon code"
                  className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-l-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <button
                onClick={handleApplyCoupon}
                disabled={isApplying || !couponCode.trim()}
                className="bg-primary-600 text-white px-4 py-2 rounded-r-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isApplying ? 'Applying...' : 'Apply'}
              </button>
            </div>
            {couponError && (
              <p className="mt-1 text-sm text-red-600">{couponError}</p>
            )}
          </div>
        )}
      </div>

      {/* Checkout Button */}
      <button
        onClick={handleCheckout}
        disabled={cart.items.length === 0}
        className="w-full flex items-center justify-center bg-primary-600 text-white py-3 px-4 rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isAuthenticated ? 'Proceed to Checkout' : 'Sign in to Checkout'}
        <FiChevronRight className="ml-1" />
      </button>

      {/* Continue Shopping */}
      <div className="mt-4 text-center">
        <Link to="/products" className="text-sm text-primary-600 hover:text-primary-800">
          Continue Shopping
        </Link>
      </div>

      {/* Payment Methods */}
      <div className="mt-6 pt-6 border-t border-secondary-200">
        <p className="text-xs text-secondary-500 text-center mb-2">We Accept</p>
        <div className="flex justify-center space-x-2">
          <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>
          <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
          <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">AMEX</div>
          <div className="bg-blue-400 text-white px-2 py-1 rounded text-xs font-bold">PAYPAL</div>
        </div>
      </div>
    </div>
  );
};

export default CartSummary;
