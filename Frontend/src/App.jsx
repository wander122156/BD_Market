import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { UserProvider } from './context/UserContext';
import { SearchProvider } from './context/SearchContext';
import { ProductProvider } from './context/ProductContext';
import Header from './components/Header';
import Home from './pages/Home';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import Orders from './pages/Orders';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import AdminProducts from './pages/AdminProducts';
import './App.css';

function App() {
  return (
    <UserProvider>
      <ProductProvider>
        <CartProvider>
          <SearchProvider>
            <Router>
              <div className="app">
                <Header />
                <main className="main-content">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/product/:id" element={<ProductDetails />} />
                    <Route path="/cart" element={<Cart />} />
                    <Route path="/checkout" element={<Checkout />} />
                    <Route path="/order-confirmation/:id" element={<OrderConfirmation />} />
                    <Route path="/orders" element={<Orders />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/profile" element={<Profile />} />
                    <Route path="/admin/products" element={<AdminProducts />} />
                  </Routes>
                </main>
              </div>
            </Router>
          </SearchProvider>
        </CartProvider>
      </ProductProvider>
    </UserProvider>
  );
}

export default App;
