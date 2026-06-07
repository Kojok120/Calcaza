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

export function SalarioLiquidoForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(3000);
  const [dependentes, setDependentes] = React.useState(0);
  const [outrosDescontos, setOutrosDescontos] = React.useState(0);

  const r = calculate({ salarioBruto, dependentes, outrosDescontos });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="sl-bruto" label="Salário bruto mensal">
            <NumberInput
              id="sl-bruto"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário bruto mensal em reais"
            />
          </Field>

          <Field
            id="sl-dependentes"
            label="Número de dependentes"
            hint="Dependentes para fins de Imposto de Renda."
          >
            <NumberInput
              id="sl-dependentes"
              value={dependentes}
              onChange={setDependentes}
              decimals={0}
              min={0}
              max={20}
              ariaLabel="Número de dependentes"
            />
          </Field>

          <Field
            id="sl-outros"
            label="Outros descontos (opcional)"
            hint="Plano de saúde, vale-transporte, adiantamentos etc."
          >
            <NumberInput
              id="sl-outros"
              value={outrosDescontos}
              onChange={setOutrosDescontos}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Outros descontos em reais"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Salário líquido estimado"
            value={brl.format(r.salarioLiquido)}
            sub={
              <>De um bruto de {brl.format(r.salarioBruto)} por mês.</>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Desconto do INSS"
              value={brl.format(r.inss)}
              emphasis={false}
              sub={<>Alíquota efetiva: {pct.format(r.aliquotaEfetivaInss)}</>}
            />
            <ResultStat
              label="Desconto do IRRF"
              value={brl.format(r.irrf)}
              emphasis={false}
              sub={
                r.salarioBruto > 0 && r.salarioBruto <= 5000 ? (
                  <>Isento até R$ 5.000,00 em 2026.</>
                ) : (
                  <>Alíquota efetiva: {pct.format(r.aliquotaEfetivaIrrf)}</>
                )
              }
            />
          </div>

          <ResultStat
            label="Base de cálculo do IR"
            value={brl.format(r.baseIrrf)}
            emphasis={false}
            sub={
              <>
                Base{' '}
                {r.baseIrrfTipo === 'simplificada' ? 'simplificada' : 'legal'}{' '}
                (a mais benéfica).
                {r.redutor > 0 && (
                  <> Redutor aplicado: {brl.format(r.redutor)}.</>
                )}
              </>
            }
          />

          <p className="text-xs text-ink-3">
            Estimativa para trabalhador CLT (carteira assinada), com base nas
            tabelas de INSS e IRRF de 2026. Não inclui 13º salário nem férias.
          </p>
        </div>
      }
    />
  );
}
