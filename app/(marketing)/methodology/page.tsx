import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Metodologia',
  description: `Metodologia editorial da ${SITE_NAME}: como verificamos as cifras oficiais, a lista de fontes aceitas, a cadência de atualização, a postura YMYL e a política de correções.`,
  alternates: { canonical: '/methodology/' },
};

export default function MethodologyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 prose prose-base max-w-none">
      <h1>Metodologia</h1>
      <p>
        Esta página descreve como as calculadoras e os guias da{' '}
        <strong>{SITE_NAME}</strong> são construídos e mantidos. O objetivo é
        que qualquer leitor consiga auditar nossas decisões editoriais e
        reproduzir os cálculos contra a fonte oficial.
      </p>

      <h2>1. Como verificamos as cifras</h2>
      <p>
        Cada cifra do site (as faixas e alíquotas da tabela do INSS, o teto do
        INSS, as faixas do IRRF, o percentual e a multa do FGTS, a base de cada
        verba rescisória, etc.) é tirada diretamente da publicação oficial em{' '}
        <code>gov.br</code> ─ Receita Federal, INSS / Previdência Social, Caixa
        Econômica Federal (FGTS), Ministério do Trabalho e Emprego ou TST ─ e é
        citada na própria página da calculadora ou do guia. As fórmulas vivem em
        funções puras de TypeScript, sem estado nem rede, e cada cálculo é
        coberto por testes unitários automatizados. Não publicamos uma
        calculadora cujos testes não batam com o exemplo oficial.
      </p>

      <h2>2. Lista de fontes aceitas</h2>
      <p>
        Só aceitamos como fonte primária os domínios oficiais{' '}
        <code>gov.br</code> do Brasil: a Receita Federal para o imposto de renda
        (IRPF / IRRF) e o Simples Nacional, o INSS / Previdência Social para a
        contribuição previdenciária e o teto, a Caixa Econômica Federal para o
        FGTS, o Ministério do Trabalho e Emprego para o salário mínimo e a CLT, e
        o TST / Justiça do Trabalho para as verbas rescisórias. Recusamos como
        fonte primária todo blog, página de banco, site de comparação ou portal
        de software contábil: eles só são citados a título de contexto e nunca
        para substituir uma cifra oficial. Também não usamos os números de
        Portugal (a Autoridade Tributária portuguesa), porque a {SITE_NAME} cobre
        o sistema brasileiro.
      </p>

      <h2>3. Cadência de atualização</h2>
      <p>
        As calculadoras são revisadas sempre que muda a referência oficial. Os
        principais gatilhos: a tabela do INSS e o salário mínimo (janeiro), as
        regras do IRPF / IRRF (publicadas pela Receita em geral entre fevereiro e
        março), o teto do INSS (janeiro), a taxa Selic (definida pelo COPOM) e os
        índices INPC / IPCA (mensais, divulgados pelo IBGE), além de leis que
        alterem alíquotas ou faixas. Além disso, no primeiro dia de cada mês roda
        uma verificação automática que compara de novo cada calculadora contra a
        fonte oficial e abre uma pull request se detectar alguma divergência.
      </p>

      <h2>4. Postura YMYL</h2>
      <p>
        As calculadoras e os guias sobre impostos, INSS, FGTS, rescisão,
        aposentadoria, saúde e crédito caem na categoria{' '}
        <em>Your Money or Your Life</em> do Google. A {SITE_NAME} entrega apenas
        informação geral e estimativas; não é orientação tributária, contábil,
        financeira, médica nem jurídica para um caso individual. Para entregar a
        declaração do imposto de renda, planejar uma aposentadoria ou resolver
        uma disputa de rescisão, recomendamos consultar um contador, um advogado
        trabalhista, um profissional habilitado ou o próprio órgão oficial.
      </p>

      <h2>5. Política de correções</h2>
      <p>
        Se você encontrar uma cifra desatualizada, uma fórmula errada ou um
        exemplo que não bate com a fonte oficial, escreva para a página de
        contato. Tratamos cada relato como prioritário: a equipe editorial
        revisa, valida contra a fonte e publica a correção em até 48 horas,
        atualizando a data “Atualizado” e, quando aplicável, a data “Última
        verificação” da página afetada. Quando a correção muda um resultado de
        cálculo, também ajustamos os testes unitários para evitar a regressão.
      </p>
    </main>
  );
}
