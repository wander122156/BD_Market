import { Link } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import '../styles/ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart, cartItems, removeFromCart, updateQuantity } = useCart();
  const discount = Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100);
  
  // Check if product is in cart (catalogItemId — id товара в каталоге)
  const cartItem = cartItems.find((item) => item.catalogItemId === product.id);
  const isInCart = !!cartItem;
  const quantityInCart = cartItem?.quantity || 0;

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
  };

  const handleRemoveFromCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    removeFromCart(product.id); // catalog item id
  };

  const handleIncreaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInCart) {
      updateQuantity(product.id, quantityInCart + 1); // catalog item id
    } else {
      addToCart(product);
    }
  };

  const handleDecreaseQuantity = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (quantityInCart > 1) {
      updateQuantity(product.id, quantityInCart - 1); // catalog item id
    } else {
      removeFromCart(product.id);
    }
  };

  return (
    <div className="product-card-wrapper">
      <Link to={`/product/${product.id}`} className="product-card">
        <div className="product-image-wrapper">
          <div className="product-image-container">
            <img 
              src={product.image} 
              alt={product.name} 
              className="product-image"
              loading="lazy"
              onError={(e) => {
                // Fallback if primary image fails
                const fallbackUrl = `https://via.placeholder.com/400x400/e5e7eb/9ca3af?text=${encodeURIComponent(product.name.substring(0, 20))}`;
                if (e.target.src !== fallbackUrl) {
                  e.target.src = fallbackUrl;
                }
              }}
            />
            {discount > 0 && <span className="discount-badge">-{discount}%</span>}
            {!product.inStock && <div className="out-of-stock">Out of Stock</div>}
          </div>
        </div>
        <div className="product-info">
          <h3 className="product-name">{product.name}</h3>
          <div className="product-rating">
            <span className="stars">{'★'.repeat(Math.floor(product.rating))}</span>
            <span className="rating-text">({product.reviews})</span>
          </div>
          <div className="product-price">
            <span className="current-price">${product.price.toFixed(2)}</span>
            {product.originalPrice > product.price && (
              <span className="original-price">${product.originalPrice.toFixed(2)}</span>
            )}
          </div>
          <div className="delivery-time">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            <span>Delivers in {product.deliveryTime}</span>
          </div>
        </div>
      </Link>
      
      <div className="cart-button-container">
        {isInCart ? (
          <div className="quantity-controls-card">
            <button 
              className="quantity-btn decrease"
              onClick={handleDecreaseQuantity}
              disabled={!product.inStock}
              title="Decrease quantity"
            >
              −
            </button>
            <div className="quantity-display">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 11l3 3L22 4"></path>
                <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"></path>
              </svg>
              <span className="quantity-text">In Cart</span>
              <span className="quantity-number">{quantityInCart}</span>
            </div>
            <button 
              className="quantity-btn increase"
              onClick={handleIncreaseQuantity}
              disabled={!product.inStock}
              title="Increase quantity"
            >
              +
            </button>
            <button 
              className="remove-btn-small"
              onClick={handleRemoveFromCart}
              title="Remove from cart"
            >
              ×
            </button>
          </div>
        ) : (
          <button 
            className="add-to-cart-btn"
            onClick={handleAddToCart}
            disabled={!product.inStock}
          >
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
}
