import { describe, expect, it } from 'vitest';
import { calculateCompoundProjection } from '../projection';
import { addLearningEvent, boundedRecallScore, canAdvanceStep, equalTimingPlans, generateGoldSession, manipulationComplete, mergeEvidence, newGoldDraft, numericAnswer, practiceScore, retrievalVariants, targetMonthly, validGoldDraft } from './learningEngine';

describe('Gold concept engine', () => {
  it('reproduces the closed formula with an independent monthly ledger', () => {
    for (const [monthly, years, rate] of [[100,20,8], [250,8,8], [100,30,8], [300,20,8], [25,5,0]]) {
      let balance = 0;
      for (let month = 0; month < years * 12; month++) balance = balance * (1 + rate / 1200) + monthly;
      expect(calculateCompoundProjection(monthly, years, rate).finalValue).toBeCloseTo(balance, 7);
    }
    const [early, late] = equalTimingPlans;
    expect(early.data[20].contributed).toBe(24000);
    expect(late.data[20].contributed).toBe(24000);
    expect(late.data[12].finalValue).toBe(0);
    expect(early.data[20].finalValue).toBeGreaterThan(late.data[20].finalValue);
    expect(calculateCompoundProjection(300,20,8).finalValue).toBeGreaterThan(calculateCompoundProjection(100,30,8).finalValue);
  });
  it('gates participation and checks the matching task, rather than an arbitrary slider touch', () => {
    const draft = newGoldDraft();
    expect(canAdvanceStep(draft)).toBe(false);
    expect(canAdvanceStep(addLearningEvent(draft, { name: 'prediction_answer', interactionId: 'prediction', answer: 'equal' }))).toBe(true);
    expect(canAdvanceStep({ ...draft, step: 3 })).toBe(false);
    expect(canAdvanceStep(addLearningEvent({ ...draft, step: 3 }, { name: 'interaction_attempt', interactionId: 'worked', correct: false }))).toBe(false);
    expect(canAdvanceStep(addLearningEvent({ ...draft, step: 3 }, { name: 'interaction_attempt', interactionId: 'worked', correct: true }))).toBe(true);
    expect(manipulationComplete({startAge:30,finishAge:50,monthly:Math.ceil(targetMonthly(30,50)/5)*5})).toBe(true);
    expect(manipulationComplete({startAge:20,finishAge:50,monthly:100})).toBe(false);
    expect(manipulationComplete({startAge:30,finishAge:50,monthly:500})).toBe(false);
  });
  it('never treats blank numeric input or a wrong retrieval as mastered', () => {
    expect(numericAnswer('',0)).toBe(false);
    expect(numericAnswer('NaN',121)).toBe(false);
    expect(numericAnswer('120',121,0.01)).toBe(false);
    expect(numericAnswer('121',121,0.01)).toBe(true);
    expect(boundedRecallScore(100,false)).toBe(40);
    expect(boundedRecallScore(80,true)).toBe(80);
    expect(200 * 1.1 ** 2).toBeCloseTo(242);
    expect(1000 * 1.05 ** 5).toBeCloseTo(1276.28);
    expect(1000 * 1.05 ** 10).toBeCloseTo(1628.89);
  });
  it('merges evidence idempotently without discarding another session or rewinding newer progress', () => {
    const draft = newGoldDraft(100);
    const saved = mergeEvidence(undefined,draft);
    expect(mergeEvidence(saved,draft).events).toHaveLength(1);
    const next = { ...addLearningEvent(draft,{name:'interaction_attempt',interactionId:'worked',correct:false}), step:3, updatedAt:200 };
    const merged = mergeEvidence(saved,next);
    expect(merged.events).toHaveLength(2);
    expect(mergeEvidence(merged,draft).draft?.step).toBe(3);
    expect(merged.firstExposedAt).toBe(100);
  });
  it('preserves first-attempt errors instead of reporting every completed practice as perfect', () => {
    let draft = newGoldDraft();
    for (const id of ['notice','worked','contrast','transfer']) {
      draft = addLearningEvent(draft,{ name:'interaction_attempt', interactionId:id, correct:id !== 'worked' });
    }
    draft = addLearningEvent(draft,{name:'interaction_attempt',interactionId:'worked',correct:true});
    expect(practiceScore(draft)).toBe(75);
    expect(practiceScore(newGoldDraft())).toBe(0);
    // Equal duration, different calendar dates: both museum funds grow for ten periods.
    expect(15 - 5).toBe(10);
    expect(1000 * 1.05 ** (15 - 5)).toBeCloseTo(1000 * 1.05 ** (10 - 0));
  });
  it('validates resume shape and varies retrieval using actual FSRS repetitions', () => {
    const draft = newGoldDraft();
    expect(validGoldDraft(JSON.parse(JSON.stringify(draft)))).toBe(true);
    expect(validGoldDraft({...draft,step:99})).toBe(false);
    expect(validGoldDraft({...draft,inputs:{monthly:Infinity}})).toBe(false);
    expect(validGoldDraft({...draft,events:new Array(101).fill({})})).toBe(false);
    expect(generateGoldSession(0).retrieval.id).not.toBe(generateGoldSession(1).retrieval.id);
    expect(generateGoldSession(3).retrieval.id).toBe(retrievalVariants[0].id);
    expect(generateGoldSession().steps).toHaveLength(10);
  });
});
