import { SITE_CONTACT_EMAIL, SITE_NAME, SITE_URL } from './site';

/**
 * Identidade editorial (editorial persona) da Calcaza.
 *
 * Usamos uma identidade editorial coletiva (a redação) em vez do nome de uma
 * pessoa, e atribuímos a ela a redação e a revisão de todo o site. O objetivo é
 * mostrar um processo responsável de edição e verificação (E-E-A-T) em temas
 * sensíveis de dinheiro (impostos, INSS, FGTS, rescisão) sem expor dados
 * pessoais.
 *
 * É usada em:
 *  - lib/jsonld.ts          → author / reviewedBy / knowsAbout
 *  - app/c/[slug]/page.tsx  → linha de autoria (byline)
 *  - app/blog/[slug]        → autor (via autor padrão dos posts)
 *  - app/(marketing)/about  → seção «Equipe editorial»
 */
export const EDITORIAL_DESK = {
  name: `Equipe Editorial da ${SITE_NAME}`,
  shortName: 'a equipe editorial',
  /** Âncora da seção na página «Sobre». */
  path: '/about/#editorial-desk',
  url: `${SITE_URL}/about/#editorial-desk`,
  /** Identificador no @graph do JSON-LD. */
  id: `${SITE_URL}/about/#editorial-desk`,
  email: SITE_CONTACT_EMAIL,
  description:
    'Uma equipe editorial independente que transforma os números oficiais da Receita Federal, do INSS, da Caixa Econômica Federal (FGTS) e da Justiça do Trabalho em calculadoras claras e com fontes citadas para quem trabalha e empreende no Brasil, e as revisa quando mudam as tabelas, as alíquotas e os tetos.',
  /** Áreas de especialização — se volcam em knowsAbout do schema. */
  knowsAbout: [
    'Imposto de Renda da Pessoa Física (IRPF e IRRF)',
    'Contribuição ao INSS',
    'FGTS e multa rescisória',
    'Rescisão de contrato de trabalho (CLT)',
    '13º salário e férias',
    'Salário líquido e descontos na folha',
    'Simples Nacional e MEI',
  ],
  /** Mesas editoriais por área — se mostram na página «Sobre». */
  desks: [
    'Mesa de Imposto de Renda',
    'Mesa de INSS e Previdência',
    'Mesa de FGTS e Rescisão',
    'Mesa de Folha e Salário',
    'Mesa de MEI e Simples Nacional',
  ],
} as const;
