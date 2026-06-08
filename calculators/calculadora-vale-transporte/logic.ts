// Calculadora de Vale-Transporte (desconto na folha e parte paga pela empresa).
// Regra do desconto (estável, sem reajuste anual):
//   - O empregador pode descontar do empregado no MÁXIMO 6% do salário básico a título
//     de vale-transporte. Esse percentual é um TETO, não um valor fixo.
//   - O desconto nunca pode ser maior que o custo real do transporte. Se o custo real
//     for menor que 6% do salário, o desconto fica limitado ao custo real.
//   - Quando o custo real excede os 6%, o EMPREGADOR arca com a diferença.
// Fontes oficiais:
//   - Lei nº 7.418/1985 (institui o vale-transporte):
//     planalto.gov.br/ccivil_03/leis/l7418.htm
//   - Decreto nº 95.247/1987 (regulamenta a Lei 7.418/1985; art. 9º, I — desconto de até 6%):
//     planalto.gov.br/ccivil_03/decreto/d95247.htm
//   - Ministério do Trabalho e Emprego (vale-transporte):
//     gov.br/trabalho-e-emprego

// Percentual máximo de desconto sobre o salário básico (art. 9º, I, do Decreto 95.247/1987).
const PERCENTUAL_MAXIMO_DESCONTO = 0.06; // 6%

// Dias trabalhados no mês usados como padrão quando não informado.
const DIAS_PADRAO = 22;

export type Input = {
  /** Salário básico mensal (salário-base contratual), em reais. */
  salarioBruto: number;
  /** Gasto com transporte por dia (ida e volta), em reais. */
  custoDiarioTransporte: number;
  /** Dias trabalhados no mês. Padrão: 22. */
  diasTrabalhados?: number;
};

export type Output = {
  /** Custo mensal total do transporte (custo diário × dias trabalhados). */
  custoMensalTransporte: number;
  /** Desconto máximo permitido: 6% do salário básico. */
  descontoMaximo: number;
  /** Desconto efetivo do empregado: o menor entre o desconto máximo e o custo mensal. */
  descontoEmpregado: number;
  /** Parte paga pela empresa: o que sobra do custo mensal acima do desconto do empregado. */
  custoEmpregador: number;
};

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

/** Sanitiza um número de entrada: NaN/negativo/infinito -> 0. */
function sanitize(value: number | undefined): number {
  if (value === undefined || !Number.isFinite(value) || value < 0) return 0;
  return value;
}

export function calculate(input: Input): Output {
  const salarioBruto = sanitize(input.salarioBruto);
  const custoDiarioTransporte = sanitize(input.custoDiarioTransporte);

  // Dias trabalhados: padrão 22; valores inválidos caem no padrão; nunca negativo.
  let diasTrabalhados =
    input.diasTrabalhados === undefined || !Number.isFinite(input.diasTrabalhados)
      ? DIAS_PADRAO
      : input.diasTrabalhados;
  if (diasTrabalhados < 0) diasTrabalhados = 0;

  // Custo mensal do transporte.
  const custoMensalTransporte = round2(custoDiarioTransporte * diasTrabalhados);

  // Desconto máximo permitido: 6% do salário básico.
  const descontoMaximo = round2(salarioBruto * PERCENTUAL_MAXIMO_DESCONTO);

  // Desconto do empregado: limitado ao custo real do transporte.
  const descontoEmpregado = round2(Math.min(descontoMaximo, custoMensalTransporte));

  // Parte paga pela empresa: nunca negativa.
  const custoEmpregador = round2(Math.max(0, custoMensalTransporte - descontoEmpregado));

  return {
    custoMensalTransporte,
    descontoMaximo,
    descontoEmpregado,
    custoEmpregador,
  };
}
