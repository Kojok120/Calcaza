import { describe, it, expect } from 'vitest';
import {
  calculate,
  sanearMeses,
  sanearSalarioMinimo,
  SALARIO_MINIMO_2026,
} from './logic';

describe('calculadora-pis-pasep — abono salarial', () => {
  it('12 meses trabalhados: abono = 1 salário mínimo cheio (R$ 1.621,00)', () => {
    const r = calculate({ mesesTrabalhados: 12, salarioMinimo: 1621.0 });
    expect(r.valorAbono).toBe(1621.0);
    expect(r.mesesConsiderados).toBe(12);
    expect(r.salarioMinimo).toBe(1621.0);
  });

  it('cálculo parcial: 6 meses = metade do salário mínimo = R$ 810,50', () => {
    const r = calculate({ mesesTrabalhados: 6, salarioMinimo: 1621.0 });
    expect(r.valorAbono).toBe(810.5);
    expect(r.mesesConsiderados).toBe(6);
  });

  it('1 mês trabalhado: abono = 1/12 do salário mínimo = R$ 135,08', () => {
    // 1621 / 12 = 135,0833... -> arredonda para R$ 135,08.
    const r = calculate({ mesesTrabalhados: 1, salarioMinimo: 1621.0 });
    expect(r.valorAbono).toBe(135.08);
    expect(r.valorPorMes).toBe(135.08);
    expect(r.mesesConsiderados).toBe(1);
  });

  it('valor exato (worked example): 9 meses = (9/12) × 1.621 = R$ 1.215,75', () => {
    const r = calculate({ mesesTrabalhados: 9, salarioMinimo: 1621.0 });
    expect(r.valorAbono).toBe(1215.75);
    expect(r.mesesConsiderados).toBe(9);
  });

  it('entrada inválida: meses negativos/NaN e salário <= 0 são saneados', () => {
    // Meses inválidos -> 0 meses considerados (abono 0); salário inválido volta ao padrão 2026.
    const r = calculate({ mesesTrabalhados: -3, salarioMinimo: Number.NaN });
    expect(r.mesesConsiderados).toBe(0);
    expect(r.valorAbono).toBe(0);
    expect(r.salarioMinimo).toBe(SALARIO_MINIMO_2026);
  });

  it('clamp dos meses acima de 12: 15 meses é tratado como 12 (abono máximo)', () => {
    const r = calculate({ mesesTrabalhados: 15, salarioMinimo: 1621.0 });
    expect(r.mesesConsiderados).toBe(12);
    expect(r.valorAbono).toBe(1621.0);
  });

  it('salário mínimo editável: 12 meses com R$ 1.518,00 = R$ 1.518,00', () => {
    const r = calculate({ mesesTrabalhados: 12, salarioMinimo: 1518.0 });
    expect(r.valorAbono).toBe(1518.0);
    expect(r.salarioMinimo).toBe(1518.0);
  });

  it('helpers de saneamento isolados', () => {
    expect(sanearMeses(7.9)).toBe(7); // fração truncada para inteiro
    expect(sanearMeses(0)).toBe(0);
    expect(sanearMeses(20)).toBe(12);
    expect(sanearSalarioMinimo(0)).toBe(SALARIO_MINIMO_2026);
    expect(sanearSalarioMinimo(2000)).toBe(2000);
  });
});
