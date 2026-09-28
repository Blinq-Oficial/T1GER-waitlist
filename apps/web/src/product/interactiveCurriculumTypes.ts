import type { Competency, Difficulty, TrackType } from './missionBank';

export type LearningLocale = 'es' | 'en';
export type LocalizedText = Record<LearningLocale, string>;

export type InteractiveTrackId =
  | 'smart-money'
  | 'ai-automation'
  | 'viral-growth'
  | 'history-strategy'
  | 'mindset-stoic'
  | 'peak-performance'
  | 'data-science';
export type ChallengeKind = 'multiple_choice' | 'ordering' | 'matching' | 'error_detection';
export type MicroToolEngine =
  | 'cash_cost'
  | 'compound_growth'
  | 'etf_fee_drag'
  | 'dca_plan'
  | 'risk_budget'
  | 'prompt_builder'
  | 'context_stack'
  | 'model_router'
  | 'workflow_map'
  | 'agent_guardrails'
  | 'hook_lab'
  | 'pain_to_promise'
  | 'offer_value'
  | 'six_second_script'
  | 'distribution_plan'
  | 'strategy_map'
  | 'control_filter'
  | 'focus_block'
  | 'data_signal_filter'
  | 'north_star_builder'
  | 'ab_test_calc'
  | 'overfitting_check'
  | 'decision_analytics';

export interface CurriculumSource {
  id: string;
  kind: 'book' | 'article' | 'paper' | 'transcript' | 'internal';
  title: string;
  author: string;
  url?: string;
  rights: 'licensed' | 'public_domain' | 'fair_use_summary' | 'owned';
  retrievedAt?: string;
}

export interface CurriculumIngestionAudit {
  schemaVersion: '1.0.0';
  generatedBy: 'human' | 'ai_assisted';
  factualReview: 'pending' | 'approved';
  pedagogicalReview: 'pending' | 'approved';
  sourceIds: string[];
}

export interface OrbStoryBeat {
  title: LocalizedText;
  body: LocalizedText;
}

export interface LearningDecisionOption {
  id: string;
  label: LocalizedText;
  correct?: boolean;
}

export interface GoldStandardLearningDesign {
  prediction: {
    prompt: LocalizedText;
    options: readonly [LearningDecisionOption, LearningDecisionOption];
    reveal: LocalizedText;
  };
  master: {
    prompt: LocalizedText;
    options: readonly [LearningDecisionOption, LearningDecisionOption, LearningDecisionOption];
    explanation: LocalizedText;
  };
  outcome: LocalizedText;
}

/**
 * Narrative and retrieval layer inspired by cognitive-science findings:
 * prime the schema, teach one coherent idea, correct a misconception, then
 * compress the lesson into a durable memory anchor.
 */
export interface OrbLearningDesign {
  curiosityQuestion: LocalizedText;
  predictionPrompt: LocalizedText;
  storyBeats: readonly [OrbStoryBeat, OrbStoryBeat, OrbStoryBeat];
  misconception: LocalizedText;
  summaryPoints: readonly [LocalizedText, LocalizedText, LocalizedText];
  retrievalPrompt: LocalizedText;
  retrievalAnswer: LocalizedText;
  /** Enables the continuous Learn -> Apply -> Master pilot without changing legacy lessons. */
  goldStandard?: GoldStandardLearningDesign;
}

export interface ChallengeOption {
  id: string;
  label: LocalizedText;
  correct?: boolean;
}

export interface MatchPair {
  id: string;
  left: LocalizedText;
  right: LocalizedText;
}

export interface FlashChallenge {
  kind: ChallengeKind;
  prompt: LocalizedText;
  options?: ChallengeOption[];
  orderedIds?: string[];
  pairs?: MatchPair[];
  feedback: {
    correct: LocalizedText;
    incorrect: LocalizedText;
    explanation: LocalizedText;
  };
}

export interface RangeToolField {
  id: string;
  kind: 'range';
  label: LocalizedText;
  min: number;
  max: number;
  step: number;
  defaultValue: number;
  unit?: LocalizedText;
}

export interface TextToolField {
  id: string;
  kind: 'text';
  label: LocalizedText;
  placeholder: LocalizedText;
  defaultValue?: string;
  minLength?: number;
}

export interface SelectToolField {
  id: string;
  kind: 'select';
  label: LocalizedText;
  defaultValue: string;
  options: Array<{ value: string; label: LocalizedText }>;
}

export type ToolField = RangeToolField | TextToolField | SelectToolField;

export interface ActionWidget {
  engine: MicroToolEngine;
  title: LocalizedText;
  instruction: LocalizedText;
  fields: ToolField[];
  resultLabel: LocalizedText;
  artifactTitle: LocalizedText;
  commitLabel: LocalizedText;
}

export interface ImpactPhase {
  type: 'impact';
  durationSeconds: 45;
  eyebrow: LocalizedText;
  title: LocalizedText;
  body: LocalizedText;
  tacticalRule: LocalizedText;
  metric?: { value: string; label: LocalizedText };
}

export interface ChallengePhase {
  type: 'challenge';
  durationSeconds: 60;
  title: LocalizedText;
  challenge: FlashChallenge;
}

export interface ActionPhase {
  type: 'action';
  durationSeconds: 60;
  title: LocalizedText;
  widget: ActionWidget;
}

export interface RewardPhase {
  type: 'reward';
  durationSeconds: 15;
  title: LocalizedText;
  body: LocalizedText;
  xp: number;
  petRecovery: number;
}

export type AtomicLessonPhases = readonly [ImpactPhase, ChallengePhase, ActionPhase, RewardPhase];

export interface AtomicLesson {
  id: string;
  trackId: InteractiveTrackId;
  order: number;
  slug: string;
  competency: Competency;
  difficulty: Difficulty;
  title: LocalizedText;
  objective: LocalizedText;
  keyConcept: LocalizedText;
  learningDesign: OrbLearningDesign;
  estimatedSeconds: 180;
  prerequisiteIds: string[];
  sources: CurriculumSource[];
  ingestion: CurriculumIngestionAudit;
  phases: AtomicLessonPhases;
}

export interface InteractiveTrack {
  id: InteractiveTrackId;
  legacyTrackId: TrackType;
  title: LocalizedText;
  shortTitle: LocalizedText;
  promise: LocalizedText;
  outcome: LocalizedText;
  lessons: AtomicLesson[];
}

export interface SavedLearningArtifact {
  lessonId: string;
  trackId: InteractiveTrackId;
  title: string;
  summary: string;
  values: Record<string, string | number>;
  createdAt: number;
}

export const localizeLearning = (copy: LocalizedText, locale: LearningLocale): string => copy[locale];
