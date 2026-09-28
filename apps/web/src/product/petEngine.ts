import { AndroidScreenTimeService } from './androidScreenTimeService';

export type PetCareStatus = 'thriving' | 'stable' | 'neglected' | 'critical_energy';

export interface T1gerPetState {
  health: number;
  hunger: number;
  energy: number;
  strength: number;
  dailyScreenTimeLimitMinutes: number;
  dailyXPGoal: number;
  todayXPEarned: number;
  todayBuildActionsCompleted: number;
  totalFocusMinutesToday: number;
  lastFedTimestamp: number;
  lastFocusTimestamp: number;
  timesPettedToday: number;
  lastPetTimestamp: number;
  metricsDate?: string;
  lastRescueDate?: string;
  lastRescueMissionId?: string;
  careStatus?: PetCareStatus;
  isDeadOrCritical?: boolean;
  resuscitationCount?: number;
}

const localDate = (timestamp: number = Date.now()): string => {
  const date = new Date(timestamp);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export const DEFAULT_PET_STATE: T1gerPetState = {
  health: 100,
  hunger: 15,
  energy: 30,
  strength: 75,
  dailyScreenTimeLimitMinutes: 90,
  dailyXPGoal: 100,
  todayXPEarned: 0,
  todayBuildActionsCompleted: 0,
  totalFocusMinutesToday: 0,
  lastFedTimestamp: Date.now(),
  lastFocusTimestamp: Date.now(),
  timesPettedToday: 0,
  lastPetTimestamp: 0,
  metricsDate: localDate(),
  careStatus: 'stable',
  isDeadOrCritical: false,
  resuscitationCount: 0,
};

const normalizeDailyState = (current: T1gerPetState, now: number): T1gerPetState => {
  const today = localDate(now);
  if (current.metricsDate === today) return current;
  return {
    ...current,
    metricsDate: today,
    todayXPEarned: 0,
    todayBuildActionsCompleted: 0,
    totalFocusMinutesToday: 0,
    timesPettedToday: 0,
  };
};

export function calculatePetVitalsWithDecay(current: T1gerPetState, now: number = Date.now()): T1gerPetState {
  const normalized = normalizeDailyState(current, now);
  const report = AndroidScreenTimeService.getReport();
  const screenTimeMinutes = report.totalMinutes;
  const budget = Math.max(30, normalized.dailyScreenTimeLimitMinutes || 90);
  const usageRatio = screenTimeMinutes / budget;
  const rescueActive = normalized.lastRescueDate === localDate(now);

  let health = usageRatio <= 1
    ? 100 - usageRatio * 20
    : 80 - ((usageRatio - 1) * 55);
  health += Math.min(35, Math.floor((normalized.totalFocusMinutesToday || 0) * 0.5));
  if (rescueActive) health = Math.max(55, health + 35);
  health = Math.round(Math.max(0, Math.min(100, health)));

  const xpGoal = Math.max(25, normalized.dailyXPGoal || 100);
  const hunger = Math.round(Math.max(15, Math.min(100, (normalized.todayXPEarned / xpGoal) * 100)));

  const actionEnergy = 30 + ((normalized.todayBuildActionsCompleted || 0) * 35);
  const distractionPenalty = usageRatio > 1 ? Math.min(45, (usageRatio - 1) * 35) : 0;
  const rescueEnergy = rescueActive ? 35 : 0;
  const energy = Math.round(Math.max(10, Math.min(100, actionEnergy - distractionPenalty + rescueEnergy)));

  let careStatus: PetCareStatus = health >= 82 && hunger >= 80 && energy >= 70 ? 'thriving' : 'stable';
  if (!rescueActive && screenTimeMinutes > budget) {
    careStatus = usageRatio >= 2 || energy <= 25 ? 'critical_energy' : 'neglected';
  }

  return {
    ...normalized,
    health,
    hunger,
    energy,
    strength: Math.round(Math.max(15, Math.min(100, normalized.strength || 75))),
    careStatus,
    isDeadOrCritical: careStatus === 'critical_energy' && health <= 15,
  };
}

export function applyDailyMissionRescue(
  current: T1gerPetState,
  missionId: string,
  now: number = Date.now(),
): T1gerPetState {
  const today = localDate(now);
  const normalized = calculatePetVitalsWithDecay(current, now);
  if (normalized.lastRescueDate === today) return normalized;

  return calculatePetVitalsWithDecay({
    ...normalized,
    lastRescueDate: today,
    lastRescueMissionId: missionId,
    health: Math.max(65, normalized.health),
    hunger: Math.max(80, normalized.hunger),
    energy: Math.max(65, normalized.energy),
    strength: Math.min(100, normalized.strength + 10),
    isDeadOrCritical: false,
  }, now);
}
