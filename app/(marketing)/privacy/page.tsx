import type { Metadata } from 'next';
import { SITE_NAME } from '@/lib/site';

export const metadata: Metadata = {
  title: 'Privacidade',
  description: `Política de privacidade da ${SITE_NAME}: cookies, análise de tráfego, publicidade e divulgação de afiliados.`,
  alternates: { canonical: '/privacy/' },
};

export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 prose prose-base max-w-none">
      <h1>Política de privacidade</h1>

      <p>
        A <strong>{SITE_NAME}</strong> (o "site") respeita a privacidade dos visitantes e procura seguir a Lei Geral de Proteção de Dados (LGPD ─ Lei nº 13.709/2018) do Brasil e o Marco Civil da Internet, além dos elementos relevantes do Regulamento Geral de Proteção de Dados (GDPR) da União Europeia quando aplicáveis. Esta página explica como os dados do visitante são tratados.
      </p>

      <h2>1. O que coletamos</h2>
      <p>
        Cada calculadora roda inteiramente no seu navegador. Seus dados não são enviados para nenhum servidor e nenhum resultado é guardado.
      </p>
      <p>
        O site pode, sim, coletar os seguintes dados operacionais:
      </p>
      <ul>
        <li>Logs de acesso (endereço IP, tipo de navegador, URL de origem, data e hora da visita).</li>
        <li>Informações coletadas por cookies e tecnologias semelhantes.</li>
        <li>Endereço de email e conteúdo da mensagem quando você nos escreve.</li>
      </ul>

      <h2>2. Como usamos</h2>
      <p>Os dados são usados para as seguintes finalidades:</p>
      <ul>
        <li>Operar o site e melhorar o conteúdo.</li>
        <li>Análise de tráfego de forma agregada.</li>
        <li>Exibir e medir publicidade.</li>
        <li>Responder a contatos.</li>
        <li>Detectar e prevenir abusos.</li>
      </ul>

      <h2>3. Cookies</h2>
      <p>
        O site usa cookies e tecnologias semelhantes para melhorar a experiência e medir o desempenho dos anúncios. Você pode desativar os cookies nas configurações do seu navegador; algumas funções podem deixar de funcionar.
      </p>
      <p>Usos principais de cookies e armazenamento local:</p>
      <ul>
        <li>Lembrar a sua preferência de tema claro/escuro (armazenamento local no seu dispositivo).</li>
        <li>Exibir e medir publicidade (cookies de terceiros do Google AdSense).</li>
      </ul>

      <h2>4. Análise de tráfego (Cloudflare Web Analytics)</h2>
      <p>
        O site usa o <strong>Cloudflare Web Analytics</strong> para medir o tráfego. O serviço prioriza a privacidade, não usa cookies e não coleta informações que identifiquem você pessoalmente. Vemos apenas contagens anônimas agregadas por origem e país.
      </p>
      <p>
        Detalhe:
        <br />
        <a href="https://www.cloudflare.com/privacypolicy/" target="_blank" rel="noopener noreferrer">
          https://www.cloudflare.com/privacypolicy/
        </a>
      </p>

      <h2>5. Publicidade (Google AdSense)</h2>
      <p>
        O site exibe anúncios de terceiros por meio do <strong>Google AdSense</strong>. O Google e seus parceiros podem usar cookies para mostrar anúncios personalizados de acordo com as suas visitas anteriores a este e a outros sites.
      </p>
      <p>Sobre o uso de cookies pelo Google:</p>
      <ul>
        <li>
          Anúncios e privacidade:
          <a href="https://policies.google.com/technologies/ads" target="_blank" rel="noopener noreferrer">
            https://policies.google.com/technologies/ads
          </a>
        </li>
        <li>
          Desativar anúncios personalizados:
          <a href="https://www.google.com/ads/preferences/" target="_blank" rel="noopener noreferrer">
            https://www.google.com/ads/preferences/
          </a>
        </li>
      </ul>
      <p>
        Você pode desativar os anúncios personalizados do Google pelo link acima ou desativar os cookies no seu navegador.
      </p>

      <h2>6. Programas de afiliados</h2>
      <p>
        O site participa de programas de afiliados relacionados às calculadoras (por exemplo, software de contabilidade e gestão de MEI, bancos e fintechs, comparadores e Amazon Associados). Quando você clica em um link de afiliado, o operador desse programa pode colocar um cookie para rastrear a indicação, conforme a política de privacidade dele.
      </p>
      <p>
        Os links de afiliado ficam claramente sinalizados para distingui-los dos links neutros.
      </p>

      <h2>7. Compartilhamento de dados com terceiros</h2>
      <p>
        O site não compartilha dados do visitante com terceiros sem consentimento, salvo quando exigido por lei ou quando for necessário para operar os serviços descritos nas seções 4 a 6.
      </p>

      <h2>8. Hospedagem</h2>
      <p>
        O site é hospedado no <strong>Cloudflare Pages</strong> (Cloudflare Inc., EUA). A Cloudflare pode manter logs de acesso de curto prazo (incluindo o endereço IP) quando você visita o site.
      </p>

      <h2>9. Seus direitos</h2>
      <p>
        Você tem o direito de solicitar acesso, correção ou exclusão dos dados pessoais que tenhamos sobre você, conforme a LGPD e outras leis aplicáveis.
      </p>
      <p>
        Envie solicitações para: <a href="mailto:kojokamo120@gmail.com">kojokamo120@gmail.com</a>
      </p>

      <h2>10. Links externos</h2>
      <p>
        Não somos responsáveis pelo conteúdo ou pelas práticas de privacidade dos sites externos vinculados a partir daqui. Leia cada política separadamente.
      </p>

      <h2>11. Atualizações</h2>
      <p>
        Esta política pode ser atualizada quando a lei ou os serviços mudam. O novo texto entra em vigor quando é publicado nesta página.
      </p>

      <h2>Emitido e última atualização</h2>
      <p>
        Emitido: 2026
        <br />
        Última atualização: 2026
      </p>
    </main>
  );
}
