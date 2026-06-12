import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-conversor-clt-pj',
  title: 'Calculadora de Conversão CLT x PJ 2026',
  description:
    'Converta de CLT para PJ: veja o pacote mensal equivalente (líquido, 13º, férias, FGTS, benefícios) e quanto faturar como PJ para igualar, com tabelas de 2026.',
  primaryKw: 'calculadora clt x pj',
  relatedKws: [
    'converter clt para pj',
    'quanto cobrar como pj',
    'salário clt equivalente pj',
    'comparar clt e pj',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-27',
  updatedAt: '2026-05-27',
  reviewedAt: '2026-05-27',
  faqs: [
    {
      q: 'O que esta calculadora compara entre CLT e PJ?',
      a: 'Ela transforma o seu salário CLT em um pacote mensal equivalente — somando salário líquido, 13º diluído, férias com 1/3 diluídas, FGTS e benefícios — e estima quanto um PJ precisaria faturar por mês para, depois do imposto e do contador, sobrar o mesmo valor. É uma estimativa simplificada para comparar regimes, não uma recomendação de migrar.',
    },
    {
      q: 'Por que não basta comparar o salário com o faturamento do PJ?',
      a: 'Porque o CLT recebe muito além do salário: 13º, férias com 1/3, FGTS (8%), benefícios e direitos como seguro-desemprego. O PJ não tem esses direitos e ainda paga impostos sobre o faturamento, o INSS por conta própria e o contador. Comparar só salário bruto x faturamento ignora todo esse pacote.',
    },
    {
      q: 'A conta inclui o INSS do PJ e o pró-labore?',
      a: 'Não. Esta é uma estimativa simplificada que considera o imposto sobre o faturamento e o custo do contador, mas não inclui o INSS do próprio PJ, o pró-labore nem a provisão de reserva para meses sem trabalho. Por isso o faturamento real necessário tende a ser maior do que o mostrado aqui.',
    },
    {
      q: 'Qual alíquota de imposto eu devo usar no campo do PJ?',
      a: 'Depende do seu enquadramento. No Simples Nacional, prestadores de serviço costumam ficar no Anexo III, cuja primeira faixa é 6% sobre o faturamento. Outras atividades e faixas têm alíquotas diferentes. Confirme a sua com um contador e use o valor correspondente no campo.',
    },
    {
      q: 'Como o 13º e as férias entram no cálculo?',
      a: 'Como o objetivo é um valor mensal comparável, o 13º entra dividido por 12 (salário bruto ÷ 12) e as férias com 1/3 também são diluídas por 12 ((bruto + bruto/3) ÷ 12). Assim, o pacote CLT já considera esses direitos espalhados ao longo do ano.',
    },
    {
      q: 'O resultado serve como recomendação para virar PJ?',
      a: 'Não. O número é apenas uma referência de comparação. A decisão entre CLT e PJ envolve estabilidade, direitos trabalhistas, aposentadoria, previsibilidade de renda e tributação específica do seu caso. Antes de decidir, converse com um contador.',
    },
  ],
  affiliates: ['contabilizei'],
};
