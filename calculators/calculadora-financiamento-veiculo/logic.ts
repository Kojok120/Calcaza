// Calculadora de Financiamento de Veículo (Tabela Price / sistema francês).
//
// No financiamento de carro, moto ou caminhão, a forma mais comum de
// amortização é a Tabela Price (sistema francês): a parcela é FIXA do primeiro
// ao último mês. No início, a maior parte da parcela é juro e amortiza-se pouco;
// com o tempo, a proporção se inverte.
//
// Convenção de taxa: aqui a taxa é informada diretamente em % AO MÊS (a.m.),
// como costuma aparecer nas propostas de CDC (Crédito Direto ao Consumidor) das
// financeiras e concessionárias. Não há conversão de taxa anual para mensal.
//
// IMPORTANTE (honestidade YMYL): esta simulação NÃO inclui o CET (Custo
// Efetivo Total). O CET reúne, além dos juros, o IOF (Imposto sobre Operações
// Financeiras), a tarifa de cadastro, o registro do contrato/gravame, eventuais
// seguros e outras tarifas. Por isso, a parcela real do banco costuma ser maior
// do que a estimada aqui — o resultado é uma estimativa para comparação.
//
// Fontes:
//   - Banco Central do Brasil — taxas de juros do financiamento de veículos e
//     conceito de CET (https://www.bcb.gov.br/estatisticas/txjuros)
//   - Banco Central do Brasil — educação financeira / crédito
//     (https://www.bcb.gov.br/cidadaniafinanceira)

export type Input = {
  /** Valor total do veículo, em reais. */
  valorVeiculo: number;
  /** Entrada como porcentagem do valor do veículo (0 a 100). Padrão: 20. */
  entradaPercent: number;
  /** Prazo do financiamento em meses (inteiro, de 12 a 60). Padrão: 48. */
  prazoMeses: number;
  /** Taxa de juros em % ao mês (a.m.), >= 0. Padrão: 1,5. */
  taxaJurosMensal: number;
};

export type Output = {
  /** Valor da parcela mensal fixa (Tabela Price). */
  parcela: number;
  /** Valor da entrada paga à vista, em reais. */
  entrada: number;
  /** Valor efetivamente financiado (valor do veículo − entrada). */
  valorFinanciado: number;
  /** Total de juros pagos (soma das parcelas − valor financiado). */
  totalJuros: number;
  /** Total pago ao fim do contrato (soma das parcelas + entrada). */
  totalPago: number;
  /** Número de parcelas efetivamente usado (prazo, já saneado). */
  n: number;
};

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

function sanearNaoNegativo(valor: number, padrao = 0): number {
  if (!Number.isFinite(valor) || valor < 0) return padrao;
  return valor;
}

// Limites do prazo, alinhados ao formulário (12 a 60 meses).
const PRAZO_MIN = 12;
const PRAZO_MAX = 60;

export function calculate(input: Input): Output {
  const valorVeiculo = sanearNaoNegativo(input.valorVeiculo);

  // Entrada em % entre 0 e 100; valores inválidos viram 0.
  const entradaPercentRaw = Number.isFinite(input.entradaPercent)
    ? input.entradaPercent
    : 0;
  const entradaPercent = clamp(entradaPercentRaw, 0, 100);

  // Prazo: inteiro, limitado entre 12 e 60 meses.
  const prazoRaw = Number.isFinite(input.prazoMeses) ? input.prazoMeses : PRAZO_MIN;
  const n = clamp(Math.floor(prazoRaw), PRAZO_MIN, PRAZO_MAX);

  // Taxa mensal: usa 0 quando ausente / inválida / negativa.
  const taxaJurosMensal = sanearNaoNegativo(input.taxaJurosMensal);

  const entrada = valorVeiculo * (entradaPercent / 100);
  const valorFinanciado = Math.max(0, valorVeiculo - entrada);

  const i = taxaJurosMensal / 100;

  // Sem valor financiado: tudo zero (parcela, juros, total = só a entrada).
  if (valorFinanciado <= 0) {
    return {
      parcela: 0,
      entrada: round2(entrada),
      valorFinanciado: 0,
      totalJuros: 0,
      totalPago: round2(entrada),
      n,
    };
  }

  // Tabela Price: parcela fixa. Se i = 0, divide o principal igualmente.
  const parcela =
    i === 0
      ? valorFinanciado / n
      : (valorFinanciado * i * Math.pow(1 + i, n)) / (Math.pow(1 + i, n) - 1);

  const totalParcelas = parcela * n;
  const totalPago = totalParcelas + entrada;
  const totalJuros = totalParcelas - valorFinanciado;

  return {
    parcela: round2(parcela),
    entrada: round2(entrada),
    valorFinanciado: round2(valorFinanciado),
    totalJuros: round2(totalJuros),
    totalPago: round2(totalPago),
    n,
  };
}
