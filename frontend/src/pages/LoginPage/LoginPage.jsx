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
  const [selectedRole] = useState('admin');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    login(selectedRole);
    if (selectedRole === 'admin') navigate('/admin');
    else if (selectedRole === 'courier') navigate('/courier');
    else navigate('/');
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
       <div className={styles['login-link']}>
          <span className={styles['login-link-label']}>Впервые у нас?</span>
          <Link to="/register" className={styles['login-link-text']}>
            Зарегистрироваться
          </Link>
        </div>
        <Input
          label="Телефон:"
          isPhone
          value={phone}
          size="medium"
          onChange={setPhone}
          required
        />

        <Input
          label="Пароль:"
          type="password"
          value={password}
          size="medium"
          onChange={setPassword}
          placeholder="*****"
          required
        />

        <Button
          type="submit"
          text="Вход"
          className={styles['form-submit']}
        />
      </FormWrapper>
    </Layout>
  );
}
