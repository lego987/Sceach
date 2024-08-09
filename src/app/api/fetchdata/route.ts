import { Pool } from 'pg';

const pool = new Pool({
    connectionString: 'postgresql://postgres:foURbYADEEfpnVvbyDVAsofGCwSsVsQY@postgres.railway.internal:5432/railway',
  });

  export default async function handler(req, res) {
    if (req.method === 'GET') {
      try {
        const result = await pool.query('SELECT id, description, latitude, longitude, county, severity, status, before_img, after_img FROM violations');
        res.status(200).json(result.rows);
      } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).json({ error: 'Internal Server Error' });
      }
    } else {
      res.status(405).json({ error: 'Method not allowed' });
    }
  }