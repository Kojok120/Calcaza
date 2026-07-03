import type { CalculatorMeta } from '@/lib/types';

export const meta: CalculatorMeta = {
  slug: 'calculadora-remessa-internacional',
  title: 'Calculadora de Remessa Internacional (IOF)',
  description:
    'Estime o custo real de enviar dinheiro ao exterior: veja como a cotação, o spread, as tarifas e o IOF formam o Valor Efetivo Total (VET) e compare opções.',
  primaryKw: 'calculadora remessa internacional',
  relatedKws: [
    'custo transferência internacional',
    'IOF remessa exterior',
    'enviar dinheiro para o exterior taxa',
    'VET remessa internacional',
    'quanto custa transferência internacional',
  ],
  category: 'finance',
  applicationCategory: 'FinanceApplication',
  publishedAt: '2026-07-03',
  updatedAt: '2026-07-03',
  reviewedAt: '2026-07-03',
  faqs: [
    {
      q: 'O que é o VET (Valor Efetivo Total) de uma remessa?',
      a: 'O VET é o custo total de uma operação de câmbio somando tudo: a cotação usada, o spread do provedor, as tarifas e o IOF. Ele existe justamente para você comparar opções em uma medida única, sem se enganar com uma cotação "boa" que esconde tarifas altas. O Banco Central trata a transparência do custo do câmbio como informação que deve ser divulgada ao cliente. Nesta página, o VET é montado a partir dos números que você informa, para mostrar o custo aproximado de ponta a ponta.',
    },
    {
      q: 'Quais custos entram em uma transferência para o exterior?',
      a: 'Em geral, quatro itens: a cotação de referência (a base do câmbio), o spread (a diferença entre a cotação comercial e a cotação que o provedor te oferece), a tarifa fixa da operação e o IOF sobre o câmbio. O spread costuma ser o item menos visível e, muitas vezes, o mais pesado — um provedor pode anunciar "sem tarifa" e mesmo assim sair mais caro por causa de uma cotação pior. Por isso a calculadora separa cada componente em vez de mostrar só um total.',
    },
    {
      q: 'Como o IOF incide em remessas internacionais?',
      a: 'O IOF é um imposto federal que incide sobre operações de câmbio, e a alíquota depende do tipo de operação e de quem envia e recebe (por exemplo, transferência entre contas de mesma titularidade pode ter tratamento diferente de uma remessa a terceiros). A alíquota é definida por decreto e muda com frequência, então não existe um número fixo válido para sempre. Por isso a calculadora pede que você informe a alíquota vigente — confira o percentual atual na Receita Federal antes de calcular.',
    },
    {
      q: 'Esta calculadora usa a cotação do dólar em tempo real?',
      a: 'Não, e isso é proposital. Ela não é um conversor de moedas e não busca cotação ao vivo. Você informa a cotação comercial de referência e a cotação que o provedor está oferecendo, e a ferramenta calcula o spread e o custo efetivo a partir desses valores. Assim o foco fica em entender e comparar o custo de cada opção, e não em acertar o câmbio do minuto — que qualquer site de cotação já mostra.',
    },
    {
      q: 'O valor que envio é o mesmo que a pessoa recebe?',
      a: 'Não. Quem envia parte de um valor em reais; quem recebe fica com o equivalente em moeda estrangeira depois de descontados o spread, as tarifas e o IOF. Por isso a calculadora mostra dois lados: quanto sai da sua conta em R$ e quanto chega ao destino na moeda estrangeira. Comparar esses dois números ajuda a enxergar o custo real que ficou pelo caminho, além de deixar claro por que "valor enviado" e "valor recebido" quase nunca são iguais.',
    },
    {
      q: 'Vale a pena comparar banco, fintech e corretora de câmbio?',
      a: 'Geralmente sim. O custo de enviar dinheiro para fora pode variar bastante entre um banco tradicional e provedores com spread menor, e a diferença aparece mais no spread do que na tarifa anunciada. A calculadora ajuda a colocar cada opção na mesma régua do custo efetivo, informando as cotações e taxas de cada uma. A escolha final depende de prazo, segurança e limites de cada provedor — a ferramenta oferece uma estimativa comparativa, não uma recomendação de instituição.',
    },
  ],
  affiliates: ['remittance'],
};
