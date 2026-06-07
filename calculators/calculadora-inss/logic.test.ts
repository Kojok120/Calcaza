import { describe, it, expect } from 'vitest';
import { calculate, calcularInssEmpregado } from './logic';

describe('calculadora-inss — empregado CLT (tabela progressiva 2026)', () => {
  it('faixa de 7,5%/9%: R$ 1.500 -> R$ 112,50', () => {
    const r = calculate({ remuneracao: 1500, categoria: 'empregado_clt' });
    expect(r.contribuicao).toBeCloseTo(112.5, 2);
    expect(r.base).toBeCloseTo(1500, 2);
    expect(r.tetoAplicado).toBe(false);
  });

  it('R$ 2.000 -> R$ 155,69 (progressivo, não 9% sobre o total)', () => {
    const r = calculate({ remuneracao: 2000, categoria: 'empregado_clt' });
    expect(r.contribuicao).toBeCloseTo(155.69, 2);
    // 9% sobre 2000 seria 180; o progressivo é menor.
    expect(r.contribuicao).toBeLessThan(180);
  });

  it('R$ 3.000 -> R$ 248,60', () => {
    const r = calculate({ remuneracao: 3000, categoria: 'empregado_clt' });
    expect(r.contribuicao).toBeCloseTo(248.6, 2);
  });

  it('respeita o teto: bruto no teto e acima descontam R$ 988,09', () => {
    const noTeto = calculate({ remuneracao: 8475.55, categoria: 'empregado_clt' });
    expect(noTeto.contribuicao).toBe(988.09);
    expect(noTeto.tetoAplicado).toBe(true);

    const acima = calculate({ remuneracao: 12000, categoria: 'empregado_clt' });
    expect(acima.contribuicao).toBe(988.09);
    expect(acima.base).toBeCloseTo(8475.55, 2);
    expect(acima.tetoAplicado).toBe(true);
  });

  it('alíquota efetiva < alíquota nominal acima da primeira faixa', () => {
    const r = calculate({ remuneracao: 3000, categoria: 'empregado_clt' });
    expect(r.aliquotaEfetiva).toBeLessThan(r.aliquotaNominal);
    expect(r.aliquotaNominal).toBeCloseTo(0.12, 5);
  });
});

describe('calculadora-inss — contribuinte individual / facultativo (plano normal 20%)', () => {
  it('contribuinte individual R$ 3.000 -> 20% = R$ 600,00', () => {
    const r = calculate({ remuneracao: 3000, categoria: 'contribuinte_individual' });
    expect(r.contribuicao).toBeCloseTo(600.0, 2);
    expect(r.aliquotaNominal).toBeCloseTo(0.2, 5);
    expect(r.base).toBeCloseTo(3000, 2);
  });

  it('abaixo do piso usa o salário mínimo (R$ 1.621): 20% = R$ 324,20', () => {
    const r = calculate({ remuneracao: 1000, categoria: 'contribuinte_individual' });
    expect(r.base).toBeCloseTo(1621.0, 2);
    expect(r.contribuicao).toBeCloseTo(324.2, 2);
  });

  it('facultativo acima do teto: base trava em R$ 8.475,55 -> R$ 1.695,11', () => {
    const r = calculate({ remuneracao: 15000, categoria: 'facultativo' });
    expect(r.base).toBeCloseTo(8475.55, 2);
    expect(r.contribuicao).toBeCloseTo(1695.11, 2);
    expect(r.tetoAplicado).toBe(true);
  });
});

describe('calculadora-inss — facultativo baixa renda e MEI (5% sobre o mínimo)', () => {
  it('facultativo de baixa renda -> R$ 81,05 (fixo)', () => {
    const r = calculate({ remuneracao: 0, categoria: 'facultativo_baixa_renda' });
    expect(r.contribuicao).toBeCloseTo(81.05, 2);
    expect(r.aliquotaNominal).toBeCloseTo(0.05, 5);
    expect(r.base).toBeCloseTo(1621.0, 2);
  });

  it('MEI -> R$ 81,05 (5% sobre o salário mínimo, independente da remuneração)', () => {
    const baixa = calculate({ remuneracao: 5000, categoria: 'mei' });
    const alta = calculate({ remuneracao: 50000, categoria: 'mei' });
    expect(baixa.contribuicao).toBeCloseTo(81.05, 2);
    expect(alta.contribuicao).toBeCloseTo(81.05, 2);
  });
});

describe('calculadora-inss — casos inválidos / borda', () => {
  it('empregado com remuneração 0, negativa ou NaN retorna tudo zero', () => {
    for (const rem of [0, -500, Number.NaN]) {
      const r = calculate({ remuneracao: rem, categoria: 'empregado_clt' });
      expect(r.contribuicao).toBe(0);
      expect(r.base).toBe(0);
      expect(r.aliquotaEfetiva).toBe(0);
    }
  });

  it('calcularInssEmpregado direto: zero e negativos retornam 0', () => {
    expect(calcularInssEmpregado(0)).toBe(0);
    expect(calcularInssEmpregado(-100)).toBe(0);
    expect(calcularInssEmpregado(Number.NaN)).toBe(0);
  });
});
