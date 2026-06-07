import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-aviso-previo — regra dos dias (Lei 12.506/2011)', () => {
  it('0 anos completos, empregador demite: 30 dias (base, sem acréscimo)', () => {
    const r = calculate({
      salarioBruto: 3000,
      anosCompletos: 0,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    expect(r.diasAviso).toBe(30);
    expect(r.acrescimoDias).toBe(0);
  });

  it('1 ano completo, empregador demite: 33 dias (30 + 3)', () => {
    const r = calculate({
      salarioBruto: 3000,
      anosCompletos: 1,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    expect(r.diasAviso).toBe(33);
    expect(r.acrescimoDias).toBe(3);
  });

  it('10 anos completos, empregador demite: 60 dias (30 + 30)', () => {
    const r = calculate({
      salarioBruto: 3000,
      anosCompletos: 10,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    expect(r.diasAviso).toBe(60);
    expect(r.acrescimoDias).toBe(30);
  });

  it('20 anos completos, empregador demite: 90 dias (teto)', () => {
    const r = calculate({
      salarioBruto: 3000,
      anosCompletos: 20,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    expect(r.diasAviso).toBe(90);
    expect(r.acrescimoDias).toBe(60);
  });

  it('25 anos completos, empregador demite: trava em 90 dias (clamp do teto)', () => {
    const r = calculate({
      salarioBruto: 3000,
      anosCompletos: 25,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    expect(r.diasAviso).toBe(90);
  });

  it('empregado pede demissão: 30 dias fixos, mesmo com muitos anos', () => {
    const r = calculate({
      salarioBruto: 3000,
      anosCompletos: 12,
      quemAvisa: 'empregado',
      tipo: 'trabalhado',
    });
    expect(r.diasAviso).toBe(30);
    expect(r.acrescimoDias).toBe(0);
  });
});

describe('calculadora-aviso-previo — valor do aviso', () => {
  it('salário R$ 3.000, 5 anos, empregador: 45 dias, valor R$ 4.500', () => {
    const r = calculate({
      salarioBruto: 3000,
      anosCompletos: 5,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    expect(r.diasAviso).toBe(45);
    expect(r.acrescimoDias).toBe(15);
    expect(r.salarioDia).toBeCloseTo(100, 2);
    expect(r.valorAviso).toBeCloseTo(4500, 2);
  });

  it('salário R$ 2.400, 0 anos, empregador: 30 dias, valor = 1 salário (R$ 2.400)', () => {
    const r = calculate({
      salarioBruto: 2400,
      anosCompletos: 0,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    expect(r.diasAviso).toBe(30);
    expect(r.salarioDia).toBeCloseTo(80, 2);
    expect(r.valorAviso).toBeCloseTo(2400, 2);
  });

  it('aviso trabalhado usa a mesma fórmula de valor (salário do período)', () => {
    const indenizado = calculate({
      salarioBruto: 3000,
      anosCompletos: 5,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    const trabalhado = calculate({
      salarioBruto: 3000,
      anosCompletos: 5,
      quemAvisa: 'empregador',
      tipo: 'trabalhado',
    });
    expect(trabalhado.valorAviso).toBeCloseTo(indenizado.valorAviso, 2);
    expect(trabalhado.diasAviso).toBe(indenizado.diasAviso);
  });
});

describe('calculadora-aviso-previo — entradas inválidas', () => {
  it('anos negativos são tratados como 0', () => {
    const r = calculate({
      salarioBruto: 3000,
      anosCompletos: -5,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    expect(r.diasAviso).toBe(30);
  });

  it('anos não inteiros são truncados para baixo', () => {
    const r = calculate({
      salarioBruto: 3000,
      anosCompletos: 2.9,
      quemAvisa: 'empregador',
      tipo: 'indenizado',
    });
    expect(r.diasAviso).toBe(36); // 30 + 3 × 2
  });

  it('salário negativo, zero ou NaN zera o valor (dias permanecem válidos)', () => {
    for (const bruto of [0, -100, Number.NaN]) {
      const r = calculate({
        salarioBruto: bruto,
        anosCompletos: 5,
        quemAvisa: 'empregador',
        tipo: 'indenizado',
      });
      expect(r.salarioDia).toBe(0);
      expect(r.valorAviso).toBe(0);
      expect(r.diasAviso).toBe(45);
    }
  });
});
