import React, { useEffect, useState } from 'react';
import styles from './DishModal.module.css';
import Input from '../Input/Input';
import Button from '../Button/Button';
import Select from '../Select/Select';

// Локальная копия CATEGORY_CHOICES
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

export default function DishModal({ dish, onClose, onSave, loading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');
  const [category, setCategory] = useState('other');

  useEffect(() => {
    if (dish) {
      setName(dish.name || '');
      setDescription(dish.description || '');
      setPrice(dish.price || '');
      setWeight(dish.weight || '');
      setCalories(dish.calories || '');
      setIsAvailable(dish.is_available ?? true);
      setCategory(dish.category || 'other');

      if (dish.image_url) {
        setPreview(dish.image_url);
      } else if (dish.image) {
        const fullUrl = dish.image.startsWith('http')
          ? dish.image
          : `${window.location.origin}${dish.image}`;
        setPreview(fullUrl);
      } else {
        setPreview('');
      }
    } else {
      setName('');
      setDescription('');
      setPrice('');
      setWeight('');
      setCalories('');
      setIsAvailable(true);
      setImage(null);
      setPreview('');
      setCategory('other');
    }
  }, [dish]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const fd = new FormData();
    fd.append('name', name);
    fd.append('description', description);
    fd.append('price', price);
    fd.append('weight', weight);
    fd.append('calories', calories);
    fd.append('is_available', isAvailable);
    fd.append('category', category);
    if (image) fd.append('image', image);

    onSave(fd);
  };

  return (
    <div className={styles.backdrop} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.close} onClick={onClose}>
          &times;
        </button>
        <h2>{dish?.id ? 'Редактировать блюдо' : 'Добавить блюдо'}</h2>

        <form onSubmit={handleSubmit} className={styles.form}>
          {/* Название */}
          <div className={styles.formRow}>
            <label htmlFor="name">Название:</label>
            <div className={styles.rowInput}>
              <Input
                id="name"
                value={name}
                size="long"
                onChange={setName}
                placeholder="Введите название"
                required
              />
            </div>
          </div>

          {/* Категория через твой Select */}
          <div className={styles.formRow}>
            <label htmlFor="category">Категория:</label>
            <div className={styles.rowInput}>
              <Select
                value={category}
                onChange={setCategory}
                options={CATEGORY_CHOICES}
                size="long"
                required
              />
            </div>
          </div>

          {/* Описание */}
          <div className={styles.formRow}>
            <label htmlFor="description">Описание:</label>
            <div className={styles.rowInput}>
              <textarea className={styles.textarea}
                id="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Введите описание"
                rows={4}
              />
            </div>
          </div>

          {/* Цена */}
          <div className={styles.formRow}>
            <label htmlFor="price">Цена:</label>
            <div className={styles.rowInput}>
              <Input
                id="price"
                type="number"
                value={price}
                size="long"
                onChange={setPrice}
                placeholder="Введите цену"
                required
              />
            </div>
          </div>

          {/* Вес */}
          <div className={styles.formRow}>
            <label htmlFor="weight">Вес (г):</label>
            <div className={styles.rowInput}>
              <Input
                id="weight"
                type="number"
                value={weight}
                size="long"
                onChange={setWeight}
                placeholder="Введите вес"
              />
            </div>
          </div>

          {/* Калории */}
          <div className={styles.formRow}>
            <label htmlFor="calories">Ккал:</label>
            <div className={styles.rowInput}>
              <Input
                id="calories"
                type="number"
                value={calories}
                size="long"
                onChange={setCalories}
                placeholder="Введите калории"
              />
            </div>
          </div>

          {/* Изображение */}
          <div className={styles.formRow}>
            <label htmlFor="image">Изображение:</label>
            <div className={styles.rowInput}>
              {preview && (
                <img src={preview} alt="Превью" className={styles.previewImage} />
              )}
              <input
                id="image"
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    setImage(file);
                    setPreview(URL.createObjectURL(file));
                  }
                }}
              />
            </div>
          </div>

          {/* Доступно */}
          <div className={styles.formRow}>
            <label htmlFor="isAvailable">Доступно:</label>
            <div className={styles.rowInput}>
              <input
                id="isAvailable"
                type="checkbox"
                checked={isAvailable}
                onChange={(e) => setIsAvailable(e.target.checked)}
              />{' '}
              Да
            </div>
          </div>

          <div className={styles.actions}>
            <Button text="Сохранить" color="orange" type="submit" disabled={loading} />
            <Button text="Отмена" color="gray" onClick={onClose} disabled={loading} />
          </div>
        </form>
      </div>
    </div>
  );
}
