import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiUser, FiShoppingBag, FiHeart, FiMapPin, FiLock, FiLogOut, FiX, FiPlus } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const AccountPage = () => {
  const { user, logout, updateProfile } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Check if we have an activeTab in the location state (from redirect)
  const initialTab = location.state?.activeTab || 'profile';

  const [activeTab, setActiveTab] = useState(initialTab);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  // Address management state
  const [addresses, setAddresses] = useState(() => {
    // Initialize from localStorage if available
    const savedAddresses = localStorage.getItem('userAddresses');
    return savedAddresses ? JSON.parse(savedAddresses) : [];
  });
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    name: '',
    addressLine1: '',
    addressLine2: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'US',
    phone: '',
    isDefault: false
  });

  // Load user data
  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        email: user.email || '',
        phone: user.phone || ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      const result = await updateProfile(formData);

      if (result.success) {
        setSuccess('Profile updated successfully');
      } else {
        setError(result.error || 'Failed to update profile');
      }
    } catch (error) {
      console.error('Profile update error:', error);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Address management functions
  const handleAddressChange = (e) => {
    const { name, value, type, checked } = e.target;
    setAddressFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccess('');
    setError('');

    try {
      // In a real app, you would send this to your API
      // const response = await api.post('/addresses', addressFormData);

      // For now, we'll just simulate adding the address
      const newAddress = {
        ...addressFormData,
        id: Date.now().toString(), // Generate a temporary ID
        createdAt: new Date().toISOString()
      };

      // If this is the first address or marked as default, make it the default
      let updatedAddresses;
      if (addresses.length === 0 || addressFormData.isDefault) {
        // First, remove default flag from all other addresses
        const nonDefaultAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: false
        }));

        // Then add the new address with default flag
        updatedAddresses = [...nonDefaultAddresses, { ...newAddress, isDefault: true }];
      } else {
        // Just add the new address
        updatedAddresses = [...addresses, newAddress];
      }

      // Update state
      setAddresses(updatedAddresses);

      // Save to localStorage
      localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));

      setShowAddressModal(false);
      setSuccess('Address added successfully');

      // Reset the form
      setAddressFormData({
        name: '',
        addressLine1: '',
        addressLine2: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'US',
        phone: '',
        isDefault: false
      });
    } catch (error) {
      console.error('Add address error:', error);
      setError('Failed to add address');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = (addressId) => {
    // In a real app, you would send a delete request to your API
    // await api.delete(`/addresses/${addressId}`);

    // Check if we're deleting the default address
    const isRemovingDefault = addresses.find(addr => addr.id === addressId)?.isDefault;

    // Remove the address from the state
    const updatedAddresses = addresses.filter(address => address.id !== addressId);

    // If we deleted the default address and there are other addresses, make the first one default
    if (isRemovingDefault && updatedAddresses.length > 0) {
      updatedAddresses[0].isDefault = true;
    }

    // Update state
    setAddresses(updatedAddresses);

    // Save to localStorage
    localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));

    setSuccess('Address removed successfully');
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">My Account</h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-6 border-b border-secondary-200">
              <div className="flex items-center">
                <div className="w-12 h-12 rounded-full bg-primary-100 text-primary-600 flex items-center justify-center">
                  <FiUser className="w-6 h-6" />
                </div>
                <div className="ml-4">
                  <h2 className="text-lg font-semibold text-secondary-900">
                    {user?.firstName} {user?.lastName}
                  </h2>
                  <p className="text-sm text-secondary-500">{user?.email}</p>
                </div>
              </div>
            </div>

            <nav className="p-4">
              <ul className="space-y-1">
                <li>
                  <button
                    onClick={() => setActiveTab('profile')}
                    className={`w-full flex items-center px-4 py-2 rounded-md ${
                      activeTab === 'profile'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-secondary-700 hover:bg-secondary-50'
                    }`}
                  >
                    <FiUser className="mr-3" />
                    Profile
                  </button>
                </li>
                <li>
                  <Link
                    to="/orders"
                    className="w-full flex items-center px-4 py-2 rounded-md text-secondary-700 hover:bg-secondary-50"
                  >
                    <FiShoppingBag className="mr-3" />
                    Orders
                  </Link>
                </li>
                <li>
                  <Link
                    to="/wishlist"
                    className="w-full flex items-center px-4 py-2 rounded-md text-secondary-700 hover:bg-secondary-50"
                  >
                    <FiHeart className="mr-3" />
                    Wishlist
                  </Link>
                </li>
                <li>
                  <Link
                    to="/account/addresses"
                    className={`w-full flex items-center px-4 py-2 rounded-md ${
                      activeTab === 'addresses'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-secondary-700 hover:bg-secondary-50'
                    }`}
                  >
                    <FiMapPin className="mr-3" />
                    Addresses
                  </Link>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab('security')}
                    className={`w-full flex items-center px-4 py-2 rounded-md ${
                      activeTab === 'security'
                        ? 'bg-primary-50 text-primary-600'
                        : 'text-secondary-700 hover:bg-secondary-50'
                    }`}
                  >
                    <FiLock className="mr-3" />
                    Security
                  </button>
                </li>
                <li>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center px-4 py-2 rounded-md text-red-600 hover:bg-red-50"
                  >
                    <FiLogOut className="mr-3" />
                    Logout
                  </button>
                </li>
              </ul>
            </nav>
          </div>
        </div>

        {/* Main Content */}
        <div className="md:col-span-3">
          <div className="bg-white rounded-lg shadow-md p-6">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">Profile Information</h2>

                {success && (
                  <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                    <div>
                      <label htmlFor="firstName" className="block text-sm font-medium text-secondary-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="lastName" className="block text-sm font-medium text-secondary-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-secondary-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Addresses Tab */}
            {activeTab === 'addresses' && (
              <div>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-semibold text-secondary-900">My Addresses</h2>
                  <button
                    onClick={() => setShowAddressModal(true)}
                    className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  >
                    <FiPlus className="mr-2" />
                    Add New Address
                  </button>
                </div>

                {success && (
                  <div className="mb-4 p-3 bg-green-50 text-green-800 rounded-md">
                    {success}
                  </div>
                )}

                {error && (
                  <div className="mb-4 p-3 bg-red-50 text-red-800 rounded-md">
                    {error}
                  </div>
                )}

                {addresses.length === 0 ? (
                  <div className="text-center py-8 bg-secondary-50 rounded-lg">
                    <FiMapPin className="mx-auto h-12 w-12 text-secondary-400" />
                    <h3 className="mt-2 text-lg font-medium text-secondary-900">No addresses yet</h3>
                    <p className="mt-1 text-sm text-secondary-500">
                      Add your first address to make checkout faster.
                    </p>
                    <div className="mt-6">
                      <button
                        onClick={() => setShowAddressModal(true)}
                        className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                      >
                        <FiPlus className="mr-2" />
                        Add Address
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {addresses.map(address => (
                      <div key={address.id} className="border border-secondary-200 rounded-lg p-4 relative">
                        {address.isDefault && (
                          <span className="absolute top-2 right-2 bg-primary-100 text-primary-800 text-xs px-2 py-1 rounded-full">
                            Default
                          </span>
                        )}
                        <h3 className="font-medium text-secondary-900">{address.name}</h3>
                        <p className="text-sm text-secondary-600 mt-1">{address.addressLine1}</p>
                        {address.addressLine2 && (
                          <p className="text-sm text-secondary-600">{address.addressLine2}</p>
                        )}
                        <p className="text-sm text-secondary-600">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-sm text-secondary-600">{address.country}</p>
                        <p className="text-sm text-secondary-600 mt-1">{address.phone}</p>

                        <div className="mt-4 flex justify-end space-x-2">
                          <button
                            onClick={() => handleDeleteAddress(address.id)}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Delete
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div>
                <h2 className="text-xl font-semibold text-secondary-900 mb-6">Security Settings</h2>

                <div className="mb-8">
                  <h3 className="text-lg font-medium text-secondary-900 mb-4">Change Password</h3>
                  <form>
                    <div className="space-y-4 mb-6">
                      <div>
                        <label htmlFor="currentPassword" className="block text-sm font-medium text-secondary-700 mb-1">
                          Current Password
                        </label>
                        <input
                          type="password"
                          id="currentPassword"
                          name="currentPassword"
                          className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="newPassword" className="block text-sm font-medium text-secondary-700 mb-1">
                          New Password
                        </label>
                        <input
                          type="password"
                          id="newPassword"
                          name="newPassword"
                          className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-secondary-700 mb-1">
                          Confirm New Password
                        </label>
                        <input
                          type="password"
                          id="confirmPassword"
                          name="confirmPassword"
                          className="w-full px-4 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                      >
                        Update Password
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Address Modal */}
      {showAddressModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div className="fixed inset-0 transition-opacity" aria-hidden="true">
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>

            <span className="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

            <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
              <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-secondary-900">Add New Address</h3>
                  <button
                    onClick={() => setShowAddressModal(false)}
                    className="text-secondary-400 hover:text-secondary-500"
                  >
                    <FiX className="h-6 w-6" />
                  </button>
                </div>

                <form onSubmit={handleAddressSubmit}>
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-secondary-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={addressFormData.name}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="addressLine1" className="block text-sm font-medium text-secondary-700 mb-1">
                        Address Line 1
                      </label>
                      <input
                        type="text"
                        id="addressLine1"
                        name="addressLine1"
                        value={addressFormData.addressLine1}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div>
                      <label htmlFor="addressLine2" className="block text-sm font-medium text-secondary-700 mb-1">
                        Address Line 2 (Optional)
                      </label>
                      <input
                        type="text"
                        id="addressLine2"
                        name="addressLine2"
                        value={addressFormData.addressLine2}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="city" className="block text-sm font-medium text-secondary-700 mb-1">
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={addressFormData.city}
                          onChange={handleAddressChange}
                          className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="state" className="block text-sm font-medium text-secondary-700 mb-1">
                          State/Province
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={addressFormData.state}
                          onChange={handleAddressChange}
                          className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="postalCode" className="block text-sm font-medium text-secondary-700 mb-1">
                          Postal Code
                        </label>
                        <input
                          type="text"
                          id="postalCode"
                          name="postalCode"
                          value={addressFormData.postalCode}
                          onChange={handleAddressChange}
                          className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        />
                      </div>

                      <div>
                        <label htmlFor="country" className="block text-sm font-medium text-secondary-700 mb-1">
                          Country
                        </label>
                        <select
                          id="country"
                          name="country"
                          value={addressFormData.country}
                          onChange={handleAddressChange}
                          className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                          required
                        >
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="DE">Germany</option>
                          <option value="FR">France</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-secondary-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={addressFormData.phone}
                        onChange={handleAddressChange}
                        className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                        required
                      />
                    </div>

                    <div className="flex items-center">
                      <input
                        type="checkbox"
                        id="isDefault"
                        name="isDefault"
                        checked={addressFormData.isDefault}
                        onChange={handleAddressChange}
                        className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                      />
                      <label htmlFor="isDefault" className="ml-2 block text-sm text-secondary-900">
                        Set as default address
                      </label>
                    </div>
                  </div>

                  <div className="mt-5 sm:mt-6 sm:grid sm:grid-cols-2 sm:gap-3 sm:grid-flow-row-dense">
                    <button
                      type="submit"
                      disabled={loading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-primary-600 text-base font-medium text-white hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:col-start-2 sm:text-sm"
                    >
                      {loading ? 'Saving...' : 'Save Address'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-secondary-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-secondary-700 hover:bg-secondary-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 sm:mt-0 sm:col-start-1 sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AccountPage;
