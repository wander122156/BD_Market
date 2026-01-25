import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useUser } from '../context/UserContext';
import { useSearch } from '../context/SearchContext';
import '../styles/Header.css';

export default function Header() {
  const { getCartItemsCount } = useCart();
  const { isAuthenticated, logout } = useUser(); // Убрали user из деструктуризации
  const { searchQuery, setSearchQuery } = useSearch();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    if (window.location.pathname !== '/') {
      navigate('/');
    }
  };

  return (
    <header className="header">
      <div className="header-container">
        <div className="search-field-container">
          <div className="search-field-wrapper">
            <svg className="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="11" cy="11" r="8"></circle>
              <path d="m21 21-4.35-4.35"></path>
            </svg>
            <input
              type="text"
              className="header-search-input"
              placeholder="Search for products..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
        </div>
        
        <Link to="/" className="logo">
          <h1>BMarket</h1>
          <span className="logo-tagline">Same-Day Delivery</span>
        </Link>
        
        <nav className="nav">
          <Link to="/" className="nav-link">Home</Link>
          {isAuthenticated && <Link to="/orders" className="nav-link">My Orders</Link>}
        </nav>

        <div className="header-right">
          {isAuthenticated ? (
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          ) : (
            <Link to="/login" className="login-link">Sign In</Link>
          )}
          
          <Link to="/cart" className="cart-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <path d="M16 10a4 4 0 0 1-8 0"></path>
            </svg>
            {getCartItemsCount() > 0 && (
              <span className="cart-badge">{getCartItemsCount()}</span>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
}