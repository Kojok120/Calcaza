// Calculadora de 13º Salário 2026 (gratificação natalina, CLT).
// Regras e tabelas oficiais de 2026:
//   - Direito ao 13º e proporcionalidade (1/12 por mês trabalhado, mês com >= 15 dias conta):
//     Lei nº 4.090/1962 — planalto.gov.br/ccivil_03/leis/l4090.htm
//     CLT (Decreto-Lei nº 5.452/1943) — planalto.gov.br/ccivil_03/decreto-lei/del5452.htm
//   - Tabela INSS (contribuição do empregado, progressiva por faixa), aplicada sobre o 13º integral:
//     Portaria Interministerial 2026 — gov.br/inss / gov.br/previdencia
//   - Tabela IRRF mensal 2026 (tributação exclusiva na fonte sobre o 13º):
//     Receita Federal — gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
//
// IMPORTANTE: o 13º salário tem tributação própria (exclusiva na fonte), separada do salário mensal.
// O INSS incide sobre o valor INTEGRAL do 13º (não sobre cada parcela) e o IRRF sobre a base
// (13º bruto − INSS − dependentes). NÃO se aplica o redutor da Lei 15.270/2025 ao 13º.

export type Input = {
  /** Salário bruto mensal em reais. */
  salarioBruto: number;
  /** Meses trabalhados no ano (0 a 12). Mês com >= 15 dias trabalhados conta como mês cheio. */
  mesesTrabalhados: number;
  /** Número de dependentes (inteiro >= 0). Padrão: 0. */
  dependentes?: number;
  /** Média de adicionais que integram o 13º (horas extras, adicional noturno etc.), em R$. Padrão: 0. */
  mediaAdicionais?: number;
};

export type Output = {
  /** Valor bruto do 13º salário (proporcional aos meses trabalhados). */
  decimoBruto: number;
  /** 1ª parcela (metade do 13º bruto, paga até 30/11, sem descontos). */
  primeiraParcela: number;
  /** Desconto do INSS sobre o 13º integral. */
  inss: number;
  /** Desconto do IRRF (tributação exclusiva na fonte) sobre o 13º. */
  irrf: number;
  /** 2ª parcela (metade do 13º bruto menos INSS e IRRF, paga até 20/12). */
  segundaParcela: number;
  /** Total líquido do 13º (1ª + 2ª parcela). */
  totalLiquido: number;
  /** Alíquota efetiva total de descontos sobre o 13º bruto (fração: 0,12 = 12%). */
  aliquotaEfetiva: number;
};

// --- Tabela INSS 2026 (contribuição do empregado) ---
// Cada alíquota incide apenas sobre a parcela do valor dentro da faixa.
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
const DEDUCAO_DEPENDENTE = 189.59; // dedução por dependente

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/** INSS progressivo do empregado sobre um valor base (aqui, o 13º integral). */
export function calcularInss(valor: number): number {
  if (!Number.isFinite(valor) || valor <= 0) return 0;
  if (valor >= INSS_TETO) return INSS_DESCONTO_TETO;

  let anterior = 0;
  let total = 0;
  for (const banda of INSS_BANDS) {
    if (valor <= anterior) break;
    const parcela = Math.min(valor, banda.limit) - anterior;
    total += parcela * banda.rate;
    anterior = banda.limit;
  }
  return round2(total);
}

/** Aplica a tabela IRRF a uma base de cálculo (sem o redutor da Lei 15.270/2025). */
export function calcularIrrf(base: number): number {
  if (!Number.isFinite(base) || base <= 0) return 0;
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

  const adicionaisRaw = input.mediaAdicionais;
  const mediaAdicionais =
    Number.isFinite(adicionaisRaw) && (adicionaisRaw as number) > 0
      ? (adicionaisRaw as number)
      : 0;

  // Meses: clamp 0–12 (mês com >= 15 dias conta como mês cheio — entrada já em meses inteiros).
  let mesesTrabalhados = Number.isFinite(input.mesesTrabalhados)
    ? Math.floor(input.mesesTrabalhados as number)
    : 0;
  if (mesesTrabalhados < 0) mesesTrabalhados = 0;
  if (mesesTrabalhados > 12) mesesTrabalhados = 12;

  const dependentes = Number.isFinite(input.dependentes)
    ? Math.max(0, Math.floor(input.dependentes as number))
    : 0;

  // Base do 13º = salário bruto + médias de adicionais que o integram.
  const baseDecimo = salarioBruto + mediaAdicionais;

  // 13º bruto proporcional aos meses trabalhados.
  const decimoBruto = round2((baseDecimo / 12) * mesesTrabalhados);

  if (decimoBruto <= 0) {
    return {
      decimoBruto: 0,
      primeiraParcela: 0,
      inss: 0,
      irrf: 0,
      segundaParcela: 0,
      totalLiquido: 0,
      aliquotaEfetiva: 0,
    };
  }

  // 1ª parcela: metade do 13º bruto, sem descontos (paga até 30/11).
  const primeiraParcela = round2(decimoBruto / 2);

  // Tributação exclusiva na fonte: INSS sobre o 13º integral.
  const inss = calcularInss(decimoBruto);

  // IRRF sobre (13º bruto − INSS − dependentes), tabela padrão (sem redutor da Lei 15.270/2025).
  const baseIrrf = Math.max(0, decimoBruto - inss - dependentes * DEDUCAO_DEPENDENTE);
  const irrf = calcularIrrf(baseIrrf);

  // 2ª parcela: outra metade menos os descontos (paga até 20/12).
  const segundaParcela = round2(decimoBruto / 2 - inss - irrf);

  // Total líquido = 13º bruto − INSS − IRRF.
  const totalLiquido = round2(decimoBruto - inss - irrf);

  return {
    decimoBruto,
    primeiraParcela,
    inss,
    irrf,
    segundaParcela,
    totalLiquido,
    aliquotaEfetiva: decimoBruto > 0 ? round2((inss + irrf) / decimoBruto * 10000) / 10000 : 0,
  };
}
