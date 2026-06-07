import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-inss',
  title: 'Calculadora de INSS 2026',
  description:
    'Calcule a contribuição do INSS em 2026 por categoria: empregado CLT (tabela progressiva), autônomo, facultativo e MEI, com base, alíquota efetiva e teto.',
  primaryKw: 'calculadora inss',
  relatedKws: [
    'tabela inss 2026',
    'desconto inss salário',
    'inss autônomo 2026',
    'contribuição inss mei',
  ],
  category: 'tax',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-04',
  updatedAt: '2026-06-04',
  reviewedAt: '2026-06-04',
  faqs: [
    {
      q: 'Como é calculado o desconto do INSS do empregado CLT em 2026?',
      a: 'Para quem trabalha com carteira assinada, o INSS é progressivo: cada alíquota (de 7,5% a 14%) incide apenas sobre a parcela do salário que cai dentro da faixa, e não sobre o salário inteiro. Por isso a alíquota efetiva costuma ser menor do que a nominal. O desconto respeita o teto do salário de contribuição (R$ 8.475,55 em 2026), o que limita a contribuição a R$ 988,09.',
    },
    {
      q: 'Qual é o teto do INSS em 2026 e o desconto máximo?',
      a: 'O teto do salário de contribuição em 2026 é R$ 8.475,55. Quem ganha igual ou acima desse valor contribui, como empregado, com no máximo R$ 988,09 por mês, mesmo que o salário seja muito maior. Acima do teto não há contribuição adicional.',
    },
    {
      q: 'Quanto paga de INSS o autônomo (contribuinte individual) em 2026?',
      a: 'No plano normal, o contribuinte individual recolhe 20% sobre o salário de contribuição, respeitando o piso do salário mínimo (R$ 1.621,00) e o teto (R$ 8.475,55). Há também o plano simplificado, com 11% sobre o salário mínimo (R$ 178,31), porém ele não dá direito à aposentadoria por tempo de contribuição.',
    },
    {
      q: 'Quanto o MEI paga de INSS?',
      a: 'O MEI contribui com 5% sobre o salário mínimo (R$ 81,05 em 2026), valor já incluído no DAS mensal. Por isso a calculadora mostra esse valor fixo independentemente do faturamento informado.',
    },
    {
      q: 'O que é o contribuinte facultativo de baixa renda?',
      a: 'É a pessoa sem renda própria que se dedica ao trabalho doméstico em casa de baixa renda e está inscrita no CadÚnico. Ela pode recolher 5% sobre o salário mínimo (R$ 81,05 em 2026). Assim como no plano simplificado, há limitação de benefícios em relação ao plano de 20%.',
    },
    {
      q: 'A alíquota efetiva é a mesma da tabela?',
      a: 'Nem sempre. Para o empregado CLT, a tabela progressiva faz a alíquota efetiva (contribuição dividida pelo salário) ficar abaixo da alíquota nominal da última faixa. Já nos planos de 20%, 11% ou 5% sobre uma base fixa, a alíquota efetiva pode variar conforme a remuneração informada.',
    },
  ],
  affiliates: [],
};
