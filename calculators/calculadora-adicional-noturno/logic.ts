// Calculadora de Adicional Noturno 2026 (CLT — trabalhador urbano).
// Calcula o valor BRUTO das horas noturnas com adicional e isola apenas a
// parte do adicional. Aplica, por padrão, a hora noturna reduzida.
//
// Base legal e fontes oficiais:
//   - Trabalho noturno urbano = 22h às 5h; adicional mínimo de 20% sobre a
//     hora diurna; hora noturna computada como 52min30s:
//     Decreto-Lei nº 5.452/1943 (CLT), art. 73 e § 1º — planalto.gov.br
//   - Integração do adicional noturno habitual em outras verbas:
//     Súmulas do TST — tst.jus.br

/** Duração da hora noturna urbana, em minutos (52min30s = 52,5). CLT art. 73, §1º. */
const HORA_NOTURNA_MINUTOS = 52.5;
/** Fator de conversão: cada hora de relógio = 60 / 52,5 horas noturnas. */
const FATOR_HORA_REDUZIDA = 60 / HORA_NOTURNA_MINUTOS; // 1,142857...

export type Input = {
  /** Salário bruto mensal em reais. */
  salarioBruto: number;
  /** Jornada mensal em horas (divisor do salário). Padrão: 220. */
  jornadaMensal?: number;
  /** Horas de relógio trabalhadas no período noturno, no mês. */
  horasNoturnas: number;
  /** Percentual do adicional noturno (%). Mínimo legal 20. Padrão: 20. */
  percentualAdicional?: number;
  /** Aplicar a hora noturna reduzida (52min30s). Padrão: true. */
  aplicarHoraReduzida?: boolean;
};

export type Output = {
  /** Valor de uma hora diurna normal de trabalho. */
  valorHora: number;
  /** Valor de uma hora noturna (hora diurna + adicional). */
  valorHoraNoturna: number;
  /** Horas noturnas equivalentes após a redução (ou as próprias horas de relógio). */
  horasNoturnasEquivalentes: number;
  /** Total das horas noturnas já com o adicional. */
  totalAdicionalNoturno: number;
  /** Apenas a parte do adicional (a diferença em relação à hora diurna). */
  apenasAdicional: number;
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
  valorHora: 0,
  valorHoraNoturna: 0,
  horasNoturnasEquivalentes: 0,
  totalAdicionalNoturno: 0,
  apenasAdicional: 0,
};

export function calculate(input: Input): Output {
  const salarioBruto = sane(input.salarioBruto, 0);
  const jornadaMensal = sane(input.jornadaMensal, 220);
  const horasNoturnas = sane(input.horasNoturnas, 0);
  const percentualAdicional = sane(input.percentualAdicional, 20);
  const aplicarHoraReduzida = input.aplicarHoraReduzida !== false;

  // Jornada precisa ser > 0 para evitar divisão por zero.
  if (salarioBruto <= 0 || jornadaMensal <= 0) {
    return { ...ZERO };
  }

  const valorHora = salarioBruto / jornadaMensal;

  const horasNoturnasEquivalentes = aplicarHoraReduzida
    ? horasNoturnas * FATOR_HORA_REDUZIDA
    : horasNoturnas;

  const valorHoraNoturna = valorHora * (1 + percentualAdicional / 100);

  const totalAdicionalNoturno = valorHoraNoturna * horasNoturnasEquivalentes;
  const apenasAdicional =
    totalAdicionalNoturno - valorHora * horasNoturnasEquivalentes;

  return {
    valorHora: round2(valorHora),
    valorHoraNoturna: round2(valorHoraNoturna),
    horasNoturnasEquivalentes: round2(horasNoturnasEquivalentes),
    totalAdicionalNoturno: round2(totalAdicionalNoturno),
    apenasAdicional: round2(apenasAdicional),
  };
}
