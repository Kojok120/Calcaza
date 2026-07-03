import type { Metadata } from 'next';
import Link from 'next/link';
import { EDITORIAL_DESK } from '@/lib/editorial';
import { notFound } from 'next/navigation';
import { Lock, ShieldCheck } from 'lucide-react';
import { calculators, getEntry, getAllSlugs } from '@/calculators/registry';
import { buildCalculatorMetadata } from '@/lib/seo';
import { buildCalculatorJsonLd, jsonLdScriptProps } from '@/lib/jsonld';
import { Breadcrumb } from '@/components/Breadcrumb';
import { DisclaimerNote } from '@/components/DisclaimerNote';
import { Faq } from '@/components/Faq';
import { RelatedCalcs } from '@/components/RelatedCalcs';
import { AffiliateBlock } from '@/components/calc/AffiliateBlock';
import { ShareBar } from '@/components/calc/ShareBar';
import { CalcStampProvider } from '@/components/calc/calc-context';
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

/** Mês/ano gravado no carimbo de verificação (ex.: "JUN 2026") */
const STAMP_MONTHS = [
  'JAN',
  'FEV',
  'MAR',
  'ABR',
  'MAI',
  'JUN',
  'JUL',
  'AGO',
  'SET',
  'OUT',
  'NOV',
  'DEZ',
] as const;

function fmtStamp(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return `${STAMP_MONTHS[d.getMonth()]} ${d.getFullYear()}`;
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
  const reviewedAt = meta.reviewedAt ?? meta.updatedAt;

  return (
    <article>
      <script {...jsonLdScriptProps(jsonLd)} />

      {/* Hero */}
      <header className="border-b border-border-default">
        <div className="mx-auto max-w-5xl px-4 pt-6 pb-10 sm:pt-8 sm:pb-12">
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

          <h1 className="font-display mt-3 text-3xl font-bold leading-snug tracking-[0.01em] text-ink-1 sm:text-4xl">
            <span className="marker-accent px-0.5">{meta.title}</span>
          </h1>
          {lede && (
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-ink-2 sm:text-lg">
              {lede}
            </p>
          )}

          {/* Selos de confiança */}
          <ul className="mt-5 flex flex-wrap gap-2 text-xs text-ink-2">
            <li className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-field/60 px-3 py-1.5">
              <ShieldCheck
                aria-hidden
                className="h-3.5 w-3.5 shrink-0 text-brand-600"
                strokeWidth={1.5}
              />
              Fontes:{' '}
              <b className="font-bold text-brand-700">
                Receita Federal e dados oficiais
              </b>
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-border-default bg-field/60 px-3 py-1.5">
              Última verificação{' '}
              <b className="tabular font-bold text-brand-700">
                {fmtDate(reviewedAt)}
              </b>
            </li>
            <li className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5">
              <Lock
                aria-hidden
                className="h-3.5 w-3.5 shrink-0 text-brand-600"
                strokeWidth={1.5}
              />
              Seus dados não são enviados — tudo é calculado no seu navegador
            </li>
          </ul>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-4 py-8 sm:py-10">
        <CalcStampProvider stamp={fmtStamp(reviewedAt)}>
          <Form />
        </CalcStampProvider>

        <ShareBar slug={meta.slug} title={meta.title} />

        <div className="prose prose-base mt-10 max-w-none text-ink-1 marker:text-brand-500 prose-headings:tracking-tight prose-headings:text-ink-1 prose-h2:font-display prose-h2:mt-12 prose-h2:border-l-4 prose-h2:border-brand-600 prose-h2:pl-3.5 prose-h2:text-2xl prose-h2:font-bold prose-h2:leading-snug prose-h3:font-display prose-h3:mt-8 prose-h3:text-lg prose-a:text-brand-700 prose-a:underline prose-a:underline-offset-2 prose-a:decoration-1 prose-strong:text-ink-1 prose-li:my-1">
          <Content />
        </div>

        <AffiliateBlock keys={meta.affiliates} slug={meta.slug} />

        <div className="mt-12">
          <h2 className="font-display border-l-4 border-brand-600 pl-3.5 text-2xl font-bold leading-snug tracking-tight">
            Perguntas frequentes
          </h2>
          <p className="mt-2 text-sm text-ink-3">
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
