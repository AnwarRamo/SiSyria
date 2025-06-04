import { create } from 'zustand';
import { addToCart, removeFromCart, updateCartQuantity} from '../services/cartService';

export const useCartStore = create((set, get) => ({
  items: [],

  addToCart: async (product) => {
    try {
      await addToCart(product._id);
      const items = get().items;
      const existing = items.find((i) => i.product._id === product._id);

      if (existing) {
        set({
          items: items.map((i) =>
            i.product._id === product._id
              ? { ...i, quantity: i.quantity + 1 }
              : i
          ),
        });
      } else {
        set({ items: [...items, { product, quantity: 1 }] });
      }
    } catch (error) {
      console.error('Add to cart failed:', error);
    }
  },

  removeFromCart: async (productId) => {
    try {
      await removeFromCart(productId);
      set({
        items: get().items.filter((item) => item.product._id !== productId),
      });
    } catch (error) {
      console.error('Remove from cart failed:', error);
    }
  },

  updateCartQuantity: async (productId, quantity) => {
    try {
      await updateCartQuantity(productId, quantity);
      const items = get().items.map((item) =>
        item.product._id === productId ? { ...item, quantity } : item
      );
      set({ items });
    } catch (error) {
      console.error('Update cart quantity failed:', error);
    }
  },

  clearCart: () => set({ items: [] }),

  totalQuantity: () =>
    get().items.reduce((acc, item) => acc + item.quantity, 0),

  totalPrice: () =>
    get().items.reduce((acc, item) => acc + item.quantity * item.product.price, 0),
}));
