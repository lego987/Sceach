'use client';

import { useRouter } from 'next/navigation';
import React, { useState, useEffect } from 'react';
import styles from './page.module.css';

type ViolationDetails = {
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

const mockViolation: ViolationDetails = {
  id: 1,
  description: 'Illegal cutting of hedge.',
  latitude: 34.0522,
  longitude: -118.2437,
  county: 'sample county',
  severity: 'sample severity',
  status: 'Pending/resolved',
  before_img: 'sample img',
  after_img: 'sample img',
};

const ViolationDetailPage = ({ params }: { params: { id: string } }) => {
  const [violation, setViolation] = useState<ViolationDetails | null>(null);
  const { id } = params;

  useEffect(() => {
    // Simulate fetching data by setting mock data after a delay
    const fetchDetails = async () => {
      try {
        // Replace this with a real API call when the database is available
        // const response = await fetch(`/api/violations/${id}`);
        // if (!response.ok) {
        //   throw new Error('Network response was not ok');
        // }
        // const data: ViolationDetails = await response.json();
        
        // Use mock data for now
        const data = mockViolation;
        setViolation(data);
      } catch (error) {
        console.error('Error fetching details:', error);
      }
    };
    fetchDetails();
  }, [id]);

  if (!violation) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <div className={styles.violationBox}>
        <h1 className={styles.title}>Violation Details</h1>
      </div>
      <div className={styles.images}>
        <div className={styles.imageContainer}>
          <img src={violation.before_img} alt="Before" className={styles.image} />
          <div className={styles.imageLabel}>Before</div>
        </div>
        <div className={styles.imageContainer}>
          <img src={violation.after_img} alt="After" className={styles.image} />
          <div className={styles.imageLabel}>After</div>
        </div>
      </div>
      <div className={styles.textDetails}>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>ID:</span>
          <span className={styles.detailValue}>{violation.id}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Description:</span>
          <span className={styles.detailValue}>{violation.description}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Latitude:</span>
          <span className={styles.detailValue}>{violation.latitude}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Longitude:</span>
          <span className={styles.detailValue}>{violation.longitude}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>County:</span>
          <span className={styles.detailValue}>{violation.county}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Severity:</span>
          <span className={styles.detailValue}>{violation.severity}</span>
        </div>
        <div className={styles.detailItem}>
          <span className={styles.detailLabel}>Status:</span>
          <span className={styles.detailValue}>{violation.status}</span>
        </div>
      </div>
    </div>
  );
};

export default ViolationDetailPage;
