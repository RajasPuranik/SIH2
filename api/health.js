const fs = require('fs');
const path = require('path');

module.exports = (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const db = require('../backend/database.json');
    
    return res.status(200).json({
      status: 'online',
      lastSync: db.lastUpdated,
      totalStandards: db.standards.length,
      platform: 'Vercel Serverless'
    });
  } catch (error) {
    return res.status(500).json({ error: 'Database unavailable' });
  }
};
