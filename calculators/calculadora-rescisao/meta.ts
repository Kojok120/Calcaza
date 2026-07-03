import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-rescisao',
  title: 'Calculadora de Rescisão CLT 2026',
  description:
    'Calcule as verbas e os descontos da rescisão CLT em 2026 por tipo de saída: aviso prévio, 13º, férias, multa do FGTS, INSS e IRRF.',
  primaryKw: 'calculadora rescisão',
  relatedKws: [
    'calculadora rescisão clt 2026',
    'calcular verbas rescisórias',
    'cálculo de rescisão de contrato',
    'rescisão sem justa causa',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-26',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-05-26',
  faqs: [
    {
      q: 'Quais verbas entram no cálculo da rescisão?',
      a: 'Em geral entram o saldo de salário dos dias trabalhados no mês, o aviso prévio (quando indenizado), o 13º salário proporcional, as férias proporcionais e vencidas com o adicional de 1/3 e, na demissão sem justa causa, a multa de 40% sobre o FGTS. Quais delas são devidas depende do tipo de desligamento.',
    },
    {
      q: 'A rescisão por pedido de demissão é diferente?',
      a: 'Sim. Quem pede demissão recebe o saldo de salário, o 13º proporcional e as férias proporcionais e vencidas, mas não recebe o aviso prévio indenizado nem a multa do FGTS. Em alguns casos a empresa pode descontar o aviso não cumprido; esta calculadora não aplica esse desconto por padrão.',
    },
    {
      q: 'O que muda na rescisão por justa causa?',
      a: 'Na justa causa o trabalhador perde o aviso prévio, o 13º proporcional, as férias proporcionais e a multa do FGTS. Ainda assim recebe o saldo de salário e as férias vencidas (períodos já completos e não gozados) acrescidas de 1/3.',
    },
    {
      q: 'Como funciona o acordo (rescisão por comum acordo)?',
      a: 'No acordo entre empregado e empresa, previsto na Reforma Trabalhista, o aviso prévio e a multa do FGTS são pagos pela metade (50% do aviso e 20% sobre o FGTS, no lugar de 40%). O 13º e as férias proporcionais continuam integrais.',
    },
    {
      q: 'Por que o INSS e o IRRF não incidem sobre todas as verbas?',
      a: 'O INSS e o Imposto de Renda incidem apenas sobre o saldo de salário e o 13º proporcional, que têm natureza salarial. Aviso prévio indenizado, férias indenizadas e multa do FGTS têm natureza indenizatória e são isentos desses descontos.',
    },
    {
      q: 'O resultado é o valor exato que vou receber?',
      a: 'Não. É uma estimativa baseada nas regras e tabelas oficiais de 2026. O valor final pode mudar por causa de horas extras, comissões, faltas, descontos contratuais e do tratamento tributário específico do 13º. Para o cálculo oficial, consulte o RH, um contador ou um advogado trabalhista.',
    },
  ],
  affiliates: ['contaDigital'],
};
