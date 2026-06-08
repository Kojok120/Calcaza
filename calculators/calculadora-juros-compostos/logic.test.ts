import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-juros-compostos calculate', () => {
  it('só valor inicial: R$ 1.000 a 1% a.m. por 12 meses -> R$ 1.126,83', () => {
    const r = calculate({
      valorInicial: 1000,
      aporteMensal: 0,
      taxaJuros: 1,
      periodo: 12,
      tipoTaxa: 'mensal',
      tipoPeriodo: 'meses',
    });
    expect(r.montanteFinal).toBe(1126.83);
    expect(r.totalInvestido).toBe(1000);
    expect(r.totalJuros).toBe(126.83);
    expect(r.meses).toBe(12);
    expect(r.iMensalEfetiva).toBe(0.01);
  });

  it('só aportes: R$ 100/mês a 1% a.m. por 12 meses -> ~R$ 1.268,25', () => {
    const r = calculate({
      valorInicial: 0,
      aporteMensal: 100,
      taxaJuros: 1,
      periodo: 12,
      tipoTaxa: 'mensal',
      tipoPeriodo: 'meses',
    });
    expect(r.montanteFinal).toBe(1268.25);
    expect(r.totalInvestido).toBe(1200);
    expect(r.totalJuros).toBe(68.25);
    expect(r.meses).toBe(12);
  });

  it('inicial + aportes: R$ 1.000 + R$ 200/mês a 1% a.m. por 12 meses', () => {
    const r = calculate({
      valorInicial: 1000,
      aporteMensal: 200,
      taxaJuros: 1,
      periodo: 12,
      tipoTaxa: 'mensal',
      tipoPeriodo: 'meses',
    });
    expect(r.montanteFinal).toBe(3663.33);
    expect(r.totalInvestido).toBe(3400);
    expect(r.totalJuros).toBe(263.33);
    expect(r.meses).toBe(12);
  });

  it('taxa anual convertida: 12,682503% a.a. equivale a 1% a.m.', () => {
    const r = calculate({
      valorInicial: 1000,
      aporteMensal: 0,
      taxaJuros: 12.682503,
      periodo: 12,
      tipoTaxa: 'anual',
      tipoPeriodo: 'meses',
    });
    // (1,12682503)^(1/12) − 1 ≈ 0,01 (1% a.m.) -> mesmo montante do caso 1.
    expect(r.iMensalEfetiva).toBe(0.01);
    expect(r.montanteFinal).toBe(1126.83);
    expect(r.meses).toBe(12);
  });

  it('taxa 0: montante = total investido (sem juros)', () => {
    const r = calculate({
      valorInicial: 1000,
      aporteMensal: 100,
      taxaJuros: 0,
      periodo: 12,
      tipoTaxa: 'mensal',
      tipoPeriodo: 'meses',
    });
    expect(r.montanteFinal).toBe(2200);
    expect(r.totalInvestido).toBe(2200);
    expect(r.totalJuros).toBe(0);
    expect(r.iMensalEfetiva).toBe(0);
  });

  it('período em anos: R$ 1.000 a 1% a.m. por 2 anos -> 24 meses, R$ 1.269,73', () => {
    const r = calculate({
      valorInicial: 1000,
      aporteMensal: 0,
      taxaJuros: 1,
      periodo: 2,
      tipoTaxa: 'mensal',
      tipoPeriodo: 'anos',
    });
    expect(r.meses).toBe(24);
    expect(r.montanteFinal).toBe(1269.73);
    expect(r.totalInvestido).toBe(1000);
    expect(r.totalJuros).toBe(269.73);
  });

  it('edge zeros: tudo zero -> montante 0', () => {
    const r = calculate({
      valorInicial: 0,
      aporteMensal: 0,
      taxaJuros: 1,
      periodo: 0,
      tipoTaxa: 'mensal',
      tipoPeriodo: 'meses',
    });
    expect(r.montanteFinal).toBe(0);
    expect(r.totalInvestido).toBe(0);
    expect(r.totalJuros).toBe(0);
    expect(r.meses).toBe(0);
  });

  it('período 0 com aporte inicial -> montante = valor inicial', () => {
    const r = calculate({
      valorInicial: 1000,
      aporteMensal: 200,
      taxaJuros: 1,
      periodo: 0,
      tipoTaxa: 'mensal',
      tipoPeriodo: 'meses',
    });
    expect(r.montanteFinal).toBe(1000);
    expect(r.totalInvestido).toBe(1000);
    expect(r.totalJuros).toBe(0);
    expect(r.meses).toBe(0);
  });

  it('entradas inválidas (NaN/negativos) são tratadas como 0', () => {
    const r = calculate({
      valorInicial: Number.NaN,
      aporteMensal: -500,
      taxaJuros: Number.POSITIVE_INFINITY,
      periodo: -12,
      tipoTaxa: 'mensal',
      tipoPeriodo: 'meses',
    });
    expect(r.montanteFinal).toBe(0);
    expect(r.totalInvestido).toBe(0);
    expect(r.totalJuros).toBe(0);
    expect(r.meses).toBe(0);
  });

  it('usa defaults (mensal/meses) quando os tipos são omitidos', () => {
    const r = calculate({ taxaJuros: 1, periodo: 12, valorInicial: 1000 });
    expect(r.montanteFinal).toBe(1126.83);
    expect(r.meses).toBe(12);
  });
});
