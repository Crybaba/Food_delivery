// components/DateRangePicker/DateRangePicker.jsx
import React from 'react';
import styles from './DateRangePicker.module.css';

export default function DateRangePicker({ startDate, endDate, onChange }) {
  const handleStartChange = (e) => {
    onChange({ startDate: e.target.value, endDate });
  };

  const handleEndChange = (e) => {
    onChange({ startDate, endDate: e.target.value });
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.inputs}>
        <div className={styles.inputContainer}>
          <input
            type="date"
            value={startDate}
            onChange={handleStartChange}
            className={styles.input}
          />
        </div>
        <span className={styles.separator}>—</span>
        <div className={styles.inputContainer}>
          <input
            type="date"
            value={endDate}
            onChange={handleEndChange}
            className={styles.input}
          />
        </div>
      </div>
    </div>
  );
}
