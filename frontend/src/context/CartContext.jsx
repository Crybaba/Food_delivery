import { createContext, useContext, useState, useEffect } from 'react';
import { fetchCart, addToCart, removeFromCart, clearCart, createOrder } from '../lib/api'; // 👈 добавляем createOrder
import { useAuth } from './AuthContext';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState({ items: [], total_price: 0 });
  const [loading, setLoading] = useState(true);
  const { isAuthenticated } = useAuth();

  async function loadCart() {
    setLoading(true);
    try {
      const data = await fetchCart();
      setCart(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  async function addItem(dish_id, quantity = 1) {
    const data = await addToCart(dish_id, quantity);
    setCart(data);
  }

  async function removeItem(dish_id) {
    const data = await removeFromCart(dish_id);
    setCart(data);
  }

  async function clearAll() {
    const data = await clearCart();
    setCart(data);
  }

  async function makeOrder(orderData) {
    try {
      const order = await createOrder(orderData);
      await clearAll(); // очистка корзины после успешного заказа
      return order;
    } catch (err) {
      console.error("Ошибка оформления заказа:", err);
      throw err;
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      loadCart();
    } else {
      setCart({ items: [], total_price: 0 });
    }
  }, [isAuthenticated]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addItem,
        removeItem,
        clearAll,
        reload: loadCart,
        makeOrder // 👈 теперь доступно на фронте
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
