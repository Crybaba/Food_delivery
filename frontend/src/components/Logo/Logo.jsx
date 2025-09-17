import React from 'react';
import styles from './Logo.module.css';

const Logo = ({ src = "/logo512.png", title = "Foodr", subtitle = "доставка еды" }) => {
  return (
    <div className={styles.brand}>
      <img src={src} alt={title} className={styles.logo} />
      <div className={styles.textWrap}>
        <span className={styles['brand-title']}>{title}</span>
        <span className={styles['brand-sub']}>{subtitle}</span>
      </div>
    </div>
  );
};

export default Logo;
