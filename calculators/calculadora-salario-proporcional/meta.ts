import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-salario-proporcional',
  title: 'Calculadora de Salário Proporcional',
  description:
    'Calcule o salário proporcional aos dias trabalhados no mês de admissão ou demissão. Informe o salário e os dias para ver o valor estimado e o valor do dia.',
  primaryKw: 'calculadora salário proporcional',
  relatedKws: [
    'salário proporcional dias trabalhados',
    'salário admissão mês',
    'cálculo salário proporcional',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-11',
  updatedAt: '2026-06-11',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: 'O que é salário proporcional?',
      a: 'É o salário pago apenas pelos dias efetivamente trabalhados no mês, em vez do mês cheio. Acontece principalmente quando você é admitido ou demitido no meio do mês: a empresa paga só a fração correspondente aos dias trabalhados.',
    },
    {
      q: 'Por que o cálculo usa 30 dias mesmo em meses de 28 ou 31 dias?',
      a: 'É a chamada convenção dos 30 dias. A folha de pagamento costuma considerar o mês comercial de 30 dias para dividir o salário mensal, com base no divisor previsto na CLT. Por isso o valor de um dia é o salário dividido por 30. Alguns empregadores optam por usar os dias corridos do mês (28 a 31), e a calculadora permite as duas formas.',
    },
    {
      q: 'O INSS, o IRRF e o FGTS incidem sobre o salário proporcional?',
      a: 'Sim. Os descontos de INSS e de Imposto de Renda na fonte (IRRF), assim como o depósito de FGTS pela empresa, incidem sobre o valor proporcional efetivamente pago no mês, e não sobre o salário cheio que você receberia em um mês completo.',
    },
    {
      q: 'Trabalhei 15 dias no mês. Conto o avo de férias e de 13º?',
      a: 'Em regra, sim. Pela prática trabalhista, o mês em que você trabalha 15 dias ou mais conta como mês completo para o avo (1/12) de férias e de 13º salário. Com menos de 15 dias, aquele mês geralmente não é contado nesses avos.',
    },
    {
      q: 'Esta calculadora serve para admissão e para demissão?',
      a: 'Sim. Em ambos os casos você recebe pelos dias trabalhados no mês. Na admissão, conta-se do dia de início até o fim do mês; na demissão, do início do mês até o último dia trabalhado. O cálculo do salário proporcional é o mesmo.',
    },
    {
      q: 'O resultado já é o valor líquido que vou receber?',
      a: 'Não. A calculadora mostra o salário-base proporcional (estimativa). Sobre ele ainda incidem o INSS e o IRRF, e podem existir verbas adicionais (férias proporcionais, 13º proporcional, saldo de FGTS) que aparecem em uma rescisão. Para o líquido aproximado, combine com as calculadoras de salário líquido e de rescisão.',
    },
  ],
  affiliates: [],
};
