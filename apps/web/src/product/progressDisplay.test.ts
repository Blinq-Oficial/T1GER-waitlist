import { describe, expect, it } from 'vitest';
import { compactCount } from './progressDisplay';
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
