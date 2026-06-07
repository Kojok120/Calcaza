'use client';

import * as Collapsible from '@radix-ui/react-collapsible';
import * as React from 'react';
import { Plus } from 'lucide-react';
import type { Faq as FaqItem } from '@/lib/types';

type Props = { items: FaqItem[] };

export function Faq({ items }: Props) {
  return (
    <ul className="divide-y divide-border-subtle overflow-hidden rounded-md border border-border-default bg-surface-0">
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
          className="group flex w-full items-center justify-between gap-3 px-4 py-4 text-left text-sm font-medium text-ink-1 transition-colors hover:bg-surface-1 sm:px-5 sm:text-base"
          data-testid="faq-trigger"
        >
          <span className="min-w-0 flex-1 leading-snug">{item.q}</span>
          <Plus
            aria-hidden
            className="h-4 w-4 shrink-0 text-ink-3 transition-transform duration-150 group-data-[state=open]:rotate-45"
            strokeWidth={1.75}
          />
        </Collapsible.Trigger>
        <Collapsible.Content className="px-4 pb-5 text-sm leading-relaxed text-ink-2 sm:px-5">
          {item.a}
        </Collapsible.Content>
      </Collapsible.Root>
    </li>
  );
}
