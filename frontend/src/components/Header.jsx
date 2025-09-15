import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Menu as MenuIcon, ShoppingCart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Header() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <div className="brand header-col">
          <img src="/logo512.png" alt="Foodr" className="logo" />
          <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1 }}>
            <span className="brand-title">Foodr</span>
            <span className="brand-sub">доставка еды</span>
          </div>
        </div>

        <nav className="nav header-col">
          <Link to="/" className="nav-btn"><Home className="icon" /> Главная</Link>
          <Link to="/menu" className="nav-btn"><MenuIcon className="icon" /> Меню</Link>
          <Link to="/cart" className="nav-btn"><ShoppingCart className="icon" /> Корзина</Link>
        </nav>

        <div className="header-right header-col">
          {isAuthenticated ? (
            <>
              <span className="role">Роль: {role}</span>
              <button onClick={handleLogout} className="link">Выход</button>
            </>
          ) : (
            <button onClick={()=>navigate('/login')} className="link">Вход</button>
          )}
        </div>
      </div>
    </header>
  );
}


