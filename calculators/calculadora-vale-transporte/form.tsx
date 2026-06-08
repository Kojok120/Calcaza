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

export function ValeTransporteForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(2000);
  const [custoDiarioTransporte, setCustoDiarioTransporte] = React.useState(10);
  const [diasTrabalhados, setDiasTrabalhados] = React.useState(22);

  const r = calculate({
    salarioBruto,
    custoDiarioTransporte,
    diasTrabalhados,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="vt-salario"
            label="Salário básico mensal"
            hint="O salário-base do contrato, sem adicionais. Os 6% incidem sobre ele."
          >
            <NumberInput
              id="vt-salario"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário básico mensal em reais"
            />
          </Field>

          <Field
            id="vt-custo-dia"
            label="Gasto com transporte por dia"
            hint="Total de ida e volta no transporte público em um dia de trabalho."
          >
            <NumberInput
              id="vt-custo-dia"
              value={custoDiarioTransporte}
              onChange={setCustoDiarioTransporte}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Gasto com transporte por dia em reais"
            />
          </Field>

          <Field
            id="vt-dias"
            label="Dias trabalhados no mês"
            hint="Quantos dias você usa o transporte para ir ao trabalho. Padrão: 22."
          >
            <NumberInput
              id="vt-dias"
              value={diasTrabalhados}
              onChange={setDiasTrabalhados}
              decimals={0}
              min={0}
              max={31}
              ariaLabel="Dias trabalhados no mês"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Desconto no seu salário"
            value={brl.format(r.descontoEmpregado)}
            sub={
              <>
                O que sai do seu contracheque pelo vale-transporte. Limitado a 6%
                do salário ({brl.format(r.descontoMaximo)}) e ao custo real.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Custo mensal do transporte"
              value={brl.format(r.custoMensalTransporte)}
              emphasis={false}
              sub={<>Gasto diário × dias trabalhados no mês.</>}
            />
            <ResultStat
              label="Parte paga pela empresa"
              value={brl.format(r.custoEmpregador)}
              emphasis={false}
              sub={
                r.custoEmpregador > 0 ? (
                  <>O empregador arca com a diferença acima dos 6%.</>
                ) : (
                  <>O custo coube dentro dos 6% do salário.</>
                )
              }
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa do desconto de vale-transporte na folha, com base na Lei
            nº 7.418/1985 e no Decreto nº 95.247/1987: o desconto do empregado é
            de no máximo 6% do salário básico e nunca maior que o custo real do
            transporte.
          </p>
        </div>
      }
    />
  );
}
