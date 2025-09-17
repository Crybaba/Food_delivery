import React from 'react';
import styles from './FormWrapper.module.css';

const FormWrapper = ({ onSubmit, children, legend }) => {
  return (
    <form onSubmit={onSubmit} className={styles.form}>
      <div className={styles['form-card']}>
        <div className={styles['form-grid']}>
          {children}
        </div>

        {legend && <div className={styles['form-legend']}>{legend}</div>}
      </div>
    </form>
  );
};

export default FormWrapper;
