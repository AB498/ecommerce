import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiEye, FiSearch, FiFilter, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Products = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    category: '',
    isActive: '',
    inStock: '',
    onSale: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [categories, setCategories] = useState([]);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [productToDelete, setProductToDelete] = useState(null);

  // Fetch products
  useEffect(() => {
    const fetchProducts = async () => {
      if (!isAuthenticated || authLoading) return;

      setLoading(true);
      setError('');

      try {
        // Build query parameters
        const params = {
          page: currentPage,
          limit: 10,
          sort: '-createdAt'
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (filters.category) {
          params.category = filters.category;
        }

        if (filters.isActive) {
          params.isActive = filters.isActive === 'active';
        }

        if (filters.inStock) {
          params.inStock = filters.inStock === 'inStock';
        }

        if (filters.onSale) {
          params.onSale = filters.onSale === 'onSale';
        }

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        const response = await Promise.race([
          api.get('/products', { params }),
          timeoutPromise
        ]);

        // Check if the response has the expected structure
        if (response.data && response.data.products) {
          setProducts(response.data.products);

          // Safely access pagination data
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.pages || 1);
            setTotalProducts(response.data.pagination.total || 0);
          } else {
            // If pagination data is missing, set defaults
            setTotalPages(1);
            setTotalProducts(response.data.products.length);
          }
        } else {
          // Handle unexpected response format
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching products:', error);
        setError('Failed to load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === 'admin' || user.role === 'manager')) {
      fetchProducts();
    }
  }, [isAuthenticated, authLoading, user, currentPage, searchQuery, filters]);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 5000)
        );

        const response = await Promise.race([
          api.get('/categories'),
          timeoutPromise
        ]);

        // Check if the response has the expected structure
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);
        } else {
          // Handle unexpected response format
          console.error('Invalid categories response format');
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    setCurrentPage(1);
  };

  // Handle filter change
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
    setCurrentPage(1);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!productToDelete) return;

    try {
      await api.delete(`/products/${productToDelete._id}`);

      // Remove product from list
      setProducts(prev => prev.filter(product => product._id !== productToDelete._id));

      // Close modal
      setShowDeleteModal(false);
      setProductToDelete(null);
    } catch (error) {
      console.error('Error deleting product:', error);
      alert('Failed to delete product. Please try again later.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Products Management</h1>

        <Link
          to="/admin/products/new"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          <FiPlus className="mr-2" />
          Add Product
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="flex flex-col md:flex-row md:items-end space-y-4 md:space-y-0 md:space-x-4">
          {/* Search */}
          <div className="flex-grow">
            <form onSubmit={handleSearch}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search products..."
                  className="w-full px-4 py-2 pl-10 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-secondary-400" />
                </div>
              </div>
            </form>
          </div>

          {/* Category Filter */}
          <div className="w-full md:w-48">
            <label htmlFor="category" className="block text-sm font-medium text-secondary-700 mb-1">
              Category
            </label>
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-40">
            <label htmlFor="isActive" className="block text-sm font-medium text-secondary-700 mb-1">
              Status
            </label>
            <select
              id="isActive"
              name="isActive"
              value={filters.isActive}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>

          {/* Stock Filter */}
          <div className="w-full md:w-40">
            <label htmlFor="inStock" className="block text-sm font-medium text-secondary-700 mb-1">
              Stock
            </label>
            <select
              id="inStock"
              name="inStock"
              value={filters.inStock}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Stock</option>
              <option value="inStock">In Stock</option>
              <option value="outOfStock">Out of Stock</option>
            </select>
          </div>

          {/* Sale Filter */}
          <div className="w-full md:w-40">
            <label htmlFor="onSale" className="block text-sm font-medium text-secondary-700 mb-1">
              Sale
            </label>
            <select
              id="onSale"
              name="onSale"
              value={filters.onSale}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Products</option>
              <option value="onSale">On Sale</option>
              <option value="notOnSale">Not On Sale</option>
            </select>
          </div>

          {/* Reset Filters */}
          <button
            onClick={() => {
              setFilters({
                category: '',
                isActive: '',
                inStock: '',
                onSale: ''
              });
              setSearchQuery('');
              setCurrentPage(1);
            }}
            className="px-4 py-2 border border-secondary-300 rounded-md text-secondary-700 hover:bg-secondary-50"
          >
            <FiFilter className="inline-block mr-1" />
            Reset
          </button>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">
            {error}
          </div>
        ) : products.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-secondary-600">No products found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Product
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    SKU
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Stock
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {products.map((product) => (
                  <tr key={product._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden">
                          <img
                            src={product.images[0]?.url || 'https://via.placeholder.com/40'}
                            alt={product.name}
                            className="h-10 w-10 object-cover"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {product.name}
                          </div>
                          <div className="text-sm text-secondary-500">
                            {product.categories.map(cat => cat.name).join(', ')}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {product.sku || '-'}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">
                        ${product.price.amount.toFixed(2)}
                      </div>
                      {product.onSale && product.price.compareAtPrice && (
                        <div className="text-xs text-secondary-500 line-through">
                          ${product.price.compareAtPrice.toFixed(2)}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className={`text-sm ${product.stockQuantity <= 0 ? 'text-red-600' : product.stockQuantity <= 5 ? 'text-yellow-600' : 'text-green-600'}`}>
                        {product.stockQuantity}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${product.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {product.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/products/${product.slug}`}
                          className="text-secondary-600 hover:text-secondary-900"
                          title="View"
                        >
                          <FiEye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/admin/products/edit/${product._id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => {
                            setProductToDelete(product);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                        >
                          <FiTrash2 className="w-5 h-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && totalPages > 0 && (
          <div className="px-6 py-4 bg-secondary-50 border-t border-secondary-200 flex items-center justify-between">
            <div className="text-sm text-secondary-700">
              Showing {products.length} of {totalProducts} products
            </div>
            <div className="flex space-x-2">
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-md border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-md border border-secondary-300 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <FiChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-secondary-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
                    <FiTrash2 className="h-6 w-6 text-red-600" />
                  </div>
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                    <h3 className="text-lg leading-6 font-medium text-secondary-900">
                      Delete Product
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-secondary-500">
                        Are you sure you want to delete "{productToDelete?.name}"? This action cannot be undone.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-secondary-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleDelete}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Delete
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowDeleteModal(false);
                    setProductToDelete(null);
                  }}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-secondary-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-secondary-700 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
