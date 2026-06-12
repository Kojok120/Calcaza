// Calculadora de Salário-Maternidade 2026 — valor mensal e total dos 120 dias.
//
// Regras e valores oficiais de 2026:
//   - Duração padrão do salário-maternidade: 120 dias (≈ 4 meses).
//     Pode iniciar até 28 dias antes do parto.
//     INSS — gov.br/inss/pt-br/saiba-mais/auxilios/salario-maternidade
//     Lei 8.213/91, art. 71; Decreto 3.048/99.
//   - Segurada empregada (CLT / carteira assinada): valor = remuneração
//     mensal integral. É pago pela empresa, que é ressarcida pelo INSS.
//     Não sofre o teto do INSS quando pago como salário integral pela empresa.
//     Lei 8.213/91, art. 72.
//   - Contribuinte individual / facultativa: valor = média dos 12 últimos
//     salários de contribuição, limitado ao piso (salário mínimo) e ao teto
//     do INSS. Lei 8.213/91, art. 73, III.
//   - Salário mínimo 2026 (piso): R$ 1.621,00 — Decreto 12.797/2025.
//   - Teto do salário de contribuição 2026: R$ 8.475,55 — INSS / Previdência.

export type TipoSegurada = 'empregada_clt' | 'contribuinte_individual';

export type Input = {
  /** Tipo de segurada perante o INSS. */
  tipoSegurada: TipoSegurada;
  /** Remuneração mensal integral (R$) — usada para a empregada CLT. */
  salarioMensal?: number;
  /** Média dos 12 últimos salários de contribuição (R$) — usada para a CI/facultativa. */
  mediaUltimos12?: number;
};

export type Output = {
  /** Valor mensal do salário-maternidade (R$). */
  valorMensal: number;
  /** Valor total dos 120 dias (R$) = valorMensal × 4. */
  valorTotal: number;
  /** Valor da diária (R$) = valorMensal / 30. */
  diaria: number;
  /** Indica se o teto do INSS foi aplicado (somente CI/facultativa). */
  tetoAplicado: boolean;
  /** Indica se o piso (salário mínimo) foi aplicado. */
  pisoAplicado: boolean;
};

// --- Valores oficiais 2026 ---
const SALARIO_MINIMO = 1621.0; // piso do salário-maternidade 2026 (Decreto 12.797/2025)
const INSS_TETO = 8475.55; // teto do salário de contribuição 2026 (gov.br/inss)
const DURACAO_MESES = 4; // 120 dias / 30 = 4 meses

function round2(x: number): number {
  // Arredondamento para centavos (half up).
  return Math.round(x * 100) / 100;
}

function sanitize(x: number | undefined): number {
  return Number.isFinite(x) && (x as number) > 0 ? (x as number) : 0;
}

function clamp(n: number, min: number, max: number): number {
  return Math.min(Math.max(n, min), max);
}

export function calculate(input: Input): Output {
  const tipo = input?.tipoSegurada;

  if (tipo === 'empregada_clt') {
    // Salário integral pago pela empresa, sem teto do INSS.
    const salario = sanitize(input?.salarioMensal);
    if (salario === 0) {
      return {
        valorMensal: 0,
        valorTotal: 0,
        diaria: 0,
        tetoAplicado: false,
        pisoAplicado: false,
      };
    }
    const valorMensal = round2(Math.max(salario, SALARIO_MINIMO));
    return {
      valorMensal,
      valorTotal: round2(valorMensal * DURACAO_MESES),
      diaria: round2(valorMensal / 30),
      tetoAplicado: false,
      // O piso garante ao menos 1 salário mínimo para a empregada.
      pisoAplicado: salario < SALARIO_MINIMO,
    };
  }

  if (tipo === 'contribuinte_individual') {
    // Média dos 12 últimos salários de contribuição, limitada ao piso e ao teto.
    const media = sanitize(input?.mediaUltimos12);
    if (media === 0) {
      return {
        valorMensal: 0,
        valorTotal: 0,
        diaria: 0,
        tetoAplicado: false,
        pisoAplicado: false,
      };
    }
    const valorMensal = round2(clamp(media, SALARIO_MINIMO, INSS_TETO));
    return {
      valorMensal,
      valorTotal: round2(valorMensal * DURACAO_MESES),
      diaria: round2(valorMensal / 30),
      tetoAplicado: media > INSS_TETO,
      pisoAplicado: media < SALARIO_MINIMO,
    };
  }

  // Tipo desconhecido / ausente: retorna tudo zero.
  return {
    valorMensal: 0,
    valorTotal: 0,
    diaria: 0,
    tetoAplicado: false,
    pisoAplicado: false,
  };
}
