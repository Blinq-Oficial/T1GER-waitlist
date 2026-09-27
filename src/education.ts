// Web teaching briefs. Keep IDs aligned with the mobile curriculum; review these
// before copying the web wording back to mobile or publishing another path.
export interface EducationBrief {
  capability: string;
  prerequisites: string[];
  nextConcepts: string[];
  model: string;
  misconception: string;
  limits: string;
  retrievalPrompt: string;
  retrievalAnswer: string;
  sources: { title: string; publisher: string; url: string; supports: string }[];
  lastVerified: string;
  reviewBy: string;
}

export const educationBriefs: Record<string, EducationBrief> = {
  'learn-money-01': {
    capability: 'Distinguish emergency liquidity from money assigned to a long-term goal, and estimate purchasing power under an explicit inflation assumption.',
    prerequisites: [],
    nextConcepts: ['learn-money-02'],
    model: 'A nominal balance can stay flat while purchasing power falls. A cash reserve has a separate job: meeting unexpected expenses.',
    misconception: 'Inflation means all cash is a mistake. Accessible emergency savings can be valuable even when their purchasing power changes.',
    limits: 'The example assumes 3% annual inflation, 0% interest on cash, and no taxes. Actual inflation and savings rates vary. This is a scenario, not a forecast.',
    retrievalPrompt: 'Why might you keep emergency cash even if inflation reduces its purchasing power?',
    retrievalAnswer: 'Its purpose is liquidity for unexpected needs. Money for longer goals can have a different plan and risk profile.',
    sources: [
      { title: 'What is Risk?', publisher: 'SEC Investor.gov', url: 'https://www.investor.gov/introduction-investing/investing-basics/what-risk', supports: 'Inflation can erode purchasing power; investments also carry risk.' },
      { title: 'An essential guide to building an emergency fund', publisher: 'Consumer Financial Protection Bureau', url: 'https://www.consumerfinance.gov/an-essential-guide-to-building-an-emergency-fund/', supports: 'Emergency savings are accessible reserves for unplanned expenses; the target depends on circumstances.' },
    ],
    lastVerified: '2026-09-27',
    reviewBy: '2027-09-27',
  },
  'learn-money-02': {
    capability: 'Explain how the timing of equal total contributions changes a simplified compound-growth projection, then set a sustainable review rule.',
    prerequisites: ['learn-money-01'],
    nextConcepts: ['learn-money-03'],
    model: 'In a fixed-rate model, each earlier deposit has more compounding periods. Compare plans with equal total contributions to isolate timing.',
    misconception: 'The projected 8% is a promise, or starting earlier guarantees a gain. Real returns vary and investments can lose value.',
    limits: 'The illustration assumes end-of-month deposits and a constant annual rate divided by 12, compounded monthly. It excludes fees, taxes, inflation and market losses. It is not a forecast or recommendation.',
    retrievalPrompt: 'With equal total deposits and the same assumed rate, why can the earlier plan end higher?',
    retrievalAnswer: 'Earlier deposits spend more months in the model, so any modeled growth has more time to compound. Actual investment returns are uncertain.',
    sources: [
      { title: 'Compound Interest Calculator', publisher: 'SEC Investor.gov', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator', supports: 'The educational model separates monthly contribution, time horizon, assumed rate and compounding frequency.' },
      { title: 'Introduction to Investing', publisher: 'SEC Investor.gov', url: 'https://www.investor.gov/introduction-investing', supports: 'Regular contributions and time can support long-term goals; all investments have risk.' },
    ],
    lastVerified: '2026-09-27',
    reviewBy: '2027-09-27',
  },
};

export function cashPurchasingPower(cash: number, years: number, inflationPercent: number) {
  return cash / (1 + inflationPercent / 100) ** years;
}
