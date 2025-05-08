import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';

// This is a redirect component that will redirect to the account page with the addresses tab active
const AddressesPage = () => {
  // Update page title
  useEffect(() => {
    document.title = 'My Addresses | E-Commerce';
    
    return () => {
      document.title = 'E-Commerce';
    };
  }, []);

  // We'll use the state parameter to tell the AccountPage which tab to activate
  return <Navigate to="/account" state={{ activeTab: 'addresses' }} replace />;
};

export default AddressesPage;
