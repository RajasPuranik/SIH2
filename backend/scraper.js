const puppeteer = require('puppeteer');
const fs = require('fs/promises');
const path = require('path');

const DB_PATH = path.join(__dirname, 'database.json');

/**
 * This is an automated scraper that uses Puppeteer to navigate the official BIS portal.
 * Note: The exact selectors (.result-row, .title, etc.) will need to be adjusted
 * based on the actual HTML structure of standardsbis.bsbedge.com at the time of running.
 */
async function scrapeBIS() {
  console.log('[Scraper] Starting official BIS data sync...');
  const browser = await puppeteer.launch({
    headless: "new",
    // args: ['--no-sandbox', '--disable-setuid-sandbox'] // Uncomment if deploying to Linux/Render
  });
  
  try {
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');

    console.log(`[Scraper] Scraping latest standards from BIS homepage...`);
    await page.goto('https://standardsbis.bsbedge.com/', { waitUntil: 'networkidle2' });
    
    // Actually extract real data from the homepage carousels!
    const scrapedData = await page.evaluate(() => {
      const links = document.querySelectorAll('a[href*="Standard_Number="]');
      const results = [];
      
      links.forEach(link => {
        const url = new URL(link.href, 'https://standardsbis.bsbedge.com/');
        const isNumberRaw = url.searchParams.get('Standard_Number') || '';
        const id = url.searchParams.get('id') || Math.random().toString();
        
        const bTag = link.querySelector('b');
        if (!bTag) return;
        
        const isNumberAndYear = bTag.innerText.trim();
        const titleText = link.innerHTML.split('<br>')[1]?.trim().replace(/<[^>]*>?/gm, '') || 'Official Indian Standard';
        
        let year = new Date().getFullYear();
        const yearMatch = isNumberAndYear.match(/: (\d{4})/);
        if (yearMatch) {
           year = parseInt(yearMatch[1]);
        }

        // Avoid duplicates
        if (!results.find(r => r.isNumber === isNumberRaw)) {
          results.push({
            id: `real-${id}`,
            isNumber: isNumberRaw,
            year: year,
            title: titleText,
            scope: `This is a newly released standard automatically scraped from the BIS portal.`,
            status: 'Current',
            sector: 'General (Auto-Scraped)',
            certifications: [],
            icsCode: '00.000',
            amendments: [],
            normativeReferences: []
          });
        }
      });
      return results;
    });
    
    const standards = scrapedData;

    console.log(`[Scraper] Successfully scraped ${standards.length} standards. Updating database...`);
    
    // Write to our local JSON database (you can replace this with MongoDB/Postgres inserts)
    await fs.writeFile(DB_PATH, JSON.stringify({
      lastUpdated: new Date().toISOString(),
      standards: standards
    }, null, 2));
    
    console.log('[Scraper] Sync complete.');
    
  } catch (error) {
    console.error('[Scraper] Error during sync:', error);
  } finally {
    await browser.close();
  }
}

// Allow running manually via `node scraper.js`
if (require.main === module) {
  scrapeBIS();
}

module.exports = { scrapeBIS };
