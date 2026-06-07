import { describe, it, expect } from 'vitest';
import {
  calculate,
  calcularValorParcela,
  calcularNumeroParcelas,
} from './logic';

describe('calculadora-seguro-desemprego — valor da parcela', () => {
  it('faixa 1 (média baixa): R$ 2.000 × 0,8 = 1.600 -> piso de R$ 1.621,00', () => {
    // 2.000 × 0,8 = 1.600, abaixo do piso, logo aplica-se R$ 1.621,00.
    expect(calcularValorParcela(2000)).toBe(1621.0);
  });

  it('faixa 2: média R$ 3.000 -> (3000 − 2222,17) × 0,5 + 1777,74 = 2.166,65', () => {
    expect(calcularValorParcela(3000)).toBeCloseTo(2166.65, 2);
  });

  it('faixa 3 (acima de R$ 3.703,99): aplica o teto de R$ 2.518,65', () => {
    expect(calcularValorParcela(5000)).toBe(2518.65);
    expect(calcularValorParcela(4000)).toBe(2518.65);
  });

  it('piso: qualquer média que gere parcela abaixo de R$ 1.621,00 recebe o piso', () => {
    // 1.000 × 0,8 = 800 -> piso.
    expect(calcularValorParcela(1000)).toBe(1621.0);
    // Limite inferior da faixa 2 (2.222,18) também fica no piso (≈1.777,74 > piso, então NÃO).
    // Já 1.500 × 0,8 = 1.200 -> piso.
    expect(calcularValorParcela(1500)).toBe(1621.0);
  });

  it('média inválida (0, negativa ou NaN) retorna 0', () => {
    expect(calcularValorParcela(0)).toBe(0);
    expect(calcularValorParcela(-500)).toBe(0);
    expect(calcularValorParcela(Number.NaN)).toBe(0);
  });
});

describe('calculadora-seguro-desemprego — número de parcelas (CODEFAT)', () => {
  it('1ª solicitação: 12 meses -> 4 parcelas', () => {
    expect(calcularNumeroParcelas(12, 1)).toBe(4);
  });

  it('1ª solicitação: 24 meses -> 5 parcelas', () => {
    expect(calcularNumeroParcelas(24, 1)).toBe(5);
  });

  it('1ª solicitação: 11 meses -> 0 (não elegível)', () => {
    expect(calcularNumeroParcelas(11, 1)).toBe(0);
  });

  it('2ª solicitação: 9 meses -> 3 parcelas', () => {
    expect(calcularNumeroParcelas(9, 2)).toBe(3);
  });

  it('3ª (ou mais) solicitação: 6 meses -> 3 parcelas', () => {
    expect(calcularNumeroParcelas(6, 3)).toBe(3);
  });
});

describe('calculadora-seguro-desemprego — cálculo completo', () => {
  it('1ª solicitação, média R$ 3.000, 12 meses: parcela 2.166,65 × 4 = 8.666,60', () => {
    const r = calculate({
      mediaSalarial: 3000,
      mesesTrabalhados: 12,
      numeroSolicitacao: 1,
    });
    expect(r.valorParcela).toBeCloseTo(2166.65, 2);
    expect(r.numeroParcelas).toBe(4);
    expect(r.valorTotal).toBeCloseTo(8666.6, 2);
    expect(r.elegivel).toBe(true);
  });

  it('1ª solicitação, média baixa R$ 2.000, 24 meses: piso 1.621,00 × 5 = 8.105,00', () => {
    const r = calculate({
      mediaSalarial: 2000,
      mesesTrabalhados: 24,
      numeroSolicitacao: 1,
    });
    expect(r.valorParcela).toBe(1621.0);
    expect(r.numeroParcelas).toBe(5);
    expect(r.valorTotal).toBeCloseTo(8105.0, 2);
    expect(r.elegivel).toBe(true);
  });

  it('média alta (faixa 3, teto), 2ª solicitação, 12 meses: 2.518,65 × 4 = 10.074,60', () => {
    const r = calculate({
      mediaSalarial: 6000,
      mesesTrabalhados: 12,
      numeroSolicitacao: 2,
    });
    expect(r.valorParcela).toBe(2518.65);
    expect(r.numeroParcelas).toBe(4);
    expect(r.valorTotal).toBeCloseTo(10074.6, 2);
    expect(r.elegivel).toBe(true);
  });

  it('não elegível (1ª solicitação, 11 meses): 0 parcelas, total 0, elegível false', () => {
    const r = calculate({
      mediaSalarial: 3000,
      mesesTrabalhados: 11,
      numeroSolicitacao: 1,
    });
    expect(r.numeroParcelas).toBe(0);
    expect(r.valorTotal).toBe(0);
    expect(r.elegivel).toBe(false);
    // O valor da parcela ainda é apurado, mas sem direito não há pagamento.
    expect(r.valorParcela).toBeCloseTo(2166.65, 2);
  });

  it('saneamento: numeroSolicitacao fora de 1–3 é truncado ao intervalo (clamp)', () => {
    const baixo = calculate({
      mediaSalarial: 3000,
      mesesTrabalhados: 12,
      // @ts-expect-error testando entrada inválida
      numeroSolicitacao: 0,
    });
    // 0 -> clamp para 1 (1ª solicitação, 12 meses -> 4 parcelas).
    expect(baixo.numeroParcelas).toBe(4);

    const alto = calculate({
      mediaSalarial: 3000,
      mesesTrabalhados: 6,
      // @ts-expect-error testando entrada inválida
      numeroSolicitacao: 9,
    });
    // 9 -> clamp para 3 (3ª ou mais, 6 meses -> 3 parcelas).
    expect(alto.numeroParcelas).toBe(3);
  });

  it('entradas inválidas: meses negativos/NaN e média NaN não quebram o cálculo', () => {
    const r = calculate({
      mediaSalarial: Number.NaN,
      mesesTrabalhados: -5,
      numeroSolicitacao: 1,
    });
    expect(r.valorParcela).toBe(0);
    expect(r.numeroParcelas).toBe(0);
    expect(r.valorTotal).toBe(0);
    expect(r.elegivel).toBe(false);
  });
});
