export const ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    REFRESH: '/auth/refresh',
    ME: '/auth/me'
  },
  USERS: {
    BASE: '/users',
    BY_ID: (id) => `/users/${id}`,
    FOLLOW: (username) => `/users/${username}/follow`,
    PROMOTE: (userId) => `/users/${userId}/promote`
  },
  TRIPS: {
    BASE: '/trips',
    BY_ID: (id) => `/trips/${id}`,
    OVERVIEW: '/trips/overview',
    REVENUE: '/trips/revenue'
  }
};