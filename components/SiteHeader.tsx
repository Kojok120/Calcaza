import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

const NAV_ITEMS = [
  { href: '/blog/', label: 'Guias' },
  { href: '/methodology/', label: 'Metodologia' },
  { href: '/about/', label: 'Sobre' },
  { href: '/disclaimer/', label: 'Aviso legal' },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border-default bg-surface-0/90 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16">
        <Link
          href="/"
          className="font-display flex items-center gap-2.5 text-xl font-bold tracking-[0.08em] text-ink-1 sm:text-[1.375rem]"
        >
          <span
            aria-hidden
            className="h-2 w-2 -translate-y-px rounded-full bg-shu"
          />
          {SITE_NAME}
        </Link>
        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-0.5 text-[0.8125rem] tracking-[0.04em] text-ink-2 sm:gap-1.5">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="rounded-md px-2.5 py-1.5 transition-colors hover:text-brand-600 sm:px-3"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </header>
  );
}
