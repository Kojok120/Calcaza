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
};
