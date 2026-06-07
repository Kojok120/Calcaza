import { describe, it, expect } from 'vitest';
import { calculate, calcularInss } from './logic';

describe('calculadora-irrf — INSS de apoio', () => {
  it('aplica a tabela progressiva e respeita o teto', () => {
    expect(calcularInss(2000)).toBeCloseTo(155.69, 2);
    expect(calcularInss(6000)).toBeCloseTo(641.51, 2);
    expect(calcularInss(10000)).toBe(988.09);
  });
});

describe('calculadora-irrf — IRRF mensal 2026', () => {
  it('Isento: bruto R$ 2.000 -> IRRF 0 (abaixo da faixa de tributação)', () => {
    const r = calculate({ salarioBruto: 2000 });
    expect(r.inss).toBeCloseTo(155.69, 2);
    expect(r.impostoTabela).toBe(0);
    expect(r.redutor).toBe(0);
    expect(r.irrf).toBe(0);
    expect(r.aliquotaEfetiva).toBe(0);
  });

  it('Isenção 2026: bruto R$ 5.000 -> imposto pela tabela > 0, mas o redutor zera o IRRF', () => {
    const r = calculate({ salarioBruto: 5000 });
    expect(r.inss).toBeCloseTo(501.51, 2);
    expect(r.impostoTabela).toBeCloseTo(312.89, 2);
    expect(r.irrf).toBe(0); // isenção total até R$ 5.000
    expect(r.aliquotaEfetiva).toBe(0);
  });

  it('Faixa do redutor: bruto R$ 6.000 com 1 dependente -> IRRF ~332,97', () => {
    const r = calculate({ salarioBruto: 6000, dependentes: 1 });
    expect(r.inss).toBeCloseTo(641.51, 2);
    expect(r.baseTipo).toBe('legal');
    expect(r.baseCalculo).toBeCloseTo(5168.9, 2);
    expect(r.impostoTabela).toBeCloseTo(512.72, 2);
    expect(r.redutor).toBeCloseTo(179.75, 2);
    expect(r.irrf).toBeCloseTo(332.97, 2);
    expect(r.aliquotaNominal).toBeCloseTo(0.275, 4);
  });

  it('Sem redutor: bruto R$ 10.000 com 2 dependentes -> IRRF ~1.465,27', () => {
    const r = calculate({ salarioBruto: 10000, dependentes: 2 });
    expect(r.inss).toBe(988.09); // teto do INSS
    expect(r.baseTipo).toBe('legal');
    expect(r.impostoTabela).toBeCloseTo(1465.27, 2);
    expect(r.redutor).toBe(0); // acima de R$ 7.350
    expect(r.irrf).toBeCloseTo(1465.27, 2);
    expect(r.aliquotaEfetiva).toBeCloseTo(0.146527, 5);
  });

  it('Com outras deduções (pensão): bruto R$ 8.000 e pensão de R$ 1.000 reduzem a base', () => {
    const semPensao = calculate({ salarioBruto: 8000 });
    const comPensao = calculate({ salarioBruto: 8000, outrasDeducoes: 1000 });
    expect(comPensao.baseTipo).toBe('legal');
    expect(comPensao.baseCalculo).toBeCloseTo(6078.49, 2);
    expect(comPensao.impostoTabela).toBeCloseTo(762.85, 2);
    expect(comPensao.irrf).toBeCloseTo(762.85, 2);
    // A pensão reduz a base e, portanto, o imposto.
    expect(comPensao.irrf).toBeLessThan(semPensao.irrf);
  });

  it('Com INSS informado pela folha: usa o valor informado, não o calculado', () => {
    const r = calculate({ salarioBruto: 6000, inssInformado: 500 });
    expect(r.inss).toBe(500); // informado, e não os 641,51 da tabela
    expect(r.baseTipo).toBe('simplificado'); // simplificado fica mais vantajoso aqui
    expect(r.baseCalculo).toBeCloseTo(5392.8, 2);
    expect(r.impostoTabela).toBeCloseTo(574.29, 2);
    expect(r.redutor).toBeCloseTo(179.75, 2);
    expect(r.irrf).toBeCloseTo(394.54, 2);
  });

  it('Completo x simplificado: bruto R$ 4.000 sem dependentes escolhe o menor (simplificado)', () => {
    const r = calculate({ salarioBruto: 4000 });
    // Sem dependentes, o desconto simplificado de R$ 607,20 baixa mais a base
    // do que apenas o INSS, gerando menos imposto.
    expect(r.baseTipo).toBe('simplificado');
    expect(r.baseCalculo).toBeCloseTo(3392.8, 2);
    expect(r.impostoTabela).toBeCloseTo(114.76, 2);
    expect(r.irrf).toBe(0); // bruto abaixo de R$ 5.000 -> isento em 2026
  });

  it('Muitos dependentes tornam a base legal mais vantajosa que a simplificada', () => {
    const r = calculate({ salarioBruto: 8000, dependentes: 4 });
    expect(r.baseTipo).toBe('legal');
    expect(r.irrf).toBeGreaterThan(0);
  });

  it('Edge: bruto 0, negativo ou NaN retornam tudo zero', () => {
    for (const bruto of [0, -100, Number.NaN]) {
      const r = calculate({ salarioBruto: bruto });
      expect(r.salarioBruto).toBe(0);
      expect(r.inss).toBe(0);
      expect(r.baseCalculo).toBe(0);
      expect(r.impostoTabela).toBe(0);
      expect(r.redutor).toBe(0);
      expect(r.irrf).toBe(0);
      expect(r.aliquotaNominal).toBe(0);
      expect(r.aliquotaEfetiva).toBe(0);
    }
  });

  it('Edge: dependentes e deduções inválidas (negativas/NaN) são tratadas como zero', () => {
    const base = calculate({ salarioBruto: 6000 });
    const negs = calculate({
      salarioBruto: 6000,
      dependentes: -2,
      outrasDeducoes: -50,
    });
    const nans = calculate({
      salarioBruto: 6000,
      dependentes: Number.NaN,
      outrasDeducoes: Number.NaN,
    });
    expect(negs.irrf).toBeCloseTo(base.irrf, 2);
    expect(nans.irrf).toBeCloseTo(base.irrf, 2);
  });
});
