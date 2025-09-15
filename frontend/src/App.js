import './App.css';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import AdminHomePage from './pages/AdminHomePage';
import ClientHomePage from './pages/ClientHomePage';
import CourierHomePage from './pages/CourierHomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ClientMenuPage from './pages/ClientMenuPage';
import ClientOrdersPage from './pages/ClientOrdersPage';
import ClientCartPage from './pages/ClientCartPage';

function RoleRoute({ allow, children }) {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/" replace />;
  if (!allow.includes(role)) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <AuthProvider>
      <CartProvider>
      <BrowserRouter>
        <div className="root-theme">
        <Routes>
          <Route path="/" element={<ClientHomePage />} />
          <Route
            path="/admin"
            element={
              <RoleRoute allow={["admin"]}>
                <AdminHomePage />
              </RoleRoute>
            }
          />
          <Route
            path="/courier"
            element={
              <RoleRoute allow={["courier"]}>
                <CourierHomePage />
              </RoleRoute>
            }
          />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/menu" element={<ClientMenuPage />} />
          <Route path="/orders" element={<ClientOrdersPage />} />
          <Route path="/cart" element={<ClientCartPage />} />
        </Routes>
        </div>
      </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}
