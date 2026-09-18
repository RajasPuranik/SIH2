import { motion, AnimatePresence } from 'framer-motion';
import { X, GitCompare } from 'lucide-react';
import type { Standard } from '../../types';

interface CompareBarProps {
  items: Standard[];
  onRemove: (id: string) => void;
  onCompare: () => void;
  onClear: () => void;
}

export function CompareBar({ items, onRemove, onCompare, onClear }: CompareBarProps) {
  if (items.length === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 80, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 inset-x-0 z-30 border-t border-zinc-200 dark:border-zinc-800 bg-white/95 dark:bg-zinc-900/95 backdrop-blur-sm shadow-lg"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <GitCompare size={16} className="text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span className="text-sm font-medium text-zinc-700 dark:text-zinc-300 shrink-0">
              Compare ({items.length}/3):
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto">
              {items.map(s => (
                <span
                  key={s.id}
                  className="inline-flex items-center gap-1 rounded-full border border-zinc-200 dark:border-zinc-700 bg-zinc-50 dark:bg-zinc-800 px-2.5 py-1 text-xs font-medium text-zinc-700 dark:text-zinc-300 whitespace-nowrap"
                >
                  {s.isNumber}
                  <button
                    onClick={() => onRemove(s.id)}
                    aria-label={`Remove ${s.isNumber} from comparison`}
                    className="ml-0.5 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onClear}
              className="text-xs text-zinc-500 hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200 focus-ring rounded px-2 py-1"
              aria-label="Clear comparison selection"
            >
              Clear
            </button>
            <button
              onClick={onCompare}
              disabled={items.length < 2}
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-medium text-white hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed focus-ring transition-colors"
              aria-label="Compare selected standards"
            >
              Compare
            </button>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
