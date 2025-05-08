import React, { useEffect } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { FiHeart, FiArrowLeft, FiShoppingCart } from 'react-icons/fi';
import WishlistItem from '../components/wishlist/WishlistItem';
import ProductList from '../components/products/ProductList';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';

const WishlistPage = () => {
  const { isAuthenticated, loading: authLoading } = useAuth();
  const { wishlist, loading: wishlistLoading, error: wishlistError, moveAllToCart } = useWishlist();

  // Update page title
  useEffect(() => {
    document.title = 'Wishlist | E-Commerce';

    return () => {
      document.title = 'E-Commerce';
    };
  }, []);

  // If not authenticated, redirect to login
  if (!authLoading && !isAuthenticated) {
    return <Navigate to="/login" state={{ from: '/wishlist' }} replace />;
  }

  const handleMoveAllToCart = async () => {
    try {
      const result = await moveAllToCart();
      if (!result.success && result.error) {
        console.error(result.error);
      }
    } catch (error) {
      console.error('Error moving all items to cart:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-secondary-900 mb-8">My Wishlist</h1>

      {authLoading || wishlistLoading ? (
        <div className="flex justify-center items-center py-12">
          <div className="w-12 h-12 border-t-4 border-primary-600 border-solid rounded-full animate-spin"></div>
        </div>
      ) : wishlistError ? (
        <div className="bg-red-50 text-red-700 p-6 rounded-md my-8">
          <h2 className="text-xl font-semibold mb-2">Error</h2>
          <p>{wishlistError}</p>
        </div>
      ) : !wishlist.products || wishlist.products.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-8 text-center">
          <div className="flex justify-center mb-4">
            <FiHeart className="w-16 h-16 text-secondary-400" />
          </div>
          <h2 className="text-2xl font-semibold text-secondary-900 mb-2">Your wishlist is empty</h2>
          <p className="text-secondary-600 mb-6">
            Save items you love to your wishlist and they'll be waiting for you here.
          </p>
          <Link
            to="/products"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-md font-medium hover:bg-primary-700 transition-colors"
          >
            <FiArrowLeft className="mr-2" /> Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-6 border-b border-secondary-200 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-secondary-900">
              Saved Items ({wishlist.products.length})
            </h2>

            <button
              onClick={handleMoveAllToCart}
              className="flex items-center text-primary-600 hover:text-primary-800"
            >
              <FiShoppingCart className="mr-2" />
              Add All to Cart
            </button>
          </div>

          <div className="p-6">
            {wishlist.products.map((product) => (
              <WishlistItem key={product._id} product={product} />
            ))}
          </div>

          <div className="p-6 bg-secondary-50 border-t border-secondary-200">
            <Link
              to="/products"
              className="inline-flex items-center text-primary-600 hover:text-primary-800"
            >
              <FiArrowLeft className="mr-2" /> Continue Shopping
            </Link>
          </div>
        </div>
      )}

      {/* Recently Viewed Products */}
      {!wishlistLoading && wishlist.recentlyViewed && wishlist.recentlyViewed.length > 0 && (
        <div className="mt-16">
          <h2 className="text-2xl font-bold text-secondary-900 mb-6">Recently Viewed</h2>
          <ProductList
            products={wishlist.recentlyViewed}
            loading={false}
            error={null}
          />
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
