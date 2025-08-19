// src/api/services/admin.service.js
import apiClient from '../config/axiosConfig';
import { ENDPOINTS } from '../config/endpoints';

const handleRequest = async (requestFn) => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    // Don't log canceled requests (component unmounted)
    if (error.message !== 'canceled') {
      console.error('API Service Error:', {
        message: error.message,
        url: error.config?.url,
        status: error.response?.status,
        responseData: error.response?.data,
      });
    }

    throw error.response?.data || {
      code: 'API_REQUEST_FAILED',
      message: error.message || 'An unexpected API error occurred',
    };
  }
};

export const AdminService = {
  // Dashboard KPIs and Overview
  getAdminDashboard: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/dashboard`, { signal, withCredentials: true })
    );
  },

  // Travel Packages
  getTravelPackages: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.TRIPS.BASE}`, { signal, withCredentials: true })
    );
  },

  // Alias for getTravelPackages (for Dashboard compatibility)
  fetchTravelPackages: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.TRIPS.BASE}`, { signal, withCredentials: true })
    );
  },

  // Top Destinations
  getTopDestinations: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/top-destinations`, { signal, withCredentials: true })
    );
  },

  // All Trips
  getAllTrips: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/trips`, { signal, withCredentials: true })
    );
  },

  // Trip by ID
  getTripById: async (tripId, signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/trips/${tripId}`, { signal, withCredentials: true })
    );
  },

  // Full Trip Creation
  fullTripCreate: async (formData) => {
    return handleRequest(() =>
      apiClient.post(`${ENDPOINTS.ADMIN.BASE}/trips/full-create`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true,
      })
    );
  },

  // Update Trip
  updateTrip: async (tripId, tripData) => {
    return handleRequest(() =>
      apiClient.put(`${ENDPOINTS.ADMIN.BASE}/trips/${tripId}`, tripData, { withCredentials: true })
    );
  },

  // Delete Trip
  deleteTrip: async (tripId) => {
    return handleRequest(() =>
      apiClient.delete(`${ENDPOINTS.ADMIN.BASE}/trips/${tripId}`, { withCredentials: true })
    );
  },

  // Trip Overview
  getTripOverview: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/trip-overview`, { signal, withCredentials: true })
    );
  },

  // Upcoming Trips
  getUpcomingTrips: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/upcoming-trips`, { signal, withCredentials: true })
    );
  },

  // Pending Registrations
  getPendingRegistrations: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/registrations/pending`, { signal, withCredentials: true })
    );
  },

  // Update Registration Status
  updateRegistrationStatus: async (registrationId, statusUpdate) => {
    return handleRequest(() =>
      apiClient.put(`${ENDPOINTS.ADMIN.BASE}/registrations/${registrationId}/status`, statusUpdate, { withCredentials: true })
    );
  },

  // All Bookings
  getAllBookings: async (signal) => {
    return handleRequest(() =>
      // Fetch all trip registrations for admin dashboard
      apiClient.get(`/api/admin/register`, { signal, withCredentials: true })
    );
  },

  // Revenue Analytics
  getRevenueAnalytics: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/analytics/revenue`, { signal, withCredentials: true })
    );
  },

  // Alias for getRevenueAnalytics (for Dashboard compatibility)
  fetchRevenueData: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/analytics/revenue`, { signal, withCredentials: true })
    );
  },

  // Users Analytics
  getUsersAnalytics: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/analytics/users`, { signal, withCredentials: true })
    );
  },

  // All Users (for user management)
  getAllUsers: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/users`, { signal, withCredentials: true })
    );
  },

  // Alias for getAllUsers (for Dashboard compatibility)
  fetchAllUsers: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/users`, { signal, withCredentials: true })
    );
  },

  // Trips Analytics
  getTripsAnalytics: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/analytics/trips`, { signal, withCredentials: true })
    );
  },

  // Booking Statistics
  getBookingStatistics: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/booking-statistics`, { signal, withCredentials: true })
    );
  },

  // Appointment Statistics
  getAppointmentStatistics: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/appointment-statistics`, { signal, withCredentials: true })
    );
  },

  // Dashboard KPIs (combines multiple analytics)
  fetchDashboardKPIs: async (signal) => {
    try {
      const [dashboard, users, trips, revenue] = await Promise.all([
        AdminService.getAdminDashboard(signal),
        AdminService.getUsersAnalytics(signal),
        AdminService.getTripsAnalytics(signal),
        AdminService.getRevenueAnalytics(signal)
      ]);

      // Transform the data to match the expected KPI structure
      return {
        totalOrders: dashboard?.bookingCount || 0,
        totalCustomers: users?.totalUsers || 0,
        totalRevenue: dashboard?.totalRevenue || 0,
        newSignUps: users?.totalUsers || 0, // This should be calculated from recent registrations
        dashboard,
        users,
        trips,
        revenue
      };
    } catch (error) {
      console.error('Error fetching dashboard KPIs:', error);
      // Return default values if there's an error
      return {
        totalOrders: 0,
        totalCustomers: 0,
        totalRevenue: 0,
        newSignUps: 0,
        dashboard: {},
        users: {},
        trips: [],
        revenue: []
      };
    }
  },

  // Order Trends (placeholder - implement based on your order model)
  fetchOrderTrends: async (signal) => {
    // This would need to be implemented based on your order/booking model
    // For now, returning mock data structure
    return {
      labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
      orderCounts: [12, 19, 3, 5, 2, 3]
    };
  },

  // Order Product Data (placeholder - implement based on your order model)
  fetchOrderProductData: async (signal) => {
    // This would need to be implemented based on your order/booking model
    // For now, returning mock data structure
    return [
      { product: 'Trip Package 1', orders: 12, revenue: 2400 },
      { product: 'Trip Package 2', orders: 19, revenue: 3800 },
      { product: 'Trip Package 3', orders: 3, revenue: 600 }
    ];
  },

  // User Management
  getUserById: async (userId, signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/users/${userId}`, { signal, withCredentials: true })
    );
  },

  updateUser: async (userId, userData) => {
    return handleRequest(() =>
      apiClient.put(`${ENDPOINTS.ADMIN.BASE}/users/${userId}`, userData, { withCredentials: true })
    );
  },

  deleteUser: async (userId) => {
    return handleRequest(() =>
      apiClient.delete(`${ENDPOINTS.ADMIN.BASE}/users/${userId}`, { withCredentials: true })
    );
  },

  promoteToAdmin: async (userId) => {
    return handleRequest(() =>
      apiClient.put(`${ENDPOINTS.ADMIN.BASE}/users/promote/${userId}`, {}, { withCredentials: true })
    );
  },

  // Trip Design Management
  reviewTripDesign: async (designId, reviewData) => {
    return handleRequest(() =>
      apiClient.put(`${ENDPOINTS.ADMIN.BASE}/trip-designs/${designId}/review`, reviewData, { withCredentials: true })
    );
  },

  // Appointments Management
  getAppointments: async (signal) => {
    return handleRequest(() =>
      apiClient.get(`${ENDPOINTS.ADMIN.BASE}/appointments`, { signal, withCredentials: true })
    );
  },

  createAppointment: async (appointmentData) => {
    return handleRequest(() =>
      apiClient.post(`${ENDPOINTS.ADMIN.BASE}/appointments`, appointmentData, { withCredentials: true })
    );
  },

  updateAppointment: async (appointmentId, appointmentData) => {
    return handleRequest(() =>
      apiClient.put(`${ENDPOINTS.ADMIN.BASE}/appointments/${appointmentId}`, appointmentData, { withCredentials: true })
    );
  },

  deleteAppointment: async (appointmentId) => {
    return handleRequest(() =>
      apiClient.delete(`${ENDPOINTS.ADMIN.BASE}/appointments/${appointmentId}`, { withCredentials: true })
    );
  },

  // Event Requests
  getEventRequests: async () => {
    return handleRequest(() => apiClient.get('/api/events/bookings', { withCredentials: true }));
  },
  updateEventRequest: async (id, updates) => {
    return handleRequest(() => apiClient.patch(`/api/events/bookings/${id}`, updates, { withCredentials: true }));
  },

  // Organized Events
  listOrganizedEvents: async () => {
    return handleRequest(() => apiClient.get('/api/events/organized', { withCredentials: true }));
  },
  createOrganizedEvent: async (payload) => {
    return handleRequest(() => apiClient.post('/api/events/organized', payload, { withCredentials: true }));
  },
};
