import { describe, it, expect } from 'vitest';
import { calculate, calcularInss, calcularIrrf } from './logic';

describe('calculadora-decimo-terceiro — tabelas auxiliares', () => {
  it('INSS progressivo: R$ 3.000 -> R$ 248,60', () => {
    expect(calcularInss(3000)).toBeCloseTo(248.6, 2);
  });

  it('INSS respeita o teto: >= R$ 8.475,55 -> R$ 988,09', () => {
    expect(calcularInss(8475.55)).toBe(988.09);
    expect(calcularInss(15000)).toBe(988.09);
  });

  it('IRRF sem redutor: base R$ 2.000 é isenta', () => {
    expect(calcularIrrf(2000)).toBe(0);
  });
});

describe('calculadora-decimo-terceiro — 13º salário', () => {
  it('Ano completo (12 meses), bruto R$ 3.000: 13º bruto 3.000; 1ª parcela 1.500; INSS 248,60; IRRF 24,19; 2ª parcela 1.227,21; líquido 2.727,21', () => {
    const r = calculate({ salarioBruto: 3000, mesesTrabalhados: 12 });
    expect(r.decimoBruto).toBeCloseTo(3000, 2);
    expect(r.primeiraParcela).toBeCloseTo(1500, 2);
    expect(r.inss).toBeCloseTo(248.6, 2);
    expect(r.irrf).toBeCloseTo(24.19, 2);
    expect(r.segundaParcela).toBeCloseTo(1227.21, 2);
    expect(r.totalLiquido).toBeCloseTo(2727.21, 2);
    // 1ª + 2ª parcela = total líquido
    expect(r.primeiraParcela + r.segundaParcela).toBeCloseTo(r.totalLiquido, 2);
  });

  it('Proporcional (7 meses), bruto R$ 3.000: 13º bruto 1.750 (3.000/12×7); isento de IRRF; líquido 1.616,81', () => {
    const r = calculate({ salarioBruto: 3000, mesesTrabalhados: 7 });
    expect(r.decimoBruto).toBeCloseTo(1750, 2);
    expect(r.primeiraParcela).toBeCloseTo(875, 2);
    expect(r.inss).toBeCloseTo(133.19, 2);
    expect(r.irrf).toBe(0);
    expect(r.segundaParcela).toBeCloseTo(741.81, 2);
    expect(r.totalLiquido).toBeCloseTo(1616.81, 2);
  });

  it('Salário isento de IRRF (bruto R$ 2.000, 12 meses): INSS 155,69; IRRF 0; líquido 1.844,31', () => {
    const r = calculate({ salarioBruto: 2000, mesesTrabalhados: 12 });
    expect(r.decimoBruto).toBeCloseTo(2000, 2);
    expect(r.inss).toBeCloseTo(155.69, 2);
    expect(r.irrf).toBe(0);
    expect(r.totalLiquido).toBeCloseTo(1844.31, 2);
  });

  it('Salário com IRRF (bruto R$ 5.000, 12 meses, 0 dependentes): INSS 501,51; IRRF 336,67; líquido 4.161,82', () => {
    const r = calculate({ salarioBruto: 5000, mesesTrabalhados: 12 });
    expect(r.decimoBruto).toBeCloseTo(5000, 2);
    expect(r.inss).toBeCloseTo(501.51, 2);
    expect(r.irrf).toBeCloseTo(336.67, 2);
    expect(r.segundaParcela).toBeCloseTo(1661.82, 2);
    expect(r.totalLiquido).toBeCloseTo(4161.82, 2);
  });

  it('Com dependentes (bruto R$ 5.000, 12 meses, 2 dependentes): IRRF menor que sem dependentes (251,35); líquido 4.247,14', () => {
    const r = calculate({ salarioBruto: 5000, mesesTrabalhados: 12, dependentes: 2 });
    const semDep = calculate({ salarioBruto: 5000, mesesTrabalhados: 12 });
    expect(r.irrf).toBeCloseTo(251.35, 2);
    expect(r.irrf).toBeLessThan(semDep.irrf);
    expect(r.totalLiquido).toBeCloseTo(4247.14, 2);
  });

  it('Acima do teto do INSS (bruto R$ 10.000, 12 meses): INSS trava em 988,09; IRRF 1.569,55; líquido 7.442,36', () => {
    const r = calculate({ salarioBruto: 10000, mesesTrabalhados: 12 });
    expect(r.inss).toBe(988.09);
    expect(r.irrf).toBeCloseTo(1569.55, 2);
    expect(r.totalLiquido).toBeCloseTo(7442.36, 2);
  });

  it('Com médias de adicionais (bruto R$ 3.000 + R$ 600 de médias, 12 meses): base 3.600; 13º bruto 3.600; líquido 3.181,65', () => {
    const r = calculate({ salarioBruto: 3000, mesesTrabalhados: 12, mediaAdicionais: 600 });
    expect(r.decimoBruto).toBeCloseTo(3600, 2);
    expect(r.inss).toBeCloseTo(320.6, 2);
    expect(r.irrf).toBeCloseTo(97.75, 2);
    expect(r.totalLiquido).toBeCloseTo(3181.65, 2);
  });

  it('Edge: zeros (bruto 0, 0 meses) retornam tudo zero', () => {
    const r = calculate({ salarioBruto: 0, mesesTrabalhados: 0 });
    expect(r.decimoBruto).toBe(0);
    expect(r.primeiraParcela).toBe(0);
    expect(r.inss).toBe(0);
    expect(r.irrf).toBe(0);
    expect(r.segundaParcela).toBe(0);
    expect(r.totalLiquido).toBe(0);
    expect(r.aliquotaEfetiva).toBe(0);
  });

  it('Edge: valores inválidos (negativos / NaN) são saneados para 0', () => {
    const rNeg = calculate({ salarioBruto: -3000, mesesTrabalhados: 12 });
    expect(rNeg.totalLiquido).toBe(0);
    const rNaN = calculate({ salarioBruto: Number.NaN, mesesTrabalhados: 12 });
    expect(rNaN.totalLiquido).toBe(0);
  });

  it('Meses fora do intervalo são limitados (clamp 0–12): 20 meses = 12 meses; -5 meses = 0', () => {
    const r20 = calculate({ salarioBruto: 3000, mesesTrabalhados: 20 });
    const r12 = calculate({ salarioBruto: 3000, mesesTrabalhados: 12 });
    expect(r20.decimoBruto).toBeCloseTo(r12.decimoBruto, 2);
    const rNeg = calculate({ salarioBruto: 3000, mesesTrabalhados: -5 });
    expect(rNeg.decimoBruto).toBe(0);
  });
});
