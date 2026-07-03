import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-aviso-previo',
  title: 'Calculadora de Aviso Prévio 2026',
  description:
    'Calcule os dias e o valor do aviso prévio em 2026: 30 dias + 3 por ano de serviço (teto de 90 dias), pela Lei nº 12.506/2011 e pela CLT.',
  primaryKw: 'calculadora aviso prévio',
  relatedKws: [
    'aviso prévio proporcional 2026',
    'quantos dias de aviso prévio',
    'cálculo aviso prévio indenizado',
    'aviso prévio trabalhado ou indenizado',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-02',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-06-13',
  faqs: [
    {
      q: 'Quantos dias de aviso prévio eu tenho direito?',
      a: 'A base é de 30 dias. Quando o empregador demite sem justa causa, somam-se 3 dias por ano completo trabalhado no mesmo empregador, até o teto de 90 dias (Lei nº 12.506/2011). Assim, com 1 ano são 33 dias; com 10 anos, 60 dias; com 20 anos ou mais, 90 dias.',
    },
    {
      q: 'O aviso prévio proporcional vale quando eu peço demissão?',
      a: 'Não. O acréscimo de 3 dias por ano é entendido como um benefício do empregado. Quando é você quem pede demissão, o aviso prévio costuma ser de 30 dias fixos, sem o adicional proporcional. O proporcional aparece quando o empregador é quem encerra o contrato sem justa causa.',
    },
    {
      q: 'Qual a diferença entre aviso prévio indenizado e trabalhado?',
      a: 'No aviso indenizado, você é dispensado de trabalhar e recebe o valor do período em dinheiro junto com a rescisão. No aviso trabalhado, você cumpre o período em atividade e recebe o salário normal. Em ambos os casos o número de dias é o mesmo; o que muda é se você trabalha ou não no período.',
    },
    {
      q: 'No aviso trabalhado, posso reduzir a jornada?',
      a: 'Sim, quando é o empregador quem demite. A CLT (art. 488) prevê redução de 2 horas por dia durante o aviso trabalhado ou, à escolha do empregado, a falta de 7 dias corridos ao fim do período, sem desconto no salário. Essa redução serve para você procurar um novo emprego.',
    },
    {
      q: 'O valor do aviso prévio entra na rescisão?',
      a: 'Sim. O aviso prévio indenizado é uma das verbas pagas na rescisão sem justa causa, ao lado de saldo de salário, 13º proporcional, férias proporcionais e a multa do FGTS. Esta calculadora estima apenas a parcela do aviso prévio, de forma aproximada.',
    },
    {
      q: 'Como o valor do aviso prévio é calculado?',
      a: 'De forma simplificada, divide-se o salário bruto por 30 para achar o valor de um dia e multiplica-se pelos dias de aviso. Por exemplo, com salário de R$ 3.000 e 5 anos de casa (empregador demitindo), são 45 dias: R$ 3.000 ÷ 30 = R$ 100 por dia × 45 = R$ 4.500.',
    },
  ],
  affiliates: [],
};
