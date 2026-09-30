import { describe, expect, it } from 'vitest';
import { DEFAULT_BRAIN_STATE, processMissionResult, processMissionReview } from './product/brainService';
import { getInteractiveTrack } from './product/interactiveCurriculum';
import { getJourneyNodes } from './product/learningJourney';
import { buildMasterySnapshot } from './product/masteryService';
import type { BrainState } from './product/brainService';

describe('mobile learning state on web', () => {
  it('keeps new Psychology progress separate from legacy mobile Stoicism', () => {
    const legacy: BrainState = { ...DEFAULT_BRAIN_STATE, missionHistory: [{ missionId: 'field-learn-mindset-01', completed: true, score: 100, timestamp: Date.now(), competency: 'mindset', difficulty: 'easy' }], fsrsCards: {}, completedDayIds: [] };
    const track = getInteractiveTrack('mindset-stoic');
    expect(track.lessons[0].id).toBe('learn-psychology-v1-01');
    expect(getJourneyNodes(track, legacy)[0].state).toBe('current');
    expect(getJourneyNodes(track, legacy)[1].state).toBe('locked');
    const learned = processMissionResult(legacy, track.lessons[0].id, true, 100);
    const applied = processMissionResult(learned, `field-${track.lessons[0].id}`, true, 100);
    expect(applied.missionHistory.some(item => item.missionId === 'field-learn-mindset-01')).toBe(true);
    expect(getJourneyNodes(track, applied)[0].state).toBe('completed');
    expect(buildMasterySnapshot(applied).recent[0].lesson.id).toBe(track.lessons[0].id);
  });
  it('keeps Apply as the gate and schedules a review using canonical IDs', () => {
    const start = { ...DEFAULT_BRAIN_STATE, missionHistory: [], fsrsCards: {}, completedDayIds: [] };
    const learned = processMissionResult(start, 'learn-money-01', true, 100);
    expect(getJourneyNodes(getInteractiveTrack('smart-money'), learned)[0].state).toBe('current');
    const applied = processMissionResult(learned, 'field-learn-money-01', true, 100);
    expect(getJourneyNodes(getInteractiveTrack('smart-money'), applied)[1].state).toBe('current');
    expect(applied.fsrsCards['learn-money-01']).toBeDefined();
    const restored = JSON.parse(JSON.stringify(applied));
    const reviewed = processMissionReview(restored, 'learn-money-01', 80);
    expect(reviewed.fsrsCards['learn-money-01']).toBeDefined();
    expect(reviewed.missionHistory).toHaveLength(applied.missionHistory.length);
    expect(buildMasterySnapshot(reviewed).learnedCount).toBe(1);
  });

  it('shows only genuinely due concepts and the next real review date', () => {
    const start = { ...DEFAULT_BRAIN_STATE, missionHistory: [], fsrsCards: {}, completedDayIds: [] };
    const learned = processMissionResult(start, 'learn-money-01', true, 100);
    const now = new Date('2026-09-27T12:00:00Z');
    const futureDue = new Date('2026-10-02T12:00:00Z');
    const futureState = { ...learned, fsrsCards: { ...learned.fsrsCards, 'learn-money-01': { ...learned.fsrsCards['learn-money-01'], due: futureDue } } };
    const future = buildMasterySnapshot(futureState, now);
    expect(future.due).toHaveLength(0);
    expect(future.nextDueAt).toEqual(futureDue);
    const applied = processMissionResult(futureState, 'field-learn-money-01', true, 100);
    const futureLearning = { ...applied, fsrsCards: { ...applied.fsrsCards, 'learn-money-01': { ...applied.fsrsCards['learn-money-01'], state: 1 as const, due: futureDue } } };
    expect(buildMasterySnapshot(futureLearning, now).due).toHaveLength(0);
    expect(getJourneyNodes(getInteractiveTrack('smart-money'), futureLearning, [], now.getTime())[1].state).toBe('current');
    const pastState = { ...learned, fsrsCards: { ...learned.fsrsCards, 'learn-money-01': { ...learned.fsrsCards['learn-money-01'], due: new Date('2026-09-26T12:00:00Z') } } };
    const past = buildMasterySnapshot(pastState, now);
    expect(past.due.map(item => item.lesson.id)).toEqual(['learn-money-01']);
    expect(past.nextDueAt).toBeNull();
  });
});
