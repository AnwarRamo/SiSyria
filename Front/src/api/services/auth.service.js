// src/api/services/auth.service.js
import apiClient from '../config/axiosConfig';

export const AuthService = {
  login: async (credentials) => {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'LOGIN_FAILED',
        message: error.message || 'Login failed',
      };
    }
  },

  register: async (userData) => {
    try {
      const response = await apiClient.post('/auth/register', userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'REGISTRATION_FAILED',
        message: 'Registration failed'
      };
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await apiClient.get('/auth/me');
      return response.data;
    } catch (error) {
      if (error.response?.status === 401) return null;
      throw error.response?.data || {
        code: 'FETCH_USER_FAILED',
        message: 'Failed to fetch current user'
      };
    }
  },

  logout: async () => {
    try {
      await apiClient.post('/auth/logout');
    } catch (error) {
      throw error.response?.data || {
        code: 'LOGOUT_FAILED',
        message: 'Logout failed'
      };
    }
  }
};