import { AlertTriangle, Info, X } from 'lucide-react';
import type { BasketConflict } from '../../types';

interface ConflictAlertProps {
  conflict: BasketConflict;
  onDismiss?: () => void;
}

export function ConflictAlert({ conflict, onDismiss }: ConflictAlertProps) {
  const isWarning = conflict.type === 'superseded';

  return (
    <div
      className={`flex items-start gap-3 p-4 rounded-xl border ${
        isWarning
          ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-200'
          : 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-200'
      }`}
      role="alert"
    >
      <div className="shrink-0 mt-0.5">
        {isWarning ? (
          <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500" />
        ) : (
          <Info className="w-5 h-5 text-blue-600 dark:text-blue-500" />
        )}
      </div>
      <div className="flex-1 text-sm font-medium leading-relaxed">
        {conflict.message}
      </div>
      {onDismiss && (
        <button
          onClick={onDismiss}
          className="shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}
