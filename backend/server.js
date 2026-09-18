const express = require('express');
const cors = require('cors');
const cron = require('node-cron');
const fs = require('fs/promises');
const path = require('path');
const { scrapeBIS } = require('./scraper');

const app = express();
const PORT = process.env.PORT || 3001;
const DB_PATH = path.join(__dirname, 'database.json');

app.use(cors());
app.use(express.json());

// -------------------------------------------------------------
// CRON JOB: Sync Data Automatically
// -------------------------------------------------------------
// Runs every day at 2:00 AM (server time)
cron.schedule('0 2 * * *', () => {
  console.log('[Cron] Triggering daily BIS database sync...');
  scrapeBIS();
});

// -------------------------------------------------------------
// API ENDPOINTS
// -------------------------------------------------------------

// Helper to read the database safely
async function getDatabase() {
  try {
    const data = await fs.readFile(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Database read error:', error);
    // Return empty state if file doesn't exist yet
    return { lastUpdated: null, standards: [] };
  }
}

// 1. Get sync status / admin health
app.get('/api/health', async (req, res) => {
  const db = await getDatabase();
  res.json({
    status: 'online',
    lastSync: db.lastUpdated,
    totalStandards: db.standards.length
  });
});

// 2. Search standards (The Core Endpoint)
app.get(['/api/standards/search', '/api/search'], async (req, res) => {
  const query = req.query.q?.toLowerCase() || '';
  const sectorFilter = req.query.sector ? req.query.sector.split(',') : [];
  
  const db = await getDatabase();
  let results = db.standards;

  // Basic Filtering
  if (sectorFilter.length > 0) {
    results = results.filter(s => sectorFilter.includes(s.sector));
  }

  // Basic Text Matching & Scoring Algorithm
  if (query) {
    const searchTerms = query.split(' ').filter(t => t.length > 2);
    
    results = results.map(standard => {
      let score = 0;
      const textToSearch = `${standard.title} ${standard.scope} ${standard.isNumber}`.toLowerCase();
      
      searchTerms.forEach(term => {
        if (textToSearch.includes(term)) score += 0.2;
      });
      
      // Exact phrase bonus
      if (textToSearch.includes(query)) score += 0.5;

      return {
        standard,
        matchScore: Math.min(score, 0.99), // Cap at 99%
        matchReason: score > 0 ? `Matched keywords in title or scope.` : '',
        highlightedPhrases: searchTerms
      };
    }).filter(r => r.matchScore > 0)
      .sort((a, b) => b.matchScore - a.matchScore)
      .slice(0, 20); // Return top 20
      
    res.json(results);
  } else {
    // If no query, just return top 10 recent
    res.json(results.slice(0, 10).map(standard => ({
      standard,
      matchScore: 0,
      matchReason: 'Recent standards',
      highlightedPhrases: []
    })));
  }
});

// 3. Get single standard detail
app.get(['/api/standards/:id', '/api/standard'], async (req, res) => {
  const db = await getDatabase();
  const id = req.params.id || req.query.id;
  const standard = db.standards.find(s => s.id === id);
  
  if (!standard) {
    return res.status(404).json({ error: 'Standard not found' });
  }
  
  res.json(standard);
});

// 4. Manually trigger a sync (for testing/admin panel)
app.post('/api/admin/sync', (req, res) => {
  // Fire and forget
  scrapeBIS();
  res.json({ message: 'Sync process started in the background.' });
});

// Start the server
app.listen(PORT, () => {
  console.log(`[Server] StandardSense backend running on http://localhost:${PORT}`);
});
