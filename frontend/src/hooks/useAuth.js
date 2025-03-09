import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function useAuth() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
    
    
    window.addEventListener('storage', checkAuthStatus);
    
    return () => {
      window.removeEventListener('storage', checkAuthStatus);
    };
  }, []);

  const checkAuthStatus = () => {
    const token = localStorage.getItem('userToken');
    setIsAuthenticated(!!token);
    setLoading(false);
  };

  const fetchCurrentUser = async () => {
    try {
      const token = localStorage.getItem('userToken');
      if (!token) {
        logout();
        return null;
      }

      const response = await fetch('http://localhost:5000/api/auth/profile', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch user profile');
      }
      
      const userData = await response.json();
      setCurrentUser(userData);
      return userData;
    } catch (error) {
      console.error('Error fetching current user:', error);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      localStorage.setItem('userToken', data.token);
      setIsAuthenticated(true);
      await fetchCurrentUser();
      return { success: true, message: 'Login successful!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const register = async (userData) => {
    try {
      const token = localStorage.getItem('userToken');
      const headers = {
        'Content-Type': 'application/json',
        ...(token && { 'Authorization': `Bearer ${token}` })
      };

      const response = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers,
        body: JSON.stringify(userData)
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

   
      if (!token) {
        localStorage.setItem('userToken', data.token);
        setIsAuthenticated(true);
      }

      return { success: true, message: 'Registration successful!' };
    } catch (error) {
      return { success: false, message: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('userToken');
    setIsAuthenticated(false);
    setCurrentUser(null);
    navigate('/');
  };

  return {
    isAuthenticated,
    currentUser,
    loading,
    login,
    register,
    logout,
    fetchCurrentUser
  };
}

export default useAuth; 