import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { StatusPill } from '../common/StatusPill';
import { CertBadge } from '../common/CertBadge';
import type { Standard } from '../../types';

interface CompareDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  standards: Standard[];
}

export function CompareDrawer({ isOpen, onClose, standards }: CompareDrawerProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
            aria-hidden="true"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className="fixed inset-y-0 right-0 z-50 w-full max-w-4xl overflow-y-auto bg-white dark:bg-zinc-900 shadow-xl"
            role="dialog"
            aria-label="Compare standards"
          >
            <div className="sticky top-0 z-10 flex items-center justify-between border-b border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-6 py-4">
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                Comparing {standards.length} Standards
              </h2>
              <button
                onClick={onClose}
                aria-label="Close comparison"
                className="flex h-8 w-8 items-center justify-center rounded-full text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-800 focus-ring"
              >
                <X size={18} />
              </button>
            </div>

            <div className="p-6">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-zinc-200 dark:border-zinc-800">
                      <th className="py-3 pr-4 text-left text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 w-36">
                        Property
                      </th>
                      {standards.map(s => (
                        <th key={s.id} className="py-3 px-4 text-left font-semibold text-zinc-900 dark:text-zinc-100">
                          {s.isNumber}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                    <CompareRow label="Title" values={standards.map(s => s.title)} />
                    <CompareRow label="Year" values={standards.map(s => String(s.year))} />
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Status
                      </td>
                      {standards.map(s => (
                        <td key={s.id} className="py-3 px-4">
                          <StatusPill status={s.status} />
                        </td>
                      ))}
                    </tr>
                    <tr className="border-b border-zinc-100 dark:border-zinc-800">
                      <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400">
                        Certifications
                      </td>
                      {standards.map(s => (
                        <td key={s.id} className="py-3 px-4">
                          <div className="flex flex-wrap gap-1">
                            {s.certifications.length > 0
                              ? s.certifications.map(c => <CertBadge key={c} type={c} />)
                              : <span className="text-zinc-400">None</span>}
                          </div>
                        </td>
                      ))}
                    </tr>
                    <CompareRow label="Scope" values={standards.map(s => s.scope)} />
                    <CompareRow label="ICS Code" values={standards.map(s => s.icsCode)} />
                    <CompareRow label="ISO Equivalent" values={standards.map(s => s.equivalentIso ?? '—')} />
                    <CompareRow label="Amendments" values={standards.map(s => String(s.amendments.length))} />
                    <CompareRow label="References" values={standards.map(s => String(s.normativeReferences.length))} />
                    <CompareRow label="Reaffirmation" values={standards.map(s => s.reaffirmationYear ? String(s.reaffirmationYear) : '—')} />
                    <CompareRow label="Sector" values={standards.map(s => s.sector)} />
                  </tbody>
                </table>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CompareRow({ label, values }: { label: string; values: string[] }) {
  return (
    <tr>
      <td className="py-3 pr-4 text-xs font-semibold uppercase tracking-wider text-zinc-500 dark:text-zinc-400 align-top">
        {label}
      </td>
      {values.map((val, i) => (
        <td key={i} className="py-3 px-4 text-zinc-700 dark:text-zinc-300 align-top">
          {val}
        </td>
      ))}
    </tr>
  );
}
