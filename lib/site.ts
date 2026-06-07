export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL ?? 'https://calcaza.com';
export const SITE_NAME =
  process.env.NEXT_PUBLIC_SITE_NAME ?? 'Calcaza';
export const SITE_TAGLINE =
  process.env.NEXT_PUBLIC_SITE_TAGLINE ?? 'Calculadoras claras em português';
export const SITE_DEFAULT_OG_DESCRIPTION =
  process.env.NEXT_PUBLIC_SITE_OG_DESCRIPTION ??
  'Calculadoras em português para o Brasil: salário líquido, INSS, IRRF, FGTS, rescisão e 13º salário em reais, com a fonte oficial citada em cada página.';

export const SITE_LANG = process.env.NEXT_PUBLIC_SITE_LANG ?? 'pt-BR';
export const SITE_LOCALE = process.env.NEXT_PUBLIC_SITE_LOCALE ?? 'pt_BR';
export const SITE_DIR = process.env.NEXT_PUBLIC_SITE_DIR ?? 'ltr';
export const SITE_INTL_LOCALE =
  process.env.NEXT_PUBLIC_SITE_INTL_LOCALE ?? 'pt-BR';
export const SITE_CURRENCY = process.env.NEXT_PUBLIC_SITE_CURRENCY ?? 'BRL';

export const ADSENSE_CLIENT =
  process.env.NEXT_PUBLIC_ADSENSE_CLIENT ?? 'ca-pub-XXXXXXXXXXXXXXXX';

// ID de medição do Google Analytics 4 (G-XXXXXXXXXX). Vazio = sem rastreamento.
export const GA4_ID = process.env.NEXT_PUBLIC_GA4_ID ?? '';

export const SITE_OPERATOR =
  process.env.NEXT_PUBLIC_SITE_OPERATOR ?? 'Equipe Editorial da Calcaza';
export const SITE_CONTACT_EMAIL =
  process.env.NEXT_PUBLIC_SITE_CONTACT_EMAIL ?? 'kojokamo120@gmail.com';

export const CLOUDFLARE_ANALYTICS_TOKEN =
  process.env.NEXT_PUBLIC_CLOUDFLARE_ANALYTICS_TOKEN ?? '';
