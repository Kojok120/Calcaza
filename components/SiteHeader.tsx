import Link from 'next/link';
import { SITE_NAME } from '@/lib/site';

export function SiteHeader() {
  return (
    <header className="border-b border-border-default bg-surface-0">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:h-16">
        <Link
          href="/"
          className="flex items-center gap-2.5 text-ink-1"
        >
          <span
            aria-hidden
            className="font-display grid h-9 w-9 place-items-center rounded-md border border-border-default text-[15px] font-bold text-ink-1"
          >
            $
          </span>
          <span className="font-display text-2xl font-bold tracking-[0.02em] sm:text-[1.625rem]">
            {SITE_NAME}
          </span>
        </Link>
        <nav aria-label="Navegação principal">
          <ul className="flex items-center gap-1 text-sm text-ink-2">
            <li>
              <Link
                href="/blog/"
                className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-2 hover:text-ink-1"
              >
                Guias
              </Link>
            </li>
            <li>
              <Link
                href="/methodology/"
                className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-2 hover:text-ink-1"
              >
                Metodologia
              </Link>
            </li>
            <li>
              <Link
                href="/about/"
                className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-2 hover:text-ink-1"
              >
                Sobre
              </Link>
            </li>
            <li>
              <Link
                href="/disclaimer/"
                className="rounded-md px-3 py-1.5 transition-colors hover:bg-surface-2 hover:text-ink-1"
              >
                Aviso legal
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
