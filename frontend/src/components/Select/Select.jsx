import React from 'react';
import styles from './Select.module.css';

const Select = ({
  label = '',
  value,
  onChange,
  options = [],
  size = 'medium', // 'short', 'medium', 'long', 'phone'
  required = false,
  className = '',
  labelClassName = ''
}) => {
  let widthClass = '';
  if (size === 'short') widthClass = styles.short;
  else if (size === 'medium') widthClass = styles.medium;
  else if (size === 'long') widthClass = styles.long;
  else if (size === 'phone') widthClass = styles.phone;

  const selectElement = (
    <select
      className={`${styles.select} ${widthClass}`}
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
  );

  return (
    <div className={styles.wrapper}>
      {label && (
        <label className={`${styles.label} ${labelClassName}`}>
          {label}
        </label>
      )}
      <div className={styles['input-container']}>
        {selectElement}
        {required && <span className={styles['required-indicator']}>*</span>}
      </div>
    </div>
  );
};

export default Select;
