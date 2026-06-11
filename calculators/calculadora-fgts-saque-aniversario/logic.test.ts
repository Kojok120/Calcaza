import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-fgts-saque-aniversario — faixas da tabela (Decreto 10.556/2020)', () => {
  it('faixa mais baixa: saldo R$ 400 → 50% sem adicional = R$ 200,00', () => {
    const r = calculate({ saldoFgts: 400 });
    expect(r.aliquota).toBe(0.5);
    expect(r.parcelaAdicional).toBe(0);
    expect(r.valorSaque).toBeCloseTo(200, 2);
    expect(r.saldoRestante).toBeCloseTo(200, 2);
    expect(r.faixaLabel).toBe('Até R$ 500,00');
  });

  it('faixa intermediária com parcela adicional: saldo R$ 8.000 → 20% + R$ 650 = R$ 2.250,00', () => {
    const r = calculate({ saldoFgts: 8000 });
    expect(r.aliquota).toBe(0.2);
    expect(r.parcelaAdicional).toBe(650);
    expect(r.valorSaque).toBeCloseTo(2250, 2);
    expect(r.saldoRestante).toBeCloseTo(5750, 2);
    expect(r.faixaLabel).toBe('De R$ 5.000,01 a R$ 10.000,00');
  });

  it('faixa mais alta: saldo R$ 30.000 → 5% + R$ 2.900 = R$ 4.400,00', () => {
    const r = calculate({ saldoFgts: 30000 });
    expect(r.aliquota).toBe(0.05);
    expect(r.parcelaAdicional).toBe(2900);
    expect(r.valorSaque).toBeCloseTo(4400, 2);
    expect(r.saldoRestante).toBeCloseTo(25600, 2);
    expect(r.faixaLabel).toBe('Acima de R$ 20.000,00');
  });

  it('exemplo oficial da Caixa: saldo R$ 1.000,00 → 40% + R$ 50 = R$ 450,00', () => {
    const r = calculate({ saldoFgts: 1000 });
    expect(r.aliquota).toBe(0.4);
    expect(r.parcelaAdicional).toBe(50);
    expect(r.valorSaque).toBeCloseTo(450, 2);
    expect(r.saldoRestante).toBeCloseTo(550, 2);
  });

  it('exemplo oficial da Caixa: saldo R$ 1.500,00 → 30% + R$ 150 = R$ 600,00', () => {
    const r = calculate({ saldoFgts: 1500 });
    expect(r.aliquota).toBe(0.3);
    expect(r.parcelaAdicional).toBe(150);
    expect(r.valorSaque).toBeCloseTo(600, 2);
    expect(r.saldoRestante).toBeCloseTo(900, 2);
  });
});

describe('calculadora-fgts-saque-aniversario — bordas das faixas', () => {
  it('R$ 500,00 (limite da 1ª faixa) usa 50% sem adicional', () => {
    const r = calculate({ saldoFgts: 500 });
    expect(r.aliquota).toBe(0.5);
    expect(r.parcelaAdicional).toBe(0);
    expect(r.valorSaque).toBeCloseTo(250, 2);
  });

  it('R$ 500,01 (início da 2ª faixa) usa 40% + R$ 50', () => {
    const r = calculate({ saldoFgts: 500.01 });
    expect(r.aliquota).toBe(0.4);
    expect(r.parcelaAdicional).toBe(50);
    expect(r.valorSaque).toBeCloseTo(250, 2); // 200,004 + 50 ≈ 250,00
  });

  it('R$ 20.000,00 (limite da 6ª faixa) usa 10% + R$ 1.900', () => {
    const r = calculate({ saldoFgts: 20000 });
    expect(r.aliquota).toBe(0.1);
    expect(r.parcelaAdicional).toBe(1900);
    expect(r.valorSaque).toBeCloseTo(3900, 2);
    expect(r.saldoRestante).toBeCloseTo(16100, 2);
  });
});

describe('calculadora-fgts-saque-aniversario — valores inválidos e nulos', () => {
  it('saldo zero retorna saque zero (1ª faixa)', () => {
    const r = calculate({ saldoFgts: 0 });
    expect(r.valorSaque).toBe(0);
    expect(r.saldoRestante).toBe(0);
    expect(r.aliquota).toBe(0.5);
  });

  it('saldo negativo é tratado como zero', () => {
    const r = calculate({ saldoFgts: -5000 });
    expect(r.valorSaque).toBe(0);
    expect(r.saldoRestante).toBe(0);
  });

  it('saldo NaN é tratado como zero', () => {
    const r = calculate({ saldoFgts: Number.NaN });
    expect(r.valorSaque).toBe(0);
    expect(r.saldoRestante).toBe(0);
  });

  it('o saque nunca ultrapassa o saldo disponível', () => {
    const r = calculate({ saldoFgts: 8000 });
    expect(r.valorSaque).toBeLessThanOrEqual(8000);
    expect(r.saldoRestante).toBeGreaterThanOrEqual(0);
  });
});
