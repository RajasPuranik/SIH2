import { motion } from 'framer-motion';
import { SearchX } from 'lucide-react';
import { ResultCard } from './ResultCard';
import { Skeleton } from '../common/Skeleton';
import { EmptyState } from '../common/EmptyState';
import type { SearchResult, Standard } from '../../types';

interface ResultsListProps {
  results: SearchResult[];
  isLoading: boolean;
  compareItems?: Standard[];
  onToggleCompare?: (standard: Standard) => void;
}

const container = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.03,
      delayChildren: 0.05,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: 'spring' as const, stiffness: 400, damping: 30 },
  },
};

export function ResultsList({ results, isLoading, compareItems = [], onToggleCompare }: ResultsListProps) {
  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} variant="card" />
        ))}
      </div>
    );
  }

  if (results.length === 0) {
    return (
      <EmptyState
        icon={SearchX}
        title="No standards found"
        description="Try adjusting your search terms or clearing filters to see more results."
      />
    );
  }

  return (
    <motion.div
      variants={container}
      initial="hidden"
      animate="visible"
      className="space-y-4"
    >
      {results.map((result) => (
        <motion.div key={result.standard.id} variants={item}>
          <ResultCard
            result={result}
            onCompareToggle={
              onToggleCompare
                ? () => onToggleCompare(result.standard)
                : undefined
            }
            isCompared={compareItems.some(s => s.id === result.standard.id)}
          />
        </motion.div>
      ))}
    </motion.div>
  );
}
