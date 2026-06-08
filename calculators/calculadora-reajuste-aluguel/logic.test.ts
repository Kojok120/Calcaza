import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-reajuste-aluguel calculate', () => {
  it('reajuste positivo: aluguel 1.500 com IGP-M de 4% → 1.560 (aumento 60)', () => {
    const r = calculate({ aluguelAtual: 1500, indiceAcumulado: 4, indice: 'IGP-M' });
    expect(r.novoAluguel).toBe(1560);
    expect(r.valorAumento).toBe(60);
    expect(r.indiceAcumulado).toBe(4);
    expect(r.indice).toBe('IGP-M');
  });

  it('índice alto: aluguel 2.000 com 10% → 2.200 (aumento 200)', () => {
    const r = calculate({ aluguelAtual: 2000, indiceAcumulado: 10, indice: 'IPCA' });
    expect(r.novoAluguel).toBe(2200);
    expect(r.valorAumento).toBe(200);
    expect(r.indice).toBe('IPCA');
  });

  it('índice zero: sem reajuste, novo aluguel igual ao atual e aumento 0', () => {
    const r = calculate({ aluguelAtual: 1800, indiceAcumulado: 0 });
    expect(r.novoAluguel).toBe(1800);
    expect(r.valorAumento).toBe(0);
    // sem índice informado, o rótulo padrão é IGP-M
    expect(r.indice).toBe('IGP-M');
  });

  it('índice negativo (deflação): aluguel 1.500 com −2,5% → 1.462,50 (redução 37,50)', () => {
    const r = calculate({ aluguelAtual: 1500, indiceAcumulado: -2.5, indice: 'IGP-M' });
    expect(r.novoAluguel).toBe(1462.5);
    expect(r.valorAumento).toBe(-37.5);
  });

  it('valores quebrados (centavos): aluguel 1.234,56 com 5,27% → 1.299,62 (aumento 65,06)', () => {
    const r = calculate({ aluguelAtual: 1234.56, indiceAcumulado: 5.27, indice: 'INPC' });
    expect(r.novoAluguel).toBe(1299.62);
    expect(r.valorAumento).toBe(65.06);
    expect(r.indice).toBe('INPC');
  });

  it('edge zeros: aluguel 0 com 4% → tudo zero', () => {
    const r = calculate({ aluguelAtual: 0, indiceAcumulado: 4 });
    expect(r.novoAluguel).toBe(0);
    expect(r.valorAumento).toBe(0);
  });

  it('aluguel negativo é saneado para 0 (resultado zero)', () => {
    const r = calculate({ aluguelAtual: -100, indiceAcumulado: 4 });
    expect(r.novoAluguel).toBe(0);
    expect(r.valorAumento).toBe(0);
  });

  it('índice NaN vira 0 (sem reajuste) e rótulo inválido cai para IGP-M', () => {
    const r = calculate({
      aluguelAtual: 1500,
      indiceAcumulado: Number.NaN,
      // @ts-expect-error rótulo inválido deve cair no padrão
      indice: 'qualquer',
    });
    expect(r.novoAluguel).toBe(1500);
    expect(r.valorAumento).toBe(0);
    expect(r.indiceAcumulado).toBe(0);
    expect(r.indice).toBe('IGP-M');
  });
});
