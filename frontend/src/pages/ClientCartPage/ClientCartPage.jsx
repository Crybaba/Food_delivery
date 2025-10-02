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

  const submitOrder = async (e) => {
    e.preventDefault();

    // Очистка телефона
    const cleanPhone = address.phone.replace(/\D/g, '');
    if (cleanPhone.length !== 10) {
      alert('Введите корректный номер телефона из 10 цифр');
      return;
    }

    // Формируем объект для бэка
    const orderData = {
      ...address,
      phone: cleanPhone,
      payment,
      pickup,
      items: items.map(item => ({
        dish_id: item.dish.id,
        quantity: item.quantity
      })),
      // если самовывоз, заполняем адрес дефолтами
      street: pickup ? '' : address.street,
      house: pickup ? '' : address.house,
      entrance: pickup ? '' : address.entrance,
      flat: pickup ? '' : address.flat,
      intercom: pickup ? '' : address.intercom,
      persons: pickup ? 1 : address.persons,
    };

    try {
      await makeOrder(orderData); // эта функция вызывает API /orders/create/
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

        <Checkbox
          label="Самовывоз"
          checked={pickup}
          onChange={(e) => setPickup(e.target.checked)}
        />

        <FormWrapper onSubmit={submitOrder} legend="">
          <div className={styles.formGrid}>
            {!pickup ? (
              <>
                <div className={styles.formRow}>
                  <label htmlFor="street">Улица:</label>
                  <Input
                    id="street"
                    value={address.street}
                    onChange={(v) => setAddress({ ...address, street: v })}
                    size="long"
                    placeholder='Название улицы'
                  />
                </div>

                <div className={styles.formRow}>
                  <label>Дом:</label>
                  <Input
                    value={address.house}
                    onChange={(v) => setAddress({ ...address, house: v })}
                    size="very-short"
                    placeholder='№'
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Подъезд:</label>
                  <Input
                    value={address.entrance}
                    onChange={(v) => setAddress({ ...address, entrance: v })}
                    size="very-short"
                    placeholder='№'
                  />
                </div>
                <div className={styles.formRow}>
                  <label>Квартира:</label>
                  <Input
                    value={address.flat}
                    onChange={(v) => setAddress({ ...address, flat: v })}
                    size="very-short"
                    placeholder='№'
                  />
                </div>

                <div className={styles.formRow}>
                  <label>Домофон:</label>
                  <Input
                    value={address.intercom}
                    onChange={(v) => setAddress({ ...address, intercom: v })}
                    size="very-short"
                    placeholder='№'
                  />
                  <label>Телефон:</label>
                  <Input
                    value={address.phone}
                    onChange={(v) => setAddress({ ...address, phone: v })}
                    isPhone
                    size="phone"
                  />
                </div>

                <div className={styles.formRow}>
                  <label>Кол-во персон:</label>
                  <Input
                    type="number"
                    min={1}
                    value={address.persons}
                    onChange={(v) => setAddress({ ...address, persons: Number(v) })}
                    size="very-short"
                  />
                </div>

                <div className={styles.formRow}>
                  <label>Комментарий к заказу:</label>
                  <Input
                    value={address.comment}
                    onChange={(v) => setAddress({ ...address, comment: v })}
                    isText
                    labelTop
                    placeholder='Введите текст:'
                  />
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
                  <Input
                    value={address.phone}
                    onChange={(v) => setAddress({ ...address, phone: v })}
                    isPhone
                    size="phone"
                  />
                </div>

                <div className={styles.formRow}>
                  <label>Комментарий к заказу:</label>
                  <Input
                    value={address.comment}
                    onChange={(v) => setAddress({ ...address, comment: v })}
                    isText
                    labelTop
                    className={styles.fullWidth}
                  />
                </div>
              </>
            )}
          </div>

          <Button type="submit" text="Оформить заказ" />
        </FormWrapper>
      </div >
    </Layout >
  );
}
