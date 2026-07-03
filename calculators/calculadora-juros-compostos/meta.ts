import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-juros-compostos',
  title: 'Calculadora de Juros Compostos',
  description:
    'Calcule juros compostos com aporte inicial e mensal: veja o montante final, o total investido e quanto rendeu em juros, com taxa mensal ou anual.',
  primaryKw: 'calculadora de juros compostos',
  relatedKws: [
    'calcular juros compostos',
    'juros compostos com aporte mensal',
    'simulador de juros compostos',
    'fórmula juros compostos',
    'montante juros compostos',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-19',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-06-13',
  faqs: [
    {
      q: 'O que são juros compostos?',
      a: 'Juros compostos são os juros que incidem não só sobre o valor inicial aplicado, mas também sobre os juros já acumulados nos períodos anteriores. É o famoso "juros sobre juros": a cada período, o rendimento passa a fazer parte da base de cálculo do período seguinte. Por isso, ao longo do tempo, o crescimento deixa de ser linear e passa a ser exponencial.',
    },
    {
      q: 'Qual é a fórmula dos juros compostos?',
      a: 'A fórmula básica é M = C × (1 + i)ⁿ, em que M é o montante final, C é o capital inicial, i é a taxa de juros por período (em decimal) e n é o número de períodos. Quando há aportes mensais, soma-se o termo dos aportes: A × [((1 + i)ⁿ − 1) ÷ i], onde A é o valor depositado a cada período. Esta calculadora aplica as duas partes para chegar ao montante final.',
    },
    {
      q: 'Como converter a taxa anual em taxa mensal?',
      a: 'A conversão correta usa juros compostos, não uma simples divisão por 12. A taxa mensal equivalente é i_mensal = (1 + taxa_anual)^(1/12) − 1. Por exemplo, uma taxa de 12,6825% ao ano equivale a 1% ao mês. Dividir a taxa anual por 12 dá um resultado aproximado e geralmente incorreto. Esta calculadora faz a conversão composta automaticamente quando você escolhe a taxa anual.',
    },
    {
      q: 'Qual a diferença entre juros simples e juros compostos?',
      a: 'Nos juros simples, o rendimento incide sempre sobre o valor inicial, então o crescimento é linear (uma reta). Nos juros compostos, o rendimento incide sobre o saldo acumulado, então o crescimento é exponencial (uma curva que sobe cada vez mais rápido). Em prazos curtos a diferença é pequena, mas em prazos longos os juros compostos resultam em valores muito maiores.',
    },
    {
      q: 'Por que o tempo é tão importante nos juros compostos?',
      a: 'Porque o efeito dos juros sobre juros se acumula a cada período. Quanto mais longo o prazo, mais ciclos de capitalização ocorrem e maior é a parcela do montante que vem dos juros, e não do dinheiro que você aportou. Por isso começar cedo e manter aportes regulares costuma fazer mais diferença no resultado final do que aumentar a taxa.',
    },
    {
      q: 'O resultado já considera impostos e inflação?',
      a: 'Não. Esta é uma simulação matemática de juros compostos e mostra o valor nominal bruto. Rendimentos reais de investimentos podem sofrer Imposto de Renda, IOF (em resgates de curto prazo) e taxas de administração, além de variar com a inflação. Use o resultado como referência de planejamento, e não como uma previsão exata de quanto você vai resgatar.',
    },
  ],
  affiliates: ['corretora', 'cursoFinancas'],
};
