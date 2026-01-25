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
    const [basketId, setBasketId] = useState(null); // Храним ID корзины
    const [buyerId, setBuyerId] = useState(null);
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
                if (response.status === 404) {
                    // Корзина не найдена - создастся при первом добавлении
                    setCartItems([]);
                    return;
                }
                throw new Error('Failed to fetch cart');
            }
            const data = await response.json();

            // Сохраняем данные корзины
            setBasketId(data.basketId);
            setBuyerId(data.buyerId);

            // ВАЖНО: используем item.id (basketItemId), не catalogItemId!
            const formattedItems = data.items.map(item => ({
                basketItemId: item.id, // ID записи в корзине для удаления/обновления
                catalogItemId: item.catalogItemId, // ID товара из каталога
                name: item.productName,
                price: item.unitPrice,
                quantity: item.quantity,
                pictureUrl: item.pictureUrl // Теперь это полный URL!
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

    // Удаление товара из корзины
    const removeFromCart = async (basketItemId) => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5064/api/basket/items/${basketItemId}`, {
                method: 'DELETE'
            });

            if (!response.ok) {
                throw new Error('Failed to remove item from cart');
            }

            // Обновляем корзину после удаления
            await fetchCart();
        } catch (err) {
            setError(err.message);
            console.error('Error removing from cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Обновление количества товара
    const updateQuantity = async (basketItemId, newQuantity) => {
        // Если количество 0 или меньше - удаляем товар
        if (newQuantity <= 0) {
            await removeFromCart(basketItemId);
            return;
        }

        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch(`http://localhost:5064/api/basket/items/${basketItemId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ quantity: newQuantity })
            });

            if (!response.ok) {
                throw new Error('Failed to update quantity');
            }

            // Обновляем корзину после изменения
            await fetchCart();
        } catch (err) {
            setError(err.message);
            console.error('Error updating quantity:', err);
        } finally {
            setIsLoading(false);
        }
    };

    // Очистка корзины (удаление всех товаров по одному)
    const clearCart = async () => {
        setIsLoading(true);
        setError(null);
        try {
            // Удаляем все товары по одному
            for (const item of cartItems) {
                await fetch(`http://localhost:5064/api/basket/items/${item.basketItemId}`, {
                    method: 'DELETE'
                });
            }
            setCartItems([]);
        } catch (err) {
            setError(err.message);
            console.error('Error clearing cart:', err);
        } finally {
            setIsLoading(false);
        }
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
            estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
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
        basketId,
        buyerId,
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
        refreshCart: fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
