import { calculateCompoundProjection } from '../projection';

export const GOLD_LESSON_ID = 'learn-money-02';
export const GOLD_CONCEPT_ID = 'investing.compounding-time';
export type LearningPhase = 'hook' | 'learn' | 'interact' | 'apply' | 'master' | 'reward';
export type InteractionKind = 'predict' | 'notice' | 'complete' | 'manipulate' | 'compare' | 'transfer' | 'apply' | 'retrieve';
export interface ConceptSource {
  id: string; publisher: string; title: string; url: string; type: 'institution' | 'research';
  claims: string[]; confidence: 'high'; checkedAt: string; reviewBy: string; notes: string;
}
export interface LearningConcept {
  id: string; lessonId: string; version: number; domainId: string; title: string; mentalModel: string;
  why: string; prerequisites: { id: string; description: string }[]; related: string[]; next: string[];
  misconceptions: { id: string; description: string }[]; masteryCriteria: string[];
  sources: ConceptSource[]; applications: string[]; freshness: string;
}
export const compoundingConcept: LearningConcept = {
  id: GOLD_CONCEPT_ID, lessonId: GOLD_LESSON_ID, version: 2, domainId: 'investing', title: 'Time in compounding',
  mentalModel: 'A deposit can generate growth; that growth can generate more growth. Earlier deposits have more periods in the same positive fixed-rate model. Contributions and the assumed rate also matter.',
  why: 'Separate what you put in from what a model assumes you earn. Compare timing without confusing a projection with a promise.',
  prerequisites: [{ id: 'money.contributions', description: 'A contribution is money added, not earned growth.' }, { id: 'math.percent', description: '10% of $100 is $10.' }, { id: 'money.liquidity', description: 'Emergency cash and long-term money have different jobs (learn-money-01).' }],
  related: ['investing.contributions', 'investing.growth-rate', 'money.inflation'], next: ['investing.fees', 'investing.time-horizon', 'investing.risk'],
  misconceptions: [
    { id: 'more-deposited', description: 'A higher ending value must mean more money was deposited.' },
    { id: 'linear-growth', description: 'The same amount of growth is added every period.' },
    { id: 'time-always-wins', description: 'Starting earlier beats every larger contribution or different return.' },
    { id: 'projection-promise', description: 'A smooth fixed-rate chart predicts real investment returns.' },
  ],
  masteryCriteria: ['Distinguish equal contributions from different growth.', 'Complete one growth-on-growth calculation.', 'Match a target by changing timing and contributions.', 'Resolve a changed scenario without the original investor labels.', 'Retrieve the mechanism and model limits without the chart.'],
  applications: ['Create a fictional monthly contribution scenario.', 'Save a learning rule and a review intention.'],
  freshness: 'Review annually; review sooner if the model, claims or source pages change. Numerical scenarios are reproducible, not market forecasts.',
  sources: [
    { id: 'sec-calculator', publisher: 'SEC Investor.gov', title: 'Compound Interest Calculator', url: 'https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator', type: 'institution', claims: ['contributions-time-rate', 'compound-growth'], confidence: 'high', checkedAt: '2026-10-02', reviewBy: '2027-10-02', notes: 'Supports the inputs and compounding relationship. Our figures use end-of-month deposits and a nominal annual assumption divided by 12; they are computed independently.' },
    { id: 'sec-risk', publisher: 'SEC Investor.gov', title: 'What is Risk?', url: 'https://www.investor.gov/introduction-investing/investing-basics/what-risk', type: 'institution', claims: ['returns-uncertain', 'loss-possible', 'inflation-risk'], confidence: 'high', checkedAt: '2026-10-02', reviewBy: '2027-10-02', notes: 'Supports uncertainty and potential loss. The simulation excludes fees, taxes, inflation and losses.' },
    { id: 'ies-practice', publisher: 'Institute of Education Sciences', title: 'Organizing Instruction and Study to Improve Student Learning', url: 'https://ies.ed.gov/ncee/wwc/PracticeGuide/1', type: 'research', claims: ['worked-examples', 'graphics-and-verbal', 'spaced-retrieval', 'explanatory-questions'], confidence: 'high', checkedAt: '2026-10-02', reviewBy: '2027-10-02', notes: 'Pedagogical design reference, not proof of this lesson’s effectiveness. The guide reports different evidence levels for its recommendations.' },
  ],
};
export const goldSteps: { id: string; phase: LearningPhase; title: string; kind?: InteractionKind }[] = [
  { id: 'prediction', phase: 'hook', title: 'Make a prediction', kind: 'predict' },
  { id: 'reveal', phase: 'learn', title: 'See the difference' },
  { id: 'notice', phase: 'learn', title: 'Read the relationship', kind: 'notice' },
  { id: 'worked', phase: 'learn', title: 'Build one step', kind: 'complete' },
  { id: 'manipulate', phase: 'interact', title: 'Change the inputs', kind: 'manipulate' },
  { id: 'contrast', phase: 'interact', title: 'Test the boundary', kind: 'compare' },
  { id: 'transfer', phase: 'interact', title: 'Use it somewhere new', kind: 'transfer' },
  { id: 'apply', phase: 'apply', title: 'Make it useful', kind: 'apply' },
  { id: 'retrieval', phase: 'master', title: 'Bring it back', kind: 'retrieve' },
  { id: 'reward', phase: 'reward', title: 'What you practiced' },
];
export type LearningEventName = 'first_exposure' | 'prediction_answer' | 'interaction_attempt' | 'calculation_result' | 'mechanism_result' | 'manipulation_prediction' | 'manipulation_interpretation' | 'apply_rule' | 'reflection' | 'misconception_detected' | 'retry' | 'transfer_result' | 'apply_completed' | 'retrieval_calculation' | 'retrieval_mechanism' | 'retrieval_result' | 'difficulty_rating' | 'lesson_completed';
export interface LearningEvent {
  id: string; at: number; name: LearningEventName; interactionId: string; answer?: string;
  correct?: boolean; resultCorrect?: boolean; mechanismCorrect?: boolean; misconceptionId?: string; rating?: number; assessment?: 'objective' | 'self_reported';
}
export interface GoldDraft {
  version: 2; sessionId: string; startedAt: number; step: number; updatedAt: number;
  events: LearningEvent[]; inputs: Record<string, string | number>; finished: boolean;
}
export interface ConceptEvidence {
  version: 2; firstExposedAt: number; events: LearningEvent[]; draft?: GoldDraft;
}
export function newGoldDraft(now = Date.now()): GoldDraft {
  const sessionId = `gold-${now}-${Math.random().toString(36).slice(2, 9)}`;
  return { version: 2, sessionId, startedAt: now, step: 0, updatedAt: now, finished: false,
    inputs: { startAge: 20, finishAge: 50, monthly: 100, applyMonthly: 100, applyYears: 20, applyRate: 5, cadence: 'yearly', rule: '' },
    events: [{ id: `${sessionId}-0`, at: now, name: 'first_exposure', interactionId: 'prediction' }] };
}
export function addLearningEvent(draft: GoldDraft, event: Omit<LearningEvent, 'id' | 'at'>): GoldDraft {
  const now = Date.now();
  return { ...draft, updatedAt: now, events: retainLearningEvents([...draft.events, { ...event, id: `${draft.sessionId}-${now}-${Math.random().toString(36).slice(2, 9)}`, at: now }]) };
}
/** Keep each signal's first attempt and the most recent corrections inside the existing 100-event budget. */
export function retainLearningEvents(events: LearningEvent[]): LearningEvent[] {
  if (events.length <= 100) return events;
  const first = new Map<string, LearningEvent>();
  for (const event of events) if (!first.has(event.name + ':' + event.interactionId)) first.set(event.name + ':' + event.interactionId, event);
  const ids = new Set([...first.values()].slice(0, 50).map(event => event.id));
  for (const event of [...events].reverse()) { if (ids.size >= 100) break; ids.add(event.id); }
  return events.filter(event => ids.has(event.id));
}
export function mergeEvidence(current: ConceptEvidence | undefined, draft: GoldDraft): ConceptEvidence {
  const unique = new Map((Array.isArray(current?.events) ? current.events : []).map(event => [event.id, event]));
  for (const event of draft.events) unique.set(event.id, event);
  const newest = !current?.draft || draft.updatedAt >= current.draft.updatedAt ? draft : current.draft;
  return { version: 2, firstExposedAt: current?.firstExposedAt || draft.startedAt, events: retainLearningEvents([...unique.values()].sort((a, b) => a.at - b.at)), draft: newest };
}
export function validGoldDraft(value: unknown): value is GoldDraft {
  if (!value || typeof value !== 'object') return false;
  const d = value as GoldDraft;
  const shape = d.version === 2 && typeof d.sessionId === 'string' && Number.isFinite(d.startedAt) && Number.isFinite(d.updatedAt) && Number.isInteger(d.step) && d.step >= 0 && d.step < goldSteps.length && typeof d.finished === 'boolean' && (!d.finished || d.step === 9) && Array.isArray(d.events) && d.events.length <= 100 && d.events.every(e => !!e && typeof e.id === 'string' && typeof e.name === 'string' && Number.isFinite(e.at)) && !!d.inputs && typeof d.inputs === 'object' && !Array.isArray(d.inputs) && Object.values(d.inputs).every(v => typeof v === 'string' && v.length <= 1000 || typeof v === 'number' && Number.isFinite(v));
  return shape && [['startAge',20,40],['finishAge',45,65],['monthly',25,500],['applyMonthly',25,1500],['applyYears',5,30],['applyRate',0,10]].every(([key,min,max]) => typeof d.inputs[key] === 'number' && Number(d.inputs[key]) >= Number(min) && Number(d.inputs[key]) <= Number(max)) && ['yearly','quarterly'].includes(String(d.inputs.cadence)) && typeof d.inputs.rule === 'string';
}
export const usd = (value: number) => new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value);
/** End-of-month deposits, delayed start, same end date. No market forecasts. */
export function delayedSeries(monthly: number, startYear: number, endYear: number, rate: number) {
  return Array.from({ length: endYear + 1 }, (_, year) => ({ year, ...calculateCompoundProjection(monthly, Math.max(0, year - startYear), rate) }));
}
export const equalTimingPlans = [
  { label: 'Alex · $100/month · 20 years', color: 'early', data: delayedSeries(100, 0, 20, 8) },
  { label: 'Chris · $250/month · final 8 years', color: 'late', data: delayedSeries(250, 12, 20, 8) },
];
export function targetMonthly(startAge: number, finishAge: number) {
  const target = calculateCompoundProjection(100, 30, 8).finalValue;
  return target / calculateCompoundProjection(1, finishAge - startAge, 8).finalValue;
}
export function manipulationComplete(inputs: Record<string, string | number>) {
  const age = Number(inputs.startAge), finish = Number(inputs.finishAge), monthly = Number(inputs.monthly);
  return age === 30 && finish === 50 && monthly >= targetMonthly(30, 50) && monthly < targetMonthly(30, 50) + 30;
}
export function numericAnswer(answer: string, expected: number, tolerance = 0.5) {
  return answer.trim() !== '' && Number.isFinite(Number(answer)) && Math.abs(Number(answer) - expected) <= tolerance;
}
/** Compatibility score for the existing guided-practice API, not a mastery percentage. */
export function practiceScore(draft: GoldDraft) {
  const tasks = ['notice', 'worked', 'contrast', 'transfer'];
  return tasks.filter(id => draft.events.find(event => event.name === 'interaction_attempt' && event.interactionId === id)?.correct === true).length / tasks.length * 100;
}
/** A session checkpoint requires observed participation, never a Continue-only path. */
export function canAdvanceStep(draft: GoldDraft) {
  const id = goldSteps[draft.step]?.id;
  const events = draft.events.filter(event => event.interactionId === id);
  if (id === 'prediction') return validPrediction(draft.inputs) && events.some(event => event.name === 'prediction_answer');
  if (id === 'reveal') return events.some(event => event.name === 'interaction_attempt' && event.answer === 'year-20-contributions-compared');
  if (id === 'manipulate') return manipulationComplete(draft.inputs) && events.some(event => event.name === 'manipulation_prediction') && events.filter(event => event.name === 'manipulation_interpretation').at(-1)?.correct === true;
  if (id === 'apply') return events.some(event => event.name === 'apply_completed');
  if (['notice', 'worked', 'contrast', 'transfer'].includes(id)) return events.some(event => event.name === 'interaction_attempt' && event.correct === true);
  return false;
}
export interface RetrievalVariant {
  id: string; prompt: string; context?: string; explanationPrompt: string; answer: string; expected?: number;
  options?: { id: string; label: string }[]; correctId?: string; misconceptionId: string;
  mechanismPrompt: string; mechanismOptions: { id: string; label: string }[]; mechanismId: string;
}
export const retrievalVariants: RetrievalVariant[] = [
  { mechanismPrompt: 'Why is the second increase larger?', mechanismOptions: [{ id: 'rate', label: 'The rate increases every year' }, { id: 'balance', label: 'Growth uses the new balance, including earlier growth' }, { id: 'deposit', label: 'Another $20 was deposited' }, { id: 'time', label: 'Time automatically increases the rate' }], mechanismId: 'balance', id: 'growth-on-growth', prompt: 'What is its value after two years?', context: 'A fictional fund holds $200. It grows 10% a year, with no new deposits.', explanationPrompt: 'Why is the second year’s growth different from the first?', answer: '$242: $200 → $220 → $242. Year two grows the original money and the first year’s growth. This fixed assumption is not a real-return promise.', expected: 242, misconceptionId: 'linear-growth' },
  { mechanismPrompt: 'Why does starting earlier give no growth advantage here?', mechanismOptions: [{ id: 'zero', label: 'At 0%, no growth is generated on deposits or earlier growth' }, { id: 'always', label: 'Equal deposits always finish equal, at any rate' }, { id: 'rate', label: 'Starting earlier raises the rate automatically' }], mechanismId: 'zero', id: 'zero-rate', prompt: 'Which fund ends with more?', context: 'Two funds receive the same total deposits before the same end date. One starts earlier. The model uses 0% growth.', explanationPrompt: 'What would have to change for deposit timing to affect the model?', answer: 'They are equal at 0%. Timing adds an advantage under the same positive rate because deposits and their growth get more periods. Actual returns remain uncertain.', options: [{ id: 'early', label: 'The earlier fund' }, { id: 'equal', label: 'They are equal' }, { id: 'late', label: 'The later fund' }], correctId: 'equal', misconceptionId: 'time-always-wins' },
  { mechanismPrompt: 'What explains the difference in this fixed-rate model?', mechanismOptions: [{ id: 'more', label: 'The earlier endowment received more money' }, { id: 'periods', label: 'Equal deposits get different numbers of periods for growth on growth' }, { id: 'promise', label: 'Earlier deposits guarantee a better real outcome' }], mechanismId: 'periods', id: 'new-context', prompt: 'Which endowment ends higher?', context: 'A museum places $1,000 in a fictional endowment today. Another places $1,000 five years later. Both are measured in year ten at the same positive fixed rate.', explanationPrompt: 'Explain the mechanism, and one reason the real outcome could differ.', answer: 'The earlier endowment has more periods for growth on growth. Equal deposits isolate timing in the fixed-rate model; variable returns, losses and fees can change real outcomes.', options: [{ id: 'late', label: 'The later endowment' }, { id: 'equal', label: 'They must be equal' }, { id: 'early', label: 'The earlier endowment' }], correctId: 'early', misconceptionId: 'more-deposited' },
];
export function retrievalVariant(reps: number) { return retrievalVariants[Math.max(0, Math.floor(reps)) % retrievalVariants.length]; }
export function boundedRecallScore(chosenScore: number, correct: boolean) { return correct && [40, 60, 80, 100].includes(chosenScore) ? chosenScore : 40; }

export const predictionReasons = [
  { id: 'periods', label: 'More deposits have longer to grow' },
  { id: 'deposits', label: 'More money is contributed' },
  { id: 'rate', label: 'The return is higher' },
  { id: 'unsure', label: "I'm not sure yet" },
];
export function validPrediction(inputs: GoldDraft['inputs']) {
  return ['early', 'late', 'equal', 'unsure'].includes(String(inputs.prediction)) && predictionReasons.some(reason => reason.id === inputs.predictionBasis);
}
export function coherentRule(inputs: GoldDraft['inputs']) {
  return inputs.ruleContribution === 'increase' && inputs.ruleBoundary === 'compare';
}
export const structuredRule = 'When time available is shorter, the contribution may need to increase to reach the same target at the same positive fixed rate. Starting earlier does not automatically beat every contribution or rate scenario; compare all inputs. Real returns are uncertain.';
export const goldRewardTitle = 'You practiced.';
export interface RetrievalResponse {
  result: string; mechanism: string; reflection: string;
  resultCorrect: boolean; mechanismCorrect: boolean;
}
export function assessRetrieval(variant: RetrievalVariant, result: string, mechanism: string, reflection = ''): RetrievalResponse {
  return { result, mechanism, reflection, resultCorrect: variant.expected !== undefined ? numericAnswer(result, variant.expected, 0.5) : result === variant.correctId, mechanismCorrect: mechanism === variant.mechanismId };
}
/** Separate objective signals; reflection and difficulty remain ungraded self reports. Stable bundle IDs make lost-response retries safe. */
export function retrievalEvidence(id: string, variant: RetrievalVariant, response: RetrievalResponse, chosenScore: number, at = Date.now()): LearningEvent[] {
  const correct = response.resultCorrect && response.mechanismCorrect;
  const rating = boundedRecallScore(chosenScore, correct);
  const base = { at, interactionId: variant.id };
  return [
    { ...base, id: id + '-calculation', name: 'retrieval_calculation', answer: response.result, correct: response.resultCorrect, assessment: 'objective' },
    { ...base, id: id + '-mechanism', name: 'retrieval_mechanism', answer: response.mechanism, correct: response.mechanismCorrect, assessment: 'objective' },
    ...(response.reflection ? [{ ...base, id: id + '-reflection', name: 'reflection' as const, answer: response.reflection, assessment: 'self_reported' as const }] : []),
    { ...base, id: id + '-rating', name: 'difficulty_rating', rating, assessment: 'self_reported' },
    { ...base, id, name: 'retrieval_result', correct, resultCorrect: response.resultCorrect, mechanismCorrect: response.mechanismCorrect, rating, assessment: 'objective' },
  ];
}
export function generateGoldSession(reps = 0) {
  return { concept: compoundingConcept, steps: goldSteps, retrieval: retrievalVariant(reps),
    // Remediation stays inside each interaction; no speculative adaptive curriculum.
    interactionPool: goldSteps.filter(step => step.kind).map(step => ({ id: step.id, kind: step.kind, conceptId: GOLD_CONCEPT_ID })) };
}
