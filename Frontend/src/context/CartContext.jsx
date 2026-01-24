import { createContext, useContext, useState, useEffect } from 'react';

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
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Загрузка корзины с сервера при монтировании
    useEffect(() => {
        fetchCart();
    }, []);

    // Функция для загрузки корзины с сервера
    const fetchCart = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5064/api/basket');
            if (!response.ok) {
                throw new Error('Failed to fetch cart');
            }
            const basketData = await response.json();
            // Преобразуем данные API в формат, совместимый с нашим приложением
            const formattedItems = basketData.items.map(item => ({
                id: item.catalogItemId, // Используем catalogItemId как id товара
                catalogItemId: item.catalogItemId,
                name: item.productName || `Товар ${item.catalogItemId}`,
                price: item.unitPrice,
                quantity: item.quantity,
                pictureUri: item.pictureUri
            }));
            setCartItems(formattedItems);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Добавление товара в корзину через API
    const addToCart = async (product) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5064/api/basket/items', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    catalogItemId: product.id,
                    price: product.price,
                    quantity: 1
                })
            });

            if (!response.ok) {
                throw new Error('Failed to add item to cart');
            }

            // После успешного добавления обновляем корзину
            await fetchCart();
        } catch (err) {
            setError(err.message);
            console.error('Error adding to cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Временные заглушки для функций, которые пока не поддерживаются API
    const removeFromCart = async (productId) => {
        console.log('Remove from cart function is temporarily disabled');
        // TODO: Реализовать когда будет доступен API endpoint
        // await fetch(`http://localhost:5064/api/basket/items/${productId}`, {
        //   method: 'DELETE'
        // });
        // await fetchCart();
    };

    const updateQuantity = async (productId, quantity) => {
        console.log('Update quantity function is temporarily disabled');
        // TODO: Реализовать когда будет доступен API endpoint
        // if (quantity <= 0) {
        //   await removeFromCart(productId);
        //   return;
        // }
        // await fetch(`http://localhost:5064/api/basket/items/${productId}`, {
        //   method: 'PUT',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ quantity })
        // });
        // await fetchCart();
    };

    const clearCart = () => {
        console.log('Clear cart function is temporarily disabled');
        // TODO: Реализовать когда будет доступен API endpoint
        // await fetch('http://localhost:5064/api/basket', {
        //   method: 'DELETE'
        // });
        // setCartItems([]);
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
    };

    const getCartItemsCount = () => {
        return cartItems.reduce((count, item) => count + item.quantity, 0);
    };

    const placeOrder = (orderDetails) => {
        const order = {
            id: Date.now(),
            items: cartItems,
            total: getCartTotal(),
            ...orderDetails,
            status: 'Processing',
            orderDate: new Date().toISOString(),
            estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(), // 4 hours from now
        };
        setOrders((prevOrders) => {
            const updatedOrders = [order, ...prevOrders];
            localStorage.setItem('orders', JSON.stringify(updatedOrders));
            return updatedOrders;
        });
        clearCart();
        return order;
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
        orders,
        placeOrder,
        isLoading,
        error,
        refreshCart: fetchCart // Добавляем функцию для ручного обновления корзины
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};