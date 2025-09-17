import React from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaPlus, FaUtensils, FaBox } from 'react-icons/fa';
import Title from '../../components/Title/Title';
import MenuButton from '../../components/MenuButton/MenuButton';
import styles from './ClientHomePage.module.css';

export default function ClientHomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <Title>Добро пожаловать в Foodr ИС!</Title>

      <div className={styles['description']}>Выберете опцию:</div>

      <div className={styles.cta}>
        {!isAuthenticated ? (
          <>
            <MenuButton
              text="Вход"
              icon={FaUser}
              color="orange"
              onClick={() => navigate('/login')}
            />
            <MenuButton
              text="Регистрация"
              icon={FaPlus}
              color="lightorange"
              onClick={() => navigate('/register')}
            />
          </>
        ) : (
          <>
            <MenuButton
              text="Меню"
              icon={FaUtensils}
              color="orange"
              onClick={() => navigate('/menu')}
            />
            <MenuButton
              text="Мои заказы"
              icon={FaBox}
              color="lightorange"
              onClick={() => navigate('/orders')}
            />
          </>
        )}
      </div>
    </Layout>
  );
}
