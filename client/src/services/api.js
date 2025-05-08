import axios from 'axios';
import Cookies from 'js-cookie';

// In production, use a relative URL to make requests to the same domain
// In development, use the localhost URL
const API_URL = process.env.NODE_ENV === 'production'
  ? '/api'
  : (process.env.REACT_APP_API_URL || 'http://localhost:8000/api');

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Function to get the current token
const getToken = () => Cookies.get('token');

// Add a request interceptor to include auth token in requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      // Make sure to set the Authorization header for every request
      config.headers.Authorization = `Bearer ${token}`;

      // Log the token being sent (for debugging)
      console.log('Sending request with token:', token);
    } else {
      console.log('No token found in cookies');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle common errors
api.interceptors.response.use(
  (response) => {
    // Log successful responses for debugging
    console.log(`Response from ${response.config.url}:`, response.status);
    return response;
  },
  (error) => {
    // Log detailed error information
    console.error('API Error:', error);

    if (error.response) {
      console.error('Error status:', error.response.status);
      console.error('Error data:', error.response.data);
      console.error('Request URL:', error.config.url);
      console.error('Request method:', error.config.method);

      // Handle 401 Unauthorized errors (token expired, etc.)
      if (error.response.status === 401) {
        console.error('401 Unauthorized error - clearing token');

        // Clear token from cookies with path
        Cookies.remove('token', { path: '/' });

        // Redirect to login page if not already there
        if (window.location.pathname !== '/login') {
          console.log('Redirecting to login page');
          window.location.href = '/login';
        }
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request);
    } else {
      // Something happened in setting up the request
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
