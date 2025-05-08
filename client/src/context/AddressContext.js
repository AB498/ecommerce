import React, { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';
import api from '../services/api';

const AddressContext = createContext();

export const useAddress = () => useContext(AddressContext);

export const AddressProvider = ({ children }) => {
  const [addresses, setAddresses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, user } = useAuth();

  // Fetch addresses when user is authenticated
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchAddresses();
    }
  }, [isAuthenticated, user]);

  // Fetch addresses from API (simulated for now)
  const fetchAddresses = async () => {
    setLoading(true);
    try {
      // In a real app, you would fetch from your API
      // const response = await api.get('/addresses');
      // setAddresses(response.data.addresses);
      
      // For now, we'll use localStorage to persist addresses between page refreshes
      const savedAddresses = localStorage.getItem('userAddresses');
      if (savedAddresses) {
        setAddresses(JSON.parse(savedAddresses));
      }
    } catch (error) {
      console.error('Fetch addresses error:', error);
      setError('Failed to fetch addresses');
    } finally {
      setLoading(false);
    }
  };

  // Add a new address
  const addAddress = async (addressData) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, you would send this to your API
      // const response = await api.post('/addresses', addressData);
      // const newAddress = response.data.address;
      
      // For now, we'll just simulate adding the address
      const newAddress = {
        ...addressData,
        id: Date.now().toString(), // Generate a temporary ID
        createdAt: new Date().toISOString()
      };
      
      // If this is the first address or marked as default, make it the default
      if (addresses.length === 0 || addressData.isDefault) {
        // First, remove default flag from all other addresses
        const updatedAddresses = addresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
        
        // Then add the new address with default flag
        const newAddresses = [...updatedAddresses, { ...newAddress, isDefault: true }];
        setAddresses(newAddresses);
        
        // Save to localStorage
        localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
      } else {
        // Just add the new address
        const newAddresses = [...addresses, newAddress];
        setAddresses(newAddresses);
        
        // Save to localStorage
        localStorage.setItem('userAddresses', JSON.stringify(newAddresses));
      }
      
      return { success: true, address: newAddress };
    } catch (error) {
      console.error('Add address error:', error);
      setError('Failed to add address');
      return { success: false, error: 'Failed to add address' };
    } finally {
      setLoading(false);
    }
  };

  // Update an address
  const updateAddress = async (addressId, addressData) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, you would send this to your API
      // const response = await api.put(`/addresses/${addressId}`, addressData);
      
      // For now, we'll just simulate updating the address
      let updatedAddresses = [...addresses];
      
      // If setting as default, remove default from all others
      if (addressData.isDefault) {
        updatedAddresses = updatedAddresses.map(addr => ({
          ...addr,
          isDefault: false
        }));
      }
      
      // Update the specific address
      updatedAddresses = updatedAddresses.map(addr => 
        addr.id === addressId ? { ...addr, ...addressData } : addr
      );
      
      setAddresses(updatedAddresses);
      
      // Save to localStorage
      localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      
      return { success: true };
    } catch (error) {
      console.error('Update address error:', error);
      setError('Failed to update address');
      return { success: false, error: 'Failed to update address' };
    } finally {
      setLoading(false);
    }
  };

  // Delete an address
  const deleteAddress = async (addressId) => {
    setLoading(true);
    setError(null);
    try {
      // In a real app, you would send a delete request to your API
      // await api.delete(`/addresses/${addressId}`);
      
      // For now, we'll just remove it from the state
      const updatedAddresses = addresses.filter(addr => addr.id !== addressId);
      
      // If we deleted the default address and there are other addresses, make the first one default
      if (addresses.find(addr => addr.id === addressId)?.isDefault && updatedAddresses.length > 0) {
        updatedAddresses[0].isDefault = true;
      }
      
      setAddresses(updatedAddresses);
      
      // Save to localStorage
      localStorage.setItem('userAddresses', JSON.stringify(updatedAddresses));
      
      return { success: true };
    } catch (error) {
      console.error('Delete address error:', error);
      setError('Failed to delete address');
      return { success: false, error: 'Failed to delete address' };
    } finally {
      setLoading(false);
    }
  };

  // Get the default address
  const getDefaultAddress = () => {
    return addresses.find(addr => addr.isDefault) || (addresses.length > 0 ? addresses[0] : null);
  };

  const value = {
    addresses,
    loading,
    error,
    fetchAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    getDefaultAddress
  };

  return <AddressContext.Provider value={value}>{children}</AddressContext.Provider>;
};
