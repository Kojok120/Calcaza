import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import type { CalculatorMeta } from '@/lib/types';

type Props = {
  current: CalculatorMeta;
  all: CalculatorMeta[];
  limit?: number;
};

export function RelatedCalcs({ current, all, limit = 4 }: Props) {
  const others = all.filter((m) => m.slug !== current.slug);
  const sameCategory = others.filter((m) => m.category === current.category);
  const otherCategory = others.filter((m) => m.category !== current.category);
  const picked = [...sameCategory, ...otherCategory].slice(0, limit);

  if (picked.length === 0) return null;

  return (
    <section aria-labelledby="related-heading">
      <h2 id="related-heading" className="text-2xl font-semibold tracking-tight">
        Calculadoras relacionadas
      </h2>
      <p className="mt-1 text-sm text-ink-3">
        Outras calculadoras do mesmo tema ou que costumam ser usadas em conjunto.
      </p>
      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {picked.map((m) => (
          <li key={m.slug}>
            <Link
              href={`/c/${m.slug}/`}
              className="group flex h-full flex-col rounded-md border border-border-default bg-surface-0 p-5 transition-colors hover:bg-surface-1 hover:border-border-strong"
            >
              <p className="text-base font-semibold leading-snug text-ink-1">
                {m.title}
              </p>
              <p className="mt-1.5 line-clamp-2 text-sm text-ink-3">
                {m.description}
              </p>
              <span className="mt-3 inline-flex items-center text-sm font-medium text-ink-2 group-hover:text-ink-1">
                Abrir
                <ChevronRight
                  aria-hidden
                  className="ms-1 h-4 w-4"
                  strokeWidth={1.75}
                />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
