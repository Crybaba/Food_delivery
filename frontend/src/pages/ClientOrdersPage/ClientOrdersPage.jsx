import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Title from '../../components/Title/Title';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Table from '../../components/Table/Table';
import Select from '../../components/Select/Select';
import { fetchUserOrders } from '../../lib/api';
import OrderDetailsModal from '../../components/OrderDetailsModal/OrderDetailsModal';
import styles from './ClientOrdersPage.module.css';

export default function ClientOrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState('');

  useEffect(() => {
    async function loadOrders() {
      setLoading(true);
      try {
        const data = await fetchUserOrders();
        setOrders(data.results || []);
      } catch (err) {
        console.error(err);
        setOrders([]);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  const statusOrder = ['processing', 'preparing', 'delivering', 'completed'];
  const sortedOrders = [...orders].sort(
    (a, b) => statusOrder.indexOf(a.status) - statusOrder.indexOf(b.status)
  );

  const filteredOrders = statusFilter
    ? sortedOrders.filter(o => o.status === statusFilter)
    : sortedOrders;

  const columns = [
    { key: 'id', label: 'ID заказа', align: 'center', width: '100px' },
    { key: 'created_at', label: 'Дата', align: 'left', width: '200px' },
    { key: 'total', label: 'Сумма, ₽', align: 'right', width: '120px' },
    { key: 'status', label: 'Статус', align: 'left', width: '150px' },
  ];

  const data = filteredOrders.map(order => ({
    id: order.id,
    created_at: new Date(order.created_at).toLocaleString(),
    total: order.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0).toFixed(2),
    status: order.status,
    onClick: () => setSelectedOrder(order),
  }));

  return (
    <Layout>
      <Title>Мои заказы</Title>
      <Breadcrumbs items={[{ label: 'Главная', to: '/' }, { label: 'Мои заказы' }]} />

      <div style={{ marginBottom: 16 }}>
        <label>Фильтр по статусу: </label>
        <Select
          value={statusFilter}
          onChange={setStatusFilter}
          size="medium"
          options={[
            { value: '', label: 'Все' },
            { value: 'processing', label: 'В обработке' },
            { value: 'preparing', label: 'Готовится' },
            { value: 'delivering', label: 'Доставляется' },
            { value: 'completed', label: 'Завершён' },
          ]}
        />
      </div>

      {loading ? (
        <p>Загрузка заказов...</p>
      ) : filteredOrders.length === 0 ? (
        <p>У вас пока нет заказов</p>
      ) : (
        <Table
          columns={columns}
          data={data.map(d => ({
            ...d,
            id: (
              <button
                className={styles.orderIdButton}
                onClick={d.onClick}
              >
                {d.id}
              </button>
            )
          }))}
        />
      )}

      <OrderDetailsModal
        order={selectedOrder}
        onClose={() => setSelectedOrder(null)}
      />
    </Layout>
  );
}
