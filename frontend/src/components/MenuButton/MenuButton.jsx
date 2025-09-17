import React from 'react';
import styles from './MenuButton.module.css';

const MenuButton = ({ text, icon: Icon, color = 'orange', onClick }) => {
  return (
    <button
      className={`${styles.button} ${styles[`btn-${color}`]}`}
      onClick={onClick}
    >
      <span>{text}</span>
      {Icon && <Icon className={styles.icon} />}
    </button>
  );
};

export default MenuButton;
