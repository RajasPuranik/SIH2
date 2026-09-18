import React from 'react';

interface SkeletonProps {
  variant?: 'text' | 'title' | 'card' | 'circle' | 'bar';
  width?: string | number;
  height?: string | number;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className = '',
}) => {
  const baseClasses = 'animate-pulse bg-zinc-200 dark:bg-zinc-800';

  let variantClasses = '';
  switch (variant) {
    case 'text':
      variantClasses = 'h-4 w-3/4 rounded';
      break;
    case 'title':
      variantClasses = 'h-8 w-1/2 rounded-md';
      break;
    case 'circle':
      variantClasses = 'rounded-full';
      break;
    case 'bar':
      variantClasses = 'h-2 w-full rounded-full';
      break;
    case 'card':
      return (
        <div
          className={`rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 p-4 shadow-sm ${className}`}
          style={{ width, height }}
        >
          <div className={`${baseClasses} h-6 w-2/3 rounded-md mb-4`}></div>
          <div className="space-y-2 mb-4">
            <div className={`${baseClasses} h-4 w-full rounded`}></div>
            <div className={`${baseClasses} h-4 w-full rounded`}></div>
            <div className={`${baseClasses} h-4 w-5/6 rounded`}></div>
          </div>
          <div className={`${baseClasses} h-2 w-full rounded-full`}></div>
        </div>
      );
  }

  return (
    <div
      className={`${baseClasses} ${variantClasses} ${className}`}
      style={{
        ...(width && { width }),
        ...(height && { height }),
      }}
    />
  );
};
