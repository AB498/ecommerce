import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiTruck, FiCheckCircle, FiAlertCircle, FiSearch } from 'react-icons/fi';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';

const OrderTrackingPage = () => {
  const [orderNumber, setOrderNumber] = useState('');
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [orderData, setOrderData] = useState(null);

  // Sample order statuses for the stepper
  const orderStatuses = [
    { id: 'processing', label: 'Processing', icon: FiPackage, description: 'Your order has been received and is being processed' },
    { id: 'shipped', label: 'Shipped', icon: FiTruck, description: 'Your order has been shipped and is on its way' },
    { id: 'delivered', label: 'Delivered', icon: FiCheckCircle, description: 'Your order has been delivered' }
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!orderNumber.trim() || !email.trim()) {
      setError('Please enter both order number and email');
      return;
    }

    try {
      setLoading(true);
      setError('');

      // In a real application, this would be an API call to fetch the order
      // For demo purposes, we'll simulate a successful response after a delay
      setTimeout(() => {
        // Sample order data for demonstration
        const sampleOrder = {
          _id: orderNumber,
          orderNumber: orderNumber,
          status: 'shipped',
          createdAt: new Date().toISOString(),
          shippingAddress: {
            fullName: 'John Doe',
            address: '123 Main St',
            city: 'New York',
            state: 'NY',
            postalCode: '10001',
            country: 'USA'
          },
          items: [
            {
              _id: '1',
              product: {
                _id: 'prod1',
                name: 'Wireless Headphones',
                slug: 'wireless-headphones',
                images: ['https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80']
              },
              quantity: 1,
              price: 129.99
            },
            {
              _id: '2',
              product: {
                _id: 'prod2',
                name: 'Smartphone Case',
                slug: 'smartphone-case',
                images: ['https://images.unsplash.com/photo-1541877944-ac82a091518a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80']
              },
              quantity: 2,
              price: 19.99
            }
          ],
          shippingMethod: 'Standard Shipping',
          trackingNumber: 'TRK123456789',
          carrier: 'FedEx',
          estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
          shippingPrice: 5.99,
          totalPrice: 175.96,
          paymentMethod: 'Credit Card',
          isPaid: true,
          paidAt: new Date().toISOString(),
          events: [
            {
              status: 'processing',
              date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
              description: 'Your order has been received and is being processed'
            },
            {
              status: 'shipped',
              date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
              description: 'Your order has been shipped via FedEx'
            }
          ]
        };

        setOrderData(sampleOrder);
        setLoading(false);
      }, 1500);

    } catch (err) {
      console.error('Error tracking order:', err);
      setError('Failed to find order. Please check your order number and email.');
      setLoading(false);
    }
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get current status index for the stepper
  const getCurrentStatusIndex = () => {
    if (!orderData) return -1;
    return orderStatuses.findIndex(status => status.id === orderData.status);
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-indigo-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Track Your Order</h1>
          <p className="text-xl text-center max-w-2xl mx-auto">
            Enter your order details below to check the current status of your purchase.
          </p>
        </div>
      </div>

      {/* Order Tracking Form */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-md p-8 mb-10">
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Order Information</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label htmlFor="orderNumber" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  id="orderNumber"
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="Enter your order number"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email address"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 text-red-700 p-4 rounded-md flex items-start">
                <FiAlertCircle className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" />
                <p>{error}</p>
              </div>
            )}

            <div className="flex justify-center">
              <button
                type="submit"
                className="bg-indigo-600 text-white py-2 px-6 rounded-md hover:bg-indigo-700 transition-colors flex items-center"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="small" color="white" className="mr-2" />
                    Tracking...
                  </>
                ) : (
                  <>
                    <FiSearch className="mr-2" />
                    Track Order
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Order Details (shown after successful tracking) */}
        {orderData && (
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
            {/* Order Summary Header */}
            <div className="bg-indigo-600 text-white p-6">
              <div className="flex flex-col md:flex-row md:justify-between md:items-center">
                <div>
                  <h3 className="text-xl font-bold">Order #{orderData.orderNumber}</h3>
                  <p className="text-indigo-100">Placed on {formatDate(orderData.createdAt)}</p>
                </div>
                <div className="mt-4 md:mt-0">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-indigo-700 text-white">
                    {orderData.status.charAt(0).toUpperCase() + orderData.status.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Order Tracking Stepper */}
            <div className="p-6 border-b border-gray-200">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Tracking Status</h4>

              <div className="relative">
                {/* Progress Bar */}
                <div className="absolute top-5 left-5 right-5 h-0.5 bg-gray-200">
                  <div
                    className="h-0.5 bg-indigo-600 transition-all duration-500"
                    style={{ width: `${Math.max(0, getCurrentStatusIndex()) * 50}%` }}
                  ></div>
                </div>

                {/* Steps */}
                <div className="flex justify-between relative">
                  {orderStatuses.map((status, index) => {
                    const StatusIcon = status.icon;
                    const isActive = index <= getCurrentStatusIndex();
                    const isCurrent = index === getCurrentStatusIndex();

                    return (
                      <div key={status.id} className="flex flex-col items-center relative z-10">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          isActive ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-500'
                        } ${isCurrent ? 'ring-4 ring-indigo-100' : ''}`}>
                          <StatusIcon className="w-5 h-5" />
                        </div>
                        <p className={`mt-2 text-sm font-medium ${
                          isActive ? 'text-indigo-600' : 'text-gray-500'
                        }`}>
                          {status.label}
                        </p>
                        <p className="mt-1 text-xs text-gray-500 text-center max-w-[120px]">
                          {status.description}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Shipping Details */}
              {orderData.trackingNumber && (
                <div className="mt-8 p-4 bg-gray-50 rounded-md">
                  <div className="flex flex-col md:flex-row md:justify-between">
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-gray-500">Carrier</p>
                      <p className="font-medium">{orderData.carrier}</p>
                    </div>
                    <div className="mb-4 md:mb-0">
                      <p className="text-sm text-gray-500">Tracking Number</p>
                      <p className="font-medium">{orderData.trackingNumber}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Estimated Delivery</p>
                      <p className="font-medium">{formatDate(orderData.estimatedDelivery)}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Order Items */}
            <div className="p-6">
              <h4 className="text-lg font-medium text-gray-800 mb-4">Order Items</h4>

              <div className="space-y-4">
                {orderData.items.map((item) => (
                  <div key={item._id} className="flex items-center py-4 border-b border-gray-200 last:border-0">
                    <div className="w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                      <img
                        src={item.product.images[0] || 'https://via.placeholder.com/100'}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="ml-4 flex-grow">
                      <Link
                        to={`/products/${item.product.slug}`}
                        className="text-indigo-600 hover:text-indigo-800 font-medium"
                      >
                        {item.product.name}
                      </Link>
                      <p className="text-gray-500 text-sm">Quantity: {item.quantity}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">${item.price.toFixed(2)}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Order Summary */}
              <div className="mt-6 border-t border-gray-200 pt-6">
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Subtotal</p>
                  <p className="font-medium">${(orderData.totalPrice - orderData.shippingPrice).toFixed(2)}</p>
                </div>
                <div className="flex justify-between mb-2">
                  <p className="text-gray-600">Shipping</p>
                  <p className="font-medium">${orderData.shippingPrice.toFixed(2)}</p>
                </div>
                <div className="flex justify-between font-bold text-lg mt-4">
                  <p>Total</p>
                  <p>${orderData.totalPrice.toFixed(2)}</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="bg-gray-50 p-6 flex flex-col sm:flex-row justify-between items-center">
              <p className="text-gray-600 mb-4 sm:mb-0">
                Need help with your order?
              </p>
              <div className="flex space-x-4">
                <Link
                  to="/contact"
                  className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-50 transition-colors"
                >
                  Contact Support
                </Link>
                <Link
                  to="/"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
                >
                  Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderTrackingPage;
