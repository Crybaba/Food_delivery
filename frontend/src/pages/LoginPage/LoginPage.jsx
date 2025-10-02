import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import FormWrapper from '../../components/FormWrapper/FormWrapper';
import Button from '../../components/Button/Button';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import styles from './LoginPage.module.css';

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Очищаем номер от всего, кроме цифр
    const cleanPhone = phone.replace(/\D/g, '');

    // Валидация телефона
    if (cleanPhone.length !== 10) {
      alert('Введите корректный номер телефона из 10 цифр');
      return;
    }

    const result = await login({ phone: cleanPhone, password });

    if (result.success) {
      if (result.role === 'ADMIN') {
        navigate('/admin');
      } else if (result.role === 'COURIER') {
        navigate('/courier');
      } else {
        navigate('/');
      }
    } else {
      alert(result.message);
    }
  };
  return (
    <Layout>
      <Title>Вход</Title>
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Вход' }
        ]}
      />

      <FormWrapper
        onSubmit={handleSubmit}
        legend="* — обязательно для заполнения"
      >
        {/* Ссылка отдельно, вне грида */}
        <div className={`${styles.loginLink} ${styles.fullWidth}`}>
          <span className={styles['login-link-label']}>Впервые у нас? </span>
          <Link to="/register" className={styles['login-link-text']}>
            Зарегистрироваться
          </Link>
        </div>

        {/* Грид только для полей ввода */}
        <div className={styles.formGrid}>
          <div className={styles.formRow}>
            <label htmlFor="phone">Телефон:</label>
            <Input
              id="phone"
              isPhone
              value={phone}
              size="phone"
              onChange={setPhone}
              required
            />
          </div>

          <div className={styles.formRow}>
            <label htmlFor="password">Пароль:</label>
            <Input
              id="password"
              type="password"
              value={password}
              size="medium"
              onChange={setPassword}
              placeholder="*****"
              required
            />
          </div>
        </div>

        {/* Кнопка отдельно, не внутри грида */}
        <Button type="submit" text="Вход" className={styles.formSubmit} />
      </FormWrapper>
    </Layout>
  );
}
