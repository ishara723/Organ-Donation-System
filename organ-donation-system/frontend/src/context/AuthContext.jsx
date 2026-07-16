import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check if user is logged in on mount
  useEffect(() => {
    const initAuth = () => {
      const token = authService.getToken();
      const currentUser = authService.getCurrentUser();

      if (token && currentUser) {
        // Simple client-side expiration check (expiration is in ms)
        // Check if token has expired (expiresIn is stored as timestamp or duration)
        setUser(currentUser);
      } else {
        authService.logout();
      }
      setLoading(false);
    };

    initAuth();

    // Listen for global logout events (from API interceptor)
    const handleLogoutEvent = () => {
      setUser(null);
    };
    window.addEventListener('auth-logout', handleLogoutEvent);

    return () => {
      window.removeEventListener('auth-logout', handleLogoutEvent);
    };
  }, []);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const data = await authService.login(email, password);
      // Expected response structure: { token, email, role, userId, type, expiresIn }
      localStorage.setItem('lifelink_token', data.token);
      
      const userData = {
        userId: data.userId,
        email: data.email,
        role: data.role,
      };
      localStorage.setItem('lifelink_user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    } catch (error) {
      authService.logout();
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, role) => {
    setLoading(true);
    try {
      const data = await authService.register(email, password, role);
      // Usually registration might auto-login or return user details.
      // If the backend returns token on register, set it:
      if (data.token) {
        localStorage.setItem('lifelink_token', data.token);
        const userData = {
          userId: data.userId,
          email: data.email,
          role: data.role,
        };
        localStorage.setItem('lifelink_user', JSON.stringify(userData));
        setUser(userData);
        return userData;
      }
      return data;
    } catch (error) {
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
