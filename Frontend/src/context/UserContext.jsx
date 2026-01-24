import { createContext, useContext, useState, useEffect } from 'react';

const UserContext = createContext();

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [refundRequests, setRefundRequests] = useState([]);

  // Load user data from localStorage on mount
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    const savedAddresses = localStorage.getItem('addresses');
    if (savedAddresses) {
      setAddresses(JSON.parse(savedAddresses));
    }
    const savedPayments = localStorage.getItem('paymentMethods');
    if (savedPayments) {
      setPaymentMethods(JSON.parse(savedPayments));
    }
    const savedReviews = localStorage.getItem('reviews');
    if (savedReviews) {
      setReviews(JSON.parse(savedReviews));
    }
    const savedRefunds = localStorage.getItem('refundRequests');
    if (savedRefunds) {
      setRefundRequests(JSON.parse(savedRefunds));
    }
  }, []);

  // Save to localStorage when data changes
  useEffect(() => {
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    } else {
      localStorage.removeItem('user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('addresses', JSON.stringify(addresses));
  }, [addresses]);

  useEffect(() => {
    localStorage.setItem('paymentMethods', JSON.stringify(paymentMethods));
  }, [paymentMethods]);

  useEffect(() => {
    localStorage.setItem('reviews', JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem('refundRequests', JSON.stringify(refundRequests));
  }, [refundRequests]);

  const register = (userData) => {
    // Check if email already exists
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    if (existingUsers.find(u => u.email === userData.email)) {
      throw new Error('Email already exists');
    }

    const newUser = {
      id: Date.now(),
      ...userData,
      isSeller: false,
      createdAt: new Date().toISOString()
    };

    existingUsers.push(newUser);
    localStorage.setItem('users', JSON.stringify(existingUsers));
    setUser(newUser);
    return newUser;
  };

  const login = (email, password) => {
    // Check for admin login
    if (email === 'admin@bmarket.com' && password === 'admin123') {
      const adminUser = {
        id: 'admin',
        name: 'Admin',
        email: 'admin@bmarket.com',
        isAdmin: true,
        isSeller: false,
        createdAt: new Date().toISOString()
      };
      setUser(adminUser);
      return adminUser;
    }

    // Regular user login
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const foundUser = existingUsers.find(u => u.email === email && u.password === password);
    
    if (!foundUser) {
      throw new Error('Invalid email or password');
    }

    setUser(foundUser);
    return foundUser;
  };

  const logout = () => {
    setUser(null);
  };

  const deleteAccount = (password) => {
    if (user.password !== password) {
      throw new Error('Incorrect password');
    }

    // Archive order data (for financial statements)
    const orders = JSON.parse(localStorage.getItem('orders') || '[]');
    const userOrders = orders.filter(o => o.userId === user.id);
    
    const archivedData = {
      userId: user.id,
      email: user.email,
      orders: userOrders,
      deletedAt: new Date().toISOString()
    };

    const archived = JSON.parse(localStorage.getItem('archivedUsers') || '[]');
    archived.push(archivedData);
    localStorage.setItem('archivedUsers', JSON.stringify(archived));

    // Remove user from active users
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.filter(u => u.id !== user.id);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    // Clear user data
    setUser(null);
    setAddresses([]);
    setPaymentMethods([]);
    localStorage.removeItem('addresses');
    localStorage.removeItem('paymentMethods');
  };

  const addAddress = (address) => {
    const newAddress = {
      id: Date.now(),
      ...address,
      userId: user.id
    };
    setAddresses([...addresses, newAddress]);
    return newAddress;
  };

  const updateAddress = (id, updatedAddress) => {
    setAddresses(addresses.map(addr => 
      addr.id === id ? { ...addr, ...updatedAddress } : addr
    ));
  };

  const deleteAddress = (id) => {
    setAddresses(addresses.filter(addr => addr.id !== id));
  };

  const addPaymentMethod = (payment) => {
    const newPayment = {
      id: Date.now(),
      ...payment,
      userId: user.id
    };
    setPaymentMethods([...paymentMethods, newPayment]);
    return newPayment;
  };

  const updatePaymentMethod = (id, updatedPayment) => {
    setPaymentMethods(paymentMethods.map(pm => 
      pm.id === id ? { ...pm, ...updatedPayment } : pm
    ));
  };

  const deletePaymentMethod = (id) => {
    setPaymentMethods(paymentMethods.filter(pm => pm.id !== id));
  };

  const registerAsSeller = () => {
    const updatedUser = { ...user, isSeller: true };
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = existingUsers.map(u => 
      u.id === user.id ? updatedUser : u
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUser(updatedUser);
  };

  const addReview = (review) => {
    const newReview = {
      id: Date.now(),
      ...review,
      userId: user.id,
      userName: user.name,
      createdAt: new Date().toISOString()
    };
    setReviews([...reviews, newReview]);
    return newReview;
  };

  const submitRefundRequest = (request) => {
    const newRequest = {
      id: Date.now(),
      ...request,
      userId: user.id,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    setRefundRequests([...refundRequests, newRequest]);
    return newRequest;
  };

  const value = {
    user,
    addresses,
    paymentMethods,
    reviews,
    refundRequests,
    register,
    login,
    logout,
    deleteAccount,
    addAddress,
    updateAddress,
    deleteAddress,
    addPaymentMethod,
    updatePaymentMethod,
    deletePaymentMethod,
    registerAsSeller,
    addReview,
    submitRefundRequest,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

