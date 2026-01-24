import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import '../styles/Profile.css';

export default function Profile() {
  const navigate = useNavigate();
  const { user, deleteAccount, addresses, paymentMethods, addAddress, updateAddress, deleteAddress, addPaymentMethod, updatePaymentMethod, deletePaymentMethod, registerAsSeller } = useUser();
  const [activeTab, setActiveTab] = useState('account');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deletePassword, setDeletePassword] = useState('');
  const [deleteError, setDeleteError] = useState('');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleDeleteAccount = () => {
    try {
      deleteAccount(deletePassword);
      navigate('/');
    } catch (error) {
      setDeleteError(error.message);
    }
  };

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-sidebar">
          <div className="profile-header">
            <h2>{user.name}</h2>
            <p>{user.email}</p>
            {user.isSeller && <span className="seller-badge">Seller</span>}
          </div>
          <nav className="profile-nav">
            <button 
              className={activeTab === 'account' ? 'active' : ''}
              onClick={() => setActiveTab('account')}
            >
              Account Settings
            </button>
            <button 
              className={activeTab === 'addresses' ? 'active' : ''}
              onClick={() => setActiveTab('addresses')}
            >
              Delivery Addresses
            </button>
            <button 
              className={activeTab === 'payments' ? 'active' : ''}
              onClick={() => setActiveTab('payments')}
            >
              Payment Methods
            </button>
            {!user.isSeller && (
              <button 
                className={activeTab === 'seller' ? 'active' : ''}
                onClick={() => setActiveTab('seller')}
              >
                Become a Seller
              </button>
            )}
            <button 
              className={activeTab === 'refunds' ? 'active' : ''}
              onClick={() => setActiveTab('refunds')}
            >
              Refund Requests
            </button>
          </nav>
        </div>

        <div className="profile-content">
          {activeTab === 'account' && (
            <AccountSettings 
              user={user}
              onDeleteClick={() => setShowDeleteModal(true)}
            />
          )}
          {activeTab === 'addresses' && (
            <AddressManagement 
              addresses={addresses}
              onAdd={addAddress}
              onUpdate={updateAddress}
              onDelete={deleteAddress}
            />
          )}
          {activeTab === 'payments' && (
            <PaymentManagement 
              paymentMethods={paymentMethods}
              onAdd={addPaymentMethod}
              onUpdate={updatePaymentMethod}
              onDelete={deletePaymentMethod}
            />
          )}
          {activeTab === 'seller' && !user.isSeller && (
            <SellerRegistration onRegister={registerAsSeller} />
          )}
          {activeTab === 'refunds' && (
            <RefundRequests />
          )}
        </div>
      </div>

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => {
            setShowDeleteModal(false);
            setDeletePassword('');
            setDeleteError('');
          }}
          onConfirm={handleDeleteAccount}
          password={deletePassword}
          onPasswordChange={setDeletePassword}
          error={deleteError}
        />
      )}
    </div>
  );
}

function AccountSettings({ user, onDeleteClick }) {
  return (
    <div className="settings-section">
      <h2>Account Settings</h2>
      <div className="settings-card">
        <div className="setting-item">
          <label>Name</label>
          <p>{user.name}</p>
        </div>
        <div className="setting-item">
          <label>Email</label>
          <p>{user.email}</p>
        </div>
        <div className="setting-item">
          <label>Account Type</label>
          <p>{user.isSeller ? 'Seller' : 'Customer'}</p>
        </div>
        <div className="setting-item">
          <label>Member Since</label>
          <p>{new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
        <div className="danger-zone">
          <h3>Danger Zone</h3>
          <button className="delete-account-btn" onClick={onDeleteClick}>
            Delete Account
          </button>
          <p className="danger-note">
            Deleting your account will permanently remove your profile, addresses, and payment methods. 
            Your order history will be archived for financial record-keeping.
          </p>
        </div>
      </div>
    </div>
  );
}

function AddressManagement({ addresses, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd(formData);
    }
    setFormData({ street: '', city: '', state: '', zipCode: '', country: '' });
    setShowForm(false);
  };

  const handleEdit = (address) => {
    setFormData(address);
    setEditingId(address.id);
    setShowForm(true);
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Delivery Addresses</h2>
        <button className="add-btn" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ street: '', city: '', state: '', zipCode: '', country: '' }); }}>
          + Add Address
        </button>
      </div>

      {showForm && (
        <form className="address-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Street Address *</label>
              <input
                type="text"
                value={formData.street}
                onChange={(e) => setFormData({ ...formData, street: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City *</label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>State *</label>
              <input
                type="text"
                value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>Zip Code *</label>
              <input
                type="text"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label>Country *</label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
              />
            </div>
          </div>
          <div className="form-actions">
            <button type="submit">{editingId ? 'Update' : 'Add'} Address</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="addresses-list">
        {addresses.length === 0 ? (
          <p className="empty-state">No addresses added yet.</p>
        ) : (
          addresses.map((address) => (
            <div key={address.id} className="address-card">
              <div className="address-info">
                <p><strong>{address.street}</strong></p>
                <p>{address.city}, {address.state} {address.zipCode}</p>
                <p>{address.country}</p>
              </div>
              <div className="address-actions">
                <button onClick={() => handleEdit(address)}>Edit</button>
                <button onClick={() => onDelete(address.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function PaymentManagement({ paymentMethods, onAdd, onUpdate, onDelete }) {
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    type: 'card',
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      onUpdate(editingId, formData);
      setEditingId(null);
    } else {
      onAdd(formData);
    }
    setFormData({ type: 'card', cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' });
    setShowForm(false);
  };

  const handleEdit = (payment) => {
    setFormData(payment);
    setEditingId(payment.id);
    setShowForm(true);
  };

  const maskCardNumber = (number) => {
    return '**** **** **** ' + number.slice(-4);
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Payment Methods</h2>
        <button className="add-btn" onClick={() => { setShowForm(true); setEditingId(null); setFormData({ type: 'card', cardNumber: '', cardHolder: '', expiryDate: '', cvv: '' }); }}>
          + Add Payment Method
        </button>
      </div>

      {showForm && (
        <form className="payment-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Payment Type *</label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value })}
              required
            >
              <option value="card">Credit/Debit Card</option>
              <option value="paypal">PayPal</option>
            </select>
          </div>
          {formData.type === 'card' && (
            <>
              <div className="form-group">
                <label>Card Number *</label>
                <input
                  type="text"
                  value={formData.cardNumber}
                  onChange={(e) => setFormData({ ...formData, cardNumber: e.target.value })}
                  placeholder="1234 5678 9012 3456"
                  maxLength="19"
                  required
                />
              </div>
              <div className="form-group">
                <label>Card Holder Name *</label>
                <input
                  type="text"
                  value={formData.cardHolder}
                  onChange={(e) => setFormData({ ...formData, cardHolder: e.target.value })}
                  required
                />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date *</label>
                  <input
                    type="text"
                    value={formData.expiryDate}
                    onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                    placeholder="MM/YY"
                    maxLength="5"
                    required
                  />
                </div>
                <div className="form-group">
                  <label>CVV *</label>
                  <input
                    type="text"
                    value={formData.cvv}
                    onChange={(e) => setFormData({ ...formData, cvv: e.target.value })}
                    placeholder="123"
                    maxLength="3"
                    required
                  />
                </div>
              </div>
            </>
          )}
          <div className="form-actions">
            <button type="submit">{editingId ? 'Update' : 'Add'} Payment Method</button>
            <button type="button" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="payments-list">
        {paymentMethods.length === 0 ? (
          <p className="empty-state">No payment methods added yet.</p>
        ) : (
          paymentMethods.map((payment) => (
            <div key={payment.id} className="payment-card">
              <div className="payment-info">
                <p><strong>{payment.type === 'card' ? 'Card' : 'PayPal'}</strong></p>
                {payment.type === 'card' && (
                  <>
                    <p>{maskCardNumber(payment.cardNumber)}</p>
                    <p>{payment.cardHolder}</p>
                    <p>Expires: {payment.expiryDate}</p>
                  </>
                )}
              </div>
              <div className="payment-actions">
                <button onClick={() => handleEdit(payment)}>Edit</button>
                <button onClick={() => onDelete(payment.id)} className="delete-btn">Delete</button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function SellerRegistration({ onRegister }) {
  const [agreed, setAgreed] = useState(false);

  const handleRegister = () => {
    if (agreed) {
      onRegister();
      alert('You are now registered as a seller!');
    }
  };

  return (
    <div className="settings-section">
      <h2>Become a Seller</h2>
      <div className="seller-registration">
        <p>Register as a seller to start listing and selling products on BMarket.</p>
        <ul>
          <li>List unlimited products</li>
          <li>Manage your inventory</li>
          <li>Track your sales</li>
          <li>Receive payments directly</li>
        </ul>
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
          />
          I agree to the seller terms and conditions
        </label>
        <button 
          className="register-seller-btn"
          onClick={handleRegister}
          disabled={!agreed}
        >
          Register as Seller
        </button>
      </div>
    </div>
  );
}

function RefundRequests() {
  const { refundRequests, submitRefundRequest } = useUser();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    orderId: '',
    reason: '',
    description: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    submitRefundRequest(formData);
    setFormData({ orderId: '', reason: '', description: '' });
    setShowForm(false);
    alert('Refund request submitted successfully!');
  };

  return (
    <div className="settings-section">
      <div className="section-header">
        <h2>Refund Requests</h2>
        <button className="add-btn" onClick={() => setShowForm(true)}>
          + Request Refund
        </button>
      </div>

      {showForm && (
        <form className="refund-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Order ID *</label>
            <input
              type="text"
              value={formData.orderId}
              onChange={(e) => setFormData({ ...formData, orderId: e.target.value })}
              required
            />
          </div>
          <div className="form-group">
            <label>Reason *</label>
            <select
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            >
              <option value="">Select a reason</option>
              <option value="defective">Defective Product</option>
              <option value="wrong">Wrong Item</option>
              <option value="damaged">Damaged in Shipping</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div className="form-group">
            <label>Description *</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              rows="4"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit">Submit Request</button>
            <button type="button" onClick={() => { setShowForm(false); setFormData({ orderId: '', reason: '', description: '' }); }}>Cancel</button>
          </div>
        </form>
      )}

      <div className="refunds-list">
        {refundRequests.length === 0 ? (
          <p className="empty-state">No refund requests yet.</p>
        ) : (
          refundRequests.map((request) => (
            <div key={request.id} className="refund-card">
              <div className="refund-info">
                <p><strong>Order ID:</strong> {request.orderId}</p>
                <p><strong>Reason:</strong> {request.reason}</p>
                <p><strong>Status:</strong> <span className={`status-${request.status.toLowerCase()}`}>{request.status}</span></p>
                <p><strong>Description:</strong> {request.description}</p>
                <p><strong>Submitted:</strong> {new Date(request.createdAt).toLocaleString()}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function DeleteAccountModal({ onClose, onConfirm, password, onPasswordChange, error }) {
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Delete Account</h2>
        <p>This action cannot be undone. Please enter your password to confirm.</p>
        <div className="form-group">
          <label>Password *</label>
          <input
            type="password"
            value={password}
            onChange={(e) => onPasswordChange(e.target.value)}
            placeholder="Enter your password"
          />
          {error && <span className="error-message">{error}</span>}
        </div>
        <div className="modal-actions">
          <button onClick={onConfirm} className="confirm-delete-btn">Delete Account</button>
          <button onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

