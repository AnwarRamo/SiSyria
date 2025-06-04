// src/api/services/order.service.js
import apiClient from '../config/axiosConfig'; // Your configured Axios instance
import { getDisplayErrorMessage } from '../../components/ui/errorUtils'; // Ensure this path is correct

const handleApiRequest = async (requestFn, defaultErrorMessage = 'An unexpected error occurred.') => {
  try {
    const response = await requestFn();
    return response.data;
  } catch (error) {
    console.error('OrderService API Error:', error);
    const displayMessage = getDisplayErrorMessage(error, defaultErrorMessage);
    throw new Error(displayMessage);
  }
};

export const OrderService = {
  createOrder: async (orderData) => {
     console.log('[OrderService] Current apiClient baseURL:', apiClient.defaults.baseURL);
    console.log('[OrderService] Calling path: /orders');
    console.log('[OrderService] Creating order with data:', orderData);
    // baseURL is '.../users', so we just need '/orders' to reach '/users/orders'
    return handleApiRequest(
      () => apiClient.post('/orders', orderData, { withCredentials: true }), 
      'Failed to place your order. Please try again.'
    );
  },

  getUserOrders: async () => {
    // baseURL is '.../users', so we just need '/orders' to reach '/users/orders'
    return handleApiRequest(
      () => apiClient.get('/orders', { withCredentials: true }),
      'Failed to fetch your orders.'
    );
  },

  getOrderById: async (orderId) => {
    // baseURL is '.../users', so we need `/orders/${orderId}` to reach `/users/orders/${orderId}`
    return handleApiRequest(
      () => apiClient.get(`/orders/${orderId}`, { withCredentials: true }),
      'Failed to fetch order details.'
    );
  }
};