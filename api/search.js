import db from '../backend/db.js';

export default function handler(req, res) {
  // CORS Headers for local development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const query = (req.query.q || '').toLowerCase();
    const sectorFilter = req.query.sector ? req.query.sector.split(',') : [];
    
    let results = db.standards;

    // Filtering
    if (sectorFilter.length > 0) {
      results = results.filter(s => sectorFilter.includes(s.sector));
    }

    // Text Matching
    if (query) {
      const searchTerms = query.split(' ').filter(t => t.length > 2);
      
      results = results.map(standard => {
        let score = 0;
        const textToSearch = `${standard.title} ${standard.scope} ${standard.isNumber}`.toLowerCase();
        
        searchTerms.forEach(term => {
          if (textToSearch.includes(term)) score += 0.2;
        });
        
        if (textToSearch.includes(query)) score += 0.5;

        return {
          standard,
          matchScore: Math.min(score, 0.99),
          matchReason: score > 0 ? `Matched keywords.` : '',
          highlightedPhrases: searchTerms
        };
      }).filter(r => r.matchScore > 0)
        .sort((a, b) => b.matchScore - a.matchScore)
        .slice(0, 20); // Top 20
        
      return res.status(200).json(results);
    } else {
      // Recent fallback
      return res.status(200).json(results.slice(0, 10).map(standard => ({
        standard,
        matchScore: 0,
        matchReason: 'Recent standards',
        highlightedPhrases: []
      })));
    }
  } catch (error) {
    console.error('API Error:', error);
    return res.status(500).json({ error: 'Failed to search standards' });
  }
}
