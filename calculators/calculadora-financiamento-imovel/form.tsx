'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type SistemaAmortizacao } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const SISTEMAS = [
  { value: 'SAC', label: 'SAC (parcela decrescente)' },
  { value: 'PRICE', label: 'Price (parcela fixa)' },
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

export function FinanciamentoImovelForm() {
  const [valorImovel, setValorImovel] = React.useState(300000);
  const [entrada, setEntrada] = React.useState(60000);
  const [taxaJurosAnual, setTaxaJurosAnual] = React.useState(10);
  const [prazoMeses, setPrazoMeses] = React.useState(360);
  const [sistema, setSistema] = React.useState<SistemaAmortizacao>('SAC');

  const r = calculate({
    valorImovel,
    entrada,
    taxaJurosAnual,
    prazoMeses,
    sistema,
  });

  const isSac = r.sistema === 'SAC';

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="fin-imovel" label="Valor do imóvel">
            <NumberInput
              id="fin-imovel"
              value={valorImovel}
              onChange={setValorImovel}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Valor do imóvel em reais"
            />
          </Field>

          <Field
            id="fin-entrada"
            label="Entrada"
            hint="Valor que você paga à vista. A entrada mínima costuma ser cerca de 20%."
          >
            <NumberInput
              id="fin-entrada"
              value={entrada}
              onChange={setEntrada}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Valor da entrada em reais"
            />
          </Field>

          <Field
            id="fin-taxa"
            label="Taxa de juros"
            hint="Taxa anual informada pelo banco. Convertida em taxa mensal equivalente."
          >
            <NumberInput
              id="fin-taxa"
              value={taxaJurosAnual}
              onChange={setTaxaJurosAnual}
              suffix="% a.a."
              decimals={2}
              min={0}
              max={50}
              ariaLabel="Taxa de juros anual em porcentagem"
            />
          </Field>

          <Field
            id="fin-prazo"
            label="Prazo"
            hint="Número de parcelas. Ex.: 360 meses = 30 anos."
          >
            <NumberInput
              id="fin-prazo"
              value={prazoMeses}
              onChange={setPrazoMeses}
              suffix="meses"
              decimals={0}
              min={1}
              max={480}
              ariaLabel="Prazo do financiamento em meses"
            />
          </Field>

          <Field
            id="fin-sistema"
            label="Sistema de amortização"
            hint="SAC: parcela começa mais alta e cai. Price: parcela fixa."
          >
            <Select
              id="fin-sistema"
              value={sistema}
              onValueChange={(v) => setSistema(v as SistemaAmortizacao)}
              options={SISTEMAS}
              ariaLabel="Sistema de amortização"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Primeira parcela"
            value={brl.format(r.parcelaInicial)}
            sub={
              isSac ? (
                <>
                  No SAC, esta é a maior parcela; ela diminui até a última.
                </>
              ) : (
                <>Na Price, todas as parcelas são iguais a este valor.</>
              )
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Última parcela"
              value={brl.format(r.parcelaFinal)}
              emphasis={false}
              sub={
                isSac ? (
                  <>A menor parcela do contrato, ao final do prazo.</>
                ) : (
                  <>Igual à primeira: a parcela é fixa na Price.</>
                )
              }
            />
            <ResultStat
              label="Valor financiado"
              value={brl.format(r.valorFinanciado)}
              emphasis={false}
              sub={<>Valor do imóvel menos a entrada.</>}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Total pago"
              value={brl.format(r.totalPago)}
              emphasis={false}
              sub={<>Soma de todas as parcelas, sem seguros e taxas.</>}
            />
            <ResultStat
              label="Total de juros"
              value={brl.format(r.totalJuros)}
              emphasis={false}
              sub={<>Quanto você paga além do valor financiado.</>}
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa apenas com amortização e juros. A parcela real do banco
            costuma ser maior porque inclui o CET, os seguros obrigatórios (MIP e
            DFI) e a taxa de administração. A taxa anual é convertida em taxa
            mensal equivalente; alguns contratos usam taxa nominal. Não substitui
            a simulação oficial da instituição.
          </p>
        </div>
      }
    />
  );
}
