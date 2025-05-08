import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiMenu, FiX, FiSearch, FiChevronDown } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [scrolled, setScrolled] = useState(false);
  const [showCurrencyDropdown, setShowCurrencyDropdown] = useState(false);
  const [showLanguageDropdown, setShowLanguageDropdown] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [language, setLanguage] = useState('English');
  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const navigate = useNavigate();

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={`sticky top-0 left-0 right-0 z-50 bg-white shadow-md transition-all duration-300 ${scrolled ? 'shadow-lg' : 'shadow-md'}`}>
      {/* Top Bar */}
      <div className="border-b border-gray-200">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-2 text-sm">
            {/* Left Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/blog" className="text-gray-600 hover:text-gray-900 transition-colors">
                Blog
              </Link>
              <Link to="/featured-products" className="text-gray-600 hover:text-gray-900 transition-colors">
                Featured Products
              </Link>
              <Link to="/wishlist" className="text-gray-600 hover:text-gray-900 transition-colors">
                Wishlist
              </Link>
            </div>

            {/* Right Links */}
            <div className="flex items-center space-x-6">
              {isAuthenticated ? (
                <>
                  <div className="relative group hidden md:block">
                    <button className="flex items-center text-gray-600 hover:text-gray-900 transition-colors">
                      <span>{user?.name || 'My Account'}</span>
                      <FiChevronDown className="ml-1 w-4 h-4" />
                    </button>
                    <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                      <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        Account Settings
                      </Link>
                      <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                        My Orders
                      </Link>
                      {user?.role === 'admin' && (
                        <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Admin Dashboard
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <Link to="/login" className="text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
                    Login
                  </Link>
                  <Link to="/register" className="text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
                    Sign Up
                  </Link>
                </>
              )}
              <Link to="/order-tracking" className="text-gray-600 hover:text-gray-900 transition-colors hidden md:block">
                Order Tracking
              </Link>

              {/* Currency Selector */}
              <div className="relative">
                <button
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setShowCurrencyDropdown(!showCurrencyDropdown)}
                >
                  <span>{currency}</span>
                  <FiChevronDown className="ml-1 w-4 h-4" />
                </button>

                {showCurrencyDropdown && (
                  <div className="absolute right-0 mt-2 w-24 bg-white shadow-lg rounded-md overflow-hidden z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setCurrency('USD');
                        setShowCurrencyDropdown(false);
                      }}
                    >
                      USD
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setCurrency('EUR');
                        setShowCurrencyDropdown(false);
                      }}
                    >
                      EUR
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setCurrency('GBP');
                        setShowCurrencyDropdown(false);
                      }}
                    >
                      GBP
                    </button>
                  </div>
                )}
              </div>

              {/* Language Selector */}
              <div className="relative">
                <button
                  className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
                  onClick={() => setShowLanguageDropdown(!showLanguageDropdown)}
                >
                  <span>{language}</span>
                  <FiChevronDown className="ml-1 w-4 h-4" />
                </button>

                {showLanguageDropdown && (
                  <div className="absolute right-0 mt-2 w-32 bg-white shadow-lg rounded-md overflow-hidden z-10">
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setLanguage('English');
                        setShowLanguageDropdown(false);
                      }}
                    >
                      English
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setLanguage('Español');
                        setShowLanguageDropdown(false);
                      }}
                    >
                      Español
                    </button>
                    <button
                      className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      onClick={() => {
                        setLanguage('Français');
                        setShowLanguageDropdown(false);
                      }}
                    >
                      Français
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link to="/" className="flex items-center">
            <div className="flex items-center">
              <div className="w-8 h-8 bg-indigo-600 rounded-full flex items-center justify-center mr-2">
                <FiShoppingCart className="text-white w-4 h-4" />
              </div>
              <span className="text-xl font-bold text-gray-900">store</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-800 hover:text-indigo-600 transition-colors font-medium">
              Home
            </Link>
            <Link to="/products" className="text-gray-800 hover:text-indigo-600 transition-colors font-medium">
              Shop
            </Link>
            <Link to="/blog" className="text-gray-800 hover:text-indigo-600 transition-colors font-medium">
              Blog
            </Link>
            <Link to="/featured-products" className="text-gray-800 hover:text-indigo-600 transition-colors font-medium">
              Featured
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-800 hover:text-indigo-600 transition-colors font-medium">
                <span>Electronics</span>
                <FiChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link to="/products?category=smartphones" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Smartphones
                </Link>
                <Link to="/products?category=laptops" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Laptops
                </Link>
                <Link to="/products?category=audio-devices" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Audio Devices
                </Link>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-800 hover:text-indigo-600 transition-colors font-medium">
                <span>Clothing</span>
                <FiChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link to="/products?category=mens-clothing" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Men's Clothing
                </Link>
                <Link to="/products?category=womens-clothing" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Women's Clothing
                </Link>
                <Link to="/products?category=accessories" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Accessories
                </Link>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-800 hover:text-indigo-600 transition-colors font-medium">
                <span>Home & Kitchen</span>
                <FiChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link to="/products?category=furniture" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Furniture
                </Link>
                <Link to="/products?category=kitchen-appliances" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Kitchen Appliances
                </Link>
                <Link to="/products?category=home-decor" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Home Decor
                </Link>
              </div>
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-800 hover:text-indigo-600 transition-colors font-medium">
                <span>Books</span>
                <FiChevronDown className="ml-1 w-4 h-4" />
              </button>
              <div className="absolute left-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <Link to="/products?category=fiction" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Fiction
                </Link>
                <Link to="/products?category=non-fiction" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Non-Fiction
                </Link>
                <Link to="/products?category=childrens-books" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                  Children's Books
                </Link>
              </div>
            </div>
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-6">
            {/* Wishlist */}
            <Link to="/wishlist" className="text-gray-800 hover:text-indigo-600 transition-colors relative">
              <FiHeart className="w-6 h-6" />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Cart */}
            <div className="relative group">
              <Link to="/cart" className="flex items-center text-gray-800 hover:text-indigo-600 transition-colors">
                <div className="relative">
                  <FiShoppingCart className="w-6 h-6" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {itemCount}
                    </span>
                  )}
                </div>
                <div className="ml-2 hidden md:block">
                  <span className="text-sm font-medium">$0.00</span>
                </div>
              </Link>
              <div className="absolute right-0 mt-2 w-72 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                <div className="p-4">
                  {itemCount > 0 ? (
                    <>
                      <p className="text-sm text-gray-500 mb-4">You have {itemCount} item(s) in your cart</p>
                      <Link
                        to="/cart"
                        className="block w-full py-2 px-4 bg-indigo-600 text-white text-center rounded-md hover:bg-indigo-700 transition-colors"
                      >
                        View Cart
                      </Link>
                    </>
                  ) : (
                    <p className="text-sm text-gray-500">Your cart is empty</p>
                  )}
                </div>
              </div>
            </div>

            {/* User Account (Desktop) */}
            {isAuthenticated ? (
              <div className="relative group hidden md:block">
                <button className="flex items-center text-gray-800 hover:text-indigo-600 transition-colors">
                  <FiUser className="w-6 h-6" />
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-white shadow-lg rounded-md overflow-hidden z-10 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300">
                  <div className="p-3 border-b border-gray-200">
                    <p className="font-medium text-gray-800">{user?.name || 'User'}</p>
                    <p className="text-sm text-gray-500 truncate">{user?.email || ''}</p>
                  </div>
                  <Link to="/account" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    Account Settings
                  </Link>
                  <Link to="/orders" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Orders
                  </Link>
                  <Link to="/wishlist" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                    My Wishlist
                  </Link>
                  {user?.role === 'admin' && (
                    <Link to="/admin" className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                      Admin Dashboard
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                  >
                    Logout
                  </button>
                </div>
              </div>
            ) : (
              <Link to="/login" className="hidden md:flex items-center text-gray-800 hover:text-indigo-600 transition-colors">
                <FiUser className="w-6 h-6" />
              </Link>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(true)}
              className="md:hidden text-gray-800 hover:text-indigo-600 transition-colors"
              aria-label="Open Menu"
            >
              <FiMenu className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50">
          <div className="fixed inset-y-0 right-0 max-w-xs w-full bg-white shadow-xl z-50 overflow-y-auto">
            <div className="p-4 flex justify-between items-center border-b border-gray-200">
              <h2 className="text-lg font-semibold text-gray-900">Menu</h2>
              <button
                onClick={() => setIsMenuOpen(false)}
                className="text-gray-800 hover:text-indigo-600 transition-colors"
                aria-label="Close Menu"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <nav className="p-4">
              <ul className="space-y-4">
                {/* Top Links for Mobile */}
                <li className="border-b border-gray-200 pb-4">
                  <p className="font-medium text-gray-900 mb-3">Quick Links</p>
                  <ul className="space-y-2">
                    <li>
                      <Link
                        to="/blog"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Blog
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/featured-products"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Featured Products
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/wishlist"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Wishlist
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/order-tracking"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Order Tracking
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Main Navigation for Mobile */}
                <li>
                  <Link
                    to="/"
                    className="block text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <Link
                    to="/products"
                    className="block text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Shop
                  </Link>
                </li>
                <li className="border-b border-gray-200 pb-4">
                  <p className="block text-gray-800 font-medium mb-2">Electronics</p>
                  <ul className="pl-4 space-y-2">
                    <li>
                      <Link
                        to="/products?category=smartphones"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Smartphones
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?category=laptops"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Laptops
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?category=audio-devices"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Audio Devices
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="border-b border-gray-200 pb-4">
                  <p className="block text-gray-800 font-medium mb-2">Clothing</p>
                  <ul className="pl-4 space-y-2">
                    <li>
                      <Link
                        to="/products?category=mens-clothing"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Men's Clothing
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?category=womens-clothing"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Women's Clothing
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?category=accessories"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Accessories
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="border-b border-gray-200 pb-4">
                  <p className="block text-gray-800 font-medium mb-2">Home & Kitchen</p>
                  <ul className="pl-4 space-y-2">
                    <li>
                      <Link
                        to="/products?category=furniture"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Furniture
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?category=kitchen-appliances"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Kitchen Appliances
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?category=home-decor"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Home Decor
                      </Link>
                    </li>
                  </ul>
                </li>
                <li className="border-b border-gray-200 pb-4">
                  <p className="block text-gray-800 font-medium mb-2">Books</p>
                  <ul className="pl-4 space-y-2">
                    <li>
                      <Link
                        to="/products?category=fiction"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Fiction
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?category=non-fiction"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Non-Fiction
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/products?category=childrens-books"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Children's Books
                      </Link>
                    </li>
                  </ul>
                </li>

                {/* Account Links for Mobile */}
                {isAuthenticated ? (
                  <>
                    <li className="border-t border-gray-200 pt-4">
                      <Link
                        to="/account"
                        className="block text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Account
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/orders"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        My Orders
                      </Link>
                    </li>
                    {user?.role === 'admin' && (
                      <li>
                        <Link
                          to="/admin"
                          className="block text-gray-700 hover:text-indigo-600 transition-colors"
                          onClick={() => setIsMenuOpen(false)}
                        >
                          Admin Dashboard
                        </Link>
                      </li>
                    )}
                    <li>
                      <button
                        onClick={() => {
                          handleLogout();
                          setIsMenuOpen(false);
                        }}
                        className="block w-full text-left text-gray-700 hover:text-indigo-600 transition-colors"
                      >
                        Logout
                      </button>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="border-t border-gray-200 pt-4">
                      <Link
                        to="/login"
                        className="block text-gray-800 font-medium hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        to="/register"
                        className="block text-gray-700 hover:text-indigo-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        Sign Up
                      </Link>
                    </li>
                  </>
                )}

                {/* Language and Currency for Mobile */}
                <li className="border-t border-gray-200 pt-4">
                  <p className="font-medium text-gray-900 mb-3">Preferences</p>
                  <div className="flex flex-col space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Currency:</span>
                      <select
                        value={currency}
                        onChange={(e) => setCurrency(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="USD">USD</option>
                        <option value="EUR">EUR</option>
                        <option value="GBP">GBP</option>
                      </select>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-700">Language:</span>
                      <select
                        value={language}
                        onChange={(e) => setLanguage(e.target.value)}
                        className="border border-gray-300 rounded px-2 py-1 text-sm"
                      >
                        <option value="English">English</option>
                        <option value="Español">Español</option>
                        <option value="Français">Français</option>
                      </select>
                    </div>
                  </div>
                </li>
              </ul>
            </nav>
          </div>
        </div>
      )}

      {/* Search Overlay */}
      {isSearchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl mx-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Search Products</h2>
              <button
                onClick={() => setIsSearchOpen(false)}
                className="text-gray-800 hover:text-indigo-600 transition-colors"
                aria-label="Close Search"
              >
                <FiX className="w-6 h-6" />
              </button>
            </div>
            <form onSubmit={handleSearchSubmit}>
              <div className="relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for products..."
                  className="w-full px-5 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  autoFocus
                />
                <button
                  type="submit"
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-indigo-600"
                  aria-label="Search"
                >
                  <FiSearch className="w-5 h-5" />
                </button>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                <p>Popular searches: Smartphones, Laptops, Men's Clothing, Home Decor</p>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
