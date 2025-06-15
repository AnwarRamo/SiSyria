import { create } from 'zustand';

export const useCartStore = create((set, get) => ({
  items: [],
  
  // Optimistic add to cart with immediate UI update
  addToCart: (product) => {
    try {
      const items = [...get().items];
      const existingIndex = items.findIndex(i => i.product._id === product._id);
      
      // Optimistic UI update
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
      addToCart(product._id).catch(error => {
        console.error('Add to cart failed:', error);
        // Revert on error
        set({ items });
      });
    } catch (error) {
      console.error('Optimistic update failed:', error);
    }
  },

  // Optimistic remove from cart
  removeFromCart: (productId) => {
    try {
      const items = [...get().items];
      const newItems = items.filter(item => item.product._id !== productId);
      
      // Optimistic UI update
      set({ items: newItems });
      
      // Async API call
      removeFromCart(productId).catch(error => {
        console.error('Remove from cart failed:', error);
        // Revert on error
        set({ items });
      });
    } catch (error) {
      console.error('Optimistic update failed:', error);
    }
  },

  // Optimistic quantity update
  updateCartQuantity: (productId, quantity) => {
    try {
      const items = [...get().items];
      const itemIndex = items.findIndex(item => item.product._id === productId);
      
      if (itemIndex === -1) return;
      
      const updatedItems = [...items];
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity
      };
      
      // Optimistic UI update
      set({ items: updatedItems });
      
      // Async API call
      updateCartQuantity(productId, quantity).catch(error => {
        console.error('Update cart quantity failed:', error);
        // Revert on error
        set({ items });
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
