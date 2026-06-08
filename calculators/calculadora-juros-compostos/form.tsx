'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type TipoTaxa, type TipoPeriodo } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pct = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const TAXA_OPTIONS = [
  { value: 'mensal', label: 'Mensal (a.m.)' },
  { value: 'anual', label: 'Anual (a.a.)' },
];

const PERIODO_OPTIONS = [
  { value: 'meses', label: 'Meses' },
  { value: 'anos', label: 'Anos' },
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

export function JurosCompostosForm() {
  const [valorInicial, setValorInicial] = React.useState(1000);
  const [aporteMensal, setAporteMensal] = React.useState(200);
  const [taxaJuros, setTaxaJuros] = React.useState(1);
  const [periodo, setPeriodo] = React.useState(12);
  const [tipoTaxa, setTipoTaxa] = React.useState<TipoTaxa>('mensal');
  const [tipoPeriodo, setTipoPeriodo] = React.useState<TipoPeriodo>('meses');

  const r = calculate({
    valorInicial,
    aporteMensal,
    taxaJuros,
    periodo,
    tipoTaxa,
    tipoPeriodo,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="jc-inicial"
            label="Valor inicial"
            hint="Quanto você já tem aplicado hoje. Pode ser zero."
          >
            <NumberInput
              id="jc-inicial"
              value={valorInicial}
              onChange={setValorInicial}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Valor inicial em reais"
            />
          </Field>

          <Field
            id="jc-aporte"
            label="Aporte mensal"
            hint="Quanto você pretende depositar todo mês. Pode ser zero."
          >
            <NumberInput
              id="jc-aporte"
              value={aporteMensal}
              onChange={setAporteMensal}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Aporte mensal em reais"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="jc-taxa" label="Taxa de juros">
              <NumberInput
                id="jc-taxa"
                value={taxaJuros}
                onChange={setTaxaJuros}
                suffix="%"
                decimals={4}
                min={0}
                ariaLabel="Taxa de juros em porcentagem"
              />
            </Field>

            <Field id="jc-tipo-taxa" label="Período da taxa">
              <Select
                id="jc-tipo-taxa"
                value={tipoTaxa}
                onValueChange={(v) => setTipoTaxa(v as TipoTaxa)}
                options={TAXA_OPTIONS}
                ariaLabel="A taxa é mensal ou anual"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="jc-periodo" label="Prazo">
              <NumberInput
                id="jc-periodo"
                value={periodo}
                onChange={setPeriodo}
                decimals={0}
                min={0}
                ariaLabel="Número de períodos"
              />
            </Field>

            <Field id="jc-tipo-periodo" label="Unidade do prazo">
              <Select
                id="jc-tipo-periodo"
                value={tipoPeriodo}
                onValueChange={(v) => setTipoPeriodo(v as TipoPeriodo)}
                options={PERIODO_OPTIONS}
                ariaLabel="O prazo está em meses ou anos"
              />
            </Field>
          </div>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Montante final"
            value={brl.format(r.montanteFinal)}
            sub={<>Valor acumulado ao fim de {r.meses} meses.</>}
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Total investido"
              value={brl.format(r.totalInvestido)}
              emphasis={false}
              sub={<>Valor inicial mais a soma de todos os aportes.</>}
            />
            <ResultStat
              label="Total em juros"
              value={brl.format(r.totalJuros)}
              emphasis={false}
              sub={<>Quanto o dinheiro rendeu além do que você aportou.</>}
            />
          </div>

          <ResultStat
            label="Taxa mensal efetiva"
            value={pct.format(r.iMensalEfetiva)}
            emphasis={false}
            sub={
              tipoTaxa === 'anual' ? (
                <>Taxa mensal equivalente à anual, por capitalização composta.</>
              ) : (
                <>Taxa mensal usada nos {r.meses} períodos do cálculo.</>
              )
            }
          />

          <p className="text-xs text-ink-3">
            Simulação de juros compostos com valor nominal bruto. Não considera
            Imposto de Renda, IOF, taxas de administração nem inflação. Os
            rendimentos reais de um investimento podem variar.
          </p>
        </div>
      }
    />
  );
}
