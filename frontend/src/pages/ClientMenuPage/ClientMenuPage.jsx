import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { fetchDishes } from '../../lib/api';
import { useCart } from '../../context/CartContext';
import Title from '../../components/Title/Title';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import MenuCard from '../../components/MenuCard/MenuCard';
import styles from './ClientMenuPage.module.css';

export default function ClientMenuPage() {
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    console.log('ClientMenuPage: Starting to fetch dishes...');

    fetchDishes({ is_available: true, ordering: 'name' })
      .then(json => {
        console.log('ClientMenuPage: Received data:', json);
        if (mounted) {
          // если API вернёт массив — оборачиваем в {results, count}
          const processedData = Array.isArray(json)
            ? { results: json, count: json.length }
            : json;
          console.log('ClientMenuPage: Processed data:', processedData);
          setData(processedData);
        }
      })
      .catch(error => {
        console.error('ClientMenuPage: Error fetching dishes:', error);
        if (mounted) setError('Не удалось загрузить меню');
      })
      .finally(() => {
        console.log('ClientMenuPage: Fetch completed');
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  console.log('ClientMenuPage: Render state:', { loading, error, dataCount: data.results.length });

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
          {data.results.map(dish => {
            console.log('ClientMenuPage: Rendering dish:', dish);
            return (
              <MenuCard
                key={dish.id}
                title={dish.name}
                image={dish.image}
                price={dish.price}
                description={dish.description}
                calories={dish.calories}
                dish={dish}
                onAddToCart={(qty = 1) => addItem(dish, qty)}
              />
            );
          })}
        </div>
      </div>
    </Layout>
  );
}
