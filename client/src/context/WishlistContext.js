import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const WishlistContext = createContext();

export const useWishlist = () => useContext(WishlistContext);

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState({ products: [] });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch wishlist from API
  const fetchWishlist = async () => {
    if (!isAuthenticated) return;

    setLoading(true);
    try {
      const response = await api.get('/wishlist');
      setWishlist(response.data.wishlist);
    } catch (error) {
      console.error('Fetch wishlist error:', error);
      setError(error.response?.data?.message || 'Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  };

  // Fetch wishlist from API when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchWishlist();
    }
  }, [isAuthenticated]);

  // Add product to wishlist
  const addToWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, error: 'Please login to add items to wishlist' };

    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/wishlist', { productId });
      setWishlist(response.data.wishlist);
      return { success: true };
    } catch (error) {
      console.error('Add to wishlist error:', error);
      setError(error.response?.data?.message || 'Failed to add item to wishlist');
      return { success: false, error: error.response?.data?.message || 'Failed to add item to wishlist' };
    } finally {
      setLoading(false);
    }
  };

  // Remove product from wishlist
  const removeFromWishlist = async (productId) => {
    if (!isAuthenticated) return { success: false, error: 'Please login to manage your wishlist' };

    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/wishlist/${productId}`);
      setWishlist(response.data.wishlist);
      return { success: true };
    } catch (error) {
      console.error('Remove from wishlist error:', error);
      setError(error.response?.data?.message || 'Failed to remove item from wishlist');
      return { success: false, error: error.response?.data?.message || 'Failed to remove item from wishlist' };
    } finally {
      setLoading(false);
    }
  };

  // Clear wishlist
  const clearWishlist = async () => {
    if (!isAuthenticated) return { success: false, error: 'Please login to manage your wishlist' };

    setLoading(true);
    setError(null);
    try {
      const response = await api.delete('/wishlist');
      setWishlist(response.data.wishlist);
      return { success: true };
    } catch (error) {
      console.error('Clear wishlist error:', error);
      setError(error.response?.data?.message || 'Failed to clear wishlist');
      return { success: false, error: error.response?.data?.message || 'Failed to clear wishlist' };
    } finally {
      setLoading(false);
    }
  };

  // Check if product is in wishlist
  const isInWishlist = (productId) => {
    if (!wishlist.products) return false;
    return wishlist.products.some(product =>
      product._id === productId || product === productId
    );
  };

  // Move all wishlist items to cart
  const moveAllToCart = async () => {
    if (!isAuthenticated) return { success: false, error: 'Please login to manage your wishlist' };

    // This would typically call an API endpoint or use the cart context to add all items
    // For now, we'll just log a message
    console.log('Move all to cart functionality needs to be implemented');
    return { success: false, error: 'Functionality not implemented yet' };
  };

  const value = {
    wishlist,
    loading,
    error,
    fetchWishlist,
    addToWishlist,
    removeFromWishlist,
    clearWishlist,
    isInWishlist,
    moveAllToCart,
    wishlistCount: wishlist.products ? wishlist.products.length : 0
  };

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};
