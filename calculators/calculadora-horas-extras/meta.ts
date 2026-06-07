import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-horas-extras',
  title: 'Calculadora de Horas Extras 2026',
  description:
    'Calcule o valor das suas horas extras em 2026: adicional de 50% ou 100% sobre a hora normal, valor-hora pela jornada mensal e reflexo no DSR.',
  primaryKw: 'calculadora horas extras',
  relatedKws: [
    'calcular hora extra 2026',
    'valor da hora extra 50%',
    'hora extra 100% domingo',
    'reflexo dsr hora extra',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-01',
  updatedAt: '2026-06-01',
  reviewedAt: '2026-06-01',
  faqs: [
    {
      q: 'Qual é o adicional mínimo de hora extra?',
      a: 'O adicional mínimo é de 50% sobre o valor da hora normal, conforme o art. 7º, inciso XVI, da Constituição Federal. Acordos ou convenções coletivas podem prever percentuais maiores, mas nunca menores que 50%.',
    },
    {
      q: 'Quando a hora extra é de 100%?',
      a: 'O adicional de 100% costuma valer para o trabalho em domingos e feriados que não foram compensados com folga, segundo a Súmula 146 do TST. Muitas convenções coletivas também fixam 100% para essas situações. Confira sempre o acordo da sua categoria.',
    },
    {
      q: 'Como se calcula o valor da hora normal?',
      a: 'Divide-se o salário mensal pela jornada mensal em horas. O divisor mais comum é 220 (44 horas por semana), mas há jornadas de 200 (40h/semana) e outras. O valor-hora é a base para calcular a hora extra: valor-hora × (1 + adicional/100).',
    },
    {
      q: 'O que é o reflexo no DSR?',
      a: 'Quando as horas extras são habituais, elas aumentam também o Descanso Semanal Remunerado (DSR). O reflexo é estimado dividindo o total de horas extras pelos dias úteis do mês e multiplicando pelos dias de descanso (domingos e feriados), conforme a Lei nº 605/1949 e a Súmula 172 do TST.',
    },
    {
      q: 'As horas extras entram no 13º salário e nas férias?',
      a: 'Sim, quando são habituais. As horas extras feitas com regularidade integram a base do 13º salário, das férias e de outras verbas. Esta calculadora estima apenas o valor das horas extras do mês e o reflexo no DSR; o impacto no 13º e nas férias tem cálculo próprio.',
    },
    {
      q: 'O valor mostrado já tem desconto de INSS e IRRF?',
      a: 'Não. A calculadora mostra o valor bruto das horas extras. Como esse valor entra na remuneração do mês, ele compõe a base do INSS e do IRRF junto com o salário. Para estimar o líquido total, use a Calculadora de Salário Líquido.',
    },
  ],
  affiliates: [],
};
