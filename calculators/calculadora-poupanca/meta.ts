import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-poupanca',
  title: 'Calculadora de Rendimento da Poupança (2026)',
  description:
    'Simule quanto rende a poupança por mês e no prazo desejado, com a regra oficial da Lei 12.703/2012 (0,5% + TR ou 70% da Selic + TR) e Selic e TR editáveis.',
  primaryKw: 'calculadora rendimento da poupança',
  relatedKws: [
    'quanto rende a poupança',
    'rendimento poupança mensal',
    'simulação poupança',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-06-11',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-06-11',
  faqs: [
    {
      q: 'Quanto rende a poupança hoje?',
      a: 'A poupança segue uma regra fixada por lei (Lei 12.703/2012) com dois regimes, definidos pela taxa Selic. Quando a Selic meta está acima de 8,5% ao ano — como no cenário atual, com Selic em 14,5% — a poupança rende 0,5% ao mês mais a TR (Taxa Referencial). Com a TR em torno de 0,17% ao mês, o rendimento fica em aproximadamente 0,67% ao mês. Como a Selic e a TR mudam ao longo do tempo, esta calculadora deixa os dois valores editáveis para você simular com os números atuais.',
    },
    {
      q: 'Como funciona a regra dos 0,5% ao mês e dos 70% da Selic?',
      a: 'A Lei 12.703/2012 criou dois regimes. Se a Selic meta estiver acima de 8,5% ao ano, a poupança rende 0,5% ao mês mais a TR. Se a Selic meta for igual ou menor que 8,5% ao ano, ela passa a render 70% da Selic (no equivalente mensal) mais a TR — ou seja, rende menos quando os juros caem. O limite de 8,5% é o ponto que separa os dois regimes, e foi pensado para reduzir o rendimento da poupança em cenários de juros baixos.',
    },
    {
      q: 'A poupança paga Imposto de Renda?',
      a: 'Não. A poupança é isenta de Imposto de Renda para pessoa física, independentemente do prazo ou do valor aplicado. Essa é uma das suas vantagens. Por outro lado, mesmo isenta, a poupança costuma render menos do que um bom CDB ou um título do Tesouro Direto já descontado o imposto, porque a regra de remuneração dela é limitada por lei.',
    },
    {
      q: 'A TR (Taxa Referencial) faz diferença no rendimento?',
      a: 'Sim, embora pequena. A TR é somada ao rendimento da poupança em ambos os regimes. Por anos ela ficou zerada, mas voltou a ter valores positivos com a Selic mais alta. Em junho de 2026, a TR está em torno de 0,17% ao mês. Como a TR é calculada e divulgada mensalmente pelo Banco Central, esta calculadora a deixa como campo editável para você usar o valor mais recente.',
    },
    {
      q: 'Por que a poupança rende menos quando a Selic cai abaixo de 8,5%?',
      a: 'Porque a regra muda de regime. Acima de 8,5% ao ano, o rendimento é travado em 0,5% ao mês mais TR. Quando a Selic fica igual ou abaixo de 8,5%, o rendimento passa a ser 70% da Selic mais TR — e, como 70% de uma Selic baixa resulta em um número pequeno, a poupança rende bem menos. Foi exatamente para isso que a Lei 12.703/2012 foi criada: evitar que a poupança ficasse atraente demais em cenários de juros baixos.',
    },
    {
      q: 'Este resultado é exato?',
      a: 'É uma estimativa. A calculadora aplica corretamente a regra legal e a matemática de juros compostos, mas o resultado real pode variar um pouco. Bancos creditam o rendimento na data de aniversário de cada depósito, depósitos feitos perto do fim do mês podem perder o rendimento do período, e a TR muda mês a mês. Use o resultado como uma boa aproximação para planejar, não como o valor exato do extrato.',
    },
  ],
  affiliates: [],
};
