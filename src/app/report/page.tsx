import styles from './page.module.css';

interface ReportItem {
  id: number;
  county: string;
  Severity: string;
  townsland: string;
}

// Hardcoded data for simplicity
const reportData: ReportItem[] = [
  { id: 12749, county: 'Cork', Severity: '7', townsland: 'Ballineen' },
  { id: 29332, county: 'Cork', Severity: '9', townsland: 'Enniskeanne' },
  { id: 38392, county: 'Tipperary', Severity: '4', townsland: 'Holy Cross' },
];

const ReportTable = () => {
  return (
    <div className={styles['table-container']}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>ID</th>
            <th>County</th>
            <th>Severity</th>
            <th>townsland</th>
          </tr>
        </thead>
        <tbody>
          {reportData.length > 0 ? (
            reportData.map(item => (
              <tr key={item.id}>
                <td>{item.id}</td>
                <td>{item.county}</td>
                <td>{item.Severity}</td>
                <td>{item.townsland}</td>
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

// Server Component
const ReportPage = () => {
  return (
    <div className={styles.container}>
      <h1>Report Page</h1>
      <ReportTable />
    </div>
  );
};

export default ReportPage;
