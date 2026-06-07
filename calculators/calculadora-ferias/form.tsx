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

export function FeriasForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(3000);
  const [diasFerias, setDiasFerias] = React.useState(30);
  const [dependentes, setDependentes] = React.useState(0);
  const [venderUmTerco, setVenderUmTerco] = React.useState(false);

  const r = calculate({ salarioBruto, diasFerias, dependentes, venderUmTerco });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="fr-bruto" label="Salário bruto mensal">
            <NumberInput
              id="fr-bruto"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário bruto mensal em reais"
            />
          </Field>

          <Field
            id="fr-dias"
            label="Dias de férias gozados"
            hint="Quantos dias você vai tirar de descanso (de 1 a 30)."
          >
            <NumberInput
              id="fr-dias"
              value={diasFerias}
              onChange={setDiasFerias}
              suffix="dias"
              decimals={0}
              min={1}
              max={30}
              ariaLabel="Dias de férias gozados"
            />
          </Field>

          <Field
            id="fr-vender"
            label="Vender 1/3 das férias (abono pecuniário)?"
            hint="Converte 10 dias em dinheiro. O abono e o seu 1/3 são isentos de INSS e IRRF."
          >
            <div className="flex gap-2">
              <button
                type="button"
                id="fr-vender"
                onClick={() => setVenderUmTerco(false)}
                aria-pressed={!venderUmTerco}
                className={
                  'flex-1 rounded-md border px-4 py-3 text-sm font-medium transition-colors ' +
                  (!venderUmTerco
                    ? 'border-brand-500 bg-brand-500/10 text-ink-1'
                    : 'border-border-default bg-surface-1 text-ink-2 hover:border-brand-500')
                }
              >
                Não vender
              </button>
              <button
                type="button"
                onClick={() => setVenderUmTerco(true)}
                aria-pressed={venderUmTerco}
                className={
                  'flex-1 rounded-md border px-4 py-3 text-sm font-medium transition-colors ' +
                  (venderUmTerco
                    ? 'border-brand-500 bg-brand-500/10 text-ink-1'
                    : 'border-border-default bg-surface-1 text-ink-2 hover:border-brand-500')
                }
              >
                Vender 10 dias
              </button>
            </div>
          </Field>

          <Field
            id="fr-dependentes"
            label="Número de dependentes"
            hint="Dependentes para fins de Imposto de Renda."
          >
            <NumberInput
              id="fr-dependentes"
              value={dependentes}
              onChange={setDependentes}
              decimals={0}
              min={0}
              max={20}
              ariaLabel="Número de dependentes"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Total líquido das férias"
            value={brl.format(r.totalLiquido)}
            sub={
              <>
                De um total bruto de {brl.format(r.totalBruto)}
                {venderUmTerco ? ' (com abono pecuniário).' : '.'}
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label={`Férias (${r.diasFerias} dias)`}
              value={brl.format(r.valorFerias)}
              emphasis={false}
              sub={<>Remuneração dos dias de descanso.</>}
            />
            <ResultStat
              label="Terço constitucional (1/3)"
              value={brl.format(r.tercoConstitucional)}
              emphasis={false}
              sub={<>Acréscimo garantido pela Constituição.</>}
            />
          </div>

          {venderUmTerco && (
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultStat
                label="Abono pecuniário (10 dias)"
                value={brl.format(r.abono)}
                emphasis={false}
                sub={<>Parte vendida, isenta de descontos.</>}
              />
              <ResultStat
                label="1/3 sobre o abono"
                value={brl.format(r.abonoTerco)}
                emphasis={false}
                sub={<>Também isento de INSS e IRRF.</>}
              />
            </div>
          )}

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Desconto do INSS"
              value={brl.format(r.inss)}
              emphasis={false}
              sub={<>Sobre {brl.format(r.baseTributavel)} (férias + 1/3).</>}
            />
            <ResultStat
              label="Desconto do IRRF"
              value={brl.format(r.irrf)}
              emphasis={false}
              sub={
                r.irrf === 0 ? (
                  <>Base isenta de Imposto de Renda.</>
                ) : (
                  <>Imposto de Renda na fonte.</>
                )
              }
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa com base nas tabelas de INSS e IRRF de 2026. O abono
            pecuniário e o seu terço são isentos. O valor do contracheque pode
            variar conforme adicionais, médias e a apuração da empresa.
          </p>
        </div>
      }
    />
  );
}
