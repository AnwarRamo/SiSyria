
import axios from 'axios';
import { useAuthStore } from '../stores/auth.store';

const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8080/api/users',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});
console.log('ENV TEST:', process.env.REACT_APP_API_URL);

apiClient.interceptors.response.use(
  (response) => {
    // console.log('Response received:', response.status);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes('/auth/login') &&
      !originalRequest.url.includes('/auth/refresh') &&
      !originalRequest.url.includes('/auth/register')
    ) {
      console.log('[Interceptor] 401 Unauthorized. Attempting token refresh...');
      originalRequest._retry = true; 
      try {
       
        await apiClient.post('/auth/refresh'); 
        console.log('[Interceptor] Refresh successful. Retrying original request.');

       
        return apiClient(originalRequest);

      } catch (refreshError) {
        console.error('[Interceptor] Token refresh failed:', refreshError.response?.data || refreshError.message);

       
        if (!window.isLoggingOut) {
            window.isLoggingOut = true; 
            console.log('[Interceptor] Triggering logout due to refresh failure.');
            setTimeout(() => {
                useAuthStore.getState().logout().finally(() => {
                    window.isLoggingOut = false; 
                });
            }, 0);
        }
       
        return Promise.reject(refreshError);
      }
    }

    console.error('[AXIOS REQUEST ERROR] Error before sending:', error);

    return Promise.reject(error);
  }
);

export default apiClient;
