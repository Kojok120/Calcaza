import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-irrf',
  title: 'Calculadora de IRRF 2026',
  description:
    'Calcule o IRRF mensal de 2026: base de cálculo, faixa e parcela a deduzir, completo x simplificado, dependentes e o redutor da isenção até R$ 5.000.',
  primaryKw: 'calculadora irrf',
  relatedKws: [
    'calcular irrf 2026',
    'imposto de renda retido na fonte',
    'tabela irrf 2026',
    'irrf na folha de pagamento',
  ],
  category: 'tax',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-08',
  updatedAt: '2026-06-08',
  reviewedAt: '2026-06-08',
  faqs: [
    {
      q: 'O que é o IRRF?',
      a: 'IRRF é o Imposto de Renda Retido na Fonte, ou seja, a parte do Imposto de Renda que a fonte pagadora (a empresa, por exemplo) desconta do seu rendimento e recolhe para a Receita Federal antes de pagar você. Esta calculadora estima apenas esse imposto retido na folha, mês a mês, separado dos demais descontos.',
    },
    {
      q: 'Qual a diferença entre a base completa e a simplificada?',
      a: 'A base completa usa as deduções legais (INSS, dependentes e outras deduções como pensão judicial). A base simplificada usa um desconto único de R$ 607,20 no lugar dessas deduções. A calculadora apura o imposto pelos dois caminhos e mostra o menor, que é o mais vantajoso para você, como a folha costuma fazer.',
    },
    {
      q: 'Como funciona a isenção do IR até R$ 5.000 em 2026?',
      a: 'Pela Lei nº 15.270/2025, em 2026 quem recebe rendimento bruto de até R$ 5.000 por mês fica com o IRRF zerado. Entre R$ 5.000 e R$ 7.350 há um redutor que diminui o imposto de forma decrescente; acima de R$ 7.350 aplica-se a tabela normal, sem redutor.',
    },
    {
      q: 'A isenção do IR também zera o INSS?',
      a: 'Não. A isenção e o redutor de 2026 valem apenas para o IRRF. A contribuição ao INSS é um desconto separado, calculado pela tabela progressiva da Previdência, e continua sendo retida normalmente mesmo quando o IRRF fica zerado.',
    },
    {
      q: 'A alíquota da minha faixa é o que eu realmente pago?',
      a: 'Não. A alíquota nominal (a da faixa da tabela) incide sobre a base de cálculo, e ainda há a parcela a deduzir. Por isso a alíquota efetiva — o IRRF dividido pelo rendimento bruto — costuma ser bem menor do que a alíquota da faixa. A calculadora mostra os dois valores.',
    },
    {
      q: 'Posso informar o INSS que veio no meu contracheque?',
      a: 'Sim. Se você já tem o valor do INSS no holerite, pode informá-lo no campo opcional para que a base do IR use exatamente esse número. Se deixar em branco, a calculadora estima o INSS pela tabela progressiva de 2026 a partir do rendimento bruto.',
    },
  ],
  affiliates: ['contabilizei'],
};
