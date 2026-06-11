// Calculadora de saque-aniversário do FGTS.
// Regra oficial: o valor liberado a cada ano é
//   valorSaque = (saldo total das contas do FGTS × alíquota da faixa) + parcela adicional fixa da faixa.
// A faixa é definida pelo saldo total das contas vinculadas na Caixa.
//
// Base legal e fonte:
//   - Lei nº 8.036/1990, art. 20-A a 20-D (institui o saque-aniversário)
//     https://www.planalto.gov.br/ccivil_03/leis/l8036consol.htm
//   - Decreto nº 10.556/2020, Anexo (tabela de alíquotas e parcelas adicionais)
//     https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2020/decreto/d10556.htm
//   - Caixa Econômica Federal — Saque-Aniversário do FGTS
//     https://www.caixa.gov.br/beneficios-trabalhador/fgts/saque-FGTS/Paginas/default.aspx
//
// A tabela legal é estável e NÃO varia com o salário mínimo: são 7 faixas,
// de "até R$ 500,00" (50%, sem adicional) a "acima de R$ 20.000,00" (5% + R$ 2.900,00).
//
// IMPORTANTE (YMYL): o resultado é uma estimativa. Quem adere ao saque-aniversário
// não pode sacar o saldo total na demissão sem justa causa — recebe apenas a multa
// rescisória de 40%, e o saldo segue bloqueado para os saques anuais.

export type Input = {
  /** Saldo total das contas do FGTS, em reais (>= 0). */
  saldoFgts: number;
};

export type Output = {
  /** Valor liberado no saque-aniversário (saldo × alíquota + parcela adicional). */
  valorSaque: number;
  /** Alíquota da faixa, em fração (ex.: 0.2 para 20%). */
  aliquota: number;
  /** Parcela adicional fixa da faixa, em reais. */
  parcelaAdicional: number;
  /** Rótulo descritivo da faixa de saldo aplicada. */
  faixaLabel: string;
  /** Saldo que permanece na conta após o saque (saldo − valorSaque). */
  saldoRestante: number;
};

type Faixa = {
  /** Limite superior do saldo da faixa, em reais (Infinity na última). */
  ate: number;
  /** Alíquota em fração. */
  aliquota: number;
  /** Parcela adicional fixa em reais. */
  parcelaAdicional: number;
  /** Rótulo legível da faixa. */
  label: string;
};

/**
 * Tabela do saque-aniversário (Decreto nº 10.556/2020, Anexo) — 7 faixas.
 * Os limites usam o teto de cada faixa; a primeira que comportar o saldo é aplicada.
 */
const FAIXAS: Faixa[] = [
  { ate: 500, aliquota: 0.5, parcelaAdicional: 0, label: 'Até R$ 500,00' },
  { ate: 1000, aliquota: 0.4, parcelaAdicional: 50, label: 'De R$ 500,01 a R$ 1.000,00' },
  { ate: 5000, aliquota: 0.3, parcelaAdicional: 150, label: 'De R$ 1.000,01 a R$ 5.000,00' },
  { ate: 10000, aliquota: 0.2, parcelaAdicional: 650, label: 'De R$ 5.000,01 a R$ 10.000,00' },
  { ate: 15000, aliquota: 0.15, parcelaAdicional: 1150, label: 'De R$ 10.000,01 a R$ 15.000,00' },
  { ate: 20000, aliquota: 0.1, parcelaAdicional: 1900, label: 'De R$ 15.000,01 a R$ 20.000,00' },
  { ate: Infinity, aliquota: 0.05, parcelaAdicional: 2900, label: 'Acima de R$ 20.000,00' },
];

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

function sanearNaoNegativo(valor: number | undefined): number {
  if (valor === undefined || !Number.isFinite(valor) || valor < 0) return 0;
  return valor;
}

function escolherFaixa(saldo: number): Faixa {
  return FAIXAS.find((f) => saldo <= f.ate) ?? FAIXAS[FAIXAS.length - 1];
}

export function calculate(input: Input): Output {
  const saldoFgts = sanearNaoNegativo(input.saldoFgts);

  const faixa = escolherFaixa(saldoFgts);

  const valorSaque = round2(saldoFgts * faixa.aliquota + faixa.parcelaAdicional);
  // O saque nunca pode ultrapassar o saldo disponível.
  const valorSaqueLimitado = round2(Math.min(valorSaque, saldoFgts));
  const saldoRestante = round2(saldoFgts - valorSaqueLimitado);

  return {
    valorSaque: valorSaqueLimitado,
    aliquota: faixa.aliquota,
    parcelaAdicional: faixa.parcelaAdicional,
    faixaLabel: faixa.label,
    saldoRestante,
  };
}
