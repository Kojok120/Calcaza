'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type TipoRescisao } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const TIPO_OPTIONS = [
  { value: 'sem_justa_causa', label: 'Demissão sem justa causa' },
  { value: 'pedido_demissao', label: 'Pedido de demissão' },
  { value: 'acordo_mutuo', label: 'Acordo (comum acordo)' },
  { value: 'justa_causa', label: 'Demissão por justa causa' },
];

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

function VerbaRow({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-baseline justify-between gap-3 border-b border-border-default py-2 last:border-b-0">
      <span className="text-sm text-ink-2">{label}</span>
      <span className="tabular text-sm font-medium text-ink-1">
        {brl.format(value)}
      </span>
    </div>
  );
}

export function RescisaoForm() {
  const [salarioBruto, setSalarioBruto] = React.useState(3000);
  const [tipoRescisao, setTipoRescisao] =
    React.useState<TipoRescisao>('sem_justa_causa');
  const [diasTrabalhadosNoMes, setDiasTrabalhadosNoMes] = React.useState(15);
  const [mesesTrabalhadosAno, setMesesTrabalhadosAno] = React.useState(6);
  const [mesesAquisitivoFerias, setMesesAquisitivoFerias] = React.useState(6);
  const [feriasVencidas, setFeriasVencidas] = React.useState('nao');
  const [anosCompletos, setAnosCompletos] = React.useState(2);
  const [saldoFgts, setSaldoFgts] = React.useState(10000);
  const [dependentes, setDependentes] = React.useState(0);

  const r = calculate({
    salarioBruto,
    tipoRescisao,
    diasTrabalhadosNoMes,
    mesesTrabalhadosAno,
    mesesAquisitivoFerias,
    feriasVencidas: feriasVencidas === 'sim',
    anosCompletos,
    saldoFgts,
    dependentes,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="rc-tipo" label="Tipo de rescisão">
            <Select
              id="rc-tipo"
              value={tipoRescisao}
              onValueChange={(v) => setTipoRescisao(v as TipoRescisao)}
              options={TIPO_OPTIONS}
              ariaLabel="Tipo de rescisão"
            />
          </Field>

          <Field id="rc-bruto" label="Salário bruto mensal">
            <NumberInput
              id="rc-bruto"
              value={salarioBruto}
              onChange={setSalarioBruto}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário bruto mensal em reais"
            />
          </Field>

          <Field
            id="rc-dias"
            label="Dias trabalhados no mês da saída"
            hint="De 0 a 30 dias (saldo de salário do último mês)."
          >
            <NumberInput
              id="rc-dias"
              value={diasTrabalhadosNoMes}
              onChange={setDiasTrabalhadosNoMes}
              decimals={0}
              min={0}
              max={30}
              ariaLabel="Dias trabalhados no mês"
            />
          </Field>

          <Field
            id="rc-anos"
            label="Anos completos de serviço"
            hint="Usado no aviso prévio (3 dias por ano, até 90)."
          >
            <NumberInput
              id="rc-anos"
              value={anosCompletos}
              onChange={setAnosCompletos}
              decimals={0}
              min={0}
              max={50}
              ariaLabel="Anos completos de serviço"
            />
          </Field>

          <Field
            id="rc-meses13"
            label="Meses para o 13º proporcional"
            hint="Meses trabalhados no ano com 15 dias ou mais (0 a 12)."
          >
            <NumberInput
              id="rc-meses13"
              value={mesesTrabalhadosAno}
              onChange={setMesesTrabalhadosAno}
              decimals={0}
              min={0}
              max={12}
              ariaLabel="Meses trabalhados no ano para o 13º"
            />
          </Field>

          <Field
            id="rc-mesesferias"
            label="Meses para as férias proporcionais"
            hint="Meses do período aquisitivo em curso (0 a 12)."
          >
            <NumberInput
              id="rc-mesesferias"
              value={mesesAquisitivoFerias}
              onChange={setMesesAquisitivoFerias}
              decimals={0}
              min={0}
              max={12}
              ariaLabel="Meses do período aquisitivo das férias"
            />
          </Field>

          <Field
            id="rc-feriasvencidas"
            label="Tem férias vencidas a receber?"
            hint="Período de férias já completo e ainda não gozado."
          >
            <Select
              id="rc-feriasvencidas"
              value={feriasVencidas}
              onValueChange={setFeriasVencidas}
              options={SIM_NAO}
              ariaLabel="Tem férias vencidas a receber"
            />
          </Field>

          <Field
            id="rc-fgts"
            label="Saldo de FGTS (opcional)"
            hint="Total depositado na conta vinculada (base da multa)."
          >
            <NumberInput
              id="rc-fgts"
              value={saldoFgts}
              onChange={setSaldoFgts}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Saldo de FGTS em reais"
            />
          </Field>

          <Field
            id="rc-dependentes"
            label="Número de dependentes (opcional)"
            hint="Dependentes para fins de Imposto de Renda."
          >
            <NumberInput
              id="rc-dependentes"
              value={dependentes}
              onChange={setDependentes}
              decimals={0}
              min={0}
              max={20}
              ariaLabel="Número de dependentes"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Total líquido estimado da rescisão"
            value={brl.format(r.totalLiquido)}
            sub={
              <>
                Proventos de {brl.format(r.totalProventos)} menos descontos de{' '}
                {brl.format(r.totalDescontos)}.
              </>
            }
          />

          <div className="rounded-md border border-border-default bg-surface-1 p-4 sm:p-5">
            <p className="text-sm font-medium text-ink-2">Verbas (proventos)</p>
            <div className="mt-2">
              <VerbaRow label="Saldo de salário" value={r.saldoSalario} />
              <VerbaRow
                label={`Aviso prévio (${r.avisoPrevioDias} dias)`}
                value={r.avisoPrevio}
              />
              <VerbaRow
                label="13º salário proporcional"
                value={r.decimoTerceiroProporcional}
              />
              <VerbaRow
                label="Férias proporcionais + 1/3"
                value={r.feriasProporcionais}
              />
              <VerbaRow
                label="Férias vencidas + 1/3"
                value={r.feriasVencidas}
              />
              <VerbaRow label="Multa do FGTS" value={r.multaFgts} />
            </div>
          </div>

          <div className="rounded-md border border-border-default bg-surface-1 p-4 sm:p-5">
            <p className="text-sm font-medium text-ink-2">Descontos</p>
            <div className="mt-2">
              <VerbaRow
                label="INSS sobre o saldo de salário"
                value={r.inssSaldoSalario}
              />
              <VerbaRow label="INSS sobre o 13º" value={r.inssDecimoTerceiro} />
              <VerbaRow
                label="IRRF sobre o saldo de salário"
                value={r.irrfSaldoSalario}
              />
              <VerbaRow label="IRRF sobre o 13º" value={r.irrfDecimoTerceiro} />
            </div>
          </div>

          <p className="text-xs text-ink-3">
            Estimativa com base nas regras da CLT e nas tabelas de INSS e IRRF de
            2026. Não substitui o cálculo oficial do RH nem a orientação de um
            contador ou advogado trabalhista.
          </p>
        </div>
      }
    />
  );
}
