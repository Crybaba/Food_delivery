import React from 'react';
import styles from './OrderDetailsModal.module.css';
import Table from '../Table/Table';

export default function OrderDetailsModal({ order, onClose }) {
  if (!order) return null;

  const columns = [
    { key: 'dish', label: 'Блюдо' },
    { key: 'quantity', label: 'Кол-во', align: 'center', width: '80px' },
    { key: 'price', label: 'Цена, ₽', align: 'right', width: '100px' },
    { key: 'sum', label: 'Сумма, ₽', align: 'right', width: '120px' }
  ];

  const data = order.items.map((item, idx) => ({
    dish: item.dish_name || item.dish,
    quantity: item.quantity,
    price: item.price || 0,
    sum: ((Number(item.price) || 0) * item.quantity).toFixed(2)
  }));

  const total = data.reduce((acc, item) => acc + Number(item.sum), 0).toFixed(2);

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>&times;</button>

        <div className={styles.header}>
          <h2 className={styles.title}>Заказ #{order.id}</h2>
          <p className={styles.meta}>Статус: {order.status}</p>
        </div>

        <div className={styles.info}>
          <p><strong>Адрес:</strong> {order.pickup ? 'Самовывоз' : `${order.street}, ${order.house}, кв.${order.flat}`}</p>
          <p><strong>Телефон:</strong> {order.phone}</p>
          <p><strong>Курьер:</strong> {order.courier || 'Не назначен'}</p>
          <p><strong>Комментарий:</strong> {order.comment || '-'}</p>

          <h3>Состав заказа:</h3>
          <Table columns={columns} data={data} />

          <p className={styles.priceLabel}>
            Итого: <span className={styles.price}>{total} ₽</span>
          </p>
        </div>
      </div>
    </div>
  );
}
