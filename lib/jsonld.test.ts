import { describe, it, expect } from 'vitest';
import {
  buildBreadcrumb,
  buildCalculatorJsonLd,
  buildOrganization,
  buildPostJsonLd,
  jsonLdScriptProps,
} from './jsonld';
import type { CalculatorMeta } from './types';
import type { PostMeta } from '@/posts/types';

const baseMeta: CalculatorMeta = {
  slug: 'sample-calc',
  title: 'Sample Calculator',
  description: 'A sample calculator description for testing.',
  primaryKw: 'sample calculator',
  relatedKws: ['sample keyword'],
  category: 'life',
  applicationCategory: 'LifestyleApplication',
  publishedAt: '2026-01-01',
  updatedAt: '2026-04-01',
  faqs: [
    { q: 'Q1?', a: 'A1.' },
    { q: 'Q2?', a: 'A2.' },
  ],
  affiliates: [],
};

function findByType<T = Record<string, unknown>>(
  graph: Record<string, unknown>[],
  type: string
): T | undefined {
  return graph.find((node) => node['@type'] === type) as T | undefined;
}

describe('buildOrganization', () => {
  it('returns Organization with @id and url', () => {
    const org = buildOrganization();
    expect(org['@type']).toBe('Organization');
    expect(typeof org['@id']).toBe('string');
    expect(typeof org.url).toBe('string');
  });
});

describe('buildBreadcrumb', () => {
  it('produces ordered ListItems with absolute URLs', () => {
    const bc = buildBreadcrumb([
      { name: 'Home', path: '/' },
      { name: 'Calculator', path: '/c/sample/' },
    ]);
    expect(bc['@type']).toBe('BreadcrumbList');
    const items = bc.itemListElement as Array<Record<string, unknown>>;
    expect(items).toHaveLength(2);
    expect(items[0].position).toBe(1);
    expect(items[1].position).toBe(2);
    expect(String(items[1].item)).toMatch(/\/c\/sample\/$/);
  });
});

describe('buildCalculatorJsonLd', () => {
  it('produces a @graph containing WebApplication, BreadcrumbList, FAQPage, Organization', () => {
    const ld = buildCalculatorJsonLd(baseMeta);
    expect(ld['@context']).toBe('https://schema.org');
    const graph = ld['@graph'];
    expect(findByType(graph, 'Organization')).toBeDefined();
    expect(findByType(graph, 'WebApplication')).toBeDefined();
    expect(findByType(graph, 'BreadcrumbList')).toBeDefined();
    expect(findByType(graph, 'FAQPage')).toBeDefined();
  });

  it('omits FAQPage when faqs is empty', () => {
    const ld = buildCalculatorJsonLd({ ...baseMeta, faqs: [] });
    expect(findByType(ld['@graph'], 'FAQPage')).toBeUndefined();
  });

  it('embeds slug into URL identifiers', () => {
    const ld = buildCalculatorJsonLd(baseMeta);
    const app = findByType<Record<string, unknown>>(ld['@graph'], 'WebApplication');
    expect(String(app?.url)).toMatch(/\/c\/sample-calc\/$/);
    expect(String(app?.['@id'])).toMatch(/#app$/);
  });

  it('marks the application as free in the configured currency', () => {
    const ld = buildCalculatorJsonLd(baseMeta);
    const app = findByType<Record<string, unknown>>(ld['@graph'], 'WebApplication');
    expect(app?.isAccessibleForFree).toBe(true);
    const offers = app?.offers as Record<string, unknown>;
    expect(offers.price).toBe('0');
    expect(offers.priceCurrency).toBe('BRL');
  });

  it('declares Portuguese as inLanguage on the WebApplication', () => {
    const ld = buildCalculatorJsonLd(baseMeta);
    const app = findByType<Record<string, unknown>>(ld['@graph'], 'WebApplication');
    expect(app?.inLanguage).toBe('pt-BR');
  });

  it('uses meta dates for datePublished/dateModified', () => {
    const ld = buildCalculatorJsonLd(baseMeta);
    const app = findByType<Record<string, unknown>>(ld['@graph'], 'WebApplication');
    expect(app?.datePublished).toBe('2026-01-01');
    expect(app?.dateModified).toBe('2026-04-01');
  });

  it('FAQPage mainEntity mirrors meta.faqs in order', () => {
    const ld = buildCalculatorJsonLd(baseMeta);
    const faq = findByType<Record<string, unknown>>(ld['@graph'], 'FAQPage');
    const entities = faq?.mainEntity as Array<Record<string, unknown>>;
    expect(entities).toHaveLength(2);
    expect(entities[0].name).toBe('Q1?');
    const answer0 = entities[0].acceptedAnswer as Record<string, unknown>;
    expect(answer0.text).toBe('A1.');
  });

  it('includes the editorial-desk entity for author attribution', () => {
    const ld = buildCalculatorJsonLd(baseMeta);
    const desk = ld['@graph'].find((n) =>
      String(n['@id']).endsWith('#editorial-desk')
    );
    expect(desk).toBeDefined();
    expect(desk?.['@type']).toBe('Organization');
    expect(Array.isArray(desk?.knowsAbout)).toBe(true);
  });

  it('attaches editorial-desk author to every WebApplication', () => {
    const nonYmylLd = buildCalculatorJsonLd(baseMeta);
    const nonYmylApp = findByType<Record<string, unknown>>(nonYmylLd['@graph'], 'WebApplication');
    expect(nonYmylApp?.author).toEqual({ '@id': expect.stringMatching(/#editorial-desk$/) });
    expect(nonYmylApp?.reviewedBy).toBeUndefined();
  });

  it('adds reviewedBy + lastReviewed on YMYL WebApplications', () => {
    const ymylLd = buildCalculatorJsonLd({ ...baseMeta, category: 'finance' });
    const ymylApp = findByType<Record<string, unknown>>(ymylLd['@graph'], 'WebApplication');
    expect(ymylApp?.reviewedBy).toEqual({ '@id': expect.stringMatching(/#editorial-desk$/) });
    expect(ymylApp?.lastReviewed).toBe('2026-04-01');
  });

  it('uses reviewedAt for dateModified when provided', () => {
    const ld = buildCalculatorJsonLd({ ...baseMeta, reviewedAt: '2026-05-07' });
    const app = findByType<Record<string, unknown>>(ld['@graph'], 'WebApplication');
    expect(app?.dateModified).toBe('2026-05-07');
  });

  it('falls back to updatedAt for dateModified when reviewedAt is absent', () => {
    const ld = buildCalculatorJsonLd(baseMeta);
    const app = findByType<Record<string, unknown>>(ld['@graph'], 'WebApplication');
    expect(app?.dateModified).toBe('2026-04-01');
  });
});

const basePostMeta: PostMeta = {
  slug: 'sample-guide',
  title: 'Sample Guide',
  description: 'A sample guide description for testing.',
  category: 'tax',
  publishedAt: '2026-01-01',
  updatedAt: '2026-04-01',
  relatedCalcSlugs: ['sample-calc'],
  excerpt: 'Excerpt here.',
  readingMinutes: 9,
};

describe('buildPostJsonLd', () => {
  it('produces a @graph containing Article, BreadcrumbList, Organization, editorial desk', () => {
    const ld = buildPostJsonLd(basePostMeta);
    expect(ld['@context']).toBe('https://schema.org');
    expect(findByType(ld['@graph'], 'Organization')).toBeDefined();
    expect(findByType(ld['@graph'], 'Article')).toBeDefined();
    expect(findByType(ld['@graph'], 'BreadcrumbList')).toBeDefined();
    expect(
      ld['@graph'].some((n) => String(n['@id']).endsWith('#editorial-desk'))
    ).toBe(true);
  });

  it('uses the editorial-desk author (by @id) when meta.author is omitted', () => {
    const ld = buildPostJsonLd(basePostMeta);
    const article = findByType<Record<string, unknown>>(ld['@graph'], 'Article');
    expect(article?.author).toEqual({
      '@id': expect.stringMatching(/#editorial-desk$/),
    });
  });

  it('honors a custom author when provided in meta', () => {
    const ld = buildPostJsonLd({
      ...basePostMeta,
      author: { name: 'Jane Doe, EA', url: '/about/jane/' },
    });
    const article = findByType<Record<string, unknown>>(ld['@graph'], 'Article');
    const author = article?.author as Record<string, unknown>;
    expect(author.name).toBe('Jane Doe, EA');
    expect(String(author.url)).toMatch(/\/about\/jane\/$/);
  });

  it('uses reviewedAt for dateModified when provided', () => {
    const ld = buildPostJsonLd({ ...basePostMeta, reviewedAt: '2026-05-07' });
    const article = findByType<Record<string, unknown>>(ld['@graph'], 'Article');
    expect(article?.dateModified).toBe('2026-05-07');
  });

  it('falls back to updatedAt for dateModified when reviewedAt is absent', () => {
    const ld = buildPostJsonLd(basePostMeta);
    const article = findByType<Record<string, unknown>>(ld['@graph'], 'Article');
    expect(article?.dateModified).toBe('2026-04-01');
  });

  it('attaches reviewedBy when provided', () => {
    const ld = buildPostJsonLd({
      ...basePostMeta,
      reviewedBy: { name: 'Reviewer CPA', url: '/about/reviewer/', date: '2026-05-07' },
    });
    const article = findByType<Record<string, unknown>>(ld['@graph'], 'Article');
    const reviewedBy = article?.reviewedBy as Record<string, unknown>;
    expect(reviewedBy['@type']).toBe('Person');
    expect(reviewedBy.name).toBe('Reviewer CPA');
  });
});

describe('jsonLdScriptProps', () => {
  it('serializes payload as JSON in dangerouslySetInnerHTML', () => {
    const props = jsonLdScriptProps({ hello: 'world' });
    expect(props.type).toBe('application/ld+json');
    expect(props.dangerouslySetInnerHTML.__html).toBe('{"hello":"world"}');
  });
});
