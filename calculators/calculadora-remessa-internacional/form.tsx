'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type Channel, type IofBase } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const rate = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 4,
  maximumFractionDigits: 4,
});

const foreign = new Intl.NumberFormat('pt-BR', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

function fmtPct(v: number): string {
  return `${v.toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}%`;
}

const CHANNEL_OPTIONS: { value: Channel; label: string }[] = [
  { value: 'bank', label: 'Banco tradicional' },
  { value: 'fintech', label: 'Fintech / remessa online' },
  { value: 'broker', label: 'Corretora de câmbio' },
];

const IOF_BASE_OPTIONS: { value: IofBase; label: string }[] = [
  { value: 'amount', label: 'Somente o valor enviado' },
  { value: 'amount_plus_fee', label: 'Valor enviado + tarifa' },
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

export function RemessaInternacionalForm() {
  const [sendAmountBRL, setSendAmountBRL] = React.useState(5000);
  const [channel, setChannel] = React.useState<Channel>('bank');
  const [commercialRate, setCommercialRate] = React.useState(5.0);
  const [providerRate, setProviderRate] = React.useState(5.3);
  const [spreadPctManual, setSpreadPctManual] = React.useState(0);
  const [tariffFee, setTariffFee] = React.useState(30);
  const [iofPct, setIofPct] = React.useState(1.1);
  const [iofBase, setIofBase] = React.useState<IofBase>('amount');
  const [extraCharges, setExtraCharges] = React.useState(0);

  const r = calculate({
    sendAmountBRL,
    channel,
    commercialRate,
    providerRate,
    spreadPctManual,
    tariffFee,
    iofPct,
    iofBase,
    extraCharges,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="rem-valor" label="Valor a enviar">
            <NumberInput
              id="rem-valor"
              value={sendAmountBRL}
              onChange={setSendAmountBRL}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Valor a enviar em reais"
            />
          </Field>

          <Field
            id="rem-canal"
            label="Canal usado"
            hint="Só para organizar a comparação — não altera o cálculo."
          >
            <Select
              id="rem-canal"
              value={channel}
              onValueChange={(v) => setChannel(v as Channel)}
              options={CHANNEL_OPTIONS}
              ariaLabel="Canal usado na remessa"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="rem-cotacao-comercial"
              label="Cotação comercial (referência)"
              hint="R$ por 1 unidade da moeda. Ex.: 5,00 = R$ 5,00 por US$ 1."
            >
              <NumberInput
                id="rem-cotacao-comercial"
                value={commercialRate}
                onChange={setCommercialRate}
                prefix="R$"
                decimals={4}
                min={0}
                ariaLabel="Cotação comercial em reais por unidade da moeda"
              />
            </Field>

            <Field
              id="rem-cotacao-provedor"
              label="Cotação do provedor"
              hint="A cotação que o banco/fintech te oferece de fato."
            >
              <NumberInput
                id="rem-cotacao-provedor"
                value={providerRate}
                onChange={setProviderRate}
                prefix="R$"
                decimals={4}
                min={0}
                ariaLabel="Cotação do provedor em reais por unidade da moeda"
              />
            </Field>
          </div>

          <Field
            id="rem-spread-manual"
            label="Spread manual (opcional)"
            hint="Se você já sabe o spread em %, informe aqui: ele tem prioridade sobre as cotações."
          >
            <NumberInput
              id="rem-spread-manual"
              value={spreadPctManual}
              onChange={setSpreadPctManual}
              suffix="%"
              decimals={2}
              min={0}
              ariaLabel="Spread manual em porcentagem"
            />
          </Field>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="rem-tarifa"
              label="Tarifa fixa"
              hint="Tarifa da operação cobrada pelo provedor."
            >
              <NumberInput
                id="rem-tarifa"
                value={tariffFee}
                onChange={setTariffFee}
                prefix="R$"
                decimals={2}
                min={0}
                ariaLabel="Tarifa fixa em reais"
              />
            </Field>

            <Field
              id="rem-extra"
              label="Outros encargos (opcional)"
              hint="Outras taxas fixas, se houver."
            >
              <NumberInput
                id="rem-extra"
                value={extraCharges}
                onChange={setExtraCharges}
                prefix="R$"
                decimals={2}
                min={0}
                ariaLabel="Outros encargos em reais"
              />
            </Field>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              id="rem-iof"
              label="Alíquota de IOF"
              hint="Informe a vigente (confira na Receita Federal). Muda por decreto."
            >
              <NumberInput
                id="rem-iof"
                value={iofPct}
                onChange={setIofPct}
                suffix="%"
                decimals={2}
                min={0}
                ariaLabel="Alíquota de IOF em porcentagem"
              />
            </Field>

            <Field
              id="rem-iof-base"
              label="Base do IOF"
              hint="Sobre o que o IOF incide na sua operação."
            >
              <Select
                id="rem-iof-base"
                value={iofBase}
                onValueChange={(v) => setIofBase(v as IofBase)}
                options={IOF_BASE_OPTIONS}
                ariaLabel="Base de incidência do IOF"
              />
            </Field>
          </div>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Custo total estimado (VET)"
            value={brl.format(r.vetTotalCost)}
            sub={
              <>
                O que você paga a mais para enviar, somando spread, IOF e
                tarifas. Equivale a {fmtPct(r.effectiveCostPct)} do valor
                enviado.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Custo do câmbio (spread)"
              value={brl.format(r.fxSpreadCost)}
              emphasis={false}
              sub={<>Spread aplicado de {fmtPct(r.spreadPct)}.</>}
            />
            <ResultStat
              label="IOF"
              value={brl.format(r.iofAmount)}
              emphasis={false}
              sub={<>Imposto sobre a operação de câmbio.</>}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Tarifas e encargos"
              value={brl.format(r.tariffTotal)}
              emphasis={false}
              sub={<>Tarifa fixa mais outros encargos informados.</>}
            />
            <ResultStat
              label="Cotação efetiva (tudo incluído)"
              value={`R$ ${rate.format(r.vetEffectiveRate)}`}
              emphasis={false}
              sub={<>Quanto cada unidade da moeda te custou de verdade.</>}
            />
          </div>

          <ResultStat
            label="Valor que chega (moeda estrangeira)"
            value={foreign.format(r.amountReceivedForeign)}
            emphasis={false}
            sub={
              <>
                Estimativa do que sobra no destino, na moeda estrangeira, depois
                de todos os custos.
              </>
            }
          />

          <p className="text-xs text-ink-3">
            Estimativa educativa a partir dos valores que você informa. Não é uma
            operação nem um fechamento de câmbio, e não busca cotação ao vivo. A
            alíquota de IOF muda por decreto — confira a vigente na Receita
            Federal. Confirme os valores exatos com o provedor antes de enviar.
          </p>
        </div>
      }
    />
  );
}
