import { NextApiRequest, NextApiResponse } from 'next';
import { getDatabaseConnection } from '@/app/utils/database';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { id, status } = req.body;

    if (!id || !status) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    try {
      const db = getDatabaseConnection();
      const client = await db.connect(); // Connect to the database
      const violation = await client.query('SELECT * FROM violations WHERE id = $1', [id]);

      if (violation.rows.length === 0) {
        return res.status(404).json({ error: 'Violation not found' });
      }

      await client.query('UPDATE violations SET status = $1 WHERE id = $2', [status, id]);
      client.release(); // Release the connection back to the pool

      return res.status(200).json({ message: 'Status updated successfully' });
    } catch (error) {
      console.error('Error updating status:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} not allowed`);
  }
}
