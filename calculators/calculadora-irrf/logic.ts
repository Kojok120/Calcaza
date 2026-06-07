// Calculadora de IRRF 2026 (Imposto de Renda Retido na Fonte, mensal).
// Foca apenas no imposto retido na fonte sobre a folha, com o detalhamento
// da base, da faixa, da parcela a deduzir, da comparação completo x simplificado
// e do redutor de 2026.
//
// Regras e tabelas oficiais de 2026 (mesma base da calculadora de salário líquido):
//   - Tabela INSS (contribuição do empregado, progressiva por faixa):
//     Portaria Interministerial 2026 — gov.br/inss / gov.br/previdencia
//   - Tabela IRRF mensal 2026:
//     Receita Federal — gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
//   - Isenção / redutor do IR até R$ 5.000 (2026):
//     Lei nº 15.270/2025 — planalto.gov.br

export type Input = {
  /** Salário/rendimento bruto mensal em reais. */
  salarioBruto: number;
  /** Número de dependentes para fins de IR (inteiro >= 0). Padrão: 0. */
  dependentes?: number;
  /**
   * Outras deduções legais da base do IR (pensão alimentícia judicial,
   * previdência oficial além do INSS etc.). Padrão: 0.
   */
  outrasDeducoes?: number;
  /**
   * INSS já informado pela folha (opcional). Se ausente ou inválido,
   * o INSS é calculado pela tabela 2026 a partir do salário bruto.
   */
  inssInformado?: number;
};

export type Output = {
  /** Salário/rendimento bruto efetivamente considerado (saneado, >= 0). */
  salarioBruto: number;
  /** Contribuição ao INSS usada na base (informada ou calculada). */
  inss: number;
  /** Base de cálculo do IR usada (a mais benéfica: completa x simplificada). */
  baseCalculo: number;
  /** Indica qual base foi usada (a que gerou menor imposto). */
  baseTipo: 'legal' | 'simplificado';
  /** Imposto pela tabela, antes de aplicar o redutor de 2026. */
  impostoTabela: number;
  /** Redutor aplicado (faixa de R$ 5.000 a R$ 7.350, Lei 15.270/2025). */
  redutor: number;
  /** IRRF final retido na fonte. */
  irrf: number;
  /** Alíquota nominal da faixa em que a base de cálculo cai (fração). */
  aliquotaNominal: number;
  /** Alíquota efetiva: IRRF dividido pelo bruto (fração). */
  aliquotaEfetiva: number;
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

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/** INSS progressivo do empregado sobre o salário bruto (tabela 2026). */
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

/** Aplica a tabela IRRF a uma base de cálculo: max(0, base*aliquota - parcelaDeduzir). */
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
  const brutoRaw = input.salarioBruto;
  const salarioBruto =
    Number.isFinite(brutoRaw) && brutoRaw > 0 ? brutoRaw : 0;

  const dependentes = Number.isFinite(input.dependentes)
    ? Math.max(0, Math.floor(input.dependentes as number))
    : 0;

  const outrasDeducoes =
    Number.isFinite(input.outrasDeducoes) &&
    (input.outrasDeducoes as number) > 0
      ? (input.outrasDeducoes as number)
      : 0;

  if (salarioBruto === 0) {
    return {
      salarioBruto: 0,
      inss: 0,
      baseCalculo: 0,
      baseTipo: 'legal',
      impostoTabela: 0,
      redutor: 0,
      irrf: 0,
      aliquotaNominal: 0,
      aliquotaEfetiva: 0,
    };
  }

  // INSS: usa o informado pela folha (se válido e >= 0), senão calcula pela tabela.
  const inss =
    Number.isFinite(input.inssInformado) && (input.inssInformado as number) >= 0
      ? round2(input.inssInformado as number)
      : calcularInss(salarioBruto);

  // Base completa (deduções legais) x base simplificada: usa-se a que gera menos imposto.
  const baseLegal = Math.max(
    0,
    salarioBruto - inss - dependentes * DEDUCAO_DEPENDENTE - outrasDeducoes
  );
  const baseSimplificado = Math.max(0, salarioBruto - DESCONTO_SIMPLIFICADO);

  const impostoLegal = aplicarTabelaIrrf(baseLegal);
  const impostoSimplificado = aplicarTabelaIrrf(baseSimplificado);

  let baseCalculo: number;
  let baseTipo: 'legal' | 'simplificado';
  let impostoTabela: number;
  if (impostoLegal <= impostoSimplificado) {
    impostoTabela = impostoLegal;
    baseCalculo = baseLegal;
    baseTipo = 'legal';
  } else {
    impostoTabela = impostoSimplificado;
    baseCalculo = baseSimplificado;
    baseTipo = 'simplificado';
  }

  // Redutor da Lei 15.270/2025 (vigência 2026), sobre o rendimento bruto mensal.
  let redutor = 0;
  let irrf: number;
  if (salarioBruto <= ISENCAO_TOTAL_ATE) {
    irrf = 0; // isenção total até R$ 5.000
  } else if (salarioBruto <= REDUTOR_LIMITE) {
    redutor = REDUTOR_CONST - REDUTOR_COEF * salarioBruto;
    if (redutor < 0) redutor = 0;
    irrf = Math.max(0, impostoTabela - redutor);
  } else {
    irrf = impostoTabela; // acima de R$ 7.350 não há redutor
  }

  irrf = round2(irrf);
  redutor = round2(redutor);

  return {
    salarioBruto,
    inss,
    baseCalculo: round2(baseCalculo),
    baseTipo,
    impostoTabela: round2(impostoTabela),
    redutor,
    irrf,
    aliquotaNominal: aliquotaDaFaixa(baseCalculo),
    aliquotaEfetiva: salarioBruto > 0 ? irrf / salarioBruto : 0,
  };
}
