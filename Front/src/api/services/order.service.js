// src/api/services/order.service.js
import apiClient from '../config/axiosConfig';
import { ENDPOINTS } from '../config/endpoints';
import { getDisplayErrorMessage } from '../../components/ui/errorUtils';

const handleApiRequest = async (requestFn, defaultErrorMessage = 'An unexpected error occurred.') => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    const displayMessage = getDisplayErrorMessage(error, defaultErrorMessage);
    throw new Error(displayMessage);
  }
};

export const OrderService = {
  createOrder: async (orderData) => {
    return handleApiRequest(
      () => apiClient.post(ENDPOINTS.ORDERS.BASE, orderData, { withCredentials: true }), 
      'Failed to place your order. Please try again.'
    );
  },

  getUserOrders: async () => {
    return handleApiRequest(
      () => apiClient.get(ENDPOINTS.ORDERS.BASE, { withCredentials: true }),
      'Failed to fetch your orders.'
    );
  },

  getOrderById: async (orderId) => {
    return handleApiRequest(
      () => apiClient.get(ENDPOINTS.ORDERS.BY_ID(orderId), { withCredentials: true }),
      'Failed to fetch order details.'
    );
  }
};