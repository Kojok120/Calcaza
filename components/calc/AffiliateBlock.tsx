'use client';

import { ChevronRight } from 'lucide-react';
import { getOffers, offerUrlWithSubId } from '@/lib/affiliates';
import { trackAffiliateClick } from '@/lib/analytics';

/**
 * Bloco de ofertas de parceiros (afiliados), curado por calculadora.
 *
 * Recebe as chaves de oferta do meta.ts da calculadora e só renderiza as que já
 * têm URL configurada (ver lib/affiliates.ts). Se não houver nenhuma, não
 * renderiza nada — assim páginas sem parceiro relevante ficam limpas.
 *
 * Rastreamento: cada link anexa o SubID da calculadora (relatório da rede) e
 * dispara o evento `affiliate_click` no GA4. Os links saem com
 * rel="sponsored nofollow noopener" e divulgação obrigatória.
 */
export function AffiliateBlock({
  keys,
  slug,
}: {
  keys: string[] | undefined;
  slug: string;
}) {
  const offers = getOffers(keys);
  if (offers.length === 0) return null;

  return (
    <aside className="mt-12" aria-label="Ofertas de parceiros">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-2xl font-semibold tracking-tight text-ink-1">
          Recomendados para você
        </h2>
        <span className="shrink-0 text-[11px] font-medium uppercase tracking-wider text-ink-3">
          Publicidade
        </span>
      </div>

      <ul className="mt-5 grid gap-3 sm:grid-cols-2">
        {offers.map((o) => (
          <li key={o.network + o.url}>
            <a
              href={offerUrlWithSubId(o, slug)}
              target="_blank"
              rel="sponsored nofollow noopener"
              onClick={() => trackAffiliateClick(o.network, slug)}
              className="group flex h-full flex-col rounded-md border border-border-default bg-surface-0 p-5 transition-colors hover:bg-surface-1 hover:border-border-strong"
            >
              <p className="text-base font-semibold leading-snug text-ink-1">
                {o.label}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-3">
                {o.description}
              </p>
              <span className="mt-4 inline-flex items-center text-sm font-medium text-ink-2 group-hover:text-ink-1">
                {o.cta}
                <ChevronRight aria-hidden className="ms-1 h-4 w-4" strokeWidth={1.75} />
              </span>
            </a>
          </li>
        ))}
      </ul>

      <p className="mt-3 text-xs leading-relaxed text-ink-3">
        Links de parceiros: a Calcaza pode receber uma comissão se você contratar
        por aqui, sem custo extra para você. Isso não influencia os cálculos nem o
        conteúdo desta página.
      </p>
    </aside>
  );
}
