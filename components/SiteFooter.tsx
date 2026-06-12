import Link from 'next/link';
import { SITE_CONTACT_EMAIL, SITE_NAME, SITE_TAGLINE } from '@/lib/site';
import { EDITORIAL_DESK } from '@/lib/editorial';

export function SiteFooter() {
  return (
    <footer className="mt-20 border-t border-border-default bg-surface-1">
      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <div className="grid gap-8 sm:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <Link
              href="/"
              className="font-display flex items-center gap-2 text-base font-bold tracking-[0.08em] text-ink-1"
            >
              <span
                aria-hidden
                className="h-1.5 w-1.5 rounded-full bg-shu"
              />
              {SITE_NAME}
            </Link>
            <p className="mt-3 text-sm leading-relaxed text-ink-3">
              {SITE_TAGLINE}.
            </p>
          </div>

          <nav aria-label="Navegação">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">
              Navegação
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link href="/" className="text-ink-2 hover:text-ink-1 hover:underline">
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="/about/"
                  className="text-ink-2 hover:text-ink-1 hover:underline"
                >
                  Sobre
                </Link>
              </li>
              <li>
                <Link
                  href="/contact/"
                  className="text-ink-2 hover:text-ink-1 hover:underline"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </nav>

          <nav aria-label="Políticas">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-ink-3">
              Políticas
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              <li>
                <Link
                  href="/privacy/"
                  className="text-ink-2 hover:text-ink-1 hover:underline"
                >
                  Privacidade
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer/"
                  className="text-ink-2 hover:text-ink-1 hover:underline"
                >
                  Aviso legal
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border-subtle pt-6 text-xs text-ink-3 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_NAME} · Edição:{' '}
            <Link
              href={EDITORIAL_DESK.path}
              className="hover:text-ink-1 hover:underline"
            >
              {EDITORIAL_DESK.name}
            </Link>{' '}
            ·{' '}
            <a
              href={`mailto:${SITE_CONTACT_EMAIL}`}
              className="hover:text-ink-1 hover:underline"
            >
              {SITE_CONTACT_EMAIL}
            </a>
          </p>
          <p>
            Os valores exibidos são estimativas baseadas em tabelas e tarifas públicas e podem diferir da sua situação real.
          </p>
        </div>
      </div>
    </footer>
  );
}
