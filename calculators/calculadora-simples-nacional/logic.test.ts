import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-simples-nacional calculate', () => {
  it('Anexo III, faixa 1 (RBT12 100.000): alíquota efetiva = 6%', () => {
    const r = calculate({ anexo: 'III', rbt12: 100_000, receitaMes: 10_000 });
    expect(r.faixa).toBe(1);
    expect(r.aliquotaNominal).toBeCloseTo(0.06, 10);
    expect(r.parcelaDeduzir).toBe(0);
    expect(r.aliquotaEfetiva).toBeCloseTo(0.06, 10);
    expect(r.das).toBeCloseTo(600, 2);
    expect(r.excedeuLimite).toBe(false);
  });

  it('Anexo III, faixa 2 (RBT12 300.000): efetiva = 8,08%', () => {
    const r = calculate({ anexo: 'III', rbt12: 300_000, receitaMes: 25_000 });
    expect(r.faixa).toBe(2);
    expect(r.aliquotaNominal).toBeCloseTo(0.112, 10);
    expect(r.parcelaDeduzir).toBe(9_360);
    // (300000 × 0,112 − 9360) / 300000 = 0,0808
    expect(r.aliquotaEfetiva).toBeCloseTo(0.0808, 10);
    expect(r.das).toBeCloseTo(2_020, 2);
  });

  it('Anexo I, faixa 3 (RBT12 500.000): efetiva = 6,728%', () => {
    const r = calculate({ anexo: 'I', rbt12: 500_000, receitaMes: 40_000 });
    expect(r.faixa).toBe(3);
    expect(r.aliquotaNominal).toBeCloseTo(0.095, 10);
    expect(r.parcelaDeduzir).toBe(13_860);
    // (500000 × 0,095 − 13860) / 500000 = 0,06728
    expect(r.aliquotaEfetiva).toBeCloseTo(0.06728, 10);
    expect(r.das).toBeCloseTo(2_691.2, 2);
  });

  it('Anexo V, faixa 1 (RBT12 150.000): efetiva = 15,5%', () => {
    const r = calculate({ anexo: 'V', rbt12: 150_000, receitaMes: 12_000 });
    expect(r.faixa).toBe(1);
    expect(r.aliquotaNominal).toBeCloseTo(0.155, 10);
    expect(r.aliquotaEfetiva).toBeCloseTo(0.155, 10);
    expect(r.das).toBeCloseTo(1_860, 2);
  });

  it('Anexo II, faixa 6 (RBT12 4.000.000): efetiva = 12%', () => {
    const r = calculate({ anexo: 'II', rbt12: 4_000_000, receitaMes: 350_000 });
    expect(r.faixa).toBe(6);
    expect(r.aliquotaNominal).toBeCloseTo(0.3, 10);
    expect(r.parcelaDeduzir).toBe(720_000);
    // (4000000 × 0,30 − 720000) / 4000000 = 0,12
    expect(r.aliquotaEfetiva).toBeCloseTo(0.12, 10);
    expect(r.das).toBeCloseTo(42_000, 2);
  });

  it('limite excedido (RBT12 > 4.800.000): sinaliza fora do Simples', () => {
    const r = calculate({ anexo: 'I', rbt12: 5_000_000, receitaMes: 100_000 });
    expect(r.excedeuLimite).toBe(true);
    expect(r.faixa).toBe(0);
    expect(r.aliquotaEfetiva).toBe(0);
    expect(r.das).toBe(0);
  });

  it('edge: RBT12 = 0 usa nominal da faixa 1 e DAS = 0', () => {
    const r = calculate({ anexo: 'III', rbt12: 0, receitaMes: 0 });
    expect(r.faixa).toBe(1);
    expect(r.aliquotaEfetiva).toBeCloseTo(0.06, 10);
    expect(r.das).toBe(0);
    expect(r.excedeuLimite).toBe(false);
  });

  it('inválidos: NaN e negativos são tratados como 0', () => {
    const r = calculate({
      anexo: 'I',
      rbt12: Number.NaN,
      receitaMes: -1_000,
    });
    expect(r.faixa).toBe(1);
    expect(r.das).toBe(0);
    expect(r.excedeuLimite).toBe(false);
  });

  it('limite exato (RBT12 = 4.800.000) ainda está no Simples (faixa 6)', () => {
    const r = calculate({ anexo: 'I', rbt12: 4_800_000, receitaMes: 100_000 });
    expect(r.excedeuLimite).toBe(false);
    expect(r.faixa).toBe(6);
    expect(r.aliquotaNominal).toBeCloseTo(0.19, 10);
  });
});
