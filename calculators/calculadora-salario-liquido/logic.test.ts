import { describe, it, expect } from 'vitest';
import { calculate, calcularInss } from './logic';

const TOL = 0.02; // tolerância de centavos para arredondamento

describe('calculadora-salario-liquido — INSS', () => {
  it('aplica a tabela progressiva para R$ 2.000', () => {
    expect(calcularInss(2000)).toBeCloseTo(155.69, 2);
  });

  it('aplica a tabela progressiva para R$ 3.000', () => {
    expect(calcularInss(3000)).toBeCloseTo(248.6, 2);
  });

  it('respeita o teto: qualquer bruto >= R$ 8.475,55 desconta exatamente R$ 988,09', () => {
    expect(calcularInss(8475.55)).toBe(988.09);
    expect(calcularInss(9000)).toBe(988.09);
    expect(calcularInss(20000)).toBe(988.09);
  });
});

describe('calculadora-salario-liquido — salário líquido', () => {
  it('Bruto R$ 2.000, 0 dependentes: INSS ~155,69; IRRF 0; líquido ~1.844,31', () => {
    const r = calculate({ salarioBruto: 2000 });
    expect(r.inss).toBeCloseTo(155.69, 2);
    expect(r.irrf).toBe(0);
    expect(r.salarioLiquido).toBeCloseTo(1844.31, 2);
  });

  it('Bruto R$ 3.000, 0 dependentes: INSS ~248,60; IRRF 0; líquido ~2.751,40', () => {
    const r = calculate({ salarioBruto: 3000 });
    expect(r.inss).toBeCloseTo(248.6, 2);
    expect(r.irrf).toBe(0);
    expect(r.salarioLiquido).toBeCloseTo(2751.4, 2);
  });

  it('Bruto R$ 5.000 (limite da isenção): INSS ~501,51; IRRF 0; líquido ~4.498,49', () => {
    const r = calculate({ salarioBruto: 5000 });
    expect(r.inss).toBeCloseTo(501.51, 2);
    expect(r.irrf).toBe(0); // isenção total até R$ 5.000
    expect(r.salarioLiquido).toBeCloseTo(4498.49, 2);
  });

  it('Bruto R$ 6.000, 1 dependente: INSS ~641,51; imposto ~512,72; redutor ~179,75; IRRF ~332,97; líquido ~5.025,52', () => {
    const r = calculate({ salarioBruto: 6000, dependentes: 1 });
    expect(r.inss).toBeCloseTo(641.51, 2);
    expect(r.irrfAntesRedutor).toBeCloseTo(512.72, 2);
    expect(r.redutor).toBeCloseTo(179.75, 2);
    expect(r.irrf).toBeCloseTo(332.97, 2);
    expect(r.salarioLiquido).toBeCloseTo(5025.52, 2);
  });

  it('Bruto R$ 10.000, 2 dependentes (acima do teto e de 7.350, sem redutor): INSS 988,09; IRRF ~1.465,27; líquido ~7.546,64', () => {
    const r = calculate({ salarioBruto: 10000, dependentes: 2 });
    expect(r.inss).toBe(988.09);
    expect(r.redutor).toBe(0);
    expect(r.irrf).toBeCloseTo(1465.27, 2);
    expect(r.salarioLiquido).toBeCloseTo(7546.64, 2);
  });

  it('Redutor sanity: no bruto de R$ 7.350 o redutor é zero (978,62 − 0,133145×7350 ≈ 0)', () => {
    const r = calculate({ salarioBruto: 7350 });
    expect(Math.abs(r.redutor)).toBeLessThanOrEqual(TOL);
  });

  it('Outros descontos são subtraídos do líquido', () => {
    const semExtra = calculate({ salarioBruto: 3000 });
    const comExtra = calculate({ salarioBruto: 3000, outrosDescontos: 150 });
    expect(comExtra.salarioLiquido).toBeCloseTo(semExtra.salarioLiquido - 150, 2);
    expect(comExtra.outrosDescontos).toBe(150);
  });

  it('Dependentes não inteiros são truncados e nunca ficam negativos', () => {
    const r1 = calculate({ salarioBruto: 6000, dependentes: 1.9 });
    const r2 = calculate({ salarioBruto: 6000, dependentes: 1 });
    expect(r1.irrf).toBeCloseTo(r2.irrf, 2);
    const rNeg = calculate({ salarioBruto: 6000, dependentes: -3 });
    const r0 = calculate({ salarioBruto: 6000, dependentes: 0 });
    expect(rNeg.irrf).toBeCloseTo(r0.irrf, 2);
  });

  it('Casos inválidos: bruto 0, negativo ou NaN retornam tudo zero', () => {
    for (const bruto of [0, -100, Number.NaN]) {
      const r = calculate({ salarioBruto: bruto });
      expect(r.inss).toBe(0);
      expect(r.irrf).toBe(0);
      expect(r.salarioLiquido).toBe(0);
      expect(r.salarioBruto).toBe(0);
    }
  });
});
