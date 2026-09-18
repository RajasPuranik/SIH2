// ── Standard & related entities ─────────────────────────────────────

export type StandardStatus = 'Current' | 'Superseded' | 'Withdrawn' | 'Under Revision';

export type CertificationType = 'ISI Mark' | 'CRS' | 'QCO' | 'WPC' | 'FSSAI';

export type Sector = 'Construction' | 'Electronics' | 'Textiles' | 'Food Safety' | 'Chemicals' | 'Mechanical' | 'Defence';

export interface Amendment {
  number: string;
  date: string;
  description: string;
}

export interface NormativeReference {
  standardId: string;
  relationship: 'normative' | 'informative' | 'supersedes' | 'superseded-by';
}

export interface Clause {
  id: string;
  number: string;
  title: string;
  children?: Clause[];
}

export interface Standard {
  id: string;
  isNumber: string;
  title: string;
  year: number;
  status: StandardStatus;
  icsCode: string;
  sector: Sector;
  scope: string;
  certifications: CertificationType[];
  amendments: Amendment[];
  normativeReferences: NormativeReference[];
  equivalentIso: string | null;
  lastRevisionDate: string;
  reaffirmationYear: number | null;
  clauses: Clause[];
  tenderCount: number;
}

// ── Search & Results ────────────────────────────────────────────────

export interface SearchResult {
  standard: Standard;
  matchScore: number;
  matchReason: string;
  highlightedPhrases: string[];
}

export interface FilterState {
  sectors: Sector[];
  icsCodes: string[];
  statuses: StandardStatus[];
  certifications: CertificationType[];
  yearRange: [number, number];
}

// ── Tender Basket ───────────────────────────────────────────────────

export interface TenderBasketItem {
  standard: Standard;
  addedAt: number;
  notes: string;
}

export interface BasketConflict {
  type: 'superseded' | 'missing-reference';
  standardId: string;
  relatedStandardId: string;
  message: string;
}

// ── Chat / RAG Assistant ────────────────────────────────────────────

export interface Citation {
  index: number;
  documentName: string;
  clauseNumber: string;
  snippet: string;
  standardId?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  citations?: Citation[];
  toolCalls?: ToolCall[];
  suggestedQuestions?: string[];
  inlineStandards?: SearchResult[];
  timestamp: number;
}

export interface ToolCall {
  name: string;
  description: string;
  durationMs: number;
  documentsSearched: number;
}

export interface ChatConversation {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
}

// ── Admin ───────────────────────────────────────────────────────────

export interface AdminStats {
  lastSyncTimestamp: string;
  totalRecords: number;
  embeddingIndexFreshness: string;
  catalogVersion: string;
  recordsIngested: number;
  pendingUpdates: number;
}

// ── Language ────────────────────────────────────────────────────────

export type LanguageCode = 'en' | 'hi' | 'bn' | 'ta' | 'mr';

export interface Language {
  code: LanguageCode;
  name: string;
  nativeName: string;
}

// ── Command Palette ─────────────────────────────────────────────────

export interface CommandItem {
  id: string;
  label: string;
  description?: string;
  icon: string;
  action: () => void;
  category: 'navigation' | 'standard' | 'action';
}
