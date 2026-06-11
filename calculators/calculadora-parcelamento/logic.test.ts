import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-parcelamento calculate', () => {
  it('parcelado com juros embutido: à vista R$ 1.000 vs 10× R$ 115', () => {
    const r = calculate({
      valorAVista: 1000,
      valorParcela: 115,
      numeroParcelas: 10,
    });
    expect(r.totalParcelado).toBe(1150);
    expect(r.jurosEmbutidoReais).toBe(150);
    expect(r.semJuros).toBe(false);
    // i ≈ 2,6253% a.m.
    expect(r.taxaMensalImplicita).toBeCloseTo(2.6253, 3);
    // (1 + i)^12 − 1 ≈ 36,48% a.a.
    expect(r.taxaAnualEquivalente).toBeCloseTo(36.48, 1);
  });

  it('parcelado sem juros: à vista R$ 1.000 vs 10× R$ 100 (total = à vista)', () => {
    const r = calculate({
      valorAVista: 1000,
      valorParcela: 100,
      numeroParcelas: 10,
    });
    expect(r.totalParcelado).toBe(1000);
    expect(r.jurosEmbutidoReais).toBe(0);
    expect(r.taxaMensalImplicita).toBe(0);
    expect(r.taxaAnualEquivalente).toBe(0);
    expect(r.semJuros).toBe(true);
  });

  it('à vista mais caro que o parcelado: 10× R$ 90 (total R$ 900) é melhor que à vista R$ 1.000', () => {
    const r = calculate({
      valorAVista: 1000,
      valorParcela: 90,
      numeroParcelas: 10,
    });
    expect(r.totalParcelado).toBe(900);
    // total parcelado < à vista -> sem juros embutidos, taxa fixada em 0.
    expect(r.jurosEmbutidoReais).toBe(0);
    expect(r.taxaMensalImplicita).toBe(0);
    expect(r.semJuros).toBe(true);
  });

  it('taxa exata via tolerância: à vista R$ 1.000 vs 12× R$ 88,85 ≈ 1% a.m.', () => {
    // PV = 1000, i = 1% a.m., n = 12 -> parcela teórica ≈ 88,8489; arredondada a 88,85.
    const r = calculate({
      valorAVista: 1000,
      valorParcela: 88.85,
      numeroParcelas: 12,
    });
    expect(r.totalParcelado).toBe(1066.2);
    expect(r.jurosEmbutidoReais).toBe(66.2);
    expect(r.semJuros).toBe(false);
    // Recupera ~1,00% a.m. dentro de uma tolerância pequena.
    expect(r.taxaMensalImplicita).toBeCloseTo(1.0, 1);
    // (1,01)^12 − 1 ≈ 12,68% a.a.
    expect(r.taxaAnualEquivalente).toBeCloseTo(12.68, 0);
  });

  it('parcela única (n = 1): forma fechada à vista R$ 1.000 vs 1× R$ 1.100 = 10% a.m.', () => {
    const r = calculate({
      valorAVista: 1000,
      valorParcela: 1100,
      numeroParcelas: 1,
    });
    expect(r.totalParcelado).toBe(1100);
    expect(r.jurosEmbutidoReais).toBe(100);
    expect(r.taxaMensalImplicita).toBeCloseTo(10, 4);
    expect(r.semJuros).toBe(false);
  });

  it('número de parcelas é clampado para o intervalo [1, 48]', () => {
    const r = calculate({
      valorAVista: 1000,
      valorParcela: 50,
      numeroParcelas: 96, // acima do teto -> vira 48
    });
    expect(r.totalParcelado).toBe(2400); // 48 × 50
    expect(r.semJuros).toBe(false);
  });

  it('entradas inválidas (NaN/negativos) são tratadas com retorno neutro', () => {
    const r = calculate({
      valorAVista: Number.NaN,
      valorParcela: -100,
      numeroParcelas: 10,
    });
    expect(r.jurosEmbutidoReais).toBe(0);
    expect(r.taxaMensalImplicita).toBe(0);
    expect(r.taxaAnualEquivalente).toBe(0);
    expect(r.semJuros).toBe(true);
  });
});
