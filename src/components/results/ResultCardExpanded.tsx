import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { ExternalLink, Calendar, RefreshCw } from 'lucide-react';
import type { Standard } from '../../types';
import { getStandardById } from '../../data/standards';

interface ResultCardExpandedProps {
  standard: Standard;
}

export function ResultCardExpanded({ standard }: ResultCardExpandedProps) {
  return (
    <motion.div
      initial={{ height: 0, opacity: 0 }}
      animate={{ height: 'auto', opacity: 1 }}
      exit={{ height: 0, opacity: 0 }}
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      className="overflow-hidden border-t border-zinc-100 dark:border-zinc-800"
    >
      <div className="p-5 space-y-4">
        {/* Scope */}
        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-1">
            Scope
          </h4>
          <p className="text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
            {standard.scope}
          </p>
        </div>

        {/* Metadata grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
          <div>
            <div className="text-xs text-zinc-400 dark:text-zinc-500">Last Revised</div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300 tabular-nums flex items-center gap-1">
              <Calendar size={12} />
              {new Date(standard.lastRevisionDate).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}
            </div>
          </div>
          <div>
            <div className="text-xs text-zinc-400 dark:text-zinc-500">Reaffirmed</div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300 tabular-nums">
              {standard.reaffirmationYear ?? '—'}
            </div>
          </div>
          {standard.equivalentIso && (
            <div>
              <div className="text-xs text-zinc-400 dark:text-zinc-500">ISO Equivalent</div>
              <div className="font-medium text-zinc-700 dark:text-zinc-300 flex items-center gap-1">
                <ExternalLink size={12} />
                {standard.equivalentIso}
              </div>
            </div>
          )}
          <div>
            <div className="text-xs text-zinc-400 dark:text-zinc-500">ICS Code</div>
            <div className="font-medium text-zinc-700 dark:text-zinc-300 tabular-nums">
              {standard.icsCode}
            </div>
          </div>
        </div>

        {/* Normative References */}
        {standard.normativeReferences.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Normative References
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {standard.normativeReferences.map(ref => {
                const refStd = getStandardById(ref.standardId);
                if (!refStd) return null;
                return (
                  <Link
                    key={ref.standardId}
                    to={`/standard/${ref.standardId}`}
                    className="inline-flex items-center gap-1 rounded-lg border border-zinc-200 dark:border-zinc-700 px-2.5 py-1 text-xs font-medium text-zinc-600 dark:text-zinc-400 hover:border-indigo-300 hover:text-indigo-600 dark:hover:border-indigo-600 dark:hover:text-indigo-400 transition-colors focus-ring"
                  >
                    {refStd.isNumber}
                    <span className="text-zinc-400 dark:text-zinc-500">({ref.relationship})</span>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Amendment History */}
        {standard.amendments.length > 0 && (
          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 mb-2">
              Amendments
            </h4>
            <div className="space-y-2">
              {standard.amendments.map((amend, idx) => (
                <div key={idx} className="flex items-start gap-2 text-sm">
                  <RefreshCw size={12} className="mt-1 text-zinc-400 shrink-0" />
                  <div>
                    <span className="font-medium text-zinc-700 dark:text-zinc-300">{amend.number}</span>
                    <span className="mx-1 text-zinc-400">·</span>
                    <span className="tabular-nums text-zinc-500 dark:text-zinc-400">{amend.date}</span>
                    <p className="text-zinc-500 dark:text-zinc-400 text-xs mt-0.5">{amend.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
