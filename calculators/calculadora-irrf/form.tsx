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

export function IrrfForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(6000);
  const [dependentes, setDependentes] = React.useState(0);
  const [outrasDeducoes, setOutrasDeducoes] = React.useState(0);
  const [inssInformado, setInssInformado] = React.useState(0);

  const r = calculate({
    salarioBruto,
    dependentes,
    outrasDeducoes,
    // 0 significa "não informado": deixamos o cálculo estimar o INSS pela tabela.
    inssInformado: inssInformado > 0 ? inssInformado : undefined,
  });

  const isento = r.salarioBruto > 0 && r.irrf === 0;

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="ir-bruto" label="Rendimento bruto mensal">
            <NumberInput
              id="ir-bruto"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Rendimento bruto mensal em reais"
            />
          </Field>

          <Field
            id="ir-dependentes"
            label="Número de dependentes"
            hint="Dependentes para fins de Imposto de Renda (R$ 189,59 cada na base)."
          >
            <NumberInput
              id="ir-dependentes"
              value={dependentes}
              onChange={setDependentes}
              decimals={0}
              min={0}
              max={20}
              ariaLabel="Número de dependentes"
            />
          </Field>

          <Field
            id="ir-outras"
            label="Outras deduções (opcional)"
            hint="Pensão alimentícia judicial, previdência oficial além do INSS etc."
          >
            <NumberInput
              id="ir-outras"
              value={outrasDeducoes}
              onChange={setOutrasDeducoes}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Outras deduções em reais"
            />
          </Field>

          <Field
            id="ir-inss"
            label="INSS do contracheque (opcional)"
            hint="Se você já tem o valor descontado, informe. Em branco, estimamos pela tabela 2026."
          >
            <NumberInput
              id="ir-inss"
              value={inssInformado}
              onChange={setInssInformado}
              prefix="R$"
              decimals={2}
              min={0}
              placeholder="Calculado automaticamente"
              ariaLabel="INSS informado em reais (opcional)"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="IRRF estimado no mês"
            value={brl.format(r.irrf)}
            sub={
              isento ? (
                <>Isento de IRRF em 2026 para este rendimento.</>
              ) : (
                <>
                  De um rendimento bruto de {brl.format(r.salarioBruto)} por mês.
                </>
              )
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Base de cálculo"
              value={brl.format(r.baseCalculo)}
              emphasis={false}
              sub={
                <>
                  Modo{' '}
                  {r.baseTipo === 'simplificado'
                    ? 'simplificado'
                    : 'completo'}{' '}
                  (o mais vantajoso).
                </>
              }
            />
            <ResultStat
              label="Imposto pela tabela"
              value={brl.format(r.impostoTabela)}
              emphasis={false}
              sub={
                <>Alíquota nominal da faixa: {pct.format(r.aliquotaNominal)}.</>
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
                  <>Sem redutor para este rendimento.</>
                )
              }
            />
            <ResultStat
              label="Alíquota efetiva"
              value={pct.format(r.aliquotaEfetiva)}
              emphasis={false}
              sub={
                <>
                  INSS considerado: {brl.format(r.inss)}.
                </>
              }
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa do IRRF mensal com base nas tabelas de IRRF e INSS de
            2026 e no redutor da Lei nº 15.270/2025. Não inclui 13º salário,
            férias nem o ajuste anual da declaração.
          </p>
        </div>
      }
    />
  );
}
