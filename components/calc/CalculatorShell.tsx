'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { EDITORIAL_DESK } from '@/lib/editorial';
import {
  CalcHeroContext,
  CalcStampContext,
  type CalcHero,
  type CalcHeroRegistry,
} from './calc-context';

type Props = {
  inputs: React.ReactNode;
  result: React.ReactNode;
  className?: string;
};

export function CalculatorShell({ inputs, result, className }: Props) {
  const stamp = React.useContext(CalcStampContext);
  const receiptRef = React.useRef<HTMLDivElement | null>(null);

  // O primeiro ResultStat com emphasis registrado vira o valor-herói da barra fixa
  const heroesRef = React.useRef(new Map<string, CalcHero>());
  const [hero, setHero] = React.useState<CalcHero | null>(null);
  const registry = React.useMemo<CalcHeroRegistry>(() => {
    const sync = () => {
      const first = heroesRef.current.values().next();
      setHero(first.done ? null : first.value);
    };
    return {
      report(id, h) {
        heroesRef.current.set(id, h);
        sync();
      },
      remove(id) {
        heroesRef.current.delete(id);
        sync();
      },
    };
  }, []);

  return (
    <CalcHeroContext.Provider value={registry}>
      <section
        className={cn(
          'shadow-ledger overflow-hidden rounded-lg border border-border-strong bg-field',
          className
        )}
        aria-labelledby="calc-heading"
      >
        <h2 id="calc-heading" className="sr-only">
          Calculadora
        </h2>

        {/* Faixa de cabeçalho — cálculo na hora */}
        <div className="head-band flex items-center gap-2.5 border-b border-border-default px-5 py-3 sm:px-6">
          <span className="live-dot shrink-0" aria-hidden />
          <span className="font-display text-[15px] font-bold tracking-[0.18em] text-brand-700">
            Cálculo na hora
          </span>
          <span className="ml-auto hidden text-xs tracking-[0.03em] text-ink-3 sm:inline">
            O resultado é atualizado conforme você preenche
          </span>
        </div>

        <div className="grid lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)]">
          {/* Entradas — página esquerda do livro-caixa */}
          <div className="bg-ledger-ruled border-b border-border-default p-5 sm:p-7 lg:border-b-0 lg:border-r">
            <p className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-ink-3">
              <span aria-hidden>― </span>Entradas<span aria-hidden> ―</span>
            </p>
            <div className="mt-4 grid gap-4">{inputs}</div>
          </div>

          {/* Resultado — detalhamento */}
          <div
            ref={receiptRef}
            role="region"
            aria-labelledby="result-heading"
            aria-live="polite"
            aria-atomic="true"
            className="relative bg-field p-5 sm:p-7"
          >
            {stamp && <HankoStamp date={stamp} />}
            <h3
              id="result-heading"
              className="font-display text-[11px] font-bold uppercase tracking-[0.25em] text-ink-3"
            >
              <span aria-hidden>― </span>Detalhamento<span aria-hidden> ―</span>
            </h3>
            <div className="mt-4">{result}</div>
          </div>
        </div>

        {/* Rodapé de fontes e edição */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-border-default bg-surface-1 px-5 py-3.5 text-xs text-ink-2 sm:px-6">
          <span>
            Fontes: Receita Federal e dados oficiais (detalhes na explicação
            abaixo)
          </span>
          <span className="ml-auto inline-flex items-center gap-2">
            <span
              aria-hidden
              className="font-display grid h-[22px] w-[22px] shrink-0 place-items-center rounded-full bg-brand-700 text-[11px] font-bold text-surface-0"
            >
              C
            </span>
            Preparado e verificado pela {EDITORIAL_DESK.name}
          </span>
        </div>
      </section>

      <StickyResultBar hero={hero} watchRef={receiptRef} />
    </CalcHeroContext.Provider>
  );
}

/** Carimbo de verificação em vermelhão. Decorativo, portanto aria-hidden. */
function HankoStamp({ date }: { date: string }) {
  return (
    <div
      aria-hidden
      className="hanko-stamp font-display pointer-events-none absolute right-4 top-4 flex h-[68px] w-[68px] rotate-[-7deg] select-none flex-col items-center justify-center rounded-full border-[2.5px] border-shu text-shu opacity-90 sm:right-6 sm:h-[74px] sm:w-[74px]"
    >
      <span className="pointer-events-none absolute inset-[3px] rounded-full border border-shu/55" />
      <span className="text-[10px] font-bold leading-tight tracking-[0.12em]">
        CALCAZA
      </span>
      <span className="tabular text-[8.5px] font-semibold tracking-[0.05em]">
        {date}
      </span>
    </div>
  );
}

/** Barra fixa de resultado, exibida no celular quando o detalhamento sai da tela */
function StickyResultBar({
  hero,
  watchRef,
}: {
  hero: CalcHero | null;
  watchRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [show, setShow] = React.useState(false);

  React.useEffect(() => {
    const el = watchRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;
    const io = new IntersectionObserver(
      ([entry]) => setShow(!entry.isIntersecting),
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [watchRef]);

  if (!hero) return null;

  const visible = show;
  return (
    <div
      aria-hidden
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 flex items-center gap-3 px-5 pt-2.5',
        'bg-brand-700 text-surface-0 dark:bg-brand-100 dark:text-ink-1',
        'pb-[calc(0.625rem+env(safe-area-inset-bottom))]',
        'transition-transform duration-300 ease-[cubic-bezier(.2,.7,.2,1)] lg:hidden',
        visible ? 'translate-y-0' : 'pointer-events-none translate-y-full'
      )}
    >
      <span className="min-w-0 truncate text-[11px] tracking-[0.08em] opacity-75">
        {hero.label}
      </span>
      <span className="tabular ml-auto shrink-0 text-xl font-semibold">
        {hero.value}
      </span>
    </div>
  );
}
