import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Table/Table';
import Select from '../../components/Select/Select';
import Title from '../../components/Title/Title';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import { fetchAdminOrders, fetchCouriers, assignCourier, updateOrderStatus } from '../../lib/api';
import OrderDetailsModal from '../../components/OrderDetailsModal/OrderDetailsModal';
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker';
import styles from './AdminOrdersPage.module.css';

export default function AdminOrdersPage() {
    const [orders, setOrders] = useState([]);
    const [couriers, setCouriers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedOrder, setSelectedOrder] = useState(null);

    // фильтры
    const [courierFilter, setCourierFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [sortOrder, setSortOrder] = useState('desc');

    // период
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });

    // Загрузка заказов и курьеров
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [ordersData, couriersData] = await Promise.all([
                    fetchAdminOrders(),  // теперь все заказы
                    fetchCouriers(),
                ]);

                setOrders(ordersData.map(order => ({
                    ...order,
                    courier: order.courier || null,
                })));
                setCouriers(couriersData || []);
            } catch (err) {
                console.error(err);
                setOrders([]);
                setCouriers([]);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    // Сохранение изменений заказа
    async function handleSaveOrder(orderId, courierId, status) {
        try {
            let updatedOrder = null;

            if (courierId !== undefined) {
                const courierToSend = courierId === '' ? null : Number(courierId);
                updatedOrder = await assignCourier(orderId, courierToSend);
            }

            if (status !== undefined) {
                updatedOrder = await updateOrderStatus(orderId, status);
            }

            if (!updatedOrder) {
                updatedOrder = orders.find(o => o.id === orderId);
            }

            setOrders(prev => prev.map(o => (o.id === orderId ? updatedOrder : o)));
            setSelectedOrder(null);
        } catch (err) {
            console.error('Ошибка при сохранении заказа:', err);
        }
    }

    // фильтрация по курьеру, статусу и дате
    const filteredOrders = orders
        .filter(o => !courierFilter || Number(o.courier) === Number(courierFilter))
        .filter(o => !statusFilter || o.status === statusFilter)
        .filter(o => {
            if (!dateRange.startDate && !dateRange.endDate) return true;

            const orderDate = new Date(o.created_at);
            const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
            const end = dateRange.endDate ? new Date(dateRange.endDate) : null;

            if (start && orderDate < start) return false;
            if (end) {
                const endOfDay = new Date(end);
                endOfDay.setHours(23, 59, 59, 999);
                if (orderDate > endOfDay) return false;
            }

            return true;
        })
        .sort((a, b) => {
            const dateA = new Date(a.created_at);
            const dateB = new Date(b.created_at);
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        });

     const columns = [
        { key: 'id', label: 'ID', width: '80px', align: 'center' },
        { key: 'user_name', label: 'ФИО клиента', width: '200px' },
        { key: 'user_phone', label: 'Телефон', width: '150px' }, 
        { key: 'courier_name', label: 'ФИО курьера', width: '200px' },
        { key: 'created_at', label: 'Дата', width: '180px' },
        { key: 'total', label: 'Сумма, ₽', width: '120px', align: 'right' },
        { key: 'status', label: 'Статус', width: '150px' },
    ];


    const statusMap = {
        processing: 'В обработке',
        preparing: 'Готовится',
        delivering: 'Доставляется',
        completed: 'Завершён',
        cancelled: 'Отменён',
    };

     const data = filteredOrders.map(order => ({
        id: (
            <button
                className={styles.orderIdButton}
                onClick={() => setSelectedOrder(order)}
            >
                {order.id}
            </button>
        ),
        user_name: order.user_name,
        user_phone: order.phone || '—',
        courier_name: order.courier_name || '—',
        created_at: new Date(order.created_at).toLocaleString(),
        total: order.items
            .reduce((sum, i) => sum + Number(i.price) * i.quantity, 0)
            .toFixed(2),
        status: statusMap[order.status] || 'Неизвестен',
        courier: order.courier || null,
    }));

    return (
        <Layout>
            <Title>Заказы (Админ)</Title>
            <Breadcrumbs items={[{ label: 'Главная', to: '/admin' }, { label: 'Заказы' }]} />

            <div className={styles.filterSection}>
                <div className={styles.filterItem}>
                    <label>Фильтр по курьеру:</label>
                    <Select
                        value={courierFilter}
                        onChange={setCourierFilter}
                        options={[
                            { value: '', label: 'Все' },
                            ...couriers.map(c => ({
                                value: c.id,
                                label: `${c.surname} ${c.name}${c.patronymic ? ' ' + c.patronymic : ''}`.trim(),
                            })),
                        ]}
                    />
                </div>

                <div className={styles.filterItem}>
                    <label>Фильтр по статусу:</label>
                    <Select
                        value={statusFilter}
                        onChange={setStatusFilter}
                        options={[
                            { value: '', label: 'Все' },
                            { value: 'processing', label: 'В обработке' },
                            { value: 'preparing', label: 'Готовится' },
                            { value: 'delivering', label: 'Доставляется' },
                            { value: 'completed', label: 'Завершён' },
                        ]}
                    />
                </div>

                <div className={styles.filterItem}>
                    <label>Сортировка по дате:</label>
                    <Select
                        value={sortOrder}
                        onChange={setSortOrder}
                        size='long'
                        options={[
                            { value: 'desc', label: 'Сначала новые' },
                            { value: 'asc', label: 'Сначала старые' },
                        ]}
                    />
                </div>

                <div className={styles.filterItem}>
                    <label>Период:</label>
                    <DateRangePicker
                        startDate={dateRange.startDate}
                        endDate={dateRange.endDate}
                        onChange={setDateRange}
                    />
                </div>
            </div>

            {loading ? <p>Загрузка...</p> :
                <Table columns={columns} data={data} />
            }

            <OrderDetailsModal
                order={selectedOrder}
                onClose={() => setSelectedOrder(null)}
                couriers={couriers}
                orders={orders}
                onAssignCourier={handleSaveOrder}
            />
        </Layout>
    );
}
