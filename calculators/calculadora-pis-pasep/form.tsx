'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, SALARIO_MINIMO_2026 } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function round2(x: number): number {
  return Math.round(x * 100) / 100;
}

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

export function PisPasepForm() {
  const [mesesTrabalhados, setMesesTrabalhados] = React.useState(12);
  const [salarioMinimo, setSalarioMinimo] = React.useState(SALARIO_MINIMO_2026);

  const r = calculate({ mesesTrabalhados, salarioMinimo });

  // Tabela mês -> valor acumulado do abono (1 a 12 meses), com o salário informado.
  const tabela = Array.from({ length: 12 }, (_, i) => {
    const mes = i + 1;
    return { mes, valor: round2((mes / 12) * r.salarioMinimo) };
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="pis-meses"
            label="Meses trabalhados no ano-base"
            hint="Quantos meses você trabalhou com carteira assinada no ano-base. Mês com 15 dias ou mais conta como mês cheio (1 a 12)."
          >
            <NumberInput
              id="pis-meses"
              value={mesesTrabalhados}
              onChange={setMesesTrabalhados}
              decimals={0}
              min={0}
              max={12}
              ariaLabel="Meses trabalhados no ano-base"
            />
          </Field>

          <Field
            id="pis-salario-minimo"
            label="Salário mínimo vigente"
            hint="Em 2026, o salário mínimo é R$ 1.621,00. Você pode editar para simular outros anos."
          >
            <NumberInput
              id="pis-salario-minimo"
              value={salarioMinimo}
              onChange={setSalarioMinimo}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário mínimo vigente em reais"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Valor estimado do abono"
            value={brl.format(r.valorAbono)}
            sub={
              <>
                Proporcional a {r.mesesConsiderados}{' '}
                {r.mesesConsiderados === 1 ? 'mês considerado' : 'meses considerados'}{' '}
                no ano-base.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Meses considerados"
              value={String(r.mesesConsiderados)}
              emphasis={false}
              sub={<>De 1 a 12 meses no ano-base.</>}
            />
            <ResultStat
              label="Valor por mês trabalhado"
              value={brl.format(r.valorPorMes)}
              emphasis={false}
              sub={<>Equivale a 1/12 do salário mínimo informado.</>}
            />
          </div>

          <div className="rounded-md border border-border-default bg-surface-1 p-4">
            <p className="text-sm font-medium text-ink-2">
              Tabela: meses trabalhados × valor do abono
            </p>
            <p className="mt-0.5 text-xs text-ink-3">
              Com base no salário mínimo de {brl.format(r.salarioMinimo)}.
            </p>
            <div className="mt-3 overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border-default text-left text-ink-3">
                    <th scope="col" className="py-1.5 pr-4 font-medium">
                      Meses
                    </th>
                    <th scope="col" className="py-1.5 font-medium">
                      Valor do abono
                    </th>
                  </tr>
                </thead>
                <tbody className="tabular">
                  {tabela.map((linha) => (
                    <tr
                      key={linha.mes}
                      className={
                        linha.mes === r.mesesConsiderados
                          ? 'bg-surface-2 font-medium text-ink-1'
                          : 'text-ink-2'
                      }
                    >
                      <td className="py-1.5 pr-4">{linha.mes}</td>
                      <td className="py-1.5">{brl.format(linha.valor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-ink-3">
            Estimativa com base na fórmula oficial do abono salarial PIS/Pasep e
            no salário mínimo de 2026 (R$ 1.621,00). Não substitui a consulta
            oficial nos canais do governo, da Caixa ou do Banco do Brasil.
          </p>
        </div>
      }
    />
  );
}
