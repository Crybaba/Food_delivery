import React from 'react';

export default function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner" style={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ flex: '1 1 0' }}>
          <div className="footer-brand">Foodr</div>
          <div className="footer-links">
            <a href="/">Главная</a>
            <a href="/menu">Меню</a>
            <a href="/cart">Корзина</a>
            <a href="/profile">Профиль</a>
          </div>
        </div>
        <div className="text-center" style={{ flex: '1 1 0', textAlign: 'center' }}>
          Доставка <strong>возможна</strong> при заказе от <span style={{ color: 'var(--primary)', fontWeight: 800 }}>1000 руб.</span><br/>
          Стоимость доставки: <span style={{ color: 'var(--primary)', fontWeight: 800 }}>2.4%</span> от стоимости заказа
        </div>
        <div className="footer-right" style={{ flex: '1 1 0', textAlign: 'right' }}>
          <p>Часы работы</p>
          <p>10:00 – 21:00</p>
          <p>Пн – Вс</p>
        </div>
      </div>
    </footer>
  );
}


