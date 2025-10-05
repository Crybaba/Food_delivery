import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Title from '../../components/Title/Title';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Select from '../../components/Select/Select';
import DateRangePicker from '../../components/DateRangePicker/DateRangePicker';
import { fetchAdminOrders } from '../../lib/api';
import {
    LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
    BarChart, Bar, PieChart, Pie, Cell, Legend, ResponsiveContainer
} from 'recharts';
import styles from './AdminAnalyticsPage.module.css';

export default function AdminAnalyticsPage() {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [chartType, setChartType] = useState('popularity');
    const [dateRange, setDateRange] = useState({ startDate: '', endDate: '' });
    const [chartData, setChartData] = useState([]);

    const CATEGORY_CHOICES = [
        { value: 'hot', label: 'Горячие блюда' },
        { value: 'japan', label: 'Япония' },
        { value: 'china', label: 'Китай' },
        { value: 'korea', label: 'Корея' },
        { value: 'vietnam', label: 'Вьетнам' },
        { value: 'thai', label: 'Таиланд' },
        { value: 'asia', label: 'Остальная Азия' },
        { value: 'snack', label: 'Закуски' },
        { value: 'drink', label: 'Напитки' },
        { value: 'soups', label: 'Супы' },
        { value: 'salads', label: 'Салаты' },
        { value: 'pizza', label: 'Пицца' },
        { value: 'dessert', label: 'Десерты' },
        { value: 'other', label: 'Прочее' },
    ];

    // Обратный словарь: label -> value
    const CATEGORY_REVERSE = CATEGORY_CHOICES.reduce((acc, { value, label }) => {
        acc[label.toLowerCase()] = value;
        return acc;
    }, {});

    // --- Вместо CATEGORY_MAP ---
    const CATEGORY_LABELS = CATEGORY_CHOICES.reduce((acc, { value, label }) => {
        acc[value] = label;
        return acc;
    }, {});

    useEffect(() => {
        async function loadData() {
            setLoading(true);
            try {
                const data = await fetchAdminOrders();
                setOrders(data.results || []);
            } catch (err) {
                console.error('Ошибка загрузки заказов:', err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    useEffect(() => {
        if (!orders.length) return;

        const filtered = orders.filter(o => {
            const date = new Date(o.created_at);
            const start = dateRange.startDate ? new Date(dateRange.startDate) : null;
            const end = dateRange.endDate ? new Date(dateRange.endDate) : null;
            if (start && date < start) return false;
            if (end) {
                const endOfDay = new Date(end);
                endOfDay.setHours(23, 59, 59, 999);
                if (date > endOfDay) return false;
            }
            return true;
        });

        let data = [];

        switch (chartType) {
            case 'popularity': {
                const dishMap = {};
                filtered.forEach(order =>
                    order.items.forEach(i => {
                        dishMap[i.dish.name] = (dishMap[i.dish.name] || 0) + i.quantity;
                    })
                );
                data = Object.entries(dishMap).map(([name, count]) => ({ name, count }));
                break;
            }

            case 'countByDay': {
                const map = {};
                filtered.forEach(order => {
                    const day = new Date(order.created_at).toLocaleDateString();
                    map[day] = (map[day] || 0) + 1;
                });
                data = Object.entries(map).map(([day, count]) => ({ day, count }));
                break;
            }

            case 'avgByDay': {
                const map = {};
                filtered.forEach(order => {
                    const day = new Date(order.created_at).toLocaleDateString();
                    const total = order.items.reduce((sum, i) => sum + Number(i.price) * i.quantity, 0);
                    if (!map[day]) map[day] = { sum: 0, count: 0 };
                    map[day].sum += total;
                    map[day].count += 1;
                });
                data = Object.entries(map).map(([day, { sum, count }]) => ({
                    day,
                    avg: (sum / count).toFixed(2)
                }));
                break;
            }

            case 'byTime': {
                const map = { '00–06': 0, '06–12': 0, '12–18': 0, '18–24': 0 };
                filtered.forEach(order => {
                    const hour = new Date(order.created_at).getHours();
                    if (hour < 6) map['00–06']++;
                    else if (hour < 12) map['06–12']++;
                    else if (hour < 18) map['12–18']++;
                    else map['18–24']++;
                });
                data = Object.entries(map).map(([range, count]) => ({ range, count }));
                break;
            }

            case 'pickupVsDelivery': {
                let pickup = 0, delivery = 0;
                filtered.forEach(o => (o.pickup ? pickup++ : delivery++));
                data = [
                    { name: 'Самовывоз', value: pickup },
                    { name: 'Доставка', value: delivery },
                ];
                break;
            }

            case 'paymentMethod': {
                const map = {};
                filtered.forEach(order => {
                    const pay = order.payment || 'unknown';
                    map[pay] = (map[pay] || 0) + 1;
                });
                data = Object.entries(map).map(([method, count]) => ({
                    name: method === 'cash' ? 'Наличные' :
                        method === 'card' ? 'Карта' :
                            method === 'online' ? 'Онлайн' : 'Не указано',
                    value: count
                }));
                break;
            }

            case 'genderDistribution': {
                const map = { male: 0, female: 0, unknown: 0 };
                filtered.forEach(order => {
                    const raw = (order.user_gender || '').toLowerCase();
                    let gender = 'unknown';
                    if (raw === 'м' || raw === 'male') gender = 'male';
                    else if (raw === 'ж' || raw === 'female') gender = 'female';
                    map[gender]++;
                });
                data = [
                    { name: 'Мужчины', value: map.male },
                    { name: 'Женщины', value: map.female },
                    { name: 'Не указано', value: map.unknown },
                ];
                break;
            }

            case 'byWeekday': {
                const map = { Пн: 0, Вт: 0, Ср: 0, Чт: 0, Пт: 0, Сб: 0, Вс: 0 };
                filtered.forEach(o => {
                    const day = new Date(o.created_at).getDay();
                    const dayNames = ['Вс', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
                    map[dayNames[day]]++;
                });
                data = Object.entries(map).map(([day, count]) => ({ day, count }));
                break;
            }

            // НОВАЯ ОПЦИЯ: по категориям блюд
            case 'byCategory': {
                const map = {};
                filtered.forEach(order => {
                    order.items.forEach(i => {
                        const cat = i.dish.category || 'other'; // ожидаем, что backend отдаёт 'china', 'japan', ...
                        map[cat] = (map[cat] || 0) + i.quantity;
                    });
                });
                data = Object.entries(map).map(([cat, count]) => ({
                    name: CATEGORY_LABELS[cat] || cat,
                    count
                }));
                break;
            }
            default:
                data = [];
        }

        setChartData(data);
    }, [chartType, dateRange, orders]);

    const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#845EC2', '#FF6666', '#AA00FF'];

    return (
        <Layout>
            <Title>Аналитика заказов</Title>
            <Breadcrumbs items={[{ label: 'Главная', to: '/admin' }, { label: 'Аналитика' }]} />

            <div className={styles.container}>
                <div className={styles.filterSection}>
                    <div className={styles.filterItem}>
                        <label>Тип анализа:</label>
                        <Select
                            value={chartType}
                            onChange={setChartType}
                            options={[
                                { value: 'popularity', label: 'Популярность блюд' },
                                { value: 'countByDay', label: 'Кол-во заказов за период' },
                                { value: 'avgByDay', label: 'Средняя сумма заказа за день' },
                                { value: 'byTime', label: 'Кол-во заказов по времени суток' },
                                { value: 'pickupVsDelivery', label: 'Доставка / самовывоз' },
                                { value: 'paymentMethod', label: 'Способ оплаты' },
                                { value: 'genderDistribution', label: 'По полу пользователей' },
                                { value: 'byWeekday', label: 'По дням недели' },
                                { value: 'byCategory', label: 'По категориям блюд' },
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

                <div className={styles.chartWrapper}>
                    {loading ? (
                        <p>Загрузка...</p>
                    ) : chartData.length === 0 ? (
                        <p>Нет данных для отображения</p>
                    ) : (
                        <ResponsiveContainer width="100%" height={500}>
                            {(() => {
                                switch (chartType) {
                                    case 'popularity':
                                    case 'countByDay':
                                    case 'avgByDay':
                                    case 'byTime':
                                    case 'byWeekday':
                                    case 'byCategory':
                                        return (
                                            <BarChart data={chartData}>
                                                <CartesianGrid strokeDasharray="3 3" />
                                                <XAxis
                                                    dataKey={
                                                        chartType === 'popularity' || chartType === 'byCategory'
                                                            ? 'name'
                                                            : chartType === 'byTime'
                                                                ? 'range'
                                                                : 'day'
                                                    }
                                                    tick={{ fontSize: 12 }}
                                                />
                                                <YAxis tick={{ fontSize: 12 }} />
                                                <Tooltip />
                                                <Bar
                                                    dataKey={chartType === 'avgByDay' ? 'avg' : 'count'}
                                                    fill="#8884d8"
                                                />
                                            </BarChart>
                                        );

                                    case 'pickupVsDelivery':
                                    case 'paymentMethod':
                                    case 'genderDistribution':
                                        return (
                                            <PieChart>
                                                <Pie
                                                    data={chartData}
                                                    cx="50%"
                                                    cy="50%"
                                                    labelLine={false}
                                                    label={({ name, percent }) =>
                                                        `${name}: ${(percent * 100).toFixed(0)}%`
                                                    }
                                                    outerRadius={150}
                                                    dataKey="value"
                                                >
                                                    {chartData.map((entry, index) => (
                                                        <Cell
                                                            key={`cell-${index}`}
                                                            fill={COLORS[index % COLORS.length]}
                                                        />
                                                    ))}
                                                </Pie>
                                                <Tooltip />
                                                <Legend />
                                            </PieChart>
                                        );

                                    default:
                                        return (
                                            <div style={{ textAlign: 'center', paddingTop: '100px' }}>
                                                <p>Нет данных для отображения</p>
                                            </div>
                                        );
                                }
                            })()}
                        </ResponsiveContainer>
                    )}
                </div>
            </div>
        </Layout>
    );
}
