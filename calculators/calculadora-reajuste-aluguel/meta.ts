import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-reajuste-aluguel',
  title: 'Calculadora de Reajuste de Aluguel',
  description:
    'Calcule o novo valor do aluguel após o reajuste anual: informe o aluguel atual e o índice acumulado (IGP-M, IPCA ou INPC) e veja o aumento em reais.',
  primaryKw: 'calculadora reajuste aluguel',
  relatedKws: [
    'reajuste de aluguel igp-m',
    'como calcular reajuste do aluguel',
    'reajuste aluguel ipca',
    'cálculo reajuste anual aluguel',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-29',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-05-29',
  faqs: [
    {
      q: 'Como se calcula o reajuste do aluguel?',
      a: 'O reajuste aplica o índice acumulado do período sobre o aluguel atual: novo aluguel = aluguel atual × (1 + índice acumulado ÷ 100). Por exemplo, um aluguel de R$ 1.500 com IGP-M acumulado de 4% em 12 meses passa para R$ 1.560, um aumento de R$ 60. O percentual usado é o acumulado do período (em geral 12 meses), e não o índice de um único mês.',
    },
    {
      q: 'Qual índice é usado para reajustar o aluguel?',
      a: 'Quem define o índice é o contrato. O mais comum em aluguéis residenciais é o IGP-M, calculado pela Fundação Getulio Vargas (FGV). Também aparecem o IPCA e o INPC, ambos do IBGE. Use sempre o índice escrito no seu contrato e o percentual acumulado divulgado pela fonte oficial.',
    },
    {
      q: 'De quanto em quanto tempo o aluguel pode ser reajustado?',
      a: 'Pela Lei do Inquilinato (Lei nº 8.245/1991), o aluguel só pode ser reajustado uma vez por ano, na data-base prevista no contrato (em geral o aniversário do contrato). Reajustes em intervalos menores que doze meses não são permitidos.',
    },
    {
      q: 'O aluguel pode diminuir no reajuste?',
      a: 'Pode. Quando o índice acumulado fica negativo — ou seja, há deflação no período —, o reajuste reduz o valor do aluguel. O IGP-M, por exemplo, já apresentou acumulados negativos em alguns períodos. Nesses casos, aplicar o índice resulta em um valor menor que o aluguel anterior.',
    },
    {
      q: 'Onde encontro o índice acumulado para preencher?',
      a: 'O IGP-M acumulado é divulgado pela FGV; o IPCA e o INPC acumulados, pelo IBGE. Procure pelo acumulado dos últimos 12 meses (ou do período do seu contrato) na data-base do reajuste. Esta calculadora pede esse percentual como entrada justamente para que você use o número oficial e atualizado.',
    },
    {
      q: 'Posso negociar o reajuste com o proprietário?',
      a: 'Sim. O índice do contrato é a referência, mas reajuste e negociação não se excluem. Em períodos de índice alto, é comum inquilino e proprietário acordarem um aumento menor que o cheio para manter o contrato. O valor calculado aqui é uma estimativa do reajuste pelo índice; o valor final pode ser negociado entre as partes.',
    },
  ],
  affiliates: [],
};
