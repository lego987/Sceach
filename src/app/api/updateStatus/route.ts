// src/app/api/updateStatus/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { Pool } from 'pg';

const pool = new Pool({
  connectionString: 'postgresql://postgres:foURbYADEEfpnVvbyDVAsofGCwSsVsQY@postgres.railway.internal:5432/railway',
});

export async function POST(request: NextRequest) {
  const { id, status } = await request.json();

  try {
    await pool.query('UPDATE violations SET status = $1 WHERE id = $2', [status, id]); // Replace 'violations' with your actual table name
    return NextResponse.json({ message: 'Status updated successfully' });
  } catch (error) {
    console.error('Error updating status:', error);
    return NextResponse.error();
  }
}
