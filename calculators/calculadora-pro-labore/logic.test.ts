import { describe, it, expect } from 'vitest';
import { calculate, calcularInssProLabore } from './logic';

describe('calculadora-pro-labore — INSS do contribuinte individual', () => {
  it('aplica 11% sobre o pró-labore e respeita o teto (máx. R$ 932,31)', () => {
    expect(calcularInssProLabore(6000, '11')).toBeCloseTo(660, 2);
    expect(calcularInssProLabore(8475.55, '11')).toBeCloseTo(932.31, 2);
    expect(calcularInssProLabore(10000, '11')).toBeCloseTo(932.31, 2); // limitado ao teto
  });

  it('aplica 20% no regime sem cota patronal e respeita o teto (máx. R$ 1.695,11)', () => {
    expect(calcularInssProLabore(5000, '20')).toBeCloseTo(1000, 2);
    expect(calcularInssProLabore(10000, '20')).toBeCloseTo(1695.11, 2); // limitado ao teto
  });
});

describe('calculadora-pro-labore — cálculo completo', () => {
  it('típico: pró-labore R$ 6.000, 11%, sem dependentes', () => {
    const r = calculate({ valorProLabore: 6000 });
    expect(r.aliquotaInss).toBe(0.11);
    expect(r.inss).toBeCloseTo(660, 2);
    expect(r.baseIRRF).toBeCloseTo(5340, 2);
    expect(r.impostoTabela).toBeCloseTo(559.77, 2);
    expect(r.redutor).toBeCloseTo(179.75, 2);
    expect(r.irrf).toBeCloseTo(380.02, 2);
    expect(r.proLaboreLiquido).toBeCloseTo(4959.98, 2);
    expect(r.aliquotaNominal).toBeCloseTo(0.275, 4);
  });

  it('acima do teto do INSS: pró-labore R$ 10.000, 11% -> INSS travado em R$ 932,31, sem redutor', () => {
    const r = calculate({ valorProLabore: 10000 });
    expect(r.inss).toBeCloseTo(932.31, 2); // teto do INSS, não 11% × 10.000
    expect(r.baseIRRF).toBeCloseTo(9067.69, 2);
    expect(r.impostoTabela).toBeCloseTo(1584.88, 2);
    expect(r.redutor).toBe(0); // acima de R$ 7.350
    expect(r.irrf).toBeCloseTo(1584.88, 2);
    expect(r.proLaboreLiquido).toBeCloseTo(7482.81, 2);
  });

  it('isento de IRRF: pró-labore R$ 4.000 (abaixo de R$ 5.000) -> só desconta INSS', () => {
    const r = calculate({ valorProLabore: 4000 });
    expect(r.inss).toBeCloseTo(440, 2);
    expect(r.impostoTabela).toBeCloseTo(139.84, 2); // a tabela apontaria imposto...
    expect(r.irrf).toBe(0); // ...mas a isenção de 2026 zera o IRRF
    expect(r.proLaboreLiquido).toBeCloseTo(3560, 2);
    expect(r.aliquotaNominal).toBeCloseTo(0.15, 4);
  });

  it('valor exato: pró-labore R$ 8.000 com 1 dependente, 11% -> IRRF R$ 997,13 (sem redutor)', () => {
    const r = calculate({ valorProLabore: 8000, dependentes: 1 });
    expect(r.inss).toBeCloseTo(880, 2);
    expect(r.baseIRRF).toBeCloseTo(6930.41, 2); // 8000 − 880 − 189,59
    expect(r.impostoTabela).toBeCloseTo(997.13, 2);
    expect(r.redutor).toBe(0); // acima de R$ 7.350
    expect(r.irrf).toBeCloseTo(997.13, 2);
    expect(r.proLaboreLiquido).toBeCloseTo(6122.87, 2);
  });

  it('regime 20%: pró-labore R$ 5.000 sem cota patronal -> INSS R$ 1.000, IRRF isento', () => {
    const r = calculate({ valorProLabore: 5000, regimeInss: '20' });
    expect(r.aliquotaInss).toBe(0.2);
    expect(r.inss).toBeCloseTo(1000, 2);
    expect(r.baseIRRF).toBeCloseTo(4000, 2);
    expect(r.irrf).toBe(0); // bruto <= 5.000 -> isento
    expect(r.proLaboreLiquido).toBeCloseTo(4000, 2);
  });

  it('inválido: pró-labore 0, negativo ou NaN retornam tudo zero', () => {
    for (const valor of [0, -100, Number.NaN]) {
      const r = calculate({ valorProLabore: valor });
      expect(r.valorProLabore).toBe(0);
      expect(r.inss).toBe(0);
      expect(r.baseIRRF).toBe(0);
      expect(r.impostoTabela).toBe(0);
      expect(r.redutor).toBe(0);
      expect(r.irrf).toBe(0);
      expect(r.proLaboreLiquido).toBe(0);
      expect(r.aliquotaNominal).toBe(0);
      expect(r.aliquotaEfetiva).toBe(0);
    }
  });

  it('dependentes inválidos (negativos/NaN) são tratados como zero', () => {
    const base = calculate({ valorProLabore: 8000 });
    const negs = calculate({ valorProLabore: 8000, dependentes: -3 });
    const nans = calculate({ valorProLabore: 8000, dependentes: Number.NaN });
    expect(negs.irrf).toBeCloseTo(base.irrf, 2);
    expect(nans.irrf).toBeCloseTo(base.irrf, 2);
  });
});
