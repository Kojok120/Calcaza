import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-salario-liquido',
  title: 'Calculadora de Salário Líquido 2026',
  description:
    'Calcule seu salário líquido 2026 a partir do bruto: descontos de INSS e IRRF na folha, com as tabelas oficiais e a regra de isenção do IR até R$ 5.000.',
  primaryKw: 'calculadora salário líquido',
  relatedKws: [
    'salário líquido 2026',
    'calcular inss e irrf na folha',
    'quanto recebo líquido',
    'desconto inss salário',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-05',
  updatedAt: '2026-06-05',
  reviewedAt: '2026-06-05',
  faqs: [
    {
      q: 'Qual a diferença entre salário bruto e líquido?',
      a: 'O salário bruto é o valor combinado no contrato, antes de qualquer desconto. O salário líquido é o que de fato cai na sua conta depois de descontados o INSS, o Imposto de Renda na fonte (IRRF) e outros descontos da folha, como plano de saúde ou vale.',
    },
    {
      q: 'Como funciona a isenção do IR até R$ 5.000 em 2026?',
      a: 'Pela Lei nº 15.270/2025, em 2026 quem recebe salário bruto de até R$ 5.000 por mês fica isento do IRRF na folha. Entre R$ 5.000 e R$ 7.350 há um redutor que diminui o imposto de forma decrescente; acima de R$ 7.350 aplica-se a tabela normal, sem redutor.',
    },
    {
      q: 'O desconto do INSS tem teto?',
      a: 'Sim. O INSS do empregado é progressivo por faixas, mas incide apenas até o teto do salário de contribuição (R$ 8.475,55 em 2026). Por isso o desconto máximo é de R$ 988,09, mesmo para quem ganha bem acima do teto.',
    },
    {
      q: 'O 13º salário entra nesse cálculo?',
      a: 'Não. O 13º salário e as férias têm cálculo próprio, com INSS e IRRF apurados separadamente do salário do mês. Esta calculadora estima apenas o salário mensal de quem trabalha com carteira assinada (CLT).',
    },
    {
      q: 'Esta calculadora serve para autônomo ou PJ?',
      a: 'Não. Ela foi feita para o trabalhador CLT (carteira assinada), em que o INSS é retido na folha. O autônomo (contribuinte individual) e a empresa PJ recolhem a contribuição de forma diferente, com alíquotas e bases próprias.',
    },
    {
      q: 'Por que a calculadora compara duas bases de IR?',
      a: 'No IRRF mensal você pode usar as deduções legais (INSS e dependentes) ou o desconto simplificado de R$ 607,20. A calculadora apura o imposto pelos dois caminhos e mostra o menor, que é o mais benéfico para você, como a própria folha de pagamento costuma fazer.',
    },
  ],
  affiliates: [],
};
