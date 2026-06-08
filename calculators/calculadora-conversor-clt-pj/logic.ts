// Calculadora CLT x PJ 2026 — conversão simplificada e transparente.
//
// O objetivo é estimar, a partir de um salário CLT, o "pacote mensal equivalente"
// (salário líquido + 13º + férias+1/3 + FGTS + benefícios diluídos por mês) e quanto
// um PJ precisaria FATURAR por mês para, depois do imposto e do contador, sobrar o
// mesmo pacote. É uma ESTIMATIVA SIMPLIFICADA: não inclui o INSS do próprio PJ, o
// pró-labore, eventual provisionamento de reserva, nem todos os custos do regime PJ.
//
// Regras e tabelas oficiais de 2026 (reaproveitadas da calculadora-salario-liquido):
//   - Tabela INSS (contribuição do empregado, progressiva por faixa):
//     Portaria Interministerial 2026 — gov.br/inss / gov.br/previdencia
//   - Tabela IRRF mensal 2026:
//     Receita Federal — gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
//   - Isenção / redutor do IR até R$ 5.000 (2026):
//     Lei nº 15.270/2025 — planalto.gov.br
//   - FGTS 8% sobre o salário bruto:
//     Caixa Econômica Federal / Lei nº 8.036/1990 — caixa.gov.br / fgts.gov.br
//   - Simples Nacional (alíquota de exemplo: Anexo III, 1ª faixa = 6%):
//     Comitê Gestor do Simples Nacional — www8.receita.fazenda.gov.br/SimplesNacional

export type Input = {
  /** Salário bruto mensal CLT em reais. */
  salarioBrutoClt: number;
  /** Número de dependentes para fins de IR (inteiro >= 0). Padrão: 0. */
  dependentes?: number;
  /** Benefícios mensais (VR/VA, plano de saúde etc.), valor mensal. Padrão: 0. */
  beneficiosMensais?: number;
  /** Alíquota de imposto do PJ sobre o faturamento, em % (ex.: 6 = Simples Anexo III, 1ª faixa). */
  taxaImpostoPj: number;
  /** Custo mensal do contador para o PJ. Padrão: 0. */
  custoContadorPj?: number;
};

export type Output = {
  /** Desconto do INSS sobre o salário CLT. */
  inss: number;
  /** Desconto do IRRF sobre o salário CLT. */
  irrf: number;
  /** Salário líquido CLT (bruto − INSS − IRRF). */
  salarioLiquidoClt: number;
  /** 13º salário diluído por mês (bruto / 12). */
  decimoTerceiroMensal: number;
  /** Férias + 1/3 diluídas por mês ((bruto + bruto/3) / 12). */
  feriasMaisTercoMensal: number;
  /** Depósito do FGTS por mês (8% do bruto). */
  fgtsMensal: number;
  /** Pacote mensal equivalente CLT (líquido + 13º + férias+1/3 + FGTS + benefícios). */
  pacoteTotalClt: number;
  /** Faturamento mensal que o PJ precisaria para igualar o pacote CLT. */
  faturamentoPjEquivalente: number;
};

// --- Tabela INSS 2026 (contribuição do empregado) ---
// Cada alíquota incide apenas sobre a parcela do salário dentro da faixa.
const INSS_BANDS: ReadonlyArray<{ limit: number; rate: number }> = [
  { limit: 1621.0, rate: 0.075 }, // até R$ 1.621,00 -> 7,5%
  { limit: 2902.84, rate: 0.09 }, // R$ 1.621,01 a 2.902,84 -> 9%
  { limit: 4354.27, rate: 0.12 }, // R$ 2.902,85 a 4.354,27 -> 12%
  { limit: 8475.55, rate: 0.14 }, // R$ 4.354,28 a 8.475,55 -> 14%
];
const INSS_TETO = 8475.55; // teto do salário de contribuição 2026
const INSS_DESCONTO_TETO = 988.09; // INSS máximo (desconto no teto)

// --- Tabela IRRF mensal 2026 (Receita Federal) ---
const IRRF_BANDS: ReadonlyArray<{ limit: number; rate: number; deduzir: number }> = [
  { limit: 2428.8, rate: 0, deduzir: 0 }, // isento
  { limit: 2826.65, rate: 0.075, deduzir: 182.16 },
  { limit: 3751.05, rate: 0.15, deduzir: 394.16 },
  { limit: 4664.68, rate: 0.225, deduzir: 675.49 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduzir: 908.73 },
];
const DEDUCAO_DEPENDENTE = 189.59; // dedução mensal por dependente
const DESCONTO_SIMPLIFICADO = 607.2; // desconto simplificado mensal

// --- Redutor da Lei nº 15.270/2025 (isenção 2026) ---
const ISENCAO_TOTAL_ATE = 5000; // bruto <= 5.000 -> IRRF zero
const REDUTOR_LIMITE = 7350; // acima de 7.350 -> sem redutor
const REDUTOR_CONST = 978.62;
const REDUTOR_COEF = 0.133145;

// --- FGTS ---
const FGTS_ALIQUOTA = 0.08; // 8% do salário bruto

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/** INSS progressivo do empregado sobre o salário bruto. */
export function calcularInss(salarioBruto: number): number {
  if (!Number.isFinite(salarioBruto) || salarioBruto <= 0) return 0;
  if (salarioBruto >= INSS_TETO) return INSS_DESCONTO_TETO;

  let anterior = 0;
  let total = 0;
  for (const banda of INSS_BANDS) {
    if (salarioBruto <= anterior) break;
    const parcela = Math.min(salarioBruto, banda.limit) - anterior;
    total += parcela * banda.rate;
    anterior = banda.limit;
  }
  return round2(total);
}

/** Aplica a tabela IRRF a uma base de cálculo. */
function aplicarTabelaIrrf(base: number): number {
  if (base <= 0) return 0;
  for (const banda of IRRF_BANDS) {
    if (base <= banda.limit) {
      return Math.max(0, base * banda.rate - banda.deduzir);
    }
  }
  return 0;
}

/** IRRF mensal 2026 sobre o salário CLT, usando a base mais benéfica e o redutor de 2026. */
export function calcularIrrf(
  salarioBruto: number,
  inss: number,
  dependentes: number
): number {
  if (!Number.isFinite(salarioBruto) || salarioBruto <= 0) return 0;

  // Base legal x base simplificada: usa-se a que gera menos imposto.
  const baseLegal = Math.max(0, salarioBruto - inss - dependentes * DEDUCAO_DEPENDENTE);
  const baseSimplificada = Math.max(0, salarioBruto - DESCONTO_SIMPLIFICADO);

  const impostoLegal = aplicarTabelaIrrf(baseLegal);
  const impostoSimplificado = aplicarTabelaIrrf(baseSimplificada);
  const impostoNormal = Math.min(impostoLegal, impostoSimplificado);

  // Redutor da Lei 15.270/2025 (vigência 2026).
  let irrf: number;
  if (salarioBruto <= ISENCAO_TOTAL_ATE) {
    irrf = 0; // isenção total até R$ 5.000
  } else if (salarioBruto <= REDUTOR_LIMITE) {
    let redutor = REDUTOR_CONST - REDUTOR_COEF * salarioBruto;
    if (redutor < 0) redutor = 0;
    irrf = Math.max(0, impostoNormal - redutor);
  } else {
    irrf = impostoNormal; // acima de R$ 7.350 não há redutor
  }
  return round2(irrf);
}

function sanitizeNonNegative(x: number | undefined): number {
  return Number.isFinite(x) && (x as number) > 0 ? (x as number) : 0;
}

const ZERO_OUTPUT: Output = {
  inss: 0,
  irrf: 0,
  salarioLiquidoClt: 0,
  decimoTerceiroMensal: 0,
  feriasMaisTercoMensal: 0,
  fgtsMensal: 0,
  pacoteTotalClt: 0,
  faturamentoPjEquivalente: 0,
};

export function calculate(input: Input): Output {
  const salarioBrutoClt =
    Number.isFinite(input.salarioBrutoClt) && input.salarioBrutoClt > 0
      ? input.salarioBrutoClt
      : 0;

  const dependentes = Number.isFinite(input.dependentes)
    ? Math.max(0, Math.floor(input.dependentes as number))
    : 0;

  const beneficiosMensais = sanitizeNonNegative(input.beneficiosMensais);
  const custoContadorPj = sanitizeNonNegative(input.custoContadorPj);

  const taxaImpostoPj =
    Number.isFinite(input.taxaImpostoPj) && input.taxaImpostoPj >= 0
      ? input.taxaImpostoPj
      : 0;

  // Salário inválido ou imposto PJ >= 100% (faturamento não cobre o imposto) -> tudo zero.
  if (salarioBrutoClt === 0 || taxaImpostoPj >= 100) {
    return { ...ZERO_OUTPUT };
  }

  const inss = calcularInss(salarioBrutoClt);
  const irrf = calcularIrrf(salarioBrutoClt, inss, dependentes);
  const salarioLiquidoClt = round2(salarioBrutoClt - inss - irrf);

  const decimoTerceiroMensal = round2(salarioBrutoClt / 12);
  const feriasMaisTercoMensal = round2((salarioBrutoClt + salarioBrutoClt / 3) / 12);
  const fgtsMensal = round2(salarioBrutoClt * FGTS_ALIQUOTA);

  const pacoteTotalClt = round2(
    salarioLiquidoClt +
      decimoTerceiroMensal +
      feriasMaisTercoMensal +
      fgtsMensal +
      beneficiosMensais
  );

  // Faturamento tal que, após o imposto sobre o faturamento e o custo do contador,
  // sobre exatamente o pacote mensal equivalente da CLT.
  const faturamentoPjEquivalente = round2(
    (pacoteTotalClt + custoContadorPj) / (1 - taxaImpostoPj / 100)
  );

  return {
    inss,
    irrf,
    salarioLiquidoClt,
    decimoTerceiroMensal,
    feriasMaisTercoMensal,
    fgtsMensal,
    pacoteTotalClt,
    faturamentoPjEquivalente,
  };
}
