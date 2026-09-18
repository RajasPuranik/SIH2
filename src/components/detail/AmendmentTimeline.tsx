import { motion } from 'framer-motion';
import type { Amendment } from '../../types';

interface AmendmentTimelineProps {
  amendments: Amendment[];
}

export function AmendmentTimeline({ amendments }: AmendmentTimelineProps) {
  if (!amendments.length) return <div className="text-zinc-500 dark:text-zinc-400">No amendments recorded.</div>;

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 10 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={container} 
      initial="hidden" 
      animate="show"
      className="relative pl-6 border-l border-zinc-200 dark:border-zinc-800 ml-4 py-2"
    >
      {amendments.map((amendment, index) => (
        <motion.div variants={item} key={index} className="mb-8 last:mb-0 relative">
          <div className="absolute w-3 h-3 bg-zinc-200 dark:bg-zinc-700 rounded-full -left-[1.95rem] top-1.5 border-2 border-white dark:border-zinc-950" />
          <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
            <time className="text-sm font-medium tabular-nums text-zinc-500 dark:text-zinc-400 shrink-0 w-24 pt-0.5">
              {amendment.date}
            </time>
            <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-xl shadow-sm flex-1">
              <h4 className="font-semibold mb-1">Amendment No. {amendment.number}</h4>
              <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">
                {amendment.description}
              </p>
            </div>
          </div>
        </motion.div>
      ))}
    </motion.div>
  );
}
