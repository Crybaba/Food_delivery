import React from 'react';
import styles from './Button.module.css';

const radiusMap = {
  sm: 'var(--radius-sm)',
  md: 'var(--radius-md)',
  lg: 'var(--radius-lg)',
};

const Button = ({
  type = 'button',
  text,
  icon: Icon,
  onClick,
  className = '',
  color = 'orange',      // orange | blue | gray
  size = 'medium',       // small | medium | large
  fullWidth = false,     // true | false
  variant = 'solid',     // solid | outline
  radius = 'sm',         // sm | md | lg
}) => {
  const colorClass = styles[`btn-${color}`] || '';
  const sizeClass = styles[`btn-${size}`] || '';
  const widthClass = fullWidth ? styles['btn-full'] : '';
  const variantClass = styles[`btn-variant-${variant}-${color}`] || '';

  const style = { borderRadius: radiusMap[radius] || radiusMap.sm };

  return (
    <button
      type={type}
      onClick={onClick}
      className={`${styles.button} ${colorClass} ${sizeClass} ${variantClass} ${widthClass} ${className}`}
      style={style}
    >
      {Icon && <Icon className={styles.icon} />}
      <span>{text}</span>
    </button>
  );
};

export default Button;
