import type { ComponentType } from 'react';
import type { PostMeta } from './types';
import { entry as salarioBrutoVsLiquido2026 } from './salario-bruto-vs-liquido-2026';
import { entry as dasMei2026ValorMensal } from './das-mei-2026-valor-mensal';
import { entry as comoCalcularFgts } from './como-calcular-fgts';
import { entry as adicionalNoturno2026 } from './adicional-noturno-2026';
import { entry as salarioLiquido2026ComoCalcular } from './salario-liquido-2026-como-calcular';
import { entry as rendimentoPoupanca2026 } from './rendimento-poupanca-2026';
import { entry as parcelamentoCetJurosCompostos } from './parcelamento-cet-juros-compostos';

export type PostEntry = {
  meta: PostMeta;
  Content: ComponentType;
};

export const postEntries: PostEntry[] = [
  salarioBrutoVsLiquido2026,
  dasMei2026ValorMensal,
  comoCalcularFgts,
  adicionalNoturno2026,
  salarioLiquido2026ComoCalcular,
  rendimentoPoupanca2026,
  parcelamentoCetJurosCompostos,
];

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
