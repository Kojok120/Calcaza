'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { INPUT_LOCALE } from '@/lib/format';
import { CalcHeroContext } from './calc-context';

type Props = {
  label: string;
  value: string;
  sub?: React.ReactNode;
  emphasis?: boolean;
  className?: string;
};

// Separadores do locale (pt-BR: milhar "." e decimal ",")
const localeParts = new Intl.NumberFormat(INPUT_LOCALE).formatToParts(12345.6);
const GROUP_CHAR =
  localeParts.find((p) => p.type === 'group')?.value ?? '.';
const DECIMAL_CHAR =
  localeParts.find((p) => p.type === 'decimal')?.value ?? ',';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const NUM_RE = new RegExp(
  `-?\\d[\\d${escapeRegex(GROUP_CHAR)}]*(?:${escapeRegex(DECIMAL_CHAR)}\\d+)?`,
  'g'
);
const GROUP_RE = new RegExp(escapeRegex(GROUP_CHAR), 'g');
const TWEEN_DURATION = 320;

type NumToken = { value: number; decimals: number; grouped: boolean };
type Segments = { texts: string[]; nums: NumToken[] };

function parseSegments(s: string): Segments {
  const texts: string[] = [];
  const nums: NumToken[] = [];
  let last = 0;
  for (const m of s.matchAll(NUM_RE)) {
    const raw = m[0];
    const idx = m.index ?? 0;
    texts.push(s.slice(last, idx));
    const dot = raw.indexOf(DECIMAL_CHAR);
    nums.push({
      value: Number(
        raw.replace(GROUP_RE, '').replace(DECIMAL_CHAR, '.')
      ),
      decimals: dot === -1 ? 0 : raw.length - dot - DECIMAL_CHAR.length,
      grouped: raw.includes(GROUP_CHAR),
    });
    last = idx + raw.length;
  }
  texts.push(s.slice(last));
  return { texts, nums };
}

function formatToken(n: number, token: NumToken): string {
  const fixed = n.toFixed(token.decimals);
  const neg = fixed.startsWith('-');
  const body = neg ? fixed.slice(1) : fixed;
  const [int, frac] = body.split('.');
  const groupedInt = token.grouped
    ? int.replace(/\B(?=(\d{3})+(?!\d))/g, GROUP_CHAR)
    : int;
  return (
    (neg ? '-' : '') + groupedInt + (frac ? DECIMAL_CHAR + frac : '')
  );
}

function interpolate(from: Segments, to: Segments, eased: number): string {
  let out = '';
  for (let i = 0; i < to.nums.length; i++) {
    const a = from.nums[i].value;
    const b = to.nums[i];
    out += to.texts[i] + formatToken(a + (b.value - a) * eased, b);
  }
  return out + to.texts[to.texts.length - 1];
}

/**
 * Transição de contagem (~320ms / ease-out).
 * Interpola apenas os trechos numéricos da string, preservando o símbolo de
 * moeda e as unidades. Em mudanças de estrutura ou com prefers-reduced-motion,
 * a troca é imediata.
 */
function useNumericTween(target: string): string {
  const [display, setDisplay] = React.useState(target);
  const displayRef = React.useRef(target);
  const mountedRef = React.useRef(false);
  const rafRef = React.useRef(0);

  React.useEffect(() => {
    if (!mountedRef.current) {
      mountedRef.current = true;
      displayRef.current = target;
      return;
    }
    const from = displayRef.current;
    if (from === target) return;

    const reduced =
      typeof window.matchMedia === 'function' &&
      window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const a = parseSegments(from);
    const b = parseSegments(target);
    const compatible =
      !reduced &&
      b.nums.length > 0 &&
      a.nums.length === b.nums.length &&
      a.texts.join(' ') === b.texts.join(' ');

    if (!compatible) {
      displayRef.current = target;
      setDisplay(target);
      return;
    }

    const t0 = performance.now();
    cancelAnimationFrame(rafRef.current);
    const frame = (t: number) => {
      const p = Math.min(1, (t - t0) / TWEEN_DURATION);
      const eased = 1 - Math.pow(1 - p, 3);
      const out = p >= 1 ? target : interpolate(a, b, eased);
      displayRef.current = out;
      setDisplay(out);
      if (p < 1) rafRef.current = requestAnimationFrame(frame);
    };
    rafRef.current = requestAnimationFrame(frame);
    return () => cancelAnimationFrame(rafRef.current);
  }, [target]);

  return display;
}

/** Reduz o "R$" inicial e o pinta de tinta (estilo do valor-herói do detalhamento) */
function HeroAmount({ text }: { text: string }) {
  const m = text.match(/^R\$\s?(.*)$/u);
  if (!m) return <>{text}</>;
  return (
    <>
      <span className="font-display mr-1 align-baseline text-[0.52em] font-bold text-ink-2">
        R$
      </span>
      {m[1]}
    </>
  );
}

export function ResultStat({
  label,
  value,
  sub,
  emphasis = true,
  className,
}: Props) {
  const display = useNumericTween(value);

  // Entrega o primeiro ResultStat com emphasis à barra fixa de resultado
  const registry = React.useContext(CalcHeroContext);
  const heroId = React.useId();
  React.useEffect(() => {
    if (!registry || !emphasis) return;
    registry.report(heroId, { label, value });
  }, [registry, emphasis, heroId, label, value]);
  React.useEffect(() => {
    if (!registry || !emphasis) return;
    return () => registry.remove(heroId);
  }, [registry, emphasis, heroId]);

  if (!emphasis) {
    // Linha do detalhamento (com linha pontilhada)
    return (
      <div className={cn('py-0.5', className)}>
        <div className="flex items-baseline gap-2.5 text-sm">
          <span className="shrink-0 text-ink-2">{label}</span>
          <span aria-hidden className="dotted-leader" />
          <span className="tabular shrink-0 font-semibold text-ink-1">
            {display}
          </span>
        </div>
        {sub && <div className="mt-1 text-xs text-ink-3">{sub}</div>}
      </div>
    );
  }

  // Valor-herói (número grande em índigo)
  return (
    <div className={className}>
      <p className="text-[13px] font-bold tracking-[0.05em] text-ink-2">
        {label}
      </p>
      <p className="tabular mt-0.5 text-4xl font-semibold leading-[1.15] tracking-[-0.01em] text-brand-700 sm:text-5xl">
        <HeroAmount text={display} />
      </p>
      {sub && <div className="mt-2 text-sm text-ink-2">{sub}</div>}
    </div>
  );
}
