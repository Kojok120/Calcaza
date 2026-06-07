import Link from 'next/link';
import type { Metadata } from 'next';
import { posts } from '@/posts/registry';
import { SITE_NAME, SITE_URL, SITE_LOCALE } from '@/lib/site';
import { CATEGORY_LABEL } from '@/lib/icons';

const PAGE_TITLE = 'Guias | Calculadoras e números explicados';
const PAGE_DESC =
  'Guias completos em português sobre salário líquido, INSS, IRRF, FGTS, rescisão e 13º salário. Cada artigo cita a fonte oficial (Receita Federal, INSS, Caixa) e leva às calculadoras na prática.';

export const metadata: Metadata = {
  title: PAGE_TITLE,
  description: PAGE_DESC,
  alternates: { canonical: '/blog/' },
  openGraph: {
    type: 'website',
    url: `${SITE_URL}/blog/`,
    siteName: SITE_NAME,
    title: `${PAGE_TITLE} | ${SITE_NAME}`,
    description: PAGE_DESC,
    locale: SITE_LOCALE,
  },
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return iso;
  }
}

export default function BlogIndexPage() {
  const sorted = [...posts].sort((a, b) =>
    a.publishedAt < b.publishedAt ? 1 : -1
  );

  return (
    <article>
      <header className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 pt-8 pb-10 sm:pt-12 sm:pb-14">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-3">
            Guias
          </p>
          <h1 className="mt-2 text-3xl font-semibold leading-tight tracking-tight text-ink-1 sm:text-4xl">
            Calculadoras e números explicados
          </h1>
          <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-2 sm:text-lg">
            Salário líquido, INSS, IRRF, FGTS, rescisão e 13º salário no Brasil.
            Guias completos em português, com a fonte oficial citada em cada caso.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-10 sm:py-12">
        <ul className="grid gap-6 sm:grid-cols-2">
          {sorted.map((post) => (
            <li key={post.slug}>
              <Link
                href={`/blog/${post.slug}/`}
                className="group block h-full rounded-md border border-border-default bg-surface-0 p-5 transition-colors hover:border-border-strong sm:p-6"
              >
                <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3">
                  <span>{CATEGORY_LABEL[post.category]}</span>
                  <span aria-hidden>·</span>
                  <span className="tabular">{fmtDate(post.updatedAt)}</span>
                  <span aria-hidden>·</span>
                  <span>{post.readingMinutes} min</span>
                </div>
                <h2 className="mt-3 text-lg font-semibold leading-snug tracking-tight text-ink-1 group-hover:text-brand-700 sm:text-xl">
                  {post.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-ink-2">
                  {post.excerpt}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </article>
  );
}
