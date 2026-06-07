import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-decimo-terceiro',
  title: 'Calculadora de 13º Salário 2026',
  description:
    'Calcule o 13º salário 2026: valor bruto proporcional aos meses trabalhados, 1ª e 2ª parcelas e os descontos de INSS e IRRF, com as tabelas oficiais.',
  primaryKw: 'calculadora 13 salário',
  relatedKws: [
    'calculadora décimo terceiro',
    '13 salário 2026',
    'cálculo do 13 proporcional',
    'desconto inss e irrf no 13',
    'segunda parcela 13 salário',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-28',
  updatedAt: '2026-05-28',
  reviewedAt: '2026-05-28',
  faqs: [
    {
      q: 'Como o 13º salário é calculado?',
      a: 'O 13º (gratificação natalina) equivale a 1/12 da remuneração por mês trabalhado no ano. Quem trabalhou o ano inteiro recebe um salário cheio; quem trabalhou parte do ano recebe proporcionalmente. O mês em que você trabalhou 15 dias ou mais conta como mês completo. A base inclui o salário bruto e as médias de adicionais habituais, como horas extras e adicional noturno.',
    },
    {
      q: 'Como funcionam as duas parcelas do 13º?',
      a: 'A 1ª parcela corresponde à metade do 13º bruto e é paga até 30 de novembro, sem descontos. A 2ª parcela é a outra metade, mas com a retenção do INSS e do IRRF, e é paga até 20 de dezembro. Por isso a segunda parcela costuma vir menor que a primeira.',
    },
    {
      q: 'Por que os descontos saem só na segunda parcela?',
      a: 'Pela legislação, a 1ª parcela é um adiantamento e não sofre retenção. O INSS e o Imposto de Renda sobre o 13º são calculados de uma vez e descontados integralmente na 2ª parcela. Por isso, ao somar as duas parcelas, você chega ao 13º líquido total.',
    },
    {
      q: 'O 13º é tributado junto com o salário do mês?',
      a: 'Não. O 13º salário tem tributação exclusiva na fonte, separada do salário mensal. O INSS incide sobre o valor integral do 13º, e o IRRF é calculado sobre o 13º já descontado do INSS e dos dependentes, usando a tabela própria. Ele não se soma ao salário de dezembro para fins de imposto.',
    },
    {
      q: 'Quem trabalhou poucos meses tem direito ao 13º?',
      a: 'Sim, de forma proporcional. A cada mês trabalhado (com 15 dias ou mais) você acumula 1/12 do 13º. Quem foi admitido em junho, por exemplo, e trabalhou de junho a dezembro, recebe 7/12 do 13º cheio.',
    },
    {
      q: 'As horas extras e adicionais entram no 13º?',
      a: 'Sim, quando são habituais. A média das horas extras, do adicional noturno, de periculosidade ou insalubridade e de comissões integra a base do 13º. No campo de médias de adicionais você informa esse valor mensal médio em reais para incluí-lo no cálculo.',
    },
  ],
  affiliates: [],
};
