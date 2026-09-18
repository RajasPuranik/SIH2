import { useBasket } from '../../hooks/useBasket';
import { StatusPill } from '../common/StatusPill';
import { CertBadge } from '../common/CertBadge';
import { AnimatedCounter } from '../common/AnimatedCounter';
import { ShoppingBasket } from 'lucide-react';
import type { Standard } from '../../types';

interface StandardHeaderProps {
  standard: Standard;
}

export function StandardHeader({ standard }: StandardHeaderProps) {
  const { addToBasket, removeFromBasket, isInBasket } = useBasket();
  const inBasket = isInBasket(standard.id);

  const toggleBasket = () => {
    if (inBasket) {
      removeFromBasket(standard.id);
    } else {
      addToBasket(standard);
    }
  };

  return (
    <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-2xl p-6 sm:p-8 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-4 flex-wrap">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">{standard.isNumber}</h1>
            <StatusPill status={standard.status} />
          </div>
          <h2 className="text-xl sm:text-2xl font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed max-w-3xl">
            {standard.title}
          </h2>
        </div>
        
        <div className="shrink-0 flex flex-col items-end gap-4">
          <button
            onClick={toggleBasket}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 ${
              inBasket
                ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700 focus-visible:ring-zinc-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md focus-visible:ring-indigo-500'
            }`}
            aria-label={inBasket ? 'Remove from basket' : 'Add to basket'}
          >
            <ShoppingBasket className="w-5 h-5" />
            {inBasket ? 'In Basket' : 'Add to Basket'}
          </button>
          
          {standard.certifications.length > 0 && (
            <div className="flex gap-2 flex-wrap justify-end">
              {standard.certifications.map(cert => (
                <CertBadge key={cert} type={cert} />
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mt-8 pt-8 border-t border-zinc-200 dark:border-zinc-800 grid grid-cols-2 md:grid-cols-4 gap-6">
        <div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">ICS Code</div>
          <div className="font-semibold font-mono">{standard.icsCode}</div>
        </div>
        <div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Last Revision</div>
          <div className="font-semibold tabular-nums">{standard.lastRevisionDate}</div>
        </div>
        <div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Equivalent ISO</div>
          <div className="font-semibold">{standard.equivalentIso || 'None'}</div>
        </div>
        <div>
          <div className="text-sm text-zinc-500 dark:text-zinc-400 mb-1">Referenced In</div>
          <div className="font-semibold tabular-nums text-indigo-600 dark:text-indigo-400 flex items-center gap-1">
            <AnimatedCounter value={standard.tenderCount} /> tenders
          </div>
        </div>
      </div>
    </div>
  );
}
