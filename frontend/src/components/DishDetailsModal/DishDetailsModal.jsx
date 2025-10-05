import React, { useState } from 'react';
import Button from '../Button/Button';
import Input from '../Input/Input';
import styles from './DishDetailsModal.module.css';

export default function DishDetailsModal({ dish, onClose, onAddToCart }) {
  const [quantity, setQuantity] = useState('1');

  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) onClose();
  };

  const addToCart = () => {
    const safeQty =
      Number.isFinite(Number(quantity)) && Number(quantity) > 0
        ? Number(quantity)
        : 1;
    onAddToCart?.(safeQty);
    onClose?.();
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal} role="dialog" aria-modal="true">
        <button className={styles.close} onClick={onClose} aria-label="Закрыть">
          ×
        </button>

        <div className={styles.header}>
          <h3 className={styles.title}>{dish?.name}</h3>
        </div>

        <div className={styles.body}>
          <div className={styles.imageWrapper}>
            {dish?.image ? (
              <img
                className={styles.image}
                src={dish.image}
                alt={dish?.name}
              />
            ) : (
              <div className={styles.imagePlaceholder}>Изображение</div>
            )}
          </div>

          <div className={styles.info}>
            {/* Цена */}
            <div className={styles.infoRow}>
              <span className={styles.label}>Цена:</span>
              <span className={styles.value}>{dish?.price} ₽</span>
            </div>

            {/* Калории */}
            {dish?.calories != null && (
              <div className={styles.infoRow}>
                <span className={styles.label}>Калорийность:</span>
                <span className={styles.value}>{dish.calories} ккал</span>
              </div>
            )}

            {/* Вес */}
            {dish?.calories != null && (
              <div className={styles.infoRow}>
                <span className={styles.label}>Вес:</span>
                <span className={styles.value}>{dish.weight} г.</span>
              </div>
            )}


            {/* Описание */}
            {dish?.description && (
              <div className={`${styles.infoRow} ${styles.commentRow}`}>
                <span className={styles.label}>Описание:</span>
                <p className={styles.comment}>{dish.description}</p>
              </div>
            )}

            {/* Контролы */}
            <div className={styles.controls}>
              <label className={styles.label}>Количество:</label>
              <Input
                value={quantity}
                onChange={setQuantity}
                type="number"
                min={1}
                size="very-short"
              />
              <Button
                text="В корзину"
                color="orange"
                size="medium"
                onClick={addToCart}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
