import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-financiamento-imovel',
  title: 'Calculadora de Financiamento Imobiliário 2026',
  description:
    'Simule o financiamento do imóvel pelas tabelas SAC e Price: parcela inicial e final, total pago e total de juros, com a taxa anual convertida em mensal.',
  primaryKw: 'calculadora financiamento imobiliário',
  relatedKws: [
    'simulador financiamento imóvel',
    'tabela sac ou price',
    'calcular parcela financiamento casa',
    'financiamento imobiliário 2026',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-21',
  updatedAt: '2026-05-21',
  reviewedAt: '2026-05-21',
  faqs: [
    {
      q: 'Qual a diferença entre SAC e Tabela Price?',
      a: 'No SAC (Sistema de Amortização Constante), a amortização é fixa e os juros incidem sobre o saldo devedor, que cai mês a mês — por isso a parcela é decrescente: começa mais alta e termina mais baixa. Na Tabela Price, a parcela é fixa do início ao fim, mas você paga mais juros no total. A maioria dos financiamentos da casa própria no Brasil usa o SAC.',
    },
    {
      q: 'Por que o SAC paga menos juros no total?',
      a: 'Porque no SAC você amortiza o mesmo valor de principal todos os meses, então o saldo devedor (sobre o qual incidem os juros) cai mais rápido do que na Price. Como os juros são calculados sobre um saldo que diminui mais depressa, o total de juros ao fim do contrato fica menor. Em compensação, as primeiras parcelas do SAC são mais altas.',
    },
    {
      q: 'A parcela que a calculadora mostra é a que vou pagar no banco?',
      a: 'É uma estimativa. A parcela real do banco costuma ser maior porque inclui o CET (Custo Efetivo Total), os seguros obrigatórios (MIP, que cobre morte e invalidez, e DFI, que cobre danos ao imóvel) e a taxa de administração mensal. Esta simulação calcula apenas amortização e juros, então use o número como referência, não como valor final.',
    },
    {
      q: 'Como a taxa anual vira taxa mensal?',
      a: 'Esta calculadora usa a taxa mensal equivalente composta: i = (1 + taxa anual)^(1/12) − 1. Assim, capitalizar 12 meses dessa taxa reproduz a taxa anual informada. Alguns contratos usam a taxa nominal (taxa anual dividida por 12), o que muda um pouco o resultado. Por isso pode haver pequena diferença em relação ao seu contrato.',
    },
    {
      q: 'Qual é a entrada mínima para financiar um imóvel?',
      a: 'Depende do banco e da linha de crédito, mas costuma girar em torno de 20% do valor do imóvel. Quanto maior a entrada, menor o valor financiado e menos juros você paga no total. Programas habitacionais e condições específicas podem ter regras próprias — confirme com a instituição.',
    },
    {
      q: 'Posso usar o FGTS na entrada do financiamento?',
      a: 'Em muitos casos, sim. O FGTS pode ser usado para dar entrada, abater parte do saldo devedor ou pagar parcelas, dentro das regras da Caixa e do programa de habitação. As condições mudam conforme o tipo de imóvel e o seu enquadramento, então verifique a elegibilidade junto à Caixa Econômica Federal.',
    },
  ],
  affiliates: ['financiamentoImovel'],
};
