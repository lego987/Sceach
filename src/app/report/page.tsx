import Image from 'next/image';
import styles from './report.css';

interface ReportItem {
  id: number;
  name: string;
  description: string; // Changed to description
}

// Server Component for data fetching
const fetchReportData = async (): Promise<ReportItem[]> => {
  // Fetch data from local JSON file
  const res = await fetch(users/tomasmarkey/documents/patchdata/report.json'); // Adjust URL if needed
  if (!res.ok) {
    throw new Error('Failed to fetch data');
  }
  return res.json();
};

const ReportTable = async () => {
  const data = await fetchReportData();

  return (
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {data.length > 0 ? (
          data.map(item => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>{item.description}</td>
            </tr>
          ))
        ) : (
          <tr>
            <td colSpan={3}>No data available</td>
          </tr>
        )}
      </tbody>
    </table>
  );
};

// Server Component
const ReportPage = async () => {
  return (
    <div className={styles.container}>
      <h1>Report Page</h1>
      <ReportTable />
    </div>
  );
};

export default ReportPage;
