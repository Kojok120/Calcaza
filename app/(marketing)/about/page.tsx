import type { Metadata } from 'next';
import { SITE_CONTACT_EMAIL, SITE_NAME, SITE_URL } from '@/lib/site';
import { EDITORIAL_DESK } from '@/lib/editorial';

export const metadata: Metadata = {
  title: 'Sobre',
  description: `Sobre a ${SITE_NAME}: política editorial, quem opera o site e como falar com a gente.`,
  alternates: { canonical: '/about/' },
};

export default function AboutPage() {
  const host = new URL(SITE_URL).host;
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 prose prose-base max-w-none">
      <h1>Sobre</h1>

      <h2>O que é este site</h2>
      <p>
        A <strong>{SITE_NAME}</strong> (<code>{host}</code>) é um projeto independente que publica calculadoras em português para as contas de dinheiro e de trabalho do dia a dia no Brasil: salário líquido, desconto do INSS, IRRF (imposto de renda na fonte), FGTS, rescisão de contrato CLT, 13º salário, férias, horas extras e MEI / Simples Nacional, tudo em reais (R$).
      </p>
      <p>
        O foco está naquele detalhe que as ferramentas oficiais e os grandes sites genéricos costumam deixar de fora ou explicar de um jeito difícil de ler ─ as faixas e alíquotas da tabela do INSS, as faixas do IRRF, o teto do INSS, o cálculo da multa de 40% do FGTS, a base de cálculo de cada verba rescisória ─ com a fonte oficial citada em cada página.
      </p>
      <p>
        Cada calculadora roda inteiramente no seu navegador. Seus dados não são enviados para nenhum servidor.
      </p>

      <h2>Por que este site existe</h2>
      <p>
        Quem quer conferir uma conta de dinheiro no Brasil ─ {'"'}quanto vou receber líquido{'"'}, {'"'}quanto é a multa do FGTS{'"'}, {'"'}quanto cai no 13º{'"'} ─ normalmente esbarra em duas opções ruins: as ferramentas oficiais (Receita Federal, INSS, Caixa Econômica Federal), que são corretas mas costumam ser difíceis de ler, ou sites de calculadora genéricos, que dão um número sem mostrar de onde ele veio.
      </p>
      <p>
        A {SITE_NAME} preenche essa lacuna: cada valor vem de uma fonte oficial do governo ─ Receita Federal, INSS / Previdência Social, Caixa Econômica Federal (FGTS), Ministério do Trabalho e Emprego, TST / Justiça do Trabalho ─ e essa fonte fica citada na própria página, explicada em português claro. O alvo é o Brasil: não usamos os números de Portugal (a Autoridade Tributária portuguesa) nem de outros países de língua portuguesa, porque as regras e a moeda são diferentes.
      </p>
      <p>
        O que cobrimos são os números: quanto fica de salário líquido depois do INSS e do IRRF, quanto rende o FGTS e quanto é a multa rescisória, quanto cai no 13º salário e nas férias, como ficam as horas extras e quanto um MEI paga de DAS por mês. A {SITE_NAME} não dá orientação tributária, contábil ou jurídica para o seu caso específico: para entregar a declaração do imposto de renda, resolver uma disputa de rescisão ou planejar a aposentadoria, procure um contador, um advogado trabalhista ou o próprio órgão oficial.
      </p>

      <h2>Como as cifras são verificadas</h2>
      <p>
        Cada calculadora é montada com valores tirados diretamente de fontes oficiais em <code>gov.br</code>: a tabela do IRRF e as regras do imposto de renda publicadas pela Receita Federal, a tabela de contribuição e o teto do INSS divulgados pela Previdência Social, as regras do FGTS da Caixa Econômica Federal, o salário mínimo e as normas da CLT do Ministério do Trabalho e Emprego, e as verbas rescisórias conforme a Justiça do Trabalho (TST). Cada página cita a fonte ao final. O detalhe do processo editorial está na <a href="/methodology/">página de Metodologia</a>.
      </p>
      <p>
        As cifras são revisadas sempre que mudam as referências oficiais: a tabela do INSS e o salário mínimo em janeiro, as regras do IRRF / IRPF quando a Receita publica os ajustes (em geral entre fevereiro e março), o teto do INSS em janeiro. Quando muda algo importante no meio do ano (uma nova lei ou uma atualização de tabela), a data {'"'}Atualizado{'"'} da calculadora afetada é alterada e a seção correspondente é reescrita. Nunca atualizamos os números brasileiros com dados de Portugal (Autoridade Tributária), porque o sistema e a moeda são diferentes.
      </p>

      <h2 id="editorial-desk">A equipe editorial</h2>
      <p>
        A redação e a revisão do site são atribuídas à{' '}
        <strong>{EDITORIAL_DESK.name}</strong>: uma identidade editorial coletiva
        que usamos no lugar do nome de uma pessoa, para que cada calculadora e
        guia passe pelo mesmo processo de edição e verificação. {EDITORIAL_DESK.description}
      </p>
      <p>O trabalho é organizado em mesas por área, cada uma acompanhando suas fontes oficiais:</p>
      <ul>
        {EDITORIAL_DESK.desks.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <p>
        Cada página de calculadora leva a linha «Redação e revisão:{' '}
        {EDITORIAL_DESK.name}» junto com as datas de atualização e de última
        verificação. Para relatar um erro ou pedir uma correção, escreva para{' '}
        <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>.
      </p>

      <h2>Quem opera o site</h2>
      <ul>
        <li>Responsável pelo conteúdo: {EDITORIAL_DESK.name}</li>
        <li>Email: <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a></li>
        <li>Lançamento: 2026</li>
      </ul>

      <h2>Política editorial</h2>
      <ul>
        <li>As fórmulas são construídas a partir de fontes oficiais: Receita Federal (tabela do IRRF, regras do IRPF), INSS / Previdência Social (tabela de contribuição e teto), Caixa Econômica Federal (FGTS), Ministério do Trabalho e Emprego (salário mínimo e CLT) e TST / Justiça do Trabalho (verbas rescisórias). A fonte é citada ao final de cada página.</li>
        <li>Cada cálculo é coberto por testes unitários automatizados. Nenhuma calculadora é publicada sem que os testes passem.</li>
        <li>Para temas Your Money Your Life (impostos, FGTS, rescisão, aposentadoria, saúde), o site entrega apenas estimativas gerais e remete a pessoa a um contador, advogado trabalhista, profissional habilitado ou ao órgão oficial antes de agir.</li>
        <li>As tabelas e os tetos são conferidos contra a fonte oficial quando há reajuste (em geral em janeiro, e entre fevereiro e março no caso do IRPF), e a data "Atualizado" é alterada em seguida.</li>
        <li>Os links que são publicidade ou de afiliado ficam claramente sinalizados.</li>
      </ul>

      <h2>Como o site se financia</h2>
      <p>
        O site se financia com o Google AdSense e com programas de afiliados relacionados à calculadora de cada página (software de contabilidade e gestão de MEI, bancos e fintechs, comparadores). O detalhe está na <a href="/privacy/">política de privacidade</a>.
      </p>

      <h2>Contato</h2>
      <p>
        Para sugerir uma nova calculadora ou relatar uma alíquota ou fórmula incorreta, use a <a href="/contact/">página de contato</a>.
      </p>
    </main>
  );
}
