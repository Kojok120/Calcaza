import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-salario-proporcional', () => {
  it('base 30 (padrão CLT): R$ 3.000 e 30 dias = mês cheio (R$ 3.000), valor/dia R$ 100', () => {
    const r = calculate({ salarioMensal: 3000, diasTrabalhados: 30, baseDias: '30' });
    expect(r.base).toBe(30);
    expect(r.valorDia).toBeCloseTo(100, 2);
    expect(r.salarioProporcional).toBeCloseTo(3000, 2);
    expect(r.diasTrabalhados).toBe(30);
    expect(r.fracaoLabel).toBe('30/30');
  });

  it('base 30: R$ 3.000 e 10 dias trabalhados = R$ 1.000 (admissão no meio do mês)', () => {
    const r = calculate({ salarioMensal: 3000, diasTrabalhados: 10, baseDias: '30' });
    expect(r.valorDia).toBeCloseTo(100, 2);
    expect(r.salarioProporcional).toBeCloseTo(1000, 2);
    expect(r.fracaoLabel).toBe('10/30');
  });

  it('base por dias do mês (31): R$ 3.100 e 31 dias = mês cheio (R$ 3.100), valor/dia R$ 100', () => {
    const r = calculate({
      salarioMensal: 3100,
      diasTrabalhados: 31,
      baseDias: 'mes',
      baseDiasMes: 31,
    });
    expect(r.base).toBe(31);
    expect(r.valorDia).toBeCloseTo(100, 2);
    expect(r.salarioProporcional).toBeCloseTo(3100, 2);
    expect(r.fracaoLabel).toBe('31/31');
  });

  it('valor exato com fração não inteira: R$ 2.500, base 30, 15 dias = R$ 1.250,00', () => {
    const r = calculate({ salarioMensal: 2500, diasTrabalhados: 15, baseDias: '30' });
    // valorDia = 2500/30 = 83,333...; proporcional = 83,333... × 15 = 1250,00
    expect(r.valorDia).toBeCloseTo(83.33, 2);
    expect(r.salarioProporcional).toBe(1250);
    expect(r.fracaoLabel).toBe('15/30');
  });

  it('baseDiasMes fora de 28-31 é limitado (clamp): 35 -> 31 e 20 -> 28', () => {
    const alto = calculate({
      salarioMensal: 3000,
      diasTrabalhados: 10,
      baseDias: 'mes',
      baseDiasMes: 35,
    });
    expect(alto.base).toBe(31);
    const baixo = calculate({
      salarioMensal: 3000,
      diasTrabalhados: 10,
      baseDias: 'mes',
      baseDiasMes: 20,
    });
    expect(baixo.base).toBe(28);
  });

  it('dias trabalhados acima da base são limitados à base (clamp <= base)', () => {
    const r = calculate({ salarioMensal: 3000, diasTrabalhados: 40, baseDias: '30' });
    expect(r.diasTrabalhados).toBe(30);
    expect(r.salarioProporcional).toBeCloseTo(3000, 2);
    expect(r.fracaoLabel).toBe('30/30');
  });

  it('casos inválidos: salário 0, negativo ou NaN retornam proporcional 0', () => {
    for (const salario of [0, -1000, Number.NaN]) {
      const r = calculate({ salarioMensal: salario, diasTrabalhados: 15, baseDias: '30' });
      expect(r.salarioProporcional).toBe(0);
      expect(r.valorDia).toBe(0);
    }
  });

  it('dias trabalhados inválidos ou negativos viram 0', () => {
    const neg = calculate({ salarioMensal: 3000, diasTrabalhados: -5, baseDias: '30' });
    expect(neg.diasTrabalhados).toBe(0);
    expect(neg.salarioProporcional).toBe(0);
    const nan = calculate({ salarioMensal: 3000, diasTrabalhados: Number.NaN, baseDias: '30' });
    expect(nan.diasTrabalhados).toBe(0);
  });

  it('dias trabalhados não inteiros são truncados (15,9 -> 15)', () => {
    const r = calculate({ salarioMensal: 3000, diasTrabalhados: 15.9, baseDias: '30' });
    expect(r.diasTrabalhados).toBe(15);
    expect(r.salarioProporcional).toBeCloseTo(1500, 2);
  });
});
