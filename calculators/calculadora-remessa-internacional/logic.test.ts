import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-remessa-internacional calculate', () => {
  it('caso normal com spread manual (2%): decompõe o VET de uma remessa de R$ 10.000', () => {
    const r = calculate({
      sendAmountBRL: 10000,
      channel: 'bank',
      commercialRate: 5.0,
      providerRate: 5.0,
      spreadPctManual: 2,
      tariffFee: 30,
      iofPct: 1,
      iofBase: 'amount',
      extraCharges: 0,
    });
    expect(r.spreadPct).toBe(2); // manual tem prioridade sobre as cotações iguais
    expect(r.fxSpreadCost).toBe(200); // 10.000 × 2%
    expect(r.iofAmount).toBe(100); // 10.000 × 1%
    expect(r.tariffTotal).toBe(30);
    expect(r.vetTotalCost).toBe(330); // 200 + 100 + 30
    expect(r.effectiveCostPct).toBe(3.3); // 330 / 10.000
    expect(r.amountReceivedForeign).toBe(1934); // (10.000 − 330) / 5,00
    expect(r.vetEffectiveRate).toBe(5.1706); // 10.000 / 1.934
    expect(r.channel).toBe('bank');
  });

  it('spread derivado das cotações (R$/moeda): comercial 5,00 vs provedor 5,25', () => {
    const r = calculate({
      sendAmountBRL: 5000,
      channel: 'fintech',
      commercialRate: 5.0,
      providerRate: 5.25,
      tariffFee: 15,
      iofPct: 1.1,
      iofBase: 'amount',
      extraCharges: 0,
    });
    // 1 − 5,00/5,25 = 4,7619%
    expect(r.spreadPct).toBe(4.7619);
    expect(r.fxSpreadCost).toBe(238.1);
    expect(r.iofAmount).toBe(55); // 5.000 × 1,1%
    expect(r.tariffTotal).toBe(15);
    expect(r.vetTotalCost).toBe(308.1);
    expect(r.effectiveCostPct).toBe(6.16);
    expect(r.amountReceivedForeign).toBe(938.38);
    expect(r.vetEffectiveRate).toBe(5.3283);
  });

  it('limite: sem tarifa, sem IOF e cotações iguais -> custo zero e taxa efetiva = comercial', () => {
    const r = calculate({
      sendAmountBRL: 2000,
      channel: 'broker',
      commercialRate: 5.1,
      providerRate: 5.1,
      tariffFee: 0,
      iofPct: 0,
      iofBase: 'amount',
    });
    expect(r.fxSpreadCost).toBe(0);
    expect(r.iofAmount).toBe(0);
    expect(r.tariffTotal).toBe(0);
    expect(r.vetTotalCost).toBe(0);
    expect(r.effectiveCostPct).toBe(0);
    expect(r.amountReceivedForeign).toBe(392.16); // 2.000 / 5,10
    expect(r.vetEffectiveRate).toBe(5.1); // sem custo, a taxa efetiva iguala a comercial
  });

  it('limite: valor enviado zero -> percentuais e conversão em 0 (sem divisão inválida)', () => {
    const r = calculate({
      sendAmountBRL: 0,
      channel: 'bank',
      commercialRate: 5.1,
      providerRate: 5.4,
      tariffFee: 20,
      iofPct: 1.1,
      iofBase: 'amount',
    });
    expect(r.fxSpreadCost).toBe(0);
    expect(r.iofAmount).toBe(0);
    expect(r.tariffTotal).toBe(20); // tarifa fixa independe do valor
    expect(r.effectiveCostPct).toBe(0); // guard: valor enviado 0
    expect(r.amountReceivedForeign).toBe(0);
    expect(r.vetEffectiveRate).toBe(0);
  });

  it('entradas inválidas (negativos, NaN, cotação comercial 0) são tratadas com segurança', () => {
    const r = calculate({
      sendAmountBRL: -100,
      channel: 'bank',
      commercialRate: 0,
      providerRate: Number.NaN,
      spreadPctManual: Number.NaN,
      tariffFee: -5,
      iofPct: Number.NaN,
      iofBase: 'amount',
      extraCharges: -10,
    });
    expect(r.spreadPct).toBe(0);
    expect(r.fxSpreadCost).toBe(0);
    expect(r.iofAmount).toBe(0);
    expect(r.tariffTotal).toBe(0);
    expect(r.vetTotalCost).toBe(0);
    expect(r.effectiveCostPct).toBe(0);
    expect(r.amountReceivedForeign).toBe(0);
    expect(r.vetEffectiveRate).toBe(0);
  });

  it('spread domina a tarifa: banco com tarifa menor pode custar mais que fintech', () => {
    const fintechBaixoSpread = calculate({
      sendAmountBRL: 10000,
      channel: 'fintech',
      commercialRate: 5.0,
      providerRate: 5.05, // spread ~0,99%
      tariffFee: 25,
      iofPct: 1.1,
      iofBase: 'amount',
    });
    const bancoAltoSpread = calculate({
      sendAmountBRL: 10000,
      channel: 'bank',
      commercialRate: 5.0,
      providerRate: 5.4, // spread ~7,41%
      tariffFee: 10, // tarifa MENOR que a da fintech
      iofPct: 1.1,
      iofBase: 'amount',
    });
    expect(fintechBaixoSpread.effectiveCostPct).toBe(2.34);
    expect(bancoAltoSpread.effectiveCostPct).toBe(8.61);
    // Mesmo com tarifa menor, o banco fica mais caro por causa do spread.
    expect(bancoAltoSpread.effectiveCostPct).toBeGreaterThan(
      fintechBaixoSpread.effectiveCostPct
    );
    expect(bancoAltoSpread.amountReceivedForeign).toBeLessThan(
      fintechBaixoSpread.amountReceivedForeign
    );
  });

  it('base do IOF: "valor" vs "valor + tarifa" muda o imposto', () => {
    const base = {
      sendAmountBRL: 1000,
      channel: 'bank' as const,
      commercialRate: 5.0,
      providerRate: 5.0,
      tariffFee: 100,
      iofPct: 2,
    };
    const soValor = calculate({ ...base, iofBase: 'amount' });
    const valorMaisTarifa = calculate({ ...base, iofBase: 'amount_plus_fee' });
    expect(soValor.iofAmount).toBe(20); // 1.000 × 2%
    expect(valorMaisTarifa.iofAmount).toBe(22); // (1.000 + 100) × 2%
    expect(valorMaisTarifa.iofAmount - soValor.iofAmount).toBe(2);
  });
});
