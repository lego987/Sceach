

'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import styles from './page.module.css';

type TableColumn = {
  id: number;
  description: string;
  latitude: number;
  longitude: number;
  county: string;
  severity: string;
  status: string;
  before_img: string;
  after_img: string;
};

// Initial mock data
const initialMockData: TableColumn[] = [{
  id: 0,
  description: 'New Violation 0',
  latitude: 0,
  longitude: 0,
  county: 'Sample County',
  severity: 'Low',
  status: 'Pending',
  before_img: 'before.jpg',
  after_img: 'after.jpg',
},
{
  id: 1,
  description: 'New Violation 1',
  latitude: 10,
  longitude: 20,
  county: 'Another County',
  severity: 'High',
  status: 'Resolved',
  before_img: 'before2.jpg',
  after_img: 'after2.jpg',
}];

const RecentViolationsPage = () => {
  const [data, setData] = useState<TableColumn[]>(initialMockData);
  const router = useRouter();

  useEffect(() => {
    // Simulate new violations being added every 5 seconds
    const intervalId = setInterval(() => {
      const newViolation: TableColumn = {
        id: data.length,
        description: `New Violation ${data.length + 1}`,
        latitude: Math.random() * 100,
        longitude: Math.random() * 100,
        county: 'New County',
        severity: 'Medium',
        status: 'Pending',
        before_img: `before${data.length + 1}.jpg`,
        after_img: `after${data.length + 1}.jpg`,
      };
      setData((prevData) => [...prevData, newViolation]);
    }, 5000); // Adjust time as needed

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, [data]);

  const handleStatusChange = async (index: number, newStatus: string) => {
    const updatedData = [...data];
    updatedData[index].status = newStatus;
    setData(updatedData);

    // Simulate API call to update status
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

  const handleViewDetails = (id: number) => {
    router.push(`/recentviolations/${id}`);
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
              <th className={styles.tableHeader}>County</th>
              <th className={styles.tableHeader}>Status</th>
              <th className={styles.tableHeader}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {data.map((row, index) => (
              <tr key={row.id} className={index % 2 === 0 ? styles.tableRowEven : ''}>
                <td className={styles.tableCell}>{row.id}</td>
                <td className={styles.tableCell}>{row.description}</td>
                <td className={styles.tableCell}>{row.county}</td>
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
                <td className={styles.tableCell}>
                  <button onClick={() => handleViewDetails(row.id)}>
                    View Details
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentViolationsPage;
