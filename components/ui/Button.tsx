import * as React from 'react';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'danger';
type Size = 'sm' | 'md' | 'lg';

const variantClass: Record<Variant, string> = {
  primary:
    'bg-ink-1 hover:bg-ink-2 active:bg-ink-2 text-surface-0',
  secondary:
    'bg-surface-0 hover:bg-surface-2 text-ink-1 border border-border-default',
  ghost: 'hover:bg-surface-2 text-ink-2',
  danger: 'bg-danger-500 hover:bg-danger-500/90 text-white',
};

const sizeClass: Record<Size, string> = {
  sm: 'h-10 px-4 text-sm min-w-12',
  md: 'h-12 px-6 text-base min-w-12',
  lg: 'h-14 px-8 text-base min-w-12',
};

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: Variant;
  size?: Size;
};

export const Button = React.forwardRef<HTMLButtonElement, Props>(
  function Button(
    { variant = 'primary', size = 'md', className, type = 'button', ...rest },
    ref
  ) {
    return (
      <button
        ref={ref}
        type={type}
        className={cn(
          'inline-flex items-center justify-center rounded-md font-medium transition-colors',
          'disabled:opacity-50 disabled:pointer-events-none',
          variantClass[variant],
          sizeClass[size],
          className
        )}
        {...rest}
      />
    );
  }
);
