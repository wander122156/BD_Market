import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useProducts } from '../context/ProductContext';
import '../styles/Cart.css';

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, getCartTotal, clearCart, cartLoading, cartError } = useCart();
  const { getProductById } = useProducts();
  const navigate = useNavigate();

  if (cartLoading && cartItems.length === 0) {
    return (
      <div className="cart">
        <div className="cart-container">
          <div className="empty-cart">
            <p>Загрузка корзины...</p>
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
            <h2>Корзина пуста</h2>
            <p>Добавьте товары, чтобы продолжить.</p>
            {cartError && <p className="cart-error">{cartError}</p>}
            <Link to="/" className="continue-shopping-btn">Продолжить покупки</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="cart">
      <div className="cart-container">
        <h1 className="cart-title">Корзина</h1>
        {cartError && <p className="cart-error">{cartError}</p>}
        <div className="cart-content">
          <div className="cart-items">
            {cartItems.map((item) => {
              const product = getProductById(item.catalogItemId);
              return (
                <div key={item.id} className="cart-item">
                  <img src={product?.image} alt={product?.name || 'Товар'} className="cart-item-image" />
                  <div className="cart-item-info">
                    <h3>{product?.name || `Товар #${item.catalogItemId}`}</h3>
                    <p className="cart-item-price">${item.unitPrice.toFixed(2)}</p>
                    <div className="cart-item-delivery">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"></circle>
                        <polyline points="12 6 12 12 16 14"></polyline>
                      </svg>
                      <span>Доставка: {product?.deliveryTime || '2–4 ч'}</span>
                    </div>
                  </div>
                  <div className="cart-item-controls">
                    <div className="quantity-controls">
                      <button 
                        onClick={() => updateQuantity(item.catalogItemId, item.quantity - 1)}
                        className="quantity-btn"
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.catalogItemId, item.quantity + 1)}
                        className="quantity-btn"
                      >
                        +
                      </button>
                    </div>
                    <button 
                      onClick={() => removeFromCart(item.catalogItemId)}
                      className="remove-btn"
                    >
                      Удалить
                    </button>
                  </div>
                  <div className="cart-item-total">
                    ${(item.unitPrice * item.quantity).toFixed(2)}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="cart-summary">
            <h2>Итого</h2>
            <div className="summary-row">
              <span>Подытог ({cartItems.reduce((sum, item) => sum + item.quantity, 0)} шт.)</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Доставка</span>
              <span className="free">Бесплатно</span>
            </div>
            <div className="summary-row total">
              <span>Итого</span>
              <span>${getCartTotal().toFixed(2)}</span>
            </div>
            <button 
              className="checkout-btn"
              onClick={() => navigate('/checkout')}
            >
              Оформить заказ
            </button>
            <Link to="/" className="continue-shopping-link">Продолжить покупки</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

