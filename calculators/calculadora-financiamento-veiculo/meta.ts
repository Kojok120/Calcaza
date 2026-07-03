import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-financiamento-veiculo',
  title: 'Calculadora de Financiamento de Veículo',
  description:
    'Simule o financiamento do seu carro pela Tabela Price: informe valor, entrada, prazo e taxa ao mês e veja a parcela fixa, o total de juros e o total pago.',
  primaryKw: 'calculadora financiamento de veículo',
  relatedKws: [
    'financiamento de carro',
    'simulação financiamento veículo',
    'parcela financiamento carro',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-11',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: 'Como funciona a Tabela Price no financiamento de veículo?',
      a: 'Na Tabela Price (sistema francês), a parcela é fixa do primeiro ao último mês. No começo, a maior parte da parcela é juro e você amortiza pouco do valor financiado; com o passar dos meses, a proporção se inverte e você passa a abater mais saldo. É o sistema mais comum no CDC (Crédito Direto ao Consumidor) usado para financiar carros, motos e caminhões.',
    },
    {
      q: 'A parcela que a calculadora mostra é a mesma que vou pagar no banco?',
      a: 'É uma estimativa. A parcela real costuma ser maior porque o contrato cobra o CET (Custo Efetivo Total), que inclui o IOF, a tarifa de cadastro, o registro do contrato (gravame), eventuais seguros e outras tarifas. Esta simulação calcula apenas juros e amortização, então use o número como referência e confira o CET na proposta da instituição.',
    },
    {
      q: 'Por que os juros do financiamento de carro são maiores que os do imóvel?',
      a: 'Em geral, as taxas de financiamento de veículos são bem mais altas que as do crédito imobiliário. O imóvel serve de garantia de longo prazo e tende a se valorizar, enquanto o carro se desvaloriza com o tempo, o que aumenta o risco para a instituição. Você pode comparar as taxas médias praticadas no portal de estatísticas do Banco Central.',
    },
    {
      q: 'Aumentar a entrada vale a pena?',
      a: 'Quase sempre. Quanto maior a entrada, menor o valor financiado e, com a mesma taxa, menor o total de juros pago ao longo do contrato. Uma entrada maior também costuma facilitar a aprovação e pode reduzir a taxa oferecida. Por isso, simule diferentes percentuais de entrada antes de fechar.',
    },
    {
      q: 'O que muda entre 36, 48 e 60 meses de prazo?',
      a: 'Prazos mais longos reduzem o valor de cada parcela, mas aumentam o total de juros, porque você paga juros sobre o saldo por mais tempo. Prazos mais curtos têm parcela maior e total de juros menor. Use a calculadora para encontrar o equilíbrio entre uma parcela que cabe no orçamento e um custo total aceitável.',
    },
  ],
  affiliates: [],
};
