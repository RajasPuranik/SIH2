import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import type { Citation } from '../../types';

interface CitationCardProps {
  citation: Citation;
  isOpen: boolean;
  onClose: () => void;
}

export function CitationCard({ citation, isOpen, onClose }: CitationCardProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -5 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -5 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="absolute z-10 mt-2 w-72 rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-3 shadow-lg"
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <div className="font-semibold text-sm text-zinc-900 dark:text-zinc-100">{citation.documentName}</div>
              <div className="text-xs text-zinc-500 dark:text-zinc-400">Clause {citation.clauseNumber}</div>
            </div>
            <button onClick={onClose} aria-label="Close citation" className="text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200">
              <X className="w-4 h-4" />
            </button>
          </div>
          <div className="text-xs text-zinc-600 dark:text-zinc-300 italic border-l-2 border-indigo-500 pl-2">
            "{citation.snippet}"
          </div>
          {citation.standardId && (
            <a href={`/standards/${citation.standardId}`} className="mt-2 inline-block text-xs text-indigo-600 dark:text-indigo-400 hover:underline">
              View Standard &rarr;
            </a>
          )}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
