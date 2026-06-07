// Calculadora de Seguro-Desemprego 2026.
// Regras e valores oficiais (vigência a partir de 11/01/2026, reajuste pelo INPC 3,90%):
//   - Faixas e fórmula do valor da parcela, piso e teto:
//     Ministério do Trabalho e Emprego — gov.br/trabalho-e-emprego
//   - Lei nº 7.998/1990 (Programa do Seguro-Desemprego) — planalto.gov.br
//   - Número de parcelas (regras do CODEFAT) — gov.br/trabalho-e-emprego

export type Input = {
  /** Média aritmética dos 3 últimos salários, em reais. */
  mediaSalarial: number;
  /** Meses trabalhados no período aquisitivo (inteiro >= 0). */
  mesesTrabalhados: number;
  /** Número da solicitação: 1 (primeira), 2 (segunda) ou 3 (terceira ou mais). */
  numeroSolicitacao: 1 | 2 | 3;
};

export type Output = {
  /** Valor de cada parcela do seguro-desemprego (já com piso e teto). */
  valorParcela: number;
  /** Quantidade de parcelas a que o trabalhador tem direito (0 = não elegível). */
  numeroParcelas: number;
  /** Valor total estimado (parcela × número de parcelas). */
  valorTotal: number;
  /** Indica se o trabalhador é elegível (numeroParcelas > 0). */
  elegivel: boolean;
};

// --- Faixas do valor da parcela 2026 (base: média dos 3 últimos salários) ---
const FAIXA_1_TETO = 2222.17; // até R$ 2.222,17 -> média × 0,8
const FAIXA_2_TETO = 3703.99; // de R$ 2.222,18 a R$ 3.703,99 -> excedente × 0,5 + 1.777,74
const FAIXA_2_BASE = 1777.74; // valor fixo somado na faixa 2 (= 2.222,17 × 0,8)

// --- Piso e teto da parcela 2026 ---
const PISO_PARCELA = 1621.0; // nunca inferior ao salário mínimo de 2026
const TETO_PARCELA = 2518.65; // teto do benefício

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/** Calcula o valor da parcela aplicando as faixas, o piso e o teto. */
export function calcularValorParcela(mediaSalarial: number): number {
  const media =
    Number.isFinite(mediaSalarial) && mediaSalarial > 0 ? mediaSalarial : 0;
  if (media === 0) return 0;

  let valor: number;
  if (media <= FAIXA_1_TETO) {
    valor = media * 0.8;
  } else if (media <= FAIXA_2_TETO) {
    valor = (media - FAIXA_1_TETO) * 0.5 + FAIXA_2_BASE;
  } else {
    valor = TETO_PARCELA;
  }

  // Piso (salário mínimo) e teto do benefício.
  valor = Math.max(valor, PISO_PARCELA);
  valor = Math.min(valor, TETO_PARCELA);
  return round2(valor);
}

/** Número de parcelas conforme as regras do CODEFAT (tempo trabalhado × nº da solicitação). */
export function calcularNumeroParcelas(
  mesesTrabalhados: number,
  numeroSolicitacao: 1 | 2 | 3
): number {
  const meses =
    Number.isFinite(mesesTrabalhados) && mesesTrabalhados > 0
      ? Math.floor(mesesTrabalhados)
      : 0;

  if (numeroSolicitacao === 1) {
    // 1ª solicitação: exige no mínimo 12 meses.
    if (meses < 12) return 0;
    if (meses <= 23) return 4;
    return 5;
  }

  if (numeroSolicitacao === 2) {
    // 2ª solicitação: exige no mínimo 9 meses.
    if (meses < 9) return 0;
    if (meses <= 11) return 3;
    if (meses <= 23) return 4;
    return 5;
  }

  // 3ª (ou mais) solicitação: exige no mínimo 6 meses.
  if (meses < 6) return 0;
  if (meses <= 11) return 3;
  if (meses <= 23) return 4;
  return 5;
}

export function calculate(input: Input): Output {
  // Sanea o número da solicitação para 1, 2 ou 3.
  let solicitacao = Math.floor(Number(input.numeroSolicitacao));
  if (!Number.isFinite(solicitacao) || solicitacao < 1) solicitacao = 1;
  if (solicitacao > 3) solicitacao = 3;
  const numeroSolicitacao = solicitacao as 1 | 2 | 3;

  const valorParcela = calcularValorParcela(input.mediaSalarial);
  const numeroParcelas = calcularNumeroParcelas(
    input.mesesTrabalhados,
    numeroSolicitacao
  );
  const elegivel = numeroParcelas > 0;
  const valorTotal = round2(valorParcela * numeroParcelas);

  return {
    valorParcela,
    numeroParcelas,
    valorTotal,
    elegivel,
  };
}
