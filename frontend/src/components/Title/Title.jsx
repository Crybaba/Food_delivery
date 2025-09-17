import React from 'react';
import styles from './Title.module.css';

const Title = ({ children, className = '' }) => {
  return <h1 className={`${styles.title} ${className}`}>{children}</h1>;
};

export default Title;
