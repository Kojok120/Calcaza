// Calculadora de Juros do Cartão de Crédito (rotativo / atraso da fatura).
//
// Quando você não paga o valor total da fatura na data de vencimento, o saldo
// não pago entra no "crédito rotativo", que é uma das modalidades de crédito
// mais caras do mercado brasileiro. Os juros do rotativo são COMPOSTOS: a cada
// mês, os juros do mês anterior passam a fazer parte da base sobre a qual novos
// juros incidem ("juros sobre juros").
//
// Fórmula (capitalização composta sobre o saldo devedor):
//   i = taxaJurosMensal / 100            (taxa mensal em decimal)
//   montanteFinal = saldoDevedor × (1 + i)^meses
//   jurosTotal = montanteFinal − saldoDevedor
//   jurosPrimeiroMes = saldoDevedor × i
//   taxaAnualEquivalente = (1 + i)^12 − 1
//
// Esta calculadora produz uma ESTIMATIVA do valor nominal da dívida com base na
// taxa informada. Não inclui IOF, multa por atraso, mora nem outros encargos,
// que variam de banco para banco. A taxa real do rotativo é divulgada pelo
// Banco Central do Brasil (BCB) e muda mês a mês.
//
// Fontes:
//   - Banco Central do Brasil — taxas de juros do crédito rotativo do cartão:
//     https://www.bcb.gov.br/estatisticas/txjuros
//   - Lei 14.690/2023 (limite de juros e encargos do rotativo a partir de 2024):
//     https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2023/lei/l14690.htm

export type Input = {
  /** Saldo devedor: parte da fatura que não foi paga. R$ >= 0. */
  saldoDevedor: number;
  /** Taxa de juros do rotativo ao mês, em %. >= 0. Padrão típico: 14. */
  taxaJurosMensal: number;
  /** Número de meses no rotativo (inteiro de 1 a 24). Padrão: 1. */
  meses: number;
};

export type Output = {
  /** Valor total da dívida ao fim do período (saldo + juros). */
  montanteFinal: number;
  /** Total pago em juros (montante final − saldo devedor). */
  jurosTotal: number;
  /** Juros gerados apenas no primeiro mês de rotativo. */
  jurosPrimeiroMes: number;
  /** Taxa anual equivalente à taxa mensal informada (fração: 1 = 100%). */
  taxaAnualEquivalente: number;
  /** Número de meses efetivamente usados no cálculo. */
  meses: number;
};

const MESES_MIN = 1;
const MESES_MAX = 24;

function round2(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

/** Saneia um número não-negativo: NaN/Infinity -> 0, negativos -> 0. */
function naoNegativo(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x) || x < 0) return 0;
  return x;
}

/** Garante meses inteiro dentro de [MESES_MIN, MESES_MAX]; inválido -> MESES_MIN. */
function sanearMeses(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x)) return MESES_MIN;
  const inteiro = Math.floor(x);
  if (inteiro < MESES_MIN) return MESES_MIN;
  if (inteiro > MESES_MAX) return MESES_MAX;
  return inteiro;
}

export function calculate(input: Input): Output {
  const saldoDevedor = naoNegativo(input.saldoDevedor);

  // Taxa mensal em decimal (não-negativa). Taxa inválida -> 0.
  const taxaPct = naoNegativo(input.taxaJurosMensal);
  const i = taxaPct / 100;

  const meses = sanearMeses(input.meses);

  // Montante composto sobre o saldo devedor.
  const fator = Math.pow(1 + i, meses);
  const montanteFinal = saldoDevedor * fator;
  const jurosTotal = montanteFinal - saldoDevedor;
  const jurosPrimeiroMes = saldoDevedor * i;
  const taxaAnualEquivalente = Math.pow(1 + i, 12) - 1;

  return {
    montanteFinal: round2(montanteFinal),
    jurosTotal: round2(jurosTotal),
    jurosPrimeiroMes: round2(jurosPrimeiroMes),
    // Taxa anual equivalente arredondada a 4 casas (fração).
    taxaAnualEquivalente: Math.round(taxaAnualEquivalente * 10000) / 10000,
    meses,
  };
}
