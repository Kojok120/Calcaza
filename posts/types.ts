export type PostCategory =
  | 'finance'
  | 'tax'
  | 'pet'
  | 'life'
  | 'family'
  | 'tech'
  | 'health'
  | 'labor';

export type PostAuthor = {
  name: string;
  url: string;
};

export type PostReviewer = {
  name: string;
  url: string;
  date: string; // ISO YYYY-MM-DD
};

export type PostMeta = {
  slug: string;
  title: string;
  description: string;
  category: PostCategory;
  publishedAt: string;
  updatedAt: string;
  /** Última verificação editorial (default = updatedAt se não especificado). */
  reviewedAt?: string;
  /** Autor do artigo. Por padrão, a equipe editorial se não especificado. */
  author?: PostAuthor;
  /** Revisor opcional (contador, advogado, etc.) para reforçar E-E-A-T. */
  reviewedBy?: PostReviewer;
  /** Slugs de calculadoras relacionadas. Linkadas ao final do artigo. */
  relatedCalcSlugs: string[];
  /** Resumo breve para a lista do índice (1-2 frases em pt-BR). */
  excerpt: string;
  /** Tempo estimado de leitura em minutos (aprox. 1.000 caracteres = 1 min). */
  readingMinutes: number;
};

export const DEFAULT_POST_AUTHOR: PostAuthor = {
  name: 'Equipe Editorial da Calcaza',
  url: '/about/#editorial-desk',
};
