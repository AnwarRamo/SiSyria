import apiClient from '../config/axiosConfig';

export const TripService = {
  createTrip: async (tripData) => {
    try {
      const response = await apiClient.post('/admin/trips', tripData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'CREATE_TRIP_ERROR',
        message: 'Failed to create trip',
      };
    }
  },
  registerTrip: async (tripId) => {
    try {
      const response = await apiClient.post('/trips/register', { tripId });
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'UNREGISTER_TRIP_ERROR',
        message: 'Failed to unregister from trip',
      };
    }
  },

  updateTrip: async (tripId, tripData) => {
    try {
      const response = await apiClient.put(`/admin/trips/${tripId}`, tripData);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'UPDATE_TRIP_ERROR',
        message: 'Failed to update trip',
      };
    }
  },

  deleteTrip: async (tripId) => {
    try {
      const response = await apiClient.delete(`/admin/trips/${tripId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'DELETE_TRIP_ERROR',
        message: 'Failed to delete trip',
      };
    }
  },

  getAllTrips: async () => {
    try {
      const response = await apiClient.get('/admin/trips');
      return response.data;
    } catch (error) {
      throw error.response?.data || {
        code: 'FETCH_TRIPS_ERROR',
        message: 'Failed to fetch admin trips',
      };
    }
  },
getRegisteredTrips: async () => {
    try {
      const response = await apiClient.get('/registered');
      return response.data; // This should be an array of trips
    } catch (error) {
      throw error.response?.data || {
        code: 'FETCH_REGISTERED_TRIPS_ERROR',
        message: 'Failed to fetch registered trips',
      };
    }
  },
};
