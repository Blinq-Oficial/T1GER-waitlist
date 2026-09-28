// ============================================================
// T1GER BRAIN SERVICE v3 (Curriculum Path)
// ============================================================
// Upgraded to support linear Curriculum Tracks (Paths) instead
// of just dynamic random 70/30 sessions.
// ============================================================

import {
  type Competency,
  type Difficulty,
  type BankMission,
  type TrackType,
  type CurriculumTrack,
  type CurriculumLevel,
  type CurriculumDay,
  ALL_COMPETENCIES,
  MISSION_BANK,
  CURRICULUM_TRACKS,
} from './missionBank';
import { INTERACTIVE_FIELD_MISSION_BANK, INTERACTIVE_MISSION_BANK } from './interactiveCurriculum';
import { fsrs, createEmptyCard, Rating, type Card, type FSRS } from 'ts-fsrs';
import {
  type T1gerPetState,
  DEFAULT_PET_STATE,
  applyDailyMissionRescue,
  calculatePetVitalsWithDecay,
} from './petEngine';

// Global FSRS Instance
export const fsrsEngine = fsrs();

const PROGRESS_MISSION_BANK: BankMission[] = [
  ...MISSION_BANK,
  ...INTERACTIVE_MISSION_BANK,
  ...INTERACTIVE_FIELD_MISSION_BANK,
];

export function getProgressMissionById(missionId: string): BankMission | undefined {
  return PROGRESS_MISSION_BANK.find((mission) => mission.id === missionId);
}

export function isApplyMissionId(missionId: string): boolean {
  return getProgressMissionById(missionId)?.type === 'real_world_task';
}

// ============================================================
// TYPES
// ============================================================

export interface CompetencyProfile {
  offer: number;
  sales: number;
  marketing: number;
  mindset: number;
  operations: number;
  investing: number;
  accounting: number;
  ai: number;
}

export interface MissionRecord {
  missionId: string;
  competency: Competency;
  difficulty: Difficulty;
  completed: boolean;
  score: number;
  timestamp: number;
}

export interface DailyPipeline {
  date: string;
  learnNodeId: string | null;
  applyNodeId: string | null;
  completedLearn: boolean;
  completedApply: boolean;
}

export interface DailySession {
  date: string;
  missionIds: string[];
  completedIds: string[];
}

export type NicheType = 'ecommerce' | 'coaching' | 'agency' | 'saas' | 'content' | 'general' | 'investing' | 'accounting';

export interface BrainState {
  competencies: CompetencyProfile;
  missionHistory: MissionRecord[];
  currentDifficulty: Record<Competency, Difficulty>;
  lastActiveDate: Record<Competency, number>;
  dailySession: DailySession | null;
  niche: NicheType;
  
  // Curriculum specific tracking
  currentTrackId: TrackType;
  completedDayIds: string[]; // List of CurriculumDay IDs the user has fully completed

  // Dual Streak System
  learnStreak: number;
  tacticalStreak: number;
  lastLearnDate: string | null; // ISO Date YYYY-MM-DD
  lastTacticalDate: string | null; // ISO Date YYYY-MM-DD

  // Custom Tactical System
  customHabits: TacticalTask[];
  customWorkTasks: TacticalTask[];
  customLessonTasks: TacticalTask[];
  dailyTacticalStatus: Record<string, DailyTacticalRecord>; // ISO Date -> Status

  // FSRS (Free Spaced Repetition Scheduler)
  fsrsCards: Record<string, Card>; // missionId -> FSRS Card
  dailyPipeline?: DailyPipeline;

  // Virtual Pet & Screen Time / Focus System
  petState?: T1gerPetState;
}

export interface TacticalTask {
  id: string;
  label: string;
  type: 'habit' | 'work' | 'lesson';
  icon?: string; // Lucide icon name
  createdAt?: number;
  recurrence?: 'daily' | 'weekdays' | 'weekly' | 'custom';
  recurrenceInterval?: number; // e.g. repeats every N days
  recurrenceDayOfWeek?: number; // e.g. 0-6 for weekly
}

export type DayType = 'rest' | 'normal' | 'beast';

export interface DailyTacticalRecord {
  dayType: DayType;
  committedHabitIds: string[]; // Habits chosen for today
  committedWorkIds: string[]; // Work tasks chosen for today
  committedLessonIds: string[]; // Lessons chosen for today
  completedIds: string[];
  proofs: Record<string, { url?: string; text?: string; verified?: boolean }>;
}

export interface RescueProtocolSelectionInput {
  availableHabitIds: string[];
  workTasks: TacticalTask[];
  lessonTasks: TacticalTask[];
}

export interface RescueProtocolSelection {
  dayType: 'rest';
  habitIds: string[];
  workIds: string[];
  lessonIds: string[];
}

// ============================================================
// DEFAULTS
// ============================================================

export const DEFAULT_BRAIN_STATE: BrainState = {
  competencies: {
    offer: 20,
    sales: 20,
    marketing: 20,
    mindset: 30,
    operations: 15,
    investing: 20,
    accounting: 20,
    ai: 20,
  },
  missionHistory: [],
  currentDifficulty: {
    offer: 'easy',
    sales: 'easy',
    marketing: 'easy',
    mindset: 'easy',
    operations: 'easy',
    investing: 'easy',
    accounting: 'easy',
    ai: 'easy',
  },
  lastActiveDate: {
    offer: Date.now(),
    sales: Date.now(),
    marketing: Date.now(),
    mindset: Date.now(),
    operations: Date.now(),
    investing: Date.now(),
    accounting: Date.now(),
    ai: Date.now(),
  },
  dailySession: null,
  niche: 'general',
  currentTrackId: 'investing',
  completedDayIds: [],
  learnStreak: 0,
  tacticalStreak: 0,
  lastLearnDate: null,
  lastTacticalDate: null,
  customHabits: [
    { id: 'h1', label: 'Go to the gym', type: 'habit', icon: 'Dumbbell', createdAt: Date.now() },
    { id: 'h2', label: 'Make your bed', type: 'habit', icon: 'Bed', createdAt: Date.now() },
    { id: 'h3', label: 'Brush your teeth', type: 'habit', icon: 'Droplets', createdAt: Date.now() },
  ],
  customWorkTasks: [
    { id: 'w1', label: 'Code feature', type: 'work', icon: 'Code', createdAt: Date.now() },
    { id: 'w2', label: 'Marketing', type: 'work', icon: 'BarChart3', createdAt: Date.now() },
  ],
  customLessonTasks: [
    { id: 'l1', label: 'Business Strategy', type: 'lesson', icon: 'Book', createdAt: Date.now() },
    { id: 'l2', label: 'Market Research', type: 'lesson', icon: 'Brain', createdAt: Date.now() },
  ],
  dailyTacticalStatus: {},
  fsrsCards: {},
  petState: DEFAULT_PET_STATE,
};

export function buildRescueProtocolSelection({
  availableHabitIds,
  workTasks,
  lessonTasks,
}: RescueProtocolSelectionInput): RescueProtocolSelection {
  const firstHabitId = availableHabitIds[0];
  const firstWorkTask = workTasks.find(task => task.type === 'work');
  const firstLessonTask = lessonTasks.find(task => task.type === 'lesson');

  return {
    dayType: 'rest',
    habitIds: firstHabitId ? [firstHabitId] : [],
    workIds: firstWorkTask ? [firstWorkTask.id] : [],
    lessonIds: firstLessonTask ? [firstLessonTask.id] : [],
  };
}

// ============================================================
// CURRICULUM PATH HELPERS
// ============================================================

/**
 * Applies time-based decay to competency scores (The "Memory Shield" mechanic).
 * Returns the mutated state.
 */
export function calculateSkillDecay(state: BrainState): BrainState {
  const now = Date.now();
  const DECAY_RATE_PER_DAY = 5; // 5% decay per day of inactivity
  const msPerDay = 24 * 60 * 60 * 1000;
  
  let hasDecayed = false;
  const newCompetencies = { ...state.competencies };

  for (const comp of ALL_COMPETENCIES) {
    const lastActive = state.lastActiveDate[comp] || now;
    const daysInactive = Math.floor((now - lastActive) / msPerDay);
    
    if (daysInactive > 1) {
      // Apply decay for every day beyond the first day of inactivity
      const penalty = (daysInactive - 1) * DECAY_RATE_PER_DAY;
      if (penalty > 0) {
        newCompetencies[comp] = Math.max(0, newCompetencies[comp] - penalty);
        hasDecayed = true;
      }
    }
  }

  if (hasDecayed) {
    return { ...state, competencies: newCompetencies };
  }
  return state;
}

/**
 * Given the current BrainState, retrieves the full selected Track
 * and calculates the user's progress through it.
 */
export function getCurrentPathData(state: BrainState) {
  const requestedTrack = CURRICULUM_TRACKS[state.currentTrackId];
  const track = requestedTrack?.levels?.length ? requestedTrack : CURRICULUM_TRACKS.investing;
  
  for (let l = 0; l < track.levels.length; l++) {
    const level = track.levels[l];
    
    // Check if any day in this level is incomplete
    for (let d = 0; d < level.days.length; d++) {
      const day = level.days[d];
      if (!state.completedDayIds.includes(day.dayId)) {
        return { track, currentLevelIndex: l, currentDayIndex: d, isFullyCompleted: false, isApplyNodePending: false };
      }
    }

    // All days in this level are done. Check if ApplyNode is pending.
    if (level.applyNodeId) {
      const applyNodeCompleted = state.missionHistory.some(r => r.missionId === level.applyNodeId && r.completed);
      if (!applyNodeCompleted) {
        // Stuck at the end of this level until ApplyNode is done
        return { 
          track, 
          currentLevelIndex: l, 
          currentDayIndex: level.days.length - 1, // Stay on the last day visually
          isFullyCompleted: false, 
          isApplyNodePending: true 
        };
      }
    }
  }

  // If all levels and their apply nodes are completed, return end state
  const lastLevel = track.levels[track.levels.length - 1];
  return { 
    track, 
    currentLevelIndex: track.levels.length - 1, 
    currentDayIndex: Math.max(0, lastLevel.days.length - 1),
    isFullyCompleted: true,
    isApplyNodePending: false
  };
}

/**
 * Builds the current "Daily Session" based on the user's Curriculum position.
 */
export function buildCurriculumSession(state: BrainState): DailySession {
  const today = getLocalDateString();

  // We map the active 'Day' inside the Curriculum to the 'dailySession'
  const pathData = getCurrentPathData(state);
  
  // If the track is fully completed, feed them review missions or latest level
  if (pathData.isFullyCompleted) {
    const lastLevel = pathData.track.levels[pathData.track.levels.length - 1];
    const lastDay = lastLevel.days[lastLevel.days.length - 1];
    return {
      date: today,
      missionIds: lastDay.missionIds,
      completedIds: state.missionHistory
        .filter(r => r.completed && lastDay.missionIds.includes(r.missionId))
        .map(r => r.missionId)
    };
  }

  const activeLevel = pathData.track.levels[pathData.currentLevelIndex];
  const activeDay = activeLevel.days[pathData.currentDayIndex];

  // FSRS: Find missions due for review
  const now = new Date();
  const dueMissions = Object.keys(state.fsrsCards || {}).filter(missionId => {
      const card = state.fsrsCards[missionId];
      // Card state: 0=New, 1=Learning, 2=Review, 3=Relearning
      return card.state !== 0 && new Date(card.due) <= now;
  }).slice(0, 2); // Inject max 2 reviews per day
  
  const finalMissionIds = Array.from(new Set([...dueMissions, ...activeDay.missionIds]));
  
  // For the active day, what missions has the user completed?
  // We check history against the current Day's missionIds
  const completedInDay = finalMissionIds.filter(id => 
    state.missionHistory.some(r => r.missionId === id && r.completed)
  );

  return {
    date: today,
    missionIds: finalMissionIds,
    completedIds: completedInDay,
  };
}

export function generateDailyPipeline(state: BrainState): DailyPipeline {
  const today = getLocalDateString();
  const pathData = getCurrentPathData(state);
  
  let learnNodeId: string | null = null;
  let applyNodeId: string | null = null;
  
  // 1. Determine Apply Node
  if (pathData.isApplyNodePending) {
    const activeLevel = pathData.track.levels[pathData.currentLevelIndex];
    applyNodeId = activeLevel.applyNodeId || null;
  }
  
  // 2. Determine Learn Node (Adaptive Engine)
  const now = new Date();
  const dueMissions = Object.keys(state.fsrsCards || {}).filter(missionId => {
      const card = state.fsrsCards[missionId];
      return card.state !== 0 && new Date(card.due) <= now;
  });
  
  if (dueMissions.length > 0) {
    // Serve a refresher (Decay rate is high)
    learnNodeId = dueMissions[0];
  } else {
    // Advance curriculum (Decay rate is low)
    if (!pathData.isFullyCompleted && !pathData.isApplyNodePending) {
      const activeLevel = pathData.track.levels[pathData.currentLevelIndex];
      const activeDay = activeLevel.days[pathData.currentDayIndex];
      if (activeDay.missionIds.length > 0) {
         learnNodeId = activeDay.missionIds[0];
      }
    } else if (pathData.isApplyNodePending) {
       // If stuck on Apply, give them the last concept as a refresher
       const activeLevel = pathData.track.levels[pathData.currentLevelIndex];
       const activeDay = activeLevel.days[activeLevel.days.length - 1];
       if (activeDay.missionIds.length > 0) {
         learnNodeId = activeDay.missionIds[0];
       }
    }
  }

  // Check if they completed them today
  const todayStart = new Date(today).getTime();
  const completedLearn = learnNodeId ? state.missionHistory.some(r => r.missionId === learnNodeId && r.completed && r.timestamp >= todayStart) : true;
  const completedApply = applyNodeId ? state.missionHistory.some(r => r.missionId === applyNodeId && r.completed) : true;

  return {
    date: today,
    learnNodeId,
    applyNodeId,
    completedLearn,
    completedApply
  };
}

export function getLocalDateString(d: Date = new Date()): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

// ============================================================
// STRENGTH DECAY & CORE LOGIC
// ============================================================

const MS_PER_DAY = 86_400_000;
const DECAY_PER_DAY = 2;
const MIN_SCORE = 5;

export function applyDecay(state: BrainState): CompetencyProfile {
  const now = Date.now();
  const decayed = { ...state.competencies };

  for (const comp of ALL_COMPETENCIES) {
    const daysSinceActive = Math.floor(
      (now - (state.lastActiveDate[comp] || now)) / MS_PER_DAY
    );
    if (daysSinceActive > 0) {
      const loss = daysSinceActive * DECAY_PER_DAY;
      decayed[comp] = Math.max(MIN_SCORE, decayed[comp] - loss);
    }
  }

  return decayed;
}

export function processMissionResult(
  state: BrainState,
  missionId: string,
  completed: boolean,
  score: number = 100,
  rating?: Rating
): BrainState {
  const mission = getProgressMissionById(missionId);
  if (!mission) return state;

  // Curriculum rewards and progress are idempotent. Reviews need a dedicated
  // review event instead of replaying the original mission completion.
  if (completed && state.missionHistory.some(record => record.missionId === missionId && record.completed)) {
    return state;
  }

  const competency = mission.competency;

  // Apply decay to current competencies first so penalties are not wiped out
  const decayedCompetencies = applyDecay(state);

  const diffMultiplier = mission.difficulty === 'hard' ? 1.5 : mission.difficulty === 'medium' ? 1.2 : 1.0;
  const change = completed
    ? Math.round((score / 100) * 8 * diffMultiplier)
    : -5;

  const newScore = Math.max(0, Math.min(100, decayedCompetencies[competency] + change));
  const updatedCompetencies = { ...decayedCompetencies, [competency]: newScore };

  const record: MissionRecord = {
    missionId,
    competency,
    difficulty: mission.difficulty,
    completed,
    score,
    timestamp: Date.now(),
  };

  const newHistory = [...state.missionHistory, record];
  let newCompletedDayIds = [...state.completedDayIds];
  let newFsrsCards = { ...state.fsrsCards };

  if (completed || !completed) { // Always track attempts
    let finalRating = rating;
    if (!finalRating) {
        if (!completed || score < 50) finalRating = Rating.Again;
        else if (score >= 90) finalRating = Rating.Easy;
        else if (score >= 75) finalRating = Rating.Good;
        else finalRating = Rating.Hard;
    }
    const card = newFsrsCards[missionId] || createEmptyCard();
    const scheduled = fsrsEngine.repeat(card, new Date());
    const nextCard = scheduled[finalRating].card;
    newFsrsCards[missionId] = nextCard;
  }

  // Curriculum logic: check if this completion finishes the current CurriculumDay
  let newCustomWorkTasks = [...state.customWorkTasks];
  
  if (completed) {
    const pathData = getCurrentPathData(state);
    if (!pathData.isFullyCompleted) {
      const activeLevel = pathData.track.levels[pathData.currentLevelIndex];
      const activeDay = activeLevel.days[pathData.currentDayIndex];
      
      const allDone = activeDay.missionIds.every(mId => 
        mId === missionId || newHistory.some(r => r.missionId === mId && r.completed)
      );

      if (allDone && !newCompletedDayIds.includes(activeDay.dayId)) {
        newCompletedDayIds.push(activeDay.dayId);
        
        // System 4: Apply Phase - Unlock action items as Tactical Tasks
        if (activeDay.actionItems && activeDay.actionItems.length > 0) {
          activeDay.actionItems.forEach((action, idx) => {
            if (!newCustomWorkTasks.some(t => t.label === action)) {
              newCustomWorkTasks.push({
                id: `action-${activeDay.dayId}-${idx}-${Date.now()}`,
                label: action,
                type: 'work',
                icon: 'Zap',
                createdAt: Date.now(),
                recurrence: 'custom',
                recurrenceInterval: 1
              });
            }
          });
        }
      }
    }
  }

  const session = buildCurriculumSession({
    ...state, 
    missionHistory: newHistory, 
    completedDayIds: newCompletedDayIds,
    fsrsCards: newFsrsCards
  });

  // Quiz completion prepares execution; only an accepted Apply proof secures the day.
  const hasExecutionProof = completed && isApplyMissionId(missionId);
  const today = getLocalDateString();
  let newLearnStreak = state.learnStreak;
  let newLastLearnDate = state.lastLearnDate;

  if (hasExecutionProof && state.lastLearnDate !== today) {
    // If they haven't learned today yet, increment or reset streak
    if (state.lastLearnDate) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = getLocalDateString(yesterday);
      
      if (state.lastLearnDate === yesterdayStr) {
        newLearnStreak += 1;
      } else {
        newLearnStreak = 1; // Reset if they skipped a day
      }
    } else {
      newLearnStreak = 1;
    }
    newLastLearnDate = today;
  }

  // Feed T1ger on successful mission completion
  const currentPet = calculatePetVitalsWithDecay(state.petState || DEFAULT_PET_STATE);
  const xpEarned = mission.xpReward || 100;
  const newTodayXP = (currentPet.todayXPEarned || 0) + (hasExecutionProof ? xpEarned : 0);
  let updatedPetState: T1gerPetState = hasExecutionProof
    ? {
        ...currentPet,
        todayXPEarned: newTodayXP,
        hunger: Math.min(100, Math.round((newTodayXP / (currentPet.dailyXPGoal || 100)) * 100)),
        lastFedTimestamp: Date.now(),
      }
    : currentPet;

  if (hasExecutionProof) {
    updatedPetState = applyDailyMissionRescue(updatedPetState, mission.id);
  }

  return {
    ...state,
    competencies: updatedCompetencies,
    missionHistory: newHistory,
    lastActiveDate: {
      ...state.lastActiveDate,
      [competency]: Date.now(),
    },
    completedDayIds: newCompletedDayIds,
    dailySession: session,
    learnStreak: newLearnStreak,
    lastLearnDate: newLastLearnDate,
    fsrsCards: newFsrsCards,
    customWorkTasks: newCustomWorkTasks,
    petState: updatedPetState,
  };
}

/**
 * Records a retrieval-practice review without replaying curriculum rewards,
 * streaks, pet recovery, or mission history. This is the only path Memory
 * Shield refreshes should use after the original Proof of Work is verified.
 */
export function processMissionReview(state: BrainState, missionId: string, score: number): BrainState {
  const wasLearned = state.missionHistory.some((record) => record.missionId === missionId && record.completed);
  if (!wasLearned) return state;

  const rating = score >= 90 ? Rating.Easy : score >= 75 ? Rating.Good : score >= 50 ? Rating.Hard : Rating.Again;
  const card = state.fsrsCards?.[missionId] || createEmptyCard();
  const scheduled = fsrsEngine.repeat(card, new Date());

  return {
    ...state,
    fsrsCards: {
      ...state.fsrsCards,
      [missionId]: scheduled[rating].card,
    },
  };
}

/**
 * Handle Tactical Streak increment
 */
export function processTacticalResult(state: BrainState): BrainState {
  const today = getLocalDateString();
  if (state.lastTacticalDate === today) return state;

  let newStreak = state.tacticalStreak;
  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const yesterdayStr = getLocalDateString(yesterday);

  if (state.lastTacticalDate === yesterdayStr) {
    newStreak += 1;
  } else {
    newStreak = 1;
  }

  return {
    ...state,
    tacticalStreak: newStreak,
    lastTacticalDate: today
  };
}

export interface TopicProgress {
  competency: Competency;
  totalMissions: number;
  completedMissions: number;
  mastery: number;
  currentDifficulty: Difficulty;
}

export function addTacticalTask(
  state: BrainState, 
  label: string, 
  type: 'habit' | 'work' | 'lesson', 
  icon?: string,
  recurrence?: 'daily' | 'weekdays' | 'weekly' | 'custom',
  recurrenceInterval?: number,
  recurrenceDayOfWeek?: number
): BrainState {
  const newTask: TacticalTask = {
    id: Math.random().toString(36).substr(2, 9),
    label,
    type,
    icon,
    createdAt: Date.now(),
    recurrence: recurrence || 'daily',
    recurrenceInterval,
    recurrenceDayOfWeek
  };
  const keyMap = {
    habit: 'customHabits',
    work: 'customWorkTasks',
    lesson: 'customLessonTasks'
  };
  const key = keyMap[type] as keyof BrainState;
  
  return {
    ...state,
    [key]: [...(state[key] as TacticalTask[]), newTask]
  };
}

export function removeTacticalTask(state: BrainState, id: string, type: 'habit' | 'work' | 'lesson'): BrainState {
  const keyMap = {
    habit: 'customHabits',
    work: 'customWorkTasks',
    lesson: 'customLessonTasks'
  };
  const key = keyMap[type] as keyof BrainState;

  return {
    ...state,
    [key]: (state[key] as TacticalTask[]).filter(t => t.id !== id)
  };
}

export function setDayType(state: BrainState, type: DayType): BrainState {
  const today = getLocalDateString();
  const currentStatus = state.dailyTacticalStatus[today] || { 
    dayType: 'normal', 
    committedHabitIds: [], 
    committedWorkIds: [], 
    committedLessonIds: [],
    completedIds: [], 
    proofs: {} 
  };
  
  return {
    ...state,
    dailyTacticalStatus: {
      ...state.dailyTacticalStatus,
      [today]: { ...currentStatus, dayType: type }
    }
  };
}

export function commitDailyTactical(state: BrainState, habitIds: string[], workIds: string[], lessonIds: string[]): BrainState {
  const today = getLocalDateString();
  const currentStatus = state.dailyTacticalStatus[today] || { 
    dayType: 'normal', 
    committedHabitIds: [], 
    committedWorkIds: [], 
    committedLessonIds: [],
    completedIds: [], 
    proofs: {} 
  };

  return {
    ...state,
    dailyTacticalStatus: {
      ...state.dailyTacticalStatus,
      [today]: { 
        ...currentStatus, 
        committedHabitIds: habitIds, 
        committedWorkIds: workIds,
        committedLessonIds: lessonIds
      }
    }
  };
}

export function completeTacticalTask(state: BrainState, id: string, proofUrl?: string, proofText?: string, verified: boolean = true): BrainState {
  const today = getLocalDateString();
  const currentStatus = state.dailyTacticalStatus[today] || { 
    dayType: 'normal', 
    committedHabitIds: [], 
    committedWorkIds: [], 
    committedLessonIds: [],
    completedIds: [], 
    proofs: {} 
  };
  
  if (currentStatus.completedIds.includes(id)) return state;

  const newCompletedIds = [...currentStatus.completedIds, id];
  const newProofs = { ...currentStatus.proofs, [id]: { url: proofUrl, text: proofText, verified } };

  const currentPet = calculatePetVitalsWithDecay(state.petState || DEFAULT_PET_STATE);
  const updatedPetState: T1gerPetState = {
    ...currentPet,
    todayBuildActionsCompleted: (currentPet.todayBuildActionsCompleted || 0) + 1,
    energy: Math.min(100, (currentPet.energy || 50) + 30),
    strength: Math.min(100, currentPet.strength + 15),
  };

  const newState = {
    ...state,
    petState: updatedPetState,
    dailyTacticalStatus: {
      ...state.dailyTacticalStatus,
      [today]: { ...currentStatus, completedIds: newCompletedIds, proofs: newProofs }
    }
  };

  // Check if all COMMITTED tasks are completed to increment streak
  const allRequired = [...currentStatus.committedHabitIds, ...currentStatus.committedWorkIds, ...currentStatus.committedLessonIds];
  
  // If no commitment yet, we can't complete the day protocol
  if (allRequired.length === 0) return newState;

  const allDone = allRequired.every(reqId => newCompletedIds.includes(reqId));
  
  if (allDone) {
    return processTacticalResult(newState);
  }

  return newState;
}

export function getTopicProgress(state: BrainState): TopicProgress[] {
  const scores = applyDecay(state);
  return ALL_COMPETENCIES.map(comp => {
    const totalInBank = PROGRESS_MISSION_BANK.filter(m => m.competency === comp).length;
    const completedInComp = new Set(
      state.missionHistory
        .filter(r => r.competency === comp && r.completed)
        .map(r => r.missionId)
    ).size;

    return {
      competency: comp,
      totalMissions: totalInBank,
      completedMissions: completedInComp,
      mastery: Math.round(scores[comp]),
      currentDifficulty: state.currentDifficulty[comp],
    };
  });
}

export interface UserWeaknesses {
  weakCompetencies: { competency: string; score: number }[];
  recentFailedMissions: string[];
}

export function getUserWeaknesses(state: BrainState): UserWeaknesses {
  const decayedScores = applyDecay(state);
  
  const weakCompetencies = Object.entries(decayedScores)
    .map(([competency, score]) => ({ competency, score }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 3);

  const recentFailedMissions = Array.from(new Set(
    state.missionHistory
      .filter(record => !record.completed)
      .map(record => {
        const mission = getProgressMissionById(record.missionId);
        return mission ? `${mission.title} (${mission.concept || ''})` : '';
      })
      .filter(Boolean)
  )).slice(-3);

  return {
    weakCompetencies,
    recentFailedMissions
  };
}

// ============================================================
// MEMORY SHIELD SYSTEM (Kinnu-Inspired Cognitive Engine)
// ============================================================

export interface NodeMemoryShield {
  missionId: string;
  percentage: number; // 0 to 100
  status: 'locked' | 'unstarted' | 'optimum' | 'decaying' | 'vulnerable';
  daysSinceReview: number;
  stabilityDays: number;
  dueDate: Date | null;
}

/**
 * Calculates the exact Memory Shield retention curve for a specific mission.
 * Uses FSRS card stability if available, or fallback decay time.
 */
export function getNodeMemoryShield(missionId: string, state: BrainState): NodeMemoryShield {
  const card = state.fsrsCards?.[missionId];
  const history = state.missionHistory.filter(r => r.missionId === missionId && r.completed);
  
  if (history.length === 0 && !card) {
    return {
      missionId,
      percentage: 0,
      status: 'unstarted',
      daysSinceReview: 0,
      stabilityDays: 0,
      dueDate: null,
    };
  }

  const lastReviewTime = card?.last_review ? new Date(card.last_review).getTime() : (history[history.length - 1]?.timestamp || Date.now());
  const elapsedMs = Math.max(0, Date.now() - lastReviewTime);
  const elapsedDays = elapsedMs / (1000 * 60 * 60 * 24);

  // FSRS stability or default baseline of 3 days for first review
  const stability = card?.stability || Math.max(1, history.length * 2.5);

  // FSRS Retention Formula: R = (1 + factor * t / S)^power or exponential approx: R = e^(-ln(0.9) * t / S)
  // Standard approximation: R = 0.9 ^ (elapsedDays / stability)
  const retention = Math.pow(0.9, elapsedDays / stability);
  const percentage = Math.max(5, Math.min(100, Math.round(retention * 100)));

  let status: NodeMemoryShield['status'] = 'optimum';
  if (percentage < 50) {
    status = 'vulnerable';
  } else if (percentage < 80) {
    status = 'decaying';
  }

  const dueDate = card?.due ? new Date(card.due) : new Date(lastReviewTime + stability * 24 * 60 * 60 * 1000);

  return {
    missionId,
    percentage,
    status,
    daysSinceReview: Math.round(elapsedDays * 10) / 10,
    stabilityDays: Math.round(stability * 10) / 10,
    dueDate,
  };
}

/**
 * Calculates the global memory shield index across all learned nodes (0 - 100%).
 */
export function getGlobalMemoryHealth(state: BrainState): { score: number; totalNodesLearned: number; vulnerableCount: number } {
  const completedIds = Array.from(new Set(state.missionHistory.filter(r => r.completed).map(r => r.missionId)));
  if (completedIds.length === 0) {
    return { score: 100, totalNodesLearned: 0, vulnerableCount: 0 };
  }

  let totalScore = 0;
  let vulnerableCount = 0;

  for (const id of completedIds) {
    const shield = getNodeMemoryShield(id, state);
    totalScore += shield.percentage;
    if (shield.status === 'vulnerable' || shield.status === 'decaying') {
      vulnerableCount += 1;
    }
  }

  return {
    score: Math.round(totalScore / completedIds.length),
    totalNodesLearned: completedIds.length,
    vulnerableCount,
  };
}

/**
 * Retrieves the list of missions that need immediate shield recharging.
 */
export function getVulnerableShieldNodes(state: BrainState): BankMission[] {
  const completedIds = Array.from(new Set(state.missionHistory.filter(r => r.completed).map(r => r.missionId)));
  const vulnerableMissions: { mission: BankMission; percentage: number }[] = [];

  for (const id of completedIds) {
    const shield = getNodeMemoryShield(id, state);
    if (shield.percentage < 80) {
      const mission = getProgressMissionById(id);
      if (mission) {
        vulnerableMissions.push({ mission, percentage: shield.percentage });
      }
    }
  }

  return vulnerableMissions
    .sort((a, b) => a.percentage - b.percentage)
    .map(item => item.mission);
}

const STREAK_CELEBRATION_KEY = 't1ger_last_streak_celebrated_date';

/**
 * Checks whether the streak has already been celebrated today.
 * Returns true only on the FIRST completion of the day.
 */
export function shouldCelebrateStreakToday(): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const today = getLocalDateString();
    const lastCelebrated = localStorage.getItem(STREAK_CELEBRATION_KEY);
    return lastCelebrated !== today;
  } catch {
    return true;
  }
}

/**
 * Marks today's streak as celebrated so subsequent lessons on the same day
 * won't redundantly pop up the full-screen modal.
 */
export function markStreakCelebratedToday(): void {
  if (typeof window === 'undefined') return;
  try {
    const today = getLocalDateString();
    localStorage.setItem(STREAK_CELEBRATION_KEY, today);
  } catch {
    // Ignore localStorage errors
  }
}
