import React from 'react';
import styles from './Button.module.css';

const Button = ({
  type = 'button',
  text,
  icon: Icon,
  onClick,
  className = '',
  color = 'orange',      // orange | blue | gray
  size = 'medium',       // small | medium | large
  fullWidth = false,     // true | false
}) => {
  const colorClass = styles[`btn-${color}`] || '';
  const sizeClass = styles[`btn-${size}`] || '';
  const widthClass = fullWidth ? styles['btn-full'] : '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${colorClass} ${sizeClass} ${widthClass} ${className}`}
    >
      {Icon && <Icon className={styles.icon} />}
      <span>{text}</span>
    </button>
  );
};

export default Button;
