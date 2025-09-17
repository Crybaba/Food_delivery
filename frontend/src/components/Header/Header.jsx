import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Home, Menu as MenuIcon, ShoppingCart, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Logo from '../Logo/Logo';
import Button from '../Button/Button';
import styles from './Header.module.css';

export default function Header() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className={styles['site-header']}>
      <div className={styles['site-header-inner']}>
        <Logo />

        {/* Навигация */}
        <nav className={`${styles.nav} ${styles['header-col']}`}>
          <Link to="/">
            <Button text="Главная" icon={Home} color="orange" size="medium" fullWidth />
          </Link>
          <Link to="/menu">
            <Button text="Меню" icon={MenuIcon} color="orange" size="medium" fullWidth />
          </Link>
          <Link to="/cart">
            <Button text="Корзина" icon={ShoppingCart} color="orange" size="medium" fullWidth />
          </Link>
        </nav>

        {/* Правая часть */}
        <div className={`${styles['header-right']} ${styles['header-col']}`}>
          {isAuthenticated ? (
            <>
              <span className={styles.role}>Роль: {role}</span>
              <Button
                text="Выход"
                icon={LogOut}
                onClick={handleLogout}
                color="gray"
                size="small"
                fullWidth={false}
              />
            </>
          ) : (
            <Button
              text="Вход"
              icon={LogIn}
              onClick={() => navigate('/login')}
              color="blue"
              size="small"
              fullWidth={false}
            />
          )}
        </div>
      </div>
    </header>
  );
}
