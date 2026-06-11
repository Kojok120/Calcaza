import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-poupanca', () => {
  it('regra Selic > 8,5% a.a. (0,5% + TR): R$ 10.000 por 12 meses', () => {
    const r = calculate({
      valorInicial: 10000,
      depositoMensal: 0,
      prazoMeses: 12,
      selicAnual: 14.5,
      trMensal: 0.17,
    });
    expect(r.regraUsada).toBe('0,5% + TR');
    expect(r.taxaMensalAplicada).toBe(0.67);
    expect(r.totalDepositado).toBe(10000);
    expect(r.valorFinal).toBe(10834.3);
    expect(r.rendimento).toBe(834.3);
  });

  it('regra Selic ≤ 8,5% a.a. (70% da Selic + TR): R$ 10.000 por 12 meses', () => {
    const r = calculate({
      valorInicial: 10000,
      depositoMensal: 0,
      prazoMeses: 12,
      selicAnual: 8,
      trMensal: 0.1,
    });
    expect(r.regraUsada).toBe('70% da Selic + TR');
    expect(r.taxaMensalAplicada).toBe(0.5667);
    expect(r.valorFinal).toBe(10701.6);
    expect(r.rendimento).toBe(701.6);
  });

  it('fronteira: Selic exatamente 8,5% usa a regra de 70% da Selic + TR', () => {
    const r = calculate({
      valorInicial: 10000,
      depositoMensal: 0,
      prazoMeses: 12,
      selicAnual: 8.5,
      trMensal: 0,
    });
    expect(r.regraUsada).toBe('70% da Selic + TR');
    expect(r.taxaMensalAplicada).toBe(0.4958);
    expect(r.valorFinal).toBe(10611.5);
    expect(r.rendimento).toBe(611.5);
  });

  it('com depósitos mensais: R$ 1.000 + R$ 200/mês por 24 meses (Selic 14,5%)', () => {
    const r = calculate({
      valorInicial: 1000,
      depositoMensal: 200,
      prazoMeses: 24,
      selicAnual: 14.5,
      trMensal: 0.17,
    });
    expect(r.regraUsada).toBe('0,5% + TR');
    expect(r.totalDepositado).toBe(5800);
    expect(r.valorFinal).toBe(6362.49);
    expect(r.rendimento).toBe(562.49);
  });

  it('valor exato: R$ 10.000 a 0,5% a.m. (TR 0) por 1 mês rende R$ 50', () => {
    const r = calculate({
      valorInicial: 10000,
      depositoMensal: 0,
      prazoMeses: 1,
      selicAnual: 14.5,
      trMensal: 0,
    });
    expect(r.taxaMensalAplicada).toBe(0.5);
    expect(r.valorFinal).toBe(10050);
    expect(r.rendimento).toBe(50);
  });

  it('taxa zero (Selic 0 e TR 0) não gera rendimento', () => {
    const r = calculate({
      valorInicial: 5000,
      depositoMensal: 0,
      prazoMeses: 12,
      selicAnual: 0,
      trMensal: 0,
    });
    expect(r.regraUsada).toBe('70% da Selic + TR');
    expect(r.taxaMensalAplicada).toBe(0);
    expect(r.valorFinal).toBe(5000);
    expect(r.rendimento).toBe(0);
  });

  it('entradas inválidas: valores negativos/NaN viram 0 e prazo 0 é elevado a 1', () => {
    const r = calculate({
      valorInicial: -100,
      depositoMensal: Number.NaN,
      prazoMeses: 0,
      selicAnual: 14.5,
      trMensal: 0.17,
    });
    expect(r.prazoMeses).toBe(1);
    expect(r.totalDepositado).toBe(0);
    expect(r.valorFinal).toBe(0);
    expect(r.rendimento).toBe(0);
  });

  it('prazo acima do máximo é limitado a 600 meses', () => {
    const r = calculate({
      valorInicial: 1000,
      depositoMensal: 0,
      prazoMeses: 1200,
      selicAnual: 14.5,
      trMensal: 0.17,
    });
    expect(r.prazoMeses).toBe(600);
  });
});
