// Calculadora de Salário Líquido 2026 (CLT).
// Regras e tabelas oficiais de 2026:
//   - Tabela INSS (contribuição do empregado, progressiva por faixa):
//     Portaria Interministerial 2026 — gov.br/inss / gov.br/previdencia
//   - Tabela IRRF mensal 2026:
//     Receita Federal — gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
//   - Isenção / redutor do IR até R$ 5.000 (2026):
//     Lei nº 15.270/2025 — planalto.gov.br

export type Input = {
  /** Salário bruto mensal em reais. */
  salarioBruto: number;
  /** Número de dependentes (inteiro >= 0). Padrão: 0. */
  dependentes?: number;
  /** Outros descontos em folha (plano de saúde, vale etc.). Padrão: 0. */
  outrosDescontos?: number;
};

export type Output = {
  /** Salário bruto efetivamente considerado (já saneado, >= 0). */
  salarioBruto: number;
  /** Desconto do INSS (contribuição do empregado). */
  inss: number;
  /** Desconto do IRRF na folha. */
  irrf: number;
  /** Base de cálculo do IR usada (a mais benéfica: legal x simplificada). */
  baseIrrf: number;
  /** Indica qual base de IR foi usada. */
  baseIrrfTipo: 'legal' | 'simplificada';
  /** Imposto antes de aplicar o redutor da Lei 15.270/2025. */
  irrfAntesRedutor: number;
  /** Redutor aplicado (faixa de R$ 5.000 a R$ 7.350). */
  redutor: number;
  /** Outros descontos aplicados. */
  outrosDescontos: number;
  /** Salário líquido final. */
  salarioLiquido: number;
  /** Alíquota efetiva do INSS sobre o bruto (fração: 0,0778 = 7,78%). */
  aliquotaEfetivaInss: number;
  /** Alíquota efetiva do IRRF sobre o bruto (fração). */
  aliquotaEfetivaIrrf: number;
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

export function calculate(input: Input): Output {
  const brutoRaw = input.salarioBruto;
  const salarioBruto =
    Number.isFinite(brutoRaw) && brutoRaw > 0 ? brutoRaw : 0;

  const dependentes = Number.isFinite(input.dependentes)
    ? Math.max(0, Math.floor(input.dependentes as number))
    : 0;

  const outrosDescontos =
    Number.isFinite(input.outrosDescontos) &&
    (input.outrosDescontos as number) > 0
      ? (input.outrosDescontos as number)
      : 0;

  if (salarioBruto === 0) {
    return {
      salarioBruto: 0,
      inss: 0,
      irrf: 0,
      baseIrrf: 0,
      baseIrrfTipo: 'legal',
      irrfAntesRedutor: 0,
      redutor: 0,
      outrosDescontos,
      salarioLiquido: 0,
      aliquotaEfetivaInss: 0,
      aliquotaEfetivaIrrf: 0,
    };
  }

  const inss = calcularInss(salarioBruto);

  // Base legal x base simplificada: usa-se a que gera menos imposto.
  const baseLegal = Math.max(0, salarioBruto - inss - dependentes * DEDUCAO_DEPENDENTE);
  const baseSimplificada = Math.max(0, salarioBruto - DESCONTO_SIMPLIFICADO);

  const impostoLegal = aplicarTabelaIrrf(baseLegal);
  const impostoSimplificado = aplicarTabelaIrrf(baseSimplificada);

  let baseIrrf: number;
  let baseIrrfTipo: 'legal' | 'simplificada';
  let impostoNormal: number;
  if (impostoLegal <= impostoSimplificado) {
    impostoNormal = impostoLegal;
    baseIrrf = baseLegal;
    baseIrrfTipo = 'legal';
  } else {
    impostoNormal = impostoSimplificado;
    baseIrrf = baseSimplificada;
    baseIrrfTipo = 'simplificada';
  }

  // Redutor da Lei 15.270/2025 (vigência 2026).
  let redutor = 0;
  let irrf: number;
  if (salarioBruto <= ISENCAO_TOTAL_ATE) {
    irrf = 0; // isenção total até R$ 5.000
  } else if (salarioBruto <= REDUTOR_LIMITE) {
    redutor = REDUTOR_CONST - REDUTOR_COEF * salarioBruto;
    if (redutor < 0) redutor = 0;
    irrf = Math.max(0, impostoNormal - redutor);
  } else {
    irrf = impostoNormal; // acima de R$ 7.350 não há redutor
  }

  irrf = round2(irrf);
  redutor = round2(redutor);
  const irrfAntesRedutor = round2(impostoNormal);
  const salarioLiquido = round2(Math.max(0, salarioBruto - inss - irrf - outrosDescontos));

  return {
    salarioBruto,
    inss,
    irrf,
    baseIrrf: round2(baseIrrf),
    baseIrrfTipo,
    irrfAntesRedutor,
    redutor,
    outrosDescontos,
    salarioLiquido,
    aliquotaEfetivaInss: salarioBruto > 0 ? inss / salarioBruto : 0,
    aliquotaEfetivaIrrf: salarioBruto > 0 ? irrf / salarioBruto : 0,
  };
}
