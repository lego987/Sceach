import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres:foURbYADEEfpnVvbyDVAsofGCwSsVsQY@postgres.railway.internal:5432/railway',
});

export const getDatabaseConnection = () => pool;