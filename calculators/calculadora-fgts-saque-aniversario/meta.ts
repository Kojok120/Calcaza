import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-fgts-saque-aniversario',
  title: 'Calculadora de Saque-Aniversário do FGTS',
  description:
    'Calcule o valor do saque-aniversário do FGTS a partir do saldo: alíquota da faixa, parcela adicional e quanto fica na conta, pela tabela oficial.',
  primaryKw: 'calculadora saque aniversário fgts',
  relatedKws: [
    'saque aniversário fgts',
    'valor saque aniversário',
    'tabela saque aniversário fgts',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-10',
  updatedAt: '2026-06-11',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: 'Como é calculado o valor do saque-aniversário do FGTS?',
      a: 'O valor é o saldo total das suas contas do FGTS multiplicado pela alíquota da faixa em que o saldo se encaixa, somado a uma parcela adicional fixa. Por exemplo, um saldo de R$ 1.000,00 cai na faixa de 40% + R$ 50,00, resultando em R$ 450,00. A tabela com as 7 faixas está no Decreto nº 10.556/2020.',
    },
    {
      q: 'Qual é a tabela de alíquotas do saque-aniversário?',
      a: 'São 7 faixas: até R$ 500,00 (50%, sem adicional); de R$ 500,01 a R$ 1.000,00 (40% + R$ 50); de R$ 1.000,01 a R$ 5.000,00 (30% + R$ 150); de R$ 5.000,01 a R$ 10.000,00 (20% + R$ 650); de R$ 10.000,01 a R$ 15.000,00 (15% + R$ 1.150); de R$ 15.000,01 a R$ 20.000,00 (10% + R$ 1.900); e acima de R$ 20.000,00 (5% + R$ 2.900). Quanto maior o saldo, menor a alíquota.',
    },
    {
      q: 'O saque-aniversário muda o que recebo na demissão?',
      a: 'Sim, e essa é a parte mais importante. Quem adere ao saque-aniversário não pode sacar o saldo total na demissão sem justa causa: recebe apenas a multa rescisória de 40%, enquanto o saldo segue bloqueado para os saques anuais. Por isso, escolher uma modalidade bloqueia a outra. Avalie com calma antes de aderir.',
    },
    {
      q: 'Em que mês eu recebo o saque-aniversário?',
      a: 'O saque fica disponível no mês do seu aniversário e pode ser sacado dentro de uma janela que vai do primeiro dia do mês de aniversário até o último dia do segundo mês seguinte. Se você não sacar nesse período, o valor volta para a conta do FGTS.',
    },
    {
      q: 'Quem adere ao saque-aniversário recebe a multa de 40%?',
      a: 'Sim. A multa rescisória de 40% sobre o saldo, paga pelo empregador na demissão sem justa causa, continua sendo devida mesmo para quem optou pelo saque-aniversário. O que muda é que o saldo principal não é liberado de imediato — você recebe a multa e o saldo permanece para os saques anuais.',
    },
    {
      q: 'Posso voltar para o saque-rescisão depois de aderir?',
      a: 'Pode, mas a mudança não é imediata. Ao pedir o retorno para a modalidade saque-rescisão, há um período de carência (em geral, a alteração passa a valer no aniversário de adesão seguinte). Esta página traz uma estimativa do valor anual; para confirmar prazos e fazer a opção, use o aplicativo do FGTS ou o site da Caixa.',
    },
  ],
  affiliates: [],
};
