'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type Modo } from './logic';

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

const MODO_OPTIONS = [
  { value: 'margem', label: 'Margem (sobre a venda)' },
  { value: 'markup', label: 'Markup (sobre o custo)' },
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

export function MargemDeLucroForm() {
  const [custo, setCusto] = React.useState(50);
  const [modo, setModo] = React.useState<Modo>('margem');
  const [percentual, setPercentual] = React.useState(30);
  const [despesasVariaveis, setDespesasVariaveis] = React.useState(0);

  const r = calculate({ custo, modo, percentual, despesasVariaveis });

  const percentualLabel =
    modo === 'markup' ? 'Markup sobre o custo' : 'Margem sobre a venda';
  const percentualHint =
    modo === 'markup'
      ? 'Quanto você acrescenta ao custo, em %.'
      : 'Quanto você quer que sobre de cada venda, em %.';

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="ml-custo"
            label="Custo do produto"
            hint="Quanto você paga por unidade (compra ou produção)."
          >
            <NumberInput
              id="ml-custo"
              value={custo}
              onChange={setCusto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Custo do produto em reais"
            />
          </Field>

          <Field
            id="ml-modo"
            label="Como você raciocina o percentual?"
            hint="Markup é sobre o custo; margem é sobre o preço de venda."
          >
            <Select
              id="ml-modo"
              value={modo}
              onValueChange={(v) => setModo(v as Modo)}
              options={MODO_OPTIONS}
              ariaLabel="Calcular por markup (sobre o custo) ou por margem (sobre a venda)"
            />
          </Field>

          <Field id="ml-percentual" label={percentualLabel} hint={percentualHint}>
            <NumberInput
              id="ml-percentual"
              value={percentual}
              onChange={setPercentual}
              suffix="%"
              decimals={2}
              min={0}
              ariaLabel="Percentual de markup ou de margem"
            />
          </Field>

          <Field
            id="ml-despesas"
            label="Despesas variáveis"
            hint="Sobre a venda: impostos do DAS/Simples, comissão, taxa de cartão. Pode ser 0."
          >
            <NumberInput
              id="ml-despesas"
              value={despesasVariaveis}
              onChange={setDespesasVariaveis}
              suffix="%"
              decimals={2}
              min={0}
              max={100}
              ariaLabel="Despesas variáveis em porcentagem sobre a venda"
            />
          </Field>
        </>
      }
      result={
        r.invalido ? (
          <div className="grid gap-3">
            <ResultStat
              label="Preço de venda"
              value="—"
              sub={
                <>
                  No modo margem, a soma da margem com as despesas variáveis
                  precisa ser menor que 100%. Reduza a margem ou as despesas e
                  tente de novo.
                </>
              }
            />
          </div>
        ) : (
          <div className="grid gap-3">
            <ResultStat
              label="Preço de venda sugerido"
              value={brl.format(r.precoVenda)}
              sub={
                modo === 'margem' ? (
                  <>Preço para que sobre a margem desejada depois do custo e das despesas.</>
                ) : (
                  <>Custo acrescido do markup informado.</>
                )
              }
            />

            <div className="grid gap-3 sm:grid-cols-2">
              <ResultStat
                label="Lucro por unidade"
                value={brl.format(r.lucro)}
                emphasis={false}
                sub={<>Preço menos o custo e as despesas variáveis.</>}
              />
              <ResultStat
                label="Despesas variáveis"
                value={brl.format(r.despesaVariavelValor)}
                emphasis={false}
                sub={<>Impostos, comissão e taxa de cartão sobre a venda.</>}
              />
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <ResultStat
                label="Margem sobre a venda"
                value={pct.format(r.margemSobreVenda / 100)}
                emphasis={false}
                sub={<>Quanto o lucro representa do preço de venda.</>}
              />
              <ResultStat
                label="Markup sobre o custo"
                value={pct.format(r.markupSobreCusto / 100)}
                emphasis={false}
                sub={<>Quanto o lucro representa do custo do produto.</>}
              />
            </div>

            <p className="text-xs text-ink-3">
              Cálculo por produto. Não inclui custos fixos (aluguel, salários,
              energia) nem substitui o cálculo de ponto de equilíbrio. As
              alíquotas de impostos variam conforme o regime tributário.
            </p>
          </div>
        )
      }
    />
  );
}
