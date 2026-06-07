'use client';

import * as React from 'react';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type TipoAtividade } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const ATIVIDADE_OPCOES: { value: TipoAtividade; label: string }[] = [
  { value: 'comercio_industria', label: 'Comércio ou indústria' },
  { value: 'servicos', label: 'Prestação de serviços' },
  { value: 'comercio_e_servicos', label: 'Comércio e serviços' },
];

function Field({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: string;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-ink-2">
        {label}
      </label>
      {hint && <p className="mt-0.5 text-xs text-ink-3">{hint}</p>}
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

export function MeiDasForm() {
  const [tipoAtividade, setTipoAtividade] =
    React.useState<TipoAtividade>('comercio_industria');
  const [caminhoneiro, setCaminhoneiro] = React.useState(false);

  const r = calculate({ tipoAtividade, caminhoneiro });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="mei-atividade"
            label="Atividade do MEI"
            hint="O valor fixo muda conforme você atue com comércio/indústria (ICMS), serviços (ISS) ou os dois."
          >
            <Select
              id="mei-atividade"
              value={tipoAtividade}
              onValueChange={(v) => setTipoAtividade(v as TipoAtividade)}
              options={ATIVIDADE_OPCOES}
              ariaLabel="Atividade do MEI"
            />
          </Field>

          <Field
            id="mei-caminhoneiro"
            label="MEI caminhoneiro"
            hint="Transportador autônomo de carga. O INSS passa a ser 12% do salário mínimo, em vez de 5%."
          >
            <label
              htmlFor="mei-caminhoneiro"
              className="flex cursor-pointer items-center gap-3 rounded-md border border-border-default bg-surface-1 px-4 py-3.5 text-base"
            >
              <input
                id="mei-caminhoneiro"
                type="checkbox"
                checked={caminhoneiro}
                onChange={(e) => setCaminhoneiro(e.target.checked)}
                className="h-5 w-5 rounded border-border-default text-brand-500 focus:ring-2 focus:ring-brand-500"
              />
              <span className="text-ink-2">
                Sou MEI caminhoneiro (INSS de 12%)
              </span>
            </label>
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="DAS mensal estimado"
            value={brl.format(r.das)}
            sub={
              <>
                Vencimento no dia 20 de cada mês
                {r.caminhoneiro ? ', como MEI caminhoneiro.' : '.'}
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-3">
            <ResultStat
              label="INSS"
              value={brl.format(r.inssBase)}
              emphasis={false}
              sub={
                <>
                  {r.caminhoneiro ? '12%' : '5%'} do salário mínimo (
                  {brl.format(r.salarioMinimo)}).
                </>
              }
            />
            <ResultStat
              label="ICMS"
              value={brl.format(r.icms)}
              emphasis={false}
              sub={
                r.icms > 0 ? (
                  <>Fixo, para comércio/indústria.</>
                ) : (
                  <>Não incide nesta atividade.</>
                )
              }
            />
            <ResultStat
              label="ISS"
              value={brl.format(r.iss)}
              emphasis={false}
              sub={
                r.iss > 0 ? (
                  <>Fixo, para serviços.</>
                ) : (
                  <>Não incide nesta atividade.</>
                )
              }
            />
          </div>

          <div className="rounded-md border border-border-default bg-surface-1 p-4">
            <p className="text-sm font-medium text-ink-2">
              Tabela {r.caminhoneiro ? 'do MEI caminhoneiro' : 'do MEI'} em 2026
            </p>
            <dl className="mt-2 grid gap-1 text-sm text-ink-2">
              <div className="flex justify-between gap-4">
                <dt>Comércio ou indústria</dt>
                <dd className="tabular font-medium text-ink-1">
                  {brl.format(r.tabelaCompleta.comercioIndustria)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Serviços</dt>
                <dd className="tabular font-medium text-ink-1">
                  {brl.format(r.tabelaCompleta.servicos)}
                </dd>
              </div>
              <div className="flex justify-between gap-4">
                <dt>Comércio e serviços</dt>
                <dd className="tabular font-medium text-ink-1">
                  {brl.format(r.tabelaCompleta.comercioEServicos)}
                </dd>
              </div>
            </dl>
          </div>

          <p className="text-xs text-ink-3">
            Estimativa do DAS fixo mensal do MEI em 2026, com base no salário
            mínimo de {brl.format(r.salarioMinimo)} e nas regras do Simples
            Nacional. O valor não depende do faturamento do mês.
          </p>
        </div>
      }
    />
  );
}
