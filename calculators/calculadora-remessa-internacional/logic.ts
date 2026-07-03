// Calculadora de Remessa Internacional — custo efetivo (VET + IOF).
//
// O objetivo desta calculadora NÃO é ser um conversor de moedas. Ela não busca
// cotação ao vivo: TODOS os números são informados por você (a cotação comercial
// de referência, a cotação do provedor, o spread, a tarifa e a alíquota de IOF).
// A partir disso, ela decompõe o custo real de enviar dinheiro ao exterior e
// mostra como esses itens formam o Valor Efetivo Total (VET) — o mesmo conceito
// de transparência que o Banco Central exige que os provedores divulguem nas
// operações de câmbio.
//
// Convenção de cotação (padrão brasileiro): "R$ por 1 unidade da moeda
// estrangeira" (ex.: R$ 5,20 por US$ 1). Nessa convenção, uma cotação MAIOR é
// PIOR para quem envia — o provedor costuma oferecer uma cotação acima da
// comercial, e essa diferença é o spread.
//
// Componentes do custo:
//   spreadFraction = 1 − cotaçãoComercial / cotaçãoProvedor         (fração perdida no câmbio)
//     — equivale, na convenção inversa (moeda por R$), a (1 − providerRate/commercialRate).
//     — se o spread for informado manualmente (%), ele tem prioridade.
//   fxSpreadCost   = valorEnviado × spreadFraction
//   iofAmount      = baseIOF × (iofPct / 100)
//     baseIOF      = valorEnviado            (iofBase = 'amount')
//                  = valorEnviado + tarifa   (iofBase = 'amount_plus_fee')
//   tariffTotal    = tarifa + outros encargos
//   vetTotalCost   = fxSpreadCost + iofAmount + tariffTotal
//   effectiveCostPct = vetTotalCost / valorEnviado × 100
//   amountReceivedForeign = (valorEnviado − vetTotalCost) / cotaçãoComercial
//   vetEffectiveRate = valorEnviado / amountReceivedForeign   (R$/moeda, tudo incluído)
//
// Função pura, determinística, SEM constantes de mercado embutidas (nenhuma
// alíquota de IOF nem spread fixo): a alíquota de IOF sobre câmbio muda por
// decreto e deve ser conferida na Receita Federal antes de usar.
//
// Fontes (a serem confirmadas pelo fact-checker):
//   - Banco Central do Brasil — mercado de câmbio e transparência (VET):
//     https://www.bcb.gov.br/estabilidadefinanceira/mercadocambio
//   - Banco Central do Brasil — Resolução BCB nº 96/2021 (mercado de câmbio):
//     https://www.bcb.gov.br
//   - Receita Federal — IOF (Imposto sobre Operações Financeiras / câmbio):
//     https://www.gov.br/receitafederal
//   - Decreto nº 6.306/2007 — Regulamento do IOF:
//     https://www.planalto.gov.br/ccivil_03/_ato2007-2010/2007/decreto/d6306.htm
//   - Lei nº 14.286/2021 — Novo Marco Cambial:
//     https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14286.htm

export type Channel = 'bank' | 'fintech' | 'broker';
export type IofBase = 'amount' | 'amount_plus_fee';

export type Input = {
  /** Valor a enviar, em R$. >= 0. */
  sendAmountBRL: number;
  /** Canal usado (informativo; não altera o cálculo). */
  channel: Channel;
  /** Cotação comercial / de referência: R$ por 1 unidade da moeda. > 0. */
  commercialRate: number;
  /** Cotação oferecida pelo provedor: R$ por 1 unidade da moeda. > 0. */
  providerRate: number;
  /** Spread em % informado manualmente. Se > 0, tem prioridade sobre as cotações. */
  spreadPctManual?: number;
  /** Tarifa fixa cobrada pelo provedor, em R$. >= 0. */
  tariffFee: number;
  /** Alíquota de IOF sobre a operação, em % (informe a vigente na Receita). >= 0. */
  iofPct: number;
  /** Base de incidência do IOF: só o valor, ou valor + tarifa. */
  iofBase: IofBase;
  /** Outros encargos fixos, em R$ (opcional). >= 0. */
  extraCharges?: number;
};

export type Output = {
  /** Canal informado (repassado; informativo). */
  channel: Channel;
  /** Spread efetivo aplicado, em % (fração perdida no câmbio × 100). */
  spreadPct: number;
  /** Custo do câmbio (spread) em R$. */
  fxSpreadCost: number;
  /** IOF em R$. */
  iofAmount: number;
  /** Tarifas fixas + outros encargos, em R$. */
  tariffTotal: number;
  /** Valor Efetivo Total do custo, em R$ (spread + IOF + tarifas). */
  vetTotalCost: number;
  /** Custo total como % do valor enviado. */
  effectiveCostPct: number;
  /** Cotação efetiva final: R$ por 1 unidade da moeda, com tudo incluído. */
  vetEffectiveRate: number;
  /** Valor que chega ao destino, em unidades da moeda estrangeira. */
  amountReceivedForeign: number;
};

/** Arredonda para 2 casas; NaN/Infinity -> 0. */
function round2(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

/** Arredonda para 4 casas; NaN/Infinity -> 0. */
function round4(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 10000) / 10000;
}

/** Saneia número não-negativo: NaN/Infinity/negativo -> 0. */
function nn(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x) || x < 0) return 0;
  return x;
}

/** Saneia uma cotação estritamente positiva; inválida -> 0. */
function posRate(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x) || x <= 0) return 0;
  return x;
}

export function calculate(input: Input): Output {
  const channel: Channel =
    input.channel === 'fintech' || input.channel === 'broker'
      ? input.channel
      : 'bank';

  const send = nn(input.sendAmountBRL);
  const commercialRate = posRate(input.commercialRate);
  const providerRate = posRate(input.providerRate);
  const tariffFee = nn(input.tariffFee);
  const extra = nn(input.extraCharges);
  const iofPct = nn(input.iofPct);
  const iofBase: IofBase =
    input.iofBase === 'amount_plus_fee' ? 'amount_plus_fee' : 'amount';

  // Fração do valor perdida no câmbio (spread).
  const manual = input.spreadPctManual;
  let spreadFraction = 0;
  if (typeof manual === 'number' && Number.isFinite(manual) && manual > 0) {
    // Spread informado manualmente tem prioridade.
    spreadFraction = manual / 100;
  } else if (commercialRate > 0 && providerRate > 0) {
    // Convenção R$/moeda: provedor pior => providerRate > commercialRate.
    spreadFraction = 1 - commercialRate / providerRate;
  }
  if (!Number.isFinite(spreadFraction) || spreadFraction < 0) spreadFraction = 0;

  const fxSpreadCost = send * spreadFraction;

  // IOF sobre a base escolhida.
  const iofBaseAmount = iofBase === 'amount_plus_fee' ? send + tariffFee : send;
  const iofAmount = iofBaseAmount * (iofPct / 100);

  // Tarifas fixas + outros encargos.
  const tariffTotal = tariffFee + extra;

  // Valor Efetivo Total do custo (em R$).
  const vetTotalCost = fxSpreadCost + iofAmount + tariffTotal;

  // Custo como % do valor enviado.
  const effectiveCostPct = send > 0 ? (vetTotalCost / send) * 100 : 0;

  // Valor líquido convertido à cotação comercial (o spread já está no custo).
  const netAfterCost = Math.max(0, send - vetTotalCost);
  const amountReceivedForeign =
    commercialRate > 0 ? netAfterCost / commercialRate : 0;

  // Cotação efetiva final (R$ por unidade da moeda, com tudo incluído).
  const vetEffectiveRate =
    amountReceivedForeign > 0 ? send / amountReceivedForeign : 0;

  return {
    channel,
    spreadPct: round4(spreadFraction * 100),
    fxSpreadCost: round2(fxSpreadCost),
    iofAmount: round2(iofAmount),
    tariffTotal: round2(tariffTotal),
    vetTotalCost: round2(vetTotalCost),
    effectiveCostPct: round2(effectiveCostPct),
    vetEffectiveRate: round4(vetEffectiveRate),
    amountReceivedForeign: round2(amountReceivedForeign),
  };
}
