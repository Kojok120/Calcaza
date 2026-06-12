'use client';

import * as React from 'react';
import { cn } from '@/lib/cn';
import { INPUT_LOCALE } from '@/lib/format';
import { trackCalculatorUsed } from '@/lib/analytics';

type Props = {
  id?: string;
  value: number;
  onChange: (value: number) => void;
  prefix?: string;
  suffix?: string;
  unit?: string;
  min?: number;
  max?: number;
  decimals?: number;
  allowNegative?: boolean;
  placeholder?: string;
  ariaLabel?: string;
  invalid?: boolean;
  invalidMessage?: string;
  className?: string;
};

const baseFormatter = new Intl.NumberFormat(INPUT_LOCALE);
const formatParts = baseFormatter.formatToParts(12345.6);
const groupChar = formatParts.find((p) => p.type === 'group')?.value ?? ',';
const decimalChar = formatParts.find((p) => p.type === 'decimal')?.value ?? '.';

function escapeRegex(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

const groupRe = new RegExp(escapeRegex(groupChar), 'g');

function normalizeDigits(s: string): string {
  return s.replace(/[\u0660-\u0669\u06F0-\u06F9\uFF10-\uFF19]/g, (c) => {
    const code = c.charCodeAt(0);
    if (code >= 0x0660 && code <= 0x0669)
      return String.fromCharCode(code - 0x0660 + 0x30);
    if (code >= 0x06F0 && code <= 0x06F9)
      return String.fromCharCode(code - 0x06F0 + 0x30);
    return String.fromCharCode(code - 0xff10 + 0x30);
  });
}

function parseLocaleNumber(input: string, allowNegative: boolean): number | null {
  if (!input) return null;
  let s = normalizeDigits(input.trim());
  s = s.replace(groupRe, '');
  if (decimalChar !== '.') s = s.split(decimalChar).join('.');
  s = s.replace(/[^\d.\-]/g, '');
  if (!s || s === '-' || s === '.' || s === '-.') return null;
  const firstDot = s.indexOf('.');
  if (firstDot !== -1) {
    s = s.slice(0, firstDot + 1) + s.slice(firstDot + 1).replace(/\./g, '');
  }
  const negative = s.startsWith('-');
  s = s.replace(/-/g, '');
  if (negative) s = '-' + s;
  const n = Number(s);
  if (!Number.isFinite(n)) return null;
  if (!allowNegative && n < 0) return Math.abs(n);
  return n;
}

function clamp(n: number, min?: number, max?: number): number {
  let r = n;
  if (typeof min === 'number') r = Math.max(min, r);
  if (typeof max === 'number') r = Math.min(max, r);
  return r;
}

function applyDecimals(n: number, decimals: number | undefined): number {
  if (decimals === undefined) return n;
  const factor = 10 ** decimals;
  return Math.round(n * factor) / factor;
}

function rawString(value: number, decimals: number | undefined): string {
  if (!Number.isFinite(value)) return '';
  const v = applyDecimals(value, decimals);
  const s = decimals === 0 ? String(Math.trunc(v)) : String(v);
  return decimalChar === '.' ? s : s.replace('.', decimalChar);
}

export function NumberInput({
  id,
  value,
  onChange,
  prefix,
  suffix,
  unit,
  min,
  max,
  decimals,
  allowNegative = false,
  placeholder,
  ariaLabel,
  invalid,
  invalidMessage,
  className,
}: Props) {
  const trailing = suffix ?? unit;
  const errorId = id ? `${id}-error` : undefined;
  const isIntegerMode = decimals === 0;
  const treatZeroAsEmpty = placeholder !== undefined && placeholder !== '';

  const formatDisplay = React.useCallback(
    (n: number) => {
      if (!Number.isFinite(n)) return '';
      if (n === 0 && treatZeroAsEmpty) return '';
      if (decimals === undefined) return baseFormatter.format(n);
      return new Intl.NumberFormat(INPUT_LOCALE, {
        minimumFractionDigits: 0,
        maximumFractionDigits: decimals,
      }).format(n);
    },
    [decimals, treatZeroAsEmpty]
  );

  const [focused, setFocused] = React.useState(false);
  const [draft, setDraft] = React.useState(() => formatDisplay(value));

  React.useEffect(() => {
    if (!focused) setDraft(formatDisplay(value));
  }, [value, focused, formatDisplay]);

  function handleFocus(e: React.FocusEvent<HTMLInputElement>) {
    setFocused(true);
    const next =
      value === 0 && treatZeroAsEmpty ? '' : rawString(value, decimals);
    setDraft(next);
    const node = e.target;
    requestAnimationFrame(() => {
      try {
        node.select();
      } catch {
        // ignore: select can throw on detached nodes
      }
      try {
        node.scrollIntoView({ block: 'center', behavior: 'smooth' });
      } catch {
        // ignore: older browsers without smooth-scroll options
      }
    });
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    trackCalculatorUsed();
    const raw = e.target.value;
    const normalized = normalizeDigits(raw);
    let cleaned = normalized.replace(/[^\d.,\-]/g, '');
    if (!allowNegative) cleaned = cleaned.replace(/-/g, '');
    if (isIntegerMode)
      cleaned = cleaned.replace(groupRe, '').split(decimalChar)[0];
    setDraft(cleaned);

    const parsed = parseLocaleNumber(cleaned, allowNegative);
    if (parsed === null) return;
    onChange(applyDecimals(parsed, decimals));
  }

  function handleBlur() {
    setFocused(false);
    const parsed = parseLocaleNumber(draft, allowNegative);
    if (parsed === null) {
      const fallback = Number.isFinite(value) ? value : 0;
      onChange(fallback);
      setDraft(formatDisplay(fallback));
      return;
    }
    const bounded = clamp(applyDecimals(parsed, decimals), min, max);
    onChange(bounded);
    setDraft(formatDisplay(bounded));
  }

  const hasPrefix = !!prefix;
  const hasSuffix = !!trailing;

  return (
    <div className={cn('relative', className)}>
      <div
        className={cn(
          'flex items-stretch overflow-hidden rounded-md border-[1.5px] bg-field',
          'transition-[border-color,box-shadow] duration-150',
          'focus-within:ring-[3px] focus-within:ring-brand-100',
          invalid
            ? 'border-danger-500'
            : 'border-border-strong focus-within:border-brand-500'
        )}
      >
        {hasPrefix && (
          <span className="grid place-items-center pl-3.5 text-sm text-ink-3">
            {prefix}
          </span>
        )}
        <input
          id={id}
          type="text"
          inputMode={isIntegerMode ? 'numeric' : 'decimal'}
          enterKeyHint="done"
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          value={draft}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onChange={handleChange}
          placeholder={placeholder}
          aria-label={ariaLabel}
          aria-invalid={invalid || undefined}
          aria-describedby={invalid && errorId ? errorId : undefined}
          className={cn(
            'tabular block h-14 w-full min-w-0 border-0 bg-transparent px-4 text-lg font-semibold text-ink-1 outline-none',
            'placeholder:font-normal placeholder:text-ink-4'
          )}
        />
        {hasSuffix && (
          <span className="grid place-items-center pr-3.5 text-sm text-ink-3">
            {trailing}
          </span>
        )}
      </div>
      {invalid && invalidMessage && (
        <p id={errorId} className="mt-1 text-xs text-danger-500">
          {invalidMessage}
        </p>
      )}
    </div>
  );
}
