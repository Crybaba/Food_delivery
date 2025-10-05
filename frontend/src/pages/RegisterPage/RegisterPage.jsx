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

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert('Пароли не совпадают');
      return;
    }

    // Очищаем телефон от всех символов кроме цифр
    const cleanPhone = phone.replace(/\D/g, '').slice(-10); // последние 10 цифр (без +7)

    // Валидация телефона
    if (cleanPhone.length !== 10) {
      alert('Введите корректный номер телефона из 10 цифр (без +7)');
      return;
    }

    try {
      const result = await register({
        surname,
        name,
        patronymic,
        phone: cleanPhone,
        password,
        gender
      });

      if (result.success) {
        alert('Регистрация успешна! Войдите в аккаунт.');
        navigate('/login');
      } else {
        // Показываем реальные ошибки от сервера
        alert(result.message);
      }
    } catch (err) {
      // Ошибки на уровне fetch
      alert(err.message || 'Произошла неизвестная ошибка');
    }
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
        {/* Ссылка на вход */}
        <div className={styles['login-link']}>
          <span className={styles['login-link-label']}>Уже есть аккаунт? </span>
          <Link to="/login" className={styles['login-link-text']}>
            Войти
          </Link>
        </div>

        {/* Грид для всех полей */}
        <div className={styles.formRow}>
          <label htmlFor="surname">Фамилия:</label>
          <div className={styles.rowInput}>
            <Input
              id="surname"
              value={surname}
              size="long"
              onChange={setSurname}
              placeholder="Введите фамилию"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="name">Имя:</label>
          <div className={styles.rowInput}>
            <Input
              id="name"
              value={name}
              size="long"
              onChange={setName}
              placeholder="Введите имя"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="patronymic">Отчество:</label>
          <div className={styles.rowInput}>
            <Input
              id="patronymic"
              value={patronymic}
              size="long"
              onChange={setPatronymic}
              placeholder="Введите отчество"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="phone">Телефон:</label>
          <div className={styles.rowInput}>
            <Input
              id="phone"
              value={phone}
              size="phone"
              onChange={setPhone}
              isPhone
              placeholder="+7 (___) ___-__-__"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="password">Пароль:</label>
          <div className={styles.rowInput}>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={setPassword}
              placeholder="*****"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="confirmPassword">Повторите пароль:</label>
          <div className={styles.rowInput}>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={setConfirmPassword}
              placeholder="*****"
              required
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <label htmlFor="gender">Пол:</label>
          <div>
            <Select
              id="gender"
              value={gender}
              onChange={setGender}
              size="short"
              options={[
                { value: '', label: '—' },
                { value: 'M', label: 'М' },
                { value: 'F', label: 'Ж' },
              ]}
            />
          </div>
        </div>

        {/* Кнопка регистрации отдельно */}
        <Button type="submit" text="Зарегистрироваться" className={styles.formSubmit} />
      </FormWrapper>
    </Layout>
  );
}
