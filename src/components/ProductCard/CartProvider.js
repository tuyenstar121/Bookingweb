import React, { createContext, useState, useEffect } from 'react';

// Create a Context for the cart
export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    const storedCart = localStorage.getItem('cart');
    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const handleAddToCart = (item) => {
    const existingItemIndex = cart.findIndex(cartItem => cartItem.foodItemId === item.foodItemId);

    if (existingItemIndex !== -1) {
      const updatedCart = [...cart];
      updatedCart[existingItemIndex] = {
        ...updatedCart[existingItemIndex],
        quantity: updatedCart[existingItemIndex].quantity + 1
      };
      setCart(updatedCart);
    } else {
      setCart([...cart, { ...item, quantity: 1 }]);
    }
  };

  const handleClearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, handleAddToCart, handleClearCart }}>
      {children}
    </CartContext.Provider>
  );
};
