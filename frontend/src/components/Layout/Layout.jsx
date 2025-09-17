import React from 'react';
import Header from '../Header/Header';
import Footer from '../Footer/Footer';
import styles from './Layout.module.css';

export default function Layout({ children }) {
  return (
    <div className={styles.layout}>
      <Header />
      <main className={styles['layout-main']}>
        {children}
      </main>
      <Footer />
    </div>
  );
}
