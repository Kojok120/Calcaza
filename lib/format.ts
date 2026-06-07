import { SITE_CURRENCY, SITE_INTL_LOCALE } from './site';

export const INPUT_LOCALE = SITE_INTL_LOCALE;

const currencyFormatter = new Intl.NumberFormat(SITE_INTL_LOCALE, {
  style: 'currency',
  currency: SITE_CURRENCY,
  maximumFractionDigits: 0,
});
const numberFormatter = new Intl.NumberFormat(SITE_INTL_LOCALE);
const percentFormatter = new Intl.NumberFormat(SITE_INTL_LOCALE, {
  style: 'percent',
  maximumFractionDigits: 1,
});

export function fmtCurrency(value: number): string {
  if (!Number.isFinite(value)) return currencyFormatter.format(0);
  return currencyFormatter.format(Math.round(value));
}

export function fmtNumber(value: number): string {
  if (!Number.isFinite(value)) return numberFormatter.format(0);
  return numberFormatter.format(Math.round(value));
}

export function fmtPercent(value: number): string {
  if (!Number.isFinite(value)) return percentFormatter.format(0);
  return percentFormatter.format(value);
}
