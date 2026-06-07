'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const SOLICITACAO_OPTIONS = [
  { value: '1', label: '1ª solicitação' },
  { value: '2', label: '2ª solicitação' },
  { value: '3', label: '3ª solicitação (ou mais)' },
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

export function SeguroDesempregoForm() {
  const [mediaSalarial, setMediaSalarial] = React.useState(3000);
  const [mesesTrabalhados, setMesesTrabalhados] = React.useState(12);
  const [solicitacao, setSolicitacao] = React.useState('1');

  const numeroSolicitacao = Number(solicitacao) as 1 | 2 | 3;
  const r = calculate({ mediaSalarial, mesesTrabalhados, numeroSolicitacao });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="sd-media"
            label="Média dos 3 últimos salários"
            hint="Média aritmética dos salários brutos dos últimos três meses trabalhados."
          >
            <NumberInput
              id="sd-media"
              value={mediaSalarial}
              onChange={setMediaSalarial}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Média dos três últimos salários em reais"
            />
          </Field>

          <Field
            id="sd-meses"
            label="Meses trabalhados"
            hint="Tempo de trabalho com carteira assinada no período que dá direito ao benefício."
          >
            <NumberInput
              id="sd-meses"
              value={mesesTrabalhados}
              onChange={setMesesTrabalhados}
              decimals={0}
              min={0}
              max={600}
              ariaLabel="Meses trabalhados"
            />
          </Field>

          <Field
            id="sd-solicitacao"
            label="Número da solicitação"
            hint="Quantas vezes você já recebeu o seguro-desemprego, contando este pedido."
          >
            <Select
              id="sd-solicitacao"
              value={solicitacao}
              onValueChange={setSolicitacao}
              options={SOLICITACAO_OPTIONS}
              ariaLabel="Número da solicitação do seguro-desemprego"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          {r.elegivel ? (
            <>
              <ResultStat
                label="Valor de cada parcela"
                value={brl.format(r.valorParcela)}
                sub={
                  <>
                    Você teria direito a {r.numeroParcelas} parcelas neste
                    pedido.
                  </>
                }
              />

              <div className="grid gap-3 sm:grid-cols-2">
                <ResultStat
                  label="Número de parcelas"
                  value={String(r.numeroParcelas)}
                  emphasis={false}
                  sub={<>Conforme o tempo trabalhado e a solicitação.</>}
                />
                <ResultStat
                  label="Total estimado"
                  value={brl.format(r.valorTotal)}
                  emphasis={false}
                  sub={
                    <>
                      Soma das {r.numeroParcelas} parcelas de{' '}
                      {brl.format(r.valorParcela)}.
                    </>
                  }
                />
              </div>
            </>
          ) : (
            <ResultStat
              label="Sem direito a parcelas neste pedido"
              value="0 parcelas"
              sub={
                <>
                  Para esta solicitação, o tempo trabalhado informado ainda não
                  atinge o mínimo exigido pelas regras de 2026. Confira os
                  prazos na explicação abaixo.
                </>
              }
            />
          )}

          <p className="text-xs text-ink-3">
            Estimativa com base nas faixas, no piso (R$ 1.621,00) e no teto (R$
            2.518,65) do seguro-desemprego de 2026. Não substitui a análise
            oficial do Ministério do Trabalho e Emprego.
          </p>
        </div>
      }
    />
  );
}
