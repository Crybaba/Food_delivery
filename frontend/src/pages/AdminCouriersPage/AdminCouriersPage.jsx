import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Table/Table';
import Select from '../../components/Select/Select';
import Title from '../../components/Title/Title';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/Button';
import FormWrapper from '../../components/FormWrapper/FormWrapper';
import {
    fetchCouriers,
    fetchAllUsers,
    fetchAdminOrders,
    addCourierByPhone,
    removeCourier,
} from '../../lib/api';
import styles from './AdminCouriersPage.module.css';

export default function AdminCouriersPage() {
    const [couriers, setCouriers] = useState([]);
    const [orders, setOrders] = useState([]);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    const [statusFilter, setStatusFilter] = useState('');
    const [phone, setPhone] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    // ---------------------------
    // Загрузка данных
    // ---------------------------
    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const [couriersData, ordersData, usersData] = await Promise.all([
                    fetchCouriers(),
                    fetchAdminOrders(),
                    fetchAllUsers(),
                ]);

                setCouriers(couriersData || []);
                setOrders(ordersData.results || []);
                setUsers(usersData || []);
            } catch (err) {
                console.error('Ошибка загрузки данных:', err);
            } finally {
                setLoading(false);
            }
        }

        loadData();
    }, []);

    // ---------------------------
    // Рассчитываем занятость
    // ---------------------------
    const couriersWithStatus = couriers.map(c => {
        const activeOrders = orders.filter(
            o => Number(o.courier) === Number(c.id) && o.status !== 'completed'
        );
        return {
            ...c,
            isBusy: activeOrders.length > 0,
            activeCount: activeOrders.length,
        };
    });

    const filteredCouriers = couriersWithStatus.filter(c => {
        if (!statusFilter) return true;
        if (statusFilter === 'busy') return c.isBusy;
        if (statusFilter === 'free') return !c.isBusy;
        return true;
    });

    // ---------------------------
    // Добавление курьера
    // ---------------------------
    async function handleAddCourier(e) {
        e.preventDefault();
        setActionLoading(true);
        try {
            const normalized = phone.replace(/\D/g, '');
            const user = users.find(u => u.phone?.replace(/\D/g, '') === normalized);

            if (!user) {
                alert('Пользователь с таким телефоном не найден');
                return;
            }

            await addCourierByPhone(normalized);
            alert('Курьер успешно добавлен');

            const updatedCouriers = await fetchCouriers();
            setCouriers(updatedCouriers);
        } catch (err) {
            console.error('Ошибка при добавлении курьера:', err);
            alert('Ошибка при добавлении курьера');
        } finally {
            setActionLoading(false);
            setPhone('');
        }
    }

    // ---------------------------
    // Удаление курьера
    // ---------------------------
    async function handleRemoveCourier(courierId) {
        if (!window.confirm('Удалить курьера?')) return;
        setActionLoading(true);

        try {
            await removeCourier(courierId);
            alert('Курьер удалён');
            const updatedCouriers = await fetchCouriers();
            setCouriers(updatedCouriers);
        } catch (err) {
            console.error('Ошибка при удалении курьера:', err);
            alert('Ошибка при удалении курьера');
        } finally {
            setActionLoading(false);
        }
    }

    // ---------------------------
    // Таблица
    // ---------------------------
    const columns = [
        { key: 'fio', label: 'ФИО', width: '250px' },
        { key: 'phone', label: 'Телефон', width: '160px' },
        { key: 'status', label: 'Занятость', width: '140px' },
        { key: 'actions', label: '', width: '120px', align: 'center' },
    ];

    const data = filteredCouriers.map(c => ({
        fio: `${c.surname} ${c.name}${c.patronymic ? ' ' + c.patronymic : ''}`.trim(),
        phone: c.phone,
        status: c.isBusy ? `Занят (${c.activeCount})` : 'Свободен',
        actions: (
            <Button
                text='Удалить'
                size='medium'
                radius='md'
                onClick={() => handleRemoveCourier(c.id)}
                disabled={actionLoading}
            />
        ),
    }));

    // ---------------------------
    // Рендер
    // ---------------------------
    return (
        <Layout>
            <Title>Курьеры</Title>
            <Breadcrumbs items={[{ label: 'Главная', to: '/admin' }, { label: 'Курьеры' }]} />
            <div className={styles.toolSection}>
                {/* фильтры */}
                <div className={styles.filterSection}>
                    <div className={styles.filterItem}>
                        <label>Фильтр по занятости:</label>
                        <Select
                            value={statusFilter}
                            onChange={setStatusFilter}
                            options={[
                                { value: '', label: 'Все' },
                                { value: 'busy', label: 'Занятые' },
                                { value: 'free', label: 'Свободные' },
                            ]}
                        />
                    </div>
                </div>

                {/* добавление курьера */}
                <FormWrapper
                    onSubmit={handleAddCourier}
                    legend="* — обязательно для заполнения"
                >
                    <div className={styles.formItem}>
                        <label htmlFor="phone">Телефон:</label>
                        <Input
                            id="phone"
                            isPhone
                            value={phone}
                            size="phone"
                            onChange={setPhone}
                            required
                        />
                        <Button radius='md' size='medium' color='orange' text='Добавить' type="submit" disabled={actionLoading} />
                    </div>
                </FormWrapper>
            </div>
            {loading ? <p>Загрузка...</p> : <Table columns={columns} data={data} />}
        </Layout>
    );
}
