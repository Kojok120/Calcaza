'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type Anexo } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pct = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 2,
  maximumFractionDigits: 4,
});

const ANEXO_OPCOES: { value: Anexo; label: string }[] = [
  { value: 'I', label: 'Anexo I — Comércio' },
  { value: 'II', label: 'Anexo II — Indústria' },
  { value: 'III', label: 'Anexo III — Serviços' },
  { value: 'V', label: 'Anexo V — Serviços (TI, consultoria…)' },
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

export function SimplesNacionalForm() {
  const [anexo, setAnexo] = React.useState<Anexo>('III');
  const [rbt12, setRbt12] = React.useState(300_000);
  const [receitaMes, setReceitaMes] = React.useState(25_000);

  const r = calculate({ anexo, rbt12, receitaMes });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="sn-anexo"
            label="Anexo da atividade"
            hint="Comércio (I), indústria (II) ou serviços (III/V). O anexo define as alíquotas da tabela."
          >
            <Select
              id="sn-anexo"
              value={anexo}
              onValueChange={(v) => setAnexo(v as Anexo)}
              options={ANEXO_OPCOES}
              ariaLabel="Anexo da atividade"
            />
          </Field>

          <Field
            id="sn-rbt12"
            label="Receita dos últimos 12 meses (RBT12)"
            hint="Soma do faturamento dos 12 meses anteriores. É o que define a faixa da tabela."
          >
            <NumberInput
              id="sn-rbt12"
              value={rbt12}
              onChange={setRbt12}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Receita bruta dos últimos 12 meses"
            />
          </Field>

          <Field
            id="sn-receita-mes"
            label="Faturamento do mês"
            hint="Receita bruta do mês que você quer calcular. É sobre ela que incide a alíquota efetiva."
          >
            <NumberInput
              id="sn-receita-mes"
              value={receitaMes}
              onChange={setReceitaMes}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Faturamento do mês"
            />
          </Field>
        </>
      }
      result={
        r.excedeuLimite ? (
          <div className="grid gap-3">
            <ResultStat
              label="Acima do limite do Simples Nacional"
              value="Não aplicável"
              sub={
                <>
                  A RBT12 informada passou de {brl.format(4_800_000)}, o teto do
                  Simples Nacional. Acima desse valor, a empresa precisa migrar
                  para outro regime (Lucro Presumido ou Lucro Real).
                </>
              }
            />
            <p className="text-xs text-ink-3">
              Confira a situação da empresa no Portal do Simples Nacional ou com
              o seu contador.
            </p>
          </div>
        ) : (
          <div className="grid gap-3">
            <ResultStat
              label="DAS estimado do mês"
              value={brl.format(r.das)}
              sub={
                <>
                  Faturamento do mês ({brl.format(receitaMes)}) × alíquota
                  efetiva.
                </>
              }
            />

            <div className="grid gap-3 sm:grid-cols-3">
              <ResultStat
                label="Alíquota efetiva"
                value={pct.format(r.aliquotaEfetiva)}
                emphasis={false}
                sub={<>O percentual que realmente incide neste mês.</>}
              />
              <ResultStat
                label="Faixa"
                value={`${r.faixa}ª`}
                emphasis={false}
                sub={
                  <>
                    Alíquota nominal de {pct.format(r.aliquotaNominal)} no anexo
                    escolhido.
                  </>
                }
              />
              <ResultStat
                label="Parcela a deduzir"
                value={brl.format(r.parcelaDeduzir)}
                emphasis={false}
                sub={<>Já descontada no cálculo da alíquota efetiva.</>}
              />
            </div>

            <div className="rounded-md border border-border-default bg-surface-1 p-4">
              <p className="text-sm font-medium text-ink-2">Como o valor sai</p>
              <p className="tabular mt-2 text-sm text-ink-2">
                ({brl.format(rbt12)} × {pct.format(r.aliquotaNominal)} −{' '}
                {brl.format(r.parcelaDeduzir)}) ÷ {brl.format(rbt12)} ={' '}
                <span className="font-medium text-ink-1">
                  {pct.format(r.aliquotaEfetiva)}
                </span>
              </p>
            </div>

            <p className="text-xs text-ink-3">
              Estimativa do DAS do mês no Simples Nacional em 2026, com base nas
              tabelas da Lei Complementar nº 123/2006. O valor não inclui
              eventuais retenções, sublimites estaduais ou o fator R; confirme no
              PGDAS-D ou com um contador.
            </p>
          </div>
        )
      }
    />
  );
}
