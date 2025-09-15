import React from 'react';
import Header from './Header';
import Footer from './Footer';

export default function Layout({ children }) {
  return (
    <div className="page-container">
      <Header />
      <main className="main">
        <div className="content">{children}</div>
      </main>
      <Footer />
    </div>
  );
}


