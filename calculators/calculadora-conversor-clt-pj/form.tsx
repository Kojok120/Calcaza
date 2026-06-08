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

export function ConversorCltPjForm() {
  const [salarioBrutoClt, setSalarioBrutoClt] = React.useState(5000);
  const [dependentes, setDependentes] = React.useState(0);
  const [beneficiosMensais, setBeneficiosMensais] = React.useState(0);
  const [taxaImpostoPj, setTaxaImpostoPj] = React.useState(6);
  const [custoContadorPj, setCustoContadorPj] = React.useState(0);

  const r = calculate({
    salarioBrutoClt,
    dependentes,
    beneficiosMensais,
    taxaImpostoPj,
    custoContadorPj,
  });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="cp-bruto" label="Salário bruto CLT (mensal)">
            <NumberInput
              id="cp-bruto"
              value={salarioBrutoClt}
              onChange={setSalarioBrutoClt}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Salário bruto CLT mensal em reais"
            />
          </Field>

          <Field
            id="cp-dependentes"
            label="Número de dependentes"
            hint="Dependentes para fins de Imposto de Renda."
          >
            <NumberInput
              id="cp-dependentes"
              value={dependentes}
              onChange={setDependentes}
              decimals={0}
              min={0}
              max={20}
              ariaLabel="Número de dependentes"
            />
          </Field>

          <Field
            id="cp-beneficios"
            label="Benefícios mensais (opcional)"
            hint="Valor mensal de VR/VA, plano de saúde e outros benefícios da CLT."
          >
            <NumberInput
              id="cp-beneficios"
              value={beneficiosMensais}
              onChange={setBeneficiosMensais}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Benefícios mensais em reais"
            />
          </Field>

          <Field
            id="cp-taxa-pj"
            label="Imposto do PJ sobre o faturamento"
            hint="Padrão 6% (Simples Nacional, Anexo III, 1ª faixa). Confirme a sua com o contador."
          >
            <NumberInput
              id="cp-taxa-pj"
              value={taxaImpostoPj}
              onChange={setTaxaImpostoPj}
              suffix="%"
              decimals={2}
              min={0}
              max={99}
              ariaLabel="Alíquota de imposto do PJ em porcentagem"
            />
          </Field>

          <Field
            id="cp-contador"
            label="Custo do contador (mensal, opcional)"
            hint="Honorários mensais da contabilidade do PJ."
          >
            <NumberInput
              id="cp-contador"
              value={custoContadorPj}
              onChange={setCustoContadorPj}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Custo mensal do contador em reais"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Faturamento PJ equivalente (mensal)"
            value={brl.format(r.faturamentoPjEquivalente)}
            sub={
              <>
                Quanto faturar como PJ para, após imposto e contador, igualar o
                pacote da CLT.
              </>
            }
          />

          <ResultStat
            label="Pacote mensal equivalente CLT"
            value={brl.format(r.pacoteTotalClt)}
            emphasis={false}
            sub={
              <>Líquido + 13º + férias com 1/3 + FGTS + benefícios, por mês.</>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Salário líquido CLT"
              value={brl.format(r.salarioLiquidoClt)}
              emphasis={false}
              sub={<>Bruto menos INSS ({brl.format(r.inss)}) e IRRF ({brl.format(r.irrf)}).</>}
            />
            <ResultStat
              label="FGTS por mês (8%)"
              value={brl.format(r.fgtsMensal)}
              emphasis={false}
              sub={<>Depósito que a empresa faz na conta do FGTS.</>}
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="13º diluído por mês"
              value={brl.format(r.decimoTerceiroMensal)}
              emphasis={false}
              sub={<>Salário bruto dividido por 12.</>}
            />
            <ResultStat
              label="Férias + 1/3 diluídas"
              value={brl.format(r.feriasMaisTercoMensal)}
              emphasis={false}
              sub={<>(Bruto + 1/3) dividido por 12.</>}
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa simplificada com base nas tabelas de INSS e IRRF de 2026.
            Não inclui o INSS do próprio PJ, o pró-labore nem provisão para meses
            sem trabalho — o faturamento real necessário tende a ser maior. Não é
            recomendação de mudar de regime; consulte um contador.
          </p>
        </div>
      }
    />
  );
}
