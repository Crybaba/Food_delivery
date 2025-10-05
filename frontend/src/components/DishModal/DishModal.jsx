import React, { useEffect, useState } from 'react';
import styles from './DishModal.module.css';
import Input from '../Input/Input';
import Button from '../Button/Button';

export default function DishModal({ dish, onClose, onSave, loading }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [weight, setWeight] = useState('');
  const [calories, setCalories] = useState('');
  const [isAvailable, setIsAvailable] = useState(true);
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState('');

  // Заполняем поля при редактировании
  useEffect(() => {
    if (dish) {
      setName(dish.name || '');
      setDescription(dish.description || '');
      setPrice(dish.price || '');
      setWeight(dish.weight || '');
      setCalories(dish.calories || '');
      setIsAvailable(dish.is_available ?? true);

      // Проверяем поле изображения
      if (dish.image_url) {
        setPreview(dish.image_url);
      } else if (dish.image) {
        // иногда сервер может возвращать просто "image" с путём
        const fullUrl = dish.image.startsWith('http')
          ? dish.image
          : `${window.location.origin}${dish.image}`;
        setPreview(fullUrl);
      } else {
        setPreview('');
      }
    } else {
      // Очистка полей при добавлении нового блюда
      setName('');
      setDescription('');
      setPrice('');
      setWeight('');
      setCalories('');
      setIsAvailable(true);
      setImage(null);
      setPreview('');
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

          <div className={styles.formRow}>
            <label htmlFor="description">Описание:</label>
            <div className={styles.rowInput}>
              <Input
                id="description"
                value={description}
                size="long"
                onChange={setDescription}
                placeholder="Введите описание"
                required
                textarea
              />
            </div>
          </div>

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

          <div className={styles.formRow}>
            <label htmlFor="image">Изображение:</label>
            <div className={styles.rowInput}>
              {preview && (
                <img
                  src={preview}
                  alt="Превью"
                  className={styles.previewImage}
                />
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
            <Button
              text="Сохранить"
              color="orange"
              type="submit"
              disabled={loading}
            />
            <Button
              text="Отмена"
              color="gray"
              onClick={onClose}
              disabled={loading}
            />
          </div>
        </form>
      </div>
    </div>
  );
}
