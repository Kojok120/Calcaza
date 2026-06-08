import type { ComponentType } from 'react';
import type { CalculatorMeta } from '@/lib/types';
// Salário e folha (labor)
import { entry as calculadoraSalarioLiquido } from './calculadora-salario-liquido';
import { entry as calculadoraRescisao } from './calculadora-rescisao';
import { entry as calculadoraDecimoTerceiro } from './calculadora-decimo-terceiro';
import { entry as calculadoraFerias } from './calculadora-ferias';
import { entry as calculadoraHorasExtras } from './calculadora-horas-extras';
import { entry as calculadoraAvisoPrevio } from './calculadora-aviso-previo';
import { entry as calculadoraFgts } from './calculadora-fgts';
import { entry as calculadoraSeguroDesemprego } from './calculadora-seguro-desemprego';
import { entry as calculadoraValeTransporte } from './calculadora-vale-transporte';
import { entry as calculadoraAdicionalNoturno } from './calculadora-adicional-noturno';
import { entry as calculadoraConversorCltPj } from './calculadora-conversor-clt-pj';
// Impostos (tax)
import { entry as calculadoraInss } from './calculadora-inss';
import { entry as calculadoraIrrf } from './calculadora-irrf';
import { entry as calculadoraMeiDas } from './calculadora-mei-das';
import { entry as calculadoraSimplesNacional } from './calculadora-simples-nacional';
// Finanças (finance)
import { entry as calculadoraJurosCompostos } from './calculadora-juros-compostos';
import { entry as calculadoraFinanciamentoImovel } from './calculadora-financiamento-imovel';
import { entry as calculadoraRendimentoInvestimentos } from './calculadora-rendimento-investimentos';
import { entry as calculadoraReajusteAluguel } from './calculadora-reajuste-aluguel';
import { entry as calculadoraMargemDeLucro } from './calculadora-margem-de-lucro';

export type CalculatorEntry = {
  meta: CalculatorMeta;
  Form: ComponentType;
  Content: ComponentType;
  lede?: string;
};

export const calculatorEntries: CalculatorEntry[] = [
  // Salário e folha
  calculadoraSalarioLiquido,
  calculadoraRescisao,
  calculadoraDecimoTerceiro,
  calculadoraFerias,
  calculadoraHorasExtras,
  calculadoraAvisoPrevio,
  calculadoraFgts,
  calculadoraSeguroDesemprego,
  calculadoraValeTransporte,
  calculadoraAdicionalNoturno,
  calculadoraConversorCltPj,
  // Impostos
  calculadoraInss,
  calculadoraIrrf,
  calculadoraMeiDas,
  calculadoraSimplesNacional,
  // Finanças
  calculadoraJurosCompostos,
  calculadoraFinanciamentoImovel,
  calculadoraRendimentoInvestimentos,
  calculadoraReajusteAluguel,
  calculadoraMargemDeLucro,
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
