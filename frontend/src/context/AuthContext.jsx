import React, { createContext, useContext, useMemo, useState, useCallback } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try { return localStorage.getItem('auth.isAuthenticated') === 'true'; } catch { return false; }
  });
  const [role, setRole] = useState(() => {
    try { return localStorage.getItem('auth.role') || 'client'; } catch { return 'client'; }
  }); // 'client' | 'courier' | 'admin'

  const login = useCallback((nextRole = 'client') => {
    setIsAuthenticated(true);
    setRole(nextRole);
    try {
      localStorage.setItem('auth.isAuthenticated', 'true');
      localStorage.setItem('auth.role', nextRole);
    } catch {}
  }, []);

  const logout = useCallback(() => {
    setIsAuthenticated(false);
    setRole('client');
    try {
      localStorage.removeItem('auth.isAuthenticated');
      localStorage.removeItem('auth.role');
    } catch {}
  }, []);

  const value = useMemo(() => ({ isAuthenticated, role, login, logout, setRole }), [isAuthenticated, role, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};


