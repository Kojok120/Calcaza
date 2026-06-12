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

export function ImpostoDeRendaForm() {
  const [rendimentos, setRendimentos] = React.useState(60000);
  const [irrfRetido, setIrrfRetido] = React.useState(3000);
  const [dependentes, setDependentes] = React.useState(0);
  const [educacao, setEducacao] = React.useState(0);
  const [saude, setSaude] = React.useState(0);
  const [previdencia, setPrevidencia] = React.useState(0);

  const r = calculate({
    rendimentosTributaveisAnuais: rendimentos,
    impostoRetidoNaFonte: irrfRetido,
    dependentes,
    despesasComEducacao: educacao,
    despesasComSaude: saude,
    contribuicaoPrevidenciaria: previdencia,
  });

  // Valor exibido do acerto sempre como magnitude positiva; a situação dá o sinal.
  const valorAcerto = brl.format(Math.abs(r.restituirOuPagar));
  const isRestituir = r.situacao === 'a restituir';
  const isPagar = r.situacao === 'a pagar';

  return (
    <CalculatorShell
      inputs={
        <>
          <Field
            id="ir-rendimentos"
            label="Rendimentos tributáveis no ano"
            hint="Soma dos rendimentos tributáveis do ano (salários, pró-labore, aluguéis etc.)."
          >
            <NumberInput
              id="ir-rendimentos"
              value={rendimentos}
              onChange={setRendimentos}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="Rendimentos tributáveis anuais em reais"
            />
          </Field>

          <Field
            id="ir-retido"
            label="IRRF já retido na fonte no ano"
            hint="Imposto de Renda retido pela fonte pagadora ao longo do ano (veja no comprovante de rendimentos)."
          >
            <NumberInput
              id="ir-retido"
              value={irrfRetido}
              onChange={setIrrfRetido}
              prefix="R$"
              decimals={2}
              min={0}
              ariaLabel="IRRF retido na fonte em reais"
            />
          </Field>

          <Field
            id="ir-dependentes"
            label="Número de dependentes"
            hint="Cada dependente deduz R$ 2.275,08 por ano no modelo completo."
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
            id="ir-educacao"
            label="Despesas com educação no ano (opcional)"
            hint="Instrução própria e de dependentes. Limite de R$ 3.561,50 por pessoa."
          >
            <NumberInput
              id="ir-educacao"
              value={educacao}
              onChange={setEducacao}
              prefix="R$"
              decimals={2}
              min={0}
              placeholder="0,00"
              ariaLabel="Despesas com educação em reais"
            />
          </Field>

          <Field
            id="ir-saude"
            label="Despesas com saúde no ano (opcional)"
            hint="Médicos, dentistas, planos de saúde e exames. Sem limite legal."
          >
            <NumberInput
              id="ir-saude"
              value={saude}
              onChange={setSaude}
              prefix="R$"
              decimals={2}
              min={0}
              placeholder="0,00"
              ariaLabel="Despesas com saúde em reais"
            />
          </Field>

          <Field
            id="ir-previdencia"
            label="Contribuição ao INSS no ano (opcional)"
            hint="Contribuição previdenciária oficial paga no ano (deduz no modelo completo)."
          >
            <NumberInput
              id="ir-previdencia"
              value={previdencia}
              onChange={setPrevidencia}
              prefix="R$"
              decimals={2}
              min={0}
              placeholder="0,00"
              ariaLabel="Contribuição previdenciária em reais"
            />
          </Field>
        </>
      }
      result={
        <div className="grid gap-3">
          <ResultStat
            label={
              isRestituir
                ? 'Valor aproximado a restituir'
                : isPagar
                  ? 'Imposto aproximado a pagar'
                  : 'Acerto do ano'
            }
            value={valorAcerto}
            sub={
              isRestituir ? (
                <>
                  Estimativa de restituição: você reteve mais do que o imposto
                  devido de {brl.format(r.impostoDevido)}.
                </>
              ) : isPagar ? (
                <>
                  Estimativa de imposto a pagar: o devido de{' '}
                  {brl.format(r.impostoDevido)} superou o IRRF retido.
                </>
              ) : (
                <>Declaração quitada: o retido cobriu o imposto devido.</>
              )
            }
          />

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Imposto devido no ano"
              value={brl.format(r.impostoDevido)}
              emphasis={false}
              sub={
                <>
                  Modelo {r.modeloUsado} (o mais vantajoso). Base de cálculo:{' '}
                  {brl.format(r.baseCalculo)}.
                </>
              }
            />
            <ResultStat
              label="Alíquota efetiva"
              value={pct.format(r.aliquotaEfetiva)}
              emphasis={false}
              sub={
                <>
                  Alíquota nominal da faixa: {pct.format(r.aliquotaNominal)}.
                </>
              }
            />
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <ResultStat
              label="Pelo modelo simplificado"
              value={brl.format(r.impostoSimplificado)}
              emphasis={false}
              sub={<>Desconto de 20%, limitado a R$ 17.640,00.</>}
            />
            <ResultStat
              label="Pelo modelo completo"
              value={brl.format(r.impostoCompleto)}
              emphasis={false}
              sub={<>Deduções reais: dependentes, educação, saúde e INSS.</>}
            />
          </div>

          <p className="text-xs text-ink-3">
            Estimativa do ajuste anual do IRPF com base na tabela e nas deduções
            oficiais de 2026 da Receita Federal. Não substitui o programa oficial
            da declaração nem considera rendimentos isentos, de tributação
            exclusiva ou regras específicas. Confirme os valores na declaração.
          </p>
        </div>
      }
    />
  );
}
