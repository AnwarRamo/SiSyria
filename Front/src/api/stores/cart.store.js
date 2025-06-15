import { create } from 'zustand';
import { 
  addToCart as apiAddToCart,
  removeFromCart as apiRemoveFromCart,
  updateCartQuantity as apiUpdateCartQuantity
} from '../services/cartService';

export const useCartStore = create((set, get) => ({
  items: [],
  
  // Optimistic add to cart
  addToCart: (product) => {
    const items = [...get().items];
    const existingIndex = items.findIndex(i => i.product._id === product._id);
    const originalItems = [...items];
    
    // Optimistic update
    if (existingIndex > -1) {
      const updatedItems = [...items];
      updatedItems[existingIndex] = {
        ...updatedItems[existingIndex],
        quantity: updatedItems[existingIndex].quantity + 1
      };
      set({ items: updatedItems });
    } else {
      set({ items: [...items, { product, quantity: 1 }] });
    }

    // API call with error revert
    apiAddToCart(product._id)
      .catch(error => {
        console.error('API add failed:', error);
        set({ items: originalItems });
      });
  },

  // Optimistic remove from cart
  removeFromCart: (productId) => {
    const items = [...get().items];
    const originalItems = [...items];
    const newItems = items.filter(item => item.product._id !== productId);
    
    // Optimistic update
    set({ items: newItems });
    
    // API call with error revert
    apiRemoveFromCart(productId)
      .catch(error => {
        console.error('API remove failed:', error);
        set({ items: originalItems });
      });
  },

  // Optimistic quantity update
  updateCartQuantity: (productId, quantity) => {
    const items = [...get().items];
    const originalItems = [...items];
    const itemIndex = items.findIndex(item => item.product._id === productId);
    
    if (itemIndex === -1) return;
    
    const updatedItems = [...items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      quantity
    };
    
    // Optimistic update
    set({ items: updatedItems });
    
    // API call with error revert
    apiUpdateCartQuantity(productId, quantity)
      .catch(error => {
        console.error('API update failed:', error);
        set({ items: originalItems });
      });
  },

  clearCart: () => set({ items: [] }),

  totalQuantity: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

  totalPrice: () => get().items.reduce(
    (acc, item) => acc + item.quantity * item.product.price, 0
  ),
}));
