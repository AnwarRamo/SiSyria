// Configuration file for environment variables and API settings

export const CONFIG = {
  // API Configuration - Updated to use production backend
  API_BASE_URL: process.env.EXPO_PUBLIC_API_BASE_URL || 'https://sisyriaback-production.up.railway.app',
  
  // Google OAuth (if using)
  GOOGLE_CLIENT_ID: process.env.EXPO_PUBLIC_GOOGLE_CLIENT_ID || '',
  
  // App Configuration
  APP_NAME: 'SiSriaFinly',
  APP_VERSION: '1.0.0',
  
  // Feature Flags
  FEATURES: {
    PUSH_NOTIFICATIONS: true,
    OFFLINE_MODE: true,
    DARK_MODE: true,
    GOOGLE_LOGIN: false, // Set to true when Google OAuth is configured
  },
  
  // API Endpoints - Updated to match your actual backend
  ENDPOINTS: {
    AUTH: {
      LOGIN: '/api/users/login',
      REGISTER: '/api/users/register',
      LOGOUT: '/api/users/logout',
      PROFILE: '/api/users/me',
      REFRESH: '/api/users/refresh',
      UPDATE_PROFILE: '/api/users/me',
    },
    TRIPS: {
      ALL: '/api/trips',
      FEATURED: '/api/trips/featured',
      BY_ID: (id: string) => `/api/trips/${id}`,
      SEARCH: '/api/trips/search',
      BOOK: (id: string) => `/api/trips/${id}/book`,
      CREATE: '/api/trips/create',
      UPDATE: (id: string) => `/api/trips/${id}`,
      DELETE: (id: string) => `/api/trips/${id}`,
    },
    ORDERS: {
      MY: '/api/orders/my',
      CREATE: '/api/orders',
    },
    CART: {
      GET: '/api/cart',
      ADD: '/api/cart/add',
      REMOVE: '/api/cart/remove',
      CLEAR: '/api/cart/clear',
    },
    PRODUCTS: {
      ALL: '/api/products',
      BY_ID: (id: string) => `/api/products/${id}`,
      PURCHASE: (id: string) => `/api/products/${id}/purchase`,
    },
    BOOKINGS: {
      MY: '/api/bookings/my',
    },
    SOUVENIRS: {
      ALL: '/api/products',
      BY_ID: (id: string) => `/api/products/${id}`,
      PURCHASE: (id: string) => `/api/products/${id}/purchase`,
    },
    REVIEWS: {
      BY_TRIP: (tripId: string) => `/api/trips/${tripId}/reviews`,
      ADD: (tripId: string) => `/api/trips/${tripId}/reviews`,
    },
    ADMIN: {
      TRIPS: '/api/admin/trips',
      USERS: '/api/admin/users',
      DASHBOARD: '/api/admin/dashboard',
      ORDERS: '/api/admin/orders',
    },
    CONTACT: '/api/contact',
    HEALTH: '/api/health',
  },
  
  // Default Values
  DEFAULTS: {
    TRIP_IMAGE: 'https://images.unsplash.com/photo-1502602898535-0e2e7f3b2b25?w=400',
    USER_AVATAR: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    PAGE_SIZE: 10,
    CACHE_DURATION: 5 * 60 * 1000, // 5 minutes
  },
  
  // Error Messages
  ERRORS: {
    NETWORK: 'Network error. Please check your connection.',
    UNAUTHORIZED: 'Please login to continue.',
    NOT_FOUND: 'Resource not found.',
    SERVER_ERROR: 'Server error. Please try again later.',
    VALIDATION: 'Please check your input and try again.',
  },
  
  // Success Messages
  SUCCESS: {
    LOGIN: 'Login successful!',
    REGISTER: 'Registration successful!',
    BOOKING: 'Trip booked successfully!',
    PROFILE_UPDATE: 'Profile updated successfully!',
    LOGOUT: 'Logged out successfully!',
  },
};

// Helper function to get full API URL
export const getApiUrl = (endpoint: string): string => {
  return `${CONFIG.API_BASE_URL}${endpoint}`;
};

// Helper function to check if running in development
export const isDevelopment = (): boolean => {
  return __DEV__;
};

// Helper function to get environment name
export const getEnvironment = (): string => {
  return isDevelopment() ? 'development' : 'production';
}; 