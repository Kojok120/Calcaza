import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-salario-maternidade',
  title: 'Calculadora de Salário-Maternidade 2026',
  description:
    'Calcule o salário-maternidade do INSS em 2026: valor mensal e total dos 120 dias para empregada CLT e contribuinte individual, com piso e teto do benefício.',
  primaryKw: 'calculadora salário maternidade',
  relatedKws: [
    'salário maternidade inss',
    'valor salário maternidade',
    'quanto recebo de salário maternidade',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-09',
  updatedAt: '2026-06-11',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: 'Quantos dias dura o salário-maternidade em 2026?',
      a: 'A duração padrão é de 120 dias (cerca de 4 meses). O benefício pode começar até 28 dias antes da data prevista para o parto. Em situações específicas, como adoção ou guarda judicial, valem regras próprias do INSS, mas o período padrão de 120 dias é o ponto de partida desta estimativa.',
    },
    {
      q: 'Quanto recebe de salário-maternidade quem é empregada CLT?',
      a: 'A empregada com carteira assinada recebe a remuneração mensal integral durante o benefício. Em geral, o pagamento é feito pela empresa, que depois é ressarcida pelo INSS. Por ser tratado como salário integral pago pela empregadora, esse valor não é cortado pelo teto do INSS.',
    },
    {
      q: 'Como é calculado o valor para a contribuinte individual ou facultativa?',
      a: 'Para a contribuinte individual e a facultativa, o valor é a média dos 12 últimos salários de contribuição (1/12 da soma), apurados em período não superior a 15 meses. Essa média respeita o piso do salário mínimo (R$ 1.621,00 em 2026) e o teto do INSS (R$ 8.475,55).',
    },
    {
      q: 'Qual é o teto e o piso do salário-maternidade em 2026?',
      a: 'O piso é o salário mínimo de 2026, R$ 1.621,00 — ninguém recebe menos do que isso. O teto aplicado à média da contribuinte individual e da facultativa é o teto do salário de contribuição do INSS, R$ 8.475,55. Para a empregada CLT, o pagamento segue o salário integral.',
    },
    {
      q: 'A contribuinte individual precisa de carência para o salário-maternidade?',
      a: 'Para a empregada, a trabalhadora avulsa e a empregada doméstica, em regra não há carência. Para a contribuinte individual e a facultativa, a regra geral exige um número mínimo de contribuições. Como há discussões e decisões recentes sobre o tema, trate este ponto como uma estimativa e confirme sua situação diretamente no INSS.',
    },
    {
      q: 'Esta calculadora serve para qualquer caso de salário-maternidade?',
      a: 'A ferramenta cobre os casos mais comuns: empregada CLT (salário integral) e contribuinte individual ou facultativa (pela média). Situações como adoção, parto múltiplo, prorrogação por programas como o Empresa Cidadã ou afastamentos especiais podem ter regras diferentes. O resultado é uma estimativa de planejamento, não um cálculo oficial do INSS.',
    },
  ],
  affiliates: [],
};
