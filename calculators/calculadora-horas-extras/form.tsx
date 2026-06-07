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

const ADICIONAL_OPTIONS = [
  { value: '50', label: '50% (mínimo legal — dias úteis)' },
  { value: '100', label: '100% (domingos e feriados)' },
];

export function HorasExtrasForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(2200);
  const [jornadaMensal, setJornadaMensal] = React.useState(220);
  const [quantidadeHoras, setQuantidadeHoras] = React.useState(10);
  const [percentualAdicional, setPercentualAdicional] = React.useState('50');
  const [incluirDSR, setIncluirDSR] = React.useState(false);
  const [diasUteis, setDiasUteis] = React.useState(25);
  const [diasDescanso, setDiasDescanso] = React.useState(5);

  const r = calculate({
    salarioBruto,
    jornadaMensal,
    quantidadeHoras,
    percentualAdicional: Number(percentualAdicional),
    incluirDSR,
    diasUteis,
    diasDescanso,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="he-salario" label="Salário bruto mensal">
            <NumberInput
              id="he-salario"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário bruto mensal em reais"
            />
          </Field>

          <Field
            id="he-jornada"
            label="Jornada mensal (horas)"
            hint="Divisor do salário. Em geral 220 (44h/semana) ou 200 (40h/semana)."
          >
            <NumberInput
              id="he-jornada"
              value={jornadaMensal}
              onChange={setJornadaMensal}
              suffix="h"
              decimals={0}
              min={1}
              max={744}
              ariaLabel="Jornada mensal em horas"
            />
          </Field>

          <Field
            id="he-horas"
            label="Quantidade de horas extras"
            hint="Total de horas extras feitas no mês."
          >
            <NumberInput
              id="he-horas"
              value={quantidadeHoras}
              onChange={setQuantidadeHoras}
              suffix="h"
              decimals={2}
              min={0}
              ariaLabel="Quantidade de horas extras no mês"
            />
          </Field>

          <Field
            id="he-adicional"
            label="Adicional de hora extra"
            hint="50% é o mínimo legal; 100% costuma valer em domingos e feriados."
          >
            <Select
              id="he-adicional"
              value={percentualAdicional}
              onValueChange={setPercentualAdicional}
              options={ADICIONAL_OPTIONS}
              ariaLabel="Percentual do adicional de hora extra"
            />
          </Field>

          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={incluirDSR}
                onChange={(e) => setIncluirDSR(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-border-default text-brand-500 focus:ring-2 focus:ring-brand-500"
                aria-label="Incluir reflexo no DSR"
              />
              <span className="text-sm text-ink-2">
                Incluir reflexo no DSR
                <span className="mt-0.5 block text-xs text-ink-3">
                  Para horas extras habituais (Súmula 172 do TST).
                </span>
              </span>
            </label>
          </div>

          {incluirDSR && (
            <div className="grid gap-4 rounded-md border border-border-default bg-surface-2 p-4 sm:grid-cols-2">
              <Field
                id="he-uteis"
                label="Dias úteis no mês"
                hint="Dias trabalhados."
              >
                <NumberInput
                  id="he-uteis"
                  value={diasUteis}
                  onChange={setDiasUteis}
                  decimals={0}
                  min={1}
                  max={31}
                  ariaLabel="Dias úteis no mês"
                />
              </Field>
              <Field
                id="he-descanso"
                label="Dias de descanso"
                hint="Domingos e feriados."
              >
                <NumberInput
                  id="he-descanso"
                  value={diasDescanso}
                  onChange={setDiasDescanso}
                  decimals={0}
                  min={0}
                  max={31}
                  ariaLabel="Dias de descanso no mês (domingos e feriados)"
                />
              </Field>
            </div>
          )}
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Total a receber pelas horas extras"
            value={brl.format(r.totalReceber)}
            sub={
              incluirDSR ? (
                <>
                  Horas extras {brl.format(r.totalHorasExtras)} + reflexo no DSR{' '}
                  {brl.format(r.reflexoDSR)}.
                </>
              ) : (
                <>Valor bruto das horas extras, sem reflexo no DSR.</>
              )
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Valor da hora normal"
              value={brl.format(r.valorHoraNormal)}
              emphasis={false}
              sub={<>Salário ÷ jornada mensal.</>}
            />
            <ResultStat
              label="Valor da hora extra"
              value={brl.format(r.valorHoraExtra)}
              emphasis={false}
              sub={<>Com adicional de {percentualAdicional}%.</>}
            />
          </div>

          <ResultStat
            label="Reflexo no DSR"
            value={brl.format(r.reflexoDSR)}
            emphasis={false}
            sub={
              incluirDSR ? (
                <>
                  {diasDescanso} dias de descanso ÷ {diasUteis} dias úteis.
                </>
              ) : (
                <>Não incluído neste cálculo.</>
              )
            }
          />

          <p className="text-xs text-ink-3">
            Estimativa do valor bruto das horas extras de quem trabalha com
            carteira assinada (CLT), com base no adicional escolhido. Esse valor
            ainda compõe a base de INSS e IRRF do mês.
          </p>
        </div>
      }
    />
  );
}
