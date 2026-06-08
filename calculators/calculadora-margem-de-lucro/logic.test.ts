import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora de margem de lucro', () => {
  it('markup de 100% dobra o custo (custo 50 -> preço 100, lucro 50, margem 50%)', () => {
    const r = calculate({ custo: 50, modo: 'markup', percentual: 100 });
    expect(r.precoVenda).toBe(100);
    expect(r.lucro).toBe(50);
    expect(r.margemSobreVenda).toBe(50);
    expect(r.markupSobreCusto).toBe(100);
    expect(r.despesaVariavelValor).toBe(0);
    expect(r.invalido).toBe(false);
  });

  it('margem de 50% sobre a venda (custo 50 -> preço 100)', () => {
    const r = calculate({ custo: 50, modo: 'margem', percentual: 50 });
    expect(r.precoVenda).toBe(100);
    expect(r.lucro).toBe(50);
    expect(r.margemSobreVenda).toBe(50);
    expect(r.markupSobreCusto).toBe(100);
    expect(r.invalido).toBe(false);
  });

  it('margem com despesas variáveis (custo 50, margem 20%, despesas 10% -> preço 71,43)', () => {
    const r = calculate({
      custo: 50,
      modo: 'margem',
      percentual: 20,
      despesasVariaveis: 10,
    });
    // preço = 50 / (1 − 0,30) = 71,4285... -> 71,43
    expect(r.precoVenda).toBe(71.43);
    expect(r.despesaVariavelValor).toBe(7.14);
    expect(r.lucro).toBe(14.29);
    expect(r.margemSobreVenda).toBe(20);
    expect(r.invalido).toBe(false);
  });

  it('markup x margem dão preços diferentes para o mesmo percentual (40%)', () => {
    const mk = calculate({ custo: 50, modo: 'markup', percentual: 40 });
    const mg = calculate({ custo: 50, modo: 'margem', percentual: 40 });
    // markup 40% -> 50 × 1,40 = 70 ; margem 40% -> 50 / 0,60 = 83,33
    expect(mk.precoVenda).toBe(70);
    expect(mg.precoVenda).toBe(83.33);
    expect(mk.precoVenda).not.toBe(mg.precoVenda);
  });

  it('edge: zeros (custo 0, percentual 0) não quebram o cálculo', () => {
    const r = calculate({ custo: 0, modo: 'markup', percentual: 0 });
    expect(r.precoVenda).toBe(0);
    expect(r.lucro).toBe(0);
    expect(r.margemSobreVenda).toBe(0);
    expect(r.markupSobreCusto).toBe(0);
    expect(r.invalido).toBe(false);
  });

  it('modo margem com soma de percentuais ≥ 100 é sinalizado como inválido', () => {
    const r = calculate({
      custo: 50,
      modo: 'margem',
      percentual: 80,
      despesasVariaveis: 30, // soma = 110%
    });
    expect(r.invalido).toBe(true);
    expect(r.precoVenda).toBe(0);
  });

  it('saneia entradas negativas e NaN (custo negativo/NaN -> 0)', () => {
    const r = calculate({
      custo: Number.NaN,
      modo: 'markup',
      percentual: -50,
      despesasVariaveis: -10,
    });
    expect(r.precoVenda).toBe(0);
    expect(r.lucro).toBe(0);
    expect(r.invalido).toBe(false);
  });
});
