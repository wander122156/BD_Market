import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Orders.css';

export default function Orders() {
  const { orders } = useCart();

  const getStatusColor = (status) => {
    switch (status) {
      case 'Processing':
        return 'status-processing';
      case 'Shipped':
        return 'status-shipped';
      case 'Delivered':
        return 'status-delivered';
      default:
        return 'status-processing';
    }
  };

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="orders-container">
          <h1 className="orders-title">My Orders</h1>
          <div className="no-orders">
            <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"></path>
              <rect x="8" y="2" width="8" height="4" rx="1" ry="1"></rect>
            </svg>
            <h2>No orders yet</h2>
            <p>Start shopping to see your orders here!</p>
            <Link to="/" className="start-shopping-btn">Start Shopping</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <div className="orders-container">
        <h1 className="orders-title">My Orders</h1>
        
        <div className="orders-list">
          {orders.map((order) => {
            const orderDate = new Date(order.orderDate).toLocaleString();
            
            return (
              <div key={order.id} className="order-card">
                <div className="order-header">
                  <div className="order-info">
                    <h3>Order #{order.id}</h3>
                    <p className="order-date">Placed on {orderDate}</p>
                  </div>
                  <span className={`order-status ${getStatusColor(order.status)}`}>
                    {order.status}
                  </span>
                </div>

                <div className="order-items-preview">
                  {order.items.slice(0, 3).map((item) => (
                    <div key={item.id} className="order-item-preview">
                      <img src={"http://localhost:5064" + item.pictureUrl} alt={item.name} className="order-item-preview-image" />
                      <div className="order-item-preview-info">
                        <h4>{item.name}</h4>
                        <p>Qty: {item.quantity}</p>
                      </div>
                    </div>
                  ))}
                  {order.items.length > 3 && (
                    <p className="more-items">+{order.items.length - 3} more item(s)</p>
                  )}
                </div>

                <div className="order-footer">
                  <div className="order-delivery">
                  </div>
                  <div className="order-total">
                    <strong>Total: ${order.total.toFixed(2)}</strong>
                  </div>
                </div>

                <Link to={`/order-confirmation/${order.id}`} className="view-order-link">
                  View Details
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

