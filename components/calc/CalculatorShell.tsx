import * as React from 'react';
import { cn } from '@/lib/cn';

type Props = {
  inputs: React.ReactNode;
  result: React.ReactNode;
  className?: string;
};

export function CalculatorShell({ inputs, result, className }: Props) {
  return (
    <section
      className={cn(
        'overflow-hidden rounded-md border border-border-default bg-surface-0',
        className
      )}
      aria-labelledby="calc-heading"
    >
      <h2 id="calc-heading" className="sr-only">
        Calculadora
      </h2>

      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)]">
        <div className="border-b border-border-default bg-surface-1 p-5 sm:p-7 lg:border-b-0 lg:border-e">
          <p className="text-xs font-medium uppercase tracking-wider text-ink-3">
            Dados
          </p>
          <div className="mt-4 grid gap-4">{inputs}</div>
        </div>

        <div
          role="region"
          aria-labelledby="result-heading"
          aria-live="polite"
          aria-atomic="true"
          className="bg-surface-0 p-5 sm:p-7"
        >
          <h3
            id="result-heading"
            className="text-xs font-medium uppercase tracking-wider text-ink-3"
          >
            Resultado
          </h3>
          <div className="mt-4">{result}</div>
        </div>
      </div>
    </section>
  );
}
