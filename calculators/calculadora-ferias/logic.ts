// Calculadora de Férias 2026 (CLT).
// Estima o valor bruto e líquido das férias, incluindo o terço constitucional
// e, opcionalmente, o abono pecuniário ("vender 1/3" das férias).
//
// Regras e tabelas oficiais de 2026:
//   - Terço constitucional de férias: Constituição Federal, art. 7º, XVII —
//     planalto.gov.br
//   - Direito a férias / abono pecuniário: CLT, arts. 129 a 145
//     (em especial o art. 143, que trata da conversão de 1/3 em abono) —
//     planalto.gov.br/ccivil_03/decreto-lei/del5452.htm
//   - Tabela INSS (contribuição do empregado, progressiva por faixa) 2026:
//     Portaria Interministerial — gov.br/inss / gov.br/previdencia
//   - Tabela IRRF mensal 2026 (tributação na fonte das férias como antecipação):
//     Receita Federal — gov.br/receitafederal
//
// Observações de modelagem:
//   - O abono pecuniário e o seu respectivo 1/3 são ISENTOS de INSS e de IRRF.
//   - A base tributável é apenas (férias gozadas + 1/3 constitucional).
//   - Sobre as férias NÃO aplicamos o redutor da Lei nº 15.270/2025: as férias
//     têm tributação na fonte como antecipação. O resultado é uma estimativa.

export type Input = {
  /** Salário bruto mensal em reais. */
  salarioBruto: number;
  /** Dias de férias efetivamente gozados (1 a 30). Padrão: 30. */
  diasFerias: number;
  /** Se true, vende 1/3 das férias como abono pecuniário (10 dias). */
  venderUmTerco?: boolean;
  /** Número de dependentes (inteiro >= 0). Padrão: 0. */
  dependentes?: number;
};

export type Output = {
  /** Salário bruto efetivamente considerado (já saneado, >= 0). */
  salarioBruto: number;
  /** Dias de férias efetivamente usados (1 a 30, já saneado). */
  diasFerias: number;
  /** Remuneração das férias gozadas: (salarioBruto / 30) × diasFerias. */
  valorFerias: number;
  /** Terço constitucional sobre as férias gozadas (valorFerias / 3). */
  tercoConstitucional: number;
  /** Abono pecuniário (10 dias vendidos), isento. 0 se não vender. */
  abono: number;
  /** Terço constitucional sobre o abono, isento. 0 se não vender. */
  abonoTerco: number;
  /** Base tributável: férias gozadas + 1/3 constitucional. */
  baseTributavel: number;
  /** Base de cálculo do IRRF (base tributável − INSS − dependentes). */
  baseIrrf: number;
  /** Desconto do INSS sobre a base tributável. */
  inss: number;
  /** Desconto do IRRF sobre a base de cálculo. */
  irrf: number;
  /** Total bruto a receber: férias + 1/3 + abono + 1/3 do abono. */
  totalBruto: number;
  /** Total de descontos: INSS + IRRF. */
  totalDescontos: number;
  /** Total líquido das férias: totalBruto − totalDescontos. */
  totalLiquido: number;
};

// --- Tabela INSS 2026 (contribuição do empregado) ---
// Cada alíquota incide apenas sobre a parcela que cai dentro da faixa.
// Fonte: Portaria Interministerial 2026 — gov.br/inss / gov.br/previdencia
const INSS_BANDS: ReadonlyArray<{ limit: number; rate: number }> = [
  { limit: 1621.0, rate: 0.075 }, // até R$ 1.621,00 -> 7,5%
  { limit: 2902.84, rate: 0.09 }, // R$ 1.621,01 a 2.902,84 -> 9%
  { limit: 4354.27, rate: 0.12 }, // R$ 2.902,85 a 4.354,27 -> 12%
  { limit: 8475.55, rate: 0.14 }, // R$ 4.354,28 a 8.475,55 -> 14%
];
const INSS_TETO = 8475.55; // teto do salário de contribuição 2026
const INSS_DESCONTO_TETO = 988.09; // INSS máximo (desconto no teto)

// --- Tabela IRRF mensal 2026 (Receita Federal) ---
// Fonte: Receita Federal — gov.br/receitafederal
const IRRF_BANDS: ReadonlyArray<{ limit: number; rate: number; deduzir: number }> = [
  { limit: 2428.8, rate: 0, deduzir: 0 }, // isento
  { limit: 2826.65, rate: 0.075, deduzir: 182.16 },
  { limit: 3751.05, rate: 0.15, deduzir: 394.16 },
  { limit: 4664.68, rate: 0.225, deduzir: 675.49 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduzir: 908.73 },
];
const DEDUCAO_DEPENDENTE = 189.59; // dedução mensal por dependente

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/** INSS progressivo do empregado sobre uma base de cálculo. */
export function calcularInss(base: number): number {
  if (!Number.isFinite(base) || base <= 0) return 0;
  if (base >= INSS_TETO) return INSS_DESCONTO_TETO;

  let anterior = 0;
  let total = 0;
  for (const banda of INSS_BANDS) {
    if (base <= anterior) break;
    const parcela = Math.min(base, banda.limit) - anterior;
    total += parcela * banda.rate;
    anterior = banda.limit;
  }
  return round2(total);
}

/** Aplica a tabela IRRF mensal a uma base de cálculo. */
export function calcularIrrf(base: number): number {
  if (base <= 0) return 0;
  for (const banda of IRRF_BANDS) {
    if (base <= banda.limit) {
      return round2(Math.max(0, base * banda.rate - banda.deduzir));
    }
  }
  return 0;
}

export function calculate(input: Input): Output {
  const brutoRaw = input.salarioBruto;
  const salarioBruto =
    Number.isFinite(brutoRaw) && brutoRaw > 0 ? brutoRaw : 0;

  // Dias de gozo: clamp em 1..30. Padrão 30 quando inválido.
  const diasRaw = input.diasFerias;
  const diasFerias = Number.isFinite(diasRaw)
    ? Math.min(30, Math.max(1, Math.floor(diasRaw)))
    : 30;

  const venderUmTerco = input.venderUmTerco === true;

  const dependentes = Number.isFinite(input.dependentes)
    ? Math.max(0, Math.floor(input.dependentes as number))
    : 0;

  if (salarioBruto === 0) {
    return {
      salarioBruto: 0,
      diasFerias,
      valorFerias: 0,
      tercoConstitucional: 0,
      abono: 0,
      abonoTerco: 0,
      baseTributavel: 0,
      baseIrrf: 0,
      inss: 0,
      irrf: 0,
      totalBruto: 0,
      totalDescontos: 0,
      totalLiquido: 0,
    };
  }

  const salarioDiario = salarioBruto / 30;

  // Férias gozadas + terço constitucional (tributáveis).
  const valorFerias = round2(salarioDiario * diasFerias);
  const tercoConstitucional = round2(valorFerias / 3);

  // Abono pecuniário: vende sempre 10 dias (1/3 das férias). Isento.
  const abono = venderUmTerco ? round2(salarioDiario * 10) : 0;
  const abonoTerco = venderUmTerco ? round2(abono / 3) : 0;

  // Base tributável: apenas férias gozadas + 1/3 (abono é isento).
  const baseTributavel = round2(valorFerias + tercoConstitucional);

  const inss = calcularInss(baseTributavel);
  const baseIrrf = Math.max(
    0,
    round2(baseTributavel - inss - dependentes * DEDUCAO_DEPENDENTE)
  );
  const irrf = calcularIrrf(baseIrrf);

  const totalBruto = round2(
    valorFerias + tercoConstitucional + abono + abonoTerco
  );
  const totalDescontos = round2(inss + irrf);
  const totalLiquido = round2(totalBruto - totalDescontos);

  return {
    salarioBruto,
    diasFerias,
    valorFerias,
    tercoConstitucional,
    abono,
    abonoTerco,
    baseTributavel,
    baseIrrf,
    inss,
    irrf,
    totalBruto,
    totalDescontos,
    totalLiquido,
  };
}
