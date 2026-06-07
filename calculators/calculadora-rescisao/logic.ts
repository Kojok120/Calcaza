// Calculadora de Rescisão (CLT) 2026.
// Estima as verbas rescisórias e os descontos de quem sai de um emprego com
// carteira assinada, conforme o tipo de desligamento.
//
// Fontes oficiais (2026):
//   - Verbas rescisórias, 13º proporcional e férias: CLT —
//     https://www.planalto.gov.br/ccivil_03/decreto-lei/del5452.htm
//   - Aviso prévio proporcional (3 dias por ano, até 90 dias): Lei nº 12.506/2011 —
//     https://www.planalto.gov.br/ccivil_03/_ato2011-2014/2011/lei/l12506.htm
//   - Salário mínimo 2026 (R$ 1.621,00) e normas trabalhistas:
//     https://www.gov.br/trabalho-e-emprego
//   - Tabela INSS 2026 (contribuição do empregado, progressiva por faixa):
//     https://www.gov.br/inss
//   - Tabela IRRF mensal 2026: https://www.gov.br/receitafederal
//   - Multa do FGTS (40% sem justa causa / 20% no acordo): Caixa —
//     https://www.fgts.gov.br

export type TipoRescisao =
  | 'sem_justa_causa'
  | 'pedido_demissao'
  | 'justa_causa'
  | 'acordo_mutuo';

export type Input = {
  /** Salário bruto mensal em reais. */
  salarioBruto: number;
  /** Tipo de rescisão (define quais verbas são devidas). */
  tipoRescisao: TipoRescisao;
  /** Dias trabalhados no mês do desligamento (0 a 30). */
  diasTrabalhadosNoMes: number;
  /** Meses trabalhados no ano para o 13º proporcional (0 a 12; conta mês com 15+ dias). */
  mesesTrabalhadosAno: number;
  /** Meses do período aquisitivo para as férias proporcionais (0 a 12). */
  mesesAquisitivoFerias: number;
  /** Há férias vencidas a receber (período já completo e não gozado). */
  feriasVencidas: boolean;
  /** Anos completos de serviço (para o aviso prévio proporcional). */
  anosCompletos: number;
  /** Saldo de FGTS depositado na conta vinculada (base da multa). Padrão: 0. */
  saldoFgts?: number;
  /** Número de dependentes para fins de IRRF. Padrão: 0. */
  dependentes?: number;
};

export type Output = {
  /** Salário bruto efetivamente considerado (saneado, >= 0). */
  salarioBruto: number;
  /** Tipo de rescisão usado. */
  tipoRescisao: TipoRescisao;
  // --- Verbas (proventos) ---
  /** Saldo de salário dos dias trabalhados no mês. */
  saldoSalario: number;
  /** Dias de aviso prévio (30 + 3 por ano, limitado a 90). */
  avisoPrevioDias: number;
  /** Aviso prévio indenizado devido (já considerando o tipo de rescisão). */
  avisoPrevio: number;
  /** 13º salário proporcional. */
  decimoTerceiroProporcional: number;
  /** Férias vencidas + 1/3 (quando houver). */
  feriasVencidas: number;
  /** Férias proporcionais + 1/3. */
  feriasProporcionais: number;
  /** Multa do FGTS (40% / 20% / 0% conforme o tipo). */
  multaFgts: number;
  // --- Descontos ---
  /** INSS sobre o saldo de salário. */
  inssSaldoSalario: number;
  /** INSS sobre o 13º proporcional (tributado em separado). */
  inssDecimoTerceiro: number;
  /** IRRF sobre o saldo de salário. */
  irrfSaldoSalario: number;
  /** IRRF sobre o 13º proporcional. */
  irrfDecimoTerceiro: number;
  // --- Totais ---
  /** Soma das verbas devidas. */
  totalProventos: number;
  /** Soma dos descontos (INSS + IRRF). */
  totalDescontos: number;
  /** Total líquido da rescisão. */
  totalLiquido: number;
};

// --- Tabela INSS 2026 (contribuição do empregado) ---
// Cada alíquota incide apenas sobre a parcela do valor dentro da faixa.
const INSS_BANDS: ReadonlyArray<{ limit: number; rate: number }> = [
  { limit: 1621.0, rate: 0.075 }, // até R$ 1.621,00 -> 7,5%
  { limit: 2902.84, rate: 0.09 }, // R$ 1.621,01 a 2.902,84 -> 9%
  { limit: 4354.27, rate: 0.12 }, // R$ 2.902,85 a 4.354,27 -> 12%
  { limit: 8475.55, rate: 0.14 }, // R$ 4.354,28 a 8.475,55 -> 14%
];
const INSS_TETO = 8475.55; // teto do salário de contribuição 2026
const INSS_DESCONTO_TETO = 988.09; // INSS máximo (desconto no teto)

// --- Tabela IRRF mensal 2026 (Receita Federal) ---
// Aplicada às verbas rescisórias/13º como estimativa (tributação própria,
// sem o redutor da Lei 15.270/2025).
const IRRF_BANDS: ReadonlyArray<{ limit: number; rate: number; deduzir: number }> = [
  { limit: 2428.8, rate: 0, deduzir: 0 }, // isento
  { limit: 2826.65, rate: 0.075, deduzir: 182.16 },
  { limit: 3751.05, rate: 0.15, deduzir: 394.16 },
  { limit: 4664.68, rate: 0.225, deduzir: 675.49 },
  { limit: Number.POSITIVE_INFINITY, rate: 0.275, deduzir: 908.73 },
];
const DEDUCAO_DEPENDENTE = 189.59; // dedução mensal por dependente

// --- Aviso prévio (Lei nº 12.506/2011) ---
const AVISO_BASE_DIAS = 30; // 30 dias + 3 por ano de serviço
const AVISO_DIAS_POR_ANO = 3;
const AVISO_MAX_DIAS = 90; // limite legal

// --- Multa do FGTS ---
const MULTA_FGTS_SEM_JUSTA_CAUSA = 0.4; // 40%
const MULTA_FGTS_ACORDO = 0.2; // 20%

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

/** INSS progressivo do empregado sobre uma base (saldo de salário ou 13º). */
export function calcularInss(base: number): number {
  if (!Number.isFinite(base) || base <= 0) return 0;
  if (base >= INSS_TETO) return INSS_DESCONTO_TETO;

  let anterior = 0;
  let total = 0;
  for (const banda of INSS_BANDS) {
    if (base <= anterior) break;
    const parcela = Math.min(base, banda.limit) - anterior;
    total += parcela * banda.rate;
    anterior = banda.limit;
  }
  return round2(total);
}

/** IRRF sobre uma base de cálculo, usando a tabela mensal padrão de 2026. */
export function calcularIrrf(base: number): number {
  if (!Number.isFinite(base) || base <= 0) return 0;
  for (const banda of IRRF_BANDS) {
    if (base <= banda.limit) {
      return round2(Math.max(0, base * banda.rate - banda.deduzir));
    }
  }
  return 0;
}

function clampMeses(v: number): number {
  if (!Number.isFinite(v) || v <= 0) return 0;
  return Math.min(12, v);
}

const TIPOS_VALIDOS: ReadonlyArray<TipoRescisao> = [
  'sem_justa_causa',
  'pedido_demissao',
  'justa_causa',
  'acordo_mutuo',
];

export function calculate(input: Input): Output {
  const salarioBruto =
    Number.isFinite(input.salarioBruto) && input.salarioBruto > 0
      ? input.salarioBruto
      : 0;

  const tipoRescisao: TipoRescisao = TIPOS_VALIDOS.includes(input.tipoRescisao)
    ? input.tipoRescisao
    : 'sem_justa_causa';

  const dias =
    Number.isFinite(input.diasTrabalhadosNoMes) && input.diasTrabalhadosNoMes > 0
      ? Math.min(30, input.diasTrabalhadosNoMes)
      : 0;

  const mesesAno = clampMeses(input.mesesTrabalhadosAno);
  const mesesFerias = clampMeses(input.mesesAquisitivoFerias);

  const temFeriasVencidas = input.feriasVencidas === true;

  const anosCompletos =
    Number.isFinite(input.anosCompletos) && input.anosCompletos > 0
      ? Math.floor(input.anosCompletos)
      : 0;

  const saldoFgts =
    Number.isFinite(input.saldoFgts) && (input.saldoFgts as number) > 0
      ? (input.saldoFgts as number)
      : 0;

  const dependentes =
    Number.isFinite(input.dependentes) && (input.dependentes as number) > 0
      ? Math.floor(input.dependentes as number)
      : 0;

  // --- Verbas ---
  // Saldo de salário: proporcional aos dias trabalhados no mês.
  const saldoSalario = round2((salarioBruto / 30) * dias);

  // Aviso prévio proporcional (Lei 12.506/2011): 30 + 3 por ano, máx. 90 dias.
  const avisoPrevioDias = Math.min(
    AVISO_MAX_DIAS,
    AVISO_BASE_DIAS + AVISO_DIAS_POR_ANO * anosCompletos
  );
  const avisoPrevioBruto = (salarioBruto / 30) * avisoPrevioDias;
  let avisoPrevio = 0;
  if (tipoRescisao === 'sem_justa_causa') {
    avisoPrevio = round2(avisoPrevioBruto);
  } else if (tipoRescisao === 'acordo_mutuo') {
    avisoPrevio = round2(avisoPrevioBruto * 0.5); // acordo: metade do aviso
  }
  // pedido_demissao e justa_causa: aviso prévio indenizado não é devido.

  // 13º proporcional: devido em todos os tipos, exceto justa causa.
  const decimoTerceiroProporcional =
    tipoRescisao === 'justa_causa'
      ? 0
      : round2((salarioBruto / 12) * mesesAno);

  // Férias vencidas + 1/3: devidas em TODOS os tipos (inclusive justa causa).
  const feriasVencidas = temFeriasVencidas
    ? round2(salarioBruto + salarioBruto / 3)
    : 0;

  // Férias proporcionais + 1/3: devidas em todos, exceto justa causa.
  const feriasProporcionais =
    tipoRescisao === 'justa_causa'
      ? 0
      : round2((salarioBruto / 12) * mesesFerias * (1 + 1 / 3));

  // Multa do FGTS: 40% sem justa causa, 20% no acordo, 0% nos demais.
  let multaFgts = 0;
  if (tipoRescisao === 'sem_justa_causa') {
    multaFgts = round2(saldoFgts * MULTA_FGTS_SEM_JUSTA_CAUSA);
  } else if (tipoRescisao === 'acordo_mutuo') {
    multaFgts = round2(saldoFgts * MULTA_FGTS_ACORDO);
  }

  // --- Descontos ---
  // INSS e IRRF incidem apenas sobre saldo de salário e 13º.
  // Férias (vencidas/proporcionais), aviso indenizado e multa do FGTS são
  // verbas indenizatórias isentas.
  const inssSaldoSalario = calcularInss(saldoSalario);
  const inssDecimoTerceiro = calcularInss(decimoTerceiroProporcional);

  const irrfSaldoSalario = calcularIrrf(
    Math.max(0, saldoSalario - inssSaldoSalario - dependentes * DEDUCAO_DEPENDENTE)
  );
  const irrfDecimoTerceiro = calcularIrrf(
    Math.max(
      0,
      decimoTerceiroProporcional - inssDecimoTerceiro - dependentes * DEDUCAO_DEPENDENTE
    )
  );

  // --- Totais ---
  const totalProventos = round2(
    saldoSalario +
      avisoPrevio +
      decimoTerceiroProporcional +
      feriasVencidas +
      feriasProporcionais +
      multaFgts
  );
  const totalDescontos = round2(
    inssSaldoSalario + inssDecimoTerceiro + irrfSaldoSalario + irrfDecimoTerceiro
  );
  const totalLiquido = round2(totalProventos - totalDescontos);

  return {
    salarioBruto,
    tipoRescisao,
    saldoSalario,
    avisoPrevioDias,
    avisoPrevio,
    decimoTerceiroProporcional,
    feriasVencidas,
    feriasProporcionais,
    multaFgts,
    inssSaldoSalario,
    inssDecimoTerceiro,
    irrfSaldoSalario,
    irrfDecimoTerceiro,
    totalProventos,
    totalDescontos,
    totalLiquido,
  };
}
