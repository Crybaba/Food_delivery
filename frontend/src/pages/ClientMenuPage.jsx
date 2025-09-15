import React, { useEffect, useState } from 'react';
import Layout from '../components/Layout';
import { fetchDishes } from '../lib/api';
import { useCart } from '../context/CartContext';

export default function ClientMenuPage() {
  const [data, setData] = useState({ results: [], count: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { addItem } = useCart();

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    fetchDishes({ is_available: true, ordering: 'name' })
      .then(json => { if (mounted) { setData(Array.isArray(json) ? { results: json, count: json.length } : json); } })
      .catch(() => { if (mounted) setError('Не удалось загрузить меню'); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  return (
    <Layout>
      <h1 className="title-center title-blue">Меню</h1>
      {loading && <p className="text-center">Загрузка…</p>}
      {error && <p className="text-center" style={{ color: 'var(--accent)' }}>{error}</p>}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
        {data.results.map(dish => (
          <div key={dish.id} style={{ border: '1px solid #e5e7eb', borderRadius: 12, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ aspectRatio: '4/3', background: '#f3f4f6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {dish.image ? (
                <img src={dish.image} alt={dish.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span style={{ color: '#9ca3af' }}>Нет изображения</span>
              )}
            </div>
            <div style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 6 }}>
              <div style={{ fontWeight: 800 }}>{dish.name}</div>
              <div style={{ color: '#6b7280', minHeight: 38 }}>{dish.description}</div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ fontWeight: 900 }}>{dish.price} ₽</div>
                <button onClick={() => addItem(dish, 1)} className="nav-btn" style={{ width: 140 }}>В корзину</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </Layout>
  );
}


