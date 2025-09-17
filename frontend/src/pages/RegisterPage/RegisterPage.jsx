import React, { useState } from 'react';
import Layout from '../../components/Layout/Layout';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import Title from '../../components/Title/Title';
import Input from '../../components/Input/Input';
import FormWrapper from '../../components/FormWrapper/FormWrapper';
import Button from '../../components/Button/Button';
import Breadcrumbs from '../../components/Breadcrumbs/Breadcrumbs';
import Select from '../../components/Select/Select';
import styles from './RegisterPage.module.css';

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [surname, setSurname] = useState('');
  const [name, setName] = useState('');
  const [patronymic, setPatronymic] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [gender, setGender] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }
    register({ surname, name, patronymic, phone, password, gender });
    navigate('/login');
  };

  return (
    <Layout>
      <Title>Регистрация</Title>
      <Breadcrumbs
        items={[
          { label: 'Главная', to: '/' },
          { label: 'Регистрация' }
        ]}
      />

      <FormWrapper onSubmit={handleSubmit} legend="* — обязательно для заполнения">
        <div className={styles['login-link']}>
          <span className={styles['login-link-label']}>Уже есть аккаунт?</span>
          <Link to="/login" className={styles['login-link-text']}>
            Войти
          </Link>
        </div>

        <Input
          label="Фамилия:"
          value={surname}
          size="long"
          onChange={setSurname}
          placeholder="Введите фамилию"
          required
        />

        <Input
          label="Имя:"
          value={name}
          size="long"
          onChange={setName}
          placeholder="Введите имя"
          required
        />

        <Input
          label="Отчество:"
          value={patronymic}
          size="long"
          onChange={setPatronymic}
          placeholder="Введите отчество"
        />

        <Input
          label="Телефон:"
          value={phone}
          size="phone"
          onChange={setPhone}
          isPhone
          placeholder="+7 (___) ___-__-__"
          required
        />

        <Input
          label="Пароль:"
          type="password"
          value={password}
          onChange={setPassword}
          placeholder="*****"
          required
        />

        <Input
          label="Повторите пароль:"
          type="password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          placeholder="*****"
          required
        />

        <Select
          label="Пол:"
          value={gender}
          onChange={setGender}
          size="short"
          options={[
            { value: '', label: '—' },
            { value: 'M', label: 'М' },
            { value: 'F', label: 'Ж' }
          ]}
        />

        <Button type="submit" text="Зарегистрироваться"/>
      </FormWrapper>
    </Layout>
  );
}
