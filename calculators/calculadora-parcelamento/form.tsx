'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pct = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

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

export function ParcelamentoForm() {
  const [valorAVista, setValorAVista] = React.useState(1000);
  const [valorParcela, setValorParcela] = React.useState(115);
  const [numeroParcelas, setNumeroParcelas] = React.useState(10);

  const r = calculate({ valorAVista, valorParcela, numeroParcelas });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="pcl-avista"
            label="Preço à vista"
            hint="Preço pagando à vista (ou com o desconto à vista)."
          >
            <NumberInput
              id="pcl-avista"
              value={valorAVista}
              onChange={setValorAVista}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Preço à vista em reais"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="pcl-parcela"
              label="Valor da parcela"
              hint="Quanto você paga em cada parcela."
            >
              <NumberInput
                id="pcl-parcela"
                value={valorParcela}
                onChange={setValorParcela}
                prefix="R$"
                decimals={2}
                min={0}
                ariaLabel="Valor de cada parcela em reais"
              />
            </Field>

            <Field id="pcl-num" label="Número de parcelas" hint="De 1 a 48 vezes.">
              <NumberInput
                id="pcl-num"
                value={numeroParcelas}
                onChange={setNumeroParcelas}
                suffix="x"
                decimals={0}
                min={1}
                max={48}
                ariaLabel="Número de parcelas"
              />
            </Field>
          </div>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Total parcelado"
            value={brl.format(r.totalParcelado)}
            sub={
              <>
                Soma de {numeroParcelas}× {brl.format(valorParcela)}.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Juros embutidos"
              value={brl.format(r.jurosEmbutidoReais)}
              emphasis={false}
              sub={
                r.semJuros ? (
                  <>O parcelado não custa mais que o à vista.</>
                ) : (
                  <>Quanto a mais você paga em relação ao à vista.</>
                )
              }
            />
            <ResultStat
              label="Taxa mensal implícita"
              value={r.semJuros ? '0,00% a.m.' : `${pct.format(r.taxaMensalImplicita)}% a.m.`}
              emphasis={false}
              sub={<>Taxa que explica a diferença, ao mês.</>}
            />
          </div>

          <ResultStat
            label="Taxa anual equivalente"
            value={
              r.semJuros ? '0,00% a.a.' : `${pct.format(r.taxaAnualEquivalente)}% a.a.`
            }
            emphasis={false}
            sub={<>Equivalente da taxa mensal ao ano, por capitalização composta.</>}
          />

          <div className="rounded-md border border-border-default bg-surface-2 p-3 text-sm text-ink-2">
            {r.semJuros ? (
              <>
                Pelo que você informou, <strong>parcelar não embute juros</strong>: o
                total das parcelas é igual ou menor que o preço à vista. Nesse caso,
                parcelar tende a ser tão bom quanto (ou melhor que) pagar à vista.
              </>
            ) : (
              <>
                Pelo que você informou, <strong>parcelar embute cerca de{' '}
                {pct.format(r.taxaMensalImplicita)}% ao mês</strong> em relação ao preço
                à vista. Vale a pena comparar essa taxa com quanto o seu dinheiro
                renderia em uma aplicação antes de decidir.
              </>
            )}
          </div>

          <p className="text-xs text-ink-3">
            Esta é uma estimativa para comparação. A taxa implícita explica a diferença
            entre o à vista e o total parcelado e não é a taxa contratual da loja nem o
            Custo Efetivo Total (CET) de um financiamento.
          </p>
        </div>
      }
    />
  );
}
