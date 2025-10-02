import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, fetchCurrentUser } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const data = await fetchCurrentUser(); // GET /accounts/me/
        if (data.user_id) {
          setUser({ id: data.user_id, phone: data.phone });
          setRole(data.role);
          setIsAuthenticated(true);
        }
      } catch {
        setUser(null);
        setIsAuthenticated(false);
        setRole(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const register = async (payload) => {
    try {
      const data = await registerUser(payload); // fetchWithCsrf выбросит ошибку, если res.ok=false
      if (data.user) {
        setUser(data.user);
        setIsAuthenticated(true);
        return { success: true };
      } else {
        // Если data.error есть, показываем
        return { success: false, message: data.error || 'Ошибка при регистрации' };
      }
    } catch (err) {
      // Ошибка fetch или 400 с json
      let message = err.message || 'Ошибка при регистрации';
      try {
        // Пробуем распарсить json с сервера
        const json = await err.response?.json();
        if (json) {
          // собираем все ошибки в одну строку
          message = Object.entries(json)
            .map(([key, val]) => `${key}: ${val.join(', ')}`)
            .join('\n');
        }
      } catch (_) { }
      return { success: false, message };
    }
  };

  const login = async ({ phone, password }) => {
    try {
      const data = await loginUser({ phone, password });

      if (data.user_id) {
        const userData = { id: data.user_id, phone: data.phone };
        setUser(userData);
        setRole(data.role);
        setIsAuthenticated(true);
        return { success: true, role: data.role };
      } else {
        return { success: false, message: data.error || 'Неверные данные для входа' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Ошибка при логине' };
    }
  };

  // Логаут
  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Ошибка при логауте:', err);
    } finally {
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, role, isAuthenticated, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};
