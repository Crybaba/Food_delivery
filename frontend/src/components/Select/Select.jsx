import React from 'react';
import styles from './Select.module.css';

const Select = ({
  value,
  onChange,
  options = [],
  size = 'medium', // 'short', 'medium', 'long', 'phone'
  required = false,
  className = '',
}) => {
  // Выбор класса размера
  const widthClass = (() => {
    switch (size) {
      case 'short': return styles.short;
      case 'medium': return styles.medium;
      case 'long': return styles.long;
      case 'phone': return styles.phone;
      default: return styles.medium;
    }
  })();

  return (
    <div className={styles.wrapper}>
      <div className={styles['input-container']}>
        <select
          className={`${styles.select} ${widthClass} ${className}`}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
        >
          {options.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
        {required && <span className={styles['required-indicator']}>*</span>}
      </div>
    </div>
  );
};

export default Select;
