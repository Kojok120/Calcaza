// Calculadora do DAS MEI 2026.
// O DAS (Documento de Arrecadação do Simples Nacional) do MEI é um valor fixo
// mensal, formado pela contribuição ao INSS (percentual sobre o salário mínimo)
// mais ICMS e/ou ISS em valor fixo, conforme a atividade.
//
// Fontes oficiais (2026):
//   - Salário mínimo federal 2026 (R$ 1.621,00):
//     decreto do salário mínimo — gov.br / planalto.gov.br
//   - Regras do MEI no Simples Nacional (INSS 5% do salário mínimo;
//     INSS 12% para o MEI caminhoneiro; ICMS R$ 1,00; ISS R$ 5,00):
//     Portal do Simples Nacional — www8.receita.fazenda.gov.br/SimplesNacional
//     Receita Federal — gov.br/receitafederal
//   - Base legal: Lei Complementar nº 123/2006 — planalto.gov.br

export type TipoAtividade =
  | 'comercio_industria'
  | 'servicos'
  | 'comercio_e_servicos';

export type Input = {
  /** Atividade do MEI. Valor inválido cai em 'comercio_industria'. */
  tipoAtividade: TipoAtividade;
  /** MEI caminhoneiro (transportador autônomo de carga). Padrão: false. */
  caminhoneiro?: boolean;
};

export type TabelaCategoria = {
  /** DAS de quem atua só com comércio ou indústria (INSS + ICMS). */
  comercioIndustria: number;
  /** DAS de quem presta serviços (INSS + ISS). */
  servicos: number;
  /** DAS de quem atua com comércio e serviços (INSS + ICMS + ISS). */
  comercioEServicos: number;
};

export type Output = {
  /** Contribuição ao INSS embutida no DAS (5% ou 12% do salário mínimo). */
  inssBase: number;
  /** Parcela de ICMS (R$ 1,00 fixo) quando há comércio/indústria; senão 0. */
  icms: number;
  /** Parcela de ISS (R$ 5,00 fixo) quando há serviços; senão 0. */
  iss: number;
  /** Valor total do DAS mensal para a atividade escolhida. */
  das: number;
  /** Salário mínimo usado como base do INSS. */
  salarioMinimo: number;
  /** Indica se o cálculo é do MEI caminhoneiro. */
  caminhoneiro: boolean;
  /** Atividade efetivamente considerada (já saneada). */
  tipoAtividade: TipoAtividade;
  /** Tabela com os três valores da categoria (comum ou caminhoneiro). */
  tabelaCompleta: TabelaCategoria;
};

// --- Valores oficiais de 2026 ---
const SALARIO_MINIMO = 1621.0; // salário mínimo federal 2026
const ALIQUOTA_INSS_COMUM = 0.05; // MEI comum: 5% do salário mínimo
const ALIQUOTA_INSS_CAMINHONEIRO = 0.12; // MEI caminhoneiro: 12% do salário mínimo
const ICMS_FIXO = 1.0; // ICMS fixo do MEI (comércio/indústria) — desde 2006
const ISS_FIXO = 5.0; // ISS fixo do MEI (serviços) — desde 2006

const TIPOS_VALIDOS: ReadonlyArray<TipoAtividade> = [
  'comercio_industria',
  'servicos',
  'comercio_e_servicos',
];

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

function sanearTipo(tipo: unknown): TipoAtividade {
  return TIPOS_VALIDOS.includes(tipo as TipoAtividade)
    ? (tipo as TipoAtividade)
    : 'comercio_industria';
}

function temIcms(tipo: TipoAtividade): boolean {
  return tipo === 'comercio_industria' || tipo === 'comercio_e_servicos';
}

function temIss(tipo: TipoAtividade): boolean {
  return tipo === 'servicos' || tipo === 'comercio_e_servicos';
}

export function calculate(input: Input): Output {
  const tipoAtividade = sanearTipo(input?.tipoAtividade);
  const caminhoneiro = input?.caminhoneiro === true;

  const aliquotaInss = caminhoneiro
    ? ALIQUOTA_INSS_CAMINHONEIRO
    : ALIQUOTA_INSS_COMUM;
  const inssBase = round2(SALARIO_MINIMO * aliquotaInss);

  const icms = temIcms(tipoAtividade) ? ICMS_FIXO : 0;
  const iss = temIss(tipoAtividade) ? ISS_FIXO : 0;
  const das = round2(inssBase + icms + iss);

  const tabelaCompleta: TabelaCategoria = {
    comercioIndustria: round2(inssBase + ICMS_FIXO),
    servicos: round2(inssBase + ISS_FIXO),
    comercioEServicos: round2(inssBase + ICMS_FIXO + ISS_FIXO),
  };

  return {
    inssBase,
    icms,
    iss,
    das,
    salarioMinimo: SALARIO_MINIMO,
    caminhoneiro,
    tipoAtividade,
    tabelaCompleta,
  };
}
