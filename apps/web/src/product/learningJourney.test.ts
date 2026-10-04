import { describe, expect, it } from 'vitest';
import { createEmptyCard } from 'ts-fsrs';
import { DEFAULT_BRAIN_STATE } from './brainService';
import { getInteractiveTrack } from './interactiveCurriculum';
import { getJourneyAction, getJourneyNodes } from './learningJourney';

describe('learner path previews and next actions', () => {
  const track = getInteractiveTrack('smart-money');
  it('allows a preview without giving locked lessons a launch action', () => {
    const nodes = getJourneyNodes(track, DEFAULT_BRAIN_STATE, [], 1000);
    expect(getJourneyAction(nodes[0])).toEqual({ label: 'Start lesson', destination: 'lesson' });
    expect(getJourneyAction(nodes[1], true).destination).toBeNull();
  });
  it('continues pending Apply and preserves completed revisits', () => {
    const nodes = getJourneyNodes(track, DEFAULT_BRAIN_STATE, ['field-learn-money-01'], 1000);
    expect(getJourneyAction(nodes[0], true).label).toBe('Revisit lesson');
    expect(getJourneyAction(nodes[1], true).label).toBe('Resume lesson');
    const further = getJourneyNodes(track, DEFAULT_BRAIN_STATE, ['field-learn-money-01', 'field-learn-money-02'], 1000);
    expect(getJourneyAction(further[2], true).label).toBe('Continue Apply');
  });
  it('routes a due prerequisite to review even when Apply is pending', () => {
    const brain = { ...DEFAULT_BRAIN_STATE, fsrsCards: { 'learn-money-01': createEmptyCard(new Date(900)) } };
    const nodes = getJourneyNodes(track, brain, ['field-learn-money-01'], 1000);
    expect(nodes[0].state).toBe('completed');
    expect(getJourneyAction(nodes[1], true)).toEqual({ label: 'Review first', destination: 'review' });
    expect(getJourneyAction(nodes[2]).destination).toBeNull();
  });
});
