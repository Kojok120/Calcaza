import Link from 'next/link';
import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { posts, getPostEntry, getAllPostSlugs } from '@/posts/registry';
import { getCalculator } from '@/calculators/registry';
import { Breadcrumb } from '@/components/Breadcrumb';
import { buildPostJsonLd, jsonLdScriptProps } from '@/lib/jsonld';
import { SITE_NAME, SITE_URL, SITE_LOCALE } from '@/lib/site';
import { CATEGORY_LABEL } from '@/lib/icons';
import { DEFAULT_POST_AUTHOR } from '@/posts/types';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllPostSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getPostEntry(slug);
  if (!entry) return {};
  const { meta } = entry;
  const path = `/blog/${meta.slug}/`;
  const url = `${SITE_URL}${path}`;
  return {
    title: meta.title,
    description: meta.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title: meta.title,
      description: meta.description,
      locale: SITE_LOCALE,
      publishedTime: meta.publishedAt,
      modifiedTime: meta.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: meta.title,
      description: meta.description,
    },
  };
}

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

function fmtShortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat('pt-BR', {
      year: 'numeric',
      month: 'short',
      day: '2-digit',
    }).format(d);
  } catch {
    return iso;
  }
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getPostEntry(slug);
  if (!entry) notFound();

  const { meta, Content } = entry;
  const jsonLd = buildPostJsonLd(meta);
  const author = meta.author ?? DEFAULT_POST_AUTHOR;
  const reviewedAt = meta.reviewedAt ?? meta.updatedAt;

  const relatedCalcs = meta.relatedCalcSlugs
    .map((s) => getCalculator(s))
    .filter((c): c is NonNullable<ReturnType<typeof getCalculator>> => Boolean(c));

  const otherPosts = posts
    .filter((p) => p.slug !== meta.slug && p.category === meta.category)
    .slice(0, 2);

  return (
    <article>
      <script {...jsonLdScriptProps(jsonLd)} />

      <header className="border-b border-border-subtle">
        <div className="mx-auto max-w-3xl px-4 pt-6 pb-10 sm:pt-8 sm:pb-14">
          <Breadcrumb
            items={[
              { name: 'Início', href: '/' },
              { name: 'Guias', href: '/blog/' },
              { name: meta.title },
            ]}
          />

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3">
            <span>{CATEGORY_LABEL[meta.category]}</span>
            <span aria-hidden>·</span>
            <span className="tabular">Atualizado: {fmtDate(meta.updatedAt)}</span>
            {reviewedAt && reviewedAt !== meta.updatedAt && (
              <>
                <span aria-hidden>·</span>
                <span className="tabular">
                  Última verificação: {fmtDate(reviewedAt)}
                </span>
              </>
            )}
            <span aria-hidden>·</span>
            <span>{meta.readingMinutes} min de leitura</span>
          </div>

          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink-1 sm:text-4xl">
            {meta.title}
          </h1>
          <p className="mt-4 text-sm text-ink-2">
            Por{' '}
            <Link
              href={author.url}
              className="font-medium text-ink-1 underline decoration-1 underline-offset-2 hover:text-brand-700"
            >
              {author.name}
            </Link>{' '}
            · {fmtShortDate(meta.publishedAt)}
            {meta.reviewedBy && (
              <>
                {' '}· Revisado por{' '}
                <Link
                  href={meta.reviewedBy.url}
                  className="font-medium text-ink-1 underline decoration-1 underline-offset-2 hover:text-brand-700"
                >
                  {meta.reviewedBy.name}
                </Link>{' '}
                ({fmtShortDate(meta.reviewedBy.date)})
              </>
            )}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-4 py-8 sm:py-10">
        <div className="prose prose-base max-w-none text-ink-1 marker:text-ink-3 prose-headings:tracking-tight prose-headings:text-ink-1 prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-semibold prose-h3:mt-8 prose-h3:text-lg prose-a:text-brand-700 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-1 prose-strong:text-ink-1 prose-li:my-1 prose-table:text-sm">
          <Content />
        </div>

        {relatedCalcs.length > 0 && (
          <section className="mt-14 rounded-md border border-border-default bg-surface-1 p-5 sm:p-6">
            <h2 className="text-base font-semibold tracking-tight text-ink-1">
              Calcule os números deste artigo
            </h2>
            <ul className="mt-3 grid gap-2 sm:grid-cols-2">
              {relatedCalcs.map((c) => (
                <li key={c.slug}>
                  <Link
                    href={`/c/${c.slug}/`}
                    className="block rounded-md border border-border-subtle bg-surface-0 px-4 py-3 text-sm text-ink-2 transition-colors hover:border-border-strong hover:text-ink-1"
                  >
                    <span className="font-medium text-ink-1">{c.title}</span>
                    <span className="mt-1 block text-xs text-ink-3">
                      {c.description.slice(0, 90)}…
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        {otherPosts.length > 0 && (
          <section className="mt-12">
            <h2 className="text-base font-semibold tracking-tight text-ink-1">
              Guias relacionadas
            </h2>
            <ul className="mt-3 grid gap-3">
              {otherPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}/`}
                    className="block rounded-md border border-border-default bg-surface-0 px-4 py-3 text-sm transition-colors hover:border-border-strong"
                  >
                    <span className="font-medium text-ink-1">{p.title}</span>
                    <span className="mt-1 block text-xs text-ink-3">
                      {p.excerpt}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}

        <div className="mt-12 text-sm text-ink-3">
          <Link href="/blog/" className="hover:text-ink-1 hover:underline">
            ← Voltar às guias
          </Link>
        </div>
      </div>
    </article>
  );
}
