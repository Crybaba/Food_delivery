import React from 'react';
import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.siteFooter}>
      <div className={styles.siteFooterInner}>
        <div className={styles.footerLeft}>
          <div className={styles.footerBrand}>Foodr</div>
          <div className={styles.footerLinks}>
            <a href="/">Главная</a>
            <a href="/menu">Меню</a>
            <a href="/cart">Корзина</a>
            <a href="/profile">Профиль</a>
          </div>
        </div>

        <div className={styles.footerCenter}>
          Доставка <strong>возможна</strong> при заказе от{' '}
          <span className={styles.highlight}>1000 руб.</span>
        </div>

        <div className={styles.footerRight}>
          <p>Часы работы</p>
          <p>10:00 – 21:00; Пн – Вс</p>
        </div>
      </div>
    </footer>
  );
}
