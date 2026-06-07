import {
  SITE_CONTACT_EMAIL,
  SITE_CURRENCY,
  SITE_LANG,
  SITE_NAME,
  SITE_URL,
} from './site';
import { EDITORIAL_DESK } from './editorial';
import type { CalculatorMeta } from './types';
import type { PostMeta } from '@/posts/types';
import { DEFAULT_POST_AUTHOR } from '@/posts/types';

type JsonLdGraph = {
  '@context': 'https://schema.org';
  '@graph': Record<string, unknown>[];
};

export function buildOrganization(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': `${SITE_URL}/#organization`,
    name: SITE_NAME,
    url: SITE_URL,
    description: EDITORIAL_DESK.description,
    knowsAbout: EDITORIAL_DESK.knowsAbout,
    // Principios editoriales y de fuentes publicados (señal E-E-A-T).
    publishingPrinciples: `${SITE_URL}/methodology/`,
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'editorial',
      email: SITE_CONTACT_EMAIL,
      url: `${SITE_URL}/contact/`,
    },
  };
}

/**
 * Entidad colectiva del equipo editorial — autor/revisor único en todo el sitio
 * en lugar de una persona. Sub-organización de la organización matriz, con áreas
 * de especialización explícitas.
 */
export function buildEditorialDesk(): Record<string, unknown> {
  return {
    '@type': 'Organization',
    '@id': EDITORIAL_DESK.id,
    name: EDITORIAL_DESK.name,
    url: EDITORIAL_DESK.url,
    description: EDITORIAL_DESK.description,
    knowsAbout: EDITORIAL_DESK.knowsAbout,
    parentOrganization: { '@id': `${SITE_URL}/#organization` },
  };
}

export function buildBreadcrumb(
  items: { name: string; path: string }[]
): Record<string, unknown> {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem',
      position: i + 1,
      name: it.name,
      item: `${SITE_URL}${it.path}`,
    })),
  };
}

const YMYL_CATEGORIES = ['finance', 'tax', 'health', 'labor'] as const;

export function buildCalculatorJsonLd(meta: CalculatorMeta): JsonLdGraph {
  const path = `/c/${meta.slug}/`;
  const url = `${SITE_URL}${path}`;
  const isYmyl = (YMYL_CATEGORIES as readonly string[]).includes(meta.category);

  const reviewedAt = meta.reviewedAt ?? meta.updatedAt;

  const webApplication: Record<string, unknown> = {
    '@type': 'WebApplication',
    '@id': `${url}#app`,
    name: meta.title,
    description: meta.description,
    url,
    applicationCategory: meta.applicationCategory,
    operatingSystem: 'All',
    browserRequirements: 'Requires JavaScript. Requires HTML5.',
    inLanguage: SITE_LANG,
    isAccessibleForFree: true,
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: SITE_CURRENCY,
    },
    publisher: { '@id': `${SITE_URL}/#organization` },
    // La redacción y el mantenimiento se atribuyen al equipo editorial en todas las páginas.
    author: { '@id': EDITORIAL_DESK.id },
    maintainer: { '@id': EDITORIAL_DESK.id },
    datePublished: meta.publishedAt,
    dateModified: reviewedAt,
  };

  // En temas YMYL añadimos un revisor explícito y la fecha de última revisión.
  if (isYmyl) {
    webApplication.reviewedBy = { '@id': EDITORIAL_DESK.id };
    webApplication.lastReviewed = reviewedAt;
  }

  const faqPage = meta.faqs.length
    ? {
        '@type': 'FAQPage',
        '@id': `${url}#faq`,
        mainEntity: meta.faqs.map((f) => ({
          '@type': 'Question',
          name: f.q,
          acceptedAnswer: { '@type': 'Answer', text: f.a },
        })),
      }
    : null;

  const breadcrumb = buildBreadcrumb([
    { name: 'Início', path: '/' },
    { name: meta.title, path },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(),
      buildEditorialDesk(),
      webApplication,
      breadcrumb,
      ...(faqPage ? [faqPage] : []),
    ],
  };
}

function absoluteUrl(href: string): string {
  if (/^https?:\/\//.test(href)) return href;
  return `${SITE_URL}${href.startsWith('/') ? href : `/${href}`}`;
}

export function buildPostJsonLd(meta: PostMeta): JsonLdGraph {
  const path = `/blog/${meta.slug}/`;
  const url = `${SITE_URL}${path}`;
  const author = meta.author ?? DEFAULT_POST_AUTHOR;
  const reviewedAt = meta.reviewedAt ?? meta.updatedAt;
  // El autor por defecto es el equipo editorial (Organization). Se referencia por
  // @id para que se una con buildEditorialDesk() en el mismo @graph.
  const authorIsDesk = absoluteUrl(author.url) === EDITORIAL_DESK.id;

  const article: Record<string, unknown> = {
    '@type': 'Article',
    '@id': `${url}#article`,
    headline: meta.title,
    description: meta.description,
    url,
    inLanguage: SITE_LANG,
    datePublished: meta.publishedAt,
    dateModified: reviewedAt,
    author: authorIsDesk
      ? { '@id': EDITORIAL_DESK.id }
      : { '@type': 'Person', name: author.name, url: absoluteUrl(author.url) },
    publisher: { '@id': `${SITE_URL}/#organization` },
    mainEntityOfPage: url,
  };

  if (meta.reviewedBy) {
    article.reviewedBy = {
      '@type': 'Person',
      name: meta.reviewedBy.name,
      url: absoluteUrl(meta.reviewedBy.url),
    };
  }

  const breadcrumb = buildBreadcrumb([
    { name: 'Início', path: '/' },
    { name: 'Guias', path: '/blog/' },
    { name: meta.title, path },
  ]);

  return {
    '@context': 'https://schema.org',
    '@graph': [
      buildOrganization(),
      buildEditorialDesk(),
      article,
      breadcrumb,
    ],
  };
}

export function jsonLdScriptProps(data: unknown) {
  return {
    type: 'application/ld+json' as const,
    dangerouslySetInnerHTML: { __html: JSON.stringify(data) },
  };
}
