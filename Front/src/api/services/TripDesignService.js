import apiClient from '../config/axiosConfig';
import { ENDPOINTS } from '../config/endpoints';

/**
 * Service object for managing Trip Design API calls.
 */
export const TripDesignService = {
    /**
     * Fetches all trip designs for the current user.
     * @returns {Promise<Object>} The API response data.
     */
    getAll: async () => {
        try {
            const response = await apiClient.get(ENDPOINTS.TRIP_DESIGNS.BASE);
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                code: 'FETCH_DESIGNS_ERROR',
                message: 'Failed to fetch your trip designs.',
            };
        }
    },

    /**
     * Fetches a single trip design by its ID.
     * @param {string} id - The ID of the trip design to fetch.
     * @returns {Promise<Object>} The API response data.
     */
    getById: async (id) => {
        try {
            const response = await apiClient.get(ENDPOINTS.TRIP_DESIGNS.BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                code: 'FETCH_DESIGN_ERROR',
                message: 'Failed to fetch the trip design.',
            };
        }
    },

    /**
     * Creates a new trip design.
     * @param {FormData} formData - The form data containing the trip title, days, and files.
     * @returns {Promise<Object>} The API response data.
     */
    create: async (formData) => {
        try {
            const response = await apiClient.post(ENDPOINTS.TRIP_DESIGNS.BASE, formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                code: 'CREATE_DESIGN_ERROR',
                message: 'Failed to create the trip design.',
            };
        }
    },

    /**
     * Updates an existing trip design.
     * @param {string} id - The ID of the trip design to update.
     * @param {FormData} formData - The form data containing the updated trip information.
     * @returns {Promise<Object>} The API response data.
     */
    update: async (id, formData) => {
        try {
            const response = await apiClient.put(ENDPOINTS.TRIP_DESIGNS.BY_ID(id), formData);
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                code: 'UPDATE_DESIGN_ERROR',
                message: 'Failed to update the trip design.',
            };
        }
    },

    /**
     * Deletes a trip design by its ID.
     * @param {string} id - The ID of the trip design to delete.
     * @returns {Promise<Object>} The API response data.
     */
    delete: async (id) => {
        try {
            const response = await apiClient.delete(ENDPOINTS.TRIP_DESIGNS.BY_ID(id));
            return response.data;
        } catch (error) {
            throw error.response?.data || {
                code: 'DELETE_DESIGN_ERROR',
                message: 'Failed to delete the trip design.',
            };
        }
    },
};
