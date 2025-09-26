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
  label = '',
  labelClassName = '',
  required = false,
  isText = false, // для textarea
  labelTop = false,
}) => {
  const inputRef = useRef(null);

  const formatPhone = (digits) => {
    const maxLength = 11;
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
      val = val.replace(/\D/g, '').substring(0, 11);
      const formatted = formatPhone(val);
      onChange(formatted);

      setTimeout(() => {
        const input = inputRef.current;
        if (input) {
          const lastDigitIndex = formatted.lastIndexOf(val.slice(-1));
          input.setSelectionRange(lastDigitIndex + 1, lastDigitIndex + 1);
        }
      }, 0);

      return;
    }

    onChange(val);
  };

  const widthClass = (() => {
    switch (size) {
      case 'very-short': return styles.veryShort;
      case 'short': return styles.short;
      case 'medium': return styles.medium;
      case 'long': return styles.long;
      case 'phone': return styles.phone;
      default: return styles.medium;
    }
  })();

  const renderInput = () => {
    const inputElement = isText ? (
      <textarea
        ref={inputRef}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${styles.input} ${widthClass} ${styles.textarea} ${className}`}
        maxLength={5000}
        style={{ height: 'auto' }}
      />
    ) : isPhone ? (
      <div className={`${styles.phoneWrapper} ${className}`}>
        <span className={styles.phonePrefix}>+7</span>
        <input
          ref={inputRef}
          type="tel"
          value={value}
          onChange={handleChange}
          placeholder="(___)-___-__-__"
          className={`${styles.input} ${widthClass}`}
          required={required}
        />
      </div>
    ) : (
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        className={`${styles.input} ${widthClass} ${className}`}
        required={required}
      />
    );

    if (required) {
      return (
        <div className={styles.inputContainer}>
          {inputElement}
          <span className={styles.requiredIndicator}>*</span>
        </div>
      );
    }

    return inputElement;
  };

  return (
    <div className={labelTop ? styles.wrapperVertical : styles.wrapper}>
      {label && (
        <label className={`${labelTop ? styles.labelTop : styles.label} ${labelClassName}`}>
          {label}
        </label>
      )}
      {renderInput()}
    </div>
  );
};

export default Input;
