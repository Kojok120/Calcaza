'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type RegimeInss } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pct = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
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

const REGIME_OPTIONS = [
  { value: '11', label: '11% — empresa recolhe a cota patronal (caso geral)' },
  { value: '20', label: '20% — sem cota patronal (por conta própria)' },
];

export function ProLaboreForm() {
  const [valorProLabore, setValorProLabore] = React.useState(6000);
  const [dependentes, setDependentes] = React.useState(0);
  const [regimeInss, setRegimeInss] = React.useState<RegimeInss>('11');

  const r = calculate({ valorProLabore, dependentes, regimeInss });

  const isentoIrrf = r.valorProLabore > 0 && r.irrf === 0;

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="pl-valor" label="Pró-labore bruto mensal">
            <NumberInput
              id="pl-valor"
              value={valorProLabore}
              onChange={setValorProLabore}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Pró-labore bruto mensal em reais"
            />
          </Field>

          <Field
            id="pl-regime"
            label="Regime de INSS do sócio"
            hint="11% é o caso geral, quando a empresa recolhe a cota patronal de 20% à parte."
          >
            <Select
              id="pl-regime"
              value={regimeInss}
              onValueChange={(v) => setRegimeInss(v as RegimeInss)}
              options={REGIME_OPTIONS}
              ariaLabel="Regime de contribuição do INSS"
            />
          </Field>

          <Field
            id="pl-dependentes"
            label="Número de dependentes"
            hint="Dependentes para fins de Imposto de Renda (R$ 189,59 cada na base)."
          >
            <NumberInput
              id="pl-dependentes"
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
            label="Pró-labore líquido no mês"
            value={brl.format(r.proLaboreLiquido)}
            sub={
              <>
                De um pró-labore bruto de {brl.format(r.valorProLabore)} por mês,
                já descontados INSS e IRRF.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Desconto de INSS"
              value={brl.format(r.inss)}
              emphasis={false}
              sub={
                <>
                  Alíquota de {pct.format(r.aliquotaInss)} sobre a base, limitada
                  ao teto do INSS.
                </>
              }
            />
            <ResultStat
              label="Desconto de IRRF"
              value={brl.format(r.irrf)}
              emphasis={false}
              sub={
                isentoIrrf ? (
                  <>Isento de IRRF em 2026 para este valor.</>
                ) : (
                  <>Base de cálculo: {brl.format(r.baseIRRF)}.</>
                )
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Redutor de 2026"
              value={brl.format(r.redutor)}
              emphasis={false}
              sub={
                r.redutor > 0 ? (
                  <>Aplicado na faixa de R$ 5.000 a R$ 7.350.</>
                ) : (
                  <>Sem redutor para este valor.</>
                )
              }
            />
            <ResultStat
              label="Carga efetiva (INSS + IRRF)"
              value={pct.format(r.aliquotaEfetiva)}
              emphasis={false}
              sub={
                <>Alíquota nominal da faixa de IR: {pct.format(r.aliquotaNominal)}.</>
              }
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa dos descontos do próprio sócio com base no teto do INSS e
            na tabela de IRRF de 2026, com o redutor da Lei nº 15.270/2025. Não
            inclui a cota patronal de 20% que a empresa recolhe à parte, nem a
            distribuição de lucros (isenta de IR).
          </p>
        </div>
      }
    />
  );
}
