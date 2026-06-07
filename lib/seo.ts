import type { Metadata } from 'next';
import { SITE_LOCALE, SITE_NAME, SITE_URL } from './site';

// O limite vale para a tag <title> final, ou seja, depois de adicionar o sufixo
// de marca do template do layout (« | Calcaza»).
const TITLE_MAX = 60;
const BRAND_SUFFIX = ` | ${SITE_NAME}`;
const DESCRIPTION_MIN = 80;
const DESCRIPTION_MAX = 160;

function lengthCheck(label: string, value: string, max: number, min = 0) {
  if (process.env.NODE_ENV !== 'production') {
    const len = [...value].length;
    if (len > max) {
      // eslint-disable-next-line no-console
      console.warn(`[SEO] ${label} too long: ${len} chars (max ${max}) — "${value}"`);
    } else if (len < min) {
      // eslint-disable-next-line no-console
      console.warn(`[SEO] ${label} too short: ${len} chars (min ${min}) — "${value}"`);
    }
  }
}

export type CalculatorMetadataInput = {
  title: string;
  description: string;
  slug: string;
  publishedAt?: string;
  updatedAt?: string;
};

export function buildCalculatorMetadata(input: CalculatorMetadataInput): Metadata {
  // Comprobamos la longitud real de la etiqueta <title>, con el sufijo de marca.
  lengthCheck(`title «${input.title}» (con marca)`, input.title + BRAND_SUFFIX, TITLE_MAX);
  lengthCheck('description', input.description, DESCRIPTION_MAX, DESCRIPTION_MIN);

  const path = `/c/${input.slug}/`;
  const url = `${SITE_URL}${path}`;

  return {
    title: input.title,
    description: input.description,
    alternates: { canonical: path },
    openGraph: {
      type: 'article',
      url,
      siteName: SITE_NAME,
      title: input.title,
      description: input.description,
      locale: SITE_LOCALE,
      publishedTime: input.publishedAt,
      modifiedTime: input.updatedAt,
    },
    twitter: {
      card: 'summary_large_image',
      title: input.title,
      description: input.description,
    },
  };
}
