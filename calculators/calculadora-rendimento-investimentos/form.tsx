'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type TipoInvestimento } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const pct = new Intl.NumberFormat('pt-BR', {
  style: 'percent',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const TIPO_OPTIONS = [
  { value: 'cdb_tesouro', label: 'CDB / Tesouro (renda fixa)' },
  { value: 'poupanca', label: 'Poupança' },
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

export function RendimentoInvestimentosForm() {
  const [tipo, setTipo] = React.useState<TipoInvestimento>('cdb_tesouro');
  const [valorInicial, setValorInicial] = React.useState(10000);
  const [aporteMensal, setAporteMensal] = React.useState(0);
  const [meses, setMeses] = React.useState(12);
  const [taxaAnual, setTaxaAnual] = React.useState(12);

  const isPoupanca = tipo === 'poupanca';

  const r = calculate({
    valorInicial,
    aporteMensal,
    meses,
    tipo,
    taxaAnual,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="ri-tipo"
            label="Tipo de aplicação"
            hint="CDB e Tesouro pagam IR regressivo; a poupança é isenta."
          >
            <Select
              id="ri-tipo"
              value={tipo}
              onValueChange={(v) => setTipo(v as TipoInvestimento)}
              options={TIPO_OPTIONS}
              ariaLabel="Tipo de aplicação"
            />
          </Field>

          <Field
            id="ri-inicial"
            label="Valor inicial"
            hint="Quanto você aplica de uma vez no começo. Pode ser zero."
          >
            <NumberInput
              id="ri-inicial"
              value={valorInicial}
              onChange={setValorInicial}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Valor inicial em reais"
            />
          </Field>

          <Field
            id="ri-aporte"
            label="Aporte mensal"
            hint="Quanto você pretende depositar todo mês. Pode ser zero."
          >
            <NumberInput
              id="ri-aporte"
              value={aporteMensal}
              onChange={setAporteMensal}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Aporte mensal em reais"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field id="ri-meses" label="Prazo (meses)">
              <NumberInput
                id="ri-meses"
                value={meses}
                onChange={setMeses}
                suffix="meses"
                decimals={0}
                min={0}
                max={600}
                ariaLabel="Prazo em meses"
              />
            </Field>

            <Field
              id="ri-taxa"
              label="Taxa anual"
              hint={
                isPoupanca
                  ? 'Não usada na poupança (rende 0,5% a.m. + TR).'
                  : 'Taxa do CDB/Tesouro em % ao ano.'
              }
            >
              <NumberInput
                id="ri-taxa"
                value={taxaAnual}
                onChange={setTaxaAnual}
                suffix="% a.a."
                decimals={2}
                min={0}
                ariaLabel="Taxa anual em porcentagem"
              />
            </Field>
          </div>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Montante líquido"
            value={brl.format(r.montanteLiquido)}
            sub={
              <>
                Valor estimado no resgate após {r.meses} meses, já descontado o
                Imposto de Renda.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Total investido"
              value={brl.format(r.totalInvestido)}
              emphasis={false}
              sub={<>Valor inicial mais a soma dos aportes.</>}
            />
            <ResultStat
              label="Rendimento bruto"
              value={brl.format(r.rendimentoBruto)}
              emphasis={false}
              sub={<>O quanto rendeu antes do imposto.</>}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Imposto de Renda"
              value={brl.format(r.impostoIR)}
              emphasis={false}
              sub={
                isPoupanca ? (
                  <>Poupança é isenta de IR.</>
                ) : (
                  <>Alíquota de {pct.format(r.aliquotaIR)} sobre o rendimento.</>
                )
              }
            />
            <ResultStat
              label="Rendimento líquido"
              value={brl.format(r.rendimentoLiquido)}
              emphasis={false}
              sub={<>O ganho que fica com você depois do imposto.</>}
            />
          </div>

          <p className="text-xs text-ink-3">
            Simulação aproximada, baseada em taxas brutas de mercado. A taxa do CDB/Tesouro é
            informada por você e os rendimentos reais variam. Não inclui IOF
            (resgates em menos de 30 dias), a TR da poupança nem taxas de
            administração. É uma estimativa de caráter informativo, não uma
            recomendação de investimento.
          </p>
        </div>
      }
    />
  );
}
