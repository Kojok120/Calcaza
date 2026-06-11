import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-pis-pasep',
  title: 'Calculadora de Abono Salarial PIS/Pasep',
  description:
    'Estime o valor do abono salarial PIS/Pasep em 2026 pelos meses trabalhados no ano-base e pelo salário mínimo. Veja o valor proporcional e a tabela mês a mês.',
  primaryKw: 'calculadora abono salarial pis',
  relatedKws: [
    'valor do abono pis',
    'pis pasep quanto vou receber',
    'calcular abono salarial',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-10',
  updatedAt: '2026-06-11',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: 'Como é calculado o valor do abono salarial PIS/Pasep?',
      a: 'O abono é proporcional aos meses trabalhados no ano-base. A conta é (meses trabalhados ÷ 12) × salário mínimo vigente. Em 2026, com salário mínimo de R$ 1.621,00, quem trabalhou os 12 meses recebe o valor cheio (R$ 1.621,00) e quem trabalhou 6 meses recebe cerca de R$ 810,50. O resultado é uma estimativa.',
    },
    {
      q: 'Quem tem direito ao abono salarial em 2026?',
      a: 'Em regra, tem direito quem está inscrito no PIS/Pasep há pelo menos 5 anos, recebeu remuneração mensal média de até 2 salários mínimos no ano-base, trabalhou com carteira assinada por no mínimo 30 dias nesse ano e teve os dados informados corretamente pelo empregador na RAIS ou no eSocial. Confirme sempre a situação nos canais oficiais.',
    },
    {
      q: 'Um mês com menos de 30 dias trabalhados conta para o abono?',
      a: 'Sim. Pela regra oficial, a fração de mês de 15 dias ou mais é considerada como mês cheio no cálculo. Por isso, se você começou no meio do mês mas trabalhou ao menos 15 dias, esse mês entra como um mês completo na contagem.',
    },
    {
      q: 'Qual é o valor mínimo e o valor máximo do abono?',
      a: 'O valor varia de 1/12 do salário mínimo (1 mês trabalhado) até 1 salário mínimo completo (12 meses). Em 2026, isso vai de cerca de R$ 135,08 por 1 mês até R$ 1.621,00 por 12 meses, conforme o salário mínimo vigente.',
    },
    {
      q: 'Onde recebo o abono do PIS e do Pasep?',
      a: 'O abono do PIS, voltado a trabalhadores da iniciativa privada, é pago pela Caixa Econômica Federal. O do Pasep, voltado a servidores públicos, é pago pelo Banco do Brasil. As datas seguem o calendário anual divulgado pelo governo, normalmente organizado pelo mês de nascimento ou pelo número de inscrição.',
    },
    {
      q: 'Esta calculadora garante o pagamento do meu abono?',
      a: 'Não. O resultado é apenas uma estimativa baseada na fórmula oficial. A confirmação do direito e o valor final dependem da análise dos órgãos competentes e dos dados informados pelo empregador. Consulte sempre os canais oficiais para verificar sua situação.',
    },
  ],
  affiliates: [],
};
