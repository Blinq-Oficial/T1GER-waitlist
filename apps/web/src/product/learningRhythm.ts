import type { Mission, Profile } from '../state';
import { isComplete } from './webProgress';
import type { BrainState } from './brainService';

export function dayKey(date: Date, timeZone?: string): string {
  try {
    const parts = new Intl.DateTimeFormat('en-CA', { timeZone, year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(date);
    return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)?.value).join('-');
  } catch { return dayKey(date); }
}

function timestamp(value: Mission['completedAt']): number | null {
  if (typeof value === 'number' && Number.isFinite(value)) return value;
  if (value && typeof value === 'object' && Number.isFinite(value.seconds)) return value.seconds * 1000;
  return null;
}

/** Read persisted completions only; these goals do not grant extra XP or rewards. */
export function dailyLearningGoals(brain: Pick<BrainState, 'missionHistory'>, missions: Mission[], timeZone?: string, now = new Date()) {
  const today = dayKey(now, timeZone);
  const isToday = (at: number | null) => at !== null && Number.isFinite(at) && at <= now.getTime() && dayKey(new Date(at), timeZone) === today;
  const records = brain.missionHistory.filter(record => record.completed && isToday(record.timestamp));
  const learned = records.some(record => record.missionId.startsWith('learn-'));
  const applied = records.some(record => record.missionId.startsWith('field-learn-')) || missions.some(mission => isComplete(mission) && isToday(timestamp(mission.completedAt)));
  return { learned, applied, completed: Number(learned) + Number(applied) };
}

/** Display only. The server remains authoritative for streaks, XP and rewards. */
export function learningRhythm(profile: Pick<Profile, 'streak' | 'lastVerifiedMissionDay' | 'timeZone'>, missions: Mission[], now = new Date()) {
  const today = dayKey(now, profile.timeZone);
  const anchor = new Date(today + 'T12:00:00Z');
  const days = Array.from({ length: 7 }, (_, index) => {
    const date = new Date(anchor); date.setUTCDate(date.getUTCDate() - 6 + index);
    return { key: date.toISOString().slice(0, 10), label: new Intl.DateTimeFormat('en', { weekday: 'short', timeZone: 'UTC' }).format(date) };
  });
  const completedDays = new Set(missions.filter(isComplete).flatMap(mission => {
    const at = timestamp(mission.completedAt); return at === null ? [] : [dayKey(new Date(at), profile.timeZone)];
  }));
  if (profile.lastVerifiedMissionDay && profile.lastVerifiedMissionDay <= today) completedDays.add(profile.lastVerifiedMissionDay);
  const last = [...completedDays].filter(key => key <= today).sort().at(-1);
  const alive = last === today || last === days[5].key;
  return { today, doneToday: completedDays.has(today), streak: alive ? Math.max(0, profile.streak || 0) : 0,
    previousStreak: Math.max(0, profile.streak || 0), activeDays: days.filter(day => completedDays.has(day.key)).length,
    days: days.map(day => ({ ...day, applied: completedDays.has(day.key), today: day.key === today })) };
}
