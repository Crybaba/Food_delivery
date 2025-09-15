import React, { useState } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [selectedRole] = useState('client');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
    if (selectedRole === 'admin') navigate('/admin');
    else if (selectedRole === 'courier') navigate('/courier');
    else navigate('/');
  };

  return (
    <Layout>
      <h1 className="title-center title-blue" style={{ marginBottom: 6 }}>Вход</h1>
      <div className="breadcrumbs"><Link to="/">Главная</Link> / <span>Вход</span></div>
      <div className="form-wrap">
        <div className="form-card">
          <div className="text-center" style={{ marginBottom: 8 }}>Впервые у нас? <Link to="/register" style={{ color: 'var(--primary)', fontWeight: 800 }}>Регистрация</Link></div>
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <label className="form-label">Телефон:</label>
              <span className="form-error">!</span>
              <input className="form-input" placeholder="Текст" />
              <span />
              <label className="form-label">Пароль:</label>
              <span className="form-error">!</span>
              <input className="form-input" type="password" placeholder="*****" />
              <span />
            </div>
            <div className="form-legend">! — обязательно для заполнения</div>
          </form>
        </div>
        <button onClick={handleSubmit} className="form-submit">Вход</button>
      </div>
    </Layout>
  );
}


