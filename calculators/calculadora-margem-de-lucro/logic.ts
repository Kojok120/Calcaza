// Calculadora de Margem de Lucro.
// Cálculo puramente matemático (sem dados externos, tabelas oficiais ou impostos
// específicos). Voltada para MEI e pequenos negócios, com foco em separar dois
// conceitos que costumam ser confundidos:
//
//   - MARKUP  -> percentual aplicado SOBRE O CUSTO.
//   - MARGEM  -> percentual calculado SOBRE O PREÇO DE VENDA.
//
// Por isso markup de 100% NÃO é o mesmo que margem de 100%: no markup você dobra
// o custo (custo 50 -> preço 100, margem real de 50%); margem de 100% seria
// matematicamente impossível (preço com lucro = 100% da venda e custo = 0).
//
// Fórmulas do preço de venda:
//   modo 'markup':  precoVenda = custo × (1 + percentual/100)
//   modo 'margem':  precoVenda = custo / (1 − (percentual + despesasVariaveis)/100)
//     (no modo margem, o preço é montado para que, depois de pagar o custo e as
//      despesas variáveis, sobre exatamente a margem desejada sobre a venda.)
//     Se (percentual + despesasVariaveis) ≥ 100 -> inválido (denominador ≤ 0).
//
// despesasVariaveis = percentual sobre a venda (impostos do Simples/DAS, comissão,
// taxa de cartão etc.). Para AMBOS os modos, os indicadores reais são:
//   despesaVariavelValor = precoVenda × despesasVariaveis/100
//   lucro                = precoVenda − custo − despesaVariavelValor
//   margemSobreVenda     = lucro / precoVenda × 100
//   markupSobreCusto     = lucro / custo × 100
//
// Não considera custos FIXOS (aluguel, salários) — não é um ponto de equilíbrio.

export type Modo = 'markup' | 'margem';

export type Input = {
  /** Custo unitário do produto/serviço (R$). Negativo/NaN -> 0. */
  custo: number;
  /** Como o percentual deve ser interpretado. Padrão: 'margem'. */
  modo?: Modo;
  /** Percentual de markup (sobre o custo) ou de margem (sobre a venda), em %. */
  percentual: number;
  /** Despesas variáveis como % sobre a venda (impostos/comissão/cartão). Padrão: 0. */
  despesasVariaveis?: number;
};

export type Output = {
  /** Preço de venda sugerido (R$), 2 casas. 0 quando inválido. */
  precoVenda: number;
  /** Lucro líquido após custo e despesas variáveis (R$), 2 casas. */
  lucro: number;
  /** Margem real sobre a venda (%), 2 casas. */
  margemSobreVenda: number;
  /** Markup real sobre o custo (%), 2 casas. */
  markupSobreCusto: number;
  /** Valor das despesas variáveis (R$), 2 casas. */
  despesaVariavelValor: number;
  /** true quando o cálculo no modo margem é impossível (soma de % ≥ 100). */
  invalido: boolean;
};

function round2(x: number): number {
  if (!Number.isFinite(x)) return 0;
  return Math.round(x * 100) / 100;
}

/** Saneia um número não-negativo: NaN/Infinity/negativo -> 0. */
function naoNegativo(x: number | undefined): number {
  if (typeof x !== 'number' || !Number.isFinite(x) || x < 0) return 0;
  return x;
}

function resultadoVazio(invalido: boolean): Output {
  return {
    precoVenda: 0,
    lucro: 0,
    margemSobreVenda: 0,
    markupSobreCusto: 0,
    despesaVariavelValor: 0,
    invalido,
  };
}

export function calculate(input: Input): Output {
  const custo = naoNegativo(input.custo);
  const modo: Modo = input.modo === 'markup' ? 'markup' : 'margem';
  const percentual = naoNegativo(input.percentual);
  const despesasVariaveis = naoNegativo(input.despesasVariaveis);

  let precoVenda: number;

  if (modo === 'markup') {
    // Preço sobre o custo. As despesas variáveis não entram no preço aqui,
    // mas são descontadas do lucro real mais abaixo.
    precoVenda = custo * (1 + percentual / 100);
  } else {
    // Modo margem: o denominador precisa ser positivo.
    const somaPct = percentual + despesasVariaveis;
    if (somaPct >= 100) {
      return resultadoVazio(true);
    }
    precoVenda = custo / (1 - somaPct / 100);
  }

  if (!Number.isFinite(precoVenda) || precoVenda < 0) {
    return resultadoVazio(true);
  }

  const despesaVariavelValor = precoVenda * (despesasVariaveis / 100);
  const lucro = precoVenda - custo - despesaVariavelValor;

  const margemSobreVenda = precoVenda > 0 ? (lucro / precoVenda) * 100 : 0;
  const markupSobreCusto = custo > 0 ? (lucro / custo) * 100 : 0;

  return {
    precoVenda: round2(precoVenda),
    lucro: round2(lucro),
    margemSobreVenda: round2(margemSobreVenda),
    markupSobreCusto: round2(markupSobreCusto),
    despesaVariavelValor: round2(despesaVariavelValor),
    invalido: false,
  };
}
