import { useState, useEffect, useCallback } from 'react';
import { usersAPI } from '../services/api';

function useUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getAll();
      
      if (!Array.isArray(data)) {
        console.error('Expected array of users but got:', data);
        setUsers([]);
        throw new Error('Invalid data format received from server');
      }
      
      setUsers(data);
      setError('');
      return data;
    } catch (error) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Failed to fetch users');
      setUsers([]);
      throw error;
    } finally {
      setLoading(false);
    }
  }, []);

 
  const fetchUserById = async (userId) => {
    setLoading(true);
    try {
      if (!userId) {
        throw new Error('User ID is required');
      }
      
      console.log(`Fetching user with ID: ${userId}`);
      const userData = await usersAPI.getById(userId);
      
      if (!userData || !userData._id) {
        throw new Error('Invalid user data received from server');
      }
      
      console.log('User data successfully fetched:', userData);
      setError('');
      return userData;
    } catch (error) {
      console.error('Error fetching user by ID:', error);
      setError(error.message || 'Failed to fetch user');
      throw error;
    } finally {
      setLoading(false);
    }
  };

 
  useEffect(() => {
    fetchUsers().catch(err => {
      console.error('Initial fetch failed:', err);
    });
  }, [fetchUsers]);

  const updateUser = async (userId, userData) => {
    setLoading(true);
    try {
      await usersAPI.update(userId, userData);
      setSuccess('User updated successfully');
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error updating user:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      await usersAPI.delete(userId);
      setSuccess('User deleted successfully');
      await fetchUsers();
      return true;
    } catch (error) {
      console.error('Error deleting user:', error);
      setError(error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const clearMessages = () => {
    setError('');
    setSuccess('');
  };

  return {
    users,
    loading,
    error,
    success,
    fetchUsers,
    fetchUserById,
    updateUser,
    deleteUser,
    clearMessages
  };
}

export default useUsers; 