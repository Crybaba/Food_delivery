import React, { createContext, useContext, useState, useEffect } from 'react';
import { loginUser, registerUser, logoutUser, fetchCurrentUser } from '../lib/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [role, setRole] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // Восстановление из localStorage при монтировании
  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    const savedRole = localStorage.getItem('role');
    const savedAuth = localStorage.getItem('isAuthenticated') === 'true';

    if (savedUser && savedRole && savedAuth) {
      setUser(JSON.parse(savedUser));
      setRole(savedRole);
      setIsAuthenticated(true);
      setLoading(false);
    } else {
      // Если нет данных, пробуем запросить с бэка
      async function loadUser() {
        try {
          const data = await fetchCurrentUser(); // GET /accounts/me/
          if (data.user_id) {
            const userData = { id: data.user_id, phone: data.phone };
            setUser(userData);
            setRole(data.role);
            setIsAuthenticated(true);
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('role', data.role);
            localStorage.setItem('isAuthenticated', 'true');
          }
        } catch {
          setUser(null);
          setRole(null);
          setIsAuthenticated(false);
          localStorage.removeItem('user');
          localStorage.removeItem('role');
          localStorage.removeItem('isAuthenticated');
        } finally {
          setLoading(false);
        }
      }
      loadUser();
    }
  }, []);

  const register = async (payload) => {
    try {
      const data = await registerUser(payload);
      if (data.user) {
        setUser(data.user);
        setRole(data.user.role || 'CLIENT');
        setIsAuthenticated(true);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('role', data.user.role || 'CLIENT');
        localStorage.setItem('isAuthenticated', 'true');
        return { success: true };
      } else {
        return { success: false, message: data.error || 'Ошибка при регистрации' };
      }
    } catch (err) {
      let message = err.message || 'Ошибка при регистрации';
      try {
        const json = await err.response?.json();
        if (json) {
          message = Object.entries(json)
            .map(([key, val]) => `${key}: ${val.join(', ')}`)
            .join('\n');
        }
      } catch (_) {}
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
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('role', data.role);
        localStorage.setItem('isAuthenticated', 'true');
        return { success: true, role: data.role };
      } else {
        return { success: false, message: data.error || 'Неверные данные для входа' };
      }
    } catch (err) {
      return { success: false, message: err.message || 'Ошибка при логине' };
    }
  };

  const logout = async () => {
    try {
      await logoutUser();
    } catch (err) {
      console.error('Ошибка при логауте:', err);
    } finally {
      setUser(null);
      setRole(null);
      setIsAuthenticated(false);
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('isAuthenticated');
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
