// src/context/CartContext.js
import React, { createContext, useContext, useState } from 'react';

// Create a CartContext to manage the cart state
const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState({});

  const addToCart = (product) => {
    setCartItems((prev) => {
      const newQuantity = (prev[product.id]?.quantity || 0) + 1;
      return {
        ...prev,
        [product.id]: { ...product, quantity: newQuantity },
      };
    });
  };

  const removeFromCart = (productId) => {
    setCartItems((prev) => {
      const newCart = { ...prev };
      delete newCart[productId];
      return newCart;
    });
  };

  const increaseQuantity = (productId) => {
    setCartItems((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: prev[productId].quantity + 1,
      },
    }));
  };

  const decreaseQuantity = (productId) => {
    setCartItems((prev) => {
      if (prev[productId].quantity > 1) {
        return {
          ...prev,
          [productId]: {
            ...prev[productId],
            quantity: prev[productId].quantity - 1,
          },
        };
      } else {
        const newCart = { ...prev };
        delete newCart[productId];
        return newCart;
      }
    });
  };

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, increaseQuantity, decreaseQuantity }}>
      {children}
    </CartContext.Provider>
  );
};
