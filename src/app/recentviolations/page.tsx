'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import styles from './page.module.css'; // Ensure this file contains necessary styles

type TableColumn = {
  id: number;
  description: string;
  date: string;
  status: string;
};

const RecentViolationsPage = () => {
  const [data, setData] = useState<TableColumn[]>([]);
  const [editingStatus, setEditingStatus] = useState<number | null>(null);
  const [statusValue, setStatusValue] = useState<string | null>(null);

  useEffect(() => {
    // Simulate fetching data
    const fetchData = () => {
      return Array.from({ length: 40 }, (_, index) => ({
        id: index + 1,
        description: `Violation Description ${index + 1}`,
        date: `2024-08-${String(index + 1).padStart(2, '0')}`,
        status: index % 2 === 0 ? 'Pending' : 'Resolved'
      }));
    };

    // Populate data
    const generatedData = fetchData();
    setData(generatedData);
  }, []);

  const handleStatusClick = (id: number, currentStatus: string) => {
    setEditingStatus(id);
    setStatusValue(currentStatus);
  };

  const handleStatusChange = (e: ChangeEvent<HTMLSelectElement>, id: number) => {
    const newStatus = e.target.value;
    setData(prevData =>
      prevData.map(row =>
        row.id === id ? { ...row, status: newStatus } : row
      )
    );
    setEditingStatus(null);
  };

  const handleDropdownBlur = () => {
    setEditingStatus(null);
  };

  return (
    <div className={styles.container}>
      <h1>Recent Violations</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Description</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          {data.length > 0 ? (
            data.map(row => (
              <tr key={row.id}>
                <td>{row.id}</td>
                <td>{row.description}</td>
                <td>{row.date}</td>
                <td
                  onClick={() => handleStatusClick(row.id, row.status)}
                  className={styles.statusCell}
                >
                  {editingStatus === row.id ? (
                    <select
                      value={statusValue || row.status}
                      onChange={(e) => handleStatusChange(e, row.id)}
                      onBlur={handleDropdownBlur}
                      autoFocus
                      className={styles.statusDropdown}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Resolved">Resolved</option>
                    </select>
                  ) : (
                    row.status
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={4}>No data available</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default RecentViolationsPage;
