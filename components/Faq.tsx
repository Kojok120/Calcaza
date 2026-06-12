'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import { Plus } from 'lucide-react';
import type { Faq as FaqItem } from '@/lib/types';

type Props = { items: FaqItem[] };

export function Faq({ items }: Props) {
  return (
    <ul className="divide-y divide-border-default border-b border-border-default">
      {items.map((it, i) => (
        <FaqRow key={i} item={it} />
      ))}
    </ul>
  );
}

function FaqRow({ item }: { item: FaqItem }) {
  const [open, setOpen] = React.useState(false);
  return (
    <li>
      <Collapsible.Root open={open} onOpenChange={setOpen}>
        <Collapsible.Trigger
          className="group flex w-full items-baseline gap-3 px-1 py-4 text-left text-sm font-bold text-ink-1 transition-colors hover:text-brand-700 sm:py-[1.0625rem] sm:text-[0.9375rem]"
          data-testid="faq-trigger"
        >
          <span aria-hidden className="font-display shrink-0 font-bold text-brand-600">
            P
          </span>
          <span className="min-w-0 flex-1 leading-snug">{item.q}</span>
          <Plus
            aria-hidden
            className="h-4 w-4 shrink-0 self-center text-ink-3 transition-transform duration-200 group-data-[state=open]:rotate-45"
            strokeWidth={1.75}
          />
        </Collapsible.Trigger>
        <Collapsible.Content className="px-1 pb-5">
          <div className="flex items-baseline gap-3 text-sm leading-relaxed text-ink-2">
            <span aria-hidden className="font-display shrink-0 font-bold text-shu">
              R
            </span>
            <span className="min-w-0 flex-1">{item.a}</span>
          </div>
        </Collapsible.Content>
      </Collapsible.Root>
    </li>
  );
}
