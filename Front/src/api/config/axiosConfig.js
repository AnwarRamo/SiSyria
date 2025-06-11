import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/users',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach the token from localStorage
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);


apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Check for the specific conditions to refresh the token
    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/register')
    ) {
      originalRequest._retry = true;
      
      try {
        console.log('[Interceptor] 401 Unauthorized. Attempting token refresh...');

        // Call refresh and capture the new token from the response data
        const { data } = await apiClient.post('/auth/refresh');
        const newAccessToken = data.accessToken;

        // Store the new token for subsequent requests
        localStorage.setItem('accessToken', newAccessToken);

        // Update the authorization header of the original request
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;

        console.log('[Interceptor] Refresh successful. Retrying original request.');

        // Retry the original request with the new token
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('[Interceptor] Token refresh failed:', refreshError.response?.data || refreshError.message);

        // Use a global flag to prevent multiple logout triggers
        if (!window.isLoggingOut) {
            window.isLoggingOut = true;
            console.log('[Interceptor] Triggering logout due to refresh failure.');
            // Use setTimeout to allow the current promise chain to complete
            setTimeout(() => {
                useAuthStore.getState().logout().finally(() => {
                    // Reset the flag after logout is complete
                    window.isLoggingOut = false;
                });
            }, 0);
        }
        
        return Promise.reject(refreshError);
      }
    }

    // For any other errors, just reject the promise
    return Promise.reject(error);
  }
);

export default apiClient;