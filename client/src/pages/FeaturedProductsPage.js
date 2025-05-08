import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FiStar, FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import api from '../services/api';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import ErrorMessage from '../components/ui/ErrorMessage';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { toast } from 'react-toastify';

const FeaturedProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addToCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setLoading(true);
        // Fetch products with featured=true parameter
        const response = await api.get('/products?featured=true&limit=12');
        if (response.data && response.data.products) {
          setProducts(response.data.products);
        } else {
          setError('Failed to fetch featured products');
        }
      } catch (err) {
        console.error('Error fetching featured products:', err);
        setError('Failed to load featured products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  const handleAddToCart = (product) => {
    addToCart(product._id, 1);
    toast.success(`${product.name} added to cart!`);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product._id)) {
      removeFromWishlist(product._id);
      toast.info(`${product.name} removed from wishlist`);
    } else {
      addToWishlist(product._id);
      toast.success(`${product.name} added to wishlist!`);
    }
  };

  // Function to render star ratings
  const renderStarRating = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;

    for (let i = 1; i <= 5; i++) {
      if (i <= fullStars) {
        stars.push(<FiStar key={i} className="w-4 h-4 fill-current text-yellow-500" />);
      } else if (i === fullStars + 1 && hasHalfStar) {
        stars.push(<FiStar key={i} className="w-4 h-4 text-yellow-500 half-filled" />);
      } else {
        stars.push(<FiStar key={i} className="w-4 h-4 text-gray-300" />);
      }
    }

    return stars;
  };

  return (
    <div className="bg-gray-50">
      {/* Page Header */}
      <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl md:text-5xl font-bold mb-4 text-center">Featured Products</h1>
          <p className="text-xl text-center max-w-2xl mx-auto">
            Discover our handpicked selection of premium products that stand out for their quality, innovation, and value.
          </p>
        </div>
      </div>

      {/* Featured Products Content */}
      <div className="container mx-auto px-4 py-12">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <LoadingSpinner size="large" />
          </div>
        ) : error ? (
          <ErrorMessage message={error} />
        ) : (
          <>
            {/* Featured Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white rounded-lg shadow-md overflow-hidden group">
                  {/* Product Image */}
                  <div className="relative h-64 overflow-hidden">
                    <img
                      src={product.images[0]?.url || 'https://via.placeholder.com/300'}
                      alt={product.name}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />

                    {/* Quick Action Buttons */}
                    <div className="absolute inset-0 bg-black bg-opacity-20 flex items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => handleAddToCart(product)}
                        className="bg-white p-2 rounded-full text-gray-800 hover:bg-primary-500 hover:text-white transition-colors"
                        title="Add to Cart"
                      >
                        <FiShoppingCart className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() => handleWishlistToggle(product)}
                        className={`p-2 rounded-full transition-colors ${
                          isInWishlist(product._id)
                            ? 'bg-red-500 text-white'
                            : 'bg-white text-gray-800 hover:bg-red-500 hover:text-white'
                        }`}
                        title={isInWishlist(product._id) ? 'Remove from Wishlist' : 'Add to Wishlist'}
                      >
                        <FiHeart className="w-5 h-5" />
                      </button>
                      <Link
                        to={`/products/${product.slug}`}
                        className="bg-white p-2 rounded-full text-gray-800 hover:bg-primary-500 hover:text-white transition-colors"
                        title="Quick View"
                      >
                        <FiEye className="w-5 h-5" />
                      </Link>
                    </div>

                    {/* Sale Badge */}
                    {product.onSale && (
                      <div className="absolute top-2 left-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
                        SALE
                      </div>
                    )}

                    {/* Featured Badge */}
                    <div className="absolute top-2 right-2 bg-primary-500 text-white text-xs font-bold px-2 py-1 rounded">
                      FEATURED
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4">
                    <Link to={`/products/${product.slug}`}>
                      <h3 className="text-lg font-medium text-gray-800 hover:text-primary-600 transition-colors mb-1">
                        {product.name}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>

                    {/* Rating */}
                    <div className="flex items-center mb-2">
                      <div className="flex mr-1">
                        {renderStarRating(product.rating?.average || 0)}
                      </div>
                      <span className="text-xs text-gray-500">
                        ({product.rating?.count || 0} reviews)
                      </span>
                    </div>

                    {/* Price */}
                    <div className="flex items-center justify-between">
                      <div>
                        {product.onSale ? (
                          <div className="flex items-center">
                            <span className="text-lg font-bold text-primary-600 mr-2">
                              ${(product.price.compareAtPrice || product.price.amount * 0.9).toFixed(2)}
                            </span>
                            <span className="text-sm text-gray-500 line-through">
                              ${product.price.amount.toFixed(2)}
                            </span>
                          </div>
                        ) : (
                          <span className="text-lg font-bold text-primary-600">
                            ${product.price.amount.toFixed(2)}
                          </span>
                        )}
                      </div>

                      {/* Stock Status */}
                      {product.stockQuantity > 0 ? (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                          In Stock
                        </span>
                      ) : (
                        <span className="text-xs bg-red-100 text-red-800 px-2 py-1 rounded">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {products.length === 0 && (
              <div className="text-center py-10">
                <p className="text-lg text-gray-600">No featured products found.</p>
                <Link to="/products" className="mt-4 inline-block bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors">
                  Browse All Products
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default FeaturedProductsPage;
