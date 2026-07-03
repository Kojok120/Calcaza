import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-ferias',
  title: 'Calculadora de Férias 2026',
  description:
    'Calcule o valor líquido das suas férias em 2026: férias, terço constitucional e abono pecuniário, com os descontos de INSS e IRRF pelas tabelas oficiais.',
  primaryKw: 'calculadora de férias',
  relatedKws: [
    'cálculo de férias 2026',
    'valor das férias mais 1/3',
    'abono pecuniário vender férias',
    'desconto inss e irrf nas férias',
  ],
  category: 'labor',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-30',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-06-13',
  faqs: [
    {
      q: 'Como é calculado o valor das férias?',
      a: 'As férias correspondem à remuneração dos dias de descanso: o salário bruto dividido por 30 e multiplicado pelos dias de férias gozados. Sobre esse valor soma-se o terço constitucional (1/3 a mais), garantido pela Constituição. Sobre o total incidem os descontos de INSS e de Imposto de Renda na fonte.',
    },
    {
      q: 'O que é o terço constitucional de férias?',
      a: 'É o acréscimo de um terço (1/3) sobre a remuneração das férias, previsto no art. 7º, XVII, da Constituição Federal. Ele é sempre devido: quem tira 30 dias de férias recebe o valor das férias mais um terço desse valor. Não é um bônus opcional do empregador, e sim um direito.',
    },
    {
      q: 'O que significa "vender 1/3 das férias" (abono pecuniário)?',
      a: 'Pelo art. 143 da CLT, o trabalhador pode converter até um terço do período de férias em dinheiro — o chamado abono pecuniário. Na prática, vende 10 dias e descansa os outros 20. O abono e o seu próprio terço constitucional são isentos de INSS e de IRRF, por isso costumam render líquido cheio.',
    },
    {
      q: 'As férias têm desconto de INSS e Imposto de Renda?',
      a: 'Sim. A parcela das férias gozadas mais o terço constitucional é base de cálculo para o INSS e para o IRRF, apurados de forma semelhante ao salário do mês. Já o abono pecuniário (a parte vendida) é isento. Por isso, ao vender 10 dias, parte da sua remuneração não sofre desconto.',
    },
    {
      q: 'Quantos dias de férias eu posso vender?',
      a: 'No máximo um terço do período, ou seja, 10 dias quando o período é de 30 dias. O empregador não é obrigado a aceitar fora do prazo legal, e o pedido normalmente deve ser feito até 15 dias antes do fim do período aquisitivo. Vender mais do que 10 dias não é permitido pela CLT.',
    },
    {
      q: 'Este resultado é exato?',
      a: 'É uma estimativa baseada nas tabelas de INSS e IRRF de 2026. O valor que aparece no seu contracheque pode variar conforme adicionais, médias de horas extras e comissões incorporadas, faltas e a forma como a empresa apura a base. Para o número oficial, confirme com o RH ou com um contador.',
    },
  ],
  affiliates: [],
};
