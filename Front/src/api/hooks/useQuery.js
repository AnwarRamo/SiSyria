import { useQuery } from '@tanstack/react-query';
import apiClient from '../config/axiosConfig';

export const useApiQuery = (queryKey, queryFn, options = {}) => {
  return useQuery({
    queryKey,
    queryFn: async () => {
      try {
        return await queryFn();
      } catch (error) {
        const message = error.response?.data?.message || error.message;
        const code = error.response?.data?.code || 'API_ERROR';
        throw new Error(`${code}: ${message}`);
      }
    },
    retry: (failureCount, error) => {
      if (error.message.startsWith('401:') || error.message.startsWith('403:')) {
        return false;
      }
      return failureCount < 2;
    },
    staleTime: 3 * 60 * 1000,
    ...options,
  });
};


export const useAdminQuery = (queryKey, queryFn, options = {}) => {
  return useApiQuery(queryKey, async () => {
    const response = await queryFn();
    if (!response.data?.isAdminContent) {
      throw new Error('403: Admin content required');
    }
    return response;
  }, {
    ...options,
    enabled: useAuthStore.getState().checkAdmin() && options.enabled,
  });
};