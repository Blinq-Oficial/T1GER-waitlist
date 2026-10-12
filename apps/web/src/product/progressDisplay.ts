/** Display helpers never calculate or grant learning rewards. */
export function compactCount(value: number): string {
  const count = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return new Intl.NumberFormat('en', { notation: count >= 10000 ? 'compact' : 'standard', maximumFractionDigits: count >= 10000 ? 1 : 0 }).format(count);
}
