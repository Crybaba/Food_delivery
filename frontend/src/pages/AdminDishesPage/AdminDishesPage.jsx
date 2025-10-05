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
    const [availabilityFilter, setAvailabilityFilter] = useState('');
    const [categoryFilter, setCategoryFilter] = useState(''); // новый фильтр по категории

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


    const categoryMap = Object.fromEntries(CATEGORY_CHOICES.map(c => [c.value, c.label]));

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
    // Фильтруем по доступности и категории
    // ---------------------------
    const filteredDishes = dishes.filter(dish => {
        if (availabilityFilter === 'available' && !dish.is_available) return false;
        if (availabilityFilter === 'unavailable' && dish.is_available) return false;
        if (categoryFilter && dish.category !== categoryFilter) return false;
        return true;
    });

    const columns = [
        { key: 'name', label: 'Название', width: '180px' },
        { key: 'category', label: 'Категория', width: '120px', align: 'center' },
        { key: 'description', label: 'Описание', width: '300px' },
        { key: 'price', label: 'Цена', width: '100px', align: 'right' },
        { key: 'weight', label: 'Вес (г)', width: '100px', align: 'right' },
        { key: 'calories', label: 'Ккал', width: '100px', align: 'right' },
        { key: 'is_available', label: 'Доступно', width: '80px', align: 'center' },
        { key: 'actions', label: 'Действия', width: '25px', align: 'center' },
    ];

    const data = filteredDishes.map(dish => ({
        ...dish,
        category: categoryMap[dish.category] || 'Другое',
        price: `${dish.price} ₽`,
        weight: `${dish.weight} г`,
        calories: `${dish.calories} ккал`,
        is_available: dish.is_available ? 'В наличии' : 'Недоступно',
        description: <div className={styles.comment}>{dish.description}</div>,
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

                    <div className={styles.filterItem}>
                        <label>Фильтр по категории:</label>
                        <Select
                            value={categoryFilter}
                            onChange={setCategoryFilter}
                            size="medium"
                            options={[{ value: '', label: 'Все' }, ...CATEGORY_CHOICES]}
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