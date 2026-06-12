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

const horas = new Intl.NumberFormat('pt-BR', {
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

export function AdicionalNoturnoForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(2200);
  const [jornadaMensal, setJornadaMensal] = React.useState(220);
  const [horasNoturnas, setHorasNoturnas] = React.useState(7);
  const [percentualAdicional, setPercentualAdicional] = React.useState(20);
  const [aplicarHoraReduzida, setAplicarHoraReduzida] = React.useState(true);

  const r = calculate({
    salarioBruto,
    jornadaMensal,
    horasNoturnas,
    percentualAdicional,
    aplicarHoraReduzida,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="an-salario" label="Salário bruto mensal">
            <NumberInput
              id="an-salario"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário bruto mensal em reais"
            />
          </Field>

          <Field
            id="an-jornada"
            label="Jornada mensal (horas)"
            hint="Divisor do salário. Em geral 220 (44h/semana) ou 200 (40h/semana)."
          >
            <NumberInput
              id="an-jornada"
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
            id="an-horas"
            label="Horas noturnas no mês (22h às 5h)"
            hint="Horas de relógio trabalhadas no período noturno durante o mês."
          >
            <NumberInput
              id="an-horas"
              value={horasNoturnas}
              onChange={setHorasNoturnas}
              suffix="h"
              decimals={2}
              min={0}
              ariaLabel="Horas de relógio trabalhadas no período noturno, no mês"
            />
          </Field>

          <Field
            id="an-adicional"
            label="Percentual do adicional noturno"
            hint="20% é o mínimo legal (CLT, art. 73). Acordos coletivos podem prever mais."
          >
            <NumberInput
              id="an-adicional"
              value={percentualAdicional}
              onChange={setPercentualAdicional}
              suffix="%"
              decimals={2}
              min={0}
              max={100}
              ariaLabel="Percentual do adicional noturno"
            />
          </Field>

          <div>
            <label className="flex cursor-pointer items-start gap-3">
              <input
                type="checkbox"
                checked={aplicarHoraReduzida}
                onChange={(e) => setAplicarHoraReduzida(e.target.checked)}
                className="mt-0.5 h-5 w-5 rounded border-border-default text-brand-500 focus:ring-2 focus:ring-brand-500"
                aria-label="Aplicar a hora noturna reduzida de 52 minutos e 30 segundos"
              />
              <span className="text-sm text-ink-2">
                Aplicar a hora noturna reduzida
                <span className="mt-0.5 block text-xs text-ink-3">
                  52min30s contam como 1 hora (CLT, art. 73, § 1º). Assim, 7h de
                  relógio viram 8h noturnas.
                </span>
              </span>
            </label>
          </div>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Total das horas noturnas com adicional"
            value={brl.format(r.totalAdicionalNoturno)}
            sub={
              <>
                Inclui apenas o adicional de{' '}
                {brl.format(r.apenasAdicional)} sobre a hora diurna.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Valor da hora noturna"
              value={brl.format(r.valorHoraNoturna)}
              emphasis={false}
              sub={
                <>Hora diurna ({brl.format(r.valorHora)}) + {percentualAdicional}%.</>
              }
            />
            <ResultStat
              label="Horas noturnas equivalentes"
              value={`${horas.format(r.horasNoturnasEquivalentes)} h`}
              emphasis={false}
              sub={
                aplicarHoraReduzida ? (
                  <>Com a hora reduzida de 52min30s.</>
                ) : (
                  <>Sem aplicar a hora reduzida.</>
                )
              }
            />
          </div>

          <ResultStat
            label={`Só o adicional noturno (${percentualAdicional}%)`}
            value={brl.format(r.apenasAdicional)}
            emphasis={false}
            sub={<>Diferença em relação ao valor da hora diurna.</>}
          />

          <p className="text-xs text-ink-3">
            Estimativa para o trabalhador urbano com carteira assinada (CLT). O
            trabalhador rural tem regras próprias. Esse valor compõe a base de
            INSS e IRRF do mês junto com o salário.
          </p>
        </div>
      }
    />
  );
}
