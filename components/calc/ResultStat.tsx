import * as React from 'react';
import { cn } from '@/lib/cn';

type Props = {
  label: string;
  value: string;
  sub?: React.ReactNode;
  emphasis?: boolean;
  className?: string;
};

export function ResultStat({ label, value, sub, emphasis = true, className }: Props) {
  return (
    <div
      className={cn(
        'rounded-md border border-border-default bg-surface-1 p-4 sm:p-6',
        className
      )}
    >
      <p className="text-sm font-medium text-ink-2">{label}</p>
      <p
        className={cn(
          'tabular mt-1 font-semibold text-ink-1',
          emphasis ? 'text-4xl sm:text-5xl' : 'text-2xl'
        )}
      >
        {value}
      </p>
      {sub && <div className="mt-2 text-sm text-ink-2">{sub}</div>}
    </div>
  );
}
