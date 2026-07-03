import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-pro-labore',
  title: 'Calculadora de Pró-labore 2026',
  description:
    'Calcule os descontos do pró-labore do sócio em 2026: INSS (11% ou 20%, limitado ao teto) e IRRF pela tabela mensal, e veja quanto sobra líquido.',
  primaryKw: 'calculadora pró-labore',
  relatedKws: [
    'pró-labore inss',
    'desconto pró-labore',
    'quanto descontar do pró-labore',
  ],
  category: 'tax',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-10',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: 'O que é o pró-labore?',
      a: 'Pró-labore é a remuneração paga ao sócio ou administrador que trabalha na empresa, em troca do seu trabalho na gestão do negócio. Diferente da distribuição de lucros, o pró-labore sofre desconto de INSS e de Imposto de Renda na fonte. Esta calculadora estima esses descontos e quanto sobra líquido por mês.',
    },
    {
      q: 'Quanto de INSS desconta do pró-labore?',
      a: 'No caso geral, o sócio é contribuinte individual e tem 11% descontados do pró-labore quando a empresa também recolhe a cota patronal de 20% à parte. Esse desconto é limitado ao teto do INSS de 2026 (R$ 8.475,55), o que dá uma contribuição máxima de R$ 932,31. Quando não há cota patronal, a alíquota do contribuinte individual é de 20%, também limitada ao teto.',
    },
    {
      q: 'O pró-labore paga Imposto de Renda?',
      a: 'Sim. Sobre o pró-labore incide o IRRF pela tabela mensal de 2026, depois de descontar o INSS e a dedução por dependente. Em 2026, pela Lei nº 15.270/2025, quem recebe até R$ 5.000 por mês fica isento; entre R$ 5.000 e R$ 7.350 há um redutor; acima disso aplica-se a tabela cheia.',
    },
    {
      q: 'Qual a diferença entre pró-labore e distribuição de lucros?',
      a: 'O pró-labore remunera o trabalho do sócio e sofre INSS e IRRF. A distribuição de lucros remunera o capital investido e, quando apurada com contabilidade regular, costuma ser isenta de Imposto de Renda e não tem INSS. Muitos sócios combinam um pró-labore (ao menos um salário mínimo) com a distribuição de lucros.',
    },
    {
      q: 'A empresa também paga INSS sobre o pró-labore?',
      a: 'Sim. Além dos 11% descontados do sócio, no caso geral a empresa recolhe a cota patronal de 20% sobre o pró-labore, à parte. Essa cota patronal é um custo da empresa e não aparece como desconto no valor que o sócio recebe — por isso esta calculadora foca apenas nos descontos do próprio sócio.',
    },
    {
      q: 'Existe um valor mínimo para o pró-labore?',
      a: 'Como regra geral, o pró-labore do sócio que trabalha na empresa deve ter como base de contribuição ao menos um salário mínimo, que em 2026 é R$ 1.621,00. O valor exato e a melhor combinação entre pró-labore e lucros dependem da sua situação e devem ser definidos com o seu contador.',
    },
  ],
  affiliates: [],
};
