import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ChevronDown, ChevronUp } from 'lucide-react';
import type { ToolCall } from '../../types';

interface ToolCallStripProps {
  toolCalls: ToolCall[];
}

export function ToolCallStrip({ toolCalls }: ToolCallStripProps) {
  const [expanded, setExpanded] = useState(false);
  
  if (!toolCalls || toolCalls.length === 0) return null;
  
  const totalDocs = toolCalls.reduce((acc, tc) => acc + tc.documentsSearched, 0);
  const totalDuration = toolCalls.reduce((acc, tc) => acc + tc.durationMs, 0) / 1000;

  return (
    <div className="mb-2">
      <button 
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex items-center gap-2 text-xs text-zinc-500 dark:text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800/50 hover:bg-zinc-200 dark:hover:bg-zinc-700 rounded-lg px-2 py-1 transition-colors"
      >
        <Zap className="w-3 h-3 text-indigo-500" />
        <span>Searched {totalDocs} documents &middot; {totalDuration.toFixed(1)}s</span>
        {expanded ? <ChevronUp className="w-3 h-3 ml-1" /> : <ChevronDown className="w-3 h-3 ml-1" />}
      </button>
      
      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2 pl-2 border-l-2 border-zinc-200 dark:border-zinc-700">
              {toolCalls.map((tc, idx) => (
                <div key={idx} className="text-xs">
                  <div className="font-mono text-zinc-700 dark:text-zinc-300">{tc.name}</div>
                  <div className="text-zinc-500 dark:text-zinc-400">{tc.description}</div>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
