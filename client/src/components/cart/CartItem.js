import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiTrash2, FiMinus, FiPlus } from 'react-icons/fi';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
  const { updateCartItem, removeFromCart } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleQuantityChange = (value) => {
    const newQuantity = Math.max(1, Math.min(item.product.stockQuantity, value));
    setQuantity(newQuantity);

    if (newQuantity !== item.quantity) {
      updateQuantity(newQuantity);
    }
  };

  const updateQuantity = async (newQuantity) => {
    setIsUpdating(true);
    try {
      await updateCartItem(item._id, newQuantity, item.selectedVariants);
    } catch (error) {
      console.error('Error updating cart item:', error);
      // Reset to original quantity on error
      setQuantity(item.quantity);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleRemove = async () => {
    try {
      await removeFromCart(item._id);
    } catch (error) {
      console.error('Error removing cart item:', error);
    }
  };

  // Format variant options for display
  const formatVariants = () => {
    if (!item.selectedVariants || item.selectedVariants.length === 0) {
      return null;
    }

    return (
      <div className="text-sm text-secondary-500 mt-1">
        {item.selectedVariants.map((variant, index) => (
          <span key={index}>
            {variant.name}: {variant.value}
            {index < item.selectedVariants.length - 1 ? ', ' : ''}
          </span>
        ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col sm:flex-row py-6 border-b border-secondary-200">
      {/* Product Image */}
      <div className="w-full sm:w-24 h-24 mb-4 sm:mb-0 flex-shrink-0">
        <Link to={`/products/${item.product.slug}`}>
          <img
            src={item.product.images[0]?.url || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=100&q=80'}
            alt={item.product.name}
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
      </div>

      {/* Product Details */}
      <div className="flex-grow sm:ml-6">
        <div className="flex flex-col sm:flex-row justify-between">
          <div>
            <Link to={`/products/${item.product.slug}`} className="text-lg font-medium text-secondary-900 hover:text-primary-600">
              {item.product.name}
            </Link>
            {formatVariants()}
            {item.product.sku && (
              <div className="text-xs text-secondary-500 mt-1">
                SKU: {item.product.sku}
              </div>
            )}
          </div>

          <div className="mt-2 sm:mt-0 text-right">
            <div className="text-lg font-medium text-secondary-900">
              ${(item.price.amount * item.quantity).toFixed(2)}
            </div>
            <div className="text-sm text-secondary-500">
              ${item.price.amount.toFixed(2)} each
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4">
          {/* Quantity Controls */}
          <div className="flex items-center">
            <button
              onClick={() => handleQuantityChange(quantity - 1)}
              disabled={quantity <= 1 || isUpdating}
              className="p-1 border border-secondary-300 rounded-l-md disabled:opacity-50"
            >
              <FiMinus className="w-4 h-4" />
            </button>
            <input
              type="number"
              min="1"
              max={item.product.stockQuantity}
              value={quantity}
              onChange={(e) => handleQuantityChange(parseInt(e.target.value))}
              className="w-12 text-center border-t border-b border-secondary-300 py-1"
              disabled={isUpdating}
            />
            <button
              onClick={() => handleQuantityChange(quantity + 1)}
              disabled={quantity >= item.product.stockQuantity || isUpdating}
              className="p-1 border border-secondary-300 rounded-r-md disabled:opacity-50"
            >
              <FiPlus className="w-4 h-4" />
            </button>

            {isUpdating && (
              <span className="ml-2 text-xs text-secondary-500">Updating...</span>
            )}
          </div>

          {/* Remove Button */}
          <button
            onClick={handleRemove}
            className="mt-2 sm:mt-0 flex items-center text-sm text-red-600 hover:text-red-800"
          >
            <FiTrash2 className="w-4 h-4 mr-1" />
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
