import { describe, expect, it } from 'vitest';
import { calculateCompoundProjection } from './projection';

describe('mobile-compatible compound projection', () => {
  it('matches end-of-month deposits and zero-rate behavior', () => {
    expect(calculateCompoundProjection(100, 20, 8).finalValue).toBeCloseTo(58902.04, 0);
    expect(calculateCompoundProjection(200, 8, 8).finalValue).toBeCloseTo(26773.72, 0);
    expect(calculateCompoundProjection(100, 10, 0)).toEqual({ contributed: 12000, growth: 0, finalValue: 12000 });
  });
});
