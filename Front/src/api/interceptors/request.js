export const requestInterceptor = (config) => {
  try {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (error) {
    console.error('Error accessing localStorage:', error);
  }

  return config;
};
