// src/pages/api/updateStatus.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import pool from '../../lib/db';

type UpdateStatusRequest = {
  id: number;
  status: string;
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    try {
      const { id, status }: UpdateStatusRequest = req.body;
      await pool.query('UPDATE violations SET status = $1 WHERE id = $2', [status, id]); // Replace 'violations' with your actual table name
      res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
      console.error('Error updating status:', error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
