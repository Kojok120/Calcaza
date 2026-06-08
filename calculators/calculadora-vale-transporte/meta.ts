import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-vale-transporte',
  title: 'Calculadora de Vale-Transporte',
  description:
    'Calcule o desconto do vale-transporte na folha: no máximo 6% do salário, limitado ao custo real do transporte, e veja quanto a empresa paga.',
  primaryKw: 'calculadora vale transporte',
  relatedKws: [
    'desconto vale transporte 6%',
    'cálculo do vale transporte',
    'desconto vt na folha',
    'quanto a empresa paga de vale transporte',
    'vale transporte clt',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-23',
  updatedAt: '2026-05-23',
  reviewedAt: '2026-05-23',
  faqs: [
    {
      q: 'Quanto a empresa pode descontar de vale-transporte?',
      a: 'A empresa pode descontar do empregado no máximo 6% do salário básico a título de vale-transporte. Esse percentual é um teto, não um valor fixo: se o custo real do transporte for menor que 6% do salário, o desconto fica limitado ao custo real. A regra está na Lei nº 7.418/1985, regulamentada pelo Decreto nº 95.247/1987.',
    },
    {
      q: 'Quem paga a diferença quando o transporte custa mais que 6%?',
      a: 'O empregador. Quando o custo mensal do transporte ultrapassa 6% do salário básico, o trabalhador contribui apenas com os 6% e a empresa arca com toda a diferença. Por isso, em salários mais baixos, costuma ser a empresa quem paga a maior parte do vale-transporte.',
    },
    {
      q: 'Os 6% incidem sobre qual salário?',
      a: 'Sobre o salário básico (salário-base contratual), e não sobre a remuneração total com adicionais. Horas extras, adicional noturno, comissões e outras verbas variáveis não entram na base do desconto de 6% do vale-transporte, conforme o Decreto nº 95.247/1987.',
    },
    {
      q: 'O vale-transporte é obrigatório para o empregado?',
      a: 'O benefício é um direito do trabalhador, mas a adesão é opcional. Quem não precisa do transporte público para ir ao trabalho pode não solicitar o vale-transporte. Para receber, o empregado informa por escrito o endereço e os meios de transporte que utiliza no trajeto de ida e volta.',
    },
    {
      q: 'O desconto do vale-transporte conta como salário?',
      a: 'Não. O vale-transporte não tem natureza salarial: ele não integra a remuneração para nenhum efeito, não incide INSS nem FGTS sobre ele e não entra no cálculo de 13º, férias ou rescisão. É um benefício de natureza indenizatória, pago em pecúnia ou em vale.',
    },
    {
      q: 'Como o desconto é calculado nesta calculadora?',
      a: 'Primeiro multiplicamos o gasto diário com transporte pelos dias trabalhados no mês para chegar ao custo mensal. Depois comparamos esse custo com 6% do salário básico. O desconto do empregado é o menor dos dois valores, e a empresa paga o que sobrar do custo mensal acima desse desconto.',
    },
  ],
  affiliates: [],
};
