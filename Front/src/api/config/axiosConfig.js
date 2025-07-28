import axios from 'axios';

// Ensure the base URL doesn't end with a slash and doesn't include /api/users
let baseURL = (process.env.REACT_APP_API_URL || 'https://sisyriaback-production.up.railway.app').replace(/\/$/, '');

// Remove any /api/users suffix if it exists
baseURL = baseURL.replace(/\/api\/users$/, '');

const apiClient = axios.create({
  baseURL: baseURL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Log the base URL for debugging
console.log('API Base URL:', apiClient.defaults.baseURL);

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach(cb => cb());
  refreshSubscribers = [];
};

// Request interceptor to fix URL issues
apiClient.interceptors.request.use(
  (config) => {
    // Ensure the URL doesn't have double /api/ prefixes
    if (config.url && config.url.startsWith('/api/')) {
      // Remove any duplicate /api/ prefixes
      config.url = config.url.replace(/^\/api\/api\//, '/api/');
    }
    
    console.log('Making request to:', config.baseURL + config.url);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  response => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Debug: Log the request URL
    console.log('Request URL:', originalRequest.url);
    console.log('Full URL:', originalRequest.baseURL + originalRequest.url);
    
    // Skip interception for auth endpoints
    const isAuthEndpoint = originalRequest.url.includes('/auth/');
    
    if (error.response?.status === 401 && !originalRequest._retry && !isAuthEndpoint) {
      if (isRefreshing) {
        return new Promise((resolve) => {
          subscribeTokenRefresh(() => resolve(apiClient(originalRequest)));
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        await apiClient.post('/api/users/refresh');
        onRefreshed();
        return apiClient(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;