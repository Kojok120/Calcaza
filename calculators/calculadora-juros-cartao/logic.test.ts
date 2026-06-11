import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-juros-cartao calculate', () => {
  it('1 mês: R$ 2.000 a 14% a.m. -> montante R$ 2.280,00 e R$ 280 de juros', () => {
    const r = calculate({ saldoDevedor: 2000, taxaJurosMensal: 14, meses: 1 });
    expect(r.montanteFinal).toBe(2280);
    expect(r.jurosTotal).toBe(280);
    expect(r.jurosPrimeiroMes).toBe(280);
    expect(r.taxaAnualEquivalente).toBe(3.8179);
    expect(r.meses).toBe(1);
  });

  it('vários meses (juros compostos): R$ 2.000 a 14% a.m. por 6 meses -> R$ 4.389,95', () => {
    const r = calculate({ saldoDevedor: 2000, taxaJurosMensal: 14, meses: 6 });
    expect(r.montanteFinal).toBe(4389.95);
    expect(r.jurosTotal).toBe(2389.95);
    // No 1º mês os juros são só sobre os R$ 2.000; o composto vem depois.
    expect(r.jurosPrimeiroMes).toBe(280);
    expect(r.meses).toBe(6);
  });

  it('taxa 0%: sem juros, montante = saldo devedor', () => {
    const r = calculate({ saldoDevedor: 1000, taxaJurosMensal: 0, meses: 6 });
    expect(r.montanteFinal).toBe(1000);
    expect(r.jurosTotal).toBe(0);
    expect(r.jurosPrimeiroMes).toBe(0);
    expect(r.taxaAnualEquivalente).toBe(0);
    expect(r.meses).toBe(6);
  });

  it('valor exato conhecido: R$ 1.000 a 14% a.m. por 12 meses -> R$ 4.817,90', () => {
    const r = calculate({ saldoDevedor: 1000, taxaJurosMensal: 14, meses: 12 });
    expect(r.montanteFinal).toBe(4817.9);
    expect(r.jurosTotal).toBe(3817.9);
    expect(r.jurosPrimeiroMes).toBe(140);
    // (1,14)^12 − 1 ≈ 3,8179 -> 381,79% a.a.
    expect(r.taxaAnualEquivalente).toBe(3.8179);
    expect(r.meses).toBe(12);
  });

  it('entradas inválidas (NaN/negativos) são tratadas com segurança', () => {
    const r = calculate({
      saldoDevedor: Number.NaN,
      taxaJurosMensal: -5,
      meses: Number.POSITIVE_INFINITY,
    });
    expect(r.montanteFinal).toBe(0);
    expect(r.jurosTotal).toBe(0);
    expect(r.jurosPrimeiroMes).toBe(0);
    expect(r.taxaAnualEquivalente).toBe(0);
    // meses inválido -> mínimo (1).
    expect(r.meses).toBe(1);
  });

  it('meses fora do intervalo é limitado a 1-24', () => {
    const baixo = calculate({ saldoDevedor: 1000, taxaJurosMensal: 14, meses: 0 });
    expect(baixo.meses).toBe(1);
    const alto = calculate({ saldoDevedor: 1000, taxaJurosMensal: 14, meses: 99 });
    expect(alto.meses).toBe(24);
    // meses fracionário é arredondado para baixo.
    const frac = calculate({ saldoDevedor: 1000, taxaJurosMensal: 14, meses: 6.9 });
    expect(frac.meses).toBe(6);
  });
});
