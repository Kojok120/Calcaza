// Calculadora do Simples Nacional 2026.
//
// O Simples Nacional é um regime tributário simplificado para micro e pequenas
// empresas. O valor do DAS de cada mês depende de três coisas:
//   1) o Anexo da atividade (I, II, III ou V);
//   2) a receita bruta dos últimos 12 meses (RBT12), que define a faixa;
//   3) o faturamento do próprio mês (receitaMes).
//
// A alíquota efetiva (a que realmente é aplicada) sai da fórmula progressiva:
//   alíquota efetiva = (RBT12 × alíquota nominal − parcela a deduzir) / RBT12
// e o DAS do mês = receitaMes × alíquota efetiva.
//
// As tabelas (faixas, alíquotas nominais e parcelas a deduzir) estão na
// Lei Complementar nº 123/2006 (anexos) e são estáveis — não mudam todo ano.
//
// Fontes oficiais:
//   - Lei Complementar nº 123/2006 (anexos do Simples Nacional):
//     https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp123.htm
//   - Portal do Simples Nacional (Receita Federal):
//     https://www8.receita.fazenda.gov.br/SimplesNacional/
//   - Receita Federal — Simples Nacional:
//     https://www.gov.br/receitafederal/pt-br

export type Anexo = 'I' | 'II' | 'III' | 'V';

export type Input = {
  /** Anexo da atividade: I (comércio), II (indústria), III ou V (serviços). */
  anexo: Anexo;
  /** Receita bruta acumulada dos últimos 12 meses (RBT12), em reais. */
  rbt12: number;
  /** Faturamento (receita bruta) do próprio mês, em reais. */
  receitaMes: number;
};

export type Output = {
  /** Número da faixa de RBT12 (1 a 6). 0 quando o limite foi excedido. */
  faixa: number;
  /** Alíquota nominal da faixa (em decimal, ex.: 0,06 = 6%). */
  aliquotaNominal: number;
  /** Parcela a deduzir da faixa, em reais. */
  parcelaDeduzir: number;
  /** Alíquota efetiva aplicada (em decimal). */
  aliquotaEfetiva: number;
  /** DAS estimado do mês, em reais (2 casas). */
  das: number;
  /** Indica se a RBT12 ultrapassou o limite do Simples (R$ 4.800.000). */
  excedeuLimite: boolean;
};

type Faixa = {
  /** Limite superior de RBT12 da faixa, em reais. */
  limite: number;
  /** Alíquota nominal, em decimal. */
  nominal: number;
  /** Parcela a deduzir, em reais. */
  deduzir: number;
};

// Limite máximo de receita bruta anual do Simples Nacional (LC 123/2006).
const LIMITE_SIMPLES = 4_800_000;

// As faixas de RBT12 são iguais para todos os anexos. Muda só nominal/deduzir.
// Tabelas conforme os Anexos I, II, III e V da LC 123/2006.
const TABELAS: Record<Anexo, ReadonlyArray<Faixa>> = {
  // Anexo I — Comércio.
  I: [
    { limite: 180_000, nominal: 0.04, deduzir: 0 },
    { limite: 360_000, nominal: 0.073, deduzir: 5_940 },
    { limite: 720_000, nominal: 0.095, deduzir: 13_860 },
    { limite: 1_800_000, nominal: 0.107, deduzir: 22_500 },
    { limite: 3_600_000, nominal: 0.143, deduzir: 87_300 },
    { limite: 4_800_000, nominal: 0.19, deduzir: 378_000 },
  ],
  // Anexo II — Indústria.
  II: [
    { limite: 180_000, nominal: 0.045, deduzir: 0 },
    { limite: 360_000, nominal: 0.078, deduzir: 5_940 },
    { limite: 720_000, nominal: 0.1, deduzir: 13_860 },
    { limite: 1_800_000, nominal: 0.112, deduzir: 22_500 },
    { limite: 3_600_000, nominal: 0.147, deduzir: 85_500 },
    { limite: 4_800_000, nominal: 0.3, deduzir: 720_000 },
  ],
  // Anexo III — Serviços (locação, agências, escritórios etc.).
  III: [
    { limite: 180_000, nominal: 0.06, deduzir: 0 },
    { limite: 360_000, nominal: 0.112, deduzir: 9_360 },
    { limite: 720_000, nominal: 0.135, deduzir: 17_640 },
    { limite: 1_800_000, nominal: 0.16, deduzir: 35_640 },
    { limite: 3_600_000, nominal: 0.21, deduzir: 125_640 },
    { limite: 4_800_000, nominal: 0.33, deduzir: 648_000 },
  ],
  // Anexo V — Serviços (TI, engenharia, consultoria etc., conforme fator R).
  V: [
    { limite: 180_000, nominal: 0.155, deduzir: 0 },
    { limite: 360_000, nominal: 0.18, deduzir: 4_500 },
    { limite: 720_000, nominal: 0.195, deduzir: 9_900 },
    { limite: 1_800_000, nominal: 0.205, deduzir: 17_100 },
    { limite: 3_600_000, nominal: 0.23, deduzir: 62_100 },
    { limite: 4_800_000, nominal: 0.305, deduzir: 540_000 },
  ],
};

const ANEXOS_VALIDOS: ReadonlyArray<Anexo> = ['I', 'II', 'III', 'V'];

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

/** Saneia números de entrada: NaN/negativo/Infinity viram 0. */
function sanearValor(x: unknown): number {
  const n = typeof x === 'number' ? x : Number(x);
  if (!Number.isFinite(n) || n < 0) return 0;
  return n;
}

function sanearAnexo(a: unknown): Anexo {
  return ANEXOS_VALIDOS.includes(a as Anexo) ? (a as Anexo) : 'I';
}

/** Encontra o índice (0-based) da faixa pela RBT12. */
function indiceFaixa(tabela: ReadonlyArray<Faixa>, rbt12: number): number {
  for (let i = 0; i < tabela.length; i++) {
    if (rbt12 <= tabela[i].limite) return i;
  }
  return tabela.length - 1; // até 4,8M cai na última faixa
}

export function calculate(input: Input): Output {
  const anexo = sanearAnexo(input?.anexo);
  const rbt12 = sanearValor(input?.rbt12);
  const receitaMes = sanearValor(input?.receitaMes);
  const tabela = TABELAS[anexo];

  // Acima do limite do Simples: não há alíquota aplicável.
  if (rbt12 > LIMITE_SIMPLES) {
    return {
      faixa: 0,
      aliquotaNominal: 0,
      parcelaDeduzir: 0,
      aliquotaEfetiva: 0,
      das: 0,
      excedeuLimite: true,
    };
  }

  const idx = indiceFaixa(tabela, rbt12);
  const faixaInfo = tabela[idx];
  const aliquotaNominal = faixaInfo.nominal;
  const parcelaDeduzir = faixaInfo.deduzir;

  // alíquota efetiva = (RBT12 × nominal − parcela) / RBT12.
  // Quando RBT12 = 0 não dá para dividir; usa-se a nominal da faixa 1.
  const aliquotaEfetiva =
    rbt12 > 0 ? (rbt12 * aliquotaNominal - parcelaDeduzir) / rbt12 : tabela[0].nominal;

  const das = round2(receitaMes * aliquotaEfetiva);

  return {
    faixa: idx + 1,
    aliquotaNominal,
    parcelaDeduzir,
    aliquotaEfetiva,
    das,
    excedeuLimite: false,
  };
}
