import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import '../styles/Checkout.css';

export default function Checkout() {
  const { cartItems, getCartTotal, placeOrder } = useCart();
  const { user, addresses, paymentMethods } = useUser();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: '',
    paymentMethod: 'card',
    selectedAddressId: null,
    selectedPaymentId: null
  });

  const [errors, setErrors] = useState({});
  const [useSavedAddress, setUseSavedAddress] = useState(false);
  const [useSavedPayment, setUseSavedPayment] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name,
        email: user.email
      }));
    }
  }, [user]);

  if (cartItems.length === 0) {
    navigate('/cart');
    return null;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (errors[e.target.name]) {
      setErrors({
        ...errors,
        [e.target.name]: ''
      });
    }
  };

  const handleAddressSelect = (addressId) => {
    const address = addresses.find(a => a.id === addressId);
    if (address) {
      setFormData({
        ...formData,
        selectedAddressId: addressId,
        address: address.street,
        city: address.city,
        state: address.state,
        zipCode: address.zipCode,
        country: address.country
      });
    }
  };

  const handlePaymentSelect = (paymentId) => {
    setFormData({
      ...formData,
      selectedPaymentId: paymentId,
      paymentMethod: paymentMethods.find(p => p.id === paymentId)?.type || 'card'
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.name.trim()) newErrors.name = 'Name is required';
    if (!formData.email.trim()) newErrors.email = 'Email is required';
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.address.trim()) newErrors.address = 'Address is required';
    if (!formData.city.trim()) newErrors.city = 'City is required';
    if (!formData.zipCode.trim()) newErrors.zipCode = 'Zip code is required';
    if (!formData.country.trim()) newErrors.country = 'Country is required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      const order = placeOrder({
        ...formData,
        userId: user?.id
      });
      navigate(`/order-confirmation/${order.id}`);
    }
  };

  return (
    <div className="checkout">
      <div className="checkout-container">
        <h1 className="checkout-title">Checkout</h1>
        
        <div className="checkout-content">
          <div className="checkout-form-section">
            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="form-section">
                <h2>Shipping Information</h2>
                
                {user && addresses.length > 0 && (
                  <div className="saved-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={useSavedAddress}
                        onChange={(e) => {
                          setUseSavedAddress(e.target.checked);
                          if (!e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              selectedAddressId: null,
                              address: '',
                              city: '',
                              state: '',
                              zipCode: '',
                              country: ''
                            }));
                          }
                        }}
                      />
                      <span>Use saved address</span>
                    </label>
                    {useSavedAddress && (
                      <select
                        className="saved-select"
                        value={formData.selectedAddressId || ''}
                        onChange={(e) => handleAddressSelect(parseInt(e.target.value))}
                      >
                        <option value="">Select an address</option>
                        {addresses.map((addr) => (
                          <option key={addr.id} value={addr.id}>
                            {addr.street}, {addr.city}, {addr.state} {addr.zipCode}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                <div className="form-group">
                  <label>Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label>Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={errors.email ? 'error' : ''}
                  />
                  {errors.email && <span className="error-message">{errors.email}</span>}
                </div>

                <div className="form-group">
                  <label>Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={errors.phone ? 'error' : ''}
                  />
                  {errors.phone && <span className="error-message">{errors.phone}</span>}
                </div>

                <div className="form-group">
                  <label>Address *</label>
                  <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={errors.address ? 'error' : ''}
                    disabled={useSavedAddress && formData.selectedAddressId}
                  />
                  {errors.address && <span className="error-message">{errors.address}</span>}
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>City *</label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={errors.city ? 'error' : ''}
                      disabled={useSavedAddress && formData.selectedAddressId}
                    />
                    {errors.city && <span className="error-message">{errors.city}</span>}
                  </div>

                  <div className="form-group">
                    <label>State *</label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      disabled={useSavedAddress && formData.selectedAddressId}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>Zip Code *</label>
                    <input
                      type="text"
                      name="zipCode"
                      value={formData.zipCode}
                      onChange={handleChange}
                      className={errors.zipCode ? 'error' : ''}
                      disabled={useSavedAddress && formData.selectedAddressId}
                    />
                    {errors.zipCode && <span className="error-message">{errors.zipCode}</span>}
                  </div>

                  <div className="form-group">
                    <label>Country *</label>
                    <input
                      type="text"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={errors.country ? 'error' : ''}
                      disabled={useSavedAddress && formData.selectedAddressId}
                    />
                    {errors.country && <span className="error-message">{errors.country}</span>}
                  </div>
                </div>
              </div>

              <div className="form-section">
                <h2>Payment Method</h2>
                
                {user && paymentMethods.length > 0 && (
                  <div className="saved-options">
                    <label className="checkbox-label">
                      <input
                        type="checkbox"
                        checked={useSavedPayment}
                        onChange={(e) => {
                          setUseSavedPayment(e.target.checked);
                          if (!e.target.checked) {
                            setFormData(prev => ({
                              ...prev,
                              selectedPaymentId: null,
                              paymentMethod: 'card'
                            }));
                          }
                        }}
                      />
                      <span>Use saved payment method</span>
                    </label>
                    {useSavedPayment && (
                      <select
                        className="saved-select"
                        value={formData.selectedPaymentId || ''}
                        onChange={(e) => handlePaymentSelect(parseInt(e.target.value))}
                      >
                        <option value="">Select a payment method</option>
                        {paymentMethods.map((pm) => (
                          <option key={pm.id} value={pm.id}>
                            {pm.type === 'card' ? `Card ending in ${pm.cardNumber.slice(-4)}` : 'PayPal'}
                          </option>
                        ))}
                      </select>
                    )}
                  </div>
                )}

                {!useSavedPayment && (
                  <div className="payment-methods">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="card"
                        checked={formData.paymentMethod === 'card'}
                        onChange={handleChange}
                      />
                      <span>Credit/Debit Card</span>
                    </label>
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="cash"
                        checked={formData.paymentMethod === 'cash'}
                        onChange={handleChange}
                      />
                      <span>Cash on Delivery</span>
                    </label>
                  </div>
                )}
              </div>

              <button type="submit" className="place-order-btn">
                Place Order
              </button>
            </form>
          </div>

          <div className="checkout-summary">
            <h2>Order Summary</h2>
            <div className="order-items">
              {cartItems.map((item) => (
                <div key={item.id} className="order-item">
                  <img src={item.image} alt={item.name} className="order-item-image" />
                  <div className="order-item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.quantity}</p>
                  </div>
                  <span className="order-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>
            <div className="order-summary-total">
              <div className="summary-row">
                <span>Subtotal</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
              <div className="summary-row">
                <span>Delivery</span>
                <span className="free">FREE</span>
              </div>
              <div className="summary-row total">
                <span>Total</span>
                <span>${getCartTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
