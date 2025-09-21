import React from 'react';
import styles from './Table.module.css';

const Table = ({ columns, data }) => {
  return (
    <div className={styles.tableWrapper}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx}>{col}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, idx) => (
            <tr key={idx} className={idx % 2 === 0 ? styles.rowEven : styles.rowOdd}>
              {row.map((cell, i) => (
                <td
                  key={i}
                  className={typeof cell === 'number' ? styles.cellNumber : styles.cellText}
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
