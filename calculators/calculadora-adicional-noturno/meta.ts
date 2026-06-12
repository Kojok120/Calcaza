import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-adicional-noturno',
  title: 'Calculadora de Adicional Noturno 2026 (CLT)',
  description:
    'Calcule o adicional noturno do trabalho urbano: período das 22h às 5h, adicional mínimo de 20% e a hora noturna reduzida de 52min30s (CLT art. 73).',
  primaryKw: 'calculadora adicional noturno',
  relatedKws: [
    'adicional noturno 20%',
    'hora noturna reduzida 52 minutos',
    'calcular adicional noturno clt',
    'trabalho noturno 22h às 5h',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-25',
  updatedAt: '2026-06-13',
  reviewedAt: '2026-06-13',
  faqs: [
    {
      q: 'Qual é o horário considerado trabalho noturno?',
      a: 'Para o trabalhador urbano, o trabalho noturno vai das 22h às 5h, conforme o art. 73 da CLT. O trabalhador rural tem horários diferentes (lavoura e pecuária), por isso esta calculadora é voltada ao trabalho urbano.',
    },
    {
      q: 'De quanto é o adicional noturno?',
      a: 'O adicional mínimo é de 20% sobre o valor da hora diurna, segundo o § 1º do art. 73 da CLT. Acordos e convenções coletivas podem fixar percentuais maiores, mas nunca menores que 20%.',
    },
    {
      q: 'O que é a hora noturna reduzida?',
      a: 'No trabalho urbano, a hora noturna é computada como 52 minutos e 30 segundos, e não 60 minutos (art. 73, § 1º, da CLT). Por isso, cada hora de relógio trabalhada à noite equivale a mais de uma hora noturna: o período das 22h às 5h, que tem 7 horas de relógio, equivale a 8 horas noturnas.',
    },
    {
      q: 'Por que 7 horas de relógio viram 8 horas noturnas?',
      a: 'Como a hora noturna dura 52,5 minutos em vez de 60, basta dividir o tempo de relógio pela duração reduzida. As 7 horas das 22h às 5h equivalem a 420 minutos ÷ 52,5 = 8 horas noturnas. É sobre essas 8 horas que o adicional de 20% incide.',
    },
    {
      q: 'O adicional noturno entra nas férias e no 13º salário?',
      a: 'Sim, quando é habitual. O adicional noturno habitual integra a base de cálculo das férias, do 13º salário e de outras verbas, conforme a jurisprudência do TST. Esta calculadora estima apenas o valor do mês; o reflexo nessas verbas tem cálculo próprio.',
    },
    {
      q: 'O valor mostrado já tem desconto de INSS e IRRF?',
      a: 'Não. A calculadora mostra valores brutos. Como o adicional noturno entra na remuneração do mês, ele compõe a base do INSS e do IRRF junto com o salário. Para estimar quanto cai na conta, use a Calculadora de Salário Líquido.',
    },
  ],
  affiliates: [],
};
