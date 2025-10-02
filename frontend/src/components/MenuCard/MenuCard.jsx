import React, { useState } from 'react';
import Button from '../Button/Button';
import styles from './MenuCard.module.css';
import OrderDetailsModal from '../DishDetailsModal/DishDetailsModal';

const MenuCard = ({ title, image, price, description, calories, onAddToCart, dish }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className={styles.cardWrapper}>
      <div className={styles.cardInner}>
        <h3 className={styles.title}>{title}</h3>

        <div
          className={styles.imageWrapper}
          onClick={() => setOpen(true)}
          role="button"
          tabIndex={0}
          onKeyDown={(e) => (e.key === 'Enter' ? setOpen(true) : null)}
        >
          {image ? (
            <img src={image} alt={title} className={styles.image} />
          ) : (
            <div className={styles.imagePh}>Изображение</div>
          )}
        </div>

        <div className={styles.metaRow}>
          <div className={styles.priceBadge}>{price} ₽</div>
          <div className={styles.calories}>
            Калорийность: <span className={styles.caloriesValue}>{calories}</span>
          </div>
        </div>

        <div className={styles.descriptionWrapper}>
          <p className={styles.description}>{description}</p>
        </div>

        <div className={styles.buttonsWrapper}>
          <Button
            text="В корзину"
            color="orange"
            size="medium"
            fullWidth
            radius="md"       // используем конкретный радиус
            onClick={() => onAddToCart?.()}
          />

          <Button
            text="О блюде…"
            color="blue"
            variant="outline"
            size="small"
            radius="md"
            fullWidth
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {open && (
        <OrderDetailsModal
          dish={dish || { name: title, image, price, description, calories }}
          onClose={() => setOpen(false)}
          onAddToCart={(qty) => onAddToCart?.(qty)}
        />
      )}
    </div>
  );
};

export default MenuCard;
