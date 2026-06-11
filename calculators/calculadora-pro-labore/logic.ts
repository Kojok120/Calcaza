// Calculadora de Pró-labore 2026 (sócio / administrador de empresa).
// O sócio que recebe pró-labore é contribuinte individual perante o INSS.
// Esta calculadora estima os descontos do próprio sócio sobre o pró-labore:
//   - INSS do contribuinte individual (11% no caso geral, ou 20% sem cota patronal),
//     sempre limitado ao teto do salário de contribuição;
//   - IRRF pela tabela mensal de 2026, depois do INSS e dos dependentes, com o
//     redutor da Lei 15.270/2025.
// Não inclui a cota patronal de 20% que a empresa recolhe à parte, nem a
// distribuição de lucros (isenta de IR e de INSS).
//
// Regras e tabelas oficiais de 2026 (mesma base das calculadoras de salário
// líquido e de IRRF deste repositório — reaproveitadas, não redigitadas):
//   - Teto e regime INSS 2026 (contribuinte individual):
//     gov.br/inss — Lei 8.212/91, art. 21 e art. 30 §4º; IN RFB 2.110/2022
//   - Tabela IRRF mensal 2026:
//     Receita Federal — gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
//   - Isenção / redutor do IR até R$ 5.000 (2026):
//     Lei nº 15.270/2025 — planalto.gov.br

export type RegimeInss = '11' | '20';

export type Input = {
  /** Pró-labore bruto mensal do sócio, em reais. */
  valorProLabore: number;
  /** Número de dependentes para fins de IR (inteiro >= 0). Padrão: 0. */
  dependentes?: number;
  /**
   * Regime de contribuição do INSS do sócio:
   *  - '11': caso geral, quando a empresa recolhe a cota patronal de 20% à parte;
   *  - '20': quando o contribuinte individual recolhe por conta própria, sem cota patronal.
   * Padrão: '11'.
   */
  regimeInss?: RegimeInss;
};

export type Output = {
  /** Pró-labore bruto efetivamente considerado (saneado, >= 0). */
  valorProLabore: number;
  /** Alíquota de INSS aplicada (0,11 ou 0,20). */
  aliquotaInss: number;
  /** Desconto do INSS do sócio (limitado ao teto de contribuição). */
  inss: number;
  /** Base de cálculo do IRRF: pró-labore − INSS − dependentes × R$ 189,59. */
  baseIRRF: number;
  /** Imposto pela tabela mensal, antes do redutor de 2026. */
  impostoTabela: number;
  /** Redutor da Lei 15.270/2025 aplicado (faixa de R$ 5.000 a R$ 7.350). */
  redutor: number;
  /** IRRF final retido sobre o pró-labore. */
  irrf: number;
  /** Pró-labore líquido: bruto − INSS − IRRF. */
  proLaboreLiquido: number;
  /** Alíquota nominal da faixa de IRRF em que a base se enquadra (fração). */
  aliquotaNominal: number;
  /** Alíquota efetiva total: (INSS + IRRF) dividido pelo bruto (fração). */
  aliquotaEfetiva: number;
};

// --- Teto do INSS 2026 (salário de contribuição) ---
// gov.br/inss / gov.br/previdencia — Portaria Interministerial 2026.
const INSS_TETO = 8475.55; // teto do salário de contribuição 2026

// --- Tabela IRRF mensal 2026 (Receita Federal) ---
const IRRF_BANDS: ReadonlyArray<{ limit: number; rate: number; deduzir: number }> = [
  { limit: 2428.8, rate: 0, deduzir: 0 }, // isento
  { limit: 2826.65, rate: 0.075, deduzir: 182.16 },
  { limit: 3751.05, rate: 0.15, deduzir: 394.16 },
  { limit: 4664.68, rate: 0.225, deduzir: 675.49 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduzir: 908.73 },
];
const DEDUCAO_DEPENDENTE = 189.59; // dedução mensal por dependente

// --- Redutor da Lei nº 15.270/2025 (isenção 2026) ---
const ISENCAO_TOTAL_ATE = 5000; // bruto <= 5.000 -> IRRF zero
const REDUTOR_LIMITE = 7350; // acima de 7.350 -> sem redutor
const REDUTOR_CONST = 978.62;
const REDUTOR_COEF = 0.133145;

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/**
 * INSS do contribuinte individual sobre o pró-labore.
 * Incide a alíquota (11% ou 20%) sobre a base, que é limitada ao teto do INSS.
 * 11% × 8.475,55 = R$ 932,31 (máximo no regime geral).
 * 20% × 8.475,55 = R$ 1.695,11 (máximo no regime sem cota patronal).
 */
export function calcularInssProLabore(
  valorProLabore: number,
  regime: RegimeInss = '11'
): number {
  if (!Number.isFinite(valorProLabore) || valorProLabore <= 0) return 0;
  const aliquota = regime === '20' ? 0.2 : 0.11;
  const base = Math.min(valorProLabore, INSS_TETO);
  return round2(aliquota * base);
}

/** Aplica a tabela IRRF a uma base de cálculo: max(0, base × alíquota − parcela a deduzir). */
function aplicarTabelaIrrf(base: number): number {
  if (base <= 0) return 0;
  for (const banda of IRRF_BANDS) {
    if (base <= banda.limit) {
      return Math.max(0, base * banda.rate - banda.deduzir);
    }
  }
  return 0;
}

/** Alíquota nominal da faixa em que a base de cálculo se enquadra. */
function aliquotaDaFaixa(base: number): number {
  if (base <= 0) return 0;
  for (const banda of IRRF_BANDS) {
    if (base <= banda.limit) return banda.rate;
  }
  return 0;
}

export function calculate(input: Input): Output {
  const brutoRaw = input.valorProLabore;
  const valorProLabore =
    Number.isFinite(brutoRaw) && brutoRaw > 0 ? brutoRaw : 0;

  const dependentes = Number.isFinite(input.dependentes)
    ? Math.max(0, Math.floor(input.dependentes as number))
    : 0;

  const regimeInss: RegimeInss = input.regimeInss === '20' ? '20' : '11';
  const aliquotaInss = regimeInss === '20' ? 0.2 : 0.11;

  if (valorProLabore === 0) {
    return {
      valorProLabore: 0,
      aliquotaInss,
      inss: 0,
      baseIRRF: 0,
      impostoTabela: 0,
      redutor: 0,
      irrf: 0,
      proLaboreLiquido: 0,
      aliquotaNominal: 0,
      aliquotaEfetiva: 0,
    };
  }

  // INSS do sócio (contribuinte individual), limitado ao teto.
  const inss = calcularInssProLabore(valorProLabore, regimeInss);

  // Base do IRRF: pró-labore − INSS − dependentes.
  const baseIRRF = Math.max(
    0,
    valorProLabore - inss - dependentes * DEDUCAO_DEPENDENTE
  );

  const impostoTabela = aplicarTabelaIrrf(baseIRRF);

  // Redutor da Lei 15.270/2025 (vigência 2026), sobre o pró-labore bruto mensal.
  let redutor = 0;
  let irrf: number;
  if (valorProLabore <= ISENCAO_TOTAL_ATE) {
    irrf = 0; // isenção total até R$ 5.000
  } else if (valorProLabore <= REDUTOR_LIMITE) {
    redutor = REDUTOR_CONST - REDUTOR_COEF * valorProLabore;
    if (redutor < 0) redutor = 0;
    irrf = Math.max(0, impostoTabela - redutor);
  } else {
    irrf = impostoTabela; // acima de R$ 7.350 não há redutor
  }

  irrf = round2(irrf);
  redutor = round2(redutor);

  const proLaboreLiquido = round2(valorProLabore - inss - irrf);
  const aliquotaEfetiva =
    valorProLabore > 0 ? (inss + irrf) / valorProLabore : 0;

  return {
    valorProLabore,
    aliquotaInss,
    inss,
    baseIRRF: round2(baseIRRF),
    impostoTabela: round2(impostoTabela),
    redutor,
    irrf,
    proLaboreLiquido,
    aliquotaNominal: aliquotaDaFaixa(baseIRRF),
    aliquotaEfetiva,
  };
}
