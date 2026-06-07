// Calculadora de FGTS 2026.
// Regras oficiais:
//   - Depósito mensal de 8% do salário bruto, feito pelo empregador na conta
//     vinculada do trabalhador na Caixa Econômica Federal.
//     Base legal: Lei nº 8.036/1990, art. 15 — planalto.gov.br
//     (https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm)
//   - O jovem aprendiz tem alíquota reduzida de 2% (não tratado por padrão
//     aqui; esta calculadora usa os 8% do contrato CLT comum).
//   - Multa rescisória de 40% sobre o saldo, na demissão sem justa causa, e de
//     20% no acordo (distrato) entre empregado e empregador (art. 18 da Lei
//     8.036/1990 e art. 484-A da CLT) — planalto.gov.br / caixa.gov.br/fgts
//     (https://www.caixa.gov.br/beneficios-trabalhador/fgts)
//
// IMPORTANTE (honestidade YMYL): o rendimento real do FGTS é a TR + 3% ao ano,
// mais a eventual distribuição de lucros do Fundo. Esta projeção é APROXIMADA:
// por padrão considera apenas 3% a.a. (sem a TR e sem distribuição de lucros).
// O valor real costuma ser um pouco maior.

export type Input = {
  /** Salário bruto mensal em reais (base do depósito de 8%). */
  salarioBruto: number;
  /** Quantidade de meses de contribuição a projetar (inteiro >= 0). Padrão: 0. */
  mesesContribuidos?: number;
  /** Saldo já existente na conta do FGTS, em reais. Padrão: 0. */
  saldoAtual?: number;
  /** Rendimento anual aproximado em % a.a. (SEM a TR). Padrão: 3. */
  taxaAnualRendimento?: number;
  /** Se deve calcular as multas rescisórias (40% e 20%). Padrão: false. */
  calcularMulta?: boolean;
};

export type Output = {
  /** Depósito mensal do empregador (8% do salário bruto). */
  depositoMensal: number;
  /** Total efetivamente depositado (saldo inicial + depósitos do período). */
  totalDepositado: number;
  /** Saldo projetado ao fim do período (com juros compostos aproximados). */
  saldoProjetado: number;
  /** Rendimento acumulado no período (saldo projetado − total depositado). */
  rendimentoAcumulado: number;
  /** Multa rescisória de 40% sobre o saldo projetado (sem justa causa). */
  multaRescisoria40: number;
  /** Multa de 20% sobre o saldo projetado (acordo / distrato). */
  multaAcordo20: number;
};

/** Alíquota do depósito do FGTS (8% do salário bruto, Lei 8.036/1990). */
const ALIQUOTA_DEPOSITO = 0.08;
/** Multa rescisória na demissão sem justa causa (40% do saldo). */
const MULTA_SEM_JUSTA_CAUSA = 0.4;
/** Multa no acordo / distrato entre as partes (20% do saldo). */
const MULTA_ACORDO = 0.2;
/** Rendimento anual padrão aproximado (% a.a., sem a TR). */
const TAXA_ANUAL_PADRAO = 3;

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

function sanearNaoNegativo(valor: number | undefined, padrao = 0): number {
  if (valor === undefined || !Number.isFinite(valor) || valor < 0) return padrao;
  return valor;
}

export function calculate(input: Input): Output {
  const salarioBruto = sanearNaoNegativo(input.salarioBruto);

  // Meses: inteiro >= 0.
  const mesesRaw = input.mesesContribuidos;
  const mesesContribuidos =
    Number.isFinite(mesesRaw) && (mesesRaw as number) > 0
      ? Math.floor(mesesRaw as number)
      : 0;

  const saldoAtual = sanearNaoNegativo(input.saldoAtual);

  // Taxa anual: usa o padrão quando ausente/ inválida; permite 0 explícito.
  const taxaRaw = input.taxaAnualRendimento;
  const taxaAnualRendimento =
    Number.isFinite(taxaRaw) && (taxaRaw as number) >= 0
      ? (taxaRaw as number)
      : TAXA_ANUAL_PADRAO;

  const depositoMensal = round2(salarioBruto * ALIQUOTA_DEPOSITO);

  // Projeção composta a partir do saldo atual.
  // i mensal = (taxa anual / 100) / 12. A cada mês: saldo = saldo*(1+i) + depósito.
  const i = taxaAnualRendimento / 100 / 12;
  let saldo = saldoAtual;
  for (let m = 1; m <= mesesContribuidos; m++) {
    saldo = saldo * (1 + i) + depositoMensal;
  }
  const saldoProjetado = round2(saldo);

  const totalDepositado = round2(saldoAtual + depositoMensal * mesesContribuidos);
  const rendimentoAcumulado = round2(saldoProjetado - totalDepositado);

  // As multas são sempre apuradas sobre o saldo projetado; o sinalizador
  // `calcularMulta` controla apenas se a interface as exibe em destaque.
  const multaRescisoria40 = round2(saldoProjetado * MULTA_SEM_JUSTA_CAUSA);
  const multaAcordo20 = round2(saldoProjetado * MULTA_ACORDO);

  return {
    depositoMensal,
    totalDepositado,
    saldoProjetado,
    rendimentoAcumulado,
    multaRescisoria40,
    multaAcordo20,
  };
}
