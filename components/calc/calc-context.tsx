'use client';

import * as React from 'react';

/** Valor-herói exibido na barra fixa de resultado (registrado pelo primeiro ResultStat com emphasis). */
export type CalcHero = { label: string; value: string };

export type CalcHeroRegistry = {
  report: (id: string, hero: CalcHero) => void;
  remove: (id: string) => void;
};

export const CalcHeroContext = React.createContext<CalcHeroRegistry | null>(
  null
);

/**
 * Mês/ano de verificação gravado no carimbo (ex.: "JUN 2026").
 * A página monta o valor a partir de meta.reviewedAt ?? meta.updatedAt e o
 * fornece via Provider. É o caminho para chegar ao CalculatorShell sem tocar
 * em nenhum form.tsx das calculadoras.
 */
export const CalcStampContext = React.createContext<string | null>(null);

export function CalcStampProvider({
  stamp,
  children,
}: {
  stamp: string;
  children: React.ReactNode;
}) {
  return (
    <CalcStampContext.Provider value={stamp}>
      {children}
    </CalcStampContext.Provider>
  );
}
