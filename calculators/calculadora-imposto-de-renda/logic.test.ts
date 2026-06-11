import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('calculadora-imposto-de-renda — IRPF anual 2026 (ajuste da declaração)', () => {
  it('Cálculo manual exato: rendimentos R$ 100.000, sem deduções -> simplificado, imposto R$ 11.744,24', () => {
    // Modelo simplificado: desconto = min(20% × 100.000, 17.640) = 17.640
    // base = 100.000 − 17.640 = 82.360 (faixa 27,5%, deduzir 10.904,76)
    // imposto = 82.360 × 0,275 − 10.904,76 = 22.649,00 − 10.904,76 = 11.744,24
    // (modelo completo sem deduções daria base 100.000 e imposto maior)
    const r = calculate({ rendimentosTributaveisAnuais: 100000 });
    expect(r.modeloUsado).toBe('simplificado');
    expect(r.baseCalculo).toBeCloseTo(82360, 2);
    expect(r.impostoSimplificado).toBeCloseTo(11744.24, 2);
    expect(r.impostoDevido).toBeCloseTo(11744.24, 2);
    expect(r.aliquotaNominal).toBeCloseTo(0.275, 4);
    // Sem IRRF retido informado -> tudo "a pagar".
    expect(r.situacao).toBe('a pagar');
    expect(r.restituirOuPagar).toBeCloseTo(11744.24, 2);
  });

  it('CLT típico: rendimentos R$ 60.000, IRRF retido R$ 3.000 -> simplificado, restituição R$ 305,88', () => {
    // simplificado: desconto = min(12.000, 17.640) = 12.000 ; base = 48.000
    // faixa 22,5% (45.012,61–55.976,16), deduzir 8.105,88
    // imposto = 48.000 × 0,225 − 8.105,88 = 10.800 − 8.105,88 = 2.694,12
    // acerto = 2.694,12 − 3.000 = −305,88 -> a restituir
    const r = calculate({
      rendimentosTributaveisAnuais: 60000,
      impostoRetidoNaFonte: 3000,
    });
    expect(r.modeloUsado).toBe('simplificado');
    expect(r.baseCalculo).toBeCloseTo(48000, 2);
    expect(r.impostoDevido).toBeCloseTo(2694.12, 2);
    expect(r.situacao).toBe('a restituir');
    expect(r.restituirOuPagar).toBeCloseTo(-305.88, 2);
    expect(r.aliquotaEfetiva).toBeCloseTo(0.044902, 5);
  });

  it('Renda alta com deduções: completo vence (R$ 120.000, 2 dep, educação, saúde, INSS)', () => {
    // deduções completas = 2×2.275,08 + min(5.000, 3.561,50×3=10.684,50) + 8.000 + 9.600
    //   = 4.550,16 + 5.000 + 8.000 + 9.600 = 27.150,16
    // base completa = 120.000 − 27.150,16 = 92.849,84
    // imposto completo = 92.849,84 × 0,275 − 10.904,76 = 25.533,71 − 10.904,76 = 14.628,95
    // simplificado: base = 120.000 − 17.640 = 102.360 -> imposto 17.244,24 (maior)
    const r = calculate({
      rendimentosTributaveisAnuais: 120000,
      impostoRetidoNaFonte: 18000,
      dependentes: 2,
      despesasComEducacao: 5000,
      despesasComSaude: 8000,
      contribuicaoPrevidenciaria: 9600,
    });
    expect(r.modeloUsado).toBe('completo');
    expect(r.baseCalculo).toBeCloseTo(92849.84, 2);
    expect(r.impostoCompleto).toBeCloseTo(14628.95, 2);
    expect(r.impostoSimplificado).toBeCloseTo(17244.24, 2);
    expect(r.impostoDevido).toBeCloseTo(14628.95, 2);
    expect(r.situacao).toBe('a restituir');
    expect(r.restituirOuPagar).toBeCloseTo(-3371.05, 2);
  });

  it('Faixa baixa (7,5%): rendimentos R$ 40.000, IRRF R$ 500 -> simplificado, restituição', () => {
    // simplificado: desconto = min(8.000, 17.640) = 8.000 ; base = 32.000
    // faixa 7,5% (29.145,61–33.919,80), deduzir 2.185,92
    // imposto = 32.000 × 0,075 − 2.185,92 = 2.400 − 2.185,92 = 214,08
    // acerto = 214,08 − 500 = −285,92 -> a restituir
    const r = calculate({
      rendimentosTributaveisAnuais: 40000,
      impostoRetidoNaFonte: 500,
    });
    expect(r.modeloUsado).toBe('simplificado');
    expect(r.baseCalculo).toBeCloseTo(32000, 2);
    expect(r.impostoDevido).toBeCloseTo(214.08, 2);
    expect(r.aliquotaNominal).toBeCloseTo(0.075, 4);
    expect(r.situacao).toBe('a restituir');
    expect(r.restituirOuPagar).toBeCloseTo(-285.92, 2);
  });

  it('Isento: rendimentos abaixo do limite anual (R$ 25.000) -> imposto devido zero', () => {
    // simplificado: base = 25.000 − 5.000 = 20.000 (< 29.145,60) -> isento
    // completo: base 25.000 (< 29.145,60) -> isento
    const r = calculate({
      rendimentosTributaveisAnuais: 25000,
      impostoRetidoNaFonte: 0,
    });
    expect(r.impostoDevido).toBe(0);
    expect(r.aliquotaNominal).toBe(0);
    expect(r.aliquotaEfetiva).toBe(0);
    expect(r.situacao).toBe('quitado');
    expect(r.restituirOuPagar).toBe(0);
  });

  it('Despesas com saúde fazem o modelo completo superar o simplificado', () => {
    // saúde não tem limite legal e pode tornar o completo mais vantajoso
    const r = calculate({
      rendimentosTributaveisAnuais: 90000,
      impostoRetidoNaFonte: 10000,
      dependentes: 3,
      despesasComEducacao: 10000,
      despesasComSaude: 20000,
      contribuicaoPrevidenciaria: 14400,
    });
    expect(r.modeloUsado).toBe('completo');
    expect(r.impostoCompleto).toBeLessThan(r.impostoSimplificado);
    expect(r.situacao).toBe('a restituir');
    expect(r.restituirOuPagar).toBeLessThan(0);
  });

  it('Teto do desconto simplificado: 20% > R$ 17.640 trava no teto', () => {
    // rendimentos R$ 200.000: 20% = 40.000, mas o desconto trava em 17.640
    // base simplificada = 200.000 − 17.640 = 182.360
    const r = calculate({ rendimentosTributaveisAnuais: 200000 });
    expect(r.baseCalculo).toBeCloseTo(182360, 2);
    expect(r.modeloUsado).toBe('simplificado');
  });

  it('Limite de educação por pessoa: gasto acima do teto é truncado', () => {
    // 1 declarante + 0 dependente -> limite educação = 3.561,50 × 1
    // educação informada 10.000 é truncada para 3.561,50 na base completa
    const semLimite = calculate({
      rendimentosTributaveisAnuais: 50000,
      despesasComEducacao: 3561.5,
    });
    const acimaDoLimite = calculate({
      rendimentosTributaveisAnuais: 50000,
      despesasComEducacao: 10000,
    });
    // Como a educação é truncada no teto, a base completa é idêntica nos dois.
    expect(acimaDoLimite.impostoCompleto).toBeCloseTo(semLimite.impostoCompleto, 2);
  });

  it('Edge: rendimentos 0, negativo ou NaN retornam tudo zero', () => {
    for (const rend of [0, -50000, Number.NaN]) {
      const r = calculate({ rendimentosTributaveisAnuais: rend });
      expect(r.rendimentosTributaveisAnuais).toBe(0);
      expect(r.impostoDevido).toBe(0);
      expect(r.baseCalculo).toBe(0);
      expect(r.aliquotaNominal).toBe(0);
      expect(r.aliquotaEfetiva).toBe(0);
      expect(r.situacao).toBe('quitado');
      expect(r.restituirOuPagar).toBe(0);
    }
  });

  it('Edge: deduções e dependentes inválidos (negativos/NaN) são tratados como zero', () => {
    const base = calculate({ rendimentosTributaveisAnuais: 80000 });
    const negs = calculate({
      rendimentosTributaveisAnuais: 80000,
      dependentes: -3,
      despesasComEducacao: -100,
      despesasComSaude: -200,
      contribuicaoPrevidenciaria: -300,
      impostoRetidoNaFonte: -1000,
    });
    const nans = calculate({
      rendimentosTributaveisAnuais: 80000,
      dependentes: Number.NaN,
      despesasComEducacao: Number.NaN,
      despesasComSaude: Number.NaN,
      contribuicaoPrevidenciaria: Number.NaN,
      impostoRetidoNaFonte: Number.NaN,
    });
    expect(negs.impostoDevido).toBeCloseTo(base.impostoDevido, 2);
    expect(negs.impostoRetidoNaFonte).toBe(0);
    expect(nans.impostoDevido).toBeCloseTo(base.impostoDevido, 2);
    expect(nans.impostoRetidoNaFonte).toBe(0);
  });
});
