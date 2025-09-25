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
  variant = 'solid',     // solid | outline (currently outline supported for blue)
}) => {
  const colorClass = styles[`btn-${color}`] || '';
  const sizeClass = styles[`btn-${size}`] || '';
  const widthClass = fullWidth ? styles['btn-full'] : '';
  const variantClass = styles[`btn-variant-${variant}-${color}`] || '';

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${colorClass} ${sizeClass} ${variantClass} ${widthClass} ${className}`}
    >
      {Icon && <Icon className={styles.icon} />}
      <span>{text}</span>
    </button>
  );
};

export default Button;
