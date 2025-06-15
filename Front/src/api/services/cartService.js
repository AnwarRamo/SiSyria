import apiClient from '../config/axiosConfig';

// Add product to cart
export const addToCart = async (productId) => {
  try {
    const response = await apiClient.post("/cart/add", { productId });
    return response.data;
  } catch (error) {
    console.error('Add to cart error:', error.response?.data || error.message);
    throw error;
  }
};

// Remove product from cart
export const removeFromCart = async (productId) => {
  try {
    const response = await apiClient.delete(`/cart/remove/${productId}`);
    return response.data;
  } catch (error) {
    console.error('Remove from cart error:', error.response?.data || error.message);
    throw error;
  }
};

// Update cart quantity
export const updateCartQuantity = async (productId, quantity) => {
  try {
    const response = await apiClient.put(`/cart/update/${productId}`, { quantity });
    return response.data;
  } catch (error) {
    console.error('Update quantity error:', error.response?.data || error.message);
    throw error;
  }
};

// Checkout cart
export const checkoutCart = async () => {
  try {
    const response = await apiClient.post("/cart/checkout");
    return response.data;
  } catch (error) {
    console.error('Checkout error:', error.response?.data || error.message);
    throw error;
  }
};

// Get all products
export const getAllProducts = async () => {
  try {
    const response = await apiClient.get("/products");
    return response.data;
  } catch (error) {
    console.error('Get products error:', error.response?.data || error.message);
    throw error;
  }
};
