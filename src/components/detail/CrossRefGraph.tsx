import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import type { Standard } from '../../types';

interface CrossRefGraphProps {
  standard: Standard;
  allStandards: Standard[];
}

export function CrossRefGraph({ standard, allStandards }: CrossRefGraphProps) {
  const navigate = useNavigate();
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  const cx = 200;
  const cy = 200;
  const r = 120;
  
  const references = standard.normativeReferences.map(ref => {
    const s = allStandards.find(s => s.id === ref.standardId);
    return { ...ref, isNumber: s?.isNumber || ref.standardId, title: s?.title || 'Unknown Standard' };
  });

  const numNodes = references.length;
  
  return (
    <div className="relative w-full max-w-[400px] aspect-square mx-auto bg-white dark:bg-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-800 shadow-sm overflow-hidden flex items-center justify-center">
      {numNodes === 0 ? (
        <p className="text-zinc-500 dark:text-zinc-400">No normative references.</p>
      ) : (
        <svg viewBox="0 0 400 400" className="w-full h-full">
          {references.map((ref, i) => {
            const angle = (i / numNodes) * 2 * Math.PI - Math.PI / 2;
            const nx = cx + r * Math.cos(angle);
            const ny = cy + r * Math.sin(angle);
            return (
              <motion.line
                key={`line-${ref.standardId}`}
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                x1={cx}
                y1={cy}
                x2={nx}
                y2={ny}
                className="stroke-zinc-300 dark:stroke-zinc-700"
                strokeWidth={2}
                strokeDasharray={ref.relationship === 'informative' ? '4 4' : 'none'}
              />
            );
          })}
          
          <motion.circle
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: 'spring' }}
            cx={cx}
            cy={cy}
            r={30}
            className="fill-indigo-100 dark:fill-indigo-900/50 stroke-indigo-600 dark:stroke-indigo-400"
            strokeWidth={3}
          />
          <text x={cx} y={cy} textAnchor="middle" dominantBaseline="middle" className="text-xs font-bold fill-indigo-800 dark:fill-indigo-200 font-mono pointer-events-none">
            {standard.isNumber.split(':')[0]}
          </text>

          {references.map((ref, i) => {
            const angle = (i / numNodes) * 2 * Math.PI - Math.PI / 2;
            const nx = cx + r * Math.cos(angle);
            const ny = cy + r * Math.sin(angle);
            return (
              <motion.g
                key={`node-${ref.standardId}`}
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', delay: i * 0.1 + 0.3 }}
                className="cursor-pointer"
                onClick={() => navigate(`/standard/${ref.standardId}`)}
                onMouseEnter={() => setHoveredNode(ref.standardId)}
                onMouseLeave={() => setHoveredNode(null)}
              >
                <circle
                  cx={nx}
                  cy={ny}
                  r={20}
                  className={`transition-colors ${hoveredNode === ref.standardId ? 'fill-zinc-200 dark:fill-zinc-700' : 'fill-zinc-100 dark:fill-zinc-800'} stroke-zinc-400 dark:stroke-zinc-600`}
                  strokeWidth={2}
                />
                <text x={nx} y={ny} textAnchor="middle" dominantBaseline="middle" className="text-[10px] font-medium fill-zinc-700 dark:fill-zinc-300 pointer-events-none">
                  {ref.isNumber.split(':')[0]}
                </text>
              </motion.g>
            );
          })}
        </svg>
      )}
      
      {hoveredNode && (
        <div className="absolute bottom-4 left-4 right-4 bg-zinc-900 dark:bg-white text-zinc-100 dark:text-zinc-900 text-xs px-3 py-2 rounded-lg text-center shadow-lg pointer-events-none">
          {references.find(r => r.standardId === hoveredNode)?.title}
        </div>
      )}
    </div>
  );
}
