import React, { useState, useEffect } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import { FiArrowLeft, FiPrinter, FiDownload } from 'react-icons/fi';
import OrderSummary from '../components/checkout/OrderSummary';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

const OrderDetailPage = () => {
  const { orderId } = useParams();
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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
    if (order) {
      document.title = `Order #${order.orderNumber} | E-Commerce`;
    } else {
      document.title = 'Order Details | E-Commerce';
    }
    
    return () => {
      document.title = 'E-Commerce';
    };
  }, [order]);

  // If not authenticated, redirect to login
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: `/orders/${orderId}` }} replace />;
  }

  // Print order
  const handlePrint = () => {
    window.print();
  };

  // Download invoice
  const handleDownloadInvoice = async () => {
    try {
      const response = await api.get(`/orders/${orderId}/invoice`, {
        responseType: 'blob'
      });
      
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `invoice-${order.orderNumber}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Error downloading invoice:', error);
      alert('Failed to download invoice. Please try again later.');
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 pt-24">
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
          
          {order && (
            <button
              onClick={handleDownloadInvoice}
              className="flex items-center text-secondary-700 hover:text-secondary-900"
            >
              <FiDownload className="mr-2" />
              Invoice
            </button>
          )}
          
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

export default OrderDetailPage;
