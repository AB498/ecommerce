import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiCreditCard, FiUser, FiMapPin, FiTruck, FiCheck } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import api from '../../services/api';

const CheckoutForm = () => {
  const { user } = useAuth();
  const { cart, calculateTotals, clearCart } = useCart();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [addresses, setAddresses] = useState([]);
  const [formData, setFormData] = useState({
    shippingAddress: null,
    billingAddress: null,
    sameAsShipping: true,
    shippingMethod: 'standard',
    paymentMethod: 'credit_card',
    cardNumber: '',
    cardName: '',
    cardExpiry: '',
    cardCvc: '',
    notes: ''
  });

  // Fetch user addresses from localStorage
  useEffect(() => {
    const fetchAddresses = () => {
      try {
        // Get addresses from localStorage
        const savedAddresses = localStorage.getItem('userAddresses');

        if (savedAddresses) {
          const parsedAddresses = JSON.parse(savedAddresses);
          setAddresses(parsedAddresses);

          // Set default address if available
          const defaultAddress = parsedAddresses.find(addr => addr.isDefault);

          if (defaultAddress) {
            setFormData(prev => ({
              ...prev,
              shippingAddress: defaultAddress.id,
              billingAddress: defaultAddress.id
            }));
          } else if (parsedAddresses.length > 0) {
            // If no default address, use the first one
            setFormData(prev => ({
              ...prev,
              shippingAddress: parsedAddresses[0].id,
              billingAddress: parsedAddresses[0].id
            }));
          }
        }
      } catch (error) {
        console.error('Error fetching addresses from localStorage:', error);
      }
    };

    if (user) {
      fetchAddresses();
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    // If "same as shipping" is checked, update billing address
    if (name === 'sameAsShipping' && checked) {
      setFormData(prev => ({
        ...prev,
        billingAddress: prev.shippingAddress
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (step < 3) {
      setStep(step + 1);
      return;
    }

    setLoading(true);
    setError('');

    try {
      // Get shipping and billing address objects
      const shippingAddressObj = addresses.find(addr => addr.id === formData.shippingAddress);
      const billingAddressObj = formData.sameAsShipping
        ? shippingAddressObj
        : addresses.find(addr => addr.id === formData.billingAddress);

      if (!shippingAddressObj) {
        throw new Error('Please select a shipping address');
      }

      if (!billingAddressObj && !formData.sameAsShipping) {
        throw new Error('Please select a billing address');
      }

      // Format addresses to match the server's expected structure
      const formattedShippingAddress = {
        name: shippingAddressObj.name,
        street: shippingAddressObj.addressLine1 + (shippingAddressObj.addressLine2 ? ', ' + shippingAddressObj.addressLine2 : ''),
        city: shippingAddressObj.city,
        state: shippingAddressObj.state,
        postalCode: shippingAddressObj.postalCode,
        country: shippingAddressObj.country,
        phone: shippingAddressObj.phone
      };

      const formattedBillingAddress = {
        name: billingAddressObj.name,
        street: billingAddressObj.addressLine1 + (billingAddressObj.addressLine2 ? ', ' + billingAddressObj.addressLine2 : ''),
        city: billingAddressObj.city,
        state: billingAddressObj.state,
        postalCode: billingAddressObj.postalCode,
        country: billingAddressObj.country,
        phone: billingAddressObj.phone
      };

      // Create order
      const response = await api.post('/orders', {
        shippingAddress: formattedShippingAddress,
        billingAddress: formattedBillingAddress,
        paymentMethod: formData.paymentMethod,
        shippingMethod: formData.shippingMethod,
        notes: formData.notes
      });

      // Process payment (in a real app, this would integrate with a payment gateway)
      if (formData.paymentMethod === 'credit_card') {
        await api.post('/payments/process', {
          orderId: response.data.order._id,
          method: 'credit_card',
          amount: response.data.order.total.amount,
          paymentDetails: {
            cardNumber: formData.cardNumber.replace(/\s/g, ''),
            cardName: formData.cardName,
            cardExpiry: formData.cardExpiry
          }
        });
      }

      // Clear cart
      await clearCart();

      // Redirect to order confirmation
      navigate(`/orders/${response.data.order._id}`, {
        state: { success: true }
      });
    } catch (error) {
      console.error('Checkout error:', error);
      setError(error.response?.data?.message || error.message || 'An error occurred during checkout');
    } finally {
      setLoading(false);
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = matches && matches[0] || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Format card expiry date
  const formatCardExpiry = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');

    if (v.length > 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }

    return value;
  };

  // Calculate order totals
  const { subtotal, discount, tax } = calculateTotals();

  // Get shipping cost based on method
  const getShippingCost = () => {
    switch (formData.shippingMethod) {
      case 'express':
        return 14.99;
      case 'overnight':
        return 24.99;
      case 'standard':
      default:
        return 5.99;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      {/* Checkout Steps */}
      <div className="border-b border-secondary-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between">
            <div className={`flex flex-col items-center ${step >= 1 ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                <FiMapPin className="w-4 h-4" />
              </div>
              <span className="text-xs mt-1">Shipping</span>
            </div>
            <div className="relative flex-grow mx-4">
              <div className={`absolute top-4 h-0.5 w-full ${step >= 2 ? 'bg-primary-600' : 'bg-secondary-200'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${step >= 2 ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                <FiTruck className="w-4 h-4" />
              </div>
              <span className="text-xs mt-1">Delivery</span>
            </div>
            <div className="relative flex-grow mx-4">
              <div className={`absolute top-4 h-0.5 w-full ${step >= 3 ? 'bg-primary-600' : 'bg-secondary-200'}`}></div>
            </div>
            <div className={`flex flex-col items-center ${step >= 3 ? 'text-primary-600' : 'text-secondary-400'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-primary-100' : 'bg-secondary-100'}`}>
                <FiCreditCard className="w-4 h-4" />
              </div>
              <span className="text-xs mt-1">Payment</span>
            </div>
          </div>
        </div>
      </div>

      {/* Checkout Form */}
      <form onSubmit={handleSubmit} className="p-6">
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-md">
            {error}
          </div>
        )}

        {/* Step 1: Shipping Address */}
        {step === 1 && (
          <div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Shipping Address</h2>

            {addresses.length > 0 ? (
              <div className="space-y-4 mb-6">
                {addresses.map((address) => (
                  <label
                    key={address.id}
                    className={`block p-4 border rounded-md cursor-pointer ${
                      formData.shippingAddress === address.id
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-secondary-200 hover:border-secondary-300'
                    }`}
                  >
                    <div className="flex items-start">
                      <input
                        type="radio"
                        name="shippingAddress"
                        value={address.id}
                        checked={formData.shippingAddress === address.id}
                        onChange={handleChange}
                        className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                      />
                      <div className="ml-3">
                        <p className="font-medium text-secondary-900">{address.name}</p>
                        <p className="text-secondary-700">{address.addressLine1}</p>
                        {address.addressLine2 && (
                          <p className="text-secondary-700">{address.addressLine2}</p>
                        )}
                        <p className="text-secondary-700">
                          {address.city}, {address.state} {address.postalCode}
                        </p>
                        <p className="text-secondary-700">{address.country}</p>
                        <p className="text-secondary-700">{address.phone}</p>
                        {address.isDefault && (
                          <span className="inline-flex items-center mt-1 text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                            <FiCheck className="mr-1" /> Default
                          </span>
                        )}
                      </div>
                    </div>
                  </label>
                ))}

                <button
                  type="button"
                  className="w-full py-2 px-4 border border-dashed border-secondary-300 rounded-md text-secondary-700 hover:bg-secondary-50"
                  onClick={() => navigate('/account/addresses', { state: { returnTo: '/checkout' } })}
                >
                  + Add New Address
                </button>
              </div>
            ) : (
              <div className="mb-6">
                <p className="text-secondary-700 mb-4">You don't have any saved addresses.</p>
                <button
                  type="button"
                  className="py-2 px-4 bg-primary-600 text-white rounded-md hover:bg-primary-700"
                  onClick={() => navigate('/account/addresses', { state: { returnTo: '/checkout' } })}
                >
                  Add New Address
                </button>
              </div>
            )}
          </div>
        )}

        {/* Step 2: Delivery Options */}
        {step === 2 && (
          <div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Delivery Options</h2>

            <div className="space-y-4 mb-6">
              <label
                className={`block p-4 border rounded-md cursor-pointer ${
                  formData.shippingMethod === 'standard'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="standard"
                    checked={formData.shippingMethod === 'standard'}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                  />
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <p className="font-medium text-secondary-900">Standard Shipping</p>
                      <p className="font-medium text-secondary-900">$5.99</p>
                    </div>
                    <p className="text-secondary-700">Delivery in 5-7 business days</p>
                  </div>
                </div>
              </label>

              <label
                className={`block p-4 border rounded-md cursor-pointer ${
                  formData.shippingMethod === 'express'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="express"
                    checked={formData.shippingMethod === 'express'}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                  />
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <p className="font-medium text-secondary-900">Express Shipping</p>
                      <p className="font-medium text-secondary-900">$14.99</p>
                    </div>
                    <p className="text-secondary-700">Delivery in 2-3 business days</p>
                  </div>
                </div>
              </label>

              <label
                className={`block p-4 border rounded-md cursor-pointer ${
                  formData.shippingMethod === 'overnight'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="shippingMethod"
                    value="overnight"
                    checked={formData.shippingMethod === 'overnight'}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                  />
                  <div className="ml-3 flex-grow">
                    <div className="flex justify-between">
                      <p className="font-medium text-secondary-900">Overnight Shipping</p>
                      <p className="font-medium text-secondary-900">$24.99</p>
                    </div>
                    <p className="text-secondary-700">Delivery in 1 business day</p>
                  </div>
                </div>
              </label>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-medium text-secondary-900 mb-2">Billing Address</h3>

              <div className="mb-4">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="sameAsShipping"
                    checked={formData.sameAsShipping}
                    onChange={handleChange}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300 rounded"
                  />
                  <span className="ml-2 text-secondary-700">Same as shipping address</span>
                </label>
              </div>

              {!formData.sameAsShipping && (
                <div className="space-y-4">
                  {addresses.map((address) => (
                    <label
                      key={address.id}
                      className={`block p-4 border rounded-md cursor-pointer ${
                        formData.billingAddress === address.id
                          ? 'border-primary-600 bg-primary-50'
                          : 'border-secondary-200 hover:border-secondary-300'
                      }`}
                    >
                      <div className="flex items-start">
                        <input
                          type="radio"
                          name="billingAddress"
                          value={address.id}
                          checked={formData.billingAddress === address.id}
                          onChange={handleChange}
                          className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                        />
                        <div className="ml-3">
                          <p className="font-medium text-secondary-900">{address.name}</p>
                          <p className="text-secondary-700">{address.addressLine1}</p>
                          {address.addressLine2 && (
                            <p className="text-secondary-700">{address.addressLine2}</p>
                          )}
                          <p className="text-secondary-700">
                            {address.city}, {address.state} {address.postalCode}
                          </p>
                          <p className="text-secondary-700">{address.country}</p>
                          <p className="text-secondary-700">{address.phone}</p>
                          {address.isDefault && (
                            <span className="inline-flex items-center mt-1 text-xs text-primary-700 bg-primary-50 px-2 py-0.5 rounded-full">
                              <FiCheck className="mr-1" /> Default
                            </span>
                          )}
                        </div>
                      </div>
                    </label>
                  ))}

                  <button
                    type="button"
                    className="w-full py-2 px-4 border border-dashed border-secondary-300 rounded-md text-secondary-700 hover:bg-secondary-50"
                    onClick={() => navigate('/account/addresses', { state: { returnTo: '/checkout' } })}
                  >
                    + Add New Address
                  </button>
                </div>
              )}
            </div>

            <div className="mb-6">
              <label htmlFor="notes" className="block text-sm font-medium text-secondary-700 mb-2">
                Order Notes (Optional)
              </label>
              <textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                placeholder="Special instructions for delivery"
              ></textarea>
            </div>
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div>
            <h2 className="text-xl font-semibold text-secondary-900 mb-6">Payment Method</h2>

            <div className="space-y-4 mb-6">
              <label
                className={`block p-4 border rounded-md cursor-pointer ${
                  formData.paymentMethod === 'credit_card'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="credit_card"
                    checked={formData.paymentMethod === 'credit_card'}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-secondary-900">Credit / Debit Card</p>
                    <div className="flex space-x-2 mt-1">
                      <div className="bg-blue-600 text-white px-2 py-1 rounded text-xs font-bold">VISA</div>
                      <div className="bg-red-600 text-white px-2 py-1 rounded text-xs font-bold">MC</div>
                      <div className="bg-green-600 text-white px-2 py-1 rounded text-xs font-bold">AMEX</div>
                    </div>
                  </div>
                </div>
              </label>

              <label
                className={`block p-4 border rounded-md cursor-pointer ${
                  formData.paymentMethod === 'paypal'
                    ? 'border-primary-600 bg-primary-50'
                    : 'border-secondary-200 hover:border-secondary-300'
                }`}
              >
                <div className="flex items-start">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="paypal"
                    checked={formData.paymentMethod === 'paypal'}
                    onChange={handleChange}
                    className="mt-1 h-4 w-4 text-primary-600 focus:ring-primary-500 border-secondary-300"
                  />
                  <div className="ml-3">
                    <p className="font-medium text-secondary-900">PayPal</p>
                    <div className="flex space-x-2 mt-1">
                      <div className="bg-blue-400 text-white px-2 py-1 rounded text-xs font-bold">PAYPAL</div>
                    </div>
                    <p className="text-secondary-700 text-sm mt-1">You will be redirected to PayPal to complete your purchase.</p>
                  </div>
                </div>
              </label>
            </div>

            {formData.paymentMethod === 'credit_card' && (
              <div className="space-y-4 mb-6 p-4 border border-secondary-200 rounded-md">
                <div>
                  <label htmlFor="cardNumber" className="block text-sm font-medium text-secondary-700 mb-1">
                    Card Number
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiCreditCard className="text-secondary-400" />
                    </div>
                    <input
                      type="text"
                      id="cardNumber"
                      name="cardNumber"
                      value={formData.cardNumber}
                      onChange={(e) => setFormData({ ...formData, cardNumber: formatCardNumber(e.target.value) })}
                      placeholder="1234 5678 9012 3456"
                      maxLength="19"
                      className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="cardName" className="block text-sm font-medium text-secondary-700 mb-1">
                    Cardholder Name
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiUser className="text-secondary-400" />
                    </div>
                    <input
                      type="text"
                      id="cardName"
                      name="cardName"
                      value={formData.cardName}
                      onChange={handleChange}
                      placeholder="John Doe"
                      className="block w-full pl-10 pr-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="cardExpiry" className="block text-sm font-medium text-secondary-700 mb-1">
                      Expiry Date
                    </label>
                    <input
                      type="text"
                      id="cardExpiry"
                      name="cardExpiry"
                      value={formData.cardExpiry}
                      onChange={(e) => setFormData({ ...formData, cardExpiry: formatCardExpiry(e.target.value) })}
                      placeholder="MM/YY"
                      maxLength="5"
                      className="block w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>

                  <div>
                    <label htmlFor="cardCvc" className="block text-sm font-medium text-secondary-700 mb-1">
                      CVC
                    </label>
                    <input
                      type="text"
                      id="cardCvc"
                      name="cardCvc"
                      value={formData.cardCvc}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, '');
                        setFormData({ ...formData, cardCvc: value });
                      }}
                      placeholder="123"
                      maxLength="4"
                      className="block w-full px-3 py-2 border border-secondary-300 rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500"
                      required
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Order Summary */}
            <div className="mb-6 p-4 bg-secondary-50 rounded-md">
              <h3 className="text-lg font-medium text-secondary-900 mb-4">Order Summary</h3>

              <div className="space-y-2 mb-4">
                {cart.items.map((item) => (
                  <div key={item._id} className="flex justify-between">
                    <div className="flex-grow">
                      <p className="text-secondary-700">
                        {item.product.name} <span className="text-secondary-500">x{item.quantity}</span>
                      </p>
                    </div>
                    <p className="text-secondary-900 font-medium">
                      ${(item.price.amount * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-secondary-200 pt-4 space-y-2">
                <div className="flex justify-between">
                  <p className="text-secondary-700">Subtotal</p>
                  <p className="text-secondary-900">${subtotal.toFixed(2)}</p>
                </div>

                {discount > 0 && (
                  <div className="flex justify-between">
                    <p className="text-secondary-700">Discount</p>
                    <p className="text-accent-600">-${discount.toFixed(2)}</p>
                  </div>
                )}

                <div className="flex justify-between">
                  <p className="text-secondary-700">Shipping ({formData.shippingMethod})</p>
                  <p className="text-secondary-900">${getShippingCost().toFixed(2)}</p>
                </div>

                <div className="flex justify-between">
                  <p className="text-secondary-700">Tax</p>
                  <p className="text-secondary-900">${tax.toFixed(2)}</p>
                </div>

                <div className="flex justify-between border-t border-secondary-200 pt-2 font-medium">
                  <p className="text-secondary-900">Total</p>
                  <p className="text-secondary-900">${(subtotal + getShippingCost() + tax - discount).toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex justify-between">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => setStep(step - 1)}
              className="px-6 py-3 border border-secondary-300 rounded-md text-secondary-700 hover:bg-secondary-50"
            >
              Back
            </button>
          ) : (
            <div></div>
          )}

          <button
            type="submit"
            disabled={loading || (step === 1 && !formData.shippingAddress) || (step === 3 && formData.paymentMethod === 'credit_card' && (!formData.cardNumber || !formData.cardName || !formData.cardExpiry || !formData.cardCvc))}
            className="px-6 py-3 bg-primary-600 text-white rounded-md font-medium hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Processing...' : step === 3 ? 'Place Order' : 'Continue'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CheckoutForm;
