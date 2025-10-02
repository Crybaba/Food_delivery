import React, { useState } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './DishDetailsModal.module.css';

export default function OrderDetailsModal({ dish, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState('1'); // строка, чтобы Input корректно работал

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const addToCart = () => {
    const safeQty = Number.isFinite(Number(quantity)) && Number(quantity) > 0 ? Number(quantity) : 1;
    onAddToCart?.(safeQty);
    onClose?.();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.close} onClick={onClose} aria-label="Закрыть">×</button>

        <div className={styles.header}>
          <h3 className={styles.title}>{dish?.name}</h3>
        </div>

        <div className={styles.body}>
          <div className={styles.leftSide}>
            <div className={styles.imageWrapper}>
              {dish?.image ? (
                <img className={styles.image} src={dish.image} alt={dish?.name} />
              ) : (
                <div className={styles.imagePlaceholder}>Изображение</div>
              )}
            </div>
            <div className={styles.controls}>
              <Input
                value={quantity}
                onChange={setQuantity}
                type="number"
                min={1}
                size="very-short"
                label="Количество"
              />
              <Button text="В корзину" color="orange" size="medium" onClick={addToCart} />
            </div>
          </div>

          <div className={styles.info}>
            <p className={styles.priceLabel}>Цена: <span className={styles.price}>{dish?.price} ₽</span></p>
            {dish?.calories != null && (
              <p className={styles.meta}>Калорийность: {dish.calories} ккал</p>
            )}
            {dish?.description && (
              <p className={styles.description}>{dish.description}</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
