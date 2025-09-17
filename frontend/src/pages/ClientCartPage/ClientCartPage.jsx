import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useCart } from '../../context/CartContext';

export default function ClientCartPage() {
  const { items, addItem, removeItem, clear } = useCart();
  const [pickup, setPickup] = useState(false);
  const [address, setAddress] = useState({ street: '', house: '', entrance: '', flat: '', intercom: '', phone: '', persons: 1, comment: '' });
  const [recent, setRecent] = useState([]);
  const [payment, setPayment] = useState('cash');

  const total = useMemo(() => items.reduce((s, i) => s + Number(i.price) * i.quantity, 0), [items]);

  useEffect(() => {
    try {
      const raw = localStorage.getItem('addresses.recent');
      if (raw) setRecent(JSON.parse(raw));
    } catch {}
  }, []);

  const formatAddress = (a) => `ул. ${a.street || ''}, д. ${a.house || ''}${a.flat ? ', кв. ' + a.flat : ''}`.trim();

  const saveRecentAddress = (a) => {
    try {
      const current = Array.isArray(recent) ? recent : [];
      const key = JSON.stringify(a);
      const filtered = current.filter(x => JSON.stringify(x) !== key);
      const next = [a, ...filtered].slice(0, 5);
      setRecent(next);
      localStorage.setItem('addresses.recent', JSON.stringify(next));
    } catch {}
  };

  const submitOrder = (e) => {
    e.preventDefault();
    // Пока без бэка: просто очистим корзину
    if (!pickup) {
      saveRecentAddress({ street: address.street, house: address.house, entrance: address.entrance, flat: address.flat, intercom: address.intercom });
    }
    alert('Заказ оформлен (демо).');
    clear();
  };

  return (
    <Layout>
      <h1 className="title-center title-blue">Оформление заказа</h1>
      <div className="breadcrumbs"><a href="/">Главная</a> / <span>Корзина</span></div>

      <div className="cart-panel">
        <table className="cart-table">
          <thead>
            <tr>
              <th>Название блюда</th>
              <th>Кол-во (шт.)</th>
              <th>Цена, ₽</th>
              <th>Действия</th>
            </tr>
          </thead>
          <tbody>
            {items.length === 0 && (
              <tr>
                <td colSpan={4} style={{ textAlign: 'center', color: '#6b7280' }}>Корзина пуста</td>
              </tr>
            )}
            {items.map(row => (
              <tr key={row.id}>
                <td>{row.name}</td>
                <td>{row.quantity}</td>
                <td>{Number(row.price).toFixed(2)}</td>
                <td className="actions">
                  <button className="link-action" onClick={() => addItem({ id: row.id, name: row.name, price: row.price, image: row.image }, 1)}>Добавить</button>
                  <button className="link-action" onClick={() => removeItem(row.id)}>Удалить</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="cart-total">Итого к оплате: <strong>{total.toFixed(2)}</strong></div>

        <label className="pickup"><input type="checkbox" checked={pickup} onChange={(e)=>setPickup(e.target.checked)} /> Самовывоз</label>

        <form className="delivery-form" onSubmit={submitOrder}>
          {!pickup && (
          <div className="df-grid" style={{ gridTemplateColumns: '160px 1fr 0 0' }}>
            <span className="df-label">Ваши адреса:</span>
            <select className="form-select" onChange={(e)=>{
              const idx = Number(e.target.value);
              if (!Number.isNaN(idx) && recent[idx]) {
                const a = recent[idx];
                setAddress({ ...address, street: a.street||'', house: a.house||'', entrance: a.entrance||'', flat: a.flat||'', intercom: a.intercom||'' });
              }
            }}>
              <option value="">—</option>
              {recent.map((a,i)=> (
                <option key={i} value={i}>{formatAddress(a)}</option>
              ))}
            </select>
            <span />
            <span />
          </div>
          )}

          {!pickup && (
          <>
          <div className="df-row"><span className="df-label">Введите адрес:</span></div>

          <div className="df-grid">
            <span className="df-label">Улица:</span>
            <input className="form-input" placeholder="ул. Введите название" value={address.street} onChange={(e)=>setAddress({...address, street:e.target.value})} />

            <span className="df-label">Дом:</span>
            <input className="form-input small" placeholder="дом" value={address.house} onChange={(e)=>setAddress({...address, house:e.target.value})} />

            <span className="df-label">Подъезд:</span>
            <input className="form-input small" placeholder="Номер подъезда" value={address.entrance} onChange={(e)=>setAddress({...address, entrance:e.target.value})} />

            <span className="df-label">Квартира:</span>
            <input className="form-input small" placeholder="Номер квартиры" value={address.flat} onChange={(e)=>setAddress({...address, flat:e.target.value})} />

            <span className="df-label">Домофон:</span>
            <input className="form-input small" placeholder="Код" value={address.intercom} onChange={(e)=>setAddress({...address, intercom:e.target.value})} />

            <span className="df-label">Телефон:</span>
            <input className="form-input" placeholder="+7 (___) ___-__-__" value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} />

            <span className="df-label">Кол-во персон:</span>
            <input className="form-input small" type="number" min={1} value={address.persons} onChange={(e)=>setAddress({...address, persons:Number(e.target.value)})} />

            <span className="df-label">Комментарий к заказу:</span>
            <input className="form-input" placeholder="Текст" value={address.comment} onChange={(e)=>setAddress({...address, comment:e.target.value})} />
          </div>
          </>
          )}

          {!pickup && (
          <div className="df-grid" style={{ gridTemplateColumns: '160px 1fr 0 0' }}>
            <span className="df-label">Способ оплаты:</span>
            <select className="form-select" value={payment} onChange={(e)=>setPayment(e.target.value)}>
              <option value="cash">Наличные</option>
              <option value="card">Картой при получении</option>
            </select>
            <span />
            <span />
          </div>
          )}

          {pickup && (
            <div className="df-grid" style={{ gridTemplateColumns: '160px 1fr 0 0' }}>
              <span className="df-label">Телефон:</span>
              <input className="form-input" placeholder="+7 (___) ___-__-__" value={address.phone} onChange={(e)=>setAddress({...address, phone:e.target.value})} />
              <span />
              <span />
              <span className="df-label">Комментарий к заказу:</span>
              <input className="form-input" placeholder="Текст" value={address.comment} onChange={(e)=>setAddress({...address, comment:e.target.value})} />
              <span />
              <span />
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <button type="submit" className="form-submit" style={{ minWidth: 300 }}>Оформить заказ</button>
          </div>
        </form>
      </div>

 
    </Layout>
  );
}


