import type { ComponentType } from 'react';
import type { PostMeta } from './types';
import { entry as salarioBrutoVsLiquido2026 } from './salario-bruto-vs-liquido-2026';

export type PostEntry = {
  meta: PostMeta;
  Content: ComponentType;
};

export const postEntries: PostEntry[] = [salarioBrutoVsLiquido2026];

export const posts: PostMeta[] = postEntries.map((e) => e.meta);

export function getPostEntry(slug: string): PostEntry | undefined {
  return postEntries.find((e) => e.meta.slug === slug);
}

export function getPost(slug: string): PostMeta | undefined {
  return getPostEntry(slug)?.meta;
}

export function getAllPostSlugs(): string[] {
  return postEntries.map((e) => e.meta.slug);
}
