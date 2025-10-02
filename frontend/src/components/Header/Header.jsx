import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { Home, Menu as MenuIcon, ShoppingCart, LogIn, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import Logo from '../Logo/Logo';
import styles from './Header.module.css';

export default function Header() {
  const { isAuthenticated, role, logout } = useAuth();
  const { cart } = useCart(); // берем cart, а не только items
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (err) {
      console.error('Ошибка при выходе:', err);
      alert('Не удалось выйти. Попробуйте снова.');
    }
  };

  // Общая сумма корзины
  const totalAmount = cart?.items?.reduce(
    (acc, item) => acc + (item.dish?.price || 0) * (item.quantity || 0),
    0
  );

  return (
    <header className={styles['site-header']}>
      <div className={styles['site-header-inner']}>
        <div className={`${styles['brand']} ${styles['header-col']}`}>
          <Logo />
        </div>

        {/* Навигация */}
        <nav className={`${styles.nav} ${styles['header-col']}`}>
          <NavLink
            to="/"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <Home size={20} />
            <span>Главная</span>
          </NavLink>

          <NavLink
            to="/menu"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}`
            }
          >
            <MenuIcon size={20} />
            <span>Меню</span>
          </NavLink>

          <NavLink
            to="/cart"
            className={({ isActive }) =>
              `${styles.navItem} ${isActive ? styles.active : ''}` }
          >
            <ShoppingCart size={20} />
            <div className={styles.cartSection}>
              <span>Корзина</span>
              {totalAmount > 0 && (
                <span className={styles.cartTotal}>
                  {totalAmount.toFixed(2)} ₽
                </span>
              )}
            </div>
          </NavLink>
        </nav>

        {/* Правая часть */}
        <div className={`${styles['header-right']} ${styles['header-col']}`}>
          {isAuthenticated ? (
            <>
              <span className={styles.role}>Роль: {role}</span>
              <button
                onClick={handleLogout}
                className={`${styles.navItem} ${styles.logout}`}
              >
                <LogOut size={18} />
                <span>Выход</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className={`${styles.navItem} ${styles.login}`}
            >
              <LogIn size={18} />
              <span>Вход</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
