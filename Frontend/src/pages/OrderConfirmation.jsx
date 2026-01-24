import { useParams, useNavigate, Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { orders } = useCart();
  const order = orders.find((o) => o.id === parseInt(id));

  if (!order) {
    return (
      <div className="order-confirmation">
        <div className="not-found">
          <h2>Order not found</h2>
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    );
  }

  const deliveryDate = new Date(order.estimatedDelivery).toLocaleString();

  return (
    <div className="order-confirmation">
      <div className="confirmation-container">
        <div className="confirmation-success">
          <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
            <polyline points="22 4 12 14.01 9 11.01"></polyline>
          </svg>
          <h1>Order Placed Successfully!</h1>
          <p className="order-id">Order ID: #{order.id}</p>
        </div>

        <div className="confirmation-details">
          <div className="detail-card">
            <h3>Delivery Information</h3>
            <p><strong>Name:</strong> {order.name}</p>
            <p><strong>Address:</strong> {order.address}</p>
            <p><strong>City:</strong> {order.city}, {order.zipCode}</p>
            <p><strong>Phone:</strong> {order.phone}</p>
            <p><strong>Estimated Delivery:</strong> {deliveryDate}</p>
          </div>

          <div className="detail-card">
            <h3>Order Items</h3>
            <div className="confirmation-items">
              {order.items.map((item) => (
                <div key={item.id} className="confirmation-item">
                  <img src={item.image} alt={item.name} className="confirmation-item-image" />
                  <div className="confirmation-item-info">
                    <h4>{item.name}</h4>
                    <p>Quantity: {item.quantity} × ${item.price.toFixed(2)}</p>
                  </div>
                  <span className="confirmation-item-price">
                    ${(item.price * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>
            <div className="confirmation-total">
              <div className="total-row">
                <span>Total:</span>
                <span>${order.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

          <div className="confirmation-actions">
            <Link to="/orders" className="view-orders-btn">View All Orders</Link>
            <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

