// src/app/recent-violations/page.tsx
'use client';

import { useState, useEffect } from 'react';
import styles from './page.module.css';

type TableColumn = {
  id: number;
  description: string;
  date: string;
  status: string;
};

const RecentViolationsPage = () => {
  const [data, setData] = useState<TableColumn[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('/api/violations');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const rows: TableColumn[] = await response.json();
        setData(rows);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  const handleStatusChange = async (index: number, newStatus: string) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);

    try {
      const rowId = data[index].id;
      await fetch('/api/updateStatus', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: rowId, status: newStatus }),
      });
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  return (
    <div className={styles.container}>
      <h2>Recent Violations</h2>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.tableHeader}>ID</th>
              <th className={styles.tableHeader}>Description</th>
              <th className={styles.tableHeader}>Date</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>View Evidence</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr 
                key={row.id} 
                className={index % 2 === 0 ? styles.tableRowEven : ''}
              >
                <td className={styles.tableCell}>{row.id}</td>
                <td className={styles.tableCell}>{row.description}</td>
                <td className={styles.tableCell}>{row.date}</td>
                <td className={styles.statusCell}>
                  <select
                    value={row.status}
                    onChange={(e) => handleStatusChange(index, e.target.value)}
                    className={styles.statusDropdown}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Resolved">Resolved</option>
                  </select>
                </td>
                <td className={styles.tableCell}><a href="#">click to view</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentViolationsPage;
