'use client';

import * as React from 'react';
import { NumberInput } from '@/components/ui/NumberInput';
import { Select } from '@/components/ui/Select';
import { CalculatorShell } from '@/components/calc/CalculatorShell';
import { ResultStat } from '@/components/calc/ResultStat';
import { calculate, type Categoria } from './logic';

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

const CATEGORIAS: { value: Categoria; label: string }[] = [
  { value: 'empregado_clt', label: 'Empregado CLT (carteira assinada)' },
  { value: 'contribuinte_individual', label: 'Contribuinte individual (autônomo) — 20%' },
  { value: 'facultativo', label: 'Facultativo — 20%' },
  { value: 'facultativo_baixa_renda', label: 'Facultativo de baixa renda (CadÚnico) — 5%' },
  { value: 'mei', label: 'MEI — 5%' },
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

export function InssForm() {
  const [categoria, setCategoria] = React.useState<Categoria>('empregado_clt');
  const [remuneracao, setRemuneracao] = React.useState(3000);

  const r = calculate({ remuneracao, categoria });

  // Para baixa renda e MEI o valor é fixo (5% sobre o mínimo) e não depende da remuneração.
  const valorFixo = categoria === 'facultativo_baixa_renda' || categoria === 'mei';

  return (
    <CalculatorShell
      inputs={
        <>
          <Field id="inss-categoria" label="Categoria de contribuinte">
            <Select
              id="inss-categoria"
              value={categoria}
              onValueChange={(v) => setCategoria(v as Categoria)}
              options={CATEGORIAS}
              ariaLabel="Categoria de contribuinte do INSS"
            />
          </Field>

          <Field
            id="inss-remuneracao"
            label="Remuneração mensal"
            hint={
              valorFixo
                ? 'Nesta categoria a contribuição é fixa (5% sobre o salário mínimo), independentemente da remuneração.'
                : categoria === 'empregado_clt'
                  ? 'Salário bruto do mês, antes dos descontos.'
                  : 'Salário de contribuição que você quer declarar (mínimo R$ 1.621,00, máximo R$ 8.475,55).'
            }
          >
            <NumberInput
              id="inss-remuneracao"
              value={remuneracao}
              onChange={setRemuneracao}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Remuneração mensal em reais"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label="Contribuição mensal ao INSS"
            value={brl.format(r.contribuicao)}
            sub={
              valorFixo ? (
                <>5% sobre o salário mínimo (R$ 1.621,00) em 2026.</>
              ) : (
                <>
                  Sobre a base de {brl.format(r.base)}
                  {r.tetoAplicado && <> (limitada ao teto do INSS)</>}.
                </>
              )
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Base de cálculo"
              value={brl.format(r.base)}
              emphasis={false}
              sub={
                r.tetoAplicado ? (
                  <>Teto do salário de contribuição (R$ 8.475,55).</>
                ) : (
                  <>Salário de contribuição usado.</>
                )
              }
            />
            <ResultStat
              label="Alíquota efetiva"
              value={pct.format(r.aliquotaEfetiva)}
              emphasis={false}
              sub={
                categoria === 'empregado_clt' ? (
                  <>Menor que a nominal por ser progressiva.</>
                ) : (
                  <>Sobre a remuneração informada.</>
                )
              }
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa com base nas tabelas e valores oficiais do INSS de 2026.
            Os planos simplificado (11% sobre o mínimo) e de baixa renda (5%)
            podem limitar benefícios previdenciários. Confirme sua situação no
            INSS ou com um contador.
          </p>
        </div>
      }
    />
  );
}
