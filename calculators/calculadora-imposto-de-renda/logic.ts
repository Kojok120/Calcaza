// Calculadora do Imposto de Renda (IRPF) anual — ajuste da declaração 2026
// (ano-calendário 2026, exercício 2027).
//
// Estima o imposto devido no ano comparando os dois modelos de declaração
// (simplificado x completo) e apura se há restituição ou imposto a pagar,
// confrontando o imposto devido com o IRRF já retido na fonte ao longo do ano.
//
// Tabelas e limites oficiais de 2026 (fontes primárias):
//   - Tabela ANUAL progressiva do IRPF (= tabela mensal de 2026 × 12):
//     Receita Federal — gov.br/receitafederal/pt-br/assuntos/meu-imposto-de-renda/tabelas/2026
//   - Dedução por dependente (R$ 2.275,08/ano), instrução (R$ 3.561,50/ano por pessoa)
//     e desconto simplificado (20%, teto R$ 17.640,00/ano):
//     Receita Federal (tabelas 2026) / Lei nº 9.250/95, arts. 8º e 10.
//   - Isenção até R$ 5.000/mês e redutor até R$ 7.350/mês (afeta a retenção mensal):
//     Lei nº 15.270/2025 — planalto.gov.br. O ajuste anual reconcilia o que foi retido.

export type Input = {
  /** Soma anual dos rendimentos tributáveis (R$ >= 0). */
  rendimentosTributaveisAnuais: number;
  /** IRRF já retido na fonte ao longo do ano (R$ >= 0). */
  impostoRetidoNaFonte?: number;
  /** Número de dependentes para fins de IR (inteiro >= 0). */
  dependentes?: number;
  /** Despesas com instrução (educação) no ano (R$ >= 0). */
  despesasComEducacao?: number;
  /** Despesas com saúde no ano, sem limite legal (R$ >= 0). */
  despesasComSaude?: number;
  /** Contribuição previdenciária oficial (INSS) paga no ano (R$ >= 0). */
  contribuicaoPrevidenciaria?: number;
};

export type Output = {
  /** Rendimentos tributáveis anuais saneados (>= 0). */
  rendimentosTributaveisAnuais: number;
  /** IRRF retido na fonte considerado (>= 0). */
  impostoRetidoNaFonte: number;
  /** Imposto devido no ano (o menor entre simplificado e completo). */
  impostoDevido: number;
  /** Modelo de declaração escolhido (o que gerou menor imposto). */
  modeloUsado: 'simplificado' | 'completo';
  /** Base de cálculo do modelo escolhido. */
  baseCalculo: number;
  /**
   * Acerto do ano: imposto devido − IRRF retido.
   * Negativo = valor a restituir; positivo = imposto a pagar; zero = quitado.
   */
  restituirOuPagar: number;
  /** Situação resumida do acerto anual. */
  situacao: 'a restituir' | 'a pagar' | 'quitado';
  /** Imposto devido pelo modelo simplificado (para comparação). */
  impostoSimplificado: number;
  /** Imposto devido pelo modelo completo (para comparação). */
  impostoCompleto: number;
  /** Alíquota nominal da faixa em que a base de cálculo se enquadra (fração). */
  aliquotaNominal: number;
  /** Alíquota efetiva: imposto devido dividido pelos rendimentos (fração). */
  aliquotaEfetiva: number;
};

// --- Tabela ANUAL progressiva do IRPF 2026 (mensal × 12) ---
// Cada faixa: imposto = base × alíquota − parcela a deduzir (limitado a zero).
const ANNUAL_BANDS: ReadonlyArray<{ limit: number; rate: number; deduzir: number }> = [
  { limit: 29145.6, rate: 0, deduzir: 0 }, // até R$ 29.145,60 -> isento
  { limit: 33919.8, rate: 0.075, deduzir: 2185.92 }, // 7,5%  (182,16 × 12)
  { limit: 45012.6, rate: 0.15, deduzir: 4729.92 }, // 15%   (394,16 × 12)
  { limit: 55976.16, rate: 0.225, deduzir: 8105.88 }, // 22,5% (675,49 × 12)
  { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduzir: 10904.76 }, // 27,5% (908,73 × 12)
];

// --- Deduções e limites anuais 2026 (Receita Federal / Lei 9.250/95) ---
const DEDUCAO_DEPENDENTE = 2275.08; // por dependente, ao ano (189,59 × 12)
const LIMITE_EDUCACAO = 3561.5; // limite de instrução por pessoa, ao ano
const DESCONTO_SIMPLIFICADO_RATE = 0.2; // 20% dos rendimentos tributáveis
const DESCONTO_SIMPLIFICADO_TETO = 17640.0; // teto do desconto simplificado anual

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/** Sanea um valor monetário: finito e > 0, senão 0 (clampa negativos e NaN). */
function saneiaValor(v: number | undefined): number {
  return Number.isFinite(v) && (v as number) > 0 ? (v as number) : 0;
}

/** Aplica a tabela anual a uma base: max(0, base × alíquota − parcela a deduzir). */
function aplicarTabelaAnual(base: number): number {
  if (base <= 0) return 0;
  for (const banda of ANNUAL_BANDS) {
    if (base <= banda.limit) {
      return Math.max(0, base * banda.rate - banda.deduzir);
    }
  }
  return 0;
}

/** Alíquota nominal da faixa em que a base de cálculo se enquadra. */
function aliquotaDaFaixa(base: number): number {
  if (base <= 0) return 0;
  for (const banda of ANNUAL_BANDS) {
    if (base <= banda.limit) return banda.rate;
  }
  return 0;
}

export function calculate(input: Input): Output {
  const rendimentos = saneiaValor(input.rendimentosTributaveisAnuais);
  const impostoRetidoNaFonte = saneiaValor(input.impostoRetidoNaFonte);

  const dependentes = Number.isFinite(input.dependentes)
    ? Math.max(0, Math.floor(input.dependentes as number))
    : 0;

  const despesasComEducacao = saneiaValor(input.despesasComEducacao);
  const despesasComSaude = saneiaValor(input.despesasComSaude);
  const contribuicaoPrevidenciaria = saneiaValor(input.contribuicaoPrevidenciaria);

  // --- Modelo simplificado: desconto de 20% dos rendimentos (teto R$ 17.640) ---
  const descontoSimplificado = Math.min(
    DESCONTO_SIMPLIFICADO_RATE * rendimentos,
    DESCONTO_SIMPLIFICADO_TETO
  );
  const baseSimplificada = Math.max(0, rendimentos - descontoSimplificado);
  const impostoSimplificado = aplicarTabelaAnual(baseSimplificada);

  // --- Modelo completo: deduções legais ---
  // Educação tem limite por pessoa (declarante + dependentes).
  const limiteEducacao = LIMITE_EDUCACAO * Math.max(1, dependentes + 1);
  const educacaoDedutivel = Math.min(despesasComEducacao, limiteEducacao);
  const deducoesCompletas =
    dependentes * DEDUCAO_DEPENDENTE +
    educacaoDedutivel +
    despesasComSaude +
    contribuicaoPrevidenciaria;
  const baseCompleta = Math.max(0, rendimentos - deducoesCompletas);
  const impostoCompleto = aplicarTabelaAnual(baseCompleta);

  // --- Escolhe o modelo mais vantajoso (menor imposto) ---
  let impostoDevido: number;
  let modeloUsado: 'simplificado' | 'completo';
  let baseCalculo: number;
  if (impostoCompleto < impostoSimplificado) {
    impostoDevido = impostoCompleto;
    modeloUsado = 'completo';
    baseCalculo = baseCompleta;
  } else {
    impostoDevido = impostoSimplificado;
    modeloUsado = 'simplificado';
    baseCalculo = baseSimplificada;
  }

  impostoDevido = round2(impostoDevido);

  // --- Acerto anual: imposto devido − IRRF retido ---
  const restituirOuPagar = round2(impostoDevido - impostoRetidoNaFonte);
  let situacao: 'a restituir' | 'a pagar' | 'quitado';
  if (restituirOuPagar < 0) {
    situacao = 'a restituir';
  } else if (restituirOuPagar > 0) {
    situacao = 'a pagar';
  } else {
    situacao = 'quitado';
  }

  return {
    rendimentosTributaveisAnuais: round2(rendimentos),
    impostoRetidoNaFonte: round2(impostoRetidoNaFonte),
    impostoDevido,
    modeloUsado,
    baseCalculo: round2(baseCalculo),
    restituirOuPagar,
    situacao,
    impostoSimplificado: round2(impostoSimplificado),
    impostoCompleto: round2(impostoCompleto),
    aliquotaNominal: aliquotaDaFaixa(baseCalculo),
    aliquotaEfetiva: rendimentos > 0 ? impostoDevido / rendimentos : 0,
  };
}
