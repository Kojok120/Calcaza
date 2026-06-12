'use client';

import * as React from 'react';
import * as RSelect from '@radix-ui/react-select';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/cn';
import { trackCalculatorUsed } from '@/lib/analytics';

type Option = { value: string; label: string };

type Props = {
  id?: string;
  value: string;
  onValueChange: (value: string) => void;
  options: Option[];
  placeholder?: string;
  ariaLabel?: string;
  className?: string;
};

export function Select({
  id,
  value,
  onValueChange,
  options,
  placeholder,
  ariaLabel,
  className,
}: Props) {
  const handleValueChange = React.useCallback(
    (next: string) => {
      trackCalculatorUsed();
      onValueChange(next);
    },
    [onValueChange]
  );

  return (
    <RSelect.Root value={value} onValueChange={handleValueChange}>
      <RSelect.Trigger
        id={id}
        aria-label={ariaLabel}
        className={cn(
          'inline-flex h-14 w-full items-center justify-between gap-2 rounded-md border-[1.5px] border-border-strong bg-field px-4 text-base text-ink-1',
          'outline-none transition-[border-color,box-shadow] duration-150',
          'focus:border-brand-500 focus:ring-[3px] focus:ring-brand-100',
          className
        )}
      >
        <RSelect.Value placeholder={placeholder} />
        <RSelect.Icon className="text-ink-3" aria-hidden>
          <ChevronDown className="h-4 w-4" strokeWidth={1.75} />
        </RSelect.Icon>
      </RSelect.Trigger>
      <RSelect.Portal>
        <RSelect.Content
          position="popper"
          sideOffset={4}
          className={cn(
            'z-50 overflow-hidden rounded-md border border-border-default bg-field',
            'shadow-[0_8px_24px_-12px_rgb(23_58_99/0.25)]',
            'min-w-[var(--radix-select-trigger-width)]'
          )}
        >
          <RSelect.Viewport className="p-1">
            {options.map((opt) => (
              <RSelect.Item
                key={opt.value}
                value={opt.value}
                className={cn(
                  'relative flex h-12 cursor-pointer select-none items-center rounded-sm px-3 text-base outline-none',
                  'data-[highlighted]:bg-surface-2 data-[highlighted]:text-ink-1',
                  'data-[state=checked]:font-medium'
                )}
              >
                <RSelect.ItemText>{opt.label}</RSelect.ItemText>
              </RSelect.Item>
            ))}
          </RSelect.Viewport>
        </RSelect.Content>
      </RSelect.Portal>
    </RSelect.Root>
  );
}
