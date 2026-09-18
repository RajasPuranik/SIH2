import { AnimatedCounter } from '../common/AnimatedCounter';
import { motion } from 'framer-motion';
import type { Standard } from '../../types';

interface UsageAnalyticsProps {
  standard: Standard;
}

export function UsageAnalytics({ standard }: UsageAnalyticsProps) {
  const bars = [40, 70, 45, 90, 60, 100];
  const months = ['Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];

  return (
    <div className="rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-5">
      <h3 className="text-sm font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-4">
        Usage Analytics
      </h3>

      {/* Mini bar chart */}
      <div className="flex items-end gap-1.5 h-24 mb-1">
        {bars.map((height, i) => (
          <div key={i} className="flex-1 flex flex-col justify-end h-full">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${height}%` }}
              transition={{ type: 'spring', delay: i * 0.08, stiffness: 300, damping: 25 }}
              className="bg-indigo-100 dark:bg-indigo-900/30 hover:bg-indigo-200 dark:hover:bg-indigo-800/50 rounded-t transition-colors border-t-2 border-indigo-500 w-full"
            />
          </div>
        ))}
      </div>
      <div className="flex gap-1.5 mb-4">
        {months.map(m => (
          <div key={m} className="flex-1 text-center text-[10px] text-zinc-400">{m}</div>
        ))}
      </div>

      <div className="space-y-3 border-t border-zinc-100 dark:border-zinc-800 pt-4">
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Referenced in</span>
          <span className="font-semibold text-zinc-900 dark:text-zinc-100 flex items-center gap-1">
            <AnimatedCounter value={standard.tenderCount} /> tenders
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-sm text-zinc-500 dark:text-zinc-400">Primary sector</span>
          <span className="text-sm font-medium bg-zinc-100 dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 px-2 py-0.5 rounded">
            {standard.sector}
          </span>
        </div>
      </div>
    </div>
  );
}
