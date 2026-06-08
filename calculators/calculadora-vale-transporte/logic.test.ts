import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-vale-transporte calculate', () => {
  it('custo maior que 6%: desconta os 6% e a empresa paga a diferença', () => {
    // salário 2.000; custo R$ 10/dia × 22 dias = 220; 6% = 120; desconta 120; empresa 100.
    const r = calculate({
      salarioBruto: 2000,
      custoDiarioTransporte: 10,
      diasTrabalhados: 22,
    });
    expect(r.custoMensalTransporte).toBe(220);
    expect(r.descontoMaximo).toBe(120);
    expect(r.descontoEmpregado).toBe(120);
    expect(r.custoEmpregador).toBe(100);
  });

  it('custo menor que 6%: desconta apenas o custo real e a empresa paga 0', () => {
    // salário 5.000; custo R$ 5/dia × 22 = 110; 6% = 300; desconta 110; empresa 0.
    const r = calculate({
      salarioBruto: 5000,
      custoDiarioTransporte: 5,
      diasTrabalhados: 22,
    });
    expect(r.custoMensalTransporte).toBe(110);
    expect(r.descontoMaximo).toBe(300);
    expect(r.descontoEmpregado).toBe(110);
    expect(r.custoEmpregador).toBe(0);
  });

  it('custo exatamente igual a 6%: desconta tudo e a empresa paga 0', () => {
    // salário 2.000; 6% = 120; custo R$ 6/dia × 20 = 120; desconta 120; empresa 0.
    const r = calculate({
      salarioBruto: 2000,
      custoDiarioTransporte: 6,
      diasTrabalhados: 20,
    });
    expect(r.custoMensalTransporte).toBe(120);
    expect(r.descontoMaximo).toBe(120);
    expect(r.descontoEmpregado).toBe(120);
    expect(r.custoEmpregador).toBe(0);
  });

  it('dias diferentes mudam o custo mensal (22 vs 20 dias)', () => {
    // salário 3.000; 6% = 180.
    // 22 dias: custo R$ 8 × 22 = 176; desconta 176 (< teto); empresa 0.
    const r22 = calculate({
      salarioBruto: 3000,
      custoDiarioTransporte: 8,
      diasTrabalhados: 22,
    });
    expect(r22.custoMensalTransporte).toBe(176);
    expect(r22.descontoMaximo).toBe(180);
    expect(r22.descontoEmpregado).toBe(176);
    expect(r22.custoEmpregador).toBe(0);

    // 20 dias: custo R$ 8 × 20 = 160; desconta 160 (< teto); empresa 0.
    const r20 = calculate({
      salarioBruto: 3000,
      custoDiarioTransporte: 8,
      diasTrabalhados: 20,
    });
    expect(r20.custoMensalTransporte).toBe(160);
    expect(r20.descontoMaximo).toBe(180);
    expect(r20.descontoEmpregado).toBe(160);
    expect(r20.custoEmpregador).toBe(0);
  });

  it('salário alto: o teto de 6% fica muito acima do custo, desconta o custo real', () => {
    // salário 15.000; 6% = 900; custo R$ 12/dia × 22 = 264; desconta 264; empresa 0.
    const r = calculate({
      salarioBruto: 15000,
      custoDiarioTransporte: 12,
      diasTrabalhados: 22,
    });
    expect(r.custoMensalTransporte).toBe(264);
    expect(r.descontoMaximo).toBe(900);
    expect(r.descontoEmpregado).toBe(264);
    expect(r.custoEmpregador).toBe(0);
  });

  it('usa 22 dias como padrão quando diasTrabalhados não é informado', () => {
    // salário 2.000; custo R$ 10/dia × 22 (padrão) = 220; 6% = 120; desconta 120; empresa 100.
    const r = calculate({ salarioBruto: 2000, custoDiarioTransporte: 10 });
    expect(r.custoMensalTransporte).toBe(220);
    expect(r.descontoEmpregado).toBe(120);
    expect(r.custoEmpregador).toBe(100);
  });

  it('zeros: tudo zero quando não há salário nem custo', () => {
    const r = calculate({
      salarioBruto: 0,
      custoDiarioTransporte: 0,
      diasTrabalhados: 22,
    });
    expect(r.custoMensalTransporte).toBe(0);
    expect(r.descontoMaximo).toBe(0);
    expect(r.descontoEmpregado).toBe(0);
    expect(r.custoEmpregador).toBe(0);
  });

  it('valores inválidos (negativos / NaN) são tratados como 0', () => {
    const r = calculate({
      salarioBruto: Number.NaN,
      custoDiarioTransporte: -50,
      diasTrabalhados: -3,
    });
    expect(r.custoMensalTransporte).toBe(0);
    expect(r.descontoMaximo).toBe(0);
    expect(r.descontoEmpregado).toBe(0);
    expect(r.custoEmpregador).toBe(0);
  });

  it('arredonda para 2 casas decimais (centavos)', () => {
    // salário 1.450; 6% = 87; custo R$ 7,35/dia × 21 = 154,35; desconta 87; empresa 67,35.
    const r = calculate({
      salarioBruto: 1450,
      custoDiarioTransporte: 7.35,
      diasTrabalhados: 21,
    });
    expect(r.custoMensalTransporte).toBe(154.35);
    expect(r.descontoMaximo).toBe(87);
    expect(r.descontoEmpregado).toBe(87);
    expect(r.custoEmpregador).toBe(67.35);
  });
});
