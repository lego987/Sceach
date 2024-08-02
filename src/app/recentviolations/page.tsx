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
    // Simulate fetching data
    const fetchData = () => {
      const rows: TableColumn[] = Array.from({ length: 40 }, (_, index) => ({
        id: index + 1,
        description: `Sample Violation ${index + 1}`,
        date: '2024-08-02',
        status: 'Pending',
      }));
      setData(rows);
    };
    fetchData();
  }, []);

  const handleStatusChange = (index: number, newStatus: string) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);
  };

  return (
    <div className={styles.container}>
      <h1>Recent Violations</h1>
      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Description</th>
              <th>Date</th>
              <th>Status</th>
              <th>View Evidence</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.description}</td>
                <td>{row.date}</td>
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
                <td><a href="#">click to view</a></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentViolationsPage;
