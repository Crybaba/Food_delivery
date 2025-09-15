import React from 'react';

export default function OptionCard({ title, icon, onClick }) {
  return (
    <button onClick={onClick} className="option-card">
      <span>{title}</span>
      <span style={{ fontSize: 22 }}>{icon}</span>
    </button>
  );
}


