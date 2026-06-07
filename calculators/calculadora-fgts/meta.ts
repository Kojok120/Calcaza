import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-fgts',
  title: 'Calculadora de FGTS 2026',
  description:
    'Calcule o depósito de 8% do FGTS, projete o saldo com rendimento aproximado e veja a multa rescisória de 40% (e 20% no acordo) sobre o saldo.',
  primaryKw: 'calculadora fgts',
  relatedKws: [
    'calcular fgts 2026',
    'depósito 8% fgts salário',
    'multa de 40% do fgts',
    'projeção saldo fgts',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-03',
  updatedAt: '2026-06-03',
  reviewedAt: '2026-06-03',
  faqs: [
    {
      q: 'Quanto é depositado de FGTS por mês?',
      a: 'O empregador deposita 8% do salário bruto do trabalhador CLT na conta vinculada da Caixa, conforme a Lei nº 8.036/1990. Esse valor não é descontado do seu salário: é uma obrigação paga pela empresa, por cima da remuneração. No caso do jovem aprendiz, a alíquota é reduzida para 2%.',
    },
    {
      q: 'O FGTS é descontado do meu salário?',
      a: 'Não. Diferente do INSS e do IRRF, o FGTS não sai do seu salário. Os 8% são pagos pelo empregador e creditados na sua conta vinculada na Caixa Econômica Federal. Por isso ele não aparece como desconto no holerite.',
    },
    {
      q: 'Como o saldo do FGTS rende?',
      a: 'O saldo é corrigido pela Taxa Referencial (TR) mais juros de 3% ao ano e, em alguns anos, recebe ainda uma distribuição de lucros do Fundo. Esta calculadora projeta apenas os 3% ao ano (sem a TR e sem distribuição), então o rendimento real tende a ser um pouco maior. Trate o número como uma estimativa.',
    },
    {
      q: 'Quanto é a multa de 40% do FGTS?',
      a: 'Na demissão sem justa causa, o empregador paga uma multa rescisória de 40% sobre todo o saldo da conta do FGTS (incluindo o que já foi sacado em alguns casos). No acordo entre as partes (distrato), a multa cai para 20%. A calculadora aplica os dois percentuais sobre o saldo projetado.',
    },
    {
      q: 'O saque-aniversário muda o que recebo na demissão?',
      a: 'Sim. Quem adere ao saque-aniversário não pode sacar o saldo total na demissão sem justa causa (recebe apenas a multa de 40%, com o saldo seguindo bloqueado para saques anuais). A multa de 40% continua sendo paga sobre o saldo. Avalie essa escolha com atenção.',
    },
    {
      q: 'Esta calculadora serve para autônomo ou MEI?',
      a: 'Não. O FGTS é obrigatório para o trabalhador com carteira assinada (CLT). Autônomos, contribuintes individuais e MEI não têm FGTS por padrão. A calculadora foi feita para o vínculo CLT.',
    },
  ],
  affiliates: [],
};
