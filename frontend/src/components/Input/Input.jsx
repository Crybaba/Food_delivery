import React, { useRef } from 'react';
import styles from './Input.module.css';

const Input = ({
  value,
  onChange,
  type = 'text',
  placeholder = '',
  size = 'medium',
  isPhone = false,
  className = '',
  required = false,
  isText = false,
  labelTop = false, // для textarea
}) => {
  const inputRef = useRef(null);

  const formatPhone = (digits) => {
    const maxLength = 10;
    digits = digits.substring(0, maxLength);
    const template = '(___)-___-__-__'.split('');
    for (let i = 0; i < digits.length; i++) {
      const index = template.indexOf('_');
      if (index > -1) template[index] = digits[i];
    }
    return template.join('');
  };

  const handleChange = (e) => {
    let val = e.target.value;
    if (isPhone) {
      val = val.replace(/\D/g, '').substring(0, 10);
      const formatted = formatPhone(val);
      onChange(formatted);

      setTimeout(() => {
        const input = inputRef.current;
        if (input) {
          const lastDigitIndex =
            formatted.indexOf('_') === -1 ? formatted.length : formatted.indexOf('_');
          input.setSelectionRange(lastDigitIndex, lastDigitIndex);
        }
      }, 0);
      return;
    }
    onChange(val);
  };

  const widthClass = (() => {
    switch (size) {
      case 'very-short':
        return styles['very-short'];
      case 'short':
        return styles['short'];
      case 'medium':
        return styles['medium'];
      case 'long':
        return styles['long'];
      case 'phone':
        return styles['phone'];
      default:
        return styles['medium'];
    }
  })();

  const renderInput = () => {
    // добавляем * в плейсхолдер, если поле required
    const requiredPlaceholder = required ? `${placeholder}*` : placeholder;

    if (isText) {
      return (
        <textarea
          ref={inputRef}
          value={value}
          onChange={handleChange}
          placeholder={requiredPlaceholder}
          className={`${styles.input} ${widthClass} ${styles.textarea} ${className}`}
          maxLength={5000}
          style={{ height: 'auto' }}
          required={required}
        />
      );
    } else if (isPhone) {
      return (
        <div className={`${styles.phoneWrapper} ${className}`}>
          <span className={styles.phonePrefix}>+7</span>
          <input
            ref={inputRef}
            type="tel"
            value={value || '(___)-___-__-__'}
            onChange={handleChange}
            placeholder={requiredPlaceholder || '(___)-___-__-__'}
            className={`${styles.input} ${widthClass}`}
            required={required}
          />
        </div>
      );
    } else {
      return (
        <input
          ref={inputRef}
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={requiredPlaceholder}
          className={`${styles.input} ${widthClass} ${className}`}
          required={required}
        />
      );
    }
  };

  return (
    <div className={labelTop ? styles.wrapperVertical : styles.wrapper}>
      {renderInput()}
    </div>
  );
};

export default Input;
