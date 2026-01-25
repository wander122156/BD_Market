import { createContext, useContext, useState, useEffect, useCallback } from 'react';

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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Регистрация через API
  const register = async (userData) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Registering user:', userData);
      
      const registrationData = {
        user: {
          userName: userData.name,
          email: userData.email,
          emailConfirmed: false,
          phoneNumber: "+ 7 017",
          phoneNumberConfirmed: false,
          twoFactorEnabled: false 
        }
      };

      const response = await fetch('http://localhost:5064/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registrationData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.log('Registration error response:', errorData);
        
        let errorMessage = 'Registration failed';
        if (errorData.errors) {
          errorMessage = Object.values(errorData.errors).flat().join(', ');
        } else if (errorData.message) {
          errorMessage = errorData.message;
        } else if (errorData.title) {
          errorMessage = errorData.title;
        }
        
        throw new Error(errorMessage);
      }

      const responseData = await response.json();
      console.log('Registration successful:', responseData);

      // После регистрации пробуем залогиниться
      try {
        await login(userData.name, userData.password);
        return responseData; // Исправлено: возвращаем responseData вместо newUser
      } catch (loginError) {
        console.log('Auto-login failed:', loginError);
        throw new Error('Registration successful! Please login with your credentials.');
      }
      
    } catch (err) {
      console.error('Registration error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Логин через API
  const login = async (username, password) => {
    setIsLoading(true);
    setError(null);
    try {
      console.log('Logging in:', username);
      
      const response = await fetch('http://localhost:5064/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          username: username,
          password: password
        })
      });

      const data = await response.json();
      console.log('Login response:', data);
      
      if (!response.ok || !data.result || !data.token) {
        let errorMessage = data.message || 'Login failed';
        
        if (data.isLockedOut) {
          errorMessage = 'Account is locked out';
        } else if (data.isNotAllowed) {
          errorMessage = 'Login is not allowed';
        } else if (data.requiresTwoFactor) {
          errorMessage = 'Two-factor authentication required';
        }
        
        throw new Error(errorMessage);
      }

      // Создаем объект пользователя
      const userInfo = {
        username: data.username,
        token: data.token,
        isAuthenticated: data.userInfo?.isAuthenticated || false,
        claims: data.userInfo?.claims || [],
        requiresTwoFactor: data.requiresTwoFactor || false
      };

      localStorage.setItem('authToken', data.token);

      // Сохраняем только в состоянии React, не в localStorage
      setUser(userInfo);
      
      console.log('Login successful:', userInfo);
      return userInfo;
      
    } catch (err) {
      console.error('Login error:', err);
      setError(err.message);
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getUserToken = () => {
    return localStorage.getItem('authToken');
  };

  // Логаут
  const logout = useCallback(() => {
    setUser(null);
    setError(null);
  }, []);

  const value = {
    user,
    isLoading,
    error,
    isAuthenticated: !!localStorage.getItem('authToken'),
    register,
    login,
    logout,
    getUserToken,
    
    // Заглушки для совместимости
    addresses: [],
    paymentMethods: [],
    reviews: [],
    refundRequests: [],
    deleteAccount: () => { throw new Error('Not implemented via API yet'); },
    addAddress: () => { throw new Error('Not implemented via API yet'); },
    updateAddress: () => { throw new Error('Not implemented via API yet'); },
    deleteAddress: () => { throw new Error('Not implemented via API yet'); },
    addPaymentMethod: () => { throw new Error('Not implemented via API yet'); },
    updatePaymentMethod: () => { throw new Error('Not implemented via API yet'); },
    deletePaymentMethod: () => { throw new Error('Not implemented via API yet'); },
    registerAsSeller: () => { throw new Error('Not implemented via API yet'); },
    addReview: () => { throw new Error('Not implemented via API yet'); },
    submitRefundRequest: () => { throw new Error('Not implemented via API yet'); },
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};