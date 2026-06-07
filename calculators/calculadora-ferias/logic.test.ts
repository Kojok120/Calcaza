import { describe, it, expect } from 'vitest';
import { calculate, calcularInss, calcularIrrf } from './logic';

describe('calculadora-ferias — funções auxiliares', () => {
  it('INSS sobre base de R$ 4.000 (progressivo) ~ R$ 368,60', () => {
    expect(calcularInss(4000)).toBeCloseTo(368.6, 2);
  });

  it('INSS respeita o teto: base >= R$ 8.475,55 desconta R$ 988,09', () => {
    expect(calcularInss(8475.55)).toBe(988.09);
    expect(calcularInss(12000)).toBe(988.09);
  });

  it('IRRF é zero quando a base é isenta (<= R$ 2.428,80)', () => {
    expect(calcularIrrf(2208.31)).toBe(0);
  });
});

describe('calculadora-ferias — cálculo das férias', () => {
  it('30 dias, sem abono, salário R$ 3.000: bruto 4.000; INSS ~368,60; IRRF ~150,55; líquido ~3.480,85', () => {
    const r = calculate({ salarioBruto: 3000, diasFerias: 30 });
    expect(r.valorFerias).toBeCloseTo(3000, 2);
    expect(r.tercoConstitucional).toBeCloseTo(1000, 2);
    expect(r.abono).toBe(0);
    expect(r.abonoTerco).toBe(0);
    expect(r.baseTributavel).toBeCloseTo(4000, 2);
    expect(r.inss).toBeCloseTo(368.6, 2);
    expect(r.irrf).toBeCloseTo(150.55, 2);
    expect(r.totalBruto).toBeCloseTo(4000, 2);
    expect(r.totalLiquido).toBeCloseTo(3480.85, 2);
  });

  it('20 dias + abono pecuniário (R$ 3.000): abono e seu 1/3 são isentos; bruto total 4.000; líquido ~3.782,65', () => {
    const r = calculate({ salarioBruto: 3000, diasFerias: 20, venderUmTerco: true });
    expect(r.valorFerias).toBeCloseTo(2000, 2);
    expect(r.tercoConstitucional).toBeCloseTo(666.67, 2);
    expect(r.abono).toBeCloseTo(1000, 2);
    expect(r.abonoTerco).toBeCloseTo(333.33, 2);
    // Base tributável NÃO inclui o abono nem o 1/3 do abono.
    expect(r.baseTributavel).toBeCloseTo(2666.67, 2);
    expect(r.inss).toBeCloseTo(215.69, 2);
    expect(r.irrf).toBeCloseTo(1.66, 2);
    expect(r.totalBruto).toBeCloseTo(4000, 2);
    expect(r.totalLiquido).toBeCloseTo(3782.65, 2);
  });

  it('Salário R$ 1.800, 30 dias: base R$ 2.400 fica isenta de IRRF; líquido ~2.208,31', () => {
    const r = calculate({ salarioBruto: 1800, diasFerias: 30 });
    expect(r.baseTributavel).toBeCloseTo(2400, 2);
    expect(r.inss).toBeCloseTo(191.69, 2);
    expect(r.irrf).toBe(0);
    expect(r.totalLiquido).toBeCloseTo(2208.31, 2);
  });

  it('Salário R$ 5.000, 30 dias (com IRRF): INSS ~734,85; IRRF ~722,52; líquido ~5.209,30', () => {
    const r = calculate({ salarioBruto: 5000, diasFerias: 30 });
    expect(r.baseTributavel).toBeCloseTo(6666.67, 2);
    expect(r.inss).toBeCloseTo(734.85, 2);
    expect(r.irrf).toBeCloseTo(722.52, 2);
    expect(r.totalBruto).toBeCloseTo(6666.67, 2);
    expect(r.totalLiquido).toBeCloseTo(5209.3, 2);
  });

  it('Salário R$ 5.000, 30 dias, 2 dependentes: dedução reduz o IRRF para ~618,25; líquido ~5.313,57', () => {
    const r = calculate({ salarioBruto: 5000, diasFerias: 30, dependentes: 2 });
    expect(r.inss).toBeCloseTo(734.85, 2);
    expect(r.baseIrrf).toBeCloseTo(5552.64, 2);
    expect(r.irrf).toBeCloseTo(618.25, 2);
    expect(r.totalLiquido).toBeCloseTo(5313.57, 2);
  });

  it('Edge: diasFerias 0 é clampado para 1; diasFerias 45 é clampado para 30', () => {
    const r0 = calculate({ salarioBruto: 3000, diasFerias: 0 });
    expect(r0.diasFerias).toBe(1);
    expect(r0.valorFerias).toBeCloseTo(100, 2);

    const r45 = calculate({ salarioBruto: 3000, diasFerias: 45 });
    expect(r45.diasFerias).toBe(30);
    expect(r45.valorFerias).toBeCloseTo(3000, 2);
  });

  it('Edge: dependentes não inteiros são truncados e negativos viram 0', () => {
    const a = calculate({ salarioBruto: 5000, diasFerias: 30, dependentes: 2.9 });
    const b = calculate({ salarioBruto: 5000, diasFerias: 30, dependentes: 2 });
    expect(a.irrf).toBeCloseTo(b.irrf, 2);

    const neg = calculate({ salarioBruto: 5000, diasFerias: 30, dependentes: -4 });
    const zero = calculate({ salarioBruto: 5000, diasFerias: 30, dependentes: 0 });
    expect(neg.irrf).toBeCloseTo(zero.irrf, 2);
  });

  it('Inválidos: salário 0, negativo ou NaN retornam tudo zero', () => {
    for (const bruto of [0, -500, Number.NaN]) {
      const r = calculate({ salarioBruto: bruto, diasFerias: 30 });
      expect(r.salarioBruto).toBe(0);
      expect(r.valorFerias).toBe(0);
      expect(r.tercoConstitucional).toBe(0);
      expect(r.inss).toBe(0);
      expect(r.irrf).toBe(0);
      expect(r.totalBruto).toBe(0);
      expect(r.totalLiquido).toBe(0);
    }
  });
});
