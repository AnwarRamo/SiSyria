import apiClient from '../config/axiosConfig';

// Add product to cart
export const addToCart = async (productId) => {
  return await apiClient.post("/cart/add", { productId });
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  return await apiClient.delete(`/cart/remove/${productId}`);
};

// Update cart quantity
export const updateCartQuantity = async (productId, quantity) => {
  return await apiClient.put(`/cart/update/${productId}`, { quantity });
};

// Checkout cart
export const checkoutCart = async () => {
  return await apiClient.post("/cart/checkout");
};

// Get all products (optional, if not done yet)
export const getAllProducts = async () => {
  return await apiClient.get("/products");
};
