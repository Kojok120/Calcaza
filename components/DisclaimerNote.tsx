import { SITE_INTL_LOCALE } from '@/lib/site';
import type { CalculatorCategory } from '@/lib/types';

type Props = {
  category: CalculatorCategory;
  publishedAt: string;
  updatedAt: string;
};

const YMYL_CATEGORIES: CalculatorCategory[] = ['finance', 'tax', 'labor', 'health'];

const YMYL_NOTE: Partial<Record<CalculatorCategory, string>> = {
  finance:
    'Esta calculadora oferece estimativas gerais e não é consultoria financeira. A taxa real, as parcelas e as condições dependem do seu contrato e de cada instituição. Antes de assinar, consulte um especialista (correspondente bancário, advogado ou consultor financeiro).',
  tax: 'Esta calculadora oferece estimativas gerais e não é consultoria tributária. As regras da Receita Federal e as tabelas mudam a cada ano. Antes de declarar ou pagar, confirme sua situação com um contador ou diretamente na Receita Federal.',
  labor:
    'Esta calculadora oferece estimativas gerais com base nas regras vigentes na data indicada no rodapé. Os descontos reais (INSS, IRRF), as horas extras e os benefícios podem variar conforme o empregador, a convenção coletiva e sua situação. Para casos específicos, consulte o RH/departamento pessoal ou um advogado trabalhista.',
  health:
    'Esta calculadora oferece estimativas gerais e não é orientação médica, diagnóstico nem tratamento. Para decisões de saúde, consulte um médico ou farmacêutico.',
};

function fmtDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  try {
    return new Intl.DateTimeFormat(SITE_INTL_LOCALE, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return iso;
  }
}

export function DisclaimerNote({ category, publishedAt, updatedAt }: Props) {
  const isYmyl = YMYL_CATEGORIES.includes(category);
  const ymyl = isYmyl ? YMYL_NOTE[category] : null;

  return (
    <footer className="mt-12 rounded-md border border-border-default bg-surface-1 p-5 text-xs text-ink-3 sm:p-6">
      <p className="tabular">
        Publicado: {fmtDate(publishedAt)} · Atualizado: {fmtDate(updatedAt)}
      </p>
      <p className="mt-1.5 leading-relaxed">
        Os valores exibidos são estimativas baseadas em tabelas e tarifas públicas e podem diferir da sua situação real.
      </p>
      {ymyl && <p className="mt-1.5 leading-relaxed">{ymyl}</p>}
      {isYmyl && (
        <p className="mt-1.5 leading-relaxed">
          A política editorial, os dados do operador e o calendário de atualização das fontes estão descritos na
          <a href="/methodology/" className="underline mx-1">página de metodologia</a>.
        </p>
      )}
    </footer>
  );
}
