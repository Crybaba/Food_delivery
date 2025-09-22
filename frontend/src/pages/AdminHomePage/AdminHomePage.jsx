import React from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';
import { FaClipboardList, FaTruck, FaUtensils, FaChartBar } from 'react-icons/fa';
import Title from '../../components/Title/Title';
import MenuButton from '../../components/MenuButton/MenuButton';
import styles from './AdminHomePage.module.css';

export default function AdminHomePage() {
  const navigate = useNavigate();

  return (
    <Layout>
      <Title>Добро пожаловать в FOODR ИС!</Title>
      <div className={styles['description']}>Выберите опцию:</div>

      <div className={styles.cta}>
        <MenuButton
          text="Заказы"
          icon={FaClipboardList}
          color="blue"
          onClick={() => navigate('/admin/orders')}
        />
        <MenuButton
          text="Учёт курьеров"
          icon={FaTruck}
          color="lightblue"
          onClick={() => navigate('/admin/couriers')}
        />
        <MenuButton
          text="Учёт блюд"
          icon={FaUtensils}
          color="skyblue"
          onClick={() => navigate('/admin/dishes')}
        />
        <MenuButton
          text="Анализ заказов"
          icon={FaChartBar}
          color="steelblue"
          onClick={() => navigate('/admin/analytics')}
        />
      </div>
    </Layout>
  );
}
