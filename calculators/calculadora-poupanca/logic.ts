// Calculadora de Rendimento da Poupança.
//
// A regra de remuneração da poupança é fixada em LEI e tem dois regimes,
// definidos pela taxa Selic meta. As taxas de mercado (Selic e TR) são
// INPUT do usuário e editáveis — esta calculadora não busca dados externos.
//
// Regra da poupança (Lei nº 12.703/2012, vigente desde 04/05/2012):
//   - Selic meta > 8,5% a.a. → rendimento = 0,5% ao mês + TR.
//   - Selic meta ≤ 8,5% a.a. → rendimento = 70% da Selic (ao mês) + TR.
//   Fonte: https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2012/lei/l12703.htm
//   Operacionalização: Banco Central do Brasil — Remuneração dos depósitos de
//   poupança: https://www4.bcb.gov.br/pec/poupanca/poupanca.asp
//
// O "70% da Selic ao mês" é aplicado como 0,7 × Selic_anual / 12 (em pontos
// percentuais ao mês), conforme a leitura operacional da regra; a TR (Taxa
// Referencial) é somada como pontos percentuais ao mês.
//   Fonte (Selic e TR, valores variáveis no tempo): Banco Central do Brasil
//   https://www.bcb.gov.br/controleinflacao/historicotaxasjuros
//
// Montante com depósitos mensais (capitalização composta):
//   M = C × (1 + t)^n + D × [ ((1 + t)^n − 1) / t ]   (quando t = 0: M = C + D × n)
//   C = valorInicial, D = depositoMensal, t = taxa mensal (decimal), n = meses
//
// A poupança é ISENTA de Imposto de Renda para pessoa física.

/** Limite da Selic meta (a.a.) que separa os dois regimes — Lei 12.703/2012. */
const SELIC_LIMITE = 8.5;

/** Rendimento fixo (ao mês, em %) quando a Selic > 8,5% a.a. — Lei 12.703/2012. */
const RENDIMENTO_FIXO_MENSAL = 0.5;

/** Fração da Selic usada no regime de Selic ≤ 8,5% a.a. — Lei 12.703/2012. */
const FRACAO_SELIC = 0.7;

/** Prazo mínimo e máximo em meses aceitos pela calculadora. */
const PRAZO_MIN = 1;
const PRAZO_MAX = 600;

export type RegraUsada = '0,5% + TR' | '70% da Selic + TR';

export type Input = {
  /** Valor depositado no início (R$). Padrão: 0. */
  valorInicial?: number;
  /** Depósito feito a cada mês (R$). Padrão: 0. */
  depositoMensal?: number;
  /** Prazo em meses (1 a 600). Padrão: 12. */
  prazoMeses?: number;
  /** Selic meta anual (% a.a.). Editável (varia por Copom). Padrão: 14,5. */
  selicAnual?: number;
  /** TR mensal (% a.m.). Editável (varia mês a mês). Padrão: 0,17. */
  trMensal?: number;
};

export type Output = {
  /** Valor acumulado ao final do prazo (R$). */
  valorFinal: number;
  /** Total efetivamente depositado (inicial + depósitos mensais) (R$). */
  totalDepositado: number;
  /** Rendimento acumulado (valorFinal − totalDepositado) (R$). */
  rendimento: number;
  /** Taxa mensal de rendimento aplicada (% a.m.). */
  taxaMensalAplicada: number;
  /** Qual das duas regras da Lei 12.703/2012 foi aplicada. */
  regraUsada: RegraUsada;
  /** Prazo em meses efetivamente usado no cálculo. */
  prazoMeses: number;
};

function round2(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

function round4(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 10000) / 10000;
}

/** Saneia um número não-negativo: NaN/Infinity/negativo -> 0. */
function naoNegativo(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x) || x < 0) return 0;
  return x;
}

/** Mantém o prazo dentro de [PRAZO_MIN, PRAZO_MAX] e inteiro. */
function clampPrazo(x: number | undefined): number {
  const n = Math.floor(naoNegativo(x ?? PRAZO_MIN));
  if (n < PRAZO_MIN) return PRAZO_MIN;
  if (n > PRAZO_MAX) return PRAZO_MAX;
  return n;
}

export function calculate(input: Input): Output {
  const valorInicial = naoNegativo(input.valorInicial);
  const depositoMensal = naoNegativo(input.depositoMensal);
  const prazoMeses = clampPrazo(input.prazoMeses);
  const selicAnual = naoNegativo(input.selicAnual);
  const trMensal = naoNegativo(input.trMensal);

  // Define o regime e a taxa mensal de rendimento (em %), conforme a lei.
  let rendMensalPercent: number;
  let regraUsada: RegraUsada;
  if (selicAnual > SELIC_LIMITE) {
    rendMensalPercent = RENDIMENTO_FIXO_MENSAL + trMensal;
    regraUsada = '0,5% + TR';
  } else {
    rendMensalPercent = (FRACAO_SELIC * selicAnual) / 12 + trMensal;
    regraUsada = '70% da Selic + TR';
  }

  const t = rendMensalPercent / 100; // taxa mensal em decimal
  const n = prazoMeses;

  // Montante com capitalização composta e depósitos mensais.
  let valorFinal: number;
  if (t === 0) {
    valorFinal = valorInicial + depositoMensal * n;
  } else {
    const fator = Math.pow(1 + t, n);
    valorFinal = valorInicial * fator + depositoMensal * ((fator - 1) / t);
  }

  const totalDepositado = valorInicial + depositoMensal * n;
  const rendimento = valorFinal - totalDepositado;

  return {
    valorFinal: round2(valorFinal),
    totalDepositado: round2(totalDepositado),
    rendimento: round2(rendimento),
    taxaMensalAplicada: round4(rendMensalPercent),
    regraUsada,
    prazoMeses,
  };
}
