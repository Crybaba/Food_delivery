import React from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function ClientHomePage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  return (
    <Layout>
      <h1 className="title-center title-blue">Добро пожаловать в FOODR ИС!</h1>
      {!isAuthenticated ? (
        <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
          <div className="text-center" style={{ fontSize: 18 }}>Выберите опцию:</div>
          <div className="cta" style={{ marginTop: 8 }}>
            <button className="btn-primary" onClick={() => navigate('/login')}>
              <span>Вход</span>
              <span style={{ fontSize: 24 }}>👤</span>
            </button>
            <button className="btn-secondary" onClick={() => navigate('/register')}>
              <span>Регистрация</span>
              <span style={{ fontSize: 24 }}>➕</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
          <div className="text-center" style={{ fontSize: 18, marginBottom: 8 }}>Выберите опцию:</div>
          <div className="cta">
            <button className="btn-primary" onClick={() => navigate('/menu')}>
              <span>Меню</span>
              <span style={{ fontSize: 24 }}>🍽️</span>
            </button>
            <button className="btn-secondary" onClick={() => navigate('/orders')}>
              <span>Мои заказы</span>
              <span style={{ fontSize: 24 }}>📦</span>
            </button>
          </div>
        </div>
      )}
    </Layout>
  );
}


