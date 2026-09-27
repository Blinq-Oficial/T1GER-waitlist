// Identical monthly end-of-period contribution model to mobile MicroToolLab.
export function calculateCompoundProjection(monthly: number, years: number, annualRatePercent: number) {
  const months = years * 12;
  const monthlyRate = annualRatePercent / 100 / 12;
  const finalValue = monthlyRate === 0 ? monthly * months : monthly * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate);
  const contributed = monthly * months;
  return { contributed, growth: Math.max(0, finalValue - contributed), finalValue };
}

export function compoundSeries(monthly: number, years: number, annualRatePercent: number) {
  return Array.from({ length: years + 1 }, (_, year) => ({ year, ...calculateCompoundProjection(monthly, year, annualRatePercent) }));
}
