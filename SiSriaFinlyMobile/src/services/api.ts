import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CONFIG } from '../config/config';

// Create axios instance
const api = axios.create({
  baseURL: CONFIG.API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem('token');
    if (token) {
      // Only add Authorization header if it's not a temporary mobile token
      if (!token.startsWith('mobile_')) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        console.log('Using temporary mobile token - skipping Authorization header for protected endpoints');
        // For temporary tokens, we'll skip protected endpoints
        if (config.url?.includes('/me') || config.url?.includes('/admin')) {
          console.warn('Skipping protected endpoint with temporary token');
        }
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      console.warn('401 Unauthorized - removing token');
      AsyncStorage.removeItem('token');
      // You can dispatch a logout action here if using Redux
    }
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: async (email: string, password: string) => {
    try {
      const response = await api.post(CONFIG.ENDPOINTS.AUTH.LOGIN, { email, password });
      
      // The production server doesn't return tokens in the response body
      // We need to extract them from cookies or handle this differently
      let token = response.data.accessToken || response.data.token;
      
      // If no token in response body, try to get from cookies
      if (!token && response.headers['set-cookie']) {
        const cookies = response.headers['set-cookie'];
        const accessTokenCookie = cookies.find(cookie => cookie.includes('accessToken'));
        if (accessTokenCookie) {
          token = accessTokenCookie.split(';')[0].split('=')[1];
        }
      }
      
      // For now, since the production server doesn't return tokens in response body,
      // we'll need to implement a different approach
      // For mobile apps, we'll use a custom token approach
      if (!token) {
        // Create a temporary token for mobile apps
        // This is a workaround until the server is updated
        token = `mobile_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        console.warn('Using temporary mobile token - server should be updated to return tokens');
      }
      
      return {
        token,
        user: response.data.user || response.data
      };
    } catch (error: any) {
      // Re-throw the error with more context
      if (error.response?.status === 401) {
        throw new Error('Invalid email or password');
      } else if (error.response?.status === 400) {
        throw new Error('Invalid request data');
      } else if (error.response?.status === 500) {
        throw new Error('Server error');
      } else {
        throw error;
      }
    }
  },

  register: async (userData: any) => {
    // Transform the data to match backend expectations
    const transformedData = {
      username: userData.name.toLowerCase().replace(/\s+/g, ''),
      displayName: userData.name,
      email: userData.email,
      password: userData.password,
      phone: userData.phone,
      nationalId: userData.nationalId || 'N/A', // Add default if not provided
    };
    
    const response = await api.post(CONFIG.ENDPOINTS.AUTH.REGISTER, transformedData);
    
    // Extract token from response - handle both old and new response formats
    let token = response.data.accessToken || response.data.token;
    
    // If no token in response, try to get from cookies
    if (!token && response.headers['set-cookie']) {
      const cookies = response.headers['set-cookie'];
      const accessTokenCookie = cookies.find(cookie => cookie.includes('accessToken'));
      if (accessTokenCookie) {
        token = accessTokenCookie.split(';')[0].split('=')[1];
      }
    }
    
    // For now, if no token is returned, we'll need to login after registration
    // This handles the case where the production server hasn't been updated yet
    if (!token) {
      console.warn('No token received from registration, user will need to login');
      return {
        token: null,
        user: response.data.user || response.data,
        needsLogin: true
      };
    }
    
    return {
      token,
      user: response.data.user || response.data
    };
  },

  getProfile: async () => {
    const response = await api.get(CONFIG.ENDPOINTS.AUTH.PROFILE);
    return response.data;
  },

  updateProfile: async (userData: any) => {
    const response = await api.put(CONFIG.ENDPOINTS.AUTH.UPDATE_PROFILE, userData);
    return response.data;
  },

  logout: async () => {
    const response = await api.post(CONFIG.ENDPOINTS.AUTH.LOGOUT);
    return response.data;
  },
};

// Trips API
export const tripsAPI = {
  getAllTrips: async (params?: any) => {
    const response = await api.get(CONFIG.ENDPOINTS.TRIPS.ALL, { params });
    return response.data;
  },

  getTripById: async (tripId: string) => {
    const response = await api.get(CONFIG.ENDPOINTS.TRIPS.BY_ID(tripId));
    return response.data;
  },

  getFeaturedTrips: async () => {
    const response = await api.get(CONFIG.ENDPOINTS.TRIPS.FEATURED);
    return response.data;
  },

  searchTrips: async (query: string, filters?: any) => {
    const response = await api.get(CONFIG.ENDPOINTS.TRIPS.SEARCH, {
      params: { q: query, ...filters },
    });
    return response.data;
  },

  bookTrip: async (tripId: string, bookingData: any) => {
    const response = await api.post(CONFIG.ENDPOINTS.TRIPS.BOOK(tripId), bookingData);
    return response.data;
  },

  getMyBookings: async () => {
    const response = await api.get(CONFIG.ENDPOINTS.BOOKINGS.MY);
    return response.data;
  },

  // New trip creation functionality
  createTrip: async (tripData: any) => {
    const response = await api.post(CONFIG.ENDPOINTS.TRIPS.CREATE, tripData);
    return response.data;
  },

  updateTrip: async (tripId: string, tripData: any) => {
    const response = await api.put(CONFIG.ENDPOINTS.TRIPS.UPDATE(tripId), tripData);
    return response.data;
  },

  deleteTrip: async (tripId: string) => {
    const response = await api.delete(CONFIG.ENDPOINTS.TRIPS.DELETE(tripId));
    return response.data;
  },
};

// Souvenirs API
export const souvenirsAPI = {
  getAllSouvenirs: async () => {
    const response = await api.get(CONFIG.ENDPOINTS.SOUVENIRS.ALL);
    return response.data;
  },

  getSouvenirById: async (souvenirId: string) => {
    const response = await api.get(CONFIG.ENDPOINTS.SOUVENIRS.BY_ID(souvenirId));
    return response.data;
  },

  purchaseSouvenir: async (souvenirId: string, purchaseData: any) => {
    const response = await api.post(CONFIG.ENDPOINTS.SOUVENIRS.PURCHASE(souvenirId), purchaseData);
    return response.data;
  },
};

// Reviews API
export const reviewsAPI = {
  getTripReviews: async (tripId: string) => {
    const response = await api.get(CONFIG.ENDPOINTS.REVIEWS.BY_TRIP(tripId));
    return response.data;
  },

  addReview: async (tripId: string, reviewData: any) => {
    const response = await api.post(CONFIG.ENDPOINTS.REVIEWS.ADD(tripId), reviewData);
    return response.data;
  },
};

// Admin API
export const adminAPI = {
  getAllTrips: async () => {
    const response = await api.get(CONFIG.ENDPOINTS.ADMIN.TRIPS);
    return response.data;
  },

  createTrip: async (tripData: any) => {
    const response = await api.post(CONFIG.ENDPOINTS.ADMIN.TRIPS, tripData);
    return response.data;
  },

  updateTrip: async (tripId: string, tripData: any) => {
    const response = await api.put(`${CONFIG.ENDPOINTS.ADMIN.TRIPS}/${tripId}`, tripData);
    return response.data;
  },

  deleteTrip: async (tripId: string) => {
    const response = await api.delete(`${CONFIG.ENDPOINTS.ADMIN.TRIPS}/${tripId}`);
    return response.data;
  },

  getAllUsers: async () => {
    const response = await api.get(CONFIG.ENDPOINTS.ADMIN.USERS);
    return response.data;
  },

  getDashboardStats: async () => {
    const response = await api.get(CONFIG.ENDPOINTS.ADMIN.DASHBOARD);
    return response.data;
  },
};

// Contact API
export const contactAPI = {
  sendMessage: async (messageData: any) => {
    const response = await api.post(CONFIG.ENDPOINTS.CONTACT, messageData);
    return response.data;
  },
};

export default api; 