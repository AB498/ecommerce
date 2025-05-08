import React, { createContext, useState, useContext, useCallback, useEffect } from 'react';
import Cookies from 'js-cookie';
import api from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

// Cookie configuration for better security and persistence
const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  path: '/',
  sameSite: 'Lax',
  secure: window.location.protocol === 'https:'
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated
  const checkAuth = useCallback(async () => {
    setLoading(true);
    try {
      const token = Cookies.get('token');
      console.log('Token from cookie during checkAuth:', token);

      if (!token) {
        console.log('No token found, user is not authenticated');
        setUser(null);
        setLoading(false);
        return;
      }

      // Make sure the token is included in the request
      console.log('Checking authentication with token:', token);
      const response = await api.get('/auth/user');
      console.log('Auth check response:', response.data);
      setUser(response.data.user);
    } catch (error) {
      console.error('Authentication check failed:', error);
      console.error('Error response:', error.response);
      // Only remove token if it's an authentication error
      if (error.response && error.response.status === 401) {
        console.log('Removing invalid token');
        Cookies.remove('token', { path: '/' });
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Check authentication status when the component mounts
  useEffect(() => {
    console.log('AuthProvider mounted, checking authentication');
    checkAuth();
  }, [checkAuth]);

  // Register a new user
  const register = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/register', userData);
      const { token, user } = response.data;

      console.log('Registration successful, setting token:', token);

      // Save token in cookie with enhanced options
      Cookies.set('token', token, COOKIE_OPTIONS);

      // Set user in state
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.response?.data?.message || 'Registration failed');
      return { success: false, error: error.response?.data?.message || 'Registration failed' };
    } finally {
      setLoading(false);
    }
  };

  // Login user
  const login = async (credentials) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/login', credentials);
      const { token, user } = response.data;

      console.log('Login successful, setting token:', token);

      // Save token in cookie with enhanced options
      Cookies.set('token', token, COOKIE_OPTIONS);

      // Set user in state
      setUser(user);

      return { success: true, user };
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.response?.data?.message || 'Login failed');
      return { success: false, error: error.response?.data?.message || 'Login failed' };
    } finally {
      setLoading(false);
    }
  };

  // Logout user
  const logout = () => {
    console.log('Logging out, removing token');

    // Remove token from cookie with the same path
    Cookies.remove('token', { path: '/' });

    // Clear user from state
    setUser(null);
  };

  // Update user profile
  const updateProfile = async (userData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put('/users/profile', userData);

      // Update user in state
      setUser(response.data.user);

      return { success: true, user: response.data.user };
    } catch (error) {
      console.error('Profile update failed:', error);
      setError(error.response?.data?.message || 'Profile update failed');
      return { success: false, error: error.response?.data?.message || 'Profile update failed' };
    } finally {
      setLoading(false);
    }
  };

  // Request password reset
  const forgotPassword = async (email) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/forgot-password', { email });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Password reset request failed:', error);
      setError(error.response?.data?.message || 'Password reset request failed');
      return { success: false, error: error.response?.data?.message || 'Password reset request failed' };
    } finally {
      setLoading(false);
    }
  };

  // Reset password
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post('/auth/reset-password', { token, newPassword });
      return { success: true, message: response.data.message };
    } catch (error) {
      console.error('Password reset failed:', error);
      setError(error.response?.data?.message || 'Password reset failed');
      return { success: false, error: error.response?.data?.message || 'Password reset failed' };
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    checkAuth,
    register,
    login,
    logout,
    updateProfile,
    forgotPassword,
    resetPassword,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
