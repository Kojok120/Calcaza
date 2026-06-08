import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-rendimento-investimentos', () => {
  it('CDB de 1 ano (12 meses, 12% a.a., 360 dias -> IR 20%)', () => {
    const r = calculate({
      valorInicial: 10000,
      meses: 12,
      tipo: 'cdb_tesouro',
      taxaAnual: 12,
    });
    expect(r.montanteBruto).toBe(11200);
    expect(r.totalInvestido).toBe(10000);
    expect(r.rendimentoBruto).toBe(1200);
    expect(r.aliquotaIR).toBe(0.2);
    expect(r.impostoIR).toBe(240);
    expect(r.rendimentoLiquido).toBe(960);
    expect(r.montanteLiquido).toBe(10960);
  });

  it('CDB de 3 anos (36 meses, 12% a.a., 1080 dias -> IR 15%)', () => {
    const r = calculate({
      valorInicial: 10000,
      meses: 36,
      tipo: 'cdb_tesouro',
      taxaAnual: 12,
    });
    expect(r.montanteBruto).toBe(14049.28);
    expect(r.rendimentoBruto).toBe(4049.28);
    expect(r.aliquotaIR).toBe(0.15);
    expect(r.impostoIR).toBe(607.39);
    expect(r.rendimentoLiquido).toBe(3441.89);
    expect(r.montanteLiquido).toBe(13441.89);
  });

  it('CDB de prazo curto (6 meses, 12% a.a., 180 dias -> IR 22,5%)', () => {
    const r = calculate({
      valorInicial: 10000,
      meses: 6,
      tipo: 'cdb_tesouro',
      taxaAnual: 12,
    });
    expect(r.montanteBruto).toBe(10583.01);
    expect(r.rendimentoBruto).toBe(583.01);
    expect(r.aliquotaIR).toBe(0.225);
    expect(r.impostoIR).toBe(131.18);
    expect(r.rendimentoLiquido).toBe(451.83);
    expect(r.montanteLiquido).toBe(10451.83);
  });

  it('Poupança (12 meses, 0,5% a.m., isenta de IR)', () => {
    const r = calculate({ valorInicial: 10000, meses: 12, tipo: 'poupanca' });
    expect(r.montanteBruto).toBe(10616.78);
    expect(r.rendimentoBruto).toBe(616.78);
    expect(r.aliquotaIR).toBe(0);
    expect(r.impostoIR).toBe(0);
    expect(r.rendimentoLiquido).toBe(616.78);
    expect(r.montanteLiquido).toBe(10616.78);
  });

  it('CDB com aportes mensais (24 meses, R$ 200/mês, 12% a.a., 720 dias -> IR 17,5%)', () => {
    const r = calculate({
      valorInicial: 1000,
      aporteMensal: 200,
      meses: 24,
      tipo: 'cdb_tesouro',
      taxaAnual: 12,
    });
    expect(r.totalInvestido).toBe(5800);
    expect(r.montanteBruto).toBe(6616.52);
    expect(r.rendimentoBruto).toBe(816.52);
    expect(r.aliquotaIR).toBe(0.175);
    expect(r.impostoIR).toBe(142.89);
    expect(r.rendimentoLiquido).toBe(673.62);
    expect(r.montanteLiquido).toBe(6473.62);
  });

  it('Taxa zero não gera rendimento nem IR', () => {
    const r = calculate({
      valorInicial: 10000,
      meses: 12,
      tipo: 'cdb_tesouro',
      taxaAnual: 0,
    });
    expect(r.montanteBruto).toBe(10000);
    expect(r.rendimentoBruto).toBe(0);
    expect(r.aliquotaIR).toBe(0);
    expect(r.impostoIR).toBe(0);
    expect(r.montanteLiquido).toBe(10000);
  });

  it('Prazo zero: montante é apenas o valor inicial', () => {
    const r = calculate({
      valorInicial: 5000,
      meses: 0,
      tipo: 'cdb_tesouro',
      taxaAnual: 12,
    });
    expect(r.montanteBruto).toBe(5000);
    expect(r.totalInvestido).toBe(5000);
    expect(r.rendimentoBruto).toBe(0);
    expect(r.impostoIR).toBe(0);
    expect(r.montanteLiquido).toBe(5000);
    expect(r.meses).toBe(0);
  });

  it('Valores negativos e NaN são tratados como zero', () => {
    const r = calculate({
      valorInicial: -100,
      aporteMensal: Number.NaN,
      meses: 12,
      tipo: 'cdb_tesouro',
      taxaAnual: 12,
    });
    expect(r.montanteBruto).toBe(0);
    expect(r.totalInvestido).toBe(0);
    expect(r.rendimentoBruto).toBe(0);
    expect(r.impostoIR).toBe(0);
    expect(r.montanteLiquido).toBe(0);
  });

  it('Poupança com aportes mensais (24 meses, R$ 300/mês, isenta de IR)', () => {
    const r = calculate({
      valorInicial: 0,
      aporteMensal: 300,
      meses: 24,
      tipo: 'poupanca',
    });
    expect(r.totalInvestido).toBe(7200);
    expect(r.montanteBruto).toBe(7629.59);
    expect(r.rendimentoBruto).toBe(429.59);
    expect(r.aliquotaIR).toBe(0);
    expect(r.impostoIR).toBe(0);
    expect(r.montanteLiquido).toBe(7629.59);
  });
});
