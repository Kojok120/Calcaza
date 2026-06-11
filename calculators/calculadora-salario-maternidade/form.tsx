'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type TipoSegurada } from './logic';

const brl = new Intl.NumberFormat('pt-BR', {
  style: 'currency',
  currency: 'BRL',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

const TIPOS: { value: TipoSegurada; label: string }[] = [
  { value: 'empregada_clt', label: 'Empregada (CLT)' },
  {
    value: 'contribuinte_individual',
    label: 'Contribuinte individual / facultativa',
  },
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

export function SalarioMaternidadeForm() {
  const [tipoSegurada, setTipoSegurada] =
    React.useState<TipoSegurada>('empregada_clt');
  const [salarioMensal, setSalarioMensal] = React.useState(3000);
  const [mediaUltimos12, setMediaUltimos12] = React.useState(3000);

  const isClt = tipoSegurada === 'empregada_clt';

  const r = calculate({ tipoSegurada, salarioMensal, mediaUltimos12 });

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="sm-tipo" label="Tipo de segurada">
            <Select
              id="sm-tipo"
              value={tipoSegurada}
              onValueChange={(v) => setTipoSegurada(v as TipoSegurada)}
              options={TIPOS}
              ariaLabel="Tipo de segurada perante o INSS"
            />
          </Field>

          {isClt ? (
            <Field
              id="sm-salario"
              label="Remuneração mensal integral"
              hint="Salário do mês com carteira assinada. A empregada CLT recebe o salário integral durante o benefício."
            >
              <NumberInput
                id="sm-salario"
                value={salarioMensal}
                onChange={setSalarioMensal}
                prefix="R$"
                decimals={2}
                min={0}
                ariaLabel="Remuneração mensal integral em reais"
              />
            </Field>
          ) : (
            <Field
              id="sm-media"
              label="Média dos 12 últimos salários de contribuição"
              hint="Média do que você recolheu ao INSS nos 12 últimos meses. O valor respeita o piso (R$ 1.621,00) e o teto (R$ 8.475,55)."
            >
              <NumberInput
                id="sm-media"
                value={mediaUltimos12}
                onChange={setMediaUltimos12}
                prefix="R$"
                decimals={2}
                min={0}
                ariaLabel="Média dos 12 últimos salários de contribuição em reais"
              />
            </Field>
          )}
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Total estimado dos 120 dias"
            value={brl.format(r.valorTotal)}
            sub={
              <>
                Equivale a 4 parcelas mensais de {brl.format(r.valorMensal)}{' '}
                durante o benefício.
              </>
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Valor mensal"
              value={brl.format(r.valorMensal)}
              emphasis={false}
              sub={
                r.tetoAplicado ? (
                  <>Limitado ao teto do INSS (R$ 8.475,55).</>
                ) : r.pisoAplicado ? (
                  <>Ajustado ao piso (salário mínimo de R$ 1.621,00).</>
                ) : isClt ? (
                  <>Salário integral pago pela empresa.</>
                ) : (
                  <>Média dos 12 últimos salários de contribuição.</>
                )
              }
            />
            <ResultStat
              label="Valor da diária"
              value={brl.format(r.diaria)}
              emphasis={false}
              sub={<>Valor mensal dividido por 30 dias.</>}
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa com base nas regras e nos valores oficiais do INSS de
            2026 (duração de 120 dias). A empregada CLT recebe o salário
            integral, pago pela empresa e ressarcido pelo INSS; a contribuinte
            individual e a facultativa recebem pela média, com piso de R$
            1.621,00 e teto de R$ 8.475,55. Confirme sua situação no INSS ou com
            um contador.
          </p>
        </div>
      }
    />
  );
}
