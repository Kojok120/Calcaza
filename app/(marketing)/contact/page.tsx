import type { Metadata } from 'next';
import { SITE_CONTACT_EMAIL, SITE_NAME } from '@/lib/site';
import { EDITORIAL_DESK } from '@/lib/editorial';

export const metadata: Metadata = {
  title: 'Contato',
  description: `Como falar com a ${SITE_NAME}: o email é o único canal.`,
  alternates: { canonical: '/contact/' },
};

export default function ContactPage() {
  return (
    <main className="mx-auto max-w-3xl px-4 py-8 prose prose-base max-w-none">
      <h1>Contato</h1>

      <p>
        O email é o único canal. Lemos tudo, mas não podemos garantir resposta a cada mensagem.
      </p>

      <h2>Como falar com a gente</h2>
      <ul>
        <li>
          Email:{' '}
          <a href={`mailto:${SITE_CONTACT_EMAIL}`}>{SITE_CONTACT_EMAIL}</a>
        </li>
        <li>Responsável pelo conteúdo: {EDITORIAL_DESK.name}</li>
      </ul>

      <h2>O que recebemos com gosto</h2>
      <ul>
        <li>Dúvidas sobre uma fórmula ou uma fonte, ou uma alíquota incorreta para corrigir.</li>
        <li>Sugestões de uma nova calculadora útil para quem trabalha e empreende no Brasil.</li>
        <li>Pedidos para corrigir ou retirar conteúdo publicado.</li>
        <li>Pedidos de acesso, correção ou exclusão de dados pessoais.</li>
        <li>Contatos de imprensa, parcerias e conteúdo patrocinado.</li>
      </ul>

      <h2>O que não fazemos</h2>
      <p>
        Este site entrega estimativas gerais e não aconselha situações individuais. Para casos específicos, procure o profissional adequado:
      </p>
      <ul>
        <li>Declaração do imposto de renda e planejamento tributário → um contador ou a Receita Federal.</li>
        <li>Rescisão de contrato, horas extras ou disputa trabalhista → um advogado trabalhista ou o sindicato da categoria.</li>
        <li>FGTS, saque ou financiamento imobiliário → a Caixa Econômica Federal.</li>
        <li>Aposentadoria e benefícios → o INSS / Previdência Social.</li>
        <li>Saúde → um médico ou farmacêutico.</li>
        <li>Assuntos jurídicos → um advogado.</li>
        <li>Planejamento financeiro pessoal → um profissional habilitado.</li>
      </ul>

      <h2>Tempo de resposta</h2>
      <p>
        Costumamos responder em poucos dias, embora alguns emails possam demorar mais ou não receber resposta. Se o seu email tiver algo que a gente gostaria de publicar (por exemplo, uma pergunta interessante para a seção de Perguntas frequentes), pediremos sua permissão antes.
      </p>
    </main>
  );
}
