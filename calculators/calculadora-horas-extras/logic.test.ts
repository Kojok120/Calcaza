import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-horas-extras — adicional de 50% (mínimo legal)', () => {
  it('Salário R$ 2.200, jornada 220h, 10h a 50%: hora R$ 10; extra R$ 15; total R$ 150', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      quantidadeHoras: 10,
      percentualAdicional: 50,
    });
    expect(r.valorHoraNormal).toBeCloseTo(10, 2);
    expect(r.valorHoraExtra).toBeCloseTo(15, 2);
    expect(r.totalHorasExtras).toBeCloseTo(150, 2);
    expect(r.reflexoDSR).toBe(0);
    expect(r.totalReceber).toBeCloseTo(150, 2);
  });
});

describe('calculadora-horas-extras — adicional de 100% (domingo/feriado)', () => {
  it('Salário R$ 2.200, jornada 220h, 8h a 100%: extra R$ 20; total R$ 160', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      quantidadeHoras: 8,
      percentualAdicional: 100,
    });
    expect(r.valorHoraNormal).toBeCloseTo(10, 2);
    expect(r.valorHoraExtra).toBeCloseTo(20, 2);
    expect(r.totalHorasExtras).toBeCloseTo(160, 2);
    expect(r.totalReceber).toBeCloseTo(160, 2);
  });
});

describe('calculadora-horas-extras — reflexo no DSR', () => {
  it('Com DSR (25 úteis, 5 descanso): total extras R$ 150 + reflexo R$ 30 = R$ 180', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      quantidadeHoras: 10,
      percentualAdicional: 50,
      incluirDSR: true,
      diasUteis: 25,
      diasDescanso: 5,
    });
    expect(r.totalHorasExtras).toBeCloseTo(150, 2);
    expect(r.reflexoDSR).toBeCloseTo(30, 2); // 150 × (5/25)
    expect(r.totalReceber).toBeCloseTo(180, 2);
  });

  it('Sem incluir DSR, o reflexo é zero mesmo com dias informados', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      quantidadeHoras: 10,
      percentualAdicional: 50,
      incluirDSR: false,
      diasUteis: 25,
      diasDescanso: 5,
    });
    expect(r.reflexoDSR).toBe(0);
    expect(r.totalReceber).toBeCloseTo(150, 2);
  });
});

describe('calculadora-horas-extras — divisor de jornada (220 vs 200)', () => {
  it('Jornada 220h: valor-hora R$ 10; extra a 50% R$ 15; total R$ 150', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      quantidadeHoras: 10,
      percentualAdicional: 50,
    });
    expect(r.valorHoraNormal).toBeCloseTo(10, 2);
    expect(r.totalHorasExtras).toBeCloseTo(150, 2);
  });

  it('Jornada 200h: valor-hora R$ 11; extra a 50% R$ 16,50; total R$ 165', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 200,
      quantidadeHoras: 10,
      percentualAdicional: 50,
    });
    expect(r.valorHoraNormal).toBeCloseTo(11, 2);
    expect(r.valorHoraExtra).toBeCloseTo(16.5, 2);
    expect(r.totalHorasExtras).toBeCloseTo(165, 2);
  });
});

describe('calculadora-horas-extras — valores padrão', () => {
  it('Sem jornada e sem percentual, usa 220h e 50%', () => {
    const r = calculate({ salarioBruto: 2200, quantidadeHoras: 10 });
    expect(r.valorHoraNormal).toBeCloseTo(10, 2);
    expect(r.valorHoraExtra).toBeCloseTo(15, 2);
    expect(r.totalHorasExtras).toBeCloseTo(150, 2);
  });
});

describe('calculadora-horas-extras — casos de borda e inválidos', () => {
  it('0 horas extras: tudo zero, exceto o valor-hora calculado', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      quantidadeHoras: 0,
      percentualAdicional: 50,
    });
    expect(r.valorHoraNormal).toBeCloseTo(10, 2);
    expect(r.totalHorasExtras).toBe(0);
    expect(r.totalReceber).toBe(0);
  });

  it('Jornada 0 (evita divisão por zero): retorna tudo zero', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 0,
      quantidadeHoras: 10,
    });
    expect(r.valorHoraNormal).toBe(0);
    expect(r.totalHorasExtras).toBe(0);
    expect(r.totalReceber).toBe(0);
  });

  it('Salário inválido (negativo, NaN) ou zero retorna tudo zero', () => {
    for (const bruto of [0, -500, Number.NaN]) {
      const r = calculate({ salarioBruto: bruto, quantidadeHoras: 10 });
      expect(r.valorHoraNormal).toBe(0);
      expect(r.totalHorasExtras).toBe(0);
      expect(r.totalReceber).toBe(0);
    }
  });

  it('Valores negativos em horas/percentual são tratados como zero', () => {
    const r = calculate({
      salarioBruto: 2200,
      jornadaMensal: 220,
      quantidadeHoras: -10,
      percentualAdicional: -50,
    });
    // horas negativas -> 0 horas extras
    expect(r.totalHorasExtras).toBe(0);
    // percentual negativo -> 0% de adicional, hora extra = hora normal
    expect(r.valorHoraExtra).toBeCloseTo(10, 2);
  });
});
