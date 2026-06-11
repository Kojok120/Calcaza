'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type BaseDias } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const BASE_OPTIONS = [
  { value: '30', label: '30 dias (padrão CLT)' },
  { value: 'mes', label: 'Dias corridos do mês' },
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

export function SalarioProporcionalForm() {
  const [salarioMensal, setSalarioMensal] = React.useState(3000);
  const [diasTrabalhados, setDiasTrabalhados] = React.useState(15);
  const [baseDias, setBaseDias] = React.useState<BaseDias>('30');
  const [baseDiasMes, setBaseDiasMes] = React.useState(30);

  const r = calculate({ salarioMensal, diasTrabalhados, baseDias, baseDiasMes });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="sp-salario" label="Salário mensal (cheio)">
            <NumberInput
              id="sp-salario"
              value={salarioMensal}
              onChange={setSalarioMensal}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário mensal cheio em reais"
            />
          </Field>

          <Field
            id="sp-base"
            label="Base de dias do mês"
            hint="A folha costuma usar 30 dias (padrão CLT). Alguns empregadores usam os dias corridos do mês."
          >
            <Select
              id="sp-base"
              value={baseDias}
              onValueChange={(v) => setBaseDias(v as BaseDias)}
              options={BASE_OPTIONS}
              ariaLabel="Base de dias do mês"
            />
          </Field>

          {baseDias === 'mes' && (
            <Field
              id="sp-base-dias"
              label="Dias corridos do mês"
              hint="Quantidade de dias do mês de referência (28 a 31)."
            >
              <NumberInput
                id="sp-base-dias"
                value={baseDiasMes}
                onChange={setBaseDiasMes}
                decimals={0}
                min={28}
                max={31}
                ariaLabel="Dias corridos do mês"
              />
            </Field>
          )}

          <Field
            id="sp-dias"
            label="Dias trabalhados no mês"
            hint="Quantos dias você efetivamente trabalhou no mês de admissão ou demissão."
          >
            <NumberInput
              id="sp-dias"
              value={diasTrabalhados}
              onChange={setDiasTrabalhados}
              decimals={0}
              min={0}
              max={r.base}
              ariaLabel="Dias trabalhados no mês"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Salário proporcional estimado"
            value={brl.format(r.salarioProporcional)}
            sub={
              <>
                Por {r.diasTrabalhados}{' '}
                {r.diasTrabalhados === 1 ? 'dia trabalhado' : 'dias trabalhados'}{' '}
                no mês.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Valor de um dia"
              value={brl.format(r.valorDia)}
              emphasis={false}
              sub={<>Salário ÷ {r.base} dias.</>}
            />
            <ResultStat
              label="Fração trabalhada"
              value={r.fracaoLabel}
              emphasis={false}
              sub={<>Dias trabalhados sobre a base de {r.base} dias.</>}
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa do salário-base proporcional aos dias trabalhados. O INSS,
            o IRRF e o FGTS incidem sobre esse valor. Não inclui férias
            proporcionais nem 13º proporcional, que têm cálculo próprio.
          </p>
        </div>
      }
    />
  );
}
