'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type Input } from './logic';

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

const QUEM_AVISA_OPTIONS = [
  { value: 'empregador', label: 'O empregador (demissão sem justa causa)' },
  { value: 'empregado', label: 'O empregado (pedido de demissão)' },
];

const TIPO_OPTIONS = [
  { value: 'indenizado', label: 'Indenizado (pago, sem trabalhar)' },
  { value: 'trabalhado', label: 'Trabalhado (cumprido em atividade)' },
];

export function AvisoPrevioForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(3000);
  const [anosCompletos, setAnosCompletos] = React.useState(5);
  const [quemAvisa, setQuemAvisa] =
    React.useState<Input['quemAvisa']>('empregador');
  const [tipo, setTipo] = React.useState<Input['tipo']>('indenizado');

  const r = calculate({ salarioBruto, anosCompletos, quemAvisa, tipo });

  const meses = Math.floor(r.diasAviso / 30);
  const diasResto = r.diasAviso % 30;
  const duracaoTexto =
    meses > 0
      ? `Cerca de ${meses} ${meses === 1 ? 'mês' : 'meses'}${
          diasResto > 0 ? ` e ${diasResto} dias` : ''
        }.`
      : 'Período mínimo de aviso.';

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="ap-salario" label="Salário bruto mensal">
            <NumberInput
              id="ap-salario"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário bruto mensal em reais"
            />
          </Field>

          <Field
            id="ap-anos"
            label="Anos completos de serviço"
            hint="Tempo no mesmo empregador, em anos completos."
          >
            <NumberInput
              id="ap-anos"
              value={anosCompletos}
              onChange={setAnosCompletos}
              decimals={0}
              min={0}
              max={60}
              ariaLabel="Anos completos de serviço no mesmo empregador"
            />
          </Field>

          <Field
            id="ap-quem"
            label="Quem deu o aviso?"
            hint="O proporcional por ano só se aplica quando o empregador demite."
          >
            <Select
              id="ap-quem"
              value={quemAvisa}
              onValueChange={(v) => setQuemAvisa(v as Input['quemAvisa'])}
              options={QUEM_AVISA_OPTIONS}
              ariaLabel="Quem deu o aviso prévio"
            />
          </Field>

          <Field id="ap-tipo" label="Tipo de aviso">
            <Select
              id="ap-tipo"
              value={tipo}
              onValueChange={(v) => setTipo(v as Input['tipo'])}
              options={TIPO_OPTIONS}
              ariaLabel="Tipo de aviso prévio"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Dias de aviso prévio"
            value={`${r.diasAviso} dias`}
            sub={
              <>
                {duracaoTexto}
                {r.acrescimoDias > 0 ? (
                  <> Inclui {r.acrescimoDias} dias proporcionais ao tempo de serviço.</>
                ) : quemAvisa === 'empregado' ? (
                  <> Pedido de demissão: 30 dias fixos, sem proporcional.</>
                ) : (
                  <> Apenas a base de 30 dias.</>
                )}
              </>
            }
          />

          <ResultStat
            label={
              tipo === 'indenizado'
                ? 'Valor do aviso indenizado (estimado)'
                : 'Salário do período de aviso (estimado)'
            }
            value={brl.format(r.valorAviso)}
            sub={
              <>
                Com base em {brl.format(r.salarioDia)} por dia ({r.diasAviso} dias).
              </>
            }
          />

          {tipo === 'trabalhado' && quemAvisa === 'empregador' && (
            <p className="text-xs text-ink-3">
              No aviso trabalhado por iniciativa do empregador, a CLT prevê
              redução de 2 horas por dia ou a falta de 7 dias corridos no fim do
              período, sem desconto no salário.
            </p>
          )}

          <p className="text-xs text-ink-3">
            Estimativa simplificada do aviso prévio com base na Lei nº
            12.506/2011 e na CLT. Não substitui o cálculo da rescisão completa
            nem orientação de um contador ou advogado.
          </p>
        </div>
      }
    />
  );
}
