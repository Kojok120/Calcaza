import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-financiamento-imovel', () => {
  it('Price: parcela fixa (financiado 200.000, 10% a.a., 360 meses)', () => {
    const r = calculate({
      valorImovel: 200000,
      entrada: 0,
      taxaJurosAnual: 10,
      prazoMeses: 360,
      sistema: 'PRICE',
    });
    expect(r.valorFinanciado).toBe(200000);
    // Parcela constante: inicial = final.
    expect(r.parcelaInicial).toBe(1691.78);
    expect(r.parcelaFinal).toBe(1691.78);
    expect(r.parcelaInicial).toBe(r.parcelaFinal);
    expect(r.totalPago).toBe(609041.39);
    expect(r.totalJuros).toBe(409041.39);
    expect(r.sistema).toBe('PRICE');
  });

  it('SAC: parcela decrescente (financiado 200.000, 10% a.a., 360 meses)', () => {
    const r = calculate({
      valorImovel: 200000,
      entrada: 0,
      taxaJurosAnual: 10,
      prazoMeses: 360,
      sistema: 'SAC',
    });
    expect(r.valorFinanciado).toBe(200000);
    expect(r.parcelaInicial).toBe(2150.38);
    expect(r.parcelaFinal).toBe(559.99);
    // A primeira parcela é maior que a última.
    expect(r.parcelaInicial).toBeGreaterThan(r.parcelaFinal);
    expect(r.totalPago).toBe(487866.47);
    expect(r.totalJuros).toBe(287866.47);
    expect(r.sistema).toBe('SAC');
  });

  it('SAC paga menos juros que Price para os mesmos parâmetros', () => {
    const params = {
      valorImovel: 200000,
      entrada: 0,
      taxaJurosAnual: 10,
      prazoMeses: 360,
    } as const;
    const sac = calculate({ ...params, sistema: 'SAC' });
    const price = calculate({ ...params, sistema: 'PRICE' });
    expect(sac.totalJuros).toBeLessThan(price.totalJuros);
    expect(sac.totalPago).toBeLessThan(price.totalPago);
  });

  it('a entrada reduz o valor financiado (300.000 com 60.000 de entrada)', () => {
    const r = calculate({
      valorImovel: 300000,
      entrada: 60000,
      taxaJurosAnual: 9,
      prazoMeses: 240,
      sistema: 'SAC',
    });
    expect(r.valorFinanciado).toBe(240000);
    expect(r.parcelaInicial).toBe(2729.76);
    expect(r.parcelaFinal).toBe(1007.21);
    expect(r.parcelaInicial).toBeGreaterThan(r.parcelaFinal);
  });

  it('taxa zero: Price divide o principal em parcelas iguais e sem juros', () => {
    const r = calculate({
      valorImovel: 120000,
      entrada: 0,
      taxaJurosAnual: 0,
      prazoMeses: 120,
      sistema: 'PRICE',
    });
    expect(r.valorFinanciado).toBe(120000);
    expect(r.parcelaInicial).toBe(1000);
    expect(r.parcelaFinal).toBe(1000);
    expect(r.totalPago).toBe(120000);
    expect(r.totalJuros).toBe(0);
  });

  it('taxa zero: SAC também resulta em parcelas iguais e sem juros', () => {
    const r = calculate({
      valorImovel: 120000,
      entrada: 0,
      taxaJurosAnual: 0,
      prazoMeses: 120,
      sistema: 'SAC',
    });
    expect(r.parcelaInicial).toBe(1000);
    expect(r.parcelaFinal).toBe(1000);
    expect(r.totalJuros).toBe(0);
  });

  it('entrada maior que o imóvel zera o financiamento', () => {
    const r = calculate({
      valorImovel: 100000,
      entrada: 150000,
      taxaJurosAnual: 8,
      prazoMeses: 240,
      sistema: 'SAC',
    });
    expect(r.valorFinanciado).toBe(0);
    expect(r.parcelaInicial).toBe(0);
    expect(r.parcelaFinal).toBe(0);
    expect(r.totalPago).toBe(0);
    expect(r.totalJuros).toBe(0);
  });

  it('prazo zero ou inválido retorna tudo zero', () => {
    const r = calculate({
      valorImovel: 100000,
      entrada: 0,
      taxaJurosAnual: 8,
      prazoMeses: 0,
      sistema: 'PRICE',
    });
    expect(r.parcelaInicial).toBe(0);
    expect(r.totalPago).toBe(0);
    expect(r.totalJuros).toBe(0);
  });

  it('valores negativos são tratados como zero', () => {
    const r = calculate({
      valorImovel: -5000,
      entrada: -100,
      taxaJurosAnual: -3,
      prazoMeses: 120,
      sistema: 'SAC',
    });
    expect(r.valorFinanciado).toBe(0);
    expect(r.totalPago).toBe(0);
    expect(r.totalJuros).toBe(0);
  });

  it('usa SAC por padrão quando o sistema não é informado', () => {
    const r = calculate({
      valorImovel: 200000,
      taxaJurosAnual: 10,
      prazoMeses: 360,
    });
    expect(r.sistema).toBe('SAC');
    expect(r.parcelaInicial).toBeGreaterThan(r.parcelaFinal);
  });
});
