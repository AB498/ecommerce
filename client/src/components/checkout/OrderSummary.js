import React from 'react';
import { Link } from 'react-router-dom';
import { FiCheckCircle, FiTruck, FiPackage, FiCreditCard, FiMapPin } from 'react-icons/fi';

const OrderSummary = ({ order }) => {
  if (!order) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get status color
  const getStatusColor = (status) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'processing':
        return 'bg-blue-100 text-blue-800';
      case 'shipped':
        return 'bg-indigo-100 text-indigo-800';
      case 'delivered':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      case 'returned':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  // Get payment status color
  const getPaymentStatusColor = (status) => {
    switch (status) {
      case 'paid':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'failed':
        return 'bg-red-100 text-red-800';
      case 'refunded':
        return 'bg-orange-100 text-orange-800';
      case 'partially_refunded':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-secondary-100 text-secondary-800';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Order Header */}
      <div className="p-6 border-b border-secondary-200">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
          <div>
            <h1 className="text-2xl font-bold text-secondary-900 mb-1">
              Order #{order.orderNumber}
            </h1>
            <p className="text-secondary-600">
              Placed on {formatDate(order.createdAt)}
            </p>
          </div>
          <div className="mt-4 md:mt-0 flex flex-col md:flex-row md:items-center space-y-2 md:space-y-0 md:space-x-4">
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
              {order.orderStatus.charAt(0).toUpperCase() + order.orderStatus.slice(1)}
            </span>
            <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
              Payment: {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
            </span>
          </div>
        </div>
      </div>

      {/* Order Progress */}
      {order.orderStatus !== 'cancelled' && (
        <div className="p-6 border-b border-secondary-200">
          <div className="flex justify-between">
            <div className={`flex flex-col items-center ${['pending', 'processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['pending', 'processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                <FiCheckCircle className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1">Confirmed</span>
            </div>
            <div className="relative flex-grow mx-4">
              <div className={`absolute top-5 h-0.5 w-full ${['processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'bg-primary-600' : 'bg-secondary-200'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${['processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['processing', 'shipped', 'delivered'].includes(order.orderStatus) ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                <FiPackage className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1">Processing</span>
            </div>
            <div className="relative flex-grow mx-4">
              <div className={`absolute top-5 h-0.5 w-full ${['shipped', 'delivered'].includes(order.orderStatus) ? 'bg-primary-600' : 'bg-secondary-200'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${['shipped', 'delivered'].includes(order.orderStatus) ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['shipped', 'delivered'].includes(order.orderStatus) ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                <FiTruck className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1">Shipped</span>
            </div>
            <div className="relative flex-grow mx-4">
              <div className={`absolute top-5 h-0.5 w-full ${['delivered'].includes(order.orderStatus) ? 'bg-primary-600' : 'bg-secondary-200'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${['delivered'].includes(order.orderStatus) ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center ${['delivered'].includes(order.orderStatus) ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                <FiMapPin className="w-5 h-5" />
              </div>
              <span className="text-xs mt-1">Delivered</span>
            </div>
          </div>
        </div>
      )}

      {/* Order Items */}
      <div className="p-6 border-b border-secondary-200">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Items</h2>
        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item._id} className="flex py-4 border-b border-secondary-100 last:border-b-0">
              <div className="w-16 h-16 flex-shrink-0">
                <img
                  src={item.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=64&q=80'}
                  alt={item.name}
                  className="w-full h-full object-cover rounded-md"
                />
              </div>
              <div className="ml-4 flex-grow">
                <div className="flex flex-col sm:flex-row justify-between">
                  <div>
                    <Link to={`/products/${item.product?.slug || '#'}`} className="text-secondary-900 font-medium hover:text-primary-600">
                      {item.name}
                    </Link>
                    {item.selectedVariants && item.selectedVariants.length > 0 && (
                      <p className="text-sm text-secondary-500">
                        {item.selectedVariants.map((variant, index) => (
                          <span key={index}>
                            {variant.name}: {variant.value}
                            {index < item.selectedVariants.length - 1 ? ', ' : ''}
                          </span>
                        ))}
                      </p>
                    )}
                    {item.sku && (
                      <p className="text-xs text-secondary-500">SKU: {item.sku}</p>
                    )}
                  </div>
                  <div className="mt-1 sm:mt-0 text-right">
                    <p className="text-secondary-900 font-medium">
                      ${(item.price.amount * item.quantity).toFixed(2)}
                    </p>
                    <p className="text-sm text-secondary-500">
                      ${item.price.amount.toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Details */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 border-b border-secondary-200">
        {/* Shipping Address */}
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-2">Shipping Address</h2>
          <div className="bg-secondary-50 p-4 rounded-md">
            <p className="font-medium text-secondary-900">{order.shippingAddress.name}</p>
            <p className="text-secondary-700">{order.shippingAddress.street}</p>
            <p className="text-secondary-700">
              {order.shippingAddress.city}, {order.shippingAddress.state} {order.shippingAddress.postalCode}
            </p>
            <p className="text-secondary-700">{order.shippingAddress.country}</p>
            <p className="text-secondary-700">{order.shippingAddress.phone}</p>
          </div>
        </div>

        {/* Payment Information */}
        <div>
          <h2 className="text-lg font-semibold text-secondary-900 mb-2">Payment Information</h2>
          <div className="bg-secondary-50 p-4 rounded-md">
            <p className="font-medium text-secondary-900">
              <FiCreditCard className="inline-block mr-2" />
              {order.paymentMethod === 'credit_card' ? 'Credit Card' :
               order.paymentMethod === 'paypal' ? 'PayPal' :
               order.paymentMethod}
            </p>
            <p className="text-secondary-700 mt-2">
              Status: <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getPaymentStatusColor(order.paymentStatus)}`}>
                {order.paymentStatus.charAt(0).toUpperCase() + order.paymentStatus.slice(1)}
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Order Summary */}
      <div className="p-6">
        <h2 className="text-lg font-semibold text-secondary-900 mb-4">Order Summary</h2>
        <div className="space-y-2">
          <div className="flex justify-between">
            <p className="text-secondary-700">Subtotal</p>
            <p className="text-secondary-900">${order.subtotal.amount.toFixed(2)}</p>
          </div>

          {order.discount.amount > 0 && (
            <div className="flex justify-between">
              <p className="text-secondary-700">
                Discount
                {order.discount.code && <span className="text-xs ml-1">({order.discount.code})</span>}
              </p>
              <p className="text-accent-600">-${order.discount.amount.toFixed(2)}</p>
            </div>
          )}

          <div className="flex justify-between">
            <p className="text-secondary-700">Shipping</p>
            <p className="text-secondary-900">${order.shipping.amount.toFixed(2)}</p>
          </div>

          <div className="flex justify-between">
            <p className="text-secondary-700">Tax</p>
            <p className="text-secondary-900">${order.tax.amount.toFixed(2)}</p>
          </div>

          <div className="flex justify-between border-t border-secondary-200 pt-2 font-medium">
            <p className="text-secondary-900">Total</p>
            <p className="text-secondary-900">${order.total.amount.toFixed(2)}</p>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="p-6 bg-secondary-50 border-t border-secondary-200">
        <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
          <Link to="/orders" className="text-primary-600 hover:text-primary-800">
            ← Back to Orders
          </Link>

          <div className="flex space-x-4">
            {order.orderStatus === 'delivered' && (
              <button className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700">
                Write a Review
              </button>
            )}

            {['pending', 'processing'].includes(order.orderStatus) && (
              <button className="px-4 py-2 border border-red-600 text-red-600 rounded-md hover:bg-red-50">
                Cancel Order
              </button>
            )}

            <button className="px-4 py-2 border border-secondary-300 text-secondary-700 rounded-md hover:bg-secondary-100">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
