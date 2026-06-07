import { describe, it, expect } from 'vitest';
import { calculate, calcularInss, calcularIrrf } from './logic';

describe('calculadora-rescisao — funções auxiliares', () => {
  it('INSS progressivo: base R$ 1.500 -> R$ 112,50 (7,5%)', () => {
    expect(calcularInss(1500)).toBeCloseTo(112.5, 2);
  });

  it('INSS progressivo: base R$ 6.000 -> R$ 641,51', () => {
    expect(calcularInss(6000)).toBeCloseTo(641.51, 2);
  });

  it('INSS respeita o teto (R$ 988,09) para bases acima de R$ 8.475,55', () => {
    expect(calcularInss(8475.55)).toBe(988.09);
    expect(calcularInss(20000)).toBe(988.09);
  });

  it('IRRF: base isenta retorna 0', () => {
    expect(calcularIrrf(2000)).toBe(0);
  });
});

describe('calculadora-rescisao — sem justa causa (exemplo completo)', () => {
  // Salário R$ 3.000; 15 dias no mês; 6 meses no ano (13º); 6 meses de férias;
  // 2 anos completos; saldo FGTS R$ 10.000; sem dependentes.
  const r = calculate({
    salarioBruto: 3000,
    tipoRescisao: 'sem_justa_causa',
    diasTrabalhadosNoMes: 15,
    mesesTrabalhadosAno: 6,
    mesesAquisitivoFerias: 6,
    feriasVencidas: false,
    anosCompletos: 2,
    saldoFgts: 10000,
    dependentes: 0,
  });

  it('saldo de salário = R$ 1.500 (3000/30 × 15)', () => {
    expect(r.saldoSalario).toBeCloseTo(1500, 2);
  });

  it('aviso prévio = 36 dias (30 + 3×2) e valor R$ 3.600', () => {
    expect(r.avisoPrevioDias).toBe(36);
    expect(r.avisoPrevio).toBeCloseTo(3600, 2);
  });

  it('13º proporcional = R$ 1.500 (3000/12 × 6)', () => {
    expect(r.decimoTerceiroProporcional).toBeCloseTo(1500, 2);
  });

  it('férias proporcionais = R$ 2.000 (3000/12 × 6 × 4/3)', () => {
    expect(r.feriasProporcionais).toBeCloseTo(2000, 2);
    expect(r.feriasVencidas).toBe(0);
  });

  it('multa do FGTS = R$ 4.000 (40% de R$ 10.000)', () => {
    expect(r.multaFgts).toBeCloseTo(4000, 2);
  });

  it('descontos: INSS saldo R$ 112,50 + INSS 13º R$ 112,50; IRRF isento', () => {
    expect(r.inssSaldoSalario).toBeCloseTo(112.5, 2);
    expect(r.inssDecimoTerceiro).toBeCloseTo(112.5, 2);
    expect(r.irrfSaldoSalario).toBe(0);
    expect(r.irrfDecimoTerceiro).toBe(0);
  });

  it('totais: proventos R$ 12.600, descontos R$ 225, líquido R$ 12.375', () => {
    expect(r.totalProventos).toBeCloseTo(12600, 2);
    expect(r.totalDescontos).toBeCloseTo(225, 2);
    expect(r.totalLiquido).toBeCloseTo(12375, 2);
  });
});

describe('calculadora-rescisao — pedido de demissão', () => {
  const r = calculate({
    salarioBruto: 3000,
    tipoRescisao: 'pedido_demissao',
    diasTrabalhadosNoMes: 15,
    mesesTrabalhadosAno: 6,
    mesesAquisitivoFerias: 6,
    feriasVencidas: false,
    anosCompletos: 2,
    saldoFgts: 10000,
    dependentes: 0,
  });

  it('não há aviso indenizado nem multa do FGTS', () => {
    expect(r.avisoPrevio).toBe(0);
    expect(r.multaFgts).toBe(0);
  });

  it('mantém 13º e férias proporcionais', () => {
    expect(r.decimoTerceiroProporcional).toBeCloseTo(1500, 2);
    expect(r.feriasProporcionais).toBeCloseTo(2000, 2);
  });

  it('líquido = R$ 4.775 (proventos R$ 5.000 − descontos R$ 225)', () => {
    expect(r.totalProventos).toBeCloseTo(5000, 2);
    expect(r.totalLiquido).toBeCloseTo(4775, 2);
  });
});

describe('calculadora-rescisao — acordo mútuo (Reforma Trabalhista)', () => {
  const r = calculate({
    salarioBruto: 3000,
    tipoRescisao: 'acordo_mutuo',
    diasTrabalhadosNoMes: 15,
    mesesTrabalhadosAno: 6,
    mesesAquisitivoFerias: 6,
    feriasVencidas: false,
    anosCompletos: 2,
    saldoFgts: 10000,
    dependentes: 0,
  });

  it('aviso prévio pela metade = R$ 1.800', () => {
    expect(r.avisoPrevio).toBeCloseTo(1800, 2);
  });

  it('multa do FGTS pela metade (20%) = R$ 2.000', () => {
    expect(r.multaFgts).toBeCloseTo(2000, 2);
  });

  it('líquido = R$ 8.575 (proventos R$ 8.800 − descontos R$ 225)', () => {
    expect(r.totalProventos).toBeCloseTo(8800, 2);
    expect(r.totalLiquido).toBeCloseTo(8575, 2);
  });
});

describe('calculadora-rescisao — justa causa', () => {
  const r = calculate({
    salarioBruto: 3000,
    tipoRescisao: 'justa_causa',
    diasTrabalhadosNoMes: 15,
    mesesTrabalhadosAno: 6,
    mesesAquisitivoFerias: 6,
    feriasVencidas: true,
    anosCompletos: 2,
    saldoFgts: 10000,
    dependentes: 0,
  });

  it('perde 13º, férias proporcionais, aviso e multa do FGTS', () => {
    expect(r.decimoTerceiroProporcional).toBe(0);
    expect(r.feriasProporcionais).toBe(0);
    expect(r.avisoPrevio).toBe(0);
    expect(r.multaFgts).toBe(0);
  });

  it('mantém saldo de salário e férias vencidas + 1/3 (R$ 4.000)', () => {
    expect(r.saldoSalario).toBeCloseTo(1500, 2);
    expect(r.feriasVencidas).toBeCloseTo(4000, 2);
  });

  it('líquido = R$ 5.387,50 (proventos R$ 5.500 − INSS do saldo R$ 112,50)', () => {
    expect(r.totalProventos).toBeCloseTo(5500, 2);
    expect(r.totalDescontos).toBeCloseTo(112.5, 2);
    expect(r.totalLiquido).toBeCloseTo(5387.5, 2);
  });
});

describe('calculadora-rescisao — aviso prévio proporcional (Lei 12.506/2011)', () => {
  it('0 anos completos -> 30 dias', () => {
    const r = calculate({
      salarioBruto: 2000,
      tipoRescisao: 'sem_justa_causa',
      diasTrabalhadosNoMes: 0,
      mesesTrabalhadosAno: 0,
      mesesAquisitivoFerias: 0,
      feriasVencidas: false,
      anosCompletos: 0,
    });
    expect(r.avisoPrevioDias).toBe(30);
  });

  it('limite de 90 dias para muitos anos de serviço', () => {
    const r = calculate({
      salarioBruto: 2000,
      tipoRescisao: 'sem_justa_causa',
      diasTrabalhadosNoMes: 0,
      mesesTrabalhadosAno: 0,
      mesesAquisitivoFerias: 0,
      feriasVencidas: false,
      anosCompletos: 25,
    });
    expect(r.avisoPrevioDias).toBe(90);
  });
});

describe('calculadora-rescisao — salário alto com IRRF e dependente', () => {
  // Salário R$ 6.000; mês cheio; 12 meses; 12 meses férias; 5 anos; FGTS R$ 40.000; 1 dependente.
  const r = calculate({
    salarioBruto: 6000,
    tipoRescisao: 'sem_justa_causa',
    diasTrabalhadosNoMes: 30,
    mesesTrabalhadosAno: 12,
    mesesAquisitivoFerias: 12,
    feriasVencidas: false,
    anosCompletos: 5,
    saldoFgts: 40000,
    dependentes: 1,
  });

  it('aviso = 45 dias (30 + 3×5) e R$ 9.000', () => {
    expect(r.avisoPrevioDias).toBe(45);
    expect(r.avisoPrevio).toBeCloseTo(9000, 2);
  });

  it('multa do FGTS = R$ 16.000 (40% de R$ 40.000)', () => {
    expect(r.multaFgts).toBeCloseTo(16000, 2);
  });

  it('IRRF incide sobre saldo e 13º (R$ 512,72 cada, com 1 dependente)', () => {
    expect(r.inssSaldoSalario).toBeCloseTo(641.51, 2);
    expect(r.irrfSaldoSalario).toBeCloseTo(512.72, 2);
    expect(r.irrfDecimoTerceiro).toBeCloseTo(512.72, 2);
  });

  it('líquido = R$ 42.691,54 (proventos R$ 45.000 − descontos R$ 2.308,46)', () => {
    expect(r.totalProventos).toBeCloseTo(45000, 2);
    expect(r.totalDescontos).toBeCloseTo(2308.46, 2);
    expect(r.totalLiquido).toBeCloseTo(42691.54, 2);
  });
});

describe('calculadora-rescisao — entradas inválidas e limites', () => {
  it('salário negativo, dias/meses fora do intervalo e FGTS NaN -> zeros', () => {
    const r = calculate({
      salarioBruto: -100,
      tipoRescisao: 'sem_justa_causa',
      diasTrabalhadosNoMes: -5,
      mesesTrabalhadosAno: 99,
      mesesAquisitivoFerias: -1,
      feriasVencidas: false,
      anosCompletos: -2,
      saldoFgts: Number.NaN,
    });
    expect(r.salarioBruto).toBe(0);
    expect(r.totalProventos).toBe(0);
    expect(r.totalDescontos).toBe(0);
    expect(r.totalLiquido).toBe(0);
  });

  it('meses acima de 12 são limitados a 12', () => {
    const r = calculate({
      salarioBruto: 1200,
      tipoRescisao: 'sem_justa_causa',
      diasTrabalhadosNoMes: 30,
      mesesTrabalhadosAno: 30,
      mesesAquisitivoFerias: 30,
      feriasVencidas: false,
      anosCompletos: 0,
    });
    // 13º com 12 meses = salário cheio.
    expect(r.decimoTerceiroProporcional).toBeCloseTo(1200, 2);
    // férias proporcionais com 12 meses = salário + 1/3.
    expect(r.feriasProporcionais).toBeCloseTo(1600, 2);
  });
});
