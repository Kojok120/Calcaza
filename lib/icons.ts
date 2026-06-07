import {
  Backpack,
  Briefcase,
  Building2,
  Cpu,
  HeartPulse,
  Home,
  Lightbulb,
  Receipt,
  type LucideIcon,
} from 'lucide-react';
import type { CalculatorCategory } from './types';

export const CATEGORY_ICON: Record<CalculatorCategory, LucideIcon> = {
  pet: Home,
  finance: Building2,
  tax: Receipt,
  labor: Briefcase,
  life: Lightbulb,
  family: Backpack,
  tech: Cpu,
  health: HeartPulse,
};

export const CATEGORY_LABEL: Record<CalculatorCategory, string> = {
  pet: 'Moradia e imóveis',
  finance: 'Finanças e financiamento',
  tax: 'Impostos',
  labor: 'Salário e folha',
  life: 'Custo de vida',
  family: 'Família',
  tech: 'Tecnologia e assinaturas',
  health: 'Saúde e planos',
};
