import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const [items, setItems] = useState(() => {
    try {
      const raw = localStorage.getItem('cart.items');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const persist = (next) => {
    setItems(next);
    try { localStorage.setItem('cart.items', JSON.stringify(next)); } catch {}
  };

  const addItem = useCallback((dish, quantity = 1) => {
    persist((prev => {
      const list = Array.isArray(prev) ? prev : [];
      const idx = list.findIndex(i => i.id === dish.id);
      if (idx >= 0) {
        const copy = [...list];
        copy[idx] = { ...copy[idx], quantity: copy[idx].quantity + quantity };
        return copy;
      }
      return [...list, { id: dish.id, name: dish.name, price: dish.price, image: dish.image, quantity }];
    })(items));
  }, [items]);

  const removeItem = useCallback((dishId) => {
    persist(items.filter(i => i.id !== dishId));
  }, [items]);

  const clear = useCallback(() => persist([]), []);

  const value = useMemo(() => ({ items, addItem, removeItem, clear }), [items, addItem, removeItem, clear]);
  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};


