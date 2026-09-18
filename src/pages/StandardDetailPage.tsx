import { useState, useEffect, useCallback } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getStandard } from '../lib/api';
import { standards as allStandardsData } from '../data/standards';
import { StandardHeader } from '../components/detail/StandardHeader';
import { ClauseTree } from '../components/detail/ClauseTree';
import { AmendmentTimeline } from '../components/detail/AmendmentTimeline';
import { CrossRefGraph } from '../components/detail/CrossRefGraph';
import { UsageAnalytics } from '../components/detail/UsageAnalytics';
import { Skeleton } from '../components/common/Skeleton';
import type { Standard } from '../types';

export function StandardDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [standard, setStandard] = useState<Standard | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeClauseId, setActiveClauseId] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setIsLoading(true);
    getStandard(id).then(data => {
      setStandard(data);
      setIsLoading(false);
    });
  }, [id]);

  const handleClauseClick = useCallback((clauseId: string) => {
    setActiveClauseId(clauseId);
    // Simulate scroll-spy by setting the active clause
    const el = document.getElementById(`clause-${clauseId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);

  if (isLoading) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <Skeleton variant="title" className="mb-4" />
        <Skeleton variant="text" className="mb-2" />
        <Skeleton variant="text" className="mb-2" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
          <div className="lg:col-span-2">
            <Skeleton variant="card" className="mb-4" />
            <Skeleton variant="card" />
          </div>
          <div>
            <Skeleton variant="card" />
          </div>
        </div>
      </div>
    );
  }

  if (!standard) {
    return (
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-16 text-center">
        <h2 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100 mb-2">
          Standard not found
        </h2>
        <p className="text-zinc-500 dark:text-zinc-400 mb-6">
          The requested standard could not be found in the database.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-indigo-600 dark:text-indigo-400 hover:underline focus-ring rounded"
        >
          <ArrowLeft size={16} />
          Back to search
        </Link>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-[calc(100vh-4rem)]"
    >
      {/* Back link */}
      <div className="border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-3">
          <Link
            to="/results"
            className="inline-flex items-center gap-1.5 text-sm text-zinc-500 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors focus-ring rounded"
            aria-label="Back to results"
          >
            <ArrowLeft size={14} />
            Back to results
          </Link>
        </div>
      </div>

      {/* Header */}
      <StandardHeader standard={standard} />

      {/* Content */}
      <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Scope */}
            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                Scope
              </h2>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {standard.scope}
              </p>
            </section>

            {/* Clauses */}
            <section>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                Clause Structure
              </h2>
              <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4">
                {standard.clauses.map(clause => (
                  <div key={clause.id} id={`clause-${clause.id}`} className="mb-3 last:mb-0">
                    <div className="font-medium text-zinc-900 dark:text-zinc-100">
                      {clause.number}. {clause.title}
                    </div>
                    {clause.children && (
                      <div className="ml-6 mt-1 space-y-1">
                        {clause.children.map(child => (
                          <div
                            key={child.id}
                            id={`clause-${child.id}`}
                            className="text-sm text-zinc-600 dark:text-zinc-400"
                          >
                            {child.number} {child.title}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>

            {/* Amendment Timeline */}
            {standard.amendments.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Amendment History
                </h2>
                <AmendmentTimeline amendments={standard.amendments} />
              </section>
            )}

            {/* Cross-Reference Graph */}
            {standard.normativeReferences.length > 0 && (
              <section>
                <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 mb-3">
                  Cross-Reference Network
                </h2>
                <CrossRefGraph standard={standard} allStandards={allStandardsData} />
              </section>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Clause Navigation */}
            <div className="sticky top-20">
              <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-3">
                Navigation
              </h3>
              <ClauseTree
                clauses={standard.clauses}
                activeClauseId={activeClauseId}
                onClauseClick={handleClauseClick}
              />

              {/* Usage Analytics */}
              <div className="mt-6">
                <UsageAnalytics standard={standard} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
