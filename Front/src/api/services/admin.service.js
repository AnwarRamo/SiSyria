// src/api/services/admin.service.js
import apiClient from '../config/axiosConfig'; // Ensure this path is correct

/**
 * Standardized request handler for API calls.
 * @param {Function} requestFn - A function that returns the promise from an apiClient call.
 * @param {Object} defaultError - A default error object to throw if no specific error data is available.
 * @returns {Promise<any>} The data from the API response.
 */
const handleRequest = async (requestFn, defaultError) => {
  try {
    const response = await requestFn(); // Gets the full axios response
    return response.data; // Returns just the data part from the response
  } catch (error) {
    // Log detailed error information
    console.error('API Error Details from AdminService/handleRequest:', {
      message: error.message, // Axios or generic error message
      isAxiosError: error.isAxiosError,
      config_url: error.config?.url,
      response_status: error.response?.status,
      response_data: error.response?.data, // Actual error body from the server
      // stack: error.stack // Optional: for very detailed debugging
    });
    
    // If the server provided a specific error response body, throw that.
    // This allows components to receive structured error details from the backend.
    if (error.response?.data) {
      throw error.response.data; 
    }

    // Fallback to a default error structure or the one provided in defaultError argument
    throw defaultError || { 
      code: 'API_REQUEST_FAILED', 
      message: error.message || 'An unexpected API error occurred' 
    };
  }
};

export const AdminService = {
  // ================== Dashboard Related (from your older, more feature-rich version) ==================
  fetchTravelPackages: async (signal) => {
    console.log('[AdminService] Fetching travel packages...');
    return handleRequest(
      () => apiClient.get('/travel-packages', { signal, withCredentials: true }),
      { code: 'TRAVEL_PACKAGES_ERROR', message: 'Failed to fetch travel packages' }
    );
  },

  getTripOverview: async (signal) => { // Used by Dashboard.jsx
    console.log('[AdminService] Fetching trip overview (for dashboard)...');
    return handleRequest(
      () => apiClient.get('/admin/trip-overview', { signal, withCredentials: true }), // Endpoint from your "VersionA"
      { code: 'TRIP_OVERVIEW_ERROR', message: 'Failed to fetch trip overview' }
    );
  },

  fetchRevenueData: async (signal) => { // Used by Dashboard.jsx
    console.log('[AdminService] Fetching revenue data...');
    return handleRequest(
      // Assuming '/booking-revenue' is the correct endpoint from your "VersionA"
      () => apiClient.get('/booking-revenue', { signal, withCredentials: true }),
      { code: 'REVENUE_ERROR', message: 'Failed to fetch revenue data' }
    );
  },

  fetchAllUsers: async (params = {}, signal) => { // Used by Dashboard.jsx
    console.log('[AdminService] Fetching all users (for dashboard/admin)...');
    return handleRequest(
      // Endpoint from your "VersionA"
      () => apiClient.get('/admin/users', { params, signal, withCredentials: true }),
      { code: 'USERS_FETCH_ERROR', message: 'Failed to fetch users' }
    );
  },

  fetchBookingStatistics: async (signal) => {
    console.log('[AdminService] Fetching booking statistics...');
    return handleRequest(
      () => apiClient.get('/booking-statistics', { signal, withCredentials: true }),
      { code: 'BOOKING_STATS_ERROR', message: 'Failed to fetch booking statistics' }
    );
  },

  fetchAppointmentStatistics: async (signal) => {
    console.log('[AdminService] Fetching appointment statistics...');
    return handleRequest(
      () => apiClient.get('/appointment-statistics', { signal, withCredentials: true }),
      { code: 'APPOINTMENT_STATS_ERROR', message: 'Failed to fetch appointment statistics' }
    );
  },

  // ================== Trip Management (merged, prioritizing specific FormData handlers) ==================
  createTrip: async (formData) => { // Assumes formData is an instance of FormData for file uploads
    console.log('[AdminService] Attempting to create trip with FormData.');
    if (formData instanceof FormData && (process.env.NODE_ENV === 'development' || true)) { // Keep logs for now
      console.log('[AdminService] FormData contents for createTrip:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? 
          `${value.name} (${value.size} bytes, type: ${value.type})` : value);
      }
    }
    try {
      return await handleRequest(
        () => apiClient.post('/admin/trips/create', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data' // Essential for FormData with files
          },
          withCredentials: true
        }),
        { 
          code: 'CREATE_TRIP_ERROR', 
          message: 'Failed to create trip' 
        }
      );
    } catch (error) {
      console.error('[AdminService] Error specifically within createTrip method:', error);
      throw error; // Re-throw the error (already processed by handleRequest)
    }
  },

  addTripDetails: async (formData) => { // Assumes formData is an instance of FormData
    console.log('[AdminService] Attempting to add trip details with FormData.');
    if (formData instanceof FormData && (process.env.NODE_ENV === 'development' || true)) { // Keep logs
      console.log('[AdminService] FormData contents for addTripDetails:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? 
          `${value.name} (${value.size} bytes, type: ${value.type})` : value);
      }
    }
    try {
      return await handleRequest(
        () => apiClient.post('/admin/add-details', formData, {
          headers: { 
            'Content-Type': 'multipart/form-data'
          },
          withCredentials: true
        }),
        { 
          code: 'ADD_TRIP_DETAILS_ERROR', 
          message: 'Failed to add trip details' 
        }
      );
    } catch (error) {
      console.error('[AdminService] Error specifically within addTripDetails method:', error);
      throw error;
    }
  },

  getAllTrips: async (signal) => { // Using /admin/trips from your "VersionB"
    console.log('[AdminService] Fetching all admin trips...');
    return handleRequest(
      () => apiClient.get('/admin/trips', { signal, withCredentials: true }),
      { code: 'GET_ALL_TRIPS_ERROR', message: 'Failed to fetch all admin trips' }
    );
  },

  getTripById: async (tripId, signal) => { // From your "VersionB"
    console.log(`[AdminService] Fetching trip by ID: ${tripId}`);
    return handleRequest(
      () => apiClient.get(`/admin/trips/${tripId}`, { signal, withCredentials: true }),
      { code: 'GET_TRIP_BY_ID_ERROR', message: 'Failed to fetch trip details' }
    );
  },

  updateTrip: async (tripId, tripData, signal) => { // From your "VersionA"
    console.log(`[AdminService] Updating trip ID: ${tripId}`);
    // If tripData can contain files, this might need to be FormData and use multipart headers
    // Assuming tripData is JSON for this generic update
    return handleRequest(
      () => apiClient.put(`/admin/trips/${tripId}`, tripData, { signal, withCredentials: true }),
      { code: 'UPDATE_TRIP_ERROR', message: 'Failed to update trip' }
    );
  },

  deleteTrip: async (tripId, signal) => { // From your "VersionA"
    console.log(`[AdminService] Deleting trip ID: ${tripId}`);
    return handleRequest(
      () => apiClient.delete(`/admin/trips/${tripId}`, { signal, withCredentials: true }),
      { code: 'DELETE_TRIP_ERROR', message: 'Failed to delete trip' }
    );
  },

  // ================== Document Management (from your "VersionA") ==================
  uploadDocument: async (tripId, file) => { // 'file' should be a File object
    console.log(`[AdminService] Uploading document for trip ID: ${tripId}`);
    const formData = new FormData();
    formData.append('document', file); // Backend expects the file under 'document' key

    if (process.env.NODE_ENV === 'development' || true) { // Keep logs
      console.log('[AdminService] FormData for uploadDocument:');
      for (let [key, value] of formData.entries()) {
        console.log(`  ${key}:`, value instanceof File ? 
          `${value.name} (${value.size} bytes, type: ${value.type})` : value);
      }
    }
    
    return handleRequest(
      () => apiClient.post(`/admin/trips/${tripId}/documents`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        withCredentials: true
      }),
      { code: 'DOCUMENT_UPLOAD_ERROR', message: 'Failed to upload document' }
    );
  },

  // ================== User Management (from your "VersionA") ==================
  promoteUser: async (userId) => {
    console.log(`[AdminService] Promoting user ID: ${userId}`);
    return handleRequest(
      () => apiClient.put(`/admin/users/promote/${userId}`, {}, { withCredentials: true }), // Added empty object for PUT data if needed
      { code: 'PROMOTION_ERROR', message: 'Promotion failed' }
    );
  },
};