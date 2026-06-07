import type { ComponentType } from 'react';
import type { CalculatorMeta } from '@/lib/types';
import { entry as calculadoraSalarioLiquido } from './calculadora-salario-liquido';
import { entry as calculadoraRescisao } from './calculadora-rescisao';
import { entry as calculadoraDecimoTerceiro } from './calculadora-decimo-terceiro';
import { entry as calculadoraFerias } from './calculadora-ferias';
import { entry as calculadoraHorasExtras } from './calculadora-horas-extras';
import { entry as calculadoraAvisoPrevio } from './calculadora-aviso-previo';
import { entry as calculadoraFgts } from './calculadora-fgts';
import { entry as calculadoraSeguroDesemprego } from './calculadora-seguro-desemprego';
import { entry as calculadoraInss } from './calculadora-inss';
import { entry as calculadoraIrrf } from './calculadora-irrf';
import { entry as calculadoraMeiDas } from './calculadora-mei-das';

export type CalculatorEntry = {
  meta: CalculatorMeta;
  Form: ComponentType;
  Content: ComponentType;
  lede?: string;
};

export const calculatorEntries: CalculatorEntry[] = [
  calculadoraSalarioLiquido,
  calculadoraRescisao,
  calculadoraDecimoTerceiro,
  calculadoraFerias,
  calculadoraHorasExtras,
  calculadoraAvisoPrevio,
  calculadoraFgts,
  calculadoraSeguroDesemprego,
  calculadoraInss,
  calculadoraIrrf,
  calculadoraMeiDas,
];

export const calculators: CalculatorMeta[] = calculatorEntries.map((e) => e.meta);

export function getEntry(slug: string): CalculatorEntry | undefined {
  return calculatorEntries.find((e) => e.meta.slug === slug);
}

export function getCalculator(slug: string): CalculatorMeta | undefined {
  return getEntry(slug)?.meta;
}

export function getAllSlugs(): string[] {
  return calculatorEntries.map((e) => e.meta.slug);
}
