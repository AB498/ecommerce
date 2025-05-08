import React from 'react';
import { Link } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiEye } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();
  const { addToWishlist, isInWishlist } = useWishlist();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product._id, 1);
  };

  const handleAddToWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToWishlist(product._id);
  };

  // Format price with discount
  const formatPrice = () => {
    if (product.onSale && product.price.compareAtPrice) {
      return (
        <div className="flex items-center">
          <span className="price price-sale">${product.price.amount.toFixed(2)}</span>
          <span className="price-compare ml-2">${product.price.compareAtPrice.toFixed(2)}</span>
        </div>
      );
    }
    return <span className="price">${product.price.amount.toFixed(2)}</span>;
  };

  return (
    <div className="product-card bg-white rounded-lg overflow-hidden shadow-md transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <Link
        to={`/products/${product.slug}`}
        className="block"
        onClick={(e) => {
          // Log the navigation attempt
          console.log('Navigating to product:', product.slug);
        }}
      >
        <div className="relative h-48 overflow-hidden">
          {product.onSale && (
            <div className="absolute top-2 left-2 bg-accent-500 text-white text-xs font-bold px-2 py-1 rounded-md z-10">
              SALE
            </div>
          )}
          <img
            src={product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=300&q=80'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform hover:scale-105"
          />
          <div className="absolute bottom-0 left-0 right-0 p-2 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity">
            <div className="flex justify-center space-x-2">
              <button
                onClick={handleAddToCart}
                className="p-2 rounded-full bg-white text-primary-600 hover:bg-primary-50 transition-colors"
                aria-label="Add to cart"
              >
                <FiShoppingCart className="w-4 h-4" />
              </button>
              <button
                onClick={handleAddToWishlist}
                className={`p-2 rounded-full bg-white ${
                  isInWishlist(product._id)
                    ? 'text-accent-600'
                    : 'text-secondary-400 hover:text-accent-600'
                } transition-colors`}
                aria-label="Add to wishlist"
              >
                <FiHeart className="w-4 h-4" />
              </button>
              <Link
                to={`/products/${product.slug}`}
                className="p-2 rounded-full bg-white text-secondary-600 hover:bg-secondary-50 transition-colors"
                aria-label="Quick view"
                onClick={(e) => {
                  e.stopPropagation();
                  console.log('Quick view clicked for:', product.slug);
                }}
              >
                <FiEye className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-4">
        <Link
          to={`/products/${product.slug}`}
          onClick={(e) => {
            console.log('Navigating to product from title:', product.slug);
          }}
        >
          <h3 className="text-lg font-semibold mb-1 hover:text-primary-600 transition-colors line-clamp-1">
            {product.name}
          </h3>
        </Link>
        {product.brand && (
          <p className="text-sm text-secondary-500 mb-2">{product.brand}</p>
        )}
        <div className="flex items-center mb-3">
          <div className="rating-stars">
            {[...Array(5)].map((_, i) => (
              <span key={i} className={i < Math.floor(product.rating?.average || 0) ? 'text-accent-500' : 'text-secondary-300'}>
                ★
              </span>
            ))}
          </div>
          <span className="text-sm text-secondary-500 ml-2">
            ({product.rating?.count || 0})
          </span>
        </div>
        <div className="flex items-center justify-between">
          <div>{formatPrice()}</div>
          <div className="flex space-x-2">
            <button
              onClick={handleAddToWishlist}
              className={`p-2 rounded-full ${
                isInWishlist(product._id)
                  ? 'text-accent-600 bg-accent-50'
                  : 'text-secondary-400 bg-secondary-100 hover:text-accent-600 hover:bg-accent-50'
              } transition-colors`}
              aria-label="Add to wishlist"
            >
              <FiHeart className="w-4 h-4" />
            </button>
            <button
              onClick={handleAddToCart}
              className="p-2 rounded-full text-primary-600 bg-primary-50 hover:bg-primary-100 transition-colors"
              aria-label="Add to cart"
            >
              <FiShoppingCart className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
