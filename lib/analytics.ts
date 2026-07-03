'use client';

/**
 * Registra um evento de uso da calculadora (engajamento) via Google Analytics 4.
 *
 * Dispara `calculator_used` uma única vez por calculadora e sessão, quando o
 * usuário interage pela primeira vez com os campos (muda um valor ou uma opção).
 * O objetivo é saber qual proporção de visitantes realmente usa a calculadora,
 * não apenas abre a página (taxa de uso).
 *
 * Privacidade: nenhum valor digitado pelo usuário é enviado, apenas o sinal de
 * que houve uma interação e o slug da calculadora obtido da rota. O cálculo
 * continua rodando inteiramente no navegador.
 *
 * É chamado pelos componentes compartilhados (NumberInput / Select), então cobre
 * todas as calculadoras automaticamente, sem mudanças por calculadora. Só
 * funciona se o GA4 estiver configurado (gtag presente).
 */

const firedSlugs = new Set<string>();

function calculatorSlugFromPath(pathname: string): string {
  const m = pathname.match(/\/c\/([^/]+)/);
  return m ? m[1] : pathname;
}

export function trackCalculatorUsed(): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag !== 'function') return; // GA4 não configurado → no-op

  const slug = calculatorSlugFromPath(window.location.pathname);
  if (firedSlugs.has(slug)) return; // uma vez por calculadora e sessão
  firedSlugs.add(slug);

  gtag('event', 'calculator_used', { calculator: slug });
}

/**
 * Registra um clique em link de afiliado (engajamento de monetização) no GA4.
 *
 * Dispara `affiliate_click` toda vez que o usuário clica numa oferta de parceiro,
 * com a rede (network) e a calculadora de origem. Permite ver no GA4 quais
 * ofertas/páginas realmente geram cliques e otimizar a curadoria.
 * Nenhum dado pessoal é enviado. No-op se o GA4 não estiver configurado.
 */
export function trackAffiliateClick(network: string, calculator: string): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', 'affiliate_click', { network, calculator });
}

/**
 * Rastreia o compartilhamento da calculadora (WhatsApp / Facebook / copiar)
 * como evento `share_click` no GA4. Apenas canal + slug; sem dados pessoais.
 * No-op se o GA4 não estiver configurado.
 */
export function trackShareClick(channel: string, calculator: string): void {
  if (typeof window === 'undefined') return;
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void })
    .gtag;
  if (typeof gtag !== 'function') return;
  gtag('event', 'share_click', { channel, calculator });
}
