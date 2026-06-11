import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-salario-maternidade — empregada CLT (salário integral)', () => {
  it('CLT integral: salário R$ 3.000 -> mensal R$ 3.000 e total R$ 12.000 (120 dias)', () => {
    const r = calculate({ tipoSegurada: 'empregada_clt', salarioMensal: 3000 });
    expect(r.valorMensal).toBeCloseTo(3000, 2);
    expect(r.valorTotal).toBeCloseTo(12000, 2);
    expect(r.diaria).toBeCloseTo(100, 2);
    expect(r.tetoAplicado).toBe(false);
    expect(r.pisoAplicado).toBe(false);
  });

  it('CLT sem teto: salário acima do teto do INSS recebe o salário integral', () => {
    const r = calculate({ tipoSegurada: 'empregada_clt', salarioMensal: 12000 });
    // Empregada CLT recebe salário integral, sem aplicação do teto do INSS.
    expect(r.valorMensal).toBeCloseTo(12000, 2);
    expect(r.valorTotal).toBeCloseTo(48000, 2);
    expect(r.tetoAplicado).toBe(false);
  });

  it('valor exato: salário R$ 4.500 -> diária R$ 150 e total R$ 18.000', () => {
    const r = calculate({ tipoSegurada: 'empregada_clt', salarioMensal: 4500 });
    expect(r.valorMensal).toBe(4500);
    expect(r.diaria).toBe(150);
    expect(r.valorTotal).toBe(18000);
  });
});

describe('calculadora-salario-maternidade — contribuinte individual / facultativa (média)', () => {
  it('CI com teto: média R$ 12.000 trava em R$ 8.475,55 -> total R$ 33.902,20', () => {
    const r = calculate({
      tipoSegurada: 'contribuinte_individual',
      mediaUltimos12: 12000,
    });
    expect(r.valorMensal).toBeCloseTo(8475.55, 2);
    expect(r.valorTotal).toBeCloseTo(33902.2, 2);
    expect(r.diaria).toBeCloseTo(282.52, 2);
    expect(r.tetoAplicado).toBe(true);
    expect(r.pisoAplicado).toBe(false);
  });

  it('CI com piso: média R$ 1.000 sobe para o mínimo R$ 1.621 -> total R$ 6.484', () => {
    const r = calculate({
      tipoSegurada: 'contribuinte_individual',
      mediaUltimos12: 1000,
    });
    expect(r.valorMensal).toBeCloseTo(1621.0, 2);
    expect(r.valorTotal).toBeCloseTo(6484.0, 2);
    expect(r.diaria).toBeCloseTo(54.03, 2);
    expect(r.tetoAplicado).toBe(false);
    expect(r.pisoAplicado).toBe(true);
  });

  it('CI dentro da faixa: média R$ 3.000 -> mensal R$ 3.000, sem piso nem teto', () => {
    const r = calculate({
      tipoSegurada: 'contribuinte_individual',
      mediaUltimos12: 3000,
    });
    expect(r.valorMensal).toBeCloseTo(3000, 2);
    expect(r.valorTotal).toBeCloseTo(12000, 2);
    expect(r.tetoAplicado).toBe(false);
    expect(r.pisoAplicado).toBe(false);
  });
});

describe('calculadora-salario-maternidade — entradas inválidas', () => {
  it('valores 0, negativos ou NaN retornam tudo zero', () => {
    for (const v of [0, -2000, Number.NaN]) {
      const clt = calculate({ tipoSegurada: 'empregada_clt', salarioMensal: v });
      expect(clt.valorMensal).toBe(0);
      expect(clt.valorTotal).toBe(0);
      expect(clt.diaria).toBe(0);

      const ci = calculate({
        tipoSegurada: 'contribuinte_individual',
        mediaUltimos12: v,
      });
      expect(ci.valorMensal).toBe(0);
      expect(ci.valorTotal).toBe(0);
    }
  });

  it('campo ausente retorna tudo zero', () => {
    const clt = calculate({ tipoSegurada: 'empregada_clt' });
    expect(clt.valorMensal).toBe(0);
    const ci = calculate({ tipoSegurada: 'contribuinte_individual' });
    expect(ci.valorMensal).toBe(0);
  });
});
