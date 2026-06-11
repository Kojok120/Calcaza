import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-juros-cartao',
  title: 'Calculadora de Juros do Cartão de Crédito',
  description:
    'Estime quanto cresce a dívida do cartão no rotativo ou em atraso: informe o saldo, a taxa mensal e os meses para ver o montante, os juros e a taxa anual.',
  primaryKw: 'calculadora juros cartão de crédito',
  relatedKws: [
    'juros rotativo cartão',
    'quanto pago de juros cartão',
    'calcular juros atraso cartão',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-10',
  updatedAt: '2026-06-11',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: 'O que é o rotativo do cartão de crédito?',
      a: 'O rotativo é o crédito que você passa a usar quando paga menos do que o valor total da fatura na data de vencimento. O saldo não pago é financiado automaticamente pelo banco até a fatura seguinte, com juros. É uma das modalidades de crédito mais caras do mercado brasileiro, segundo o Banco Central, e por isso costuma ser indicado apenas para emergências de curtíssimo prazo.',
    },
    {
      q: 'Os juros do cartão são simples ou compostos?',
      a: 'São compostos. A cada mês, os juros do período anterior passam a fazer parte da base sobre a qual novos juros incidem — é o "juros sobre juros". Por isso a dívida do cartão cresce rápido: com uma taxa de 14% ao mês, por exemplo, R$ 2.000 podem virar mais de R$ 4.000 em seis meses, mesmo sem novas compras.',
    },
    {
      q: 'Existe limite para os juros do rotativo?',
      a: 'Sim. Desde janeiro de 2024, com a Lei 14.690/2023, o total de juros e encargos cobrados no rotativo e no parcelamento da fatura não pode ultrapassar 100% do valor original da dívida. Ou seja, a soma dos encargos não pode fazer você dever mais que o dobro do que devia. Mesmo assim, dobrar a dívida é um custo altíssimo, e o ideal é sair do rotativo o quanto antes.',
    },
    {
      q: 'Como sair do rotativo do cartão?',
      a: 'A forma mais comum é trocar a dívida do rotativo por uma linha mais barata. Você pode aceitar o parcelamento da fatura oferecido pelo banco, que costuma ter juros menores que o rotativo, ou buscar um crédito pessoal ou consignado com taxa mais baixa para quitar o cartão. Comparar a taxa mensal de cada opção antes de decidir ajuda a reduzir o custo total.',
    },
    {
      q: 'A taxa de 14% ao mês é fixa?',
      a: 'Não. O valor de 14% ao mês é apenas um padrão usado nesta calculadora como referência aproximada do rotativo. A taxa real varia de banco para banco e muda mês a mês — o Banco Central divulga as médias de mercado. Sempre confira a taxa exata da sua fatura ou no aplicativo do banco e ajuste o campo da calculadora para chegar a uma estimativa mais próxima da sua realidade.',
    },
    {
      q: 'Esta calculadora considera IOF e multa por atraso?',
      a: 'Não. Ela mostra apenas a estimativa dos juros compostos sobre o saldo informado, com a taxa que você digitar. Em uma fatura real podem incidir ainda IOF, multa por atraso e juros de mora, que variam conforme o contrato e o banco. Use o resultado como uma referência de planejamento, e confira os valores exatos diretamente com a sua instituição financeira.',
    },
  ],
  affiliates: [],
};
