import { useState, useEffect, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';
import { SlidersHorizontal, X } from 'lucide-react';
import { searchStandards } from '../lib/api';
import { ResultsList } from '../components/results/ResultsList';
import { FilterRail } from '../components/results/FilterRail';
import { FilterSheet } from '../components/results/FilterSheet';
import { CompareBar } from '../components/results/CompareBar';
import { CompareDrawer } from '../components/results/CompareDrawer';
import type { SearchResult, FilterState, Standard } from '../types';

const defaultFilters: FilterState = {
  sectors: [],
  icsCodes: [],
  statuses: [],
  certifications: [],
  yearRange: [1950, 2026],
};

export function ResultsPage() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>(defaultFilters);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [compareItems, setCompareItems] = useState<Standard[]>([]);
  const [showCompare, setShowCompare] = useState(false);
  const [detectedLanguage, setDetectedLanguage] = useState<string | null>(null);

  // Check if query contains non-Latin characters (simulating translation)
  useEffect(() => {
    if (/[\u0900-\u097F]/.test(query)) {
      setDetectedLanguage('Hindi');
    } else if (/[\u0980-\u09FF]/.test(query)) {
      setDetectedLanguage('Bengali');
    } else if (/[\u0B80-\u0BFF]/.test(query)) {
      setDetectedLanguage('Tamil');
    } else {
      setDetectedLanguage(null);
    }
  }, [query]);

  const doSearch = useCallback(async () => {
    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }
    setIsLoading(true);
    try {
      const data = await searchStandards(query, filters);
      setResults(data);
    } catch {
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  }, [query, filters]);

  useEffect(() => {
    doSearch();
  }, [doSearch]);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const activeFilterCount =
    filters.sectors.length +
    filters.statuses.length +
    filters.certifications.length +
    filters.icsCodes.length +
    (filters.yearRange[0] !== 1950 || filters.yearRange[1] !== 2026 ? 1 : 0);

  const toggleCompareItem = useCallback((standard: Standard) => {
    setCompareItems(prev => {
      if (prev.some(s => s.id === standard.id)) {
        return prev.filter(s => s.id !== standard.id);
      }
      if (prev.length >= 3) return prev;
      return [...prev, standard];
    });
  }, []);

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
                Results for &ldquo;{query}&rdquo;
              </h1>
              {detectedLanguage && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mt-1 text-sm text-indigo-600 dark:text-indigo-400"
                >
                  Translated from {detectedLanguage}
                </motion.p>
              )}
              {!isLoading && (
                <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
                  {results.length} standard{results.length !== 1 ? 's' : ''} found
                </p>
              )}
            </div>

            {/* Mobile filter toggle */}
            <button
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 rounded-lg border border-zinc-200 dark:border-zinc-800 px-3 py-2 text-sm text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus-ring"
              aria-label="Open filters"
            >
              <SlidersHorizontal size={16} />
              Filters
              {activeFilterCount > 0 && (
                <span className="ml-1 flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-xs text-white">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 py-6">
        <div className="flex gap-8">
          {/* Results */}
          <div className="flex-1 min-w-0">
            <ResultsList
              results={results}
              isLoading={isLoading}
              compareItems={compareItems}
              onToggleCompare={toggleCompareItem}
            />
          </div>

          {/* Desktop Filter Rail */}
          <div className="hidden lg:block w-72 shrink-0">
            <FilterRail
              filters={filters}
              onFilterChange={handleFilterChange}
              activeCount={activeFilterCount}
            />
          </div>
        </div>
      </div>

      {/* Mobile Filter Sheet */}
      <FilterSheet
        isOpen={showMobileFilters}
        onClose={() => setShowMobileFilters(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
      />

      {/* Compare Bar */}
      <CompareBar
        items={compareItems}
        onRemove={(id) => setCompareItems(prev => prev.filter(s => s.id !== id))}
        onCompare={() => setShowCompare(true)}
        onClear={() => setCompareItems([])}
      />

      {/* Compare Drawer */}
      <CompareDrawer
        isOpen={showCompare}
        onClose={() => setShowCompare(false)}
        standards={compareItems}
      />
    </div>
  );
}
