import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-margem-de-lucro',
  title: 'Calculadora de Margem de Lucro',
  description:
    'Calcule preço de venda, lucro e margem a partir do custo. Diferencie markup (sobre o custo) e margem (sobre a venda) e inclua despesas variáveis.',
  primaryKw: 'calculadora de margem de lucro',
  relatedKws: [
    'calcular margem de lucro',
    'markup ou margem',
    'como calcular preço de venda',
    'margem de lucro mei',
    'fórmula de markup',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-07',
  updatedAt: '2026-06-07',
  reviewedAt: '2026-06-07',
  faqs: [
    {
      q: 'Qual a diferença entre markup e margem de lucro?',
      a: 'Markup e margem partem do mesmo lucro, mas usam bases diferentes. O markup é o percentual calculado sobre o custo: você parte do que pagou e acrescenta uma porcentagem para chegar ao preço. A margem é o percentual calculado sobre o preço de venda: do valor que o cliente paga, quanto sobra de lucro. Por isso o mesmo lucro em reais resulta em um percentual de markup maior e em um percentual de margem menor. Confundir os dois é um dos erros mais comuns na hora de precificar.',
    },
    {
      q: 'Por que markup de 100% não é o mesmo que margem de 100%?',
      a: 'Porque a base muda. Um markup de 100% dobra o custo: um produto que custa R$ 50 vira R$ 100, e o lucro de R$ 50 representa 50% do preço de venda — ou seja, margem de 50%. Já uma margem de 100% seria impossível, porque significaria que o lucro é 100% do preço e o custo é zero. Sempre que o percentual é alto, a diferença entre as duas formas fica maior.',
    },
    {
      q: 'Devo incluir impostos e taxa de cartão no cálculo?',
      a: 'Sim, se você quer um preço que não dê prejuízo. Impostos como o DAS do MEI ou o Simples Nacional, a comissão de marketplace e a taxa da maquininha de cartão são despesas variáveis que incidem sobre cada venda. No campo de despesas variáveis você informa o total desses percentuais (sobre a venda) e a calculadora os desconta do lucro, mostrando a margem real que sobra. Ignorá-los faz o preço parecer lucrativo quando, na prática, a sobra é bem menor.',
    },
    {
      q: 'Como uso o modo margem para definir o preço de venda?',
      a: 'No modo margem, você informa o custo e a margem que deseja sobre a venda (e, se quiser, as despesas variáveis). A calculadora monta o preço de tal forma que, depois de pagar o custo e essas despesas, sobre exatamente a margem desejada. A fórmula é preço = custo ÷ (1 − (margem + despesas)/100). É a maneira mais segura de precificar quando você raciocina em termos de "quanto quero que sobre de cada venda".',
    },
    {
      q: 'Esta calculadora considera aluguel e salários?',
      a: 'Não. Ela trabalha com o custo do produto ou serviço e com as despesas variáveis ligadas à venda. Custos fixos como aluguel, salários, energia e contador não entram aqui, porque não variam com cada unidade vendida. Para saber quantas vendas pagam esses custos fixos, o cálculo indicado é o de ponto de equilíbrio, que é diferente do cálculo de margem por produto.',
    },
    {
      q: 'A margem que aparece é bruta ou líquida?',
      a: 'É a margem sobre a venda depois de descontar o custo do produto e as despesas variáveis informadas. Não é a margem líquida final do negócio, porque ainda faltam os custos fixos e eventuais despesas não incluídas. Use o resultado como referência de precificação por produto, e não como o lucro líquido total da empresa. Para decisões fiscais e contábeis, vale confirmar com um contador.',
    },
  ],
  affiliates: ['contabilizei'],
};
