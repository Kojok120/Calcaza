import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Aviso legal',
  description: `Aviso legal da ${SITE_NAME} sobre os resultados das calculadoras, o conteúdo, os links externos e a publicidade.`,
  alternates: { canonical: '/disclaimer/' },
};

export default function DisclaimerPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 prose prose-base max-w-none">
      <h1>Aviso legal</h1>

      <h2>Sobre os resultados das calculadoras</h2>
      <p>
        As calculadoras e o conteúdo da <strong>{SITE_NAME}</strong> entregam <strong>estimativas gerais</strong> baseadas em alíquotas públicas e documentos oficiais. Nada neste site é orientação financeira, tributária, contábil, jurídica ou médica personalizada.
      </p>
      <p>
        Revisamos as fórmulas, as faixas e os tetos periodicamente, conforme a Receita Federal, o INSS, a Caixa e os demais órgãos oficiais atualizam suas cifras, mas não podemos garantir que cada número esteja exato o tempo todo. Confira sempre a data "Atualizado" em cada calculadora.
      </p>
      <p>
        A {SITE_NAME} não se responsabiliza por nenhuma decisão ou ação tomada com base no resultado de uma calculadora.
      </p>

      <h2>Temas de impostos, finanças, trabalho e saúde (YMYL)</h2>
      <p>
        Algumas calculadoras tratam de impostos, INSS, FGTS, rescisão, salário, aposentadoria, seguros e métricas de saúde. Elas servem apenas para entender o tema e obter uma estimativa rápida. Para decisões que importam, fale com o profissional adequado: um contador, um advogado trabalhista, um profissional financeiro habilitado, um médico ou o próprio órgão oficial.
      </p>
      <p>
        Em especial, nada neste site constitui a apuração definitiva da sua declaração de imposto de renda, a definição de uma verba rescisória específica, uma recomendação de contratar ou refinanciar um empréstimo, nem orientação médica.
      </p>

      <h2>Links externos</h2>
      <p>
        O site envia para fontes oficiais, órgãos reguladores e serviços relacionados. Não somos responsáveis pelo conteúdo, pela exatidão ou pelas políticas desses sites. Leia sempre os termos e a política de privacidade de cada site externo antes de usá-lo.
      </p>

      <h2>Publicidade e links de afiliado</h2>
      <p>
        O site exibe publicidade por meio do Google AdSense e contém links de afiliado para parceiros comerciais. Os produtos e serviços anunciados são operados por terceiros; o site não é parte da sua compra ou contrato. Confirme preços, condições e detalhes diretamente com o fornecedor antes de decidir. O detalhe está na <a href="/privacy/">política de privacidade</a>.
      </p>

      <h2>Propriedade intelectual</h2>
      <p>
        O texto, as imagens e a implementação das calculadoras deste site são de propriedade da {SITE_NAME} ou de seus titulares originais. A citação razoável com atribuição é bem-vinda. A republicação, cópia ou modificação de material sem consentimento prévio, não.
      </p>

      <h2>Atualizações deste aviso</h2>
      <p>
        Este aviso pode ser atualizado sem aviso prévio. O novo texto entra em vigor quando é publicado nesta página.
      </p>

      <p className="text-sm">
        Emitido: 2026 · Última atualização: 2026
      </p>
    </main>
  );
}
