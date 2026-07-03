'use client';

import { useState } from 'react';
import { Check, Link2, MessageCircle, Share2 } from 'lucide-react';
import { trackShareClick } from '@/lib/analytics';
import { SITE_URL } from '@/lib/site';

/**
 * Barra de compartilhamento — WhatsApp / Facebook / copiar link.
 *
 * No Brasil, o WhatsApp é o canal número um para compartilhar informações de
 * salário e finanças com família e colegas. Os links usam endpoints padrão
 * (wa.me / FB sharer), sem scripts externos, e nenhum valor digitado pelo
 * usuário é enviado — apenas a URL e o título da página. Dispara o evento
 * GA4 `share_click` (canal + calculadora).
 */
export function ShareBar({ slug, title }: { slug: string; title: string }) {
  const [copied, setCopied] = useState(false);

  const url = `${SITE_URL}/c/${slug}/`;
  const shareText = `${title} — ${url}`;
  const whatsappHref = `https://wa.me/?text=${encodeURIComponent(shareText)}`;
  const fbHref = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* área de transferência indisponível — ignorar */
    }
    trackShareClick('copy', slug);
  }

  const itemClass =
    'inline-flex items-center gap-1.5 rounded-full border border-border-default bg-field/60 px-3.5 py-1.5 text-xs font-medium text-ink-2 transition-colors hover:border-brand-300 hover:text-ink-1';

  return (
    <div
      className="mt-6 flex flex-wrap items-center gap-2"
      aria-label="Compartilhar calculadora"
    >
      <span className="inline-flex items-center gap-1.5 text-xs text-ink-3">
        <Share2 aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
        Compartilhe com quem precisa:
      </span>
      <a
        href={whatsappHref}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        onClick={() => trackShareClick('whatsapp', slug)}
      >
        <MessageCircle aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
        WhatsApp
      </a>
      <a
        href={fbHref}
        target="_blank"
        rel="noopener noreferrer"
        className={itemClass}
        onClick={() => trackShareClick('facebook', slug)}
      >
        Facebook
      </a>
      <button type="button" className={itemClass} onClick={copyLink}>
        {copied ? (
          <>
            <Check aria-hidden className="h-3.5 w-3.5 text-brand-600" strokeWidth={1.5} />
            Copiado
          </>
        ) : (
          <>
            <Link2 aria-hidden className="h-3.5 w-3.5" strokeWidth={1.5} />
            Copiar link
          </>
        )}
      </button>
    </div>
  );
}
