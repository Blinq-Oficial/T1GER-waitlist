import type { Mission, Profile } from '../state';
import { isComplete } from './webProgress';

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
