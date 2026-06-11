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

const pctMensal = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
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

export function PoupancaForm() {
  const [valorInicial, setValorInicial] = React.useState(10000);
  const [depositoMensal, setDepositoMensal] = React.useState(0);
  const [prazoMeses, setPrazoMeses] = React.useState(12);
  const [selicAnual, setSelicAnual] = React.useState(14.5);
  const [trMensal, setTrMensal] = React.useState(0.17);

  const r = calculate({
    valorInicial,
    depositoMensal,
    prazoMeses,
    selicAnual,
    trMensal,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="pp-inicial"
            label="Valor inicial"
            hint="Quanto você deposita de uma vez no começo. Pode ser R$ 0."
          >
            <NumberInput
              id="pp-inicial"
              value={valorInicial}
              onChange={setValorInicial}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Valor inicial em reais"
            />
          </Field>

          <Field
            id="pp-deposito"
            label="Depósito mensal"
            hint="Quanto você pretende depositar todo mês. Pode ser R$ 0."
          >
            <NumberInput
              id="pp-deposito"
              value={depositoMensal}
              onChange={setDepositoMensal}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Depósito mensal em reais"
            />
          </Field>

          <Field id="pp-prazo" label="Prazo (meses)">
            <NumberInput
              id="pp-prazo"
              value={prazoMeses}
              onChange={setPrazoMeses}
              suffix="meses"
              decimals={0}
              min={1}
              max={600}
              ariaLabel="Prazo em meses"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="pp-selic"
              label="Selic meta"
              hint="Taxa Selic em % ao ano. Muda a cada reunião do Copom."
            >
              <NumberInput
                id="pp-selic"
                value={selicAnual}
                onChange={setSelicAnual}
                suffix="% a.a."
                decimals={2}
                min={0}
                ariaLabel="Selic meta anual em porcentagem"
              />
            </Field>

            <Field
              id="pp-tr"
              label="TR mensal"
              hint="Taxa Referencial em % ao mês. Muda mês a mês."
            >
              <NumberInput
                id="pp-tr"
                value={trMensal}
                onChange={setTrMensal}
                suffix="% a.m."
                decimals={4}
                min={0}
                ariaLabel="TR mensal em porcentagem"
              />
            </Field>
          </div>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Valor final"
            value={brl.format(r.valorFinal)}
            sub={
              <>
                Valor estimado na poupança depois de {r.prazoMeses} meses,
                isento de Imposto de Renda.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Total depositado"
              value={brl.format(r.totalDepositado)}
              emphasis={false}
              sub={<>Valor inicial mais a soma dos depósitos.</>}
            />
            <ResultStat
              label="Rendimento"
              value={brl.format(r.rendimento)}
              emphasis={false}
              sub={<>O quanto o dinheiro rendeu no período.</>}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Taxa mensal aplicada"
              value={`${pctMensal.format(r.taxaMensalAplicada)}% a.m.`}
              emphasis={false}
              sub={<>Rendimento de cada mês, já com a TR.</>}
            />
            <ResultStat
              label="Regra usada"
              value={r.regraUsada}
              emphasis={false}
              sub={
                r.regraUsada === '0,5% + TR' ? (
                  <>Selic acima de 8,5% ao ano.</>
                ) : (
                  <>Selic de até 8,5% ao ano.</>
                )
              }
            />
          </div>

          <p className="text-xs text-ink-3">
            Simulação aproximada. A Selic e a TR que você informa variam ao
            longo do tempo, e os bancos creditam o rendimento na data de
            aniversário de cada depósito. É uma estimativa de caráter
            informativo, não uma recomendação de investimento.
          </p>
        </div>
      }
    />
  );
}
