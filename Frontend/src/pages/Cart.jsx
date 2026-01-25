import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/Cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, isLoading, error } = useCart();
  const navigate = useNavigate();

  // Показываем загрузку
  if (isLoading && cartItems.length === 0) {
    return (
        <div className="cart">
          <div className="cart-container">
            <div className="empty-cart">
              <p>Loading cart...</p>
            </div>
          </div>
        </div>
    );
  }

  // Показываем ошибку
  if (error) {
    return (
        <div className="cart">
          <div className="cart-container">
            <div className="empty-cart">
              <p style={{ color: 'red' }}>Error: {error}</p>
            </div>
          </div>
        </div>
    );
  }

  if (cartItems.length === 0) {
    return (
        <div className="cart">
          <div className="cart-container">
            <div className="empty-cart">
              <svg width="80" height="80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"></circle>
                <circle cx="20" cy="21" r="1"></circle>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path>
              </svg>
              <h2>Your cart is empty</h2>
              <p>Add some products to get started!</p>
              <Link to="/" className="continue-shopping-btn">Continue Shopping</Link>
            </div>
          </div>
        </div>
    );
  }

  return (
      <div className="cart">
        <div className="cart-container">
          <h1 className="cart-title">Shopping Cart</h1>

          <div className="cart-content">
            <div className="cart-items">
              {cartItems.map((item) => (
                  <div key={item.basketItemId} className="cart-item">
                    {/* Изменено: item.image → item.pictureUrl */}
                    <img
                        src={item.pictureUrl || '/placeholder.jpg'}
                        alt={item.name}
                        className="cart-item-image"
                    />
                    <div className="cart-item-info">
                      <h3>{item.name}</h3>
                      <p className="cart-item-price">${item.price.toFixed(2)}</p>
                      {/* Убрано deliveryTime - его нет в API */}
                    </div>
                    <div className="cart-item-controls">
                      <div className="quantity-controls">
                        <button
                            onClick={() => updateQuantity(item.basketItemId, item.quantity - 1)}
                            className="quantity-btn"
                            disabled={isLoading}
                        >
                          -
                        </button>
                        <span className="quantity">{item.quantity}</span>
                        <button
                            onClick={() => updateQuantity(item.basketItemId, item.quantity + 1)}
                            className="quantity-btn"
                            disabled={isLoading}
                        >
                          +
                        </button>
                      </div>
                      <button
                          onClick={() => removeFromCart(item.basketItemId)}
                          className="remove-btn"
                          disabled={isLoading}
                      >
                        {isLoading ? 'Removing...' : 'Remove'}
                      </button>
                    </div>
                    <div className="cart-item-total">
                      ${(item.price * item.quantity).toFixed(2)}
                    </div>
                  </div>
              ))}
            </div>

            <div className="cart-summary">
              <h2>Order Summary</h2>
              <div className="summary-row">
                <span>Subtotal ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} items)</span>
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
              <button
                  className="checkout-btn"
                  onClick={() => navigate('/checkout')}
                  disabled={isLoading}
              >
                {isLoading ? 'Processing...' : 'Proceed to Checkout'}
              </button>
              <Link to="/" className="continue-shopping-link">Continue Shopping</Link>

              {/* Опционально: кнопка очистки корзины */}
              {cartItems.length > 0 && (
                  <button
                      onClick={clearCart}
                      className="clear-cart-btn"
                      disabled={isLoading}
                      style={{ marginTop: '10px', width: '100%' }}
                  >
                    Clear Cart
                  </button>
              )}
            </div>
          </div>
        </div>
      </div>
  );
}
