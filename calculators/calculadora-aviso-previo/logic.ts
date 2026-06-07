// Calculadora de Aviso Prévio 2026 (CLT).
// Regras oficiais:
//   - Aviso prévio proporcional ao tempo de serviço:
//     Lei nº 12.506/2011 — planalto.gov.br
//     (base de 30 dias + 3 dias por ano completo de serviço, teto de 90 dias)
//   - Aviso prévio na CLT (arts. 487 a 491), redução de jornada e
//     aviso indenizado x trabalhado:
//     Decreto-Lei nº 5.452/1943 (CLT) — planalto.gov.br
//   - Entendimento de que o acréscimo proporcional beneficia o empregado
//     (quem pede demissão cumpre 30 dias): TST — tst.jus.br

export type Input = {
  /** Salário bruto mensal em reais. */
  salarioBruto: number;
  /** Anos completos de serviço no mesmo empregador (inteiro >= 0). */
  anosCompletos: number;
  /** Quem dá o aviso: o empregador (demissão sem justa causa) ou o empregado (pedido de demissão). */
  quemAvisa: 'empregador' | 'empregado';
  /** Aviso indenizado (pago e dispensado) ou trabalhado (cumprido em atividade). */
  tipo: 'indenizado' | 'trabalhado';
};

export type Output = {
  /** Dias de aviso prévio devidos. */
  diasAviso: number;
  /** Acréscimo proporcional em dias além dos 30 dias-base (diasAviso − 30). */
  acrescimoDias: number;
  /** Valor de um dia de salário (salarioBruto / 30). */
  salarioDia: number;
  /** Valor do aviso prévio (salarioDia × diasAviso). */
  valorAviso: number;
};

// --- Regras da Lei nº 12.506/2011 ---
const DIAS_BASE = 30; // base mínima de 30 dias
const DIAS_POR_ANO = 3; // acréscimo de 3 dias por ano completo de serviço
const DIAS_TETO = 90; // teto total do aviso prévio
const DIAS_NO_MES = 30; // divisor convencional para o salário-dia

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

export function calculate(input: Input): Output {
  // Saneamento das entradas.
  const salarioBruto =
    Number.isFinite(input.salarioBruto) && input.salarioBruto > 0
      ? input.salarioBruto
      : 0;

  const anosCompletos = Number.isFinite(input.anosCompletos)
    ? Math.max(0, Math.floor(input.anosCompletos))
    : 0;

  const quemAvisa: Input['quemAvisa'] =
    input.quemAvisa === 'empregado' ? 'empregado' : 'empregador';

  // Regra dos dias:
  //   - empregador demite -> aviso proporcional: 30 + 3 × anos completos, limitado a 90.
  //   - empregado pede demissão -> 30 dias fixos (o proporcional é benefício do empregado).
  let diasAviso: number;
  if (quemAvisa === 'empregador') {
    diasAviso = Math.min(DIAS_TETO, DIAS_BASE + DIAS_POR_ANO * anosCompletos);
  } else {
    diasAviso = DIAS_BASE;
  }

  const acrescimoDias = diasAviso - DIAS_BASE;
  const salarioDia = salarioBruto > 0 ? round2(salarioBruto / DIAS_NO_MES) : 0;

  // O valor cheio (salário-dia × dias) vale para o aviso indenizado e também
  // representa o salário do período no aviso trabalhado.
  const valorAviso = salarioBruto > 0 ? round2((salarioBruto / DIAS_NO_MES) * diasAviso) : 0;

  return {
    diasAviso,
    acrescimoDias,
    salarioDia,
    valorAviso,
  };
}
