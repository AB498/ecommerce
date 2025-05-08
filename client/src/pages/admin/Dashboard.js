import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiUsers, FiShoppingBag, FiPackage, FiDollarSign, FiTrendingUp, FiBarChart2, FiPieChart } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Dashboard = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [period, setPeriod] = useState('30d');

  // Fetch dashboard stats
  useEffect(() => {
    const fetchDashboardStats = async () => {
      if (!isAuthenticated || authLoading) return;

      setLoading(true);
      setError('');

      try {
        const response = await api.get(`/admin/dashboard?period=${period}`);
        setStats(response.data.stats);
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        setError('Failed to load dashboard statistics. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === 'admin' || user.role === 'manager')) {
      fetchDashboardStats();
    }
  }, [isAuthenticated, authLoading, user, period]);

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

        <div className="flex">
          <select
            value={period}
            onChange={(e) => setPeriod(e.target.value)}
            className="border border-gray-300 rounded-md px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
            <option value="1y">Last Year</option>
          </select>
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
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Revenue Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-secondary-700">Revenue</h2>
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center">
                  <FiDollarSign className="w-5 h-5 text-primary-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-secondary-900">
                    ${stats.revenue.total.toFixed(2)}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {stats.revenue.count} orders
                  </p>
                </div>
                <div className="text-sm text-green-600 flex items-center">
                  <FiTrendingUp className="mr-1" />
                  +{Math.round((stats.revenue.total / (stats.revenue.total - 1000)) * 100 - 100)}%
                </div>
              </div>
            </div>

            {/* Orders Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-secondary-700">Orders</h2>
                <div className="w-10 h-10 rounded-full bg-accent-100 flex items-center justify-center">
                  <FiShoppingBag className="w-5 h-5 text-accent-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-secondary-900">
                    {stats.orders.new}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {stats.orders.total} total
                  </p>
                </div>
                <div className="text-sm text-green-600 flex items-center">
                  <FiTrendingUp className="mr-1" />
                  +{Math.round((stats.orders.new / (stats.orders.total - stats.orders.new)) * 100)}%
                </div>
              </div>
            </div>

            {/* Users Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-secondary-700">Users</h2>
                <div className="w-10 h-10 rounded-full bg-secondary-100 flex items-center justify-center">
                  <FiUsers className="w-5 h-5 text-secondary-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-secondary-900">
                    {stats.users.new}
                  </p>
                  <p className="text-sm text-secondary-500">
                    {stats.users.total} total
                  </p>
                </div>
                <div className="text-sm text-green-600 flex items-center">
                  <FiTrendingUp className="mr-1" />
                  +{Math.round((stats.users.new / (stats.users.total - stats.users.new)) * 100)}%
                </div>
              </div>
            </div>

            {/* Products Card */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-secondary-700">Products</h2>
                <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center">
                  <FiPackage className="w-5 h-5 text-indigo-600" />
                </div>
              </div>
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-3xl font-bold text-secondary-900">
                    {stats.products.total}
                  </p>
                  <p className="text-sm text-red-600">
                    {stats.products.lowStock} low stock
                  </p>
                </div>
                <Link
                  to="/admin/products"
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  View All
                </Link>
              </div>
            </div>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
            {/* Revenue Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-secondary-900">Revenue Overview</h2>
                <div className="text-sm text-secondary-500">
                  Average: ${stats.revenue.averageOrderValue.toFixed(2)}
                </div>
              </div>
              <div className="h-64 flex items-center justify-center">
                <FiBarChart2 className="w-16 h-16 text-secondary-300" />
                <p className="ml-4 text-secondary-500">Revenue chart will be implemented soon</p>
              </div>
            </div>

            {/* Order Status Chart */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-secondary-900">Order Status</h2>
              </div>
              <div className="h-64 flex items-center justify-center">
                <FiPieChart className="w-16 h-16 text-secondary-300" />
                <p className="ml-4 text-secondary-500">Order status chart will be implemented soon</p>
              </div>
            </div>
          </div>

          {/* Top Products & Categories */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Top Products */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-secondary-900">Top Selling Products</h2>
                <Link
                  to="/admin/products"
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Product
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Sold
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Revenue
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200">
                    {stats.topProducts.map((product) => (
                      <tr key={product._id} className="hover:bg-secondary-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10 bg-secondary-100 rounded-md"></div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-secondary-900">
                                {product.name}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-secondary-900">
                          {product.totalQuantity}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-secondary-900">
                          ${product.totalRevenue.toFixed(2)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Top Categories */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-secondary-900">Top Categories</h2>
                <Link
                  to="/admin/categories"
                  className="text-sm text-primary-600 hover:text-primary-800"
                >
                  View All
                </Link>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-secondary-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Category
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Products
                      </th>
                      <th className="px-4 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                        Value
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-secondary-200">
                    {stats.topCategories.map((category) => (
                      <tr key={category._id} className="hover:bg-secondary-50">
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-secondary-900">
                            {category.name}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-secondary-900">
                          {category.totalProducts}
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap text-right text-sm text-secondary-900">
                          ${category.totalValue ? category.totalValue.toFixed(2) : '0.00'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;
