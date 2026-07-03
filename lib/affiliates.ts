/**
 * Catálogo de ofertas de afiliado da Calcaza.
 *
 * COMO ATIVAR (plug-and-play):
 *  1. Cadastre-se no programa de afiliado e seja aprovado.
 *  2. Cole a SUA URL de afiliado (já com o seu ID de rastreamento) no campo `url`
 *     da oferta correspondente abaixo.
 *  3. Pronto — a oferta passa a aparecer nas calculadoras que a referenciam.
 *
 * IMPORTANTE: ofertas com `url: ''` (placeholder) NÃO são exibidas. Ou seja, nada
 * quebrado nem vazio aparece para o usuário enquanto a URL real não estiver
 * configurada. Cada calculadora escolhe, no seu meta.ts (`affiliates: [...]`),
 * QUAIS ofertas são realmente relevantes para aquele cálculo (curadoria por
 * calculadora — sem espalhar anúncio genérico em todas as páginas).
 *
 * As chaves (keys) são referenciadas em calculators/<slug>/meta.ts → `affiliates`.
 */
export type AffiliateOffer = {
  /** Rede/parceiro, para rastreamento interno (ex.: 'contabilizei', 'hotmart'). */
  network: string;
  /** Título visível do card. */
  label: string;
  /** Por que é útil — 1 frase, contextual. */
  description: string;
  /** Texto do botão. */
  cta: string;
  /**
   * URL de afiliado aprovada (com o seu ID). Deixe '' até ter o link real:
   * ofertas com url vazia não são renderizadas.
   */
  url: string;
  /**
   * Nome do parâmetro de SubID da sua rede (para rastrear, no relatório da rede,
   * QUAL calculadora gerou a conversão). Padrão: 'subid'. Ajuste conforme a rede
   * (ex.: 'aff_sub', 'u1', 'subId'). Use '' para não anexar SubID.
   */
  subIdParam?: string;
};

export const AFFILIATE_OFFERS: Record<string, AffiliateOffer> = {
  contabilizei: {
    network: 'contabilizei',
    label: 'Abra ou regularize sua empresa com a Contabilizei',
    description:
      'Contabilidade online para MEI, autônomo e PJ: abertura, troca de contador e os impostos (DAS) em dia.',
    cta: 'Ver planos',
    url: '', // TODO: cole sua URL de afiliado da Contabilizei
  },
  corretora: {
    network: 'corretora',
    label: 'Comece a investir numa corretora',
    description:
      'Abra conta gratuita e aplique em CDB, Tesouro Direto e fundos para fazer o dinheiro render.',
    cta: 'Abrir conta',
    url: '', // TODO: cole sua URL de afiliado da corretora (XP, Rico, Nubank, etc.)
  },
  cursoFinancas: {
    network: 'hotmart',
    label: 'Curso de finanças e investimentos',
    description:
      'Aprenda a organizar o orçamento e a investir do zero, no seu ritmo.',
    cta: 'Conhecer o curso',
    url: '', // TODO: cole sua URL de afiliado (Hotmart/Monetizze)
  },
  financiamentoImovel: {
    network: 'financiamento',
    label: 'Simule seu financiamento ou consórcio',
    description:
      'Compare condições de financiamento e consórcio imobiliário antes de fechar negócio.',
    cta: 'Simular',
    url: '', // TODO: cole sua URL de afiliado (parceiro de crédito/consórcio imobiliário)
  },
  contaDigital: {
    network: 'fintech',
    label: 'Conta digital sem tarifas',
    description:
      'Receba o salário, pague boletos e use cartão sem mensalidade.',
    cta: 'Abrir conta',
    url: '', // TODO: cole sua URL de afiliado (conta digital/fintech)
  },
  remittance: {
    network: 'wise-partnerize',
    label: 'Envie dinheiro ao exterior com a taxa real',
    description:
      'Transferências internacionais com o câmbio comercial e tarifas transparentes; compare o VET com o do seu banco antes de enviar.',
    cta: 'Ver a Wise',
    url: 'https://wise.prf.hn/click/camref:1110lHu3z', // Partnerize (payout JPY) — SubID via prf.hn path pubref:
  },
};

/**
 * Resolve as chaves de afiliado de uma calculadora para ofertas exibíveis.
 * Filtra ofertas inexistentes e as que ainda não têm URL configurada.
 */
export function getOffers(keys: string[] | undefined): AffiliateOffer[] {
  if (!keys?.length) return [];
  return keys
    .map((k) => AFFILIATE_OFFERS[k])
    .filter((o): o is AffiliateOffer => Boolean(o && o.url));
}

/**
 * URL final da oferta com o SubID da calculadora anexado (quando aplicável),
 * para que o relatório da rede mostre qual calculadora converteu.
 */
export function offerUrlWithSubId(offer: AffiliateOffer, slug: string): string {
  if (!offer.url) return offer.url;
  const param = offer.subIdParam === undefined ? 'subid' : offer.subIdParam;
  if (!param || !slug) return offer.url;
  // Partnerize (prf.hn): o SubID vai como segmento de caminho `pubref:`, não query param.
  if (offer.url.includes('prf.hn')) {
    return `${offer.url.replace(/\/+$/, '')}/pubref:${encodeURIComponent(slug)}`;
  }
  const sep = offer.url.includes('?') ? '&' : '?';
  return `${offer.url}${sep}${param}=${encodeURIComponent(slug)}`;
}
