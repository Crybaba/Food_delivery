import React, { useEffect, useState } from 'react';
import Layout from '../../components/Layout/Layout';
import Table from '../../components/Table/Table';
import Title from '../../components/Title/Title';
import Button from '../../components/Button/Button';
import DishModal from '../../components/DishModal/DishModal';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Select from '../../components/Select/Select';
import {
    fetchDishes,
    createDish,
    updateDish,
    deleteDish,
} from '../../lib/api';
import styles from './AdminDishesPage.module.css';

export default function AdminDishesPage() {
    const [dishes, setDishes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedDish, setSelectedDish] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);
    const [availabilityFilter, setAvailabilityFilter] = useState(''); // '' | 'available' | 'unavailable'

    // ---------------------------
    // Загрузка блюд
    // ---------------------------
    const loadDishes = async () => {
        setLoading(true);
        try {
            const data = await fetchDishes();
            setDishes(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDishes();
    }, []);

    // ---------------------------
    // Сохранение блюда
    // ---------------------------
    const handleSave = async (formData) => {
        setActionLoading(true);
        try {
            if (selectedDish && selectedDish.id) {
                await updateDish(selectedDish.id, formData);
            } else {
                await createDish(formData);
            }
            await loadDishes();
            setSelectedDish(null);
        } catch (err) {
            console.error(err);
            alert('Ошибка при сохранении блюда');
        } finally {
            setActionLoading(false);
        }
    };

    // ---------------------------
    // Удаление блюда
    // ---------------------------
    const handleDelete = async (id) => {
        if (!window.confirm('Удалить блюдо?')) return;
        setActionLoading(true);
        try {
            await deleteDish(id);
            await loadDishes();
        } catch (err) {
            console.error(err);
            alert('Ошибка при удалении блюда');
        } finally {
            setActionLoading(false);
        }
    };

    // ---------------------------
    // Фильтруем по доступности
    // ---------------------------
    const filteredDishes = dishes.filter(dish => {
        if (availabilityFilter === 'available') return dish.is_available;
        if (availabilityFilter === 'unavailable') return !dish.is_available;
        return true;
    });

    // ---------------------------
    // Колонки таблицы
    // ---------------------------
    const columns = [
        { key: 'name', label: 'Название', width: '180px' },
        { key: 'description', label: 'Описание', width: '300px' },
        { key: 'price', label: 'Цена', width: '100px', align: 'right' },
        { key: 'weight', label: 'Вес (г)', width: '100px', align: 'right' },
        { key: 'calories', label: 'Ккал', width: '100px', align: 'right' },
        { key: 'is_available', label: 'Доступно', width: '80px', align: 'center' },
        { key: 'actions', label: 'Действия', width: '25px', align: 'center' },
    ];

    const data = filteredDishes.map(dish => ({
        ...dish,
        price: `${dish.price} ₽`,
        weight: `${dish.weight} г`,
        calories: `${dish.calories} ккал`,
        is_available: dish.is_available ? 'В наличии' : 'Недоступно',
        description: (
            <div className={styles.comment}>{dish.description}</div>
        ),
        actions: (
            <div className={styles.buttons}>
                <Button
                    text="✏️"
                    size="small"
                    radius="md"
                    color="orange"
                    onClick={() => setSelectedDish(dish)}
                />
                <Button
                    text="❌"
                    size="small"
                    radius="md"
                    color="orange"
                    onClick={() => handleDelete(dish.id)}
                    disabled={actionLoading}
                />
            </div>
        ),
    }));

    return (
        <Layout>
            <Title>Управление блюдами</Title>
            <Breadcrumbs items={[{ label: 'Главная', to: '/admin' }, { label: 'Управление блюдами' }]} />

            <div className={styles.toolSection}>
                {/* ----------------- фильтры ----------------- */}
                <div className={styles.filterSection}>
                    <div className={styles.filterItem}>
                        <label>Фильтр по доступности:</label>
                        <Select
                            value={availabilityFilter}
                            onChange={setAvailabilityFilter}
                            size="medium"
                            options={[
                                { value: '', label: 'Все' },
                                { value: 'available', label: 'В наличии' },
                                { value: 'unavailable', label: 'Недоступно' },
                            ]}
                        />
                    </div>
                </div>
                <Button
                    text="Добавить блюдо"
                    size="medium"
                    radius="md"
                    color="orange"
                    onClick={() => setSelectedDish({})}
                    disabled={actionLoading}
                />
            </div>

            {loading ? (
                <p>Загрузка...</p>
            ) : (
                <Table columns={columns} data={data} />
            )}

            {selectedDish !== null && (
                <DishModal
                    dish={selectedDish.id ? selectedDish : null}
                    onClose={() => setSelectedDish(null)}
                    onSave={handleSave}
                    loading={actionLoading}
                />
            )}
        </Layout>
    );
}
