// Calculadora de Financiamento Imobiliário (SAC e Price / Tabela Price).
//
// Sistemas de amortização usados no crédito imobiliário brasileiro:
//   - SAC (Sistema de Amortização Constante): a parcela de amortização é fixa
//     e os juros incidem sobre o saldo devedor, que cai a cada mês. Logo, a
//     parcela é decrescente — começa mais alta e termina mais baixa. É o
//     sistema mais comum no financiamento da casa própria (Caixa).
//   - Price (Tabela Price / sistema francês): a parcela é fixa do começo ao
//     fim. No início, a maior parte da parcela é juro; com o tempo, amortiza-se
//     mais. Paga-se mais juros no total do que no SAC, para o mesmo prazo.
//
// Conversão da taxa: o banco informa a taxa em % ao ano (a.a.). Aqui usamos a
// TAXA MENSAL EQUIVALENTE composta: i = (1 + taxaAnual)^(1/12) − 1. Alguns
// contratos usam taxa nominal (taxaAnual / 12); por isso a simulação é uma
// estimativa e pode divergir do contrato do banco.
//
// IMPORTANTE (honestidade YMYL): esta simulação NÃO inclui o CET (Custo
// Efetivo Total), os seguros obrigatórios (MIP — Morte e Invalidez Permanente;
// DFI — Danos Físicos ao Imóvel) nem a taxa de administração mensal que o banco
// cobra. A parcela real costuma ser maior do que a estimada aqui.
//
// Fontes:
//   - Banco Central do Brasil — financiamento imobiliário e Calculadora do
//     Cidadão (https://www.bcb.gov.br/cidadaniafinanceira)
//   - Caixa Econômica Federal — habitação / financiamento de imóvel
//     (https://www.caixa.gov.br/voce/habitacao)

export type SistemaAmortizacao = 'SAC' | 'PRICE';

export type Input = {
  /** Valor total do imóvel, em reais. */
  valorImovel: number;
  /** Valor da entrada (sinal), em reais. Padrão: 0. */
  entrada?: number;
  /** Taxa de juros efetiva em % ao ano (a.a.), convertida em taxa mensal equivalente. Padrão: 0. */
  taxaJurosAnual: number;
  /** Prazo do financiamento em meses (inteiro > 0). */
  prazoMeses: number;
  /** Sistema de amortização: 'SAC' (decrescente) ou 'PRICE' (fixa). Padrão: 'SAC'. */
  sistema?: SistemaAmortizacao;
};

export type Output = {
  /** Valor efetivamente financiado (valor do imóvel − entrada). */
  valorFinanciado: number;
  /** Primeira parcela do financiamento. No SAC é a maior; no Price é igual à final. */
  parcelaInicial: number;
  /** Última parcela do financiamento. No SAC é a menor; no Price é igual à inicial. */
  parcelaFinal: number;
  /** Total pago ao fim do contrato (soma de todas as parcelas). */
  totalPago: number;
  /** Total de juros pagos (total pago − valor financiado). */
  totalJuros: number;
  /** Sistema de amortização efetivamente aplicado. */
  sistema: SistemaAmortizacao;
};

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

function sanearNaoNegativo(valor: number | undefined, padrao = 0): number {
  if (valor === undefined || !Number.isFinite(valor) || valor < 0) return padrao;
  return valor;
}

export function calculate(input: Input): Output {
  const sistema: SistemaAmortizacao = input.sistema === 'PRICE' ? 'PRICE' : 'SAC';

  const valorImovel = sanearNaoNegativo(input.valorImovel);
  const entrada = sanearNaoNegativo(input.entrada);

  // Prazo: inteiro > 0; caso contrário, tudo zero.
  const prazoRaw = input.prazoMeses;
  const n =
    Number.isFinite(prazoRaw) && (prazoRaw as number) > 0
      ? Math.floor(prazoRaw as number)
      : 0;

  // Taxa anual: usa 0 quando ausente/ inválida/ negativa.
  const taxaJurosAnual = sanearNaoNegativo(input.taxaJurosAnual);

  const valorFinanciado = Math.max(0, valorImovel - entrada);

  // Taxa mensal equivalente composta.
  const i = Math.pow(1 + taxaJurosAnual / 100, 1 / 12) - 1;

  // Casos sem financiamento ou sem prazo: tudo zero.
  if (n <= 0 || valorFinanciado <= 0) {
    return {
      valorFinanciado: round2(valorFinanciado),
      parcelaInicial: 0,
      parcelaFinal: 0,
      totalPago: 0,
      totalJuros: 0,
      sistema,
    };
  }

  if (sistema === 'PRICE') {
    // Parcela fixa (PMT). Se i = 0, divide igualmente o principal.
    const pmt =
      i === 0
        ? valorFinanciado / n
        : (valorFinanciado * i) / (1 - Math.pow(1 + i, -n));
    const totalPago = pmt * n;
    const totalJuros = totalPago - valorFinanciado;
    return {
      valorFinanciado: round2(valorFinanciado),
      parcelaInicial: round2(pmt),
      parcelaFinal: round2(pmt),
      totalPago: round2(totalPago),
      totalJuros: round2(totalJuros),
      sistema,
    };
  }

  // SAC: amortização constante; juros sobre o saldo devedor (parcela decrescente).
  const amortizacao = valorFinanciado / n;
  let saldo = valorFinanciado;
  let totalJuros = 0;
  let primeiraParcela = 0;
  let ultimaParcela = 0;
  for (let m = 1; m <= n; m++) {
    const juros = saldo * i;
    const parcela = amortizacao + juros;
    if (m === 1) primeiraParcela = parcela;
    if (m === n) ultimaParcela = parcela;
    totalJuros += juros;
    saldo -= amortizacao;
  }
  const totalPago = valorFinanciado + totalJuros;

  return {
    valorFinanciado: round2(valorFinanciado),
    parcelaInicial: round2(primeiraParcela),
    parcelaFinal: round2(ultimaParcela),
    totalPago: round2(totalPago),
    totalJuros: round2(totalJuros),
    sistema,
  };
}
