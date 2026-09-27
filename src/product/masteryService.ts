import type { Card } from 'ts-fsrs';
import type { BrainState, MissionRecord } from './brainService';
import { ALL_ATOMIC_LESSONS } from './interactiveCurriculum';
import type { AtomicLesson } from './interactiveCurriculumTypes';

export interface MasteryItem {
  lesson: AtomicLesson;
  card: Card;
  latestScore: number;
  learnedAt: number;
  dueAt: Date;
}

export interface MasterySnapshot {
  due: MasteryItem[];
  recent: MasteryItem[];
  weak: MasteryItem[];
  learnedCount: number;
  isCaughtUp: boolean;
  strength: {
    learning: number;
    reviewing: number;
    relearning: number;
    total: number;
  };
}

const toDate = (value: Date | string | number): Date => value instanceof Date ? value : new Date(value);

const latestCompletedByMission = (records: MissionRecord[]): Map<string, MissionRecord> => {
  const latest = new Map<string, MissionRecord>();
  for (const record of records) {
    if (!record.completed) continue;
    const current = latest.get(record.missionId);
    if (!current || record.timestamp > current.timestamp) latest.set(record.missionId, record);
  }
  return latest;
};

/**
 * Projects persisted learning history and FSRS cards into Master UI data.
 * This function never invents progress: every item requires a completed lesson
 * record and a scheduler card already owned by the learner.
 */
export function buildMasterySnapshot(brain: BrainState, now: Date = new Date()): MasterySnapshot {
  const latestRecords = latestCompletedByMission(brain.missionHistory);

  const items = ALL_ATOMIC_LESSONS.flatMap((lesson): MasteryItem[] => {
    const record = latestRecords.get(lesson.id);
    const card = brain.fsrsCards?.[lesson.id];
    if (!record || !card) return [];

    return [{
      lesson,
      card,
      latestScore: record.score,
      learnedAt: record.timestamp,
      dueAt: toDate(card.due),
    }];
  });

  const due = items
    .filter((item) => item.card.state !== 0 && item.dueAt.getTime() <= now.getTime())
    .sort((a, b) => a.dueAt.getTime() - b.dueAt.getTime());
  const recent = [...items].sort((a, b) => b.learnedAt - a.learnedAt).slice(0, 3);
  const weak = items
    .filter((item) => item.card.state === 3 || (item.latestScore < 75 && item.card.reps <= 1))
    .sort((a, b) => a.latestScore - b.latestScore)
    .slice(0, 3);

  return {
    due,
    recent,
    weak,
    learnedCount: items.length,
    isCaughtUp: due.length === 0,
    strength: {
      learning: items.filter((item) => item.card.state === 1).length,
      reviewing: items.filter((item) => item.card.state === 2).length,
      relearning: items.filter((item) => item.card.state === 3).length,
      total: items.length,
    },
  };
}
