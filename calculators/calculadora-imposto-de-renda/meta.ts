import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-imposto-de-renda',
  title: 'Calculadora de Imposto de Renda (IRPF) 2026',
  description:
    'Estime o IRPF anual de 2026: imposto devido, restituição ou valor a pagar. Compara simplificado e completo com a tabela e as deduções oficiais.',
  primaryKw: 'calculadora imposto de renda',
  relatedKws: [
    'calcular irpf',
    'restituição imposto de renda',
    'declaração de imposto de renda 2026',
  ],
  category: 'tax',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-09',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: 'O que esta calculadora estima?',
      a: 'Ela estima o Imposto de Renda da Pessoa Física (IRPF) do ano, no acerto da declaração anual. A partir dos rendimentos tributáveis, das deduções e do IRRF já retido na fonte, ela calcula o imposto devido pelos modelos simplificado e completo, mostra o mais vantajoso e indica se você tem valor a restituir ou imposto a pagar. É uma estimativa educativa, não substitui o programa oficial da Receita.',
    },
    {
      q: 'Qual a diferença entre o modelo simplificado e o completo?',
      a: 'No modelo simplificado, você troca todas as deduções legais por um desconto único de 20% dos rendimentos tributáveis, limitado a R$ 17.640,00 por ano. No completo, você soma as deduções reais: dependentes (R$ 2.275,08 cada), instrução, saúde e a contribuição previdenciária. A calculadora apura o imposto pelos dois caminhos e usa o menor, como o próprio programa da Receita faz.',
    },
    {
      q: 'Como sei se vou ter restituição ou imposto a pagar?',
      a: 'O acerto anual compara o imposto devido com o IRRF que já foi retido na fonte durante o ano. Se foi retido mais do que o devido, o saldo é a restituir; se foi retido menos, sobra imposto a pagar; se forem iguais, está quitado. A calculadora mostra esse valor aproximado e a situação correspondente.',
    },
    {
      q: 'A mudança de 2026 (isenção até R$ 5.000/mês) altera a declaração?',
      a: 'A Lei nº 15.270/2025 criou uma isenção mensal na retenção para quem recebe até R$ 5.000 por mês e um redutor decrescente até R$ 7.350. Isso afeta o quanto é retido a cada mês; no ajuste anual, esse valor já retido é reconciliado com o imposto devido. A tabela progressiva em si não mudou.',
    },
    {
      q: 'Qual o prazo para entregar a declaração?',
      a: 'A Receita Federal costuma abrir a entrega da Declaração de Ajuste Anual entre março e maio, com prazo final geralmente perto de 31 de maio. As datas exatas de cada exercício são publicadas pela Receita; confirme sempre no site oficial gov.br/receitafederal antes de declarar.',
    },
    {
      q: 'Esta calculadora considera todos os tipos de rendimento?',
      a: 'Não. Ela trata dos rendimentos tributáveis sujeitos à tabela progressiva (salários, pró-labore, aposentadoria, aluguéis etc.). Rendimentos com tributação exclusiva, isentos ou de aplicações financeiras seguem regras próprias e não entram neste cálculo. Para a sua situação específica, use o programa da Receita ou consulte um contador.',
    },
  ],
  affiliates: [],
};
