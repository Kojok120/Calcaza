import { describe, it, expect } from 'vitest';
import { calculate } from './logic';

describe('_template calculate', () => {
  it('doubles a positive number', () => {
    expect(calculate({ value: 5 }).result).toBe(10);
  });
  it('returns 0 for NaN', () => {
    expect(calculate({ value: Number.NaN }).result).toBe(0);
  });
});
