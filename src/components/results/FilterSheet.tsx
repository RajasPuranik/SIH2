import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { FilterRail } from './FilterRail';
import type { FilterState } from '../../types';

interface FilterSheetProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export function FilterSheet({ isOpen, onClose, filters, onFilterChange }: FilterSheetProps) {
  const activeCount =
    filters.sectors.length +
    filters.statuses.length +
    filters.certifications.length +
    (filters.yearRange[0] !== 1950 || filters.yearRange[1] !== 2026 ? 1 : 0);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40"
            onClick={onClose}
            aria-hidden="true"
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-x-0 bottom-0 z-50 max-h-[80vh] overflow-y-auto rounded-t-2xl bg-white dark:bg-zinc-900 shadow-xl"
            role="dialog"
            aria-label="Filters"
          >
            {/* Drag handle */}
            <div className="sticky top-0 z-10 flex items-center justify-center bg-white dark:bg-zinc-900 pt-3 pb-2">
              <div className="h-1 w-10 rounded-full bg-zinc-300 dark:bg-zinc-600" />
            </div>

            <div className="px-4 pb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">Filters</h2>
                <button
                  onClick={onClose}
                  aria-label="Close filters"
                  className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-ring"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Reuse FilterRail content without the sticky wrapper */}
              <FilterRail
                filters={filters}
                onFilterChange={onFilterChange}
                activeCount={activeCount}
              />

              <div className="mt-4 flex gap-3">
                <button
                  onClick={onClose}
                  className="flex-1 rounded-lg bg-indigo-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus-ring transition-colors"
                >
                  Apply Filters
                </button>
                <button
                  onClick={() => onFilterChange({
                    sectors: [],
                    icsCodes: [],
                    statuses: [],
                    certifications: [],
                    yearRange: [1950, 2026],
                  })}
                  className="rounded-lg border border-zinc-200 dark:border-zinc-700 px-4 py-2.5 text-sm font-medium text-zinc-600 dark:text-zinc-400 hover:bg-zinc-50 dark:hover:bg-zinc-800 focus-ring transition-colors"
                >
                  Clear
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
