const API_URL = 'http://localhost:5000/api';


const handleResponse = async (response) => {
  try {
    const data = await response.json();
    if (!response.ok) {
      console.error('API error:', response.status, data);
      throw new Error(data.message || `API error: ${response.status}`);
    }
    return data;
  } catch (error) {
    console.error('Error handling API response:', error);
    if (error.name === 'SyntaxError') {
      throw new Error('Invalid response from server');
    }
    throw error;
  }
};

const getAuthHeader = () => {
  const token = localStorage.getItem('userToken');
  return token ? { 'Authorization': `Bearer ${token}` } : {};
};


export const authAPI = {
  login: async (credentials) => {
    console.log('API call: login', credentials.email);
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(credentials)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Login API error:', error);
      throw error;
    }
  },

  register: async (userData) => {
    console.log('API call: register', userData.email);
    try {
      const headers = {
        'Content-Type': 'application/json',
        ...getAuthHeader()
      };

      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers,
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Register API error:', error);
      throw error;
    }
  },

  getProfile: async () => {
    console.log('API call: getProfile');
    try {
      const response = await fetch(`${API_URL}/auth/profile`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get profile API error:', error);
      throw error;
    }
  }
};


export const usersAPI = {
  getAll: async () => {
    console.log('API call: getAll users');
    try {
      const response = await fetch(`${API_URL}/users`, {
        headers: getAuthHeader()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Get all users API error:', error);
      throw error;
    }
  },

  getById: async (id) => {
    console.log('API call: getById', id);
    try {
      if (!id) {
        throw new Error('User ID is required');
      }
      
      console.log(`Making request to ${API_URL}/users/${id}`);
      const response = await fetch(`${API_URL}/users/${id}`, {
        headers: getAuthHeader()
      });
      
      if (!response.ok) {
        const statusText = response.statusText || 'Unknown error';
        console.error(`API error: ${response.status} ${statusText}`);
        
        try {
          const errorData = await response.json();
          throw new Error(errorData.message || `API error: ${response.status} ${statusText}`);
        } catch (jsonError) {
          throw new Error(`API error: ${response.status} ${statusText}`);
        }
      }
      
      const data = await response.json();
      console.log('User data received:', data);
      return data;
    } catch (error) {
      console.error('Get user by ID API error:', error);
      throw error;
    }
  },

  create: async (userData) => {
    console.log('API call: create user', userData.email);
    try {
      const response = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Create user API error:', error);
      throw error;
    }
  },

  update: async (id, userData) => {
    console.log('API call: update user', id);
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          ...getAuthHeader()
        },
        body: JSON.stringify(userData)
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Update user API error:', error);
      throw error;
    }
  },

  delete: async (id) => {
    console.log('API call: delete user', id);
    try {
      const response = await fetch(`${API_URL}/users/${id}`, {
        method: 'DELETE',
        headers: getAuthHeader()
      });
      return handleResponse(response);
    } catch (error) {
      console.error('Delete user API error:', error);
      throw error;
    }
  }
};

const api = {
  auth: authAPI,
  users: usersAPI
};

export default api; 