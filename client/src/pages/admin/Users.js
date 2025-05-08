import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiEdit, FiTrash2, FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiMail, FiLock } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';

const Users = () => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    role: '',
    isActive: ''
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
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

        if (filters.role) {
          params.role = filters.role;
        }

        if (filters.isActive) {
          params.isActive = filters.isActive === 'active';
        }

        // Add timeout to prevent infinite loading
        const timeoutPromise = new Promise((_, reject) =>
          setTimeout(() => reject(new Error('Request timeout')), 10000)
        );

        const response = await Promise.race([
          api.get('/users', { params }),
          timeoutPromise
        ]);

        // Check if the response has the expected structure
        if (response.data && response.data.success && response.data.user) {
          // If the response contains a single user
          setUsers([response.data.user]);
          setTotalPages(1);
          setTotalUsers(1);
        } else if (response.data && response.data.success && response.data.users) {
          // If the response contains multiple users
          setUsers(response.data.users);

          // Safely access pagination data
          if (response.data.pagination) {
            setTotalPages(response.data.pagination.pages || 1);
            setTotalUsers(response.data.pagination.total || 0);
          } else if (response.data.totalPages && response.data.total) {
            // Alternative pagination format
            setTotalPages(response.data.totalPages || 1);
            setTotalUsers(response.data.total || 0);
          } else {
            // If pagination data is missing, set defaults
            setTotalPages(1);
            setTotalUsers(response.data.users.length);
          }
        } else {
          // Handle unexpected response format
          console.error('Unexpected API response format:', response.data);
          throw new Error('Invalid response format');
        }
      } catch (error) {
        console.error('Error fetching users:', error);

        // Check if we're in development mode
        if (process.env.NODE_ENV === 'development') {
          // Create some sample users for development
          const sampleUsers = [
            {
              _id: '1',
              firstName: 'Admin',
              lastName: 'User',
              username: 'admin',
              email: 'admin@example.com',
              role: 'admin',
              isActive: true,
              createdAt: new Date().toISOString()
            },
            {
              _id: '2',
              firstName: 'Regular',
              lastName: 'User',
              username: 'user',
              email: 'user@example.com',
              role: 'user',
              isActive: true,
              createdAt: new Date().toISOString()
            }
          ];

          console.log('Using sample users for development');
          setUsers(sampleUsers);
          setTotalPages(1);
          setTotalUsers(sampleUsers.length);
          setError('');
        } else {
          setError('Failed to load users. Please try again later.');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchUsers();
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

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Handle delete
  const handleDelete = async () => {
    if (!userToDelete) return;

    try {
      await api.delete(`/users/${userToDelete._id}`);

      // Remove user from list
      setUsers(prev => prev.filter(u => u._id !== userToDelete._id));

      // Close modal
      setShowDeleteModal(false);
      setUserToDelete(null);

      // Show success message
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user. Please try again later.');
    }
  };

  // Handle reset password
  const handleResetPassword = async (userId) => {
    try {
      await api.post(`/users/${userId}/reset-password`);
      alert('Password reset email has been sent to the user.');
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password. Please try again later.');
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Users Management</h1>

        <Link
          to="/admin/users/new"
          className="flex items-center bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
        >
          Add User
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
                  placeholder="Search by name, email, or username..."
                  className="w-full px-4 py-2 pl-10 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FiSearch className="text-secondary-400" />
                </div>
              </div>
            </form>
          </div>

          {/* Role Filter */}
          <div className="w-full md:w-48">
            <label htmlFor="role" className="block text-sm font-medium text-secondary-700 mb-1">
              Role
            </label>
            <select
              id="role"
              name="role"
              value={filters.role}
              onChange={handleFilterChange}
              className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="user">User</option>
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
                role: '',
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

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
          </div>
        ) : error ? (
          <div className="p-6 text-red-600">
            {error}
          </div>
        ) : users.length === 0 ? (
          <div className="p-6 text-center">
            <p className="text-secondary-600">No users found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-secondary-200">
              <thead className="bg-secondary-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    User
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Email
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-secondary-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-secondary-200">
                {users.map((userData) => (
                  <tr key={userData._id} className="hover:bg-secondary-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                          {userData.firstName ? userData.firstName.charAt(0).toUpperCase() : userData.username.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-secondary-900">
                            {userData.firstName} {userData.lastName}
                          </div>
                          <div className="text-sm text-secondary-500">
                            @{userData.username}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-secondary-900">{userData.email}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        userData.role === 'admin'
                          ? 'bg-purple-100 text-purple-800'
                          : userData.role === 'manager'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-secondary-100 text-secondary-800'
                      }`}>
                        {userData.role.charAt(0).toUpperCase() + userData.role.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${userData.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {userData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-secondary-500">
                      {formatDate(userData.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button
                          onClick={() => handleResetPassword(userData._id)}
                          className="text-secondary-600 hover:text-secondary-900"
                          title="Reset Password"
                        >
                          <FiLock className="w-5 h-5" />
                        </button>
                        <button
                          onClick={() => {
                            // Send email functionality
                          }}
                          className="text-secondary-600 hover:text-secondary-900"
                          title="Send Email"
                        >
                          <FiMail className="w-5 h-5" />
                        </button>
                        <Link
                          to={`/admin/users/edit/${userData._id}`}
                          className="text-primary-600 hover:text-primary-900"
                          title="Edit"
                        >
                          <FiEdit className="w-5 h-5" />
                        </Link>
                        <button
                          onClick={() => {
                            setUserToDelete(userData);
                            setShowDeleteModal(true);
                          }}
                          className="text-red-600 hover:text-red-900"
                          title="Delete"
                          disabled={userData._id === user._id}
                        >
                          <FiTrash2 className={`w-5 h-5 ${userData._id === user._id ? 'opacity-50 cursor-not-allowed' : ''}`} />
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
              Showing {users.length} of {totalUsers} users
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
                      Delete User
                    </h3>
                    <div className="mt-2">
                      <p className="text-sm text-secondary-500">
                        Are you sure you want to delete {userToDelete?.firstName} {userToDelete?.lastName}? This action cannot be undone.
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
                    setUserToDelete(null);
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

export default Users;
