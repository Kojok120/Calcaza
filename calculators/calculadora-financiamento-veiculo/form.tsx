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

export function FinanciamentoVeiculoForm() {
  const [valorVeiculo, setValorVeiculo] = React.useState(80000);
  const [entradaPercent, setEntradaPercent] = React.useState(20);
  const [prazoMeses, setPrazoMeses] = React.useState(48);
  const [taxaJurosMensal, setTaxaJurosMensal] = React.useState(1.5);

  const r = calculate({
    valorVeiculo,
    entradaPercent,
    prazoMeses,
    taxaJurosMensal,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="fin-veiculo-valor" label="Valor do veículo">
            <NumberInput
              id="fin-veiculo-valor"
              value={valorVeiculo}
              onChange={setValorVeiculo}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Valor do veículo em reais"
            />
          </Field>

          <Field
            id="fin-veiculo-entrada"
            label="Entrada"
            hint="Percentual pago à vista. Quanto maior a entrada, menos juros você paga no total."
          >
            <NumberInput
              id="fin-veiculo-entrada"
              value={entradaPercent}
              onChange={setEntradaPercent}
              suffix="%"
              decimals={1}
              min={0}
              max={100}
              ariaLabel="Entrada em porcentagem do valor do veículo"
            />
          </Field>

          <Field
            id="fin-veiculo-prazo"
            label="Prazo"
            hint="Número de parcelas, de 12 a 60 meses. Ex.: 48 meses = 4 anos."
          >
            <NumberInput
              id="fin-veiculo-prazo"
              value={prazoMeses}
              onChange={setPrazoMeses}
              suffix="meses"
              decimals={0}
              min={12}
              max={60}
              ariaLabel="Prazo do financiamento em meses"
            />
          </Field>

          <Field
            id="fin-veiculo-taxa"
            label="Taxa de juros"
            hint="Taxa ao mês (a.m.) informada na proposta. Não é a taxa anual."
          >
            <NumberInput
              id="fin-veiculo-taxa"
              value={taxaJurosMensal}
              onChange={setTaxaJurosMensal}
              suffix="% a.m."
              decimals={2}
              min={0}
              max={10}
              ariaLabel="Taxa de juros mensal em porcentagem"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Parcela mensal"
            value={brl.format(r.parcela)}
            sub={
              <>
                Parcela fixa em {r.n} meses pela Tabela Price. Estimativa sem o
                CET.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Entrada"
              value={brl.format(r.entrada)}
              emphasis={false}
              sub={<>Valor pago à vista, abatido do financiamento.</>}
            />
            <ResultStat
              label="Valor financiado"
              value={brl.format(r.valorFinanciado)}
              emphasis={false}
              sub={<>Valor do veículo menos a entrada.</>}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Total de juros"
              value={brl.format(r.totalJuros)}
              emphasis={false}
              sub={<>Quanto você paga além do valor financiado.</>}
            />
            <ResultStat
              label="Total pago"
              value={brl.format(r.totalPago)}
              emphasis={false}
              sub={<>Soma das parcelas mais a entrada.</>}
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa apenas com juros e amortização pela Tabela Price. A
            parcela real do banco costuma ser maior porque o contrato inclui o
            CET (Custo Efetivo Total): IOF, tarifa de cadastro, registro do
            contrato (gravame), seguros e outras tarifas. A taxa é tratada como
            taxa ao mês (a.m.). Não substitui a simulação oficial da
            instituição.
          </p>
        </div>
      }
    />
  );
}
