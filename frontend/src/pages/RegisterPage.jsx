import React from 'react';
import Layout from '../components/Layout';
import { Link, useNavigate } from 'react-router-dom';

export default function RegisterPage() {
  const navigate = useNavigate();
  

  return (
    <Layout>
      <h1 className="title-center title-blue" style={{ marginBottom: 6 }}>Регистрация</h1>
      <div className="breadcrumbs"><Link to="/">Главная</Link> / <span>Регистрация</span></div>
      <div className="form-wrap">
        <div className="form-card">
          <div className="text-center" style={{ marginBottom: 8 }}>Уже есть аккаунт? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 800 }}>Войти</Link></div>
          <form onSubmit={(e)=>{e.preventDefault(); navigate('/login');}}>
            <div className="form-grid">
              <label className="form-label">Фамилия:</label>
              <span className="form-error">!</span>
              <input className="form-input" placeholder="Текст" />
              <span />
              <label className="form-label">Имя:</label>
              <span className="form-error">!</span>
              <input className="form-input" placeholder="Текст" />
              <span />
              <label className="form-label">Отчество:</label>
              <span className="form-error">!</span>
              <input className="form-input" placeholder="Текст" />
              <span />
              <label className="form-label">Телефон:</label>
              <span className="form-error">!</span>
              <input className="form-input" placeholder="+7 (___) ___-__-__" />
              <span />
              <label className="form-label">Пароль:</label>
              <span className="form-error">!</span>
              <input className="form-input" type="password" placeholder="*****" />
              <span />
              <label className="form-label">Повторите пароль:</label>
              <span className="form-error">!</span>
              <input className="form-input" type="password" placeholder="*****" />
              <span />
              <label className="form-label">Пол:</label>
              <span className="form-error">!</span>
              <select className="form-select"><option>—</option><option>М</option><option>Ж</option></select>
              <span />
            </div>
            <div className="form-legend">! — обязательно для заполнения</div>
          </form>
        </div>
        <button className="form-submit" onClick={()=>navigate('/login')}>Зарегистрироваться</button>
      </div>
    </Layout>
  );
}


