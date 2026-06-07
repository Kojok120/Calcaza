import * as React from 'react';
import { cn } from '@/lib/cn';

type Props = React.HTMLAttributes<HTMLDivElement>;

export function Card({ className, ...rest }: Props) {
  return (
    <div
      className={cn(
        'rounded-md border border-border-default bg-surface-1 p-4 sm:p-6',
        className
      )}
      {...rest}
    />
  );
}
