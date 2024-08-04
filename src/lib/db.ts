// src/lib/db.ts
import { Pool } from 'pg';

// Create a new pool instance for PostgreSQL connection
const pool = new Pool({
  connectionString: 'postgresql://postgres:foURbYADEEfpnVvbyDVAsofGCwSsVsQY@viaduct.proxy.rlwy.net:22583/railway',
});

export default pool;
