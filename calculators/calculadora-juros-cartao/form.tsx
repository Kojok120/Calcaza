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
  style: 'percent',
  minimumFractionDigits: 0,
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

export function JurosCartaoForm() {
  const [saldoDevedor, setSaldoDevedor] = React.useState(2000);
  const [taxaJurosMensal, setTaxaJurosMensal] = React.useState(14);
  const [meses, setMeses] = React.useState(1);

  const r = calculate({ saldoDevedor, taxaJurosMensal, meses });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="jcc-saldo"
            label="Saldo devedor"
            hint="Parte da fatura que ficou sem pagar e caiu no rotativo."
          >
            <NumberInput
              id="jcc-saldo"
              value={saldoDevedor}
              onChange={setSaldoDevedor}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Saldo devedor em reais"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="jcc-taxa"
              label="Taxa de juros ao mês"
              hint="Confira na sua fatura. 14% é só uma referência."
            >
              <NumberInput
                id="jcc-taxa"
                value={taxaJurosMensal}
                onChange={setTaxaJurosMensal}
                suffix="% a.m."
                decimals={2}
                min={0}
                ariaLabel="Taxa de juros mensal em porcentagem"
              />
            </Field>

            <Field
              id="jcc-meses"
              label="Meses no rotativo"
              hint="Por quantos meses a dívida ficou rolando (1 a 24)."
            >
              <NumberInput
                id="jcc-meses"
                value={meses}
                onChange={setMeses}
                suffix="meses"
                decimals={0}
                min={1}
                max={24}
                ariaLabel="Número de meses no rotativo"
              />
            </Field>
          </div>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Dívida total estimada"
            value={brl.format(r.montanteFinal)}
            sub={<>Saldo devedor mais os juros após {r.meses} {r.meses === 1 ? 'mês' : 'meses'} no rotativo.</>}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Total em juros"
              value={brl.format(r.jurosTotal)}
              emphasis={false}
              sub={<>Quanto você pagaria só de juros, além do saldo original.</>}
            />
            <ResultStat
              label="Juros do 1º mês"
              value={brl.format(r.jurosPrimeiroMes)}
              emphasis={false}
              sub={<>Juros gerados logo no primeiro mês de atraso.</>}
            />
          </div>

          <ResultStat
            label="Taxa anual equivalente"
            value={pct.format(r.taxaAnualEquivalente)}
            emphasis={false}
            sub={<>É a taxa mensal acumulada em 12 meses, que mostra como o rotativo explode.</>}
          />

          <p className="text-xs text-ink-3">
            Estimativa de juros compostos sobre o saldo informado. Não inclui IOF,
            multa por atraso nem juros de mora, que variam conforme o banco e o
            contrato. Confira os valores exatos na sua fatura.
          </p>
        </div>
      }
    />
  );
}
