import type {
  SearchResult,
  FilterState,
  Standard,
  AdminStats,
  LanguageCode,
} from '../types';
import { standards } from '../data/standards';
import { findCannedResponse, fallbackResponse, buildInlineResults } from '../data/chatResponses';

// ── Latency simulation ─────────────────────────────────────────────

function delay(min = 300, max = 900): Promise<void> {
  const ms = Math.floor(Math.random() * (max - min + 1)) + min;
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ── Search / Recommendations ────────────────────────────────────────

const matchPhrases: Record<string, string[]> = {
  'cement': ['Portland pozzolana', 'cement clinker', 'OPC 43 grade', 'fly ash based'],
  'concrete': ['reinforced concrete', 'mix design', 'compressive strength', 'grade of concrete'],
  'steel': ['TMT bars', 'deformed steel bars', 'Fe 500D', 'high strength reinforcement'],
  'aggregate': ['coarse aggregate', 'fine aggregate', 'grading requirements', 'crushing value'],
  'led': ['LED luminaire', 'street lighting', 'luminous efficacy', 'lumen maintenance'],
  'lighting': ['road lighting', 'IP66 luminaire', 'photometric distribution', 'colour temperature'],
  'luminaire': ['street luminaire', 'outdoor lighting fixture', 'IP rating', 'thermal management'],
  'cable': ['PVC insulated cable', '1100V working voltage', 'copper conductor', 'FRLS'],
  'pcb': ['multilayer PCB', 'printed circuit board', 'impedance control', 'HDI interconnect'],
  'transformer': ['power transformer', 'voltage ratio', 'temperature rise', 'insulation level'],
  'ups': ['uninterruptible power', 'battery backup', 'efficiency requirements', 'standby power'],
  'water': ['drinking water', 'TDS limits', 'bacteriological quality', 'chlorine residual'],
  'packaged': ['packaged drinking water', 'bottled water', 'PET packaging', 'mineral content'],
  'milk': ['milk powder', 'spray drying', 'fat content', 'microbiological limits'],
  'salt': ['edible salt', 'iodine fortification', 'sodium chloride', 'moisture content'],
  'honey': ['extracted honey', 'C4 sugar test', 'HMF content', 'diastase activity'],
  'spice': ['chilli powder', 'aflatoxin limits', 'foreign matter', 'moisture content'],
  'chilli': ['Capsicum annuum', 'ground chilli', 'colour value', 'Scoville units'],
  'cotton': ['cotton fabric', 'grey fabric', 'thread count', 'breaking strength'],
  'textile': ['woven fabric', 'colour fastness', 'GSM weight', 'pilling resistance'],
  'polyester': ['poly-cotton blend', 'uniform fabric', 'dimensional stability', 'crease recovery'],
  'fabric': ['government textile', 'uniform cloth', 'weave structure', 'yarn count'],
  'brick': ['burnt clay bricks', 'compressive strength', 'water absorption', 'efflorescence'],
  'defence': ['defence electronics', 'military grade', 'JSS specifications', 'environmental testing'],
  'bridge': ['bridge construction', 'structural concrete', 'exposure conditions', 'durability'],
  'formaldehyde': ['formaldehyde content', 'textile safety', 'skin contact', 'water extraction method'],
};

function computeMatchScore(query: string, standard: Standard): {
  score: number;
  reason: string;
  phrases: string[];
} {
  const lowerQuery = query.toLowerCase();
  const words = lowerQuery.split(/\s+/);

  let score = 0;
  const phrases: string[] = [];
  let reasons: string[] = [];

  // Title matching
  const lowerTitle = standard.title.toLowerCase();
  for (const word of words) {
    if (word.length < 3) continue;
    if (lowerTitle.includes(word)) {
      score += 0.2;
      reasons.push(`title contains "${word}"`);
    }
  }

  // Scope matching
  const lowerScope = standard.scope.toLowerCase();
  for (const word of words) {
    if (word.length < 3) continue;
    if (lowerScope.includes(word)) {
      score += 0.1;
    }
  }

  // Sector matching
  const lowerSector = standard.sector.toLowerCase();
  if (words.some(w => lowerSector.includes(w))) {
    score += 0.15;
    reasons.push(`sector: ${standard.sector}`);
  }

  // Keyword phrase matching
  for (const word of words) {
    if (matchPhrases[word]) {
      phrases.push(...matchPhrases[word].slice(0, 2));
      score += 0.15;
    }
  }

  // Certification boost
  if (standard.certifications.length > 0) {
    score += 0.05;
  }

  // Status penalty
  if (standard.status === 'Superseded') score -= 0.15;
  if (standard.status === 'Withdrawn') score -= 0.3;

  // Clamp
  score = Math.min(0.99, Math.max(0.05, score));

  // Add small random variation
  score += (Math.random() - 0.5) * 0.08;
  score = Math.min(0.99, Math.max(0.05, score));

  const reason = reasons.length > 0
    ? `Matched: ${reasons.slice(0, 2).join(', ')}`
    : `Related to ${standard.sector.toLowerCase()} specifications`;

  return { score, reason, phrases: phrases.length > 0 ? phrases : [standard.title.split('—')[0].trim()] };
}

export async function searchStandards(
  query: string,
  filters?: Partial<FilterState>
): Promise<SearchResult[]> {
  try {
    const url = new URL('http://localhost:3001/api/standards/search');
    url.searchParams.append('q', query);
    
    if (filters && filters.sectors && filters.sectors.length > 0) {
      url.searchParams.append('sector', filters.sectors.join(','));
    }
    
    const res = await fetch(url.toString());
    if (!res.ok) throw new Error('Network response was not ok');
    return await res.json();
  } catch (err) {
    console.error('Search error:', err);
    return [];
  }
}

// ── Get single standard ─────────────────────────────────────────────

export async function getStandard(id: string): Promise<Standard | null> {
  try {
    const res = await fetch(`http://localhost:3001/api/standards/${id}`);
    if (!res.ok) throw new Error('Not found');
    return await res.json();
  } catch (err) {
    console.error('Detail fetch error:', err);
    return null;
  }
}

// ── Chat / RAG streaming ────────────────────────────────────────────

export interface ChatStreamResult {
  content: string;
  citations: NonNullable<ReturnType<typeof findCannedResponse>>['citations'];
  toolCalls: NonNullable<ReturnType<typeof findCannedResponse>>['toolCalls'];
  suggestedQuestions: string[];
  inlineResults: SearchResult[];
}

export async function* chatStream(
  message: string,
): AsyncGenerator<{ type: 'tool' | 'token' | 'done'; data: string | ChatStreamResult }> {
  const matched = findCannedResponse(message);
  const response = matched ?? fallbackResponse;

  // Yield tool calls first
  if (response.toolCalls) {
    for (const tc of response.toolCalls) {
      await delay(200, 400);
      yield { type: 'tool', data: JSON.stringify(tc) };
    }
  }

  // Simulate search delay
  await delay(300, 600);

  // Stream tokens character by character (fast, ~15ms per char)
  const content = response.content;
  for (let i = 0; i < content.length; i++) {
    yield { type: 'token', data: content[i] };
    // Variable speed: faster for spaces/newlines, slower for actual content
    const charDelay = content[i] === ' ' || content[i] === '\n' ? 5 : 12;
    await new Promise(resolve => setTimeout(resolve, charDelay));
  }

  // Yield final result
  const inlineResults = response.inlineStandardIds
    ? buildInlineResults(response.inlineStandardIds)
    : [];

  yield {
    type: 'done',
    data: {
      content,
      citations: response.citations ?? [],
      toolCalls: response.toolCalls ?? [],
      suggestedQuestions: response.suggestedQuestions,
      inlineResults,
    },
  };
}

// ── Language detection ───────────────────────────────────────────────

export async function detectLanguage(text: string): Promise<{
  code: LanguageCode;
  name: string;
  confidence: number;
}> {
  await delay(100, 300);

  // Simple heuristic for mock
  const hindiChars = /[\u0900-\u097F]/;
  const banglaChars = /[\u0980-\u09FF]/;
  const tamilChars = /[\u0B80-\u0BFF]/;
  const marathiChars = /[\u0900-\u097F]/; // Same block as Hindi

  if (hindiChars.test(text)) {
    return { code: 'hi', name: 'Hindi', confidence: 0.92 };
  }
  if (banglaChars.test(text)) {
    return { code: 'bn', name: 'Bengali', confidence: 0.89 };
  }
  if (tamilChars.test(text)) {
    return { code: 'ta', name: 'Tamil', confidence: 0.91 };
  }

  return { code: 'en', name: 'English', confidence: 0.98 };
}

// ── Admin stats ─────────────────────────────────────────────────────

export async function getAdminStats(): Promise<AdminStats> {
  try {
    const res = await fetch('http://localhost:3001/api/health');
    const health = await res.json();
    return {
      lastSyncTimestamp: health.lastSync || 'Never',
      totalRecords: health.totalStandards || 0,
      embeddingIndexFreshness: 'Just now',
      catalogVersion: 'v2026.09',
      recordsIngested: health.totalStandards || 0,
      pendingUpdates: 0,
    };
  } catch (err) {
    console.error('Health fetch error:', err);
    return {
      lastSyncTimestamp: 'Unknown',
      totalRecords: 0,
      embeddingIndexFreshness: 'Unknown',
      catalogVersion: 'Unknown',
      recordsIngested: 0,
      pendingUpdates: 0,
    };
  }
}

export async function* triggerSync(): AsyncGenerator<{ progress: number; status: string }> {
  const steps = [
    { progress: 5, status: 'Connecting to BIS catalog API...' },
    { progress: 15, status: 'Fetching updated records...' },
    { progress: 30, status: 'Downloaded 1,247 new records' },
    { progress: 45, status: 'Processing amendments and revisions...' },
    { progress: 60, status: 'Updating cross-reference index...' },
    { progress: 75, status: 'Rebuilding embedding vectors...' },
    { progress: 88, status: 'Validating data integrity...' },
    { progress: 95, status: 'Updating search index...' },
    { progress: 100, status: 'Sync complete — 42 records updated' },
  ];

  for (const step of steps) {
    await delay(400, 800);
    yield step;
  }
}

// ── File parsing simulation ─────────────────────────────────────────

export async function* parseFile(
  file: File
): AsyncGenerator<{ progress: number; status: string; text?: string }> {
  yield { progress: 10, status: 'Reading file header...' };
  await delay(200, 400);
  yield { progress: 30, status: 'Extracting text content...' };
  await delay(300, 500);
  yield { progress: 60, status: 'Processing document structure...' };
  await delay(200, 400);
  yield { progress: 85, status: 'Analyzing specifications...' };
  await delay(200, 300);

  // Generate a fake extracted text based on filename
  const name = file.name.toLowerCase();
  let text = 'LED street lighting luminaires, 90W, IP66, colour temperature 5000K';
  if (name.includes('cement') || name.includes('concrete')) {
    text = 'Portland pozzolana cement for reinforced concrete bridge works, M40 grade';
  } else if (name.includes('water')) {
    text = 'Packaged drinking water supply for municipal corporation offices';
  } else if (name.includes('textile') || name.includes('fabric')) {
    text = 'Polyester-cotton blended uniform fabric, 120 GSM, colour fastness Grade 4';
  }

  yield { progress: 100, status: 'Extraction complete', text };
}

// ── All standards list (for command palette search) ─────────────────

export async function getAllStandards(): Promise<Standard[]> {
  await delay(100, 200);
  return [...standards];
}
