import apiClient from "../config/axiosConfig";
import { ENDPOINTS } from "../config/endpoints";

export const AuthService = {
  login: (credentials) => apiClient.post(ENDPOINTS.AUTH.LOGIN, credentials),
  register: async (userData) => {
    try {
      return await apiClient.post(ENDPOINTS.AUTH.REGISTER, userData);
    } catch (error) {
      console.log('Auth service register error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message,
        fullError: error
      });
      throw error;
    }
  },
  logout: () => apiClient.post(ENDPOINTS.AUTH.LOGOUT),
  getCurrentUser: async () => {
    try {
      return await apiClient.get(ENDPOINTS.AUTH.ME);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        // Not logged in, return null and do not log error
        return null;
      }
      // Log unexpected errors
      console.error('getCurrentUser error:', err);
      return null;
    }
  },
  refreshToken: () => apiClient.post(ENDPOINTS.AUTH.REFRESH),
};