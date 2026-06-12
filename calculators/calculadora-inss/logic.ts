// Calculadora de INSS 2026 — contribuição previdenciária por categoria.
//
// Regras e valores oficiais de 2026:
//   - Salário mínimo 2026: R$ 1.621,00 (piso de contribuição)
//     Ministério do Trabalho e Emprego — gov.br/trabalho-e-emprego
//   - Tabela INSS do empregado (progressiva por faixa) — Portaria Interministerial 2026:
//     gov.br/inss / gov.br/previdencia
//   - Teto do salário de contribuição 2026: R$ 8.475,55
//     (desconto máximo do empregado: R$ 988,09)
//   - Contribuinte individual (autônomo) e facultativo: plano normal 20%
//     sobre o salário de contribuição (entre o piso e o teto).
//     Plano simplificado: 11% sobre o salário mínimo (= R$ 178,31).
//   - Facultativo de baixa renda (CadÚnico) e MEI: 5% sobre o salário mínimo
//     (= R$ 81,05). gov.br/inss / gov.br/previdencia

export type Categoria =
  | 'empregado_clt'
  | 'contribuinte_individual'
  | 'facultativo'
  | 'facultativo_baixa_renda'
  | 'mei';

export type Input = {
  /** Remuneração / salário de contribuição mensal em reais. */
  remuneracao: number;
  /** Categoria de contribuinte do INSS. */
  categoria: Categoria;
};

export type Output = {
  /** Base de cálculo efetivamente usada (salário de contribuição). */
  base: number;
  /** Alíquota nominal aplicada (fração: 0,2 = 20%). Para o empregado, é a alíquota da última faixa atingida. */
  aliquotaNominal: number;
  /** Valor da contribuição mensal ao INSS. */
  contribuicao: number;
  /** Alíquota efetiva sobre a remuneração informada (fração). */
  aliquotaEfetiva: number;
  /** Indica se o teto do salário de contribuição foi aplicado. */
  tetoAplicado: boolean;
};

// --- Valores oficiais 2026 ---
const SALARIO_MINIMO = 1621.0; // salário mínimo 2026 (gov.br/trabalho-e-emprego)
const INSS_TETO = 8475.55; // teto do salário de contribuição 2026 (gov.br/inss)
const INSS_DESCONTO_TETO_EMPREGADO = 988.09; // desconto máximo do empregado no teto

// Tabela progressiva do INSS do empregado 2026.
// Cada alíquota incide apenas sobre a parcela do salário dentro da faixa.
const INSS_BANDS: ReadonlyArray<{ limit: number; rate: number }> = [
  { limit: 1621.0, rate: 0.075 }, // até R$ 1.621,00 -> 7,5%
  { limit: 2902.84, rate: 0.09 }, // R$ 1.621,01 a 2.902,84 -> 9%
  { limit: 4354.27, rate: 0.12 }, // R$ 2.902,85 a 4.354,27 -> 12%
  { limit: 8475.55, rate: 0.14 }, // R$ 4.354,28 a 8.475,55 -> 14%
];

// Alíquotas dos demais planos (sobre o salário de contribuição).
const ALIQUOTA_NORMAL = 0.2; // contribuinte individual / facultativo (plano normal)
const ALIQUOTA_BAIXA_RENDA = 0.05; // facultativo de baixa renda / MEI

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/**
 * Contribuição progressiva do INSS do empregado sobre o salário bruto.
 * Reaproveita a tabela de faixas da calculadora de salário líquido 2026.
 */
export function calcularInssEmpregado(salarioBruto: number): number {
  if (!Number.isFinite(salarioBruto) || salarioBruto <= 0) return 0;
  if (salarioBruto >= INSS_TETO) return INSS_DESCONTO_TETO_EMPREGADO;

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

/** Alíquota nominal (última faixa atingida) do empregado para a remuneração dada. */
function aliquotaNominalEmpregado(salarioBruto: number): number {
  if (salarioBruto >= INSS_TETO) return INSS_BANDS[INSS_BANDS.length - 1].rate;
  let rate = INSS_BANDS[0].rate;
  for (const banda of INSS_BANDS) {
    if (salarioBruto > 0 && salarioBruto > banda.limit) {
      rate = banda.rate;
    } else if (salarioBruto <= banda.limit) {
      rate = banda.rate;
      break;
    }
  }
  return rate;
}

export function calculate(input: Input): Output {
  const remRaw = input?.remuneracao;
  const remuneracao =
    Number.isFinite(remRaw) && (remRaw as number) > 0 ? (remRaw as number) : 0;
  const categoria = input?.categoria;

  // Caso de entrada inválida: tudo zero (mantém categoria-aware piso para os planos fixos abaixo).
  if (categoria === 'empregado_clt') {
    if (remuneracao === 0) {
      return {
        base: 0,
        aliquotaNominal: 0,
        contribuicao: 0,
        aliquotaEfetiva: 0,
        tetoAplicado: false,
      };
    }
    const base = Math.min(remuneracao, INSS_TETO);
    const contribuicao = calcularInssEmpregado(remuneracao);
    return {
      base: round2(base),
      aliquotaNominal: aliquotaNominalEmpregado(remuneracao),
      contribuicao,
      aliquotaEfetiva: round2(contribuicao) / remuneracao,
      tetoAplicado: remuneracao >= INSS_TETO,
    };
  }

  if (
    categoria === 'contribuinte_individual' ||
    categoria === 'facultativo'
  ) {
    // Plano normal: 20% sobre o salário de contribuição (piso = mínimo, teto = INSS_TETO).
    if (remuneracao === 0) {
      // Sem remuneração informada, considera o piso (salário mínimo).
      const base = SALARIO_MINIMO;
      const contribuicao = round2(base * ALIQUOTA_NORMAL);
      return {
        base: round2(base),
        aliquotaNominal: ALIQUOTA_NORMAL,
        contribuicao,
        aliquotaEfetiva: ALIQUOTA_NORMAL,
        tetoAplicado: false,
      };
    }
    const base = Math.min(Math.max(remuneracao, SALARIO_MINIMO), INSS_TETO);
    const contribuicao = round2(base * ALIQUOTA_NORMAL);
    return {
      base: round2(base),
      aliquotaNominal: ALIQUOTA_NORMAL,
      contribuicao,
      aliquotaEfetiva: contribuicao / remuneracao,
      tetoAplicado: remuneracao >= INSS_TETO,
    };
  }

  if (categoria === 'facultativo_baixa_renda' || categoria === 'mei') {
    // 5% sobre o salário mínimo, valor fixo independentemente da remuneração informada.
    const base = SALARIO_MINIMO;
    const contribuicao = round2(base * ALIQUOTA_BAIXA_RENDA);
    return {
      base: round2(base),
      aliquotaNominal: ALIQUOTA_BAIXA_RENDA,
      contribuicao,
      aliquotaEfetiva: ALIQUOTA_BAIXA_RENDA,
      tetoAplicado: false,
    };
  }

  // Categoria desconhecida / ausente: retorna tudo zero.
  return {
    base: 0,
    aliquotaNominal: 0,
    contribuicao: 0,
    aliquotaEfetiva: 0,
    tetoAplicado: false,
  };
}
