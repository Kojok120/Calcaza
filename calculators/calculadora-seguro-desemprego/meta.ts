import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-seguro-desemprego',
  title: 'Calculadora de Seguro-Desemprego 2026',
  description:
    'Estime o valor das parcelas e quantas você tem direito no seguro-desemprego 2026: faixas pela média dos 3 últimos salários, com piso e teto oficiais.',
  primaryKw: 'calculadora seguro-desemprego',
  relatedKws: [
    'seguro-desemprego 2026',
    'valor do seguro-desemprego',
    'quantas parcelas do seguro-desemprego',
    'cálculo seguro-desemprego média salarial',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-05',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-06-05',
  faqs: [
    {
      q: 'Como é calculado o valor da parcela do seguro-desemprego?',
      a: 'O valor parte da média dos seus três últimos salários. Em 2026, médias de até R$ 2.222,17 rendem 80% da média; entre R$ 2.222,18 e R$ 3.703,99, soma-se R$ 1.777,74 a 50% do que passar de R$ 2.222,17; acima disso, aplica-se o teto de R$ 2.518,65. Nenhuma parcela pode ser menor que o salário mínimo (R$ 1.621,00).',
    },
    {
      q: 'Quantas parcelas do seguro-desemprego eu recebo?',
      a: 'Depende do tempo trabalhado e do número da solicitação. Na 1ª solicitação são 4 parcelas (12 a 23 meses) ou 5 (24 meses ou mais). Na 2ª, 3 parcelas (9 a 11 meses), 4 (12 a 23) ou 5 (24+). Na 3ª ou seguintes, 3 parcelas (6 a 11 meses), 4 (12 a 23) ou 5 (24+).',
    },
    {
      q: 'Existe um valor mínimo e máximo da parcela?',
      a: 'Sim. Em 2026 nenhuma parcela pode ser inferior ao salário mínimo, de R$ 1.621,00 (piso), e o valor máximo é de R$ 2.518,65 (teto), independentemente de quanto a sua média ultrapasse esse limite.',
    },
    {
      q: 'Quem tem direito ao seguro-desemprego?',
      a: 'Em geral, o trabalhador formal dispensado sem justa causa, que esteja desempregado e não tenha renda própria suficiente para o sustento. Há regras de tempo mínimo de trabalho que variam conforme o número da solicitação. Pedidos de demissão e dispensa por justa causa não dão direito ao benefício.',
    },
    {
      q: 'Qual o prazo para solicitar o seguro-desemprego?',
      a: 'Para o trabalhador formal dispensado sem justa causa, o pedido costuma ser feito entre o 7º e o 120º dia após a data da dispensa. O requerimento pode ser feito pelo portal Gov.br, pelo aplicativo da Carteira de Trabalho Digital ou em uma unidade de atendimento.',
    },
    {
      q: 'Esta calculadora garante a aprovação do meu benefício?',
      a: 'Não. O resultado é uma estimativa baseada nas regras de 2026 e serve para você ter uma ideia do valor e do número de parcelas. A análise e o deferimento oficiais são feitos pelo Ministério do Trabalho e Emprego, que verifica os requisitos legais de cada caso.',
    },
  ],
  affiliates: [],
};
