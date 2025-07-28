import apiClient from '../config/axiosConfig';
import { ENDPOINTS } from '../config/endpoints';

export const UserService = {
  getProfile: async (username) => {
    try {
      const response = await apiClient.get(ENDPOINTS.USERS.BY_ID(username));
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'PROFILE_ERROR',
        message: 'Failed to load profile'
      };
    }
  },

  updateProfile: async (data) => {
    try {
      const response = await apiClient.put(ENDPOINTS.AUTH.ME, data);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'UPDATE_ERROR',
        message: 'Profile update failed'
      };
    }
  },

  updatePersonalInfo: async (personalData) => {
    try {
      const response = await apiClient.put(ENDPOINTS.AUTH.ME, personalData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'UPDATE_PERSONAL_INFO_ERROR',
        message: 'Personal information update failed'
      };
    }
  },

  followUser: async (username) => {
    try {
      const response = await apiClient.put(ENDPOINTS.USERS.FOLLOW(username));
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'FOLLOW_ERROR',
        message: 'Failed to follow user'
      };
    }
  },

  // Admin user management
  addUser: async (userData) => {
    try {
      const response = await apiClient.post(`${ENDPOINTS.ADMIN.BASE}/users`, userData);
      return response.data.user;
    } catch (error) {
      throw error.response?.data || {
        code: 'ADD_USER_ERROR',
        message: 'Failed to add user'
      };
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.put(`${ENDPOINTS.ADMIN.BASE}/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'UPDATE_USER_ERROR',
        message: 'Failed to update user'
      };
    }
  },

  getAllUsers: async (params = {}, signal) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ADMIN.BASE}/users`, { params, signal });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'GET_USERS_ERROR',
        message: 'Failed to fetch users'
      };
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.ADMIN.BASE}/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'DELETE_USER_ERROR',
        message: 'Failed to delete user'
      };
    }
  }
};
