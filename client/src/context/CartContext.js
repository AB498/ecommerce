import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState({ items: [], couponCode: null });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated } = useAuth();

  // Fetch cart from API when user is authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCart();
    }
  }, [isAuthenticated]);

  // Fetch cart from API
  const fetchCart = async () => {
    setLoading(true);
    try {
      const response = await api.get('/cart');
      setCart(response.data.cart);
    } catch (error) {
      console.error('Fetch cart error:', error);
      setError(error.response?.data?.message || 'Failed to fetch cart');
    } finally {
      setLoading(false);
    }
  };

  // Add item to cart
  const addToCart = async (productId, quantity = 1, selectedVariants = []) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/cart/items', {
        productId,
        quantity,
        selectedVariants
      });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error('Add to cart error:', error);
      setError(error.response?.data?.message || 'Failed to add item to cart');
      return { success: false, error: error.response?.data?.message || 'Failed to add item to cart' };
    } finally {
      setLoading(false);
    }
  };

  // Update cart item quantity
  const updateCartItem = async (itemId, quantity, selectedVariants) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/cart/items/${itemId}`, {
        quantity,
        selectedVariants
      });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error('Update cart item error:', error);
      setError(error.response?.data?.message || 'Failed to update cart item');
      return { success: false, error: error.response?.data?.message || 'Failed to update cart item' };
    } finally {
      setLoading(false);
    }
  };

  // Remove item from cart
  const removeFromCart = async (itemId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete(`/cart/items/${itemId}`);
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error('Remove from cart error:', error);
      setError(error.response?.data?.message || 'Failed to remove item from cart');
      return { success: false, error: error.response?.data?.message || 'Failed to remove item from cart' };
    } finally {
      setLoading(false);
    }
  };

  // Clear cart
  const clearCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete('/cart');
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error('Clear cart error:', error);
      setError(error.response?.data?.message || 'Failed to clear cart');
      return { success: false, error: error.response?.data?.message || 'Failed to clear cart' };
    } finally {
      setLoading(false);
    }
  };

  // Apply coupon to cart
  const applyCoupon = async (couponCode) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/cart/coupon', { couponCode });
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error('Apply coupon error:', error);
      setError(error.response?.data?.message || 'Failed to apply coupon');
      return { success: false, error: error.response?.data?.message || 'Failed to apply coupon' };
    } finally {
      setLoading(false);
    }
  };

  // Remove coupon from cart
  const removeCoupon = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.delete('/cart/coupon');
      setCart(response.data.cart);
      return { success: true };
    } catch (error) {
      console.error('Remove coupon error:', error);
      setError(error.response?.data?.message || 'Failed to remove coupon');
      return { success: false, error: error.response?.data?.message || 'Failed to remove coupon' };
    } finally {
      setLoading(false);
    }
  };

  // Calculate cart totals
  const calculateTotals = () => {
    const subtotal = cart.items.reduce((total, item) => {
      return total + (item.price.amount * item.quantity);
    }, 0);

    // TODO: Add discount calculation based on coupon
    const discount = 0;

    // TODO: Add tax calculation
    const tax = 0;

    // TODO: Add shipping calculation
    const shipping = 0;

    const total = subtotal - discount + tax + shipping;

    return {
      subtotal,
      discount,
      tax,
      shipping,
      total
    };
  };

  const value = {
    cart,
    loading,
    error,
    fetchCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart,
    applyCoupon,
    removeCoupon,
    calculateTotals,
    itemCount: cart.items.reduce((count, item) => count + item.quantity, 0)
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
