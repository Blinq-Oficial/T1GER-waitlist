/** Display helpers never calculate or grant learning rewards. */
export function compactCount(value: number): string {
  const count = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  return new Intl.NumberFormat('en', { notation: count >= 1000 ? 'compact' : 'standard', maximumFractionDigits: count >= 1000 ? 1 : 0 }).format(count);
}

/** Each visual milestone spans 200 already credited practice XP. */
export function practiceMilestone(value: number) {
  const xp = Number.isFinite(value) ? Math.max(0, Math.floor(value)) : 0;
  const start = Math.floor(xp / 200) * 200;
  return { xp, start, next: start + 200, earned: xp - start, remaining: start + 200 - xp, percent: (xp - start) / 2 };
}
