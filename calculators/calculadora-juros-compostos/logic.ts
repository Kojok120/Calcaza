// Calculadora de Juros Compostos.
// Cálculo puramente matemático (sem dados externos, taxas oficiais ou impostos).
//
// Fórmula do montante com aportes periódicos (capitalização composta):
//   M = C × (1 + i)^n + A × [ ((1 + i)^n − 1) / i ]
//   (quando i = 0:  M = C + A × n)
// onde:
//   C = valorInicial (aporte inicial)
//   A = aporteMensal (depósito a cada período mensal)
//   i = taxa de juros por período (mensal, em decimal)
//   n = número de períodos (em meses)
//
// Normalização para base MENSAL:
//   - Taxa anual -> mensal equivalente por capitalização composta:
//       i_mensal = (1 + taxa_anual)^(1/12) − 1
//     (NÃO se divide a taxa anual por 12 — isso seria uma aproximação incorreta.)
//   - Período em anos -> meses:  n = periodo × 12
//
// Esta calculadora retorna o valor NOMINAL bruto. Não considera Imposto de Renda,
// IOF, taxas de administração nem inflação.

export type TipoTaxa = 'mensal' | 'anual';
export type TipoPeriodo = 'meses' | 'anos';

export type Input = {
  /** Aporte inicial (capital aplicado no início). Padrão: 0. */
  valorInicial?: number;
  /** Aporte feito a cada mês. Padrão: 0. */
  aporteMensal?: number;
  /** Taxa de juros (%) por período, conforme tipoTaxa. */
  taxaJuros: number;
  /** Número de períodos, conforme tipoPeriodo. */
  periodo: number;
  /** A taxa informada é mensal ou anual? Padrão: 'mensal'. */
  tipoTaxa?: TipoTaxa;
  /** O período informado está em meses ou anos? Padrão: 'meses'. */
  tipoPeriodo?: TipoPeriodo;
};

export type Output = {
  /** Montante final (valor acumulado ao fim do prazo). */
  montanteFinal: number;
  /** Total efetivamente aportado (inicial + aportes mensais). */
  totalInvestido: number;
  /** Total ganho em juros (montante − total investido). */
  totalJuros: number;
  /** Taxa mensal efetiva usada no cálculo (fração: 0,01 = 1% a.m.). */
  iMensalEfetiva: number;
  /** Número de períodos mensais usados no cálculo. */
  meses: number;
};

function round2(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

/** Saneia um número não-negativo: NaN/Infinity -> 0, negativos -> 0. */
function naoNegativo(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x) || x < 0) return 0;
  return x;
}

export function calculate(input: Input): Output {
  const valorInicial = naoNegativo(input.valorInicial);
  const aporteMensal = naoNegativo(input.aporteMensal);

  const tipoTaxa: TipoTaxa = input.tipoTaxa === 'anual' ? 'anual' : 'mensal';
  const tipoPeriodo: TipoPeriodo =
    input.tipoPeriodo === 'anos' ? 'anos' : 'meses';

  // Taxa em decimal (não-negativa). Taxa inválida -> 0.
  const taxaPct = naoNegativo(input.taxaJuros);
  const taxaDecimal = taxaPct / 100;

  // Normaliza a taxa para base mensal.
  let iMensal: number;
  if (tipoTaxa === 'anual') {
    iMensal = Math.pow(1 + taxaDecimal, 1 / 12) - 1;
  } else {
    iMensal = taxaDecimal;
  }

  // Normaliza o período para meses (inteiro, não-negativo).
  let periodoRaw = naoNegativo(input.periodo);
  periodoRaw = Math.floor(periodoRaw);
  const meses = tipoPeriodo === 'anos' ? periodoRaw * 12 : periodoRaw;

  // Períodos zerados: o montante é apenas o aporte inicial.
  if (meses <= 0) {
    return {
      montanteFinal: round2(valorInicial),
      totalInvestido: round2(valorInicial),
      totalJuros: 0,
      iMensalEfetiva: round2(iMensal * 10000) / 10000,
      meses: 0,
    };
  }

  // Montante.
  let montante: number;
  if (iMensal === 0) {
    montante = valorInicial + aporteMensal * meses;
  } else {
    const fator = Math.pow(1 + iMensal, meses);
    montante = valorInicial * fator + aporteMensal * ((fator - 1) / iMensal);
  }

  const totalInvestido = valorInicial + aporteMensal * meses;
  const totalJuros = montante - totalInvestido;

  return {
    montanteFinal: round2(montante),
    totalInvestido: round2(totalInvestido),
    totalJuros: round2(totalJuros),
    // Taxa mensal efetiva arredondada a 4 casas (fração).
    iMensalEfetiva: round2(iMensal * 10000) / 10000,
    meses,
  };
}
