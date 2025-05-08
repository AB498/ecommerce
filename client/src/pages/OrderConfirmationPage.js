import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, Navigate } from 'react-router-dom';
import { FiCheckCircle, FiArrowLeft, FiPrinter } from 'react-icons/fi';
import OrderSummary from '../components/checkout/OrderSummary';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OrderConfirmationPage = () => {
  const { orderId } = useParams();
  const location = useLocation();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Check if coming from successful checkout
  const isSuccess = location.state?.success || false;

  // Fetch order details
  useEffect(() => {
    const fetchOrder = async () => {
      if (!isAuthenticated || authLoading) return;
      
      setLoading(true);
      setError('');
      
      try {
        const response = await api.get(`/orders/${orderId}`);
        setOrder(response.data.order);
      } catch (error) {
        console.error('Error fetching order:', error);
        setError('Failed to load order details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchOrder();
  }, [orderId, isAuthenticated, authLoading]);

  // Update page title
  useEffect(() => {
    document.title = `Order Confirmation | E-Commerce`;
    
    return () => {
      document.title = 'E-Commerce';
    };
  }, []);

  // If not authenticated, redirect to login
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: `/orders/${orderId}` }} replace />;
  }

  // Print order
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
      {isSuccess && (
        <div className="bg-green-50 text-green-800 p-6 rounded-lg mb-8 flex items-start">
          <FiCheckCircle className="w-6 h-6 mr-3 flex-shrink-0 mt-0.5" />
          <div>
            <h2 className="text-xl font-semibold mb-2">Thank you for your order!</h2>
            <p>
              Your order has been placed successfully. We've sent a confirmation email to your registered email address.
              You can track your order status in the "My Orders" section of your account.
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-secondary-900">Order Details</h1>
        
        <div className="flex space-x-4">
          <button
            onClick={handlePrint}
            className="flex items-center text-secondary-700 hover:text-secondary-900"
          >
            <FiPrinter className="mr-2" />
            Print
          </button>
          
          <Link
            to="/orders"
            className="flex items-center text-primary-600 hover:text-primary-800"
          >
            <FiArrowLeft className="mr-2" />
            Back to Orders
          </Link>
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-md my-8">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{error}</p>
        </div>
      ) : (
        <OrderSummary order={order} />
      )}
    </div>
  );
};

export default OrderConfirmationPage;
