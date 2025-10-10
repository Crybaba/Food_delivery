import React, { useState, useEffect } from 'react';
import styles from './OrderDetailsModal.module.css';
import Table from '../Table/Table';
import Button from '../Button/Button';
import Select from '../Select/Select';
import { useAuth } from '../../context/AuthContext';

export default function OrderDetailsModal({ order, onClose, couriers = [], orders = [], onAssignCourier }) {
  const { role } = useAuth();

  const [selectedCourier, setSelectedCourier] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  useEffect(() => {
    if (order) {
      // Если courier — число (ID), приводим к строке
      setSelectedCourier(
        order.courier ? order.courier.toString() : ''
      );
      setSelectedStatus(order.status || '');
    }
  }, [order]);

  if (!order) return null;

  const columns = [
    { key: 'dish', label: 'Блюдо' },
    { key: 'quantity', label: 'Кол-во', align: 'center', width: '80px' },
    { key: 'price', label: 'Цена, ₽', align: 'right', width: '100px' },
    { key: 'sum', label: 'Сумма, ₽', align: 'right', width: '120px' }
  ];

  const data = order.items.map(item => ({
    dish: item.dish?.name || '—',
    quantity: item.quantity,
    price: item.price || 0,
    sum: ((Number(item.price) || 0) * item.quantity).toFixed(2),
  }));

  const total = data.reduce((acc, item) => acc + Number(item.sum), 0).toFixed(2);

  const statusOptions = [
    { value: 'processing', label: 'В обработке' },
    { value: 'preparing', label: 'Готовится' },
    { value: 'delivering', label: 'Доставляется' },
    { value: 'completed', label: 'Завершён' },
  ];

  const courierOptions = [
    { value: '', label: 'Не назначен' },
    ...couriers.map(c => {
      const unfinishedCount = orders.filter(
        o => o.courier === c.id && o.status !== 'completed'
      ).length;
      return {
        value: c.id.toString(),
        label: `${c.surname || ''} ${c.name || ''}${c.patronymic ? ' ' + c.patronymic : ''} (${unfinishedCount} активно)`
      };
    })
  ];

  // 🧩 Получаем имя курьера для отображения
  const courierName = (() => {
    if (order.courier_name) return order.courier_name;
    const courier = couriers.find(c => c.id === Number(order.courier));
    if (courier)
      return `${courier.surname || ''} ${courier.name || ''}`.trim() || '—';
    return '—';
  })();

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>&times;</button>

        <div className={styles.header}>
          <h2 className={styles.title}>Заказ #{order.id}</h2>
          <p className={styles.meta}>
            Статус:{' '}
            {role === 'ADMIN' ? (
              <Select
                value={selectedStatus}
                onChange={setSelectedStatus}
                options={statusOptions}
                size="small"
              />
            ) : (
              <span className={styles.status}>{order.status}</span>
            )}
          </p>
        </div>

        <div className={styles.info}>
          <div className={styles.infoRow}>
            <span className={styles.label}>Адрес:</span>
            <span>
              {order.pickup
                ? 'Самовывоз'
                : `${order.street}, ${order.house}, кв.${order.flat}`}
            </span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Телефон:</span>
            <span>+7{order.phone}</span>
          </div>

          <div className={styles.infoRow}>
            <span className={styles.label}>Курьер:</span>
            {role === 'ADMIN' ? (
              <Select
                value={selectedCourier}
                onChange={setSelectedCourier}
                options={courierOptions}
                size="long"
              />
            ) : (
              <span>{courierName}</span>
            )}
          </div>

          {order.comment && (
            <div className={styles.commentRow}>
              <span className={styles.label}>Комментарий:</span>
              <span>{order.comment}</span>
            </div>
          )}
        </div>

        <Table columns={columns} data={data} />

        <div className={styles.total}>
          <strong>Итого: {total} ₽</strong>
        </div>

        {role === 'ADMIN' && (
          <Button
            text="Сохранить"
            color="orange"
            onClick={() =>
              onAssignCourier(order.id, selectedCourier, selectedStatus)
            }
          />
        )}
      </div>
    </div>
  );
}
