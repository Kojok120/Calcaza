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

export function SaqueAniversarioFgtsForm() {
  const [saldoFgts, setSaldoFgts] = React.useState(8000);

  const r = calculate({ saldoFgts });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="sa-saldo"
            label="Saldo total do FGTS"
            hint="Some o saldo de todas as suas contas vinculadas na Caixa. Você confere no aplicativo do FGTS."
          >
            <NumberInput
              id="sa-saldo"
              value={saldoFgts}
              onChange={setSaldoFgts}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Saldo total do FGTS em reais"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Valor do saque-aniversário"
            value={brl.format(r.valorSaque)}
            sub={
              <>
                Faixa aplicada: {r.faixaLabel}. Estimativa para este ano,
                considerando o saldo informado.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Alíquota da faixa"
              value={pct.format(r.aliquota)}
              emphasis={false}
              sub={<>Percentual aplicado sobre o saldo total.</>}
            />
            <ResultStat
              label="Parcela adicional"
              value={brl.format(r.parcelaAdicional)}
              emphasis={false}
              sub={<>Valor fixo somado ao percentual, conforme a faixa.</>}
            />
          </div>

          <ResultStat
            label="Saldo que continua na conta"
            value={brl.format(r.saldoRestante)}
            emphasis={false}
            sub={
              <>
                O que permanece no FGTS depois do saque deste ano:{' '}
                {brl.format(saldoFgts)} − {brl.format(r.valorSaque)}.
              </>
            }
          />

          <p className="text-xs text-ink-3">
            Estimativa baseada na tabela oficial do Decreto nº 10.556/2020.
            Quem adere ao saque-aniversário não saca o saldo total na demissão
            sem justa causa — recebe apenas a multa de 40%, e o saldo segue
            bloqueado para os saques anuais. Não substitui o extrato da Caixa.
          </p>
        </div>
      }
    />
  );
}
