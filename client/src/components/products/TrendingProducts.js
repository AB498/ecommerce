import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiArrowRight, FiHeart } from 'react-icons/fi';
import ProductCard from './ProductCard';
import CountdownTimer from './CountdownTimer';
import api from '../../services/api';
import { useWishlist } from '../../context/WishlistContext';

// Mock data for products in case API returns insufficient data
const mockProducts = [
  {
    _id: 'mock1',
    slug: 'black-womens-coat-dress',
    name: "Black Women's Coat Dress",
    images: [
      { url: 'https://images.unsplash.com/photo-1539533018447-63fcce2678e3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80' }
    ],
    price: {
      amount: 129.99,
      compareAtPrice: 189.98,
      currency: 'USD'
    },
    rating: {
      average: 4.8,
      count: 2548
    },
    stockQuantity: 25,
    soldCount: 2975,
    freeShipping: true
  },
  {
    _id: 'mock2',
    slug: 'men-slip-on-shoes',
    name: "Men Slip On Shoes Casual Sneakers",
    images: [
      { url: 'https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=698&q=80' }
    ],
    price: {
      amount: 129.99,
      compareAtPrice: 189.98,
      currency: 'USD'
    },
    rating: {
      average: 4.7,
      count: 2548
    },
    stockQuantity: 18,
    soldCount: 2975,
    freeShipping: true
  },
  {
    _id: 'mock3',
    slug: 'under-armour-mens-tech',
    name: "Under Armour Men's Tech 2.0 Short Sleeve T-Shirt",
    images: [
      { url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=764&q=80' }
    ],
    price: {
      amount: 56.50,
      compareAtPrice: 75.80,
      currency: 'USD'
    },
    rating: {
      average: 4.6,
      count: 1965
    },
    stockQuantity: 42,
    soldCount: 2584,
    freeShipping: true
  },
  {
    _id: 'mock4',
    slug: 'womens-lightweight-knit',
    name: "Women's Lightweight Knit Summer Dress",
    images: [
      { url: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=688&q=80' }
    ],
    price: {
      amount: 37.50,
      compareAtPrice: 64.50,
      currency: 'USD'
    },
    rating: {
      average: 4.5,
      count: 994
    },
    stockQuantity: 15,
    soldCount: 1257,
    freeShipping: true
  },
  {
    _id: 'mock5',
    slug: 'dimmable-ceiling-light',
    name: "Dimmable Ceiling Light Modern Pendant Lamp",
    images: [
      { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80' }
    ],
    price: {
      amount: 279.99,
      compareAtPrice: 449.99,
      currency: 'USD'
    },
    rating: {
      average: 4.7,
      count: 843
    },
    stockQuantity: 8,
    soldCount: 998,
    freeShipping: true
  },
  {
    _id: 'mock6',
    slug: 'vonanda-velvet-sofa',
    name: "Vonanda Velvet Sofa Couch, Mid Century Modern Couch",
    images: [
      { url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }
    ],
    price: {
      amount: 469.99,
      compareAtPrice: 736.99,
      currency: 'USD'
    },
    rating: {
      average: 4.8,
      count: 1597
    },
    stockQuantity: 5,
    soldCount: 2151,
    freeShipping: true
  },
  {
    _id: 'mock7',
    slug: 'wireless-headphones',
    name: "Wireless Headphones Over Ear with Microphone",
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1470&q=80' }
    ],
    price: {
      amount: 99.98,
      compareAtPrice: 135.98,
      currency: 'USD'
    },
    rating: {
      average: 4.6,
      count: 1411
    },
    stockQuantity: 22,
    soldCount: 3245,
    freeShipping: true
  },
  {
    _id: 'mock8',
    slug: 'modern-storage-cabinet',
    name: "Modern Storage Cabinet with Doors and Shelves",
    images: [
      { url: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80' }
    ],
    price: {
      amount: 129.99,
      compareAtPrice: 169.99,
      currency: 'USD'
    },
    rating: {
      average: 4.4,
      count: 335
    },
    stockQuantity: 12,
    soldCount: 768,
    freeShipping: true
  }
];

const TrendingProducts = () => {
  const [trendingProducts, setTrendingProducts] = useState([]);
  const [specialOffer, setSpecialOffer] = useState(null);
  const [loading, setLoading] = useState(true);
  const { addToWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        // Fetch trending products
        const response = await api.get('/products?sort=-soldCount&limit=8');

        // If we have enough products from the API, use them
        if (response.data.products && response.data.products.length >= 5) {
          setTrendingProducts(response.data.products);

          // Get the first product as special offer
          if (response.data.products.length > 0) {
            setSpecialOffer(response.data.products[0]);
          }
        } else {
          // Use mock data if API doesn't return enough products
          console.log('Using mock data for trending products');
          setTrendingProducts(mockProducts);
          setSpecialOffer(mockProducts[0]);
        }
      } catch (error) {
        console.error('Error fetching trending products:', error);
        // Fallback to mock data on error
        setTrendingProducts(mockProducts);
        setSpecialOffer(mockProducts[0]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  // Calculate future date for countdown (24 hours from now)
  const getOfferEndTime = () => {
    const endTime = new Date();
    endTime.setDate(endTime.getDate() + 1); // 24 hours from now
    return endTime;
  };

  const handleAddToWishlist = (productId) => {
    addToWishlist(productId);
  };

  // Format number with commas
  const formatNumber = (num) => {
    return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  };

  if (loading) {
    return (
      <div className="py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center">
            <div className="w-12 h-12 border-t-4 border-indigo-600 border-solid rounded-full animate-spin"></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <section className="py-10">
      <div className="container mx-auto px-4">
        {/* Section Title */}
        <div className="flex items-center mb-8">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-indigo-500 mr-2"></div>
            <h2 className="text-2xl font-bold text-gray-800">Trending Products</h2>
          </div>
          <Link
            to="/products?sort=-soldCount"
            className="ml-auto text-indigo-600 hover:text-indigo-700 flex items-center text-sm font-medium"
          >
            View All <FiArrowRight className="ml-1" />
          </Link>
        </div>

        {/* Products Grid with Special Offer in its own column */}
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          {/* Special Offer Card - Not full height */}
          {specialOffer && (
            <div className="lg:w-1/4">
              <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 flex flex-col">
                <div className="p-4 bg-gradient-to-r from-indigo-50 to-purple-50">
                  <div className="text-center mb-2">
                    <span className="inline-block bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full mb-2">SPECIAL OFFER</span>
                  </div>
                  <CountdownTimer
                    endTime={getOfferEndTime()}
                    onComplete={() => console.log('Offer ended')}
                  />
                </div>

                <div className="relative flex-grow">
                  <Link to={`/products/${specialOffer.slug}`}>
                    <div className="h-56 overflow-hidden">
                      <img
                        src={specialOffer.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'}
                        alt={specialOffer.name}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>

                    {/* Discount Badge */}
                    {specialOffer.price.compareAtPrice > 0 && (
                      <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        {Math.round(((specialOffer.price.compareAtPrice - specialOffer.price.amount) / specialOffer.price.compareAtPrice) * 100)}% OFF
                      </div>
                    )}
                  </Link>

                  {/* Wishlist Button */}
                  <button
                    onClick={() => handleAddToWishlist(specialOffer._id)}
                    className="absolute top-2 left-2 p-1.5 rounded-full bg-white bg-opacity-70 hover:bg-opacity-100 transition-colors"
                    aria-label="Add to wishlist"
                  >
                    <FiHeart className={`w-5 h-5 ${isInWishlist(specialOffer._id) ? 'text-red-500' : 'text-gray-600 hover:text-red-500'}`} />
                  </button>

                  {/* Free Shipping Badge */}
                  {specialOffer.freeShipping && (
                    <div className="absolute bottom-0 left-0 bg-green-500 text-white text-xs py-1 px-2">
                      Free Shipping
                    </div>
                  )}

                  {/* Sold Count Badge */}
                  <div className="absolute bottom-0 right-0 bg-gray-800 bg-opacity-75 text-white text-xs py-1 px-2">
                    {formatNumber(specialOffer.soldCount || 0)} sold
                  </div>
                </div>

                <div className="p-4 border-t border-gray-200">
                  <div className="flex items-center mb-2">
                    <div className="flex">
                      {[...Array(5)].map((_, i) => (
                        <span key={i} className={`text-sm ${i < Math.floor(specialOffer.rating?.average || 0) ? 'text-yellow-400' : 'text-gray-300'}`}>
                          ★
                        </span>
                      ))}
                    </div>
                    <span className="text-xs text-gray-500 ml-1">
                      ({formatNumber(specialOffer.rating?.count || 0)})
                    </span>
                  </div>

                  <Link to={`/products/${specialOffer.slug}`}>
                    <h3 className="text-sm font-medium text-gray-800 mb-2 hover:text-indigo-600 transition-colors line-clamp-2 h-10">
                      {specialOffer.name}
                    </h3>
                  </Link>

                  <div className="flex items-center mb-2">
                    <span className="text-red-500 font-semibold">${specialOffer.price.amount.toFixed(2)}</span>
                    {specialOffer.price.compareAtPrice > 0 && (
                      <span className="text-gray-500 text-sm line-through ml-2">
                        ${specialOffer.price.compareAtPrice.toFixed(2)}
                      </span>
                    )}
                  </div>

                  <div className="flex justify-between text-xs text-gray-500">
                    <div>Stock: {specialOffer.stockQuantity || 0}</div>
                    <div className="text-red-500 font-semibold">Limited Time Offer!</div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Regular Product Cards Grid */}
          <div className="lg:w-3/4 self-start">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {trendingProducts.slice(1, 7).map(product => (
                <div key={product._id} className="relative">
                  {/* Discount Badge */}
                  {product.price.compareAtPrice > 0 && (
                    <div className="absolute top-2 right-2 z-10 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                      {Math.round(((product.price.compareAtPrice - product.price.amount) / product.price.compareAtPrice) * 100)}% OFF
                    </div>
                  )}

                  {/* Free Shipping Badge */}
                  {product.freeShipping && (
                    <div className="absolute top-2 left-2 z-10 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded">
                      Free Shipping
                    </div>
                  )}

                  <ProductCard
                    product={product}
                    showSold={true}
                  />

                  {/* Sold Count Badge */}
                  <div className="absolute bottom-16 left-0 bg-gray-800 bg-opacity-75 text-white text-xs py-1 px-2">
                    {product.soldCount} sold
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TrendingProducts;
