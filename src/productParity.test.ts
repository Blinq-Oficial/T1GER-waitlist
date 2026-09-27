import { describe, expect, it } from 'vitest';
import { DEFAULT_BRAIN_STATE, processMissionResult, processMissionReview } from './product/brainService';
import { getInteractiveTrack } from './product/interactiveCurriculum';
import { getJourneyNodes } from './product/learningJourney';
import { buildMasterySnapshot } from './product/masteryService';

describe('mobile learning state on web', () => {
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
});
