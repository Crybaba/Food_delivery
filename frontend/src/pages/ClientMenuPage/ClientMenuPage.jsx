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
  const [dishes, setDishes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState(null);
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);

    fetchDishes({ is_available: true, ordering: 'name' })
      .then(json => {
        if (!mounted) return;
        // API может вернуть массив или объект с results
        const list = Array.isArray(json) ? json : json.results || [];
        setDishes(list);
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
    addItem(dish.id, qty);
    setToast({ item: dish, quantity: qty });
  };

  const categoryNames = {
    japan: 'Япония',
    china: 'Китай',
    chinese: 'Китай',
    korea: 'Корея',
    vietnam: 'Вьетнам',
    thai: 'Таиланд',
    asia: 'Остальная Азия',
    hot: 'Горячие блюда',
    snacks: 'Закуски',
    snack: 'Закуски',
    drinks: 'Напитки',
    drink: 'Напитки',
    soups: 'Супы',
    salads: 'Салаты',
    pizza: 'Пицца',
    desserts: 'Десерты',
    other: 'Прочее',
  };


  const grouped = dishes.reduce((acc, dish) => {
    const rawCat = (dish.category || 'other').toLowerCase();
    const cat = categoryNames[rawCat] || (rawCat.charAt(0).toUpperCase() + rawCat.slice(1));
    if (!acc[cat]) acc[cat] = [];
    acc[cat].push(dish);
    return acc;
  }, {});


  return (
    <Layout>
      <Title>Меню</Title>
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Меню' },
        ]}
      />

      {loading && <p className="text-center">Загрузка…</p>}
      {error && <p className="text-center" style={{ color: 'var(--accent)' }}>{error}</p>}

      {!loading && !error && (
        <div className={styles.container}>
          {Object.keys(grouped).length === 0 && (
            <p className="text-center">Меню пока пусто</p>
          )}

          {Object.keys(grouped).map(cat => (
            <section key={cat} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{cat}</h2>
              <div className={styles.grid}>
                {grouped[cat].map(dish => (
                  <MenuCard
                    key={dish.id}
                    title={dish.name}
                    image={dish.image}
                    price={dish.price}
                    description={dish.description}
                    weight={dish.weight}
                    calories={dish.calories}
                    dish={dish}
                    onAddToCart={(qty = 1) => handleAddToCart(dish, qty)}
                  />
                ))}
              </div>
            </section>
          ))}
        </div>
      )}

      <CartToast
        item={toast?.item}
        quantity={toast?.quantity}
        onClose={() => setToast(null)}
      />
    </Layout>
  );
}
