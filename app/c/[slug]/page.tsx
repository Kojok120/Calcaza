import type { Metadata } from 'next';
import Link from 'next/link';
import { EDITORIAL_DESK } from '@/lib/editorial';
import { notFound } from 'next/navigation';
import { calculators, getEntry, getAllSlugs } from '@/calculators/registry';
import { buildCalculatorMetadata } from '@/lib/seo';
import { buildCalculatorJsonLd, jsonLdScriptProps } from '@/lib/jsonld';
import { Breadcrumb } from '@/components/Breadcrumb';
import { DisclaimerNote } from '@/components/DisclaimerNote';
import { Faq } from '@/components/Faq';
import { RelatedCalcs } from '@/components/RelatedCalcs';
import { AffiliateBlock } from '@/components/calc/AffiliateBlock';
import { CATEGORY_ICON, CATEGORY_LABEL } from '@/lib/icons';
import { SITE_INTL_LOCALE } from '@/lib/site';

export const dynamicParams = false;

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) return {};
  const { meta } = entry;
  return buildCalculatorMetadata({
    title: meta.title,
    description: meta.description,
    slug: meta.slug,
    publishedAt: meta.publishedAt,
    updatedAt: meta.updatedAt,
  });
}

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat(SITE_INTL_LOCALE, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return iso;
  }
}

export default async function CalculatorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const entry = getEntry(slug);
  if (!entry) notFound();

  const { meta, Form, Content, lede } = entry;
  const jsonLd = buildCalculatorJsonLd(meta);
  const Icon = CATEGORY_ICON[meta.category];

  return (
    <article>
      <script {...jsonLdScriptProps(jsonLd)} />

      {/* Hero */}
      <header className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 pt-6 pb-10 sm:pt-8 sm:pb-14">
          <Breadcrumb
            items={[
              { name: 'Início', href: '/' },
              { name: meta.title },
            ]}
          />

          <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-ink-3">
            <span className="inline-flex items-center gap-1.5">
              <Icon aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
              {CATEGORY_LABEL[meta.category]}
            </span>
            <span aria-hidden>·</span>
            <span className="tabular">
              Atualizado: {fmtDate(meta.updatedAt)}
            </span>
            {meta.reviewedAt && meta.reviewedAt !== meta.updatedAt && (
              <>
                <span aria-hidden>·</span>
                <span className="tabular">
                  Última verificação: {fmtDate(meta.reviewedAt)}
                </span>
              </>
            )}
          </div>

          <p className="mt-2 text-xs text-ink-3">
            Redação e revisão:{' '}
            <Link
              href={EDITORIAL_DESK.path}
              className="text-ink-2 hover:text-ink-1 hover:underline"
            >
              {EDITORIAL_DESK.name}
            </Link>
          </p>

          <h1 className="mt-3 text-3xl font-semibold leading-tight tracking-tight text-ink-1 sm:text-4xl">
            {meta.title}
          </h1>
          {lede && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-2 sm:text-lg">
              {lede}
            </p>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <Form />

        <div className="mt-10 prose prose-base max-w-none text-ink-1 marker:text-ink-3 prose-headings:tracking-tight prose-headings:text-ink-1 prose-h2:mt-12 prose-h2:text-2xl prose-h2:font-semibold prose-h3:mt-8 prose-h3:text-lg prose-a:text-brand-700 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-1 prose-strong:text-ink-1 prose-li:my-1">
          <Content />
        </div>

        <AffiliateBlock keys={meta.affiliates} />

        <div className="mt-12">
          <h2 className="text-2xl font-semibold tracking-tight">Perguntas frequentes</h2>
          <p className="mt-1 text-sm text-ink-3">
            As dúvidas mais comuns sobre como a calculadora funciona e de onde vêm os números.
          </p>
          <div className="mt-5">
            <Faq items={meta.faqs} />
          </div>
        </div>

        <div className="mt-14">
          <RelatedCalcs current={meta} all={calculators} />
        </div>

        <DisclaimerNote
          category={meta.category}
          publishedAt={meta.publishedAt}
          updatedAt={meta.updatedAt}
        />
      </div>
    </article>
  );
}
