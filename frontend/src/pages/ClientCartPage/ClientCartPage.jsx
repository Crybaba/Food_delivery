import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useCart } from '../../context/CartContext';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Title from '../../components/Title/Title';
import Table from '../../components/Table/Table';
import Input from '../../components/Input/Input';
import Select from '../../components/Select/Select';
import Button from '../../components/Button/Button';
import Checkbox from '../../components/Checkbox/Checkbox';
import FormWrapper from '../../components/FormWrapper/FormWrapper';
import styles from './ClientCartPage.module.css'

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
    } catch { }
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
    } catch { }
  };

  const submitOrder = (e) => {
    e.preventDefault();
    if (!pickup) {
      saveRecentAddress({ street: address.street, house: address.house, entrance: address.entrance, flat: address.flat, intercom: address.intercom });
    }
    alert('Заказ оформлен (демо).');
    clear();
  };

  const columns = ['Название блюда', 'Кол-во (шт.)', 'Цена, ₽', 'Действия'];
  const data = items.map(item => [
    item.name,
    item.quantity,
    Number(item.price).toFixed(2),
    <div style={{ display: 'flex', gap: 8 }}>
      <Button text="Добавить" onClick={() => addItem({ id: item.id, name: item.name, price: item.price, image: item.image }, 1)} />
      <Button text="Удалить" onClick={() => removeItem(item.id)} />
    </div>
  ]);

  return (
    <Layout>
      <Title>Оформление заказа</Title>
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Корзина' }
        ]}
      />

      <div className="cart-panel">
        {items.length === 0 ? (
          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 32 }}>Корзина пуста</p>
        ) : (
          <Table columns={columns} data={data} />
        )}

        <div className="cart-total" style={{ textAlign: 'right', marginTop: 16 }}>
          Итого к оплате: <strong>{total.toFixed(2)}</strong>
        </div>

        <Checkbox label="Самовывоз" checked={pickup} onChange={(e) => setPickup(e.target.checked)} />

        <FormWrapper onSubmit={submitOrder} legend="">
            {!pickup && recent.length > 0 && (
              <Select
                label="Ваши адреса:"
                value=""
                size="long"
                onChange={(e) => {
                  const idx = Number(e.target.value);
                  if (!Number.isNaN(idx) && recent[idx]) {
                    const a = recent[idx];
                    setAddress({
                      ...address,
                      street: a.street || '',
                      house: a.house || '',
                      entrance: a.entrance || '',
                      flat: a.flat || '',
                      intercom: a.intercom || '',
                    });
                  }
                }}
                options={[
                  { value: '', label: '—' },
                  ...recent.map((a, i) => ({
                    value: i,
                    label: formatAddress(a),
                  })),
                ]}
                className={styles.fullWidth}
              />
            )}

            {!pickup && (
              <>
                <Input
                  label="Улица:"
                  size="long"
                  placeholder="ул. Введите название"
                  value={address.street}
                  onChange={(v) => setAddress({ ...address, street: v })}
                  className={styles.fullWidth}
                />

                <div className={styles.inlineRow}>
                  <Input
                    label="Дом:"
                    labelClassName={styles.inlineLabel}
                    placeholder="Дом"
                    value={address.house}
                    onChange={(v) => setAddress({ ...address, house: v })}
                    size="very-short"
                    className={styles.quarterWidth}
                  />
                  <Input
                    label="Подъезд:"
                    placeholder="№"
                    labelClassName={styles.inlineLabel}
                    value={address.entrance}
                    onChange={(v) => setAddress({ ...address, entrance: v })}
                    size="very-short"
                    className={styles.quarterWidth}
                  />
                  <Input
                    label="Квартира:"
                    placeholder="№"
                    labelClassName={styles.inlineLabel}
                    value={address.flat}
                    onChange={(v) => setAddress({ ...address, flat: v })}
                    size="very-short"
                    className={styles.quarterWidth}
                  />
                </div>
                <Input
                  label="Домофон:"
                  placeholder="Код"
                  value={address.intercom}
                  onChange={(v) => setAddress({ ...address, intercom: v })}
                  size="very-short"
                  className={styles.quarterWidth}
                />

                <Input
                  label="Телефон:"
                  isPhone
                  value={address.phone}
                  onChange={(v) => setAddress({ ...address, phone: v })}
                  className={styles.halfWidth}
                />
                <Input
                  label="Кол-во персон:"
                  type="number"
                  min={1}
                  value={address.persons}
                  onChange={(v) => setAddress({ ...address, persons: Number(v) })}
                   size="very-short"
                  className={styles.halfWidth}
                />

                <Input
                  label="Комментарий к заказу:"
                  labelTop
                  isText
                  placeholder="Текст"
                  value={address.comment}
                  onChange={(v) => setAddress({ ...address, comment: v })}
                  className={styles.fullWidth}
                />

                <Select
                  label="Способ оплаты:"
                  value={payment}
                  onChange={setPayment}
                  size="long"
                  options={[
                    { value: 'cash', label: 'Наличные' },
                    { value: 'card', label: 'Картой при получении' },
                  ]}
                  className={styles.fullWidth}
                />
              </>
            )}

            {pickup && (
              <>
                <Input
                  label="Телефон:"
                  isPhone
                  value={address.phone}
                  onChange={(v) => setAddress({ ...address, phone: v })}
                  className={styles.fullWidth}
                />
                <Input
                  label="Комментарий к заказу:"
                  labelTop
                  isText
                  placeholder="Текст"
                  value={address.comment}
                  onChange={(v) => setAddress({ ...address, comment: v })}
                  className={styles.fullWidth}
                />
              </>
            )}

          <div style={{ display: 'flex', justifyContent: 'center', marginTop: 16 }}>
            <Button type="submit" text="Оформить заказ" />
          </div>
        </FormWrapper>
      </div>
    </Layout>
  );
}
