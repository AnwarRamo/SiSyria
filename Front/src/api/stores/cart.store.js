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
    try {
      const items = [...get().items];
      const existingIndex = items.findIndex(i => i.product._id === product._id);
      const originalItems = [...items]; // For revert on error
      
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

      // Async API call (fire and forget)
      apiAddToCart(product._id).catch(error => {
        console.error('Add to cart failed:', error);
        // Revert on error
        set({ items: originalItems });
      });
    } catch (error) {
      console.error('Optimistic update failed:', error);
    }
  },

  // Optimistic remove from cart
  removeFromCart: (productId) => {
    try {
      const items = [...get().items];
      const originalItems = [...items]; // For revert on error
      const newItems = items.filter(item => item.product._id !== productId);
      
      // Optimistic update
      set({ items: newItems });
      
      // Async API call
      apiRemoveFromCart(productId).catch(error => {
        console.error('Remove from cart failed:', error);
        // Revert on error
        set({ items: originalItems });
      });
    } catch (error) {
      console.error('Optimistic update failed:', error);
    }
  },

  // Optimistic quantity update
  updateCartQuantity: (productId, quantity) => {
    try {
      const items = [...get().items];
      const originalItems = [...items]; // For revert on error
      const itemIndex = items.findIndex(item => item.product._id === productId);
      
      if (itemIndex === -1) return;
      
      const updatedItems = [...items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity
      };
      
      // Optimistic update
      set({ items: updatedItems });
      
      // Async API call
      apiUpdateCartQuantity(productId, quantity).catch(error => {
        console.error('Update cart quantity failed:', error);
        // Revert on error
        set({ items: originalItems });
      });
    } catch (error) {
      console.error('Optimistic update failed:', error);
    }
  },

  clearCart: () => set({ items: [] }),

  totalQuantity: () => get().items.reduce((acc, item) => acc + item.quantity, 0),

  totalPrice: () => get().items.reduce(
    (acc, item) => acc + item.quantity * item.product.price, 0
  ),
}));
