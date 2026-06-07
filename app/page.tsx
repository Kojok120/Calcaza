import Link from 'next/link';
import type { Metadata } from 'next';
import { ChevronRight } from 'lucide-react';
import { posts } from '@/posts/registry';
import { calculators } from '@/calculators/registry';
import { jsonLdScriptProps, buildOrganization } from '@/lib/jsonld';
import {
  SITE_LANG,
  SITE_NAME,
  SITE_TAGLINE,
  SITE_URL,
  SITE_DEFAULT_OG_DESCRIPTION,
} from '@/lib/site';
import { CATEGORY_ICON, CATEGORY_LABEL } from '@/lib/icons';
import type { CalculatorCategory, CalculatorMeta } from '@/lib/types';

export const metadata: Metadata = {
  title: `${SITE_NAME} | ${SITE_TAGLINE}`,
  description: SITE_DEFAULT_OG_DESCRIPTION,
  alternates: { canonical: '/' },
};

const CATEGORY_BLURB: Record<CalculatorCategory, string> = {
  pet: 'Financiamento imobiliário, uso do FGTS e os custos de comprar um imóvel no Brasil.',
  finance: 'Financiamento, juros, parcelas e o impacto da Selic no seu orçamento em reais.',
  tax: 'Imposto de Renda (IRPF e IRRF), Simples Nacional e o DAS do MEI.',
  labor: 'Salário líquido, INSS, FGTS, rescisão, 13º salário e horas extras pela CLT.',
  life: 'Aluguel, energia, combustível e o custo de vida do dia a dia no Brasil.',
  family: 'Despesas da família, gastos com escola e o orçamento com os filhos.',
  tech: 'Assinaturas, serviços de nuvem e o custo mensal de ferramentas SaaS.',
  health: 'Planos de saúde, reajuste das mensalidades e métricas de saúde.',
};

const CATEGORY_ORDER: CalculatorCategory[] = [
  'pet',
  'finance',
  'tax',
  'labor',
  'life',
  'family',
  'tech',
  'health',
];

const RECENT_DAYS = 90;

function isRecent(iso: string): boolean {
  const t = Date.parse(iso);
  if (Number.isNaN(t)) return false;
  return Date.now() - t < RECENT_DAYS * 86_400_000;
}

export default function HomePage() {
  const grouped = calculators.reduce<Record<string, CalculatorMeta[]>>(
    (acc, c) => {
      (acc[c.category] ??= []).push(c);
      return acc;
    },
    {}
  );

  const orderedCategories = CATEGORY_ORDER.filter((cat) => grouped[cat]?.length);

  const featuredPosts = [...posts]
    .sort((a, b) =>
      (b.reviewedAt ?? b.updatedAt).localeCompare(a.reviewedAt ?? a.updatedAt)
    )
    .slice(0, 4);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(),
      {
        '@type': 'WebSite',
        '@id': `${SITE_URL}/#website`,
        name: SITE_NAME,
        url: SITE_URL,
        inLanguage: SITE_LANG,
      },
    ],
  };

  return (
    <>
      <script {...jsonLdScriptProps(jsonLd)} />

      {/* Hero */}
      <section className="border-b border-border-subtle">
        <div className="mx-auto max-w-5xl px-4 pt-16 pb-14 sm:pt-24 sm:pb-20">
          <h1 className="font-display text-3xl font-semibold leading-tight tracking-tight text-ink-1 sm:text-5xl">
            Calcule seus números, em português, em segundos.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ink-2 sm:text-lg">
            Calculadoras claras em português para salário líquido, INSS, IRRF, FGTS, rescisão e 13º salário no Brasil, com a fonte oficial (Receita Federal, INSS, Caixa) citada em cada página.
          </p>
          <div className="mt-7 flex flex-wrap items-center gap-3">
            <a
              href="#calculators"
              className="inline-flex h-11 items-center justify-center rounded-md bg-ink-1 px-5 text-sm font-medium text-surface-0 transition-colors hover:bg-ink-2"
            >
              Ver calculadoras
            </a>
            <Link
              href="/blog/"
              className="inline-flex h-11 items-center justify-center rounded-md border border-border-default bg-surface-0 px-5 text-sm font-medium text-ink-1 transition-colors hover:bg-surface-2"
            >
              Guias
            </Link>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-ink-3">
            Cada número tem fonte. As alíquotas e os limites vêm apenas de
            fontes oficiais <code>.gov.br</code>, e{' '}
            <Link href="/about/#editorial-desk" className="text-ink-2 underline underline-offset-2 hover:text-ink-1">
              a equipe editorial
            </Link>{' '}
            os revisa segundo uma{' '}
            <Link href="/methodology/" className="text-ink-2 underline underline-offset-2 hover:text-ink-1">
              metodologia publicada
            </Link>
            .
          </p>
        </div>
      </section>

      {/* Calculator listing */}
      <section
        id="calculators"
        className="mx-auto max-w-5xl scroll-mt-16 px-4 py-14 sm:py-20"
      >
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
          Explore por categoria
        </h2>

        <div className="mt-10 space-y-12">
          {orderedCategories.map((cat) => {
            const items = grouped[cat] ?? [];
            const Icon = CATEGORY_ICON[cat];
            return (
              <div key={cat}>
                <div className="flex items-baseline gap-3">
                  <Icon
                    aria-hidden
                    className="h-5 w-5 self-center text-ink-2"
                    strokeWidth={1.5}
                  />
                  <h3 className="text-lg font-semibold tracking-tight text-ink-1">
                    {CATEGORY_LABEL[cat]}
                  </h3>
                  <span className="tabular text-sm text-ink-3">
                    {items.length}
                  </span>
                </div>
                <p className="mt-1 text-sm text-ink-3">{CATEGORY_BLURB[cat]}</p>

                <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {items.map((c) => (
                    <li key={c.slug}>
                      <Link
                        href={`/c/${c.slug}/`}
                        className="group flex h-full flex-col rounded-md border border-border-default bg-surface-0 p-5 transition-colors hover:bg-surface-1 hover:border-border-strong"
                      >
                        <div className="flex items-center gap-2 text-xs text-ink-3">
                          <span>{CATEGORY_LABEL[cat]}</span>
                          {isRecent(c.updatedAt) && (
                            <>
                              <span aria-hidden>·</span>
                              <span>Novo</span>
                            </>
                          )}
                        </div>
                        <p className="mt-2 text-base font-semibold leading-snug text-ink-1">
                          {c.title}
                        </p>
                        <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-3">
                          {c.description}
                        </p>
                        <span className="mt-4 inline-flex items-center text-sm font-medium text-ink-2 group-hover:text-ink-1">
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
              </div>
            );
          })}
        </div>
      </section>

      {/* Guias / conteúdo editorial */}
      {featuredPosts.length > 0 && (
        <section className="border-t border-border-subtle">
          <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
            <div className="flex items-baseline justify-between gap-4">
              <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
                Guias que explicam os números
              </h2>
              <Link
                href="/blog/"
                className="shrink-0 text-sm font-medium text-ink-2 hover:text-ink-1 hover:underline"
              >
                Todas as guias
              </Link>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-3">
              Não é só a calculadora: também explicamos como o INSS é descontado
              da folha, como funcionam as faixas do IRRF e o que entra na conta
              da rescisão e do 13º salário ─ sempre com as fontes oficiais
              indicadas.
            </p>

            <ul className="mt-8 grid gap-3 sm:grid-cols-2">
              {featuredPosts.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/blog/${p.slug}/`}
                    className="group flex h-full flex-col rounded-md border border-border-default bg-surface-0 p-5 transition-colors hover:bg-surface-1 hover:border-border-strong"
                  >
                    <div className="flex items-center gap-2 text-xs text-ink-3">
                      <span>{CATEGORY_LABEL[p.category]}</span>
                      <span aria-hidden>·</span>
                      <span>{p.readingMinutes} min de leitura</span>
                    </div>
                    <p className="mt-2 text-base font-semibold leading-snug text-ink-1">
                      {p.title}
                    </p>
                    <p className="mt-1.5 line-clamp-3 text-sm leading-relaxed text-ink-3">
                      {p.excerpt}
                    </p>
                    <span className="mt-4 inline-flex items-center text-sm font-medium text-ink-2 group-hover:text-ink-1">
                      Ler a guia
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
          </div>
        </section>
      )}

      {/* Why */}
      <section className="border-t border-border-subtle bg-surface-1">
        <div className="mx-auto max-w-5xl px-4 py-14 sm:py-20">
          <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
            Além do número final: aqui você vê de onde ele vem.
          </h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-ink-3">
            A maioria das calculadoras mostra só o número final. A Calcaza mostra a tabela do INSS, as faixas do IRRF, o teto do INSS e os descontos aplicados, em português e com cada fonte oficial citada.
          </p>
        </div>
      </section>
    </>
  );
}
