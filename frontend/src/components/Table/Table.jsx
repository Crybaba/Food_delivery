import React from 'react';
import styles from './Table.module.css';

const Table = ({ columns = [], data = [] }) => {
  // Безопасные значения по умолчанию
  const safeColumns = Array.isArray(columns) ? columns : [];
  const safeData = Array.isArray(data) ? data : [];

  return (
    <div className={styles.tableWrapper}>
      {safeData.length === 0 ? (
        <p className={styles.empty}>Нет данных для отображения</p>
      ) : (
        <table className={styles.table}>
          <thead>
            <tr>
              {safeColumns.map((col) => (
                <th
                  key={col.key}
                  style={{
                    textAlign: col.align || 'left',
                    width: col.width,
                  }}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {safeData.map((row, idx) => (
              <tr
                key={row.id || idx}
                className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}
              >
                {safeColumns.map((col) => (
                  <td
                    key={col.key}
                    style={{ textAlign: col.align || 'left' }}
                  >
                    {/* 
                      Поддержка:
                      - обычного текста
                      - JSX-компонентов (например, кнопки или изображения)
                    */}
                    {typeof row[col.key] === 'object'
                      ? row[col.key]
                      : String(row[col.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Table;
