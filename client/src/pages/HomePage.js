import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiArrowRight,
  FiChevronRight,
  FiUser,
  FiMonitor,
  FiShoppingBag,
  FiHome,
  FiSmartphone,
  FiServer,
  FiHeadphones,
  FiBox,
  FiImage,
  FiBook
} from 'react-icons/fi';
import api from '../services/api';
import TrendingProducts from '../components/products/TrendingProducts';

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeSlide, setActiveSlide] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories
        const categoriesResponse = await api.get('/categories?active=true');
        setCategories(categoriesResponse.data.categories);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  // Function to handle slide change
  const changeSlide = (index) => {
    setActiveSlide(index);
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-gray-100 py-6">
        <div className="container mx-auto px-4">
          {/* Search Bar */}
          <div className="mb-6 flex">
            <div className="w-full max-w-5xl mx-auto flex">
              <form onSubmit={handleSearch} className="flex w-full">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Search for products"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-indigo-500"
                  />
                </div>
                <button
                  type="submit"
                  className="bg-red-500 text-white px-4 py-2 rounded-r-md hover:bg-red-600 transition-colors"
                >
                  Search
                </button>
              </form>
            </div>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-stretch">
            {/* Categories Sidebar */}
            <div className="lg:w-1/4 mb-6 lg:mb-0 lg:pr-6 flex">
              <div className="bg-white rounded-md shadow-sm overflow-hidden flex-1 flex flex-col">
                <div className="bg-red-500 text-white py-3 px-4 flex items-center justify-between">
                  <span className="font-medium">All Departments</span>
                  <div className="flex flex-col space-y-1">
                    <span className="w-5 h-0.5 bg-white"></span>
                    <span className="w-5 h-0.5 bg-white"></span>
                    <span className="w-5 h-0.5 bg-white"></span>
                  </div>
                </div>
                <div className="text-sm text-gray-500 px-4 py-1">
                  Total {categories.length} Products
                </div>
                <div className="flex-1 overflow-y-auto">
                  <ul className="divide-y divide-gray-200">
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=electronics" className="flex items-center py-3 px-4">
                        <FiMonitor className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Electronics</span>
                        <FiChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=smartphones" className="flex items-center py-3 px-4">
                        <FiSmartphone className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Smartphones</span>
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=laptops" className="flex items-center py-3 px-4">
                        <FiServer className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Laptops</span>
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=audio-devices" className="flex items-center py-3 px-4">
                        <FiHeadphones className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Audio Devices</span>
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=clothing" className="flex items-center py-3 px-4">
                        <FiShoppingBag className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Clothing</span>
                        <FiChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=mens-clothing" className="flex items-center py-3 px-4">
                        <FiUser className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Men's Clothing</span>
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=womens-clothing" className="flex items-center py-3 px-4">
                        <FiUser className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Women's Clothing</span>
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=home-kitchen" className="flex items-center py-3 px-4">
                        <FiHome className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Home & Kitchen</span>
                        <FiChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=furniture" className="flex items-center py-3 px-4">
                        <FiBox className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Furniture</span>
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=home-decor" className="flex items-center py-3 px-4">
                        <FiImage className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Home Decor</span>
                      </Link>
                    </li>
                    <li className="hover:bg-gray-50">
                      <Link to="/products?category=books" className="flex items-center py-3 px-4">
                        <FiBook className="w-5 h-5 mr-3 text-gray-600" />
                        <span>Books</span>
                        <FiChevronRight className="w-4 h-4 ml-auto text-gray-400" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Main Banner */}
            <div className="lg:w-3/4 flex">
              <div className="relative bg-gray-200 rounded-md overflow-hidden w-full">
                <div className="absolute inset-0">
                  <img
                    src="https://images.unsplash.com/photo-1491553895911-0055eca6402d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1200&q=80"
                    alt="White Adidas Shoes"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-16">
                  <div className="bg-gray-900 text-white inline-block px-3 py-1 rounded-md text-sm mb-4 self-start">
                    Shoes Fashion
                  </div>
                  <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-2">
                    Come and Get it!
                  </h1>
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">
                    BRAND NEW SHOES
                  </h2>
                  <Link
                    to="/products?category=accessories"
                    className="bg-red-500 text-white px-6 py-3 rounded-md font-medium hover:bg-red-600 transition-colors self-start inline-flex items-center"
                  >
                    Shop Now
                  </Link>
                </div>

                {/* Slider Dots */}
                <div className="absolute bottom-4 left-0 right-0 flex justify-center space-x-2">
                  {[0, 1, 2, 3].map((index) => (
                    <button
                      key={index}
                      onClick={() => changeSlide(index)}
                      className={`w-2 h-2 rounded-full ${
                        activeSlide === index ? 'bg-red-500' : 'bg-gray-400'
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Brand Logos */}
          <div className="mt-8 py-6 border-t border-gray-200">
            <div className="flex flex-wrap justify-between items-center">
              <div className="w-1/3 md:w-1/6 px-4 mb-4 md:mb-0">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/f/fd/Zara_Logo.svg/1200px-Zara_Logo.svg.png" alt="Zara" className="h-6 md:h-8 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-1/3 md:w-1/6 px-4 mb-4 md:mb-0">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/24/Samsung_Logo.svg/2560px-Samsung_Logo.svg.png" alt="Samsung" className="h-6 md:h-8 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-1/3 md:w-1/6 px-4 mb-4 md:mb-0">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/ae/Xiaomi_logo_%282021-%29.svg/2048px-Xiaomi_logo_%282021-%29.svg.png" alt="Xiaomi" className="h-6 md:h-8 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-1/3 md:w-1/6 px-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/2e/ASUS_Logo.svg/2560px-ASUS_Logo.svg.png" alt="Asus" className="h-6 md:h-8 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-1/3 md:w-1/6 px-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a6/Logo_NIKE.svg/1200px-Logo_NIKE.svg.png" alt="Nike" className="h-6 md:h-8 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity" />
              </div>
              <div className="w-1/3 md:w-1/6 px-4">
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/2/20/Adidas_Logo.svg/2560px-Adidas_Logo.svg.png" alt="Adidas" className="h-6 md:h-8 w-auto mx-auto opacity-60 hover:opacity-100 transition-opacity" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trending Products Section */}
      <TrendingProducts />

      {/* Categories Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center mb-12">
            <div className="flex items-center">
              <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
              <h2 className="text-2xl font-bold text-gray-800">Shop by Category</h2>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center">
              <div className="w-12 h-12 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {categories.slice(0, 8).map((category) => (
                <Link
                  key={category._id}
                  to={`/products?category=${category.slug}`}
                  className="group"
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-sm border border-gray-100 transition-all group-hover:shadow-md group-hover:-translate-y-1">
                    <div className="h-48 overflow-hidden relative">
                      {category.image ? (
                        <img
                          src={category.image.url}
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-100">
                          <div className="text-4xl text-gray-400">
                            {category.icon || '📦'}
                          </div>
                        </div>
                      )}
                      <div className="absolute inset-0 bg-black bg-opacity-20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="px-4 py-2 bg-white bg-opacity-90 rounded-md text-sm font-medium text-gray-800">
                          Explore Now
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="text-lg font-medium text-center text-gray-800">{category.name}</h3>
                      <div className="mt-2 text-center">
                        <span className="text-xs text-gray-500">
                          {Math.floor(Math.random() * 100) + 20} Products
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Promotional Banners */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center mb-10">
            <div className="relative">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-800 text-center">Special Offers</h2>
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-accent-400 to-primary-500 rounded-full"></div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Summer Sale Banner */}
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-accent-600 to-accent-400 opacity-90"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1555529669-e69e7aa0ba9a?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-overlay"></div>

              {/* Content */}
              <div className="relative p-8 flex flex-col h-full min-h-[280px] justify-between z-10">
                <div>
                  <div className="inline-block px-4 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                    Limited Time Offer
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md">Summer Sale</h3>
                  <p className="text-lg text-white text-opacity-90 mb-6 max-w-xs drop-shadow-md">
                    Up to 50% off on selected items. Don't miss out on these amazing deals!
                  </p>
                </div>

                <Link
                  to="/products?sale=true"
                  className="inline-flex items-center bg-white text-accent-600 px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors self-start"
                >
                  <span>Shop Now</span>
                  <span className="ml-2">
                    <FiArrowRight />
                  </span>
                </Link>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
              </div>
            </div>

            {/* New Arrivals Banner */}
            <div className="relative rounded-lg overflow-hidden shadow-lg">
              {/* Background Image with Overlay */}
              <div className="absolute inset-0 bg-gradient-to-r from-primary-600 to-primary-400 opacity-90"></div>
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1483985988355-763728e1935b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80')] bg-cover bg-center mix-blend-overlay"></div>

              {/* Content */}
              <div className="relative p-8 flex flex-col h-full min-h-[280px] justify-between z-10">
                <div>
                  <div className="inline-block px-4 py-1 bg-white bg-opacity-20 backdrop-blur-sm rounded-full text-white text-sm font-medium mb-4">
                    Just Arrived
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-3 drop-shadow-md">New Arrivals</h3>
                  <p className="text-lg text-white text-opacity-90 mb-6 max-w-xs drop-shadow-md">
                    Discover our latest collection of trendy products fresh off the shelves.
                  </p>
                </div>

                <Link
                  to="/products?sort=-createdAt"
                  className="inline-flex items-center bg-white text-primary-600 px-6 py-3 rounded-md font-medium hover:bg-opacity-90 transition-colors self-start"
                >
                  <span>Explore Collection</span>
                  <span className="ml-2">
                    <FiArrowRight />
                  </span>
                </Link>

                {/* Decorative Elements */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-white bg-opacity-10 rounded-full -mr-16 -mt-16"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 bg-secondary-900 text-white">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-4">Subscribe to Our Newsletter</h2>
            <p className="text-secondary-300 mb-8">
              Stay updated with our latest products and exclusive offers.
            </p>
            <form className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="Your email address"
                className="flex-grow px-4 py-3 rounded-md text-secondary-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                type="submit"
                className="bg-primary-600 hover:bg-primary-700 px-6 py-3 rounded-md font-medium transition-colors"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
