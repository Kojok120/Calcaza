// Calculadora do Abono Salarial PIS/Pasep.
// Fórmula e regras oficiais (ano-base 2024, pagamento em 2026):
//   abono = (meses trabalhados no ano-base / 12) × salário mínimo vigente
//   Mês trabalhado = 15 dias ou mais dentro do mês (fração >= 15 dias conta como mês cheio).
//   Valor varia de 1/12 do salário mínimo (1 mês) a 1 salário mínimo cheio (12 meses).
// Fontes:
//   - gov.br — Abono salarial PIS/Pasep:
//     https://www.gov.br/trabalho-e-emprego/pt-br/servicos/trabalhador/abono-salarial
//   - Lei nº 7.998/1990, art. 9º — planalto.gov.br:
//     https://www.planalto.gov.br/ccivil_03/leis/l7998.htm
//   - Salário mínimo 2026 (Decreto 12.797/2025): R$ 1.621,00, vigência 01/01/2026.
//     https://www.planalto.gov.br/ccivil_03/_ato2023-2026/2025/decreto/d12797.htm

/** Salário mínimo nacional vigente em 2026 (Decreto 12.797/2025), editável na calculadora. */
export const SALARIO_MINIMO_2026 = 1621.0;

export type Input = {
  /** Meses trabalhados no ano-base (inteiro). Fração >= 15 dias conta como mês cheio. */
  mesesTrabalhados: number;
  /** Salário mínimo vigente, em reais (default R$ 1.621,00 em 2026, editável). */
  salarioMinimo: number;
};

export type Output = {
  /** Valor estimado do abono salarial (proporcional aos meses), arredondado em centavos. */
  valorAbono: number;
  /** Meses efetivamente considerados no cálculo (já saneados para o intervalo 0–12). */
  mesesConsiderados: number;
  /** Salário mínimo usado no cálculo (já saneado). */
  salarioMinimo: number;
  /** Valor de cada mês trabalhado (= salário mínimo / 12), para montar a tabela. */
  valorPorMes: number;
};

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/** Sanea os meses para um inteiro no intervalo 0–12 (clamp). */
export function sanearMeses(mesesTrabalhados: number): number {
  if (!Number.isFinite(mesesTrabalhados) || mesesTrabalhados <= 0) return 0;
  const meses = Math.floor(mesesTrabalhados);
  if (meses > 12) return 12;
  return meses;
}

/** Sanea o salário mínimo (valor positivo); valores inválidos voltam ao padrão de 2026. */
export function sanearSalarioMinimo(salarioMinimo: number): number {
  if (!Number.isFinite(salarioMinimo) || salarioMinimo <= 0) {
    return SALARIO_MINIMO_2026;
  }
  return salarioMinimo;
}

export function calculate(input: Input): Output {
  const mesesConsiderados = sanearMeses(input.mesesTrabalhados);
  const salarioMinimo = sanearSalarioMinimo(input.salarioMinimo);
  const valorPorMes = round2(salarioMinimo / 12);
  const valorAbono = round2((mesesConsiderados / 12) * salarioMinimo);

  return {
    valorAbono,
    mesesConsiderados,
    salarioMinimo,
    valorPorMes,
  };
}
