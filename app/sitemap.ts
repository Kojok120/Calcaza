import type { MetadataRoute } from 'next';
import { calculators } from '@/calculators/registry';
import { posts } from '@/posts/registry';
import { SITE_URL } from '@/lib/site';

export const dynamic = 'force-static';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: 'weekly', priority: 1 },
    { url: `${SITE_URL}/about/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/methodology/`, changeFrequency: 'yearly', priority: 0.4 },
    { url: `${SITE_URL}/privacy/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/disclaimer/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/contact/`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE_URL}/blog/`, changeFrequency: 'weekly', priority: 0.6 },
  ];

  const calcEntries: MetadataRoute.Sitemap = calculators.map((c) => ({
    url: `${SITE_URL}/c/${c.slug}/`,
    lastModified: c.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.8,
  }));

  const postEntries: MetadataRoute.Sitemap = posts.map((p) => ({
    url: `${SITE_URL}/blog/${p.slug}/`,
    lastModified: p.updatedAt,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [...staticEntries, ...calcEntries, ...postEntries];
}
