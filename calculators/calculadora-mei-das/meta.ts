import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-mei-das',
  title: 'Calculadora do DAS MEI 2026: R$ 82,05 a R$ 87,05',
  description:
    'O DAS do MEI em 2026 é de R$ 82,05 (comércio), R$ 86,05 (serviços) ou R$ 87,05 (ambos); caminhoneiro, de R$ 195,52 a R$ 200,52. Calcule o valor da sua guia.',
  primaryKw: 'calculadora das mei',
  relatedKws: [
    'valor do das mei 2026',
    'quanto paga o mei por mês',
    'das mei comércio e serviços',
    'das mei caminhoneiro',
  ],
  category: 'tax',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-06',
  updatedAt: '2026-07-13',
  reviewedAt: '2026-07-13',
  faqs: [
    {
      q: 'Qual o valor do DAS do MEI em 2026?',
      a: 'Em 2026, o DAS mensal do MEI comum fica em R$ 82,05 para comércio ou indústria, R$ 86,05 para prestação de serviços e R$ 87,05 para quem atua com comércio e serviços ao mesmo tempo. Os valores variam porque a parcela fixa muda conforme a atividade (ICMS, ISS ou os dois).',
    },
    {
      q: 'Por que o valor do DAS muda todo ano?',
      a: 'A maior parte do DAS é a contribuição ao INSS, equivalente a 5% do salário mínimo (12% no caso do MEI caminhoneiro). Como o salário mínimo é reajustado em janeiro, o valor do DAS sobe junto. Em 2026, com o mínimo em R$ 1.621,00, a parcela de INSS do MEI comum é de R$ 81,05.',
    },
    {
      q: 'Como o DAS do MEI é formado?',
      a: 'O DAS soma a contribuição ao INSS (5% do salário mínimo para o MEI comum) com uma parcela fixa de tributo: R$ 1,00 de ICMS para comércio e indústria e/ou R$ 5,00 de ISS para serviços. Esses valores fixos de ICMS e ISS existem desde a criação do MEI, em 2006.',
    },
    {
      q: 'Quanto paga o MEI caminhoneiro?',
      a: 'O transportador autônomo de carga (MEI caminhoneiro) contribui com 12% do salário mínimo ao INSS, e não 5%. Em 2026, isso resulta em R$ 194,52 de INSS, mais o ICMS e/ou ISS conforme a atividade: R$ 195,52, R$ 199,52 ou R$ 200,52.',
    },
    {
      q: 'Qual o vencimento do DAS do MEI?',
      a: 'O DAS vence todo dia 20 de cada mês, referente ao mês anterior. A guia pode ser gerada e paga pelo aplicativo MEI ou pelo Portal do Simples Nacional (PGMEI). Se o dia 20 cair em fim de semana ou feriado, o pagamento costuma ser aceito no próximo dia útil.',
    },
    {
      q: 'O DAS é calculado sobre o faturamento do MEI?',
      a: 'Não. O DAS é um valor fixo mensal e não depende de quanto você fatura no mês. O faturamento entra em outra regra: o MEI tem um limite anual de receita. Acima desse limite, pode ser necessário migrar para outra categoria, mas o DAS em si continua sendo um valor fixo enquanto você for MEI.',
    },
  ],
  affiliates: ['contabilizei'],
};
