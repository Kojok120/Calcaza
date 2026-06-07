'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const SIM_NAO = [
  { value: 'nao', label: 'Não' },
  { value: 'sim', label: 'Sim' },
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

export function FgtsForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(3000);
  const [mesesContribuidos, setMesesContribuidos] = React.useState(12);
  const [saldoAtual, setSaldoAtual] = React.useState(0);
  const [taxaAnualRendimento, setTaxaAnualRendimento] = React.useState(3);
  const [mostrarMulta, setMostrarMulta] = React.useState('sim');

  const calcularMulta = mostrarMulta === 'sim';

  const r = calculate({
    salarioBruto,
    mesesContribuidos,
    saldoAtual,
    taxaAnualRendimento,
    calcularMulta,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="fgts-bruto" label="Salário bruto mensal">
            <NumberInput
              id="fgts-bruto"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário bruto mensal em reais"
            />
          </Field>

          <Field
            id="fgts-meses"
            label="Meses de contribuição a projetar"
            hint="Quantos meses de depósito você quer simular (a partir do saldo atual)."
          >
            <NumberInput
              id="fgts-meses"
              value={mesesContribuidos}
              onChange={setMesesContribuidos}
              decimals={0}
              min={0}
              max={600}
              ariaLabel="Meses de contribuição a projetar"
            />
          </Field>

          <Field
            id="fgts-saldo"
            label="Saldo atual do FGTS (opcional)"
            hint="Valor que você já tem na conta vinculada da Caixa hoje."
          >
            <NumberInput
              id="fgts-saldo"
              value={saldoAtual}
              onChange={setSaldoAtual}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Saldo atual do FGTS em reais"
            />
          </Field>

          <Field
            id="fgts-taxa"
            label="Rendimento anual aproximado"
            hint="Padrão de 3% a.a. Não inclui a TR nem a distribuição de lucros — o rendimento real costuma ser maior."
          >
            <NumberInput
              id="fgts-taxa"
              value={taxaAnualRendimento}
              onChange={setTaxaAnualRendimento}
              suffix="% a.a."
              decimals={2}
              min={0}
              max={20}
              ariaLabel="Rendimento anual aproximado em porcentagem"
            />
          </Field>

          <Field
            id="fgts-multa"
            label="Mostrar multa rescisória?"
            hint="Multa de 40% (sem justa causa) e de 20% (acordo) sobre o saldo."
          >
            <Select
              id="fgts-multa"
              value={mostrarMulta}
              onValueChange={setMostrarMulta}
              options={SIM_NAO}
              ariaLabel="Mostrar multa rescisória"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Saldo projetado do FGTS"
            value={brl.format(r.saldoProjetado)}
            sub={
              <>
                Após {mesesContribuidos} {mesesContribuidos === 1 ? 'mês' : 'meses'} de
                depósito, partindo de {brl.format(saldoAtual)}.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Depósito mensal (8%)"
              value={brl.format(r.depositoMensal)}
              emphasis={false}
              sub={<>Pago pelo empregador, sem descontar do salário.</>}
            />
            <ResultStat
              label="Total depositado"
              value={brl.format(r.totalDepositado)}
              emphasis={false}
              sub={<>Saldo inicial mais os depósitos do período.</>}
            />
          </div>

          <ResultStat
            label="Rendimento acumulado (aproximado)"
            value={brl.format(r.rendimentoAcumulado)}
            emphasis={false}
            sub={
              <>
                Estimado a {taxaAnualRendimento}% a.a., sem a TR. O valor real
                tende a ser maior.
              </>
            }
          />

          {calcularMulta && (
            <div className="grid gap-3 sm:grid-cols-2">
              <ResultStat
                label="Multa de 40% (sem justa causa)"
                value={brl.format(r.multaRescisoria40)}
                emphasis={false}
                sub={<>Paga pelo empregador na demissão sem justa causa.</>}
              />
              <ResultStat
                label="Multa de 20% (acordo)"
                value={brl.format(r.multaAcordo20)}
                emphasis={false}
                sub={<>No distrato em comum acordo entre as partes.</>}
              />
            </div>
          )}

          <p className="text-xs text-ink-3">
            Estimativa para trabalhador CLT. O FGTS rende TR + 3% ao ano, além
            de eventual distribuição de lucros; esta projeção usa só a taxa
            informada, sem a TR, então o saldo real costuma ser um pouco maior.
            Não substitui o extrato oficial da Caixa.
          </p>
        </div>
      }
    />
  );
}
