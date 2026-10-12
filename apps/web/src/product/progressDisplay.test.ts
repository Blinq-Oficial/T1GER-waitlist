import { describe, expect, it } from 'vitest';
import { compactCount, practiceMilestone } from './progressDisplay';
describe('small-screen progress counts', () => {
  it('keeps small counts exact and bounds long counters', () => {
    expect(compactCount(105)).toBe('105');
    expect(compactCount(9999)).toBe('9,999');
    expect(compactCount(1250000)).toBe('1.3M');
  });
  it('does not display invalid or negative counters', () => {
    expect(compactCount(NaN)).toBe('0');
    expect(compactCount(-2)).toBe('0');
  });
});

describe('practice milestones', () => {
  it('uses the current interval instead of total lifetime XP', () => {
    expect(practiceMilestone(1050)).toEqual({ xp: 1050, start: 1000, next: 1200, earned: 50, remaining: 150, percent: 25 });
    expect(practiceMilestone(199).percent).toBe(99.5);
    expect(practiceMilestone(200)).toEqual({ xp: 200, start: 200, next: 400, earned: 0, remaining: 200, percent: 0 });
  });
  it('handles invalid and negative profile counters without NaN in the UI', () => {
    expect(practiceMilestone(NaN).percent).toBe(0);
    expect(practiceMilestone(-10).remaining).toBe(200);
  });
});
