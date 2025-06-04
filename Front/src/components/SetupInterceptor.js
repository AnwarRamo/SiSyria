import { useEffect } from 'react';
import apiClient from '../api/config/axiosConfig';
import { useAuthStore } from '../api/stores/auth.store';

export const SetupInterceptor = () => {
  const logout = useAuthStore(state => state.logout);

  useEffect(() => {
    const interceptor = apiClient.interceptors.response.use(
      response => response,
      error => {
        if (error.response?.status === 401) {
          logout();
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    );

    return () => apiClient.interceptors.response.eject(interceptor);
  }, [logout]);

  return null;
};
  export default SetupInterceptor;
