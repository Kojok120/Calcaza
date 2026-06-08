'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type IndiceReajuste } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const INDICES = [
  { value: 'IGP-M', label: 'IGP-M (FGV) — mais comum' },
  { value: 'IPCA', label: 'IPCA (IBGE)' },
  { value: 'INPC', label: 'INPC (IBGE)' },
  { value: 'outro', label: 'Outro índice' },
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

export function ReajusteAluguelForm() {
  const [aluguelAtual, setAluguelAtual] = React.useState(1500);
  const [indiceAcumulado, setIndiceAcumulado] = React.useState(4);
  const [indice, setIndice] = React.useState<IndiceReajuste>('IGP-M');

  const r = calculate({ aluguelAtual, indiceAcumulado, indice });

  const reduziu = r.valorAumento < 0;

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="reaj-aluguel" label="Aluguel atual">
            <NumberInput
              id="reaj-aluguel"
              value={aluguelAtual}
              onChange={setAluguelAtual}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Valor atual do aluguel em reais"
            />
          </Field>

          <Field
            id="reaj-indice-valor"
            label="Índice acumulado"
            hint="Percentual acumulado no período (em geral 12 meses). Use o número oficial da data-base. Pode ser negativo em caso de deflação."
          >
            <NumberInput
              id="reaj-indice-valor"
              value={indiceAcumulado}
              onChange={setIndiceAcumulado}
              suffix="%"
              decimals={2}
              allowNegative
              ariaLabel="Índice acumulado em porcentagem"
            />
          </Field>

          <Field
            id="reaj-indice"
            label="Índice do contrato"
            hint="Apenas o rótulo do índice usado no seu contrato. Não altera a conta — quem define o percentual é o campo acima."
          >
            <Select
              id="reaj-indice"
              value={indice}
              onValueChange={(v) => setIndice(v as IndiceReajuste)}
              options={INDICES}
              ariaLabel="Índice usado no contrato"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Novo aluguel"
            value={brl.format(r.novoAluguel)}
            sub={
              reduziu ? (
                <>
                  Com índice negativo (deflação), o aluguel reajustado fica
                  abaixo do valor atual.
                </>
              ) : (
                <>
                  Valor após aplicar o índice acumulado sobre o aluguel atual.
                </>
              )
            }
          />

          <ResultStat
            label={reduziu ? 'Redução do aluguel' : 'Valor do aumento'}
            value={brl.format(Math.abs(r.valorAumento))}
            emphasis={false}
            sub={
              reduziu ? (
                <>Diferença a menos em relação ao aluguel atual.</>
              ) : (
                <>Diferença a mais que você passa a pagar por mês.</>
              )
            }
          />

          <p className="text-xs text-ink-3">
            Estimativa do reajuste pelo índice informado. O reajuste anual segue
            a Lei do Inquilinato (Lei nº 8.245/1991) e o índice é o previsto no
            contrato. O valor final pode ser negociado entre inquilino e
            proprietário. Confirme o percentual acumulado na fonte oficial
            (FGV para o IGP-M; IBGE para IPCA e INPC).
          </p>
        </div>
      }
    />
  );
}
