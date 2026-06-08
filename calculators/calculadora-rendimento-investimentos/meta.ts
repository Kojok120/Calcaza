import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-rendimento-investimentos',
  title: 'Calculadora de Rendimentos (CDB e Poupança)',
  description:
    'Simule o rendimento de CDB, Tesouro e poupança com aporte mensal: veja o montante bruto, o desconto do IR regressivo e quanto sobra líquido no resgate.',
  primaryKw: 'calculadora de rendimentos',
  relatedKws: [
    'simulador de cdb',
    'rendimento da poupança',
    'calcular rendimento de investimento',
    'imposto de renda renda fixa',
    'tabela regressiva ir cdb',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-05-31',
  updatedAt: '2026-05-31',
  reviewedAt: '2026-05-31',
  faqs: [
    {
      q: 'Como funciona a tabela regressiva do IR em CDB e Tesouro?',
      a: 'Na renda fixa, o Imposto de Renda segue uma tabela regressiva fixada pela Lei 11.033/2004: 22,5% para resgates em até 180 dias, 20% de 181 a 360 dias, 17,5% de 361 a 720 dias e 15% acima de 720 dias. Quanto mais tempo o dinheiro fica aplicado, menor a alíquota. O imposto incide apenas sobre o rendimento (o lucro), nunca sobre o valor que você aplicou, e é cobrado no momento do resgate.',
    },
    {
      q: 'A poupança paga Imposto de Renda?',
      a: 'Não. A poupança é isenta de Imposto de Renda para pessoa física, independentemente do prazo ou do valor. Em compensação, no regime atual (com a Selic acima de 8,5% ao ano) ela rende cerca de 0,5% ao mês mais a TR (Taxa Referencial), o que costuma ser menos do que um bom CDB ou um título do Tesouro mesmo depois do desconto do IR. Esta calculadora usa 0,5% ao mês e trata a TR como um adicional não incluído.',
    },
    {
      q: 'O imposto incide sobre o valor total ou só sobre o rendimento?',
      a: 'Apenas sobre o rendimento. Se você aplicou R$ 10.000 e resgatou R$ 11.200, o IR é calculado sobre os R$ 1.200 de lucro, não sobre os R$ 11.200. Por isso o valor que você investiu volta integralmente; o imposto morde só a parte que o dinheiro rendeu.',
    },
    {
      q: 'Como informo a taxa do CDB se ela vem como percentual do CDI?',
      a: 'Muitos CDBs são anunciados como um percentual do CDI (por exemplo, 110% do CDI). Para usar esta calculadora, converta esse valor para uma taxa anual em porcentagem. Se o CDI estiver em torno de 10% ao ano, um CDB de 110% do CDI rende cerca de 11% ao ano (10% × 1,10). Informe esse número no campo de taxa anual. O CDI acompanha de perto a taxa Selic divulgada pelo Banco Central.',
    },
    {
      q: 'O que é o IOF nos primeiros 30 dias?',
      a: 'O IOF (Imposto sobre Operações Financeiras) incide sobre rendimentos de aplicações resgatadas em menos de 30 dias, de forma decrescente: vai de 96% do rendimento no primeiro dia a 0% no trigésimo dia. Como praticamente desaparece após um mês, esta calculadora não o inclui. Se você pretende resgatar em poucos dias, lembre que o IOF reduzirá bastante o ganho.',
    },
    {
      q: 'Meu dinheiro em CDB está protegido?',
      a: 'CDBs contam com a garantia do FGC (Fundo Garantidor de Créditos), que cobre até R$ 250 mil por CPF e por instituição financeira, em caso de quebra do banco emissor. Títulos do Tesouro Direto não têm FGC, mas são garantidos pelo Tesouro Nacional. A poupança também é coberta pelo FGC nos mesmos limites. Esta é uma estimativa de rendimento e não uma recomendação de investimento.',
    },
  ],
  affiliates: ['corretora', 'cursoFinancas'],
};
