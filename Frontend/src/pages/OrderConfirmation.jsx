import { useParams, useNavigate, Link } from 'react-router-dom';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '../context/CartContext';
import '../styles/OrderConfirmation.css';

export default function OrderConfirmation() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getOrderById, isLoading } = useCart();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);
  
  const hasLoadedRef = useRef(false);

  useEffect(() => {
    if (hasLoadedRef.current || !id) {
      return;
    }
    
    console.log('Загрузка заказа с ID:', id);
    
    const loadOrder = async () => {
      try {
        hasLoadedRef.current = true;
        console.log('Начинаем загрузку заказа...');
        const orderData = await getOrderById(id);
        console.log('Заказ получен:', orderData);
        setOrder(orderData);
      } catch (err) {
        console.error('Ошибка загрузки заказа:', err);
        setError(err.message);
      }
    };

    loadOrder();
    
    return () => {
      console.log('Очистка useEffect');
      hasLoadedRef.current = false;
    };
  }, [id, getOrderById]);

  if (isLoading) {
    return (
      <div className="order-confirmation">
        <div className="loading">
          <h2>Loading order details...</h2>
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="order-confirmation">
        <div className="not-found">
          <h2>Order not found</h2>
          <p>{error}</p>
          <Link to="/">Go to Home</Link>
        </div>
      </div>
    );
  }

  const orderDate = new Date(order.orderDate).toLocaleString();

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
          <p className="order-date">Order Date: {orderDate}</p>
        </div>

        <div className="confirmation-details">
          <div className="detail-card">
            <h3>Delivery Information</h3>
            {order.shippingAddress ? (
              <>
                <p><strong>Address:</strong> {order.shippingAddress.street}</p>
                <p><strong>City:</strong> {order.shippingAddress.city}</p>
                {order.shippingAddress.state && (
                  <p><strong>State:</strong> {order.shippingAddress.state}</p>
                )}
                <p><strong>Country:</strong> {order.shippingAddress.country}</p>
                <p><strong>ZIP Code:</strong> {order.shippingAddress.zipCode}</p>
              </>
            ) : (
              <>
                {order.address && <p><strong>Address:</strong> {order.address}</p>}
                {order.city && <p><strong>City:</strong> {order.city}</p>}
                {order.state && <p><strong>State:</strong> {order.state}</p>}
                {order.country && <p><strong>Country:</strong> {order.country}</p>}
                {order.zipCode && <p><strong>ZIP Code:</strong> {order.zipCode}</p>}
              </>
            )}
          </div>

          <div className="detail-card">
            <h3>Order Items</h3>
            <div className="confirmation-items">
              {order.items && order.items.length > 0 ? (
                order.items.map((item) => (
                  <div key={item.id || item.catalogItemId} className="confirmation-item">
                    <img 
                      src={"http://localhost:5064" + (item.pictureUrl || item.image || '')} 
                      alt={item.name || item.productName} 
                      className="confirmation-item-image" 
                    />
                    <div className="confirmation-item-info">
                      <h4>{item.name || item.productName}</h4>
                      <p>Quantity: {item.quantity || item.units} × ${(item.price || item.unitPrice).toFixed(2)}</p>
                    </div>
                    <span className="confirmation-item-price">
                      ${((item.quantity || item.units) * (item.price || item.unitPrice)).toFixed(2)}
                    </span>
                  </div>
                ))
              ) : (
                <p>No items in this order</p>
              )}
            </div>
            <div className="confirmation-total">
              <div className="total-row">
                <span>Subtotal:</span>
                <span>${order.total?.toFixed(2)}</span>
              </div>
              <div className="total-row">
                <span>Delivery:</span>
                <span className="free">FREE</span>
              </div>
              <div className="total-row grand-total">
                <span>Total:</span>
                <span>${order.total?.toFixed(2)}</span>
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