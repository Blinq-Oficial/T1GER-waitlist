import { describe, expect, it } from 'vitest';
import { calculateCompoundProjection } from './projection';
import { cashPurchasingPower, educationBriefs } from './education';

describe('mobile-compatible compound projection', () => {
  it('matches end-of-month deposits and zero-rate behavior', () => {
    expect(calculateCompoundProjection(100, 20, 8).finalValue).toBeCloseTo(58902.04, 0);
    expect(calculateCompoundProjection(200, 8, 8).finalValue).toBeCloseTo(26773.72, 0);
    expect(calculateCompoundProjection(100, 10, 0)).toEqual({ contributed: 12000, growth: 0, finalValue: 12000 });
  });
});

describe('web education models', () => {
  it('isolates timing with equal deposits and makes cash assumptions explicit', () => {
    const early = calculateCompoundProjection(100, 20, 8);
    const late = calculateCompoundProjection(250, 8, 8);
    expect(early.contributed).toBe(late.contributed);
    expect(early.finalValue).toBeCloseTo(58902.04, 0);
    expect(late.finalValue).toBeCloseTo(33467.15, 0);
    expect(early.finalValue).toBeGreaterThan(late.finalValue);
    expect(cashPurchasingPower(1000, 5, 3)).toBeCloseTo(862.61, 0);
  });

  it('keeps source and review metadata for both published web lessons', () => {
    for (const id of ['learn-money-01', 'learn-money-02']) {
      const brief = educationBriefs[id];
      expect(brief.sources.length).toBeGreaterThanOrEqual(2);
      expect(brief.sources.every(source => source.url.startsWith('https://'))).toBe(true);
      expect(Date.parse(brief.reviewBy)).toBeGreaterThan(Date.parse(brief.lastVerified));
    }
  });
});
