import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Breadcrumbs.module.css';

const Breadcrumbs = ({ items = [] }) => {
  if (!items.length) return null;

  return (
    <nav className={styles.breadcrumbs}>
      {items.map((item, index) => (
        <span key={index} className={styles.item}>
          {item.to ? (
            <Link to={item.to}>{item.label}</Link>
          ) : (
            <span className={styles.current}>{item.label}</span>
          )}
          {index < items.length - 1 && <span className={styles.separator}>/</span>}
        </span>
      ))}
    </nav>
  );
};

export default Breadcrumbs;
