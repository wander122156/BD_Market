import { createContext, useContext, useState, useCallback, useEffect, useRef } from 'react';

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
    const [buyerId, setBuyerId] = useState(null);
    const [orders, setOrders] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const isFetchingRef = useRef(false); 

    useEffect(() => {
        fetchCart();
        fetchOrders();
    }, []);

    const getOrderById = useCallback(async (orderId) => {
        if (isFetchingRef.current) {
            return;
        }
        
        setIsLoading(true);
        setError(null);
        isFetchingRef.current = true;
        
        try {
            const response = await fetch(`http://localhost:5064/api/orders/${orderId}`);
            
            if (!response.ok) {
                if (response.status === 404) {
                    throw new Error('Order not found');
                }
                throw new Error('Failed to fetch order');
            }
            
            const responseData = await response.json();
            const orderData = responseData.order;
            
            if (!orderData) {
                throw new Error('Invalid order data format');
            }
            
            return {
                id: orderData.id,
                buyerId: orderData.buyerId,
                orderDate: orderData.orderDate,
                total: orderData.total,
                shippingAddress: orderData.shipToAddress,
                items: orderData.items?.map(item => ({
                    id: item.id,
                    catalogItemId: item.catalogItemId,
                    name: item.productName,
                    unitPrice: item.unitPrice,
                    quantity: item.units,
                    pictureUrl: item.pictureUrl
                })) || [],
                status: 'Processing'
            };
            
        } catch (err) {
            setError(err.message);
            throw err;
        } finally {
            setIsLoading(false);
            isFetchingRef.current = false;
        }
    }, []);

    const fetchOrders = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5064/api/orders');
            
            if (!response.ok) {
                if (response.status === 404) {
                    setOrders([]);
                    return;
                }
                throw new Error('Failed to fetch orders');
            }
            
            const data = await response.json();
            
            const ordersArray = data.orders || [];
            
            const formattedOrders = ordersArray.map(order => ({
                id: order.id,
                buyerId: order.buyerId,
                orderDate: order.orderDate,
                total: order.total,
                shippingAddress: order.shipToAddress || {
                    street: order.street || '',
                    city: order.city || '',
                    state: order.state || '',
                    country: order.country || '',
                    zipCode: order.zipCode || ''
                },
                items: order.items?.map(item => ({
                    id: item.id,
                    catalogItemId: item.catalogItemId,
                    name: item.productName,
                    unitPrice: item.unitPrice,
                    quantity: item.units || item.quantity || 1,
                    pictureUrl: item.pictureUrl
                })) || [],
                status: 'Processing'
            }));

            setOrders(formattedOrders);
            
        } catch (err) {
            setError(err.message);
            console.error('Error fetching orders:', err);
            setOrders([]);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCart = async () => {
        setIsLoading(true);
        setError(null);
        try {
            const response = await fetch('http://localhost:5064/api/basket');
            if (!response.ok) {
                if (response.status === 404) {
                    setCartItems([]);
                    return;
                }
                throw new Error('Failed to fetch cart');
            }
            const data = await response.json();

            setBasketId(data.basketId);
            setBuyerId(data.buyerId);

            const formattedItems = data.items.map(item => ({
                basketItemId: item.id,
                catalogItemId: item.catalogItemId,
                name: item.productName,
                price: item.unitPrice,
                quantity: item.quantity,
                pictureUrl: item.pictureUrl
            }));

            setCartItems(formattedItems);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

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

            await fetchCart();
        } catch (err) {
            setError(err.message);
            console.error('Error adding to cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

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

            await fetchCart();
        } catch (err) {
            setError(err.message);
            console.error('Error removing from cart:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const updateQuantity = async (basketItemId, newQuantity) => {
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

            await fetchCart();
        } catch (err) {
            setError(err.message);
            console.error('Error updating quantity:', err);
        } finally {
            setIsLoading(false);
        }
    };

    const clearCart = async () => {
        setIsLoading(true);
        setError(null);
        try {
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

    const placeOrder = async (orderDetails) => {
        setIsLoading(true);
        setError(null);
        try {
            const orderRequest = {
                street: orderDetails.address,
                city: orderDetails.city,
                state: orderDetails.state || '',
                country: orderDetails.country,
                zipCode: orderDetails.zipCode
            };

            const response = await fetch('http://localhost:5064/api/orders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderRequest)
            });

            if (!response.ok) {
                throw new Error('Failed to place order');
            }

            const orderData = await response.json();
            
            const order = {
                id: orderData.id || Date.now(),
                items: cartItems,
                total: getCartTotal(),
                ...orderDetails,
                status: 'Processing',
                orderDate: new Date().toISOString(),
                estimatedDelivery: new Date(Date.now() + 4 * 60 * 60 * 1000).toISOString(),
            };

            setOrders((prevOrders) => [order, ...prevOrders]);
            
            await clearCart();
            
            return order;
            
        } catch (err) {
            setError(err.message);
            console.error('Error placing order:', err);
            throw err;
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
        getOrderById,
        refreshCart: fetchCart
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};