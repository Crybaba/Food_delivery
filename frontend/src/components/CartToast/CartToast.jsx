import React, { useEffect } from 'react';
import styles from './CartToast.module.css';

export default function CartToast({ item, quantity, onClose }) {
  useEffect(() => {
    if (!item) return;
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    return () => clearTimeout(timer);
  }, [item, onClose]);

  if (!item) return null;

  return (
    <div className={styles.toast}>
      <p>
        <strong>{item.name}</strong> добавлен в корзину в количестве{' '}
        <strong>{quantity}</strong> шт.
      </p>
    </div>
  );
}
