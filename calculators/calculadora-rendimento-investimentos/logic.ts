// Calculadora de Rendimentos (CDB e Poupança).
//
// Combina a matemática de juros compostos com aportes e as regras de
// tributação da renda fixa no Brasil. As TAXAS de mercado (CDB / Tesouro)
// são INPUT do usuário — esta calculadora não busca taxas externas.
//
// Montante com aportes mensais (capitalização composta):
//   M = C × (1 + i)^n + A × [ ((1 + i)^n − 1) / i ]   (quando i = 0: M = C + A × n)
//   C = valorInicial, A = aporteMensal, i = taxa mensal (decimal), n = meses
//
// Taxa mensal equivalente à anual (CDB/Tesouro), por capitalização composta:
//   i_mensal = (1 + taxaAnual/100)^(1/12) − 1
//   (não se divide a taxa anual por 12 — seria aproximação incorreta)
//
// Poupança: rendimento ≈ 0,5% ao mês (+ TR) quando a Selic está acima de
//   8,5% a.a. (cenário atual). Usamos 0,5% a.m. fixo; a TR é um adicional
//   não incluído nesta simulação.
//
// Imposto de Renda (IR) regressivo sobre renda fixa — Lei 11.033/2004,
// alíquotas fixas, incidindo SÓ sobre o rendimento (lucro), no resgate:
//   até 180 dias ............ 22,5%
//   de 181 a 360 dias ....... 20%
//   de 361 a 720 dias ....... 17,5%
//   acima de 720 dias ....... 15%
//   Fonte: https://www.planalto.gov.br/ccivil_03/_ato2004-2006/2004/lei/l11.033.htm
// A poupança é ISENTA de IR.
//
// IOF nos primeiros 30 dias (resgates muito curtos) NÃO é calculado aqui.

/** Taxa mensal da poupança no regime atual (Selic > 8,5% a.a.): 0,5% a.m. */
const POUPANCA_TAXA_MENSAL = 0.005;

/** Dias por mês usados para enquadrar a faixa do IR regressivo. */
const DIAS_POR_MES = 30;

export type TipoInvestimento = 'poupanca' | 'cdb_tesouro';

export type Input = {
  /** Valor aplicado no início. Padrão: 0. */
  valorInicial?: number;
  /** Depósito feito a cada mês. Padrão: 0. */
  aporteMensal?: number;
  /** Prazo em meses. */
  meses: number;
  /** Tipo de aplicação. Padrão: 'cdb_tesouro'. */
  tipo?: TipoInvestimento;
  /** Taxa anual (% a.a.) do CDB/Tesouro. Usada só quando tipo = 'cdb_tesouro'. */
  taxaAnual?: number;
};

export type Output = {
  /** Montante bruto acumulado (antes do IR). */
  montanteBruto: number;
  /** Total efetivamente aportado (inicial + aportes). */
  totalInvestido: number;
  /** Rendimento bruto (montante bruto − total investido). */
  rendimentoBruto: number;
  /** Alíquota de IR aplicada (fração: 0,2 = 20%). */
  aliquotaIR: number;
  /** Imposto de Renda em reais (sobre o rendimento). */
  impostoIR: number;
  /** Rendimento líquido (rendimento bruto − IR). */
  rendimentoLiquido: number;
  /** Montante líquido (total investido + rendimento líquido). */
  montanteLiquido: number;
  /** Prazo em meses usado no cálculo. */
  meses: number;
};

function round2(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

/** Saneia um número não-negativo: NaN/Infinity/negativo -> 0. */
function naoNegativo(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x) || x < 0) return 0;
  return x;
}

/** Alíquota do IR regressivo conforme o prazo em dias (Lei 11.033/2004). */
function aliquotaRegressiva(dias: number): number {
  if (dias <= 180) return 0.225;
  if (dias <= 360) return 0.2;
  if (dias <= 720) return 0.175;
  return 0.15;
}

export function calculate(input: Input): Output {
  const valorInicial = naoNegativo(input.valorInicial);
  const aporteMensal = naoNegativo(input.aporteMensal);
  const meses = Math.floor(naoNegativo(input.meses));
  const tipo: TipoInvestimento =
    input.tipo === 'poupanca' ? 'poupanca' : 'cdb_tesouro';

  // Taxa mensal efetiva.
  let iMensal: number;
  if (tipo === 'poupanca') {
    iMensal = POUPANCA_TAXA_MENSAL;
  } else {
    const taxaAnual = naoNegativo(input.taxaAnual);
    iMensal = Math.pow(1 + taxaAnual / 100, 1 / 12) - 1;
  }

  const totalInvestido = valorInicial + aporteMensal * meses;

  // Montante bruto.
  let montanteBruto: number;
  if (meses <= 0) {
    montanteBruto = valorInicial;
  } else if (iMensal === 0) {
    montanteBruto = valorInicial + aporteMensal * meses;
  } else {
    const fator = Math.pow(1 + iMensal, meses);
    montanteBruto = valorInicial * fator + aporteMensal * ((fator - 1) / iMensal);
  }

  const rendimentoBruto = montanteBruto - totalInvestido;

  // Imposto de Renda: poupança é isenta; renda fixa segue a tabela regressiva
  // e incide só sobre o rendimento positivo.
  let aliquotaIR = 0;
  let impostoIR = 0;
  if (tipo === 'cdb_tesouro' && rendimentoBruto > 0) {
    const dias = meses * DIAS_POR_MES;
    aliquotaIR = aliquotaRegressiva(dias);
    impostoIR = rendimentoBruto * aliquotaIR;
  }

  const rendimentoLiquido = rendimentoBruto - impostoIR;
  const montanteLiquido = totalInvestido + rendimentoLiquido;

  return {
    montanteBruto: round2(montanteBruto),
    totalInvestido: round2(totalInvestido),
    rendimentoBruto: round2(rendimentoBruto),
    aliquotaIR,
    impostoIR: round2(impostoIR),
    rendimentoLiquido: round2(rendimentoLiquido),
    montanteLiquido: round2(montanteLiquido),
    meses,
  };
}
