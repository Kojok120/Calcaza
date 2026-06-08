import { describe, it, expect } from 'vitest';
import { calculate, calcularInss, calcularIrrf } from './logic';

describe('calculadora-conversor-clt-pj — componentes CLT', () => {
  it('reaproveita o INSS progressivo de 2026 (R$ 5.000 -> R$ 501,51)', () => {
    expect(calcularInss(5000)).toBeCloseTo(501.51, 2);
  });

  it('respeita o teto do INSS (R$ 10.000 -> R$ 988,09)', () => {
    expect(calcularInss(10000)).toBe(988.09);
  });

  it('aplica a isenção do IR até R$ 5.000 (IRRF = 0)', () => {
    expect(calcularIrrf(5000, calcularInss(5000), 0)).toBe(0);
  });
});

describe('calculadora-conversor-clt-pj — conversão', () => {
  it('Salário R$ 5.000, taxa PJ 6%: pacote ~5.870,72 e faturamento PJ ~6.245,45', () => {
    const r = calculate({ salarioBrutoClt: 5000, taxaImpostoPj: 6 });
    expect(r.inss).toBeCloseTo(501.51, 2);
    expect(r.irrf).toBe(0);
    expect(r.salarioLiquidoClt).toBeCloseTo(4498.49, 2);
    expect(r.decimoTerceiroMensal).toBeCloseTo(416.67, 2);
    expect(r.feriasMaisTercoMensal).toBeCloseTo(555.56, 2);
    expect(r.fgtsMensal).toBe(400);
    expect(r.pacoteTotalClt).toBeCloseTo(5870.72, 2);
    expect(r.faturamentoPjEquivalente).toBeCloseTo(6245.45, 2);
  });

  it('Salário R$ 10.000, taxa PJ 6%: pacote ~10.186,80 e faturamento PJ ~10.837,02', () => {
    const r = calculate({ salarioBrutoClt: 10000, taxaImpostoPj: 6 });
    expect(r.inss).toBe(988.09);
    expect(r.irrf).toBeCloseTo(1569.55, 2);
    expect(r.salarioLiquidoClt).toBeCloseTo(7442.36, 2);
    expect(r.fgtsMensal).toBe(800);
    expect(r.pacoteTotalClt).toBeCloseTo(10186.8, 2);
    expect(r.faturamentoPjEquivalente).toBeCloseTo(10837.02, 2);
  });

  it('Com benefícios R$ 800: pacote sobe para ~6.670,72 e faturamento PJ para ~7.096,51', () => {
    const r = calculate({
      salarioBrutoClt: 5000,
      beneficiosMensais: 800,
      taxaImpostoPj: 6,
    });
    expect(r.pacoteTotalClt).toBeCloseTo(6670.72, 2);
    expect(r.faturamentoPjEquivalente).toBeCloseTo(7096.51, 2);
  });

  it('Com 2 dependentes (R$ 6.000): IRRF ~280,83; pacote ~6.724,33; faturamento PJ ~7.153,54', () => {
    const r = calculate({ salarioBrutoClt: 6000, dependentes: 2, taxaImpostoPj: 6 });
    expect(r.inss).toBeCloseTo(641.51, 2);
    expect(r.irrf).toBeCloseTo(280.83, 2);
    expect(r.pacoteTotalClt).toBeCloseTo(6724.33, 2);
    expect(r.faturamentoPjEquivalente).toBeCloseTo(7153.54, 2);
  });

  it('Taxa PJ diferente (R$ 8.000, 15,5%): pacote ~8.236,20 e faturamento PJ ~9.746,98', () => {
    const r = calculate({ salarioBrutoClt: 8000, taxaImpostoPj: 15.5 });
    expect(r.inss).toBeCloseTo(921.51, 2);
    expect(r.irrf).toBeCloseTo(1037.85, 2);
    expect(r.pacoteTotalClt).toBeCloseTo(8236.2, 2);
    expect(r.faturamentoPjEquivalente).toBeCloseTo(9746.98, 2);
  });

  it('Com custo de contador R$ 200 (R$ 5.000, 6%): faturamento PJ sobe para ~6.458,21', () => {
    const semContador = calculate({ salarioBrutoClt: 5000, taxaImpostoPj: 6 });
    const comContador = calculate({
      salarioBrutoClt: 5000,
      taxaImpostoPj: 6,
      custoContadorPj: 200,
    });
    expect(comContador.pacoteTotalClt).toBeCloseTo(semContador.pacoteTotalClt, 2);
    expect(comContador.faturamentoPjEquivalente).toBeCloseTo(6458.21, 2);
    expect(comContador.faturamentoPjEquivalente).toBeGreaterThan(
      semContador.faturamentoPjEquivalente
    );
  });

  it('Edge — salário zero, negativo ou NaN retorna tudo zero', () => {
    for (const bruto of [0, -100, Number.NaN]) {
      const r = calculate({ salarioBrutoClt: bruto, taxaImpostoPj: 6 });
      expect(r.pacoteTotalClt).toBe(0);
      expect(r.faturamentoPjEquivalente).toBe(0);
      expect(r.fgtsMensal).toBe(0);
    }
  });

  it('Edge — taxa de imposto PJ >= 100% é inválida e zera o resultado', () => {
    const r = calculate({ salarioBrutoClt: 5000, taxaImpostoPj: 100 });
    expect(r.faturamentoPjEquivalente).toBe(0);
    expect(r.pacoteTotalClt).toBe(0);
  });

  it('Dependentes não inteiros são truncados e negativos viram zero', () => {
    const fracionado = calculate({
      salarioBrutoClt: 6000,
      dependentes: 2.9,
      taxaImpostoPj: 6,
    });
    const inteiro = calculate({ salarioBrutoClt: 6000, dependentes: 2, taxaImpostoPj: 6 });
    expect(fracionado.irrf).toBeCloseTo(inteiro.irrf, 2);
    const negativo = calculate({
      salarioBrutoClt: 6000,
      dependentes: -3,
      taxaImpostoPj: 6,
    });
    const zero = calculate({ salarioBrutoClt: 6000, dependentes: 0, taxaImpostoPj: 6 });
    expect(negativo.irrf).toBeCloseTo(zero.irrf, 2);
  });
});
