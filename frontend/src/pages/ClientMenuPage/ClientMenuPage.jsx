import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { fetchDishes } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import Title from '../../components/Title/Title';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import MenuCard from '../../components/MenuCard/MenuCard';
import CartToast from '../../components/CartToast/CartToast'; 
import styles from './ClientMenuPage.module.css';

export default function ClientMenuPage() {
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null); // ✅ состояние для всплывашки
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchDishes({ is_available: true, ordering: 'name' })
      .then(json => {
        if (mounted) {
          const processedData = Array.isArray(json)
            ? { results: json, count: json.length }
            : json;
          setData(processedData);
        }
      })
      .catch(() => {
        if (mounted) setError('Не удалось загрузить меню');
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const handleAddToCart = (dish, qty = 1) => {
    addItem(dish.id, qty); // отправляем только id на бэкенд
    setToast({ item: dish, quantity: qty }); // для всплывашки оставляем весь объект
  };

  return (
    <Layout>
      <Title>Меню</Title>
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Меню' }
        ]}
      />

      {loading && <p className="text-center">Загрузка…</p>}
      {error && <p className="text-center" style={{ color: 'var(--accent)' }}>{error}</p>}

      <div className={styles.container}>
        <div className={styles.grid}>
          {data.results.map(dish => (
            <MenuCard
              key={dish.id}
              title={dish.name}
              image={dish.image}
              price={dish.price}
              description={dish.description}
              calories={dish.calories}
              dish={dish}
              onAddToCart={(qty = 1) => handleAddToCart(dish, qty)}
            />
          ))}
        </div>
      </div>

      {/* Всплывашка */}
      <CartToast
        item={toast?.item}
        quantity={toast?.quantity}
        onClose={() => setToast(null)}
      />
    </Layout>
  );
}
