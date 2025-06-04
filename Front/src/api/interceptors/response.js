export const responseInterceptor = (error) => {
  if (error.response?.status === 401) {
    useAuthStore.getState().logout();
    window.location.href = '/login';
  }
  return Promise.reject(error);
};