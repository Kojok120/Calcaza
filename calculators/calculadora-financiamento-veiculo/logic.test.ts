import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-financiamento-veiculo', () => {
  it('Price: caso típico (R$ 80.000, entrada 20%, 48 meses, 1,5% a.m.)', () => {
    const r = calculate({
      valorVeiculo: 80000,
      entradaPercent: 20,
      prazoMeses: 48,
      taxaJurosMensal: 1.5,
    });
    expect(r.entrada).toBe(16000);
    expect(r.valorFinanciado).toBe(64000);
    expect(r.parcela).toBe(1880);
    expect(r.totalJuros).toBe(26240);
    expect(r.totalPago).toBe(106240);
    expect(r.n).toBe(48);
  });

  it('juros zero: parcela = financiado / n e sem juros (R$ 60.000, 30%, 36 meses, 0%)', () => {
    const r = calculate({
      valorVeiculo: 60000,
      entradaPercent: 30,
      prazoMeses: 36,
      taxaJurosMensal: 0,
    });
    expect(r.entrada).toBe(18000);
    expect(r.valorFinanciado).toBe(42000);
    expect(r.parcela).toBe(1166.67);
    expect(r.totalJuros).toBe(0);
    expect(r.totalPago).toBe(60000);
  });

  it('sem entrada e prazo longo (R$ 50.000, 0% de entrada, 60 meses, 1,99% a.m.)', () => {
    const r = calculate({
      valorVeiculo: 50000,
      entradaPercent: 0,
      prazoMeses: 60,
      taxaJurosMensal: 1.99,
    });
    expect(r.entrada).toBe(0);
    expect(r.valorFinanciado).toBe(50000);
    expect(r.parcela).toBe(1434.92);
    expect(r.totalJuros).toBe(36095.07);
    expect(r.totalPago).toBe(86095.07);
  });

  it('entrada maior e prazo curto reduz juros (R$ 100.000, 40%, 24 meses, 1,2% a.m.)', () => {
    const r = calculate({
      valorVeiculo: 100000,
      entradaPercent: 40,
      prazoMeses: 24,
      taxaJurosMensal: 1.2,
    });
    expect(r.entrada).toBe(40000);
    expect(r.valorFinanciado).toBe(60000);
    expect(r.parcela).toBe(2892.12);
    expect(r.totalJuros).toBe(9410.97);
    expect(r.totalPago).toBe(109410.97);
  });

  it('entrada de 100% zera o financiamento (R$ 80.000, 100%, 48 meses, 1,5% a.m.)', () => {
    const r = calculate({
      valorVeiculo: 80000,
      entradaPercent: 100,
      prazoMeses: 48,
      taxaJurosMensal: 1.5,
    });
    expect(r.entrada).toBe(80000);
    expect(r.valorFinanciado).toBe(0);
    expect(r.parcela).toBe(0);
    expect(r.totalJuros).toBe(0);
    expect(r.totalPago).toBe(80000);
  });

  it('valores inválidos são tratados com segurança (negativos e NaN)', () => {
    const r = calculate({
      valorVeiculo: -5000,
      entradaPercent: -10,
      prazoMeses: Number.NaN,
      taxaJurosMensal: -3,
    });
    expect(r.valorFinanciado).toBe(0);
    expect(r.parcela).toBe(0);
    expect(r.totalJuros).toBe(0);
    expect(r.totalPago).toBe(0);
    // prazo inválido cai no mínimo de 12 meses.
    expect(r.n).toBe(12);
  });

  it('limites do prazo e da entrada são respeitados (clamp 12-60 e 0-100%)', () => {
    const curto = calculate({
      valorVeiculo: 80000,
      entradaPercent: 20,
      prazoMeses: 6, // abaixo do mínimo -> 12
      taxaJurosMensal: 1.5,
    });
    expect(curto.n).toBe(12);

    const longo = calculate({
      valorVeiculo: 80000,
      entradaPercent: 20,
      prazoMeses: 120, // acima do máximo -> 60
      taxaJurosMensal: 1.5,
    });
    expect(longo.n).toBe(60);

    const entradaAlta = calculate({
      valorVeiculo: 80000,
      entradaPercent: 150, // acima de 100 -> 100
      prazoMeses: 48,
      taxaJurosMensal: 1.5,
    });
    expect(entradaAlta.entrada).toBe(80000);
    expect(entradaAlta.valorFinanciado).toBe(0);
  });
});
