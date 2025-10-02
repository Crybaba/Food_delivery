import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import AdminHomePage from './pages/AdminHomePage/AdminHomePage';
import ClientHomePage from './pages/ClientHomePage/ClientHomePage';
import CourierHomePage from './pages/CourierHomePage/CourierHomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ClientMenuPage from './pages/ClientMenuPage/ClientMenuPage';
import ClientOrdersPage from './pages/ClientOrdersPage/ClientOrdersPage';
import ClientCartPage from './pages/ClientCartPage/ClientCartPage';

// Ограничение маршрутов по роли
function RoleRoute({ allow, children }) {
  const { isAuthenticated, role } = useAuth();

  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!allow.includes(role)) return <Navigate to="/" replace />;
  return children;
}

// Приватный маршрут: доступен только авторизованным
function PrivateRoute({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<ClientHomePage />} />
            <Route
              path="/admin"
              element={
                <RoleRoute allow={['ADMIN']}>
                  <AdminHomePage />
                </RoleRoute>
              }
            />
            <Route
              path="/courier"
              element={
                <RoleRoute allow={['COURIER']}>
                  <CourierHomePage />
                </RoleRoute>
              }
            />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/menu" element={<ClientMenuPage />} />
            <Route path="/orders" element={<ClientOrdersPage />} />
            <Route
              path="/cart"
              element={
                <PrivateRoute>
                  <ClientCartPage />
                </PrivateRoute>
              }
            />
          </Routes>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
