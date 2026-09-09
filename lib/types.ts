export type CalculatorCategory =
  | 'pet'
  | 'finance'
  | 'tax'
  | 'labor'
  | 'life'
  | 'family'
  | 'tech'
  | 'health';

export type SchemaApplicationCategory =
  | 'FinanceApplication'
  | 'HealthApplication'
  | 'LifestyleApplication'
  | 'BusinessApplication'
  | 'UtilitiesApplication';

export type Faq = { q: string; a: string };

export type CalculatorMeta = {
  slug: string;
  title: string;
  description: string;
  primaryKw: string;
  relatedKws: string[];
  category: CalculatorCategory;
  applicationCategory: SchemaApplicationCategory;
  publishedAt: string; // ISO date
  updatedAt: string; // ISO date
  /** Última verificación editorial (default = updatedAt). */
  reviewedAt?: string; // ISO date
  faqs: Faq[];
  affiliates: string[];
  /**
   * 文脈が近い計算機の slug（同じ国・同じ制度など）。関連計算機枠の先頭に出る。
   * 相互参照になるので、新しいページは自分から既存の強いページを挙げるだけで
   * よい（lib/related.ts）。
   */
  related?: string[];
};
