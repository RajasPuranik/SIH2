import { ChevronRight } from 'lucide-react';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import type { Clause } from '../../types';

interface ClauseTreeProps {
  clauses: Clause[];
  activeClauseId: string | null;
  onClauseClick: (id: string) => void;
}

function ClauseNode({ clause, activeClauseId, onClauseClick, depth = 0 }: { clause: Clause, activeClauseId: string | null, onClauseClick: (id: string) => void, depth?: number }) {
  const [isOpen, setIsOpen] = useState(true);
  const hasChildren = clause.children && clause.children.length > 0;
  const isActive = activeClauseId === clause.id;

  return (
    <div className="flex flex-col">
      <button
        onClick={() => {
          onClauseClick(clause.id);
          if (hasChildren) setIsOpen(!isOpen);
        }}
        className={`flex items-start text-left py-2 px-3 rounded-lg transition-colors group relative ${
          isActive ? 'bg-indigo-50 dark:bg-indigo-950/30' : 'hover:bg-zinc-50 dark:hover:bg-zinc-800/50'
        }`}
        style={{ paddingLeft: `${Math.max(0.75, depth * 1.5 + 0.75)}rem` }}
        aria-current={isActive ? 'true' : undefined}
      >
        {isActive && (
          <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-2/3 bg-indigo-600 dark:bg-indigo-500 rounded-r-full" />
        )}
        {hasChildren ? (
          <ChevronRight className={`w-4 h-4 shrink-0 mt-0.5 mr-1.5 transition-transform ${isOpen ? 'rotate-90' : ''} text-zinc-400 group-hover:text-zinc-600 dark:group-hover:text-zinc-300`} />
        ) : (
          <div className="w-5.5 shrink-0" />
        )}
        <div className="flex-1 flex gap-2 min-w-0">
          <span className="font-medium text-zinc-900 dark:text-zinc-100 whitespace-nowrap">{clause.number}</span>
          <span className="text-zinc-600 dark:text-zinc-400 truncate">{clause.title}</span>
        </div>
      </button>

      <AnimatePresence>
        {hasChildren && isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            {clause.children!.map(child => (
              <ClauseNode
                key={child.id}
                clause={child}
                activeClauseId={activeClauseId}
                onClauseClick={onClauseClick}
                depth={depth + 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export function ClauseTree({ clauses, activeClauseId, onClauseClick }: ClauseTreeProps) {
  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
      <div className="px-4 py-3 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50/50 dark:bg-zinc-900/50">
        <h3 className="font-medium text-sm text-zinc-500 dark:text-zinc-400 uppercase tracking-wider">Document Structure</h3>
      </div>
      <div className="p-2 overflow-y-auto max-h-[calc(100vh-200px)]">
        {clauses.map(clause => (
          <ClauseNode
            key={clause.id}
            clause={clause}
            activeClauseId={activeClauseId}
            onClauseClick={onClauseClick}
          />
        ))}
      </div>
    </div>
  );
}
