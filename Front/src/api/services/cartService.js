import apiClient from '../config/axiosConfig';
import { ENDPOINTS } from '../config/endpoints';

// Add product to cart
export const addToCart = async (productId) => {
  return await apiClient.post(ENDPOINTS.CART.ADD_ITEM, { productId });
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  return await apiClient.delete(`${ENDPOINTS.CART.BASE}/remove/${productId}`);
};

// Update cart quantity
export const updateCartQuantity = async (productId, quantity) => {
  return await apiClient.put(`${ENDPOINTS.CART.BASE}/update/${productId}`, { quantity });
};

// Checkout cart
export const checkoutCart = async () => {
  return await apiClient.post(`${ENDPOINTS.CART.BASE}/checkout`);
};

// Get all products (public, no credentials)
export const getAllProducts = async () => {
  return await apiClient.get(ENDPOINTS.PRODUCTS.BASE);
};
