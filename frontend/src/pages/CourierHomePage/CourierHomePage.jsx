import React from 'react';
import Layout from '../../components/Layout/Layout';
import { useNavigate } from 'react-router-dom';

export default function CourierHomePage() {
  const navigate = useNavigate();
  return (
    <Layout>
      <h1 className="title-center title-green">Панель курьера</h1>
      <div className="content" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: 8 }}>
        <div className="cta">
          <button className="btn-primary" onClick={() => navigate('/courier/orders')}>
            <span>Мои заказы</span>
            <span style={{ fontSize: 24 }}>📦</span>
          </button>
        </div>
      </div>
    </Layout>
  );
}


