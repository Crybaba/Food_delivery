import React from 'react';
import styles from './Checkbox.module.css';

const Checkbox = ({ label, checked, onChange }) => {
  return (
    <label className={styles.checkboxWrapper}>
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={styles.checkboxInput}
      />
      <span className={styles.customCheckbox}>
        <svg viewBox="0 0 24 24" className={styles.checkmark}>
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </span>
      <span className={styles.labelText}>{label}</span>
    </label>
  );
};

export default Checkbox;
