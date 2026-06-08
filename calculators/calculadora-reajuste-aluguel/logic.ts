// Calculadora de Reajuste de Aluguel.
//
// O reajuste anual do aluguel residencial segue a Lei do Inquilinato
// (Lei nº 8.245/1991): o valor pode ser corrigido, no máximo, uma vez por ano,
// na data-base do contrato, pelo índice que as partes acordaram em contrato.
//
// O cálculo é uma matemática simples de correção:
//   novoAluguel  = aluguelAtual × (1 + indiceAcumulado / 100)
//   valorAumento = novoAluguel − aluguelAtual
//
// IMPORTANTE: o índice acumulado é INPUT do usuário (o percentual acumulado no
// período, normalmente os últimos 12 meses). Isso evita números desatualizados —
// quem usa a calculadora informa o índice vigente lido na fonte oficial.
//
// O campo "indice" é apenas um RÓTULO (qual índice o contrato usa); ele não
// altera a conta. O índice pode ser negativo (deflação), e nesse caso o aluguel
// é reduzido — situação que ocorreu com o IGP-M em alguns períodos.
//
// Fontes dos índices (consulte o percentual acumulado oficial):
//   - IGP-M: Fundação Getulio Vargas (FGV) — índice mais usado em aluguéis.
//     https://portalibre.fgv.br/
//   - IPCA e INPC: Instituto Brasileiro de Geografia e Estatística (IBGE).
//     https://www.ibge.gov.br/
//   - Base legal do reajuste anual: Lei nº 8.245/1991 (Lei do Inquilinato).
//     https://www.planalto.gov.br/ccivil_03/leis/l8245.htm

export type IndiceReajuste = 'IGP-M' | 'IPCA' | 'INPC' | 'outro';

export type Input = {
  /** Valor atual do aluguel, em reais. */
  aluguelAtual: number;
  /** Índice acumulado no período, em % (ex.: IGP-M de 12 meses = 4 significa 4%). Pode ser negativo (deflação). */
  indiceAcumulado: number;
  /** Rótulo do índice usado no contrato. Não altera o cálculo. Padrão: 'IGP-M'. */
  indice?: IndiceReajuste;
};

export type Output = {
  /** Novo valor do aluguel após o reajuste, arredondado a 2 casas. */
  novoAluguel: number;
  /** Diferença entre o novo aluguel e o atual (pode ser negativa em deflação). */
  valorAumento: number;
  /** Índice acumulado efetivamente aplicado, em %. */
  indiceAcumulado: number;
  /** Rótulo do índice aplicado. */
  indice: IndiceReajuste;
};

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

const INDICES_VALIDOS: IndiceReajuste[] = ['IGP-M', 'IPCA', 'INPC', 'outro'];

export function calculate(input: Input): Output {
  // Rótulo do índice: usa o informado se for válido; caso contrário, 'IGP-M'.
  const indice: IndiceReajuste = INDICES_VALIDOS.includes(input.indice as IndiceReajuste)
    ? (input.indice as IndiceReajuste)
    : 'IGP-M';

  // Aluguel atual: não pode ser negativo nem NaN → vira 0.
  const aluguelAtual =
    Number.isFinite(input.aluguelAtual) && input.aluguelAtual > 0
      ? input.aluguelAtual
      : 0;

  // Índice acumulado: pode ser negativo (deflação). Apenas NaN/infinito → 0.
  const indiceAcumulado = Number.isFinite(input.indiceAcumulado)
    ? input.indiceAcumulado
    : 0;

  const novoAluguel = aluguelAtual * (1 + indiceAcumulado / 100);
  const valorAumento = novoAluguel - aluguelAtual;

  return {
    novoAluguel: round2(novoAluguel),
    valorAumento: round2(valorAumento),
    indiceAcumulado,
    indice,
  };
}
