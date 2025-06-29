import { create } from 'zustand';
import { addToCart, removeFromCart, updateCartQuantity } from '../services/cartService';

export const useCartStore = create((set, get) => ({
  items: [],

addToCart: async (product) => {
  try {
    const productId = product._id?.$oid || product._id;
    if (!productId) return;

    const items = get().items;
    const existing = items.find(
      (i) => i.product._id.toString() === productId.toString()
    );

    if (existing) {
      set({
        items: items.map((i) =>
          i.product._id.toString() === productId.toString()
            ? { ...i, quantity: i.quantity + 1 }
            : i
        ),
      });
    } else {
      set({
        items: [...items, { product: { ...product, _id: productId }, quantity: 1 }],
      });
    }

    // ✅ لا تضع هذا فوق لأنه قد يسبب re-render مبكر
    await addToCart(productId);
    console.log("Updated cart items:", get().items);

  } catch (error) {
    console.error("Add to cart failed:", error);
  }
},


  removeFromCart: async (productId) => {
    try {
      await removeFromCart(productId);
      set(state => ({
        items: state.items.filter(
          item => String(item.product._id) !== String(productId)
 ) }));
    } catch (error) {
      console.error('Remove from cart failed:', error);
    }
  },

  updateCartQuantity: async (productId, quantity) => {
    try {
      await updateCartQuantity(productId, quantity);
      set(state => ({
        items: state.items.map(item =>
          String(item.product._id) === String(productId)
            ? { ...item, quantity }
            : item
        )
      }));
    } catch (error) {
      console.error('Update cart quantity failed:', error);
    }
  },

  clearCart: () => set({ items: [] }),

  totalQuantity: () => 
    get().items.reduce((acc, item) => acc + item.quantity, 0),

  totalPrice: () =>
    get().items.reduce(
      (acc, item) => acc + item.quantity * (item.product.price || 0), 
      0
    ),
}));
