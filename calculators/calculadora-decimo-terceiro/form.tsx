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

export function DecimoTerceiroForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(3000);
  const [mesesTrabalhados, setMesesTrabalhados] = React.useState(12);
  const [dependentes, setDependentes] = React.useState(0);
  const [mediaAdicionais, setMediaAdicionais] = React.useState(0);

  const r = calculate({
    salarioBruto,
    mesesTrabalhados,
    dependentes,
    mediaAdicionais,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="dt-bruto" label="Salário bruto mensal">
            <NumberInput
              id="dt-bruto"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário bruto mensal em reais"
            />
          </Field>

          <Field
            id="dt-meses"
            label="Meses trabalhados no ano"
            hint="De 0 a 12. O mês com 15 dias ou mais conta como mês completo."
          >
            <NumberInput
              id="dt-meses"
              value={mesesTrabalhados}
              onChange={setMesesTrabalhados}
              decimals={0}
              min={0}
              max={12}
              ariaLabel="Meses trabalhados no ano"
            />
          </Field>

          <Field
            id="dt-dependentes"
            label="Número de dependentes"
            hint="Dependentes para fins de Imposto de Renda."
          >
            <NumberInput
              id="dt-dependentes"
              value={dependentes}
              onChange={setDependentes}
              decimals={0}
              min={0}
              max={20}
              ariaLabel="Número de dependentes"
            />
          </Field>

          <Field
            id="dt-adicionais"
            label="Média de adicionais (opcional)"
            hint="Média mensal de horas extras, adicional noturno, comissões etc. que integram o 13º."
          >
            <NumberInput
              id="dt-adicionais"
              value={mediaAdicionais}
              onChange={setMediaAdicionais}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Média de adicionais em reais"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="13º líquido total estimado"
            value={brl.format(r.totalLiquido)}
            sub={
              <>
                De um 13º bruto de {brl.format(r.decimoBruto)} (1ª + 2ª parcela).
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="1ª parcela (até 30/11)"
              value={brl.format(r.primeiraParcela)}
              emphasis={false}
              sub={<>Metade do 13º bruto, sem descontos.</>}
            />
            <ResultStat
              label="2ª parcela (até 20/12)"
              value={brl.format(r.segundaParcela)}
              emphasis={false}
              sub={<>Outra metade já com INSS e IRRF.</>}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Desconto do INSS"
              value={brl.format(r.inss)}
              emphasis={false}
              sub={<>Incide sobre o 13º integral.</>}
            />
            <ResultStat
              label="Desconto do IRRF"
              value={brl.format(r.irrf)}
              emphasis={false}
              sub={
                r.decimoBruto > 0 && r.irrf === 0 ? (
                  <>Isento nesta faixa.</>
                ) : (
                  <>Tributação exclusiva na fonte.</>
                )
              }
            />
          </div>

          <ResultStat
            label="Descontos sobre o 13º"
            value={pct.format(r.aliquotaEfetiva)}
            emphasis={false}
            sub={<>Alíquota efetiva total (INSS + IRRF) sobre o 13º bruto.</>}
          />

          <p className="text-xs text-ink-3">
            Estimativa do 13º salário (gratificação natalina) para trabalhador
            CLT, com base nas tabelas de INSS e IRRF de 2026. O 13º tem
            tributação própria, separada do salário mensal.
          </p>
        </div>
      }
    />
  );
}
