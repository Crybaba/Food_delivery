import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

import AdminHomePage from './pages/AdminHomePage/AdminHomePage';
import AdminOrdersPage from './pages/AdminOrdersPage/AdminOrdersPage';
import AdminCouriersPage from './pages/AdminCouriersPage/AdminCouriersPage';
import AdminDishesPage from './pages/AdminDishesPage/AdminDishesPage';
import ClientHomePage from './pages/ClientHomePage/ClientHomePage';
import CourierHomePage from './pages/CourierHomePage/CourierHomePage';
import LoginPage from './pages/LoginPage/LoginPage';
import RegisterPage from './pages/RegisterPage/RegisterPage';
import ClientMenuPage from './pages/ClientMenuPage/ClientMenuPage';
import ClientOrdersPage from './pages/ClientOrdersPage/ClientOrdersPage';
import ClientCartPage from './pages/ClientCartPage/ClientCartPage';

// Компонент редиректа по роли с "/"
function RoleRedirect() {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <p>Загрузка...</p>; // или спиннер
  if (!isAuthenticated) return <Navigate to="/login" replace />;

  // Редиректим админа на /admin
  if (role === 'ADMIN') return <Navigate to="/admin" replace />;

  // Курьера на /courier
  if (role === 'COURIER') return <Navigate to="/courier" replace />;

  // Остальные роли или клиент остаются на главной
  return <ClientHomePage />;
}

function RoleRoute({ allow, children }) {
  const { isAuthenticated, role, loading } = useAuth();

  if (loading) return <p>Загрузка...</p>; // или спиннер
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (!allow.includes(role)) return <Navigate to="/" replace />;
  return children;
}

function PrivateRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return <p>Загрузка...</p>;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <Routes>
            {/* Главная с редиректом по роли */}
            <Route path="/" element={<RoleRedirect />} />

            {/* Админские маршруты */}
            <Route
              path="/admin"
              element={
                <RoleRoute allow={['ADMIN']}>
                  <AdminHomePage />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/orders"
              element={
                <RoleRoute allow={['ADMIN']}>
                  <AdminOrdersPage />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/couriers"
              element={
                <RoleRoute allow={['ADMIN']}>
                  <AdminCouriersPage />
                </RoleRoute>
              }
            />
            <Route
              path="/admin/dishes"
              element={
                <RoleRoute allow={['ADMIN']}>
                  <AdminDishesPage />
                </RoleRoute>
              }
            />

            {/* Курьерские маршруты */}
            <Route
              path="/courier"
              element={
                <RoleRoute allow={['COURIER']}>
                  <CourierHomePage />
                </RoleRoute>
              }
            />

            {/* Авторизация и регистрация */}
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Клиентские страницы */}
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
