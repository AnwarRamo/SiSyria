import apiClient from '../config/axiosConfig';

export const UserService = {
  getProfile: async (username) => {
    try {
      const response = await apiClient.get(`/users/${username}`);
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
      const response = await apiClient.put('/me', data);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'UPDATE_ERROR',
        message: 'Profile update failed'
      };
    }
  },

  followUser: async (username) => {
    try {
      const response = await apiClient.put(`/follow/${username}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'FOLLOW_ERROR',
        message: 'Failed to follow user'
      };
    }
  },

  getPublicTrips: async () => {
    try {
      const response = await apiClient.get('/trips');
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'TRIPS_ERROR',
        message: 'Failed to load trips'
      };
    }
  },

  addUser: async (userData) => {
    try {
      const response = await apiClient.post('/admin/users', userData);
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
      console.log("Sending update for userId:", userId); 
      const response = await apiClient.put(`/admin/users/${userId}`, userData);
      return response.data;
    } catch (error) {
      console.error("Update error:", error);  
      throw error.response?.data || {
        code: 'UPDATE_USER_ERROR',
        message: 'Failed to update user'
      };
    }
  },
  

 
  getAllUsers: async (params = {}, signal) => {
    try {
      const response = await apiClient.get('/admin/users', { params, signal });
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
      const response = await apiClient.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'DELETE_USER_ERROR',
        message: 'Failed to delete user'
      };
    }
  }
};
