import db from '../backend/db.js';

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    return res.status(200).json({
      status: 'online',
      lastSync: db.lastUpdated,
      totalStandards: db.standards.length,
      platform: 'Vercel Serverless'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Database unavailable' });
  }
}
