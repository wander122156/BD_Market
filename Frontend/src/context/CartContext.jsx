import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { fetchBasket, addToBasket } from '../api/basketApi';

const CartContext = createContext();

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState([]);
  const [basketId, setBasketId] = useState(null);
  const [orders, setOrders] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [cartError, setCartError] = useState(null);

  const loadBasket = useCallback(async () => {
    setCartLoading(true);
    setCartError(null);
    try {
      const data = await fetchBasket();
      if (!data) {
        setBasketId(null);
        setCartItems([]);
      } else {
        setBasketId(data.basketId);
        setCartItems(
          (data.items || []).map((i) => ({
            id: i.id,
            catalogItemId: i.catalogItemId,
            unitPrice: Number(i.unitPrice),
            quantity: i.quantity,
          }))
        );
      }
    } catch (e) {
      setCartError(e.message || 'Ошибка загрузки корзины');
      setCartItems([]);
      setBasketId(null);
    } finally {
      setCartLoading(false);
    }
  }, []);

  useEffect(() => {
    loadBasket();
  }, [loadBasket]);

  // Заказы по-прежнему в localStorage (эндпоинтов заказов пока нет)
  useEffect(() => {
    const saved = localStorage.getItem('orders');
    if (saved) setOrders(JSON.parse(saved));
  }, []);
  useEffect(() => {
    if (orders.length > 0) localStorage.setItem('orders', JSON.stringify(orders));
  }, [orders]);

  const addToCart = async (product) => {
    try {
      await addToBasket({
        catalogItemId: product.id,
        price: product.price,
        quantity: 1,
      });
      await loadBasket();
    } catch (e) {
      setCartError(e.message || 'Ошибка добавления в корзину');
    }
  };

  // Без SetQuantities: только локальное состояние. При следующем loadBasket
  // (например, при addToCart или перезаходе в корзину) данные с сервера перезапишут правки.
  const removeFromCart = (catalogItemId) => {
    setCartItems((prev) => prev.filter((i) => i.catalogItemId !== catalogItemId));
  };

  const updateQuantity = (catalogItemId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(catalogItemId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) =>
        i.catalogItemId === catalogItemId ? { ...i, quantity } : i
      )
    );
  };

  const clearCart = () => {
    setCartItems([]);
    setBasketId(null);
  };

  const getCartTotal = () =>
    cartItems.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  const getCartItemsCount = () => cartItems.reduce((s, i) => s + i.quantity, 0);

  const placeOrder = (orderDetails) => {
    const order = {
      id: Date.now(),
      items: cartItems,
      total: getCartTotal(),
      ...orderDetails,
      status: 'Processing',
      orderDate: new Date().toISOString(),
      estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
    };
    setOrders((prev) => {
      const next = [order, ...prev];
      localStorage.setItem('orders', JSON.stringify(next));
      return next;
    });
    clearCart();
    return order;
  };

  const value = {
    cartItems,
    cartLoading,
    cartError,
    refetchCart: loadBasket,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount,
    orders,
    placeOrder,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
