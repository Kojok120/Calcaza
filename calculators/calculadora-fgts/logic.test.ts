import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-fgts — depósito mensal (8%)', () => {
  it('salário de R$ 3.000 gera depósito mensal de R$ 240,00', () => {
    const r = calculate({ salarioBruto: 3000 });
    expect(r.depositoMensal).toBe(240);
  });

  it('salário de R$ 4.000 gera depósito mensal de R$ 320,00', () => {
    const r = calculate({ salarioBruto: 4000 });
    expect(r.depositoMensal).toBe(320);
  });
});

describe('calculadora-fgts — projeção composta', () => {
  it('12 meses sem saldo inicial (R$ 3.000, 3% a.a.): saldo ~2.919,93 e rendimento ~39,93', () => {
    const r = calculate({
      salarioBruto: 3000,
      mesesContribuidos: 12,
      saldoAtual: 0,
      taxaAnualRendimento: 3,
    });
    expect(r.depositoMensal).toBe(240);
    expect(r.totalDepositado).toBeCloseTo(2880, 2);
    expect(r.saldoProjetado).toBeCloseTo(2919.93, 2);
    expect(r.rendimentoAcumulado).toBeCloseTo(39.93, 2);
  });

  it('com saldo inicial (R$ 5.000), salário R$ 2.000, 6 meses, 3% a.a.: saldo ~6.041,49 e rendimento ~81,49', () => {
    const r = calculate({
      salarioBruto: 2000,
      mesesContribuidos: 6,
      saldoAtual: 5000,
      taxaAnualRendimento: 3,
    });
    expect(r.depositoMensal).toBe(160);
    expect(r.totalDepositado).toBeCloseTo(5960, 2);
    expect(r.saldoProjetado).toBeCloseTo(6041.49, 2);
    expect(r.rendimentoAcumulado).toBeCloseTo(81.49, 2);
  });

  it('24 meses sem saldo (R$ 5.000, 3% a.a.): saldo ~9.881,13 e rendimento ~281,13', () => {
    const r = calculate({
      salarioBruto: 5000,
      mesesContribuidos: 24,
      taxaAnualRendimento: 3,
    });
    expect(r.depositoMensal).toBe(400);
    expect(r.totalDepositado).toBeCloseTo(9600, 2);
    expect(r.saldoProjetado).toBeCloseTo(9881.13, 2);
    expect(r.rendimentoAcumulado).toBeCloseTo(281.13, 2);
  });

  it('taxa 0% a.a.: saldo projetado é igual ao total depositado (sem rendimento)', () => {
    const r = calculate({
      salarioBruto: 3000,
      mesesContribuidos: 12,
      taxaAnualRendimento: 0,
    });
    expect(r.saldoProjetado).toBeCloseTo(2880, 2);
    expect(r.totalDepositado).toBeCloseTo(2880, 2);
    expect(r.rendimentoAcumulado).toBeCloseTo(0, 2);
  });
});

describe('calculadora-fgts — multas rescisórias', () => {
  it('multa de 40% e de 20% sobre o saldo projetado de ~2.919,93', () => {
    const r = calculate({
      salarioBruto: 3000,
      mesesContribuidos: 12,
      taxaAnualRendimento: 3,
      calcularMulta: true,
    });
    expect(r.multaRescisoria40).toBeCloseTo(1167.97, 2);
    expect(r.multaAcordo20).toBeCloseTo(583.99, 2);
  });

  it('as multas são apuradas mesmo com calcularMulta ausente (a flag só afeta a UI)', () => {
    const comFlag = calculate({
      salarioBruto: 3000,
      mesesContribuidos: 12,
      calcularMulta: true,
    });
    const semFlag = calculate({
      salarioBruto: 3000,
      mesesContribuidos: 12,
    });
    expect(comFlag.multaRescisoria40).toBeCloseTo(semFlag.multaRescisoria40, 2);
    expect(comFlag.multaAcordo20).toBeCloseTo(semFlag.multaAcordo20, 2);
  });
});

describe('calculadora-fgts — casos de borda e inválidos', () => {
  it('0 meses: saldo projetado = saldo atual e total depositado = saldo atual', () => {
    const r = calculate({
      salarioBruto: 3000,
      mesesContribuidos: 0,
      saldoAtual: 1000,
    });
    expect(r.saldoProjetado).toBe(1000);
    expect(r.totalDepositado).toBe(1000);
    expect(r.rendimentoAcumulado).toBe(0);
    expect(r.depositoMensal).toBe(240);
  });

  it('valores negativos e NaN são tratados como zero', () => {
    const r = calculate({
      salarioBruto: -3000,
      mesesContribuidos: -5,
      saldoAtual: Number.NaN,
    });
    expect(r.depositoMensal).toBe(0);
    expect(r.totalDepositado).toBe(0);
    expect(r.saldoProjetado).toBe(0);
    expect(r.rendimentoAcumulado).toBe(0);
    expect(r.multaRescisoria40).toBe(0);
    expect(r.multaAcordo20).toBe(0);
  });

  it('meses fracionários são truncados para inteiro', () => {
    const fracionario = calculate({
      salarioBruto: 3000,
      mesesContribuidos: 12.9,
      taxaAnualRendimento: 3,
    });
    const inteiro = calculate({
      salarioBruto: 3000,
      mesesContribuidos: 12,
      taxaAnualRendimento: 3,
    });
    expect(fracionario.saldoProjetado).toBeCloseTo(inteiro.saldoProjetado, 2);
  });

  it('taxa ausente assume o padrão de 3% a.a.', () => {
    const semTaxa = calculate({ salarioBruto: 3000, mesesContribuidos: 12 });
    const comTaxa = calculate({
      salarioBruto: 3000,
      mesesContribuidos: 12,
      taxaAnualRendimento: 3,
    });
    expect(semTaxa.saldoProjetado).toBeCloseTo(comTaxa.saldoProjetado, 2);
  });
});
