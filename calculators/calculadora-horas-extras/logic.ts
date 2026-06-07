// Calculadora de Horas Extras 2026 (CLT).
// Calcula o VALOR BRUTO das horas extras (sem INSS/IRRF), incluindo o
// reflexo opcional no Descanso Semanal Remunerado (DSR).
//
// Base legal e fontes oficiais:
//   - Adicional mínimo de 50% sobre a hora normal:
//     Constituição Federal, art. 7º, XVI — planalto.gov.br
//   - Jornada e remuneração das horas extras (CLT):
//     Decreto-Lei nº 5.452/1943 (CLT), art. 59 — planalto.gov.br
//   - 100% em domingos e feriados não compensados:
//     Súmula 146 do TST — tst.jus.br
//   - Reflexo das horas extras habituais no DSR:
//     Lei nº 605/1949 e Súmula 172 do TST — planalto.gov.br / tst.jus.br

export type Input = {
  /** Salário bruto mensal em reais. */
  salarioBruto: number;
  /** Jornada mensal em horas (divisor do salário). Padrão: 220. */
  jornadaMensal?: number;
  /** Quantidade de horas extras no mês. */
  quantidadeHoras: number;
  /** Percentual de adicional (%). Mínimo legal 50; domingos/feriados 100. Padrão: 50. */
  percentualAdicional?: number;
  /** Incluir o reflexo no DSR. Padrão: false. */
  incluirDSR?: boolean;
  /** Dias úteis no mês (base do DSR). Padrão: 25. */
  diasUteis?: number;
  /** Dias de descanso no mês (domingos + feriados). Padrão: 5. */
  diasDescanso?: number;
};

export type Output = {
  /** Valor de uma hora normal de trabalho. */
  valorHoraNormal: number;
  /** Valor de uma hora extra (hora normal + adicional). */
  valorHoraExtra: number;
  /** Total das horas extras (sem o reflexo no DSR). */
  totalHorasExtras: number;
  /** Reflexo das horas extras no DSR (0 se não incluído). */
  reflexoDSR: number;
  /** Total a receber (horas extras + reflexo no DSR). */
  totalReceber: number;
};

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round((x + Number.EPSILON) * 100) / 100;
}

/** Saneia um número para um valor finito >= 0; usa o padrão se inválido. */
function sane(value: number | undefined, fallback: number): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) return fallback;
  return value < 0 ? 0 : value;
}

const ZERO: Output = {
  valorHoraNormal: 0,
  valorHoraExtra: 0,
  totalHorasExtras: 0,
  reflexoDSR: 0,
  totalReceber: 0,
};

export function calculate(input: Input): Output {
  const salarioBruto = sane(input.salarioBruto, 0);
  // jornadaMensal precisa ser > 0 para evitar divisão por zero.
  const jornadaMensal = sane(input.jornadaMensal, 220);
  const quantidadeHoras = sane(input.quantidadeHoras, 0);
  const percentualAdicional = sane(input.percentualAdicional, 50);
  const incluirDSR = input.incluirDSR === true;
  const diasUteis = sane(input.diasUteis, 25);
  const diasDescanso = sane(input.diasDescanso, 5);

  if (salarioBruto <= 0 || jornadaMensal <= 0) {
    return { ...ZERO };
  }

  const valorHoraNormal = salarioBruto / jornadaMensal;
  const valorHoraExtra = valorHoraNormal * (1 + percentualAdicional / 100);
  const totalHorasExtras = valorHoraExtra * quantidadeHoras;

  // Reflexo no DSR: só com horas extras habituais. Evita divisão por zero.
  let reflexoDSR = 0;
  if (incluirDSR && diasUteis > 0) {
    reflexoDSR = totalHorasExtras * (diasDescanso / diasUteis);
  }

  const totalReceber = totalHorasExtras + reflexoDSR;

  return {
    valorHoraNormal: round2(valorHoraNormal),
    valorHoraExtra: round2(valorHoraExtra),
    totalHorasExtras: round2(totalHorasExtras),
    reflexoDSR: round2(reflexoDSR),
    totalReceber: round2(totalReceber),
  };
}
