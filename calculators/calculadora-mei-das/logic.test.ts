import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-mei-das — MEI comum (INSS 5% do salário mínimo)', () => {
  it('Comércio/Indústria: INSS 81,05 + ICMS 1,00 = DAS R$ 82,05', () => {
    const r = calculate({ tipoAtividade: 'comercio_industria' });
    expect(r.inssBase).toBe(81.05);
    expect(r.icms).toBe(1.0);
    expect(r.iss).toBe(0);
    expect(r.das).toBe(82.05);
  });

  it('Serviços: INSS 81,05 + ISS 5,00 = DAS R$ 86,05', () => {
    const r = calculate({ tipoAtividade: 'servicos' });
    expect(r.inssBase).toBe(81.05);
    expect(r.icms).toBe(0);
    expect(r.iss).toBe(5.0);
    expect(r.das).toBe(86.05);
  });

  it('Comércio e Serviços: INSS 81,05 + ICMS 1,00 + ISS 5,00 = DAS R$ 87,05', () => {
    const r = calculate({ tipoAtividade: 'comercio_e_servicos' });
    expect(r.inssBase).toBe(81.05);
    expect(r.icms).toBe(1.0);
    expect(r.iss).toBe(5.0);
    expect(r.das).toBe(87.05);
  });
});

describe('calculadora-mei-das — MEI caminhoneiro (INSS 12% do salário mínimo)', () => {
  it('Comércio/Indústria: INSS 194,52 + ICMS 1,00 = DAS R$ 195,52', () => {
    const r = calculate({
      tipoAtividade: 'comercio_industria',
      caminhoneiro: true,
    });
    expect(r.inssBase).toBe(194.52);
    expect(r.icms).toBe(1.0);
    expect(r.iss).toBe(0);
    expect(r.das).toBe(195.52);
  });

  it('Serviços: INSS 194,52 + ISS 5,00 = DAS R$ 199,52', () => {
    const r = calculate({ tipoAtividade: 'servicos', caminhoneiro: true });
    expect(r.inssBase).toBe(194.52);
    expect(r.icms).toBe(0);
    expect(r.iss).toBe(5.0);
    expect(r.das).toBe(199.52);
  });

  it('Comércio e Serviços: INSS 194,52 + ICMS 1,00 + ISS 5,00 = DAS R$ 200,52', () => {
    const r = calculate({
      tipoAtividade: 'comercio_e_servicos',
      caminhoneiro: true,
    });
    expect(r.inssBase).toBe(194.52);
    expect(r.icms).toBe(1.0);
    expect(r.iss).toBe(5.0);
    expect(r.das).toBe(200.52);
  });
});

describe('calculadora-mei-das — tabela completa e saneamento', () => {
  it('tabelaCompleta do MEI comum traz os três valores 82,05 / 86,05 / 87,05', () => {
    const r = calculate({ tipoAtividade: 'comercio_industria' });
    expect(r.tabelaCompleta.comercioIndustria).toBe(82.05);
    expect(r.tabelaCompleta.servicos).toBe(86.05);
    expect(r.tabelaCompleta.comercioEServicos).toBe(87.05);
  });

  it('tabelaCompleta do caminhoneiro traz 195,52 / 199,52 / 200,52', () => {
    const r = calculate({ tipoAtividade: 'servicos', caminhoneiro: true });
    expect(r.tabelaCompleta.comercioIndustria).toBe(195.52);
    expect(r.tabelaCompleta.servicos).toBe(199.52);
    expect(r.tabelaCompleta.comercioEServicos).toBe(200.52);
  });

  it('tipo inválido cai em comércio/indústria (DAS R$ 82,05)', () => {
    // @ts-expect-error testando valor fora do enum
    const r = calculate({ tipoAtividade: 'qualquer_coisa' });
    expect(r.tipoAtividade).toBe('comercio_industria');
    expect(r.das).toBe(82.05);
  });

  it('caminhoneiro ausente equivale a MEI comum', () => {
    const semFlag = calculate({ tipoAtividade: 'servicos' });
    const comFalse = calculate({ tipoAtividade: 'servicos', caminhoneiro: false });
    expect(semFlag.das).toBe(86.05);
    expect(comFalse.das).toBe(86.05);
  });

  it('salário mínimo de base é R$ 1.621,00 em 2026', () => {
    const r = calculate({ tipoAtividade: 'comercio_industria' });
    expect(r.salarioMinimo).toBe(1621.0);
  });
});
