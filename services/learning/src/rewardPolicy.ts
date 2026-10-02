/** UTC challenge days: deterministic across participants and daylight-saving changes. */
export function longestDailyRun(days: string[]): number {
  let previous = -Infinity;
  let current = 0;
  let best = 0;
  for (const day of [...new Set(days)].sort()) {
    const value = Date.parse(`${day}T00:00:00Z`);
    if (!Number.isFinite(value)) continue;
    current = value - previous === 86_400_000 ? current + 1 : 1;
    best = Math.max(best, current);
    previous = value;
  }
  return best;
}
