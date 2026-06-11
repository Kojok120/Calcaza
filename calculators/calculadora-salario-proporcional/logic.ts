// Calculadora de Salário Proporcional (dias trabalhados no mês).
// Útil quando a admissão ou a demissão acontece no meio do mês:
// paga-se apenas os dias efetivamente trabalhados.
//
// Base de cálculo (prática trabalhista):
//   - Convenção dos 30 dias: a CLT e a prática de folha consideram o mês
//     comercial de 30 dias para o salário mensal (art. 64 da CLT — divisor 30).
//     CLT (Decreto-Lei nº 5.452/1943): planalto.gov.br/ccivil_03/decreto-lei/del5452.htm
//   - Alternativa por dias corridos do mês (28 a 31), usada por alguns
//     empregadores. Orientações de admissão/demissão no mês:
//     gov.br/trabalho-e-emprego (Ministério do Trabalho e Emprego).
//
// Esta calculadora apura apenas o salário-base proporcional. INSS, IRRF e FGTS
// incidem sobre o valor proporcional efetivamente pago, e o avo de férias/13º
// considera o mês com 15 ou mais dias trabalhados (regra dos 15 dias).

export type BaseDias = '30' | 'mes';

export type Input = {
  /** Salário mensal cheio em reais (>= 0). */
  salarioMensal: number;
  /** Dias trabalhados/contados no mês (inteiro >= 0). */
  diasTrabalhados: number;
  /** Base de divisão: '30' (padrão CLT) ou 'mes' (dias corridos do mês). */
  baseDias?: BaseDias;
  /** Quantidade de dias do mês quando baseDias = 'mes' (28 a 31). Padrão: 30. */
  baseDiasMes?: number;
};

export type Output = {
  /** Salário-base proporcional aos dias trabalhados. */
  salarioProporcional: number;
  /** Valor de um dia de trabalho (salário ÷ base). */
  valorDia: number;
  /** Dias efetivamente considerados (já saneado e limitado à base). */
  diasTrabalhados: number;
  /** Base de dias usada na divisão (30 ou dias do mês). */
  base: number;
  /** Rótulo da fração trabalhada, ex.: "10/30". */
  fracaoLabel: string;
};

const MIN_DIAS_MES = 28;
const MAX_DIAS_MES = 31;
const BASE_PADRAO_CLT = 30;

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

export function calculate(input: Input): Output {
  // Salário saneado: nunca negativo nem NaN.
  const salarioMensal =
    Number.isFinite(input.salarioMensal) && input.salarioMensal > 0
      ? input.salarioMensal
      : 0;

  // Define a base de dias.
  let base: number;
  if (input.baseDias === 'mes') {
    const diasMesRaw = Number.isFinite(input.baseDiasMes)
      ? Math.floor(input.baseDiasMes as number)
      : BASE_PADRAO_CLT;
    base = clamp(diasMesRaw, MIN_DIAS_MES, MAX_DIAS_MES);
  } else {
    base = BASE_PADRAO_CLT;
  }

  // Dias trabalhados: inteiro, entre 0 e a base.
  const diasRaw = Number.isFinite(input.diasTrabalhados)
    ? Math.floor(input.diasTrabalhados)
    : 0;
  const diasTrabalhados = clamp(diasRaw, 0, base);

  // Guard: salário inválido -> tudo zero (mas mantém base e fração).
  if (salarioMensal <= 0 || base <= 0) {
    return {
      salarioProporcional: 0,
      valorDia: 0,
      diasTrabalhados,
      base,
      fracaoLabel: `${diasTrabalhados}/${base}`,
    };
  }

  const valorDia = salarioMensal / base;
  const salarioProporcional = round2(valorDia * diasTrabalhados);

  return {
    salarioProporcional,
    valorDia: round2(valorDia),
    diasTrabalhados,
    base,
    fracaoLabel: `${diasTrabalhados}/${base}`,
  };
}
