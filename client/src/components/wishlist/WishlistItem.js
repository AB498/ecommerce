import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiTrash2, FiEye } from 'react-icons/fi';
import { useWishlist } from '../../context/WishlistContext';
import { useCart } from '../../context/CartContext';

const WishlistItem = ({ product }) => {
  const { removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();

  const handleRemove = async () => {
    try {
      await removeFromWishlist(product._id);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await addToCart(product._id, 1);
      // Optionally remove from wishlist after adding to cart
      // await removeFromWishlist(product._id);
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  // Format price with discount
  const formatPrice = () => {
    if (product.onSale && product.price.compareAtPrice) {
      return (
        <div className="flex items-center">
          <span className="text-lg font-medium text-accent-600">${product.price.amount.toFixed(2)}</span>
          <span className="ml-2 text-sm line-through text-secondary-400">${product.price.compareAtPrice.toFixed(2)}</span>
        </div>
      );
    }
    return <span className="text-lg font-medium text-secondary-900">${product.price.amount.toFixed(2)}</span>;
  };

  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-secondary-200">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
        <Link to={`/products/${product.slug}`}>
          <img
            src={product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'}
            alt={product.name}
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-grow sm:ml-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <Link to={`/products/${product.slug}`} className="text-lg font-medium text-secondary-900 hover:text-primary-600">
              {product.name}
            </Link>
            {product.brand && (
              <div className="text-sm text-secondary-500 mt-1">
                {product.brand}
              </div>
            )}
          </div>

          <div className="mt-2 sm:mt-0 text-right">
            {formatPrice()}
            <div className="flex items-center mt-1">
              <div className="rating-stars">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className={i < Math.floor(product.rating?.average || 0) ? 'text-accent-500' : 'text-secondary-300'}>
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-secondary-500 ml-1">
                ({product.rating?.count || 0})
              </span>
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
          {/* Stock Status */}
          <div className="text-sm">
            {product.stockQuantity > 0 ? (
              <span className="text-green-600">In Stock</span>
            ) : (
              <span className="text-red-600">Out of Stock</span>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex space-x-2 mt-2 sm:mt-0">
            <button
              onClick={handleAddToCart}
              disabled={product.stockQuantity <= 0}
              className="flex items-center justify-center px-3 py-1.5 bg-primary-600 text-white rounded-md text-sm font-medium hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FiShoppingCart className="w-4 h-4 mr-1" />
              Add to Cart
            </button>

            <Link
              to={`/products/${product.slug}`}
              className="flex items-center justify-center px-3 py-1.5 bg-secondary-100 text-secondary-700 rounded-md text-sm font-medium hover:bg-secondary-200"
            >
              <FiEye className="w-4 h-4 mr-1" />
              View
            </Link>

            <button
              onClick={handleRemove}
              className="flex items-center justify-center px-3 py-1.5 bg-red-50 text-red-600 rounded-md text-sm font-medium hover:bg-red-100"
            >
              <FiTrash2 className="w-4 h-4 mr-1" />
              Remove
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WishlistItem;
