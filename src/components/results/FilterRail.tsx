import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, X } from 'lucide-react';
import type { FilterState, Sector, StandardStatus, CertificationType } from '../../types';

const SECTORS: Sector[] = ['Construction', 'Electronics', 'Textiles', 'Food Safety', 'Chemicals', 'Mechanical', 'Defence'];
const STATUSES: StandardStatus[] = ['Current', 'Superseded', 'Withdrawn', 'Under Revision'];
const CERTIFICATIONS: CertificationType[] = ['ISI Mark', 'CRS', 'QCO', 'WPC', 'FSSAI'];

interface FilterRailProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
  activeCount: number;
}

function FilterSection({ title, children, defaultOpen = true }: { title: string; children: React.ReactNode; defaultOpen?: boolean }) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-zinc-100 dark:border-zinc-800 pb-4 mb-4 last:border-0 last:pb-0 last:mb-0">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full text-sm font-semibold text-zinc-700 dark:text-zinc-300 mb-2 focus-ring rounded"
        aria-expanded={isOpen}
      >
        {title}
        <motion.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={14} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function FilterRail({ filters, onFilterChange, activeCount }: FilterRailProps) {
  const toggleArrayFilter = <K extends 'sectors' | 'statuses' | 'certifications'>(
    key: K,
    value: FilterState[K][number]
  ) => {
    const arr = filters[key] as string[];
    const newArr = arr.includes(value as string)
      ? arr.filter(v => v !== value)
      : [...arr, value as string];
    onFilterChange({ ...filters, [key]: newArr });
  };

  const clearAll = () => {
    onFilterChange({
      sectors: [],
      icsCodes: [],
      statuses: [],
      certifications: [],
      yearRange: [1950, 2026],
    });
  };

  return (
    <div className="sticky top-20 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
          Filters
          {activeCount > 0 && (
            <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-indigo-600 text-[10px] text-white">
              {activeCount}
            </span>
          )}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={clearAll}
            className="text-xs text-indigo-600 dark:text-indigo-400 hover:underline focus-ring rounded"
            aria-label="Clear all filters"
          >
            Clear all
          </button>
        )}
      </div>

      <FilterSection title="Sector">
        <div className="space-y-1.5">
          {SECTORS.map(sector => (
            <label key={sector} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200">
              <input
                type="checkbox"
                checked={filters.sectors.includes(sector)}
                onChange={() => toggleArrayFilter('sectors', sector)}
                className="rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
              />
              {sector}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Status">
        <div className="space-y-1.5">
          {STATUSES.map(status => (
            <label key={status} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200">
              <input
                type="checkbox"
                checked={filters.statuses.includes(status)}
                onChange={() => toggleArrayFilter('statuses', status)}
                className="rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
              />
              {status}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Certification">
        <div className="space-y-1.5">
          {CERTIFICATIONS.map(cert => (
            <label key={cert} className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400 cursor-pointer hover:text-zinc-900 dark:hover:text-zinc-200">
              <input
                type="checkbox"
                checked={filters.certifications.includes(cert)}
                onChange={() => toggleArrayFilter('certifications', cert)}
                className="rounded border-zinc-300 dark:border-zinc-600 text-indigo-600 focus:ring-indigo-500 h-3.5 w-3.5"
              />
              {cert}
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Year Range" defaultOpen={false}>
        <div className="flex items-center gap-2">
          <input
            type="number"
            min={1950}
            max={2026}
            value={filters.yearRange[0]}
            onChange={e => onFilterChange({ ...filters, yearRange: [parseInt(e.target.value) || 1950, filters.yearRange[1]] })}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-2.5 py-1.5 text-sm tabular-nums text-zinc-700 dark:text-zinc-300 focus-ring"
            aria-label="Minimum year"
          />
          <span className="text-zinc-400">–</span>
          <input
            type="number"
            min={1950}
            max={2026}
            value={filters.yearRange[1]}
            onChange={e => onFilterChange({ ...filters, yearRange: [filters.yearRange[0], parseInt(e.target.value) || 2026] })}
            className="w-full rounded-lg border border-zinc-200 dark:border-zinc-700 bg-transparent px-2.5 py-1.5 text-sm tabular-nums text-zinc-700 dark:text-zinc-300 focus-ring"
            aria-label="Maximum year"
          />
        </div>
      </FilterSection>
    </div>
  );
}
