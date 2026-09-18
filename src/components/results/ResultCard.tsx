import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ShoppingBag, Copy, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { ResultCardExpanded } from './ResultCardExpanded';
import { StatusPill } from '../common/StatusPill';
import { CertBadge } from '../common/CertBadge';
import { useBasket } from '../../hooks/useBasket';
import type { SearchResult } from '../../types';

interface ResultCardProps {
  result: SearchResult;
  onCompareToggle?: () => void;
  isCompared?: boolean;
}

export function ResultCard({ result, onCompareToggle, isCompared }: ResultCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const { addToBasket, removeFromBasket, isInBasket } = useBasket();
  const { standard, matchScore, matchReason, highlightedPhrases } = result;
  const inBasket = isInBasket(standard.id);
  const scorePercent = Math.round(matchScore * 100);

  const toggleBasket = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (inBasket) removeFromBasket(standard.id);
    else addToBasket(standard);
  };

  const copyCitation = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(`${standard.isNumber}: ${standard.year} — ${standard.title}`);
  };

  return (
    <motion.div
      layout
      className="group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-[0_1px_2px_rgba(0,0,0,0.04)] transition-colors hover:border-indigo-300 dark:border-zinc-800 dark:bg-zinc-900 dark:hover:border-indigo-500/50"
    >
      <div className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 min-w-0">
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <Link
                to={`/standard/${standard.id}`}
                className="text-base font-semibold text-zinc-900 hover:text-indigo-600 dark:text-zinc-100 dark:hover:text-indigo-400 transition-colors focus-ring rounded"
              >
                {standard.isNumber}: {standard.year}
              </Link>
              <StatusPill status={standard.status} />
              {standard.certifications.map(cert => (
                <CertBadge key={cert} type={cert} />
              ))}
            </div>
            <h3 className="mb-3 text-sm font-medium leading-snug text-zinc-700 dark:text-zinc-300">
              {standard.title}
            </h3>
            <p className="text-sm text-zinc-500 dark:text-zinc-400">
              <span className="font-medium text-zinc-700 dark:text-zinc-300">Why: </span>
              {matchReason}
              {highlightedPhrases.length > 0 && (
                <span className="ml-1">
                  — <span className="text-indigo-600 dark:text-indigo-400 font-medium">{highlightedPhrases.join(', ')}</span>
                </span>
              )}
            </p>
          </div>

          {/* Score */}
          <div className="flex flex-col items-end min-w-[80px]">
            <div className="mb-1 text-2xl font-semibold tabular-nums text-indigo-600 dark:text-indigo-400">
              {scorePercent}%
            </div>
            <div className="h-1.5 w-full overflow-hidden rounded-full bg-zinc-100 dark:bg-zinc-800">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${scorePercent}%` }}
                transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
                className="h-full rounded-full bg-indigo-500"
              />
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <button
              onClick={toggleBasket}
              aria-label={inBasket ? 'Remove from basket' : 'Add to basket'}
              className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-medium transition-colors focus-ring ${
                inBasket
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-400 dark:hover:bg-zinc-700'
              }`}
            >
              <ShoppingBag size={14} />
              {inBasket ? 'In Basket' : 'Add to Basket'}
            </button>
            <button
              onClick={copyCitation}
              aria-label="Copy citation"
              className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors focus-ring"
            >
              <Copy size={14} />
            </button>
            {onCompareToggle && (
              <button
                onClick={onCompareToggle}
                aria-label={isCompared ? 'Remove from comparison' : 'Add to comparison'}
                className={`text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors focus-ring ${
                  isCompared
                    ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300'
                    : 'text-zinc-500 hover:text-zinc-700 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800'
                }`}
              >
                {isCompared ? 'Comparing' : 'Compare'}
              </button>
            )}
          </div>

          <div className="flex items-center gap-3">
            <Link
              to={`/standard/${standard.id}`}
              className="inline-flex items-center gap-1 text-xs font-medium text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 focus-ring rounded"
            >
              View details
              <ArrowRight size={12} />
            </Link>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              aria-expanded={isExpanded}
              aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300 transition-colors focus-ring"
            >
              <motion.div animate={{ rotate: isExpanded ? 180 : 0 }} transition={{ duration: 0.2 }}>
                <ChevronDown size={16} />
              </motion.div>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence initial={false}>
        {isExpanded && <ResultCardExpanded standard={standard} />}
      </AnimatePresence>
    </motion.div>
  );
}
