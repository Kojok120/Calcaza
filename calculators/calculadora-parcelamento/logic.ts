// Calculadora de Parcelamento — "vale a pena parcelar?"
// Descobre os JUROS EMBUTIDOS de uma compra parcelada comparando o preço à vista
// com o total parcelado, e estima a taxa de juros mensal implícita no parcelamento.
//
// Conceito (Banco Central do Brasil — CET / juros embutidos no parcelamento):
//   Mesmo quando a loja anuncia "parcelado sem juros", o preço à vista costuma ter
//   desconto. A diferença entre o total parcelado e o à vista é, na prática, o custo
//   de financiar a compra — ou seja, há juros embutidos. Comparar o à vista com o
//   total parcelado revela esse custo efetivo.
//   Fonte: Banco Central do Brasil — Custo Efetivo Total (CET) e Calculadora do Cidadão.
//   https://www.bcb.gov.br/cidadaniafinanceira/custoefetivototal
//   https://www3.bcb.gov.br/CALCIDADAO/
//
// Modelo da taxa implícita (juros embutidos):
//   Tratamos o à vista (valorAVista) como o "valor presente" do financiamento e cada
//   parcela como pagamento de uma anuidade postecipada (1ª parcela em ~30 dias):
//       valorAVista = valorParcela × [ 1 − (1 + i)^(−n) ] / i
//   Resolvemos i ≥ 0 por BISSECÇÃO no intervalo [0, 5] (0% a 500% a.m.).
//   Casos especiais:
//     - n = 1            -> i = valorParcela / valorAVista − 1 (forma fechada).
//     - totalParcelado ≤ valorAVista -> i = 0 (sem juros embutidos; parcelar é igual
//       ou melhor que o à vista).
//
// Taxa anual equivalente por capitalização composta:  (1 + i)^12 − 1.
//
// Tudo aqui é cálculo determinístico; não há consulta a taxas oficiais em tempo real.

export type Input = {
  /** Preço à vista (ou com desconto à vista), em reais. Deve ser > 0. */
  valorAVista: number;
  /** Valor de cada parcela, em reais. Deve ser > 0. */
  valorParcela: number;
  /** Número de parcelas (inteiro de 1 a 48). */
  numeroParcelas: number;
};

export type Output = {
  /** Soma de todas as parcelas (valorParcela × numeroParcelas). */
  totalParcelado: number;
  /** Juros embutidos em reais (totalParcelado − valorAVista; nunca negativo aqui). */
  jurosEmbutidoReais: number;
  /** Taxa mensal implícita no parcelamento, em % a.m. (ex.: 2.6253 = 2,6253% a.m.). */
  taxaMensalImplicita: number;
  /** Taxa anual equivalente, em % a.a. (capitalização composta). */
  taxaAnualEquivalente: number;
  /** true quando não há juros embutidos (parcelar é igual ou melhor que o à vista). */
  semJuros: boolean;
};

const MAX_PARCELAS = 48;
const MIN_PARCELAS = 1;
// Intervalo de busca da taxa mensal: 0% a 500% a.m. (cobre crédito rotativo extremo).
const I_MIN = 0;
const I_MAX = 5;
const BISECTION_ITERS = 60;
const BISECTION_TOL = 1e-7;

function round2(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

/** Arredonda uma fração (0,026253) para porcentagem (%) com 4 casas decimais. */
function roundPct4(fracao: number): number {
  if (!Number.isFinite(fracao)) return 0;
  return Math.round(fracao * 100 * 10000) / 10000;
}

/** Saneia um número positivo: NaN/Infinity/≤0 -> 0. */
function positivo(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x) || x <= 0) return 0;
  return x;
}

/** Clampa e arredonda o número de parcelas para inteiro em [1, 48]. */
function clampParcelas(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x)) return MIN_PARCELAS;
  const n = Math.round(x);
  if (n < MIN_PARCELAS) return MIN_PARCELAS;
  if (n > MAX_PARCELAS) return MAX_PARCELAS;
  return n;
}

/**
 * Valor presente de uma anuidade postecipada de n parcelas iguais a uma taxa i:
 *   PV(i) = parcela × [ 1 − (1 + i)^(−n) ] / i      (i > 0)
 *   PV(0) = parcela × n                              (limite quando i -> 0)
 */
function valorPresente(parcela: number, n: number, i: number): number {
  if (i <= 0) return parcela * n;
  return (parcela * (1 - Math.pow(1 + i, -n))) / i;
}

/**
 * Resolve a taxa mensal implícita i ≥ 0 tal que valorPresente(parcela, n, i) = pv.
 * Bissecção em [I_MIN, I_MAX]. PV(i) é estritamente decrescente em i, o que garante
 * uma única raiz quando totalParcelado > pv.
 */
function taxaImplicita(pv: number, parcela: number, n: number): number {
  // Forma fechada para parcela única.
  if (n === 1) {
    const i = parcela / pv - 1;
    return i > 0 ? i : 0;
  }

  let lo = I_MIN;
  let hi = I_MAX;
  let mid = 0;

  for (let k = 0; k < BISECTION_ITERS; k++) {
    mid = (lo + hi) / 2;
    const pvMid = valorPresente(parcela, n, mid);
    // PV decresce com i: se PV(mid) > pv, a taxa real é maior -> sobe o piso.
    if (pvMid > pv) {
      lo = mid;
    } else {
      hi = mid;
    }
    if (Math.abs(pvMid - pv) < BISECTION_TOL) break;
  }

  return (lo + hi) / 2;
}

export function calculate(input: Input): Output {
  const valorAVista = positivo(input.valorAVista);
  const valorParcela = positivo(input.valorParcela);
  const numeroParcelas = clampParcelas(input.numeroParcelas);

  const totalParcelado = valorParcela * numeroParcelas;

  // Entradas inválidas (à vista ou parcela ≤ 0): retorno neutro.
  if (valorAVista <= 0 || valorParcela <= 0) {
    return {
      totalParcelado: round2(totalParcelado),
      jurosEmbutidoReais: 0,
      taxaMensalImplicita: 0,
      taxaAnualEquivalente: 0,
      semJuros: true,
    };
  }

  const jurosBruto = totalParcelado - valorAVista;

  // Sem juros embutidos: parcelar custa o mesmo (ou menos) que o à vista.
  if (jurosBruto <= 0) {
    return {
      totalParcelado: round2(totalParcelado),
      jurosEmbutidoReais: 0,
      taxaMensalImplicita: 0,
      taxaAnualEquivalente: 0,
      semJuros: true,
    };
  }

  const i = taxaImplicita(valorAVista, valorParcela, numeroParcelas);
  const iAnual = Math.pow(1 + i, 12) - 1;

  return {
    totalParcelado: round2(totalParcelado),
    jurosEmbutidoReais: round2(jurosBruto),
    taxaMensalImplicita: roundPct4(i),
    taxaAnualEquivalente: roundPct4(iAnual),
    semJuros: false,
  };
}
