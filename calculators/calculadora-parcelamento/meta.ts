import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-parcelamento',
  title: 'Calculadora de Parcelamento',
  description:
    'Descubra os juros embutidos no "parcelado sem juros": informe o preço à vista e as parcelas para ver a taxa mensal implícita e se vale a pena parcelar.',
  primaryKw: 'calculadora juros parcelamento',
  relatedKws: [
    'vale a pena parcelar',
    'juros embutidos parcelamento',
    'à vista ou parcelado',
    'parcelado sem juros tem juros',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-11',
  updatedAt: '2026-06-11',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: '"Parcelado sem juros" realmente não tem juros?',
      a: 'Nem sempre. Muitas lojas oferecem desconto para quem paga à vista. Quando isso acontece, o preço parcelado é maior que o à vista, e essa diferença funciona como juros embutidos — mesmo a oferta sendo anunciada como "sem juros". Para descobrir, compare o total das parcelas com o preço à vista (ou com desconto). Se o parcelado for mais caro, há juros embutidos, e esta calculadora estima a taxa mensal equivalente.',
    },
    {
      q: 'Como a taxa de juros implícita é calculada?',
      a: 'A calculadora trata o preço à vista como valor presente e cada parcela como pagamento de uma anuidade, com a primeira parcela vencendo em cerca de 30 dias. Resolvendo a equação valorAVista = parcela × [1 − (1 + i)^(−n)] ÷ i por bissecção, ela encontra a taxa mensal i que iguala os dois lados. É a mesma lógica de taxa efetiva usada em conceitos como o Custo Efetivo Total (CET) do Banco Central. O resultado é uma estimativa para comparação, não a taxa contratual da loja.',
    },
    {
      q: 'Quando vale a pena pagar à vista em vez de parcelar?',
      a: 'Em geral, pagar à vista compensa quando o desconto oferecido representa juros embutidos maiores do que o seu dinheiro renderia parado. Como referência informal, muitos comparam a taxa mensal implícita com a taxa de aplicações de baixo risco, como a Selic. Se o parcelamento embute, por exemplo, 2% ao mês e a aplicação rende bem menos que isso, costuma valer a pena pegar o desconto à vista. A decisão também depende do seu fluxo de caixa.',
    },
    {
      q: 'Por que comparar a taxa do parcelamento com a Selic ou o CDB?',
      a: 'Se você tem o dinheiro para pagar à vista, mas escolhe parcelar, o valor que ficaria guardado pode render em uma aplicação (como CDB ou Tesouro Selic). Parcelar só faz sentido financeiro quando o rendimento da aplicação supera os juros embutidos no parcelamento. Quando os juros embutidos são maiores que o rendimento possível, parcelar custa mais caro do que parece. Os índices de referência são divulgados pelo Banco Central.',
    },
    {
      q: 'A taxa mostrada é a taxa oficial cobrada pela loja?',
      a: 'Não. A loja pode não informar nenhuma taxa quando anuncia "sem juros". O número aqui é a taxa implícita estimada, ou seja, a taxa que explicaria a diferença entre o preço à vista e o total parcelado. Ela ajuda a comparar ofertas em uma base comum, mas não substitui o Custo Efetivo Total (CET) informado em contratos de financiamento e crédito, que inclui tarifas, seguros e impostos.',
    },
    {
      q: 'O cálculo serve para o cartão de crédito parcelado pela loja?',
      a: 'Serve como estimativa para qualquer parcelamento em que você consiga comparar um preço à vista com o total das parcelas — incluindo o "parcelado da loja" no cartão. Para o rotativo do cartão de crédito (quando você não paga a fatura inteira) e para o parcelamento de fatura, os juros são diferentes e costumam ser bem mais altos; nesse caso, use a estimativa da calculadora de juros do cartão.',
    },
  ],
  affiliates: [],
};
