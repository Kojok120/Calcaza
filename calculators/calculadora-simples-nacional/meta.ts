import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-simples-nacional',
  title: 'Calculadora do Simples Nacional 2026',
  description:
    'Calcule o DAS do Simples Nacional por anexo: informe a RBT12 (receita dos 12 meses) e o faturamento do mês para ver a alíquota efetiva e o valor a pagar.',
  primaryKw: 'calculadora simples nacional',
  relatedKws: [
    'simples nacional 2026',
    'alíquota efetiva simples nacional',
    'cálculo do das simples nacional',
    'anexos do simples nacional',
    'tabela simples nacional rbt12',
  ],
  category: 'tax',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-17',
  updatedAt: '2026-05-17',
  reviewedAt: '2026-05-17',
  faqs: [
    {
      q: 'O que é a alíquota efetiva do Simples Nacional?',
      a: 'É a alíquota que realmente incide sobre o faturamento do mês. Ela é menor que a alíquota nominal da tabela porque desconta a parcela a deduzir. A fórmula é: (RBT12 × alíquota nominal − parcela a deduzir) ÷ RBT12. Por isso duas empresas no mesmo anexo podem pagar percentuais diferentes, conforme a receita acumulada.',
    },
    {
      q: 'O que é RBT12 no Simples Nacional?',
      a: 'RBT12 é a Receita Bruta acumulada dos últimos 12 meses. É esse valor, e não o faturamento de um único mês, que define em qual faixa da tabela a empresa se encaixa. O faturamento do mês entra depois, apenas para calcular o DAS: faturamento do mês × alíquota efetiva.',
    },
    {
      q: 'Quais são os anexos do Simples Nacional?',
      a: 'O Anexo I é para comércio, o Anexo II para indústria e os Anexos III e V para serviços. Cada anexo tem suas próprias alíquotas nominais e parcelas a deduzir, embora as seis faixas de RBT12 sejam as mesmas. A escolha entre Anexo III e V para alguns serviços depende do fator R.',
    },
    {
      q: 'Qual o limite de faturamento do Simples Nacional?',
      a: 'O teto de receita bruta anual do Simples Nacional é de R$ 4.800.000. Acima disso, a empresa precisa migrar para outro regime, como o Lucro Presumido ou o Lucro Real. Quando a RBT12 ultrapassa esse limite, a calculadora sinaliza que não há alíquota do Simples aplicável.',
    },
    {
      q: 'A alíquota efetiva é igual à alíquota nominal?',
      a: 'Não, exceto na primeira faixa, em que a parcela a deduzir é zero. Nas demais faixas a alíquota efetiva é sempre menor que a nominal, porque a parcela a deduzir reduz o resultado. Confundir nominal com efetiva é um erro comum e leva a superestimar o DAS.',
    },
    {
      q: 'Esta calculadora serve para o MEI?',
      a: 'Não. O MEI paga um DAS de valor fixo mensal, que não depende do faturamento nem das faixas de RBT12. Para o microempreendedor individual existe a calculadora do DAS MEI. Esta ferramenta é para microempresas (ME) e empresas de pequeno porte (EPP) no Simples Nacional.',
    },
  ],
  affiliates: ['contabilizei'],
};
