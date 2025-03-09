import React, { createContext, useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';


const AuthContext = createContext();


export const useAuthContext = () => {
  return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();


  const checkAuthStatus = useCallback(async () => {
    console.log('Checking authentication status...');
    const token = localStorage.getItem('userToken');
    
    if (token) {
      try {
        console.log('Token found, fetching user profile...');
        const userData = await authAPI.getProfile();
        console.log('User profile fetched:', userData);
        setCurrentUser(userData);
        setIsAuthenticated(true);
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('userToken');
        setIsAuthenticated(false);
        setCurrentUser(null);
      }
    } else {
      console.log('No token found, user is not authenticated');
      setIsAuthenticated(false);
      setCurrentUser(null);
    }
    
    setLoading(false);
  }, []);

  useEffect(() => {
    checkAuthStatus();
   
    const handleStorageChange = () => {
      console.log('Storage changed, rechecking auth status');
      checkAuthStatus();
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [checkAuthStatus]);

  const login = async (email, password) => {
    setError('');
    console.log('Attempting login for:', email);
    try {
      const data = await authAPI.login({ email, password });
      console.log('Login successful, token received');
      localStorage.setItem('userToken', data.token);
      setIsAuthenticated(true);
      
      console.log('Fetching user profile after login');
      const userData = await authAPI.getProfile();
      console.log('User profile fetched:', userData);
      setCurrentUser(userData);
      
      return { success: true };
    } catch (error) {
      console.error('Login failed:', error);
      setError(error.message);
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    setError('');
    console.log('Attempting registration for:', userData.email);
    try {
      const data = await authAPI.register(userData);
      console.log('Registration successful');
      
      
      if (!isAuthenticated) {
        console.log('Setting token and fetching user profile');
        localStorage.setItem('userToken', data.token);
        setIsAuthenticated(true);
        
 
        const userProfile = await authAPI.getProfile();
        console.log('User profile fetched:', userProfile);
        setCurrentUser(userProfile);
      }
      
      return { success: true };
    } catch (error) {
      console.error('Registration failed:', error);
      setError(error.message);
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    console.log('Logging out user');
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  };

  const value = {
    currentUser,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    logout,
    checkAuthStatus
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext; 