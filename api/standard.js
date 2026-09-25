import db from '../backend/database.json' with { type: 'json' };

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');

  try {
    const id = req.query.id;
    const standard = db.standards.find(s => s.id === id);
    
    if (!standard) {
      return res.status(404).json({ error: 'Standard not found' });
    }
    
    return res.status(200).json(standard);
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to fetch standard' });
  }
}
