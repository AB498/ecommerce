import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiPlus, FiEdit, FiTrash2, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiEye } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Categories = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    level: '',
    isActive: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCategories, setTotalCategories] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [categoryToDelete, setCategoryToDelete] = useState(null);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      if (!isAuthenticated || authLoading) return;

      setLoading(true);
      setError('');

      try {
        // Build query parameters
        const params = {
          page: currentPage,
          limit: 10,
          sort: 'level name'
        };

        if (searchQuery) {
          params.search = searchQuery;
        }

        if (filters.level !== '') {
          params.level = filters.level;
        }

        if (filters.isActive !== '') {
          params.isActive = filters.isActive === 'active';
        }

        const response = await api.get('/categories', { params });

        // Check if the response has the expected structure
        if (response.data && response.data.categories) {
          setCategories(response.data.categories);

          // Safely access pagination data
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.pages || 1);
            setTotalCategories(response.data.pagination.total || 0);
          } else {
            // If pagination data is missing, set defaults
            setTotalPages(1);
            setTotalCategories(response.data.categories.length);
          }
        } else {
          // Handle unexpected response format
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setError('Failed to load categories. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    if (user && (user.role === 'admin' || user.role === 'manager')) {
      fetchCategories();
    }
  }, [isAuthenticated, authLoading, user, currentPage, searchQuery, filters]);

  // No need for redirect check as AdminLayout handles authentication

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
    if (!categoryToDelete) return;

    try {
      await api.delete(`/categories/${categoryToDelete._id}`);

      // Remove category from list
      setCategories(prev => prev.filter(cat => cat._id !== categoryToDelete._id));

      // Close modal
      setShowDeleteModal(false);
      setCategoryToDelete(null);
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category. Please try again later.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Categories Management</h1>

        <Link
          to="/admin/categories/new"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          <FiPlus className="mr-2" />
          Add Category
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
                  placeholder="Search categories..."
                  className="w-full px-4 py-2 pl-10 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-secondary-400" />
                </div>
              </div>
            </form>
          </div>

          {/* Level Filter */}
          <div className="w-full md:w-48">
            <label htmlFor="level" className="block text-sm font-medium text-secondary-700 mb-1">
              Level
            </label>
            <select
              id="level"
              name="level"
              value={filters.level}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Levels</option>
              <option value="0">Parent Categories</option>
              <option value="1">Subcategories</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="w-full md:w-48">
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

          {/* Reset Filters */}
          <button
            onClick={() => {
              setFilters({
                level: '',
                isActive: ''
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

      {/* Categories Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">
            {error}
          </div>
        ) : categories.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-secondary-600">No categories found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Level
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Parent
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
                {categories.map((category) => (
                  <tr key={category._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-md overflow-hidden bg-secondary-100">
                          {category.image ? (
                            <img
                              src={category.image.url}
                              alt={category.name}
                              className="h-10 w-10 object-cover"
                            />
                          ) : (
                            <div className="h-10 w-10 flex items-center justify-center text-secondary-500">
                              {category.icon || '📁'}
                            </div>
                          )}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {category.name}
                          </div>
                          <div className="text-xs text-secondary-500">
                            {category.productCount || 0} products
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {category.slug}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        category.level === 0
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-indigo-100 text-indigo-800'
                      }`}>
                        {category.level === 0 ? 'Parent' : 'Subcategory'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {category.parent ? (
                        <Link
                          to={`/admin/categories/edit/${category.parent._id}`}
                          className="text-primary-600 hover:text-primary-900"
                        >
                          {category.parent.name}
                        </Link>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${category.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <Link
                          to={`/products/category/${category.slug}`}
                          className="text-secondary-600 hover:text-secondary-900"
                          title="View"
                        >
                          <FiEye className="w-5 h-5" />
                        </Link>
                        <Link
                          to={`/admin/categories/edit/${category._id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => {
                            setCategoryToDelete(category);
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
              Showing {categories.length} of {totalCategories} categories
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
                      Delete Category
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-secondary-500">
                        Are you sure you want to delete "{categoryToDelete?.name}"? This action cannot be undone.
                      </p>
                      {categoryToDelete?.level === 0 && (
                        <p className="mt-2 text-sm text-red-600 font-medium">
                          Warning: Deleting a parent category will also delete all its subcategories.
                        </p>
                      )}
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
                    setCategoryToDelete(null);
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

export default Categories;
