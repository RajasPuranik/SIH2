import React from 'react';
import type { CertificationType } from '../../types';
import { Shield, Monitor, ClipboardCheck, Radio, UtensilsCrossed } from 'lucide-react';

interface CertBadgeProps {
  type: CertificationType;
  className?: string;
}

export const CertBadge: React.FC<CertBadgeProps> = ({ type, className = '' }) => {
  const config = {
    'ISI Mark': {
      icon: Shield,
      colors: 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-900/20 dark:text-indigo-300 dark:border-indigo-800',
    },
    'CRS': {
      icon: Monitor,
      colors: 'bg-cyan-50 text-cyan-700 border-cyan-200 dark:bg-cyan-900/20 dark:text-cyan-300 dark:border-cyan-800',
    },
    'QCO': {
      icon: ClipboardCheck,
      colors: 'bg-violet-50 text-violet-700 border-violet-200 dark:bg-violet-900/20 dark:text-violet-300 dark:border-violet-800',
    },
    'WPC': {
      icon: Radio,
      colors: 'bg-fuchsia-50 text-fuchsia-700 border-fuchsia-200 dark:bg-fuchsia-900/20 dark:text-fuchsia-300 dark:border-fuchsia-800',
    },
    'FSSAI': {
      icon: UtensilsCrossed,
      colors: 'bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-800',
    },
  };

  const { icon: Icon, colors } = config[type] || config['ISI Mark'];

  return (
    <span
      className={`inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium border ${colors} ${className}`}
      title={type}
    >
      <Icon className="w-3.5 h-3.5" />
      {type}
    </span>
  );
};
