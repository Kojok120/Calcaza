import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-adicional-noturno calculate', () => {
  it('aplica a hora reduzida: 7h de relógio (22h–5h) viram 8h noturnas, adicional 20%', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      horasNoturnas: 7,
      percentualAdicional: 20,
      aplicarHoraReduzida: true,
    });
    expect(r.valorHora).toBe(10);
    expect(r.horasNoturnasEquivalentes).toBe(8);
    expect(r.valorHoraNoturna).toBe(12);
    expect(r.totalAdicionalNoturno).toBe(96);
    expect(r.apenasAdicional).toBe(16);
  });

  it('sem hora reduzida: 7h de relógio contam como 7h noturnas', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      horasNoturnas: 7,
      percentualAdicional: 20,
      aplicarHoraReduzida: false,
    });
    expect(r.valorHora).toBe(10);
    expect(r.horasNoturnasEquivalentes).toBe(7);
    expect(r.valorHoraNoturna).toBe(12);
    expect(r.totalAdicionalNoturno).toBe(84);
    expect(r.apenasAdicional).toBe(14);
  });

  it('adicional customizado de 40% com hora reduzida', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      horasNoturnas: 7,
      percentualAdicional: 40,
      aplicarHoraReduzida: true,
    });
    expect(r.valorHora).toBe(10);
    expect(r.horasNoturnasEquivalentes).toBe(8);
    expect(r.valorHoraNoturna).toBe(14);
    expect(r.totalAdicionalNoturno).toBe(112);
    expect(r.apenasAdicional).toBe(32);
  });

  it('jornada de 200h: valor-hora muda, mesma equivalência da hora reduzida', () => {
    const r = calculate({
      salarioBruto: 2000,
      jornadaMensal: 200,
      horasNoturnas: 7,
      percentualAdicional: 20,
      aplicarHoraReduzida: true,
    });
    expect(r.valorHora).toBe(10);
    expect(r.horasNoturnasEquivalentes).toBe(8);
    expect(r.valorHoraNoturna).toBe(12);
    expect(r.totalAdicionalNoturno).toBe(96);
    expect(r.apenasAdicional).toBe(16);
  });

  it('horas e salário diferentes: 5h de relógio com salário 3.300', () => {
    const r = calculate({
      salarioBruto: 3300,
      jornadaMensal: 220,
      horasNoturnas: 5,
      percentualAdicional: 20,
      aplicarHoraReduzida: true,
    });
    expect(r.valorHora).toBe(15);
    expect(r.horasNoturnasEquivalentes).toBe(5.71);
    expect(r.valorHoraNoturna).toBe(18);
    expect(r.totalAdicionalNoturno).toBe(102.86);
    expect(r.apenasAdicional).toBe(17.14);
  });

  it('usa os padrões (jornada 220, adicional 20, hora reduzida) quando omitidos', () => {
    const r = calculate({ salarioBruto: 2200, horasNoturnas: 7 });
    expect(r.valorHora).toBe(10);
    expect(r.horasNoturnasEquivalentes).toBe(8);
    expect(r.valorHoraNoturna).toBe(12);
    expect(r.totalAdicionalNoturno).toBe(96);
    expect(r.apenasAdicional).toBe(16);
  });

  it('jornada <= 0 retorna zeros (evita divisão por zero)', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 0,
      horasNoturnas: 7,
    });
    expect(r).toEqual({
      valorHora: 0,
      valorHoraNoturna: 0,
      horasNoturnasEquivalentes: 0,
      totalAdicionalNoturno: 0,
      apenasAdicional: 0,
    });
  });

  it('valores inválidos (NaN/negativos) são saneados para zero', () => {
    const r = calculate({
      salarioBruto: Number.NaN,
      jornadaMensal: 220,
      horasNoturnas: -5,
      percentualAdicional: Number.NaN,
    });
    expect(r).toEqual({
      valorHora: 0,
      valorHoraNoturna: 0,
      horasNoturnasEquivalentes: 0,
      totalAdicionalNoturno: 0,
      apenasAdicional: 0,
    });
  });
});
