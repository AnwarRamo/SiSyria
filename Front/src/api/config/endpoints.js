export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/users/login',
    REGISTER: '/api/users/register',
    LOGOUT: '/api/users/logout',
    REFRESH: '/api/users/refresh',
    ME: '/api/users/me'
  },
  USERS: {
    BASE: '/api/users',
    BY_ID: (id) => `/api/users/${id}`,
    FOLLOW: (username) => `/api/users/${username}/follow`,
    PROMOTE: (userId) => `/api/users/${userId}/promote`
  },
  TRIPS: {
    BASE: '/api/trips',
    BY_ID: (id) => `/api/trips/${id}`,
    OVERVIEW: '/api/trips/overview',
    REVENUE: '/api/trips/revenue'
  },
  ORDERS: {
    BASE: '/api/orders',
    BY_ID: (id) => `/api/orders/${id}`
  },
  CART: {
    BASE: '/api/cart',
    ADD_ITEM: '/api/cart/add',
    REMOVE_ITEM: '/api/cart/remove',
    CLEAR: '/api/cart/clear'
  },
  PRODUCTS: {
    BASE: '/api/products',
    BY_ID: (id) => `/api/products/${id}`
  },
  TRIP_DESIGNS: {
    BASE: '/api/trip-designs',
    BY_ID: (id) => `/api/trip-designs/${id}`
  },
  ADMIN: {
    BASE: '/api/admin',
    DASHBOARD: '/api/admin/dashboard',
    USERS: '/api/admin/users'
  }
};