import React, { useState } from 'react';
import { Link, useLocation, Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { 
  FiHome, 
  FiShoppingBag, 
  FiUsers, 
  FiShoppingCart, 
  FiTag, 
  FiList,
  FiMenu, 
  FiX, 
  FiLogOut, 
  FiUser,
  FiSettings,
  FiBell
} from 'react-icons/fi';

const AdminLayout = ({ children }) => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Redirect if not authenticated or not admin
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleLogout = () => {
    logout();
    // Redirect to login page
    window.location.href = '/login';
  };

  // Navigation items
  const navItems = [
    { path: '/admin', icon: <FiHome className="w-5 h-5" />, label: 'Dashboard' },
    { path: '/admin/products', icon: <FiShoppingBag className="w-5 h-5" />, label: 'Products' },
    { path: '/admin/categories', icon: <FiTag className="w-5 h-5" />, label: 'Categories' },
    { path: '/admin/orders', icon: <FiShoppingCart className="w-5 h-5" />, label: 'Orders' },
    { path: '/admin/users', icon: <FiUsers className="w-5 h-5" />, label: 'Users' },
  ];

  return (
    <div className="flex h-screen bg-gray-100">
      {/* Mobile sidebar backdrop */}
      {mobileMenuOpen && (
        <div 
          className="fixed inset-0 z-20 bg-black bg-opacity-50 lg:hidden"
          onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside 
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } ${
          mobileMenuOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        } fixed inset-y-0 left-0 z-30 bg-primary-800 text-white transition-all duration-300 ease-in-out lg:relative`}
      >
        {/* Sidebar header */}
        <div className="flex items-center justify-between h-16 px-4 border-b border-primary-700">
          <div className={`${sidebarOpen ? 'block' : 'hidden'} font-bold text-xl`}>
            Admin Panel
          </div>
          <button 
            onClick={toggleSidebar}
            className="p-2 rounded-md hover:bg-primary-700 focus:outline-none hidden lg:block"
          >
            {sidebarOpen ? <FiMenu className="w-5 h-5" /> : <FiMenu className="w-5 h-5" />}
          </button>
          <button 
            onClick={() => setMobileMenuOpen(false)}
            className="p-2 rounded-md hover:bg-primary-700 focus:outline-none lg:hidden"
          >
            <FiX className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="px-2 py-4">
          <ul className="space-y-1">
            {navItems.map((item) => (
              <li key={item.path}>
                <Link
                  to={item.path}
                  className={`flex items-center px-4 py-3 rounded-md transition-colors ${
                    location.pathname === item.path || 
                    (item.path !== '/admin' && location.pathname.startsWith(item.path))
                      ? 'bg-primary-700 text-white'
                      : 'text-primary-100 hover:bg-primary-700'
                  }`}
                >
                  <span className="mr-3">{item.icon}</span>
                  {sidebarOpen && <span>{item.label}</span>}
                </Link>
              </li>
            ))}
          </ul>

          <div className="mt-8 pt-4 border-t border-primary-700">
            <Link
              to="/"
              className="flex items-center px-4 py-3 rounded-md text-primary-100 hover:bg-primary-700 transition-colors"
            >
              <span className="mr-3">
                <FiLogOut className="w-5 h-5" />
              </span>
              {sidebarOpen && <span>Back to Site</span>}
            </Link>
          </div>
        </nav>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top navigation */}
        <header className="bg-white shadow-sm z-10">
          <div className="flex items-center justify-between h-16 px-6">
            {/* Left side - Mobile menu button */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(true)}
                className="p-2 rounded-md text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none lg:hidden"
              >
                <FiMenu className="w-6 h-6" />
              </button>
              <h1 className="ml-4 text-xl font-semibold text-gray-800 hidden sm:block">
                {location.pathname === '/admin' && 'Dashboard'}
                {location.pathname === '/admin/products' && 'Products Management'}
                {location.pathname === '/admin/categories' && 'Categories Management'}
                {location.pathname === '/admin/orders' && 'Orders Management'}
                {location.pathname === '/admin/users' && 'Users Management'}
              </h1>
            </div>

            {/* Right side - User menu & notifications */}
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="p-2 rounded-full text-gray-500 hover:text-gray-600 hover:bg-gray-100 focus:outline-none"
                >
                  <FiBell className="w-5 h-5" />
                </button>
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <h3 className="text-sm font-semibold text-gray-700">Notifications</h3>
                    </div>
                    <div className="max-h-60 overflow-y-auto">
                      <div className="px-4 py-3 hover:bg-gray-50">
                        <p className="text-sm text-gray-700">No new notifications</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* User menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center text-gray-500 hover:text-gray-600 focus:outline-none"
                >
                  <span className="mr-2 text-sm font-medium hidden md:block">
                    {user?.username || user?.email || 'Admin'}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-primary-600 flex items-center justify-center text-white">
                    <FiUser className="w-4 h-4" />
                  </div>
                </button>
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-700">{user?.email}</p>
                      <p className="text-xs text-gray-500">Administrator</p>
                    </div>
                    <Link
                      to="/account"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Your Profile
                    </Link>
                    <Link
                      to="/admin/settings"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                      onClick={() => setUserMenuOpen(false)}
                    >
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                    >
                      Sign out
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-auto bg-gray-100 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
