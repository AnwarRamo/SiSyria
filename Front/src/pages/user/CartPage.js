import React, { useState } from 'react';
import { useCartStore } from '../../api/stores/cart.store'; // Adjust path
import { useAuthStore } from '../../api/stores/auth.store'; // Assuming you have an auth store for user ID
import { OrderService } from '../../api/services/order.service'; // Import OrderService
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-toastify'; // For notifications

const CartModal = ({ onClose }) => {
  const { items, removeFromCart, updateCartQuantity, totalPrice, clearCart } = useCartStore();
  const { user } = useAuthStore(); // Get the authenticated user
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const handleClose = () => {
    if (onClose && typeof onClose === 'function') {
      onClose();
    }
  };

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      handleClose();
    }
  };

  const handleCheckout = async () => {
    if (!user || !user.id) {
      toast.error("Please log in to proceed with checkout.");
      // Optionally redirect to login page
      // window.location.href = '/login';
      return;
    }
    if (!items || items.length === 0) {
      toast.error("Your cart is empty.");
      return;
    }

    setIsCheckingOut(true);
    try {
      const orderItems = items.map(cartItem => ({
        productId: cartItem.product._id,
        name: cartItem.product.name,
        quantity: cartItem.quantity,
        priceAtPurchase: cartItem.product.price, // Assuming product.price is unit price
      }));

      const currentTotalPrice = totalPrice(); // Get the numerical total

      const orderData = {
        // userId will be extracted from auth token on backend,
        // but can be sent if backend expects it explicitly and doesn't rely solely on token
        // For this example, backend will get it from `req.user` via auth middleware
        items: orderItems,
        totalAmount: currentTotalPrice,
      };

      const createdOrder = await OrderService.createOrder(orderData);
      toast.success(`Order placed successfully! Order ID: ${createdOrder._id || createdOrder.id}`);
      clearCart(); // Clear the cart from the store
      handleClose(); // Close the modal

    } catch (error) {
      toast.error(error.message || "Checkout failed. Please try again.");
    } finally {
      setIsCheckingOut(false);
    }
  };


  const numericalTotalPrice = totalPrice ? totalPrice() : 0;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 flex items-center justify-center z-50 bg-black/40 backdrop-blur-[6px] p-4"
        onClick={handleBackdropClick}
      >
        <motion.div
          initial={{ scale: 0.96, y: 30 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.96, y: 30 }}
          className="bg-white/80 dark:bg-[#0a192f]/80 mt-[42rem] backdrop-blur-2xl p-8 rounded-3xl shadow-2xl w-full max-w-lg border border-[#E7C873] flex flex-col"
        >
          {(!items || items.length === 0) ? (
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-white mb-6">Your Cart is Empty</h2>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClose}
                className="bg-gradient-to-r from-teal-500 to-cyan-500 text-white px-8 py-3 rounded-full font-semibold shadow-lg"
              >
                Keep Shopping
              </motion.button>
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-extrabold text-white mb-6 text-center">Your Cart 🛒</h2>
              <div className="max-h-80 sm:max-h-96 overflow-y-auto scrollbar-thin scrollbar-thumb-teal-500 scrollbar-track-transparent pr-2 space-y-4">
                {items.map((item) => (
                  <motion.div
                    key={item.product._id}
                    layout // Animate layout changes (e.g., when item removed)
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20, transition: { duration: 0.2 } }}
                    className="flex flex-col sm:flex-row justify-between items-center bg-white/70 dark:bg-[#0a192f]/80 backdrop-blur-xl p-4 rounded-2xl shadow-md border border-[#E7C873] mb-2"
                  >
                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                      <img
                        src={item.product.image || 'https://via.placeholder.com/80'} // Fallback image
                        alt={item.product.name}
                        className="w-20 h-20 object-cover rounded-xl border border-[#E7C873]/30"
                      />
                      <div className="text-left">
                        <h3 className="text-lg font-extrabold text-[#115d5a] mb-1">{item.product.title || item.product.name}</h3>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="inline-block bg-[#E7C873]/80 text-[#115d5a] px-3 py-0.5 rounded-lg text-sm font-bold border border-[#E7C873]">${item.product.price.toFixed(2)}</span>
                          <span className="bg-[#E7C873]/20 text-[#E7C873] px-2 py-0.5 rounded-full text-xs font-semibold border border-[#E7C873]">{item.product.category || 'Souvenir'}</span>
                        </div>
                        <p className="text-gray-700 text-xs mb-1 line-clamp-2 max-w-xs">{item.product.description}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="bg-[#115d5a]/10 text-[#115d5a] px-2 py-0.5 rounded-full text-xs font-semibold border border-[#E7C873]">Stock: {item.product.stock ?? 'N/A'}</span>
                          <span className="bg-[#E7C873]/20 text-[#E7C873] px-2 py-0.5 rounded-full text-xs font-semibold border border-[#E7C873]">Sold: {item.product.soldCount ?? 0}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2 mt-4 sm:mt-0">
                      <div className="flex items-center bg-white/10 rounded-full">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateCartQuantity(item.product._id, item.quantity - 1)}
                          disabled={item.quantity <= 1}
                          className="px-2 py-0.5 sm:px-3 sm:py-1 text-[#115d5a] disabled:opacity-50 text-sm sm:text-base"
                        >
                          -
                        </motion.button>
                        <span className="text-[#115d5a] px-2 sm:px-3 text-sm sm:text-base font-bold">{item.quantity}</span>
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => updateCartQuantity(item.product._id, item.quantity + 1)}
                          className="px-2 py-0.5 sm:px-3 sm:py-1 text-[#115d5a] text-sm sm:text-base"
                        >
                          +
                        </motion.button>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1, color: '#F87171' /* red-400 */ }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => removeFromCart(item.product._id)}
                        className="text-rose-400 hover:text-rose-300 text-xs sm:text-sm"
                      >
                        Remove
                      </motion.button>
                    </div>
                  </motion.div>
                ))}
              </div>
              <div className="border-t border-white/20 mt-6 pt-6">
                <div className="flex justify-between text-lg sm:text-xl font-semibold text-white mb-6">
                  <span>Total:</span>
                  <span>${numericalTotalPrice.toFixed(2)}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleCheckout}
                  disabled={isCheckingOut}
                  className="bg-gradient-to-r from-green-500 to-emerald-600 text-white px-8 py-3 rounded-full w-full font-semibold shadow-lg disabled:opacity-70 flex items-center justify-center"
                >
                  {isCheckingOut ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    "Proceed to Checkout"
                  )}
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleClose}
                  className="bg-transparent border border-teal-500 text-teal-400 hover:bg-teal-500/20 px-8 py-3 rounded-full w-full font-semibold mt-3"
                >
                  Close
                </motion.button>
              </div>
            </>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CartModal;