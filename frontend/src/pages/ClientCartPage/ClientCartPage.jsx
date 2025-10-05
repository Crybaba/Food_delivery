import React, { useState } from 'react';
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
import styles from './ClientCartPage.module.css';

export default function ClientCartPage() {
  const { cart, addItem, removeItem, clearAll, makeOrder } = useCart();

  const [pickup, setPickup] = useState(false);
  const [address, setAddress] = useState({
    street: '', house: '', entrance: '', flat: '',
    intercom: '', phone: '', persons: 1, comment: ''
  });
  const [payment, setPayment] = useState('cash');

  const total = cart?.total_price || 0;
  const items = cart?.items || [];

  const canDeliver = total >= 1000;

  const submitOrder = async (e) => {
    e.preventDefault();

    if (!pickup && !canDeliver) {
      alert('Доставка доступна только для заказов от 1000 ₽. Выберите самовывоз.');
      return;
    }

    const cleanPhone = address.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Введите корректный номер телефона из 10 цифр');
      return;
    }

    const orderData = {
      ...address,
      phone: cleanPhone,
      payment,
      pickup,
      items: items.map(item => ({
        dish_id: item.dish.id,
        quantity: item.quantity
      })),
      street: pickup ? '' : address.street,
      house: pickup ? '' : address.house,
      entrance: pickup ? '' : address.entrance,
      flat: pickup ? '' : address.flat,
      intercom: pickup ? '' : address.intercom,
      persons: pickup ? 1 : address.persons,
    };

    try {
      await makeOrder(orderData);
      clearAll();
      alert('Заказ оформлен!');
    } catch (err) {
      console.error(err);
      alert('Ошибка при оформлении заказа');
    }
  };

  const columns = [
    { key: 'name', label: 'Название блюда' },
    { key: 'quantity', label: 'Кол-во (шт.)', align: 'center', width: '120px' },
    { key: 'sum', label: 'Сумма, ₽', align: 'right', width: '120px' },
    { key: 'actions', label: 'Действия', align: 'center', width: '160px' },
  ];

  const data = items.map(item => ({
    name: item.dish.name,
    quantity: item.quantity,
    sum: (Number(item.dish.price) * item.quantity).toFixed(2),
    actions: (
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Button size="small" text="+" onClick={() => addItem(item.dish.id, 1)} />
        <Button size="small" text="–" onClick={() => removeItem(item.dish.id)} />
      </div>
    ),
  }));

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
          <p style={{ textAlign: 'center', color: '#6b7280', marginTop: 32 }}>
            Корзина пуста
          </p>
        ) : (
          <Table columns={columns} data={data} />
        )}

        <div className="cart-total" style={{ textAlign: 'right', marginTop: 16 }}>
          Итого к оплате: <strong>{total.toFixed(2)} ₽</strong>
        </div>
        {/* Чекбокс самовывоза с условием */}
        <Checkbox
          label="Самовывоз"
          checked={pickup}
          onChange={(e) => setPickup(e.target.checked)}
        />

        {!canDeliver && (
          <p style={{ color: 'red', textAlign: 'center', marginTop: 4 }}>
            Доставка недоступна для заказов меньше 1000 ₽
          </p>
        )}

        <FormWrapper onSubmit={submitOrder} legend="*-обязательно для заполнения">
          {!pickup ? (
            <>
              <div className={styles.formRow}>
                <label htmlFor="street">Улица:</label>
                <div className={styles.rowInput}>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(v) => setAddress({ ...address, street: v })}
                    size="long"
                    placeholder='Название улицы'
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Дом:</label>
                <div className={styles.rowInput}>
                  <Input
                    value={address.house}
                    onChange={(v) => setAddress({ ...address, house: v })}
                    size="very-short"
                    placeholder='№'
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Подъезд:</label>
                <div className={styles.rowInput}>
                  <Input
                    value={address.entrance}
                    onChange={(v) => setAddress({ ...address, entrance: v })}
                    size="very-short"
                    placeholder='№'
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Квартира:</label>
                <div className={styles.rowInput}>
                  <Input
                    value={address.flat}
                    onChange={(v) => setAddress({ ...address, flat: v })}
                    size="very-short"
                    placeholder='№'
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Домофон:</label>
                <div className={styles.rowInput}>
                  <Input
                    value={address.intercom}
                    onChange={(v) => setAddress({ ...address, intercom: v })}
                    size="very-short"
                    placeholder='№'
                  />
                </div>
              </div>
           <div className={styles.formRow}>
                <label>Телефон:</label>
                <div className={styles.rowInput}>
                  <Input
                    value={address.phone}
                    onChange={(v) => setAddress({ ...address, phone: v })}
                    isPhone
                    size="phone"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Кол-во персон:</label>
                <div className={styles.rowInput}>
                  <Input
                    type="number"
                    min={1}
                    value={address.persons}
                    onChange={(v) => setAddress({ ...address, persons: Number(v) })}
                    size="very-short"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Комментарий к заказу:</label>
                <div className={styles.rowInput}>
                  <Input
                    value={address.comment}
                    onChange={(v) => setAddress({ ...address, comment: v })}
                    isText
                    labelTop
                    placeholder='Введите текст:'
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Способ оплаты:</label>
                <Select
                  value={payment}
                  onChange={setPayment}
                  size="medium"
                  options={[
                    { value: 'cash', label: 'Наличные' },
                    { value: 'card', label: 'Картой при получении' },
                  ]}
                  className={styles.fullWidth}
                />
              </div>
            </>
          ) : (
            <>
              <div className={styles.formRow}>
                <label>Телефон:</label>
                <div className={styles.rowInput}>
                  <Input
                    value={address.phone}
                    onChange={(v) => setAddress({ ...address, phone: v })}
                    isPhone
                    size="phone"
                  />
                </div>
              </div>

              <div className={styles.formRow}>
                <label>Комментарий к заказу:</label>
                <div className={styles.rowInput}>
                  <Input
                    value={address.comment}
                    onChange={(v) => setAddress({ ...address, comment: v })}
                    isText
                    labelTop
                    className={styles.fullWidth}
                  />
                </div>
              </div>
            </>
          )}

          <Button type="submit" text="Оформить заказ" />
        </FormWrapper>
      </div >
    </Layout >
  );
}
