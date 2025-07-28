// src/api/services/trip.service.js
import apiClient from '../config/axiosConfig';
import { ENDPOINTS } from '../config/endpoints';

export const TripService = {
  // تسجيل المستخدم في رحلة
  registerTrip: async (tripId) => {
    try {
      const response = await apiClient.post(`${ENDPOINTS.TRIPS.BASE}/register`, { tripId }, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'REGISTER_TRIP_ERROR',
        message: 'Failed to register to trip',
      };
    }
  },

  // إلغاء التسجيل (إذا لديك API مسجل للإلغاء)
  unregisterTrip: async (tripId) => {
    try {
      const response = await apiClient.post(`${ENDPOINTS.TRIPS.BASE}/unregister`, { tripId }, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'UNREGISTER_TRIP_ERROR',
        message: 'Failed to unregister from trip',
      };
    }
  },

  // جلب الرحلات اللي سجل فيها المستخدم
  getRegisteredTrips: async () => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.TRIPS.BASE}/registered`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'FETCH_REGISTERED_TRIPS_ERROR',
        message: 'Failed to fetch registered trips',
      };
    }
  },

  // جلب حالة تسجيل المستخدم في رحلة معينة
  getUserTripRegistrationStatus: async (tripId) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.TRIPS.BASE}/user-registration-status/${tripId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'FETCH_REGISTRATION_STATUS_ERROR',
        message: 'Failed to fetch registration status',
      };
    }
  },

  // جلب الرحلات العامة (مثلاً للعرض)
  getPublicTrips: async (params) => {
    try {
      const response = await apiClient.get(ENDPOINTS.TRIPS.BASE, { params, withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'TRIPS_ERROR',
        message: 'Failed to load trips',
      };
    }
  },

  // تحديث رحلة (للمشرف أو المسؤول)
  updateTrip: async (tripId, tripData) => {
    try {
      const response = await apiClient.put(`${ENDPOINTS.ADMIN.BASE}/trips/${tripId}`, tripData, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'UPDATE_TRIP_ERROR',
        message: 'Failed to update trip',
      };
    }
  },

  // حذف رحلة (للمشرف أو المسؤول)
  deleteTrip: async (tripId) => {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.ADMIN.BASE}/trips/${tripId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'DELETE_TRIP_ERROR',
        message: 'Failed to delete trip',
      };
    }
  },

  // New methods for enhanced trip registration system
  getUserBookings: async () => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.TRIPS.BASE}/user-bookings`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('getUserBookings error:', error);
      if (error.response?.status === 401) {
        // User not authenticated, return empty bookings
        return [];
      }
      throw error.response?.data || {
        code: 'FETCH_USER_BOOKINGS_ERROR',
        message: 'Failed to fetch user bookings',
      };
    }
  },

  getUserNotifications: async (limit = 20, offset = 0) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.TRIPS.BASE}/notifications?limit=${limit}&offset=${offset}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      console.error('getUserNotifications error:', error);
      if (error.response?.status === 401) {
        // User not authenticated, return empty notifications
        return { notifications: [], unreadCount: 0, hasMore: false };
      }
      throw error.response?.data || {
        code: 'FETCH_NOTIFICATIONS_ERROR',
        message: 'Failed to fetch notifications',
      };
    }
  },

  markNotificationAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`${ENDPOINTS.TRIPS.BASE}/notifications/${notificationId}/read`, {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'MARK_NOTIFICATION_READ_ERROR',
        message: 'Failed to mark notification as read',
      };
    }
  },

  cancelTripRegistration: async (registrationId) => {
    try {
      const response = await apiClient.delete(`${ENDPOINTS.TRIPS.BASE}/registrations/${registrationId}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'CANCEL_REGISTRATION_ERROR',
        message: 'Failed to cancel registration',
      };
    }
  },

  getTripRegistrationStats: async (tripId) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.TRIPS.BASE}/${tripId}/registration-stats`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'FETCH_REGISTRATION_STATS_ERROR',
        message: 'Failed to fetch registration stats',
      };
    }
  },

  // Admin methods
  getPendingRegistrations: async () => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ADMIN.BASE}/registrations/pending`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'FETCH_PENDING_REGISTRATIONS_ERROR',
        message: 'Failed to fetch pending registrations',
      };
    }
  },

  updateRegistrationStatus: async (registrationId, status, rejectionReason = '', adminNote = '') => {

    
    try {
      const response = await apiClient.put(`${ENDPOINTS.ADMIN.BASE}/registrations/${registrationId}/status`, {
        status,
        rejectionReason,
        adminNote
      }, { withCredentials: true });
      
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'UPDATE_REGISTRATION_STATUS_ERROR',
        message: 'Failed to update registration status',
      };
    }
  },

  getAdminNotifications: async (limit = 20, offset = 0) => {
    try {
      const response = await apiClient.get(`${ENDPOINTS.ADMIN.BASE}/notifications?limit=${limit}&offset=${offset}`, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'FETCH_ADMIN_NOTIFICATIONS_ERROR',
        message: 'Failed to fetch admin notifications',
      };
    }
  },

  markAdminNotificationAsRead: async (notificationId) => {
    try {
      const response = await apiClient.put(`${ENDPOINTS.ADMIN.BASE}/notifications/${notificationId}/read`, {}, { withCredentials: true });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'MARK_ADMIN_NOTIFICATION_READ_ERROR',
        message: 'Failed to mark admin notification as read',
      };
    }
  },


};
