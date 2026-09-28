import type { BrainState } from './brainService';
import type { AtomicLesson, InteractiveTrack, LocalizedText } from './interactiveCurriculumTypes';

export interface JourneySection {
  id: string;
  title: LocalizedText;
  description: LocalizedText;
  lessonIds: string[];
  landmark: 'seed' | 'compass' | 'summit';
}

export const INVESTING_SECTIONS: JourneySection[] = [
  { id: 'foundations', title: { es: 'Construye tu base', en: 'Build your foundation' }, description: { es: 'Protege el presente. Dale tiempo al futuro.', en: 'Protect the present. Give the future time.' }, lessonIds: ['learn-money-01', 'learn-money-02'], landmark: 'seed' },
  { id: 'strategy', title: { es: 'Encuentra tu rumbo', en: 'Find your direction' }, description: { es: 'Compara con criterio. Diseña tu hábito.', en: 'Compare with purpose. Design your habit.' }, lessonIds: ['learn-money-03', 'learn-money-04'], landmark: 'compass' },
  { id: 'risk', title: { es: 'Riesgo y análisis', en: 'Risk & analysis' }, description: { es: 'Un buen plan también sabe poner límites.', en: 'A good plan knows where to set limits.' }, lessonIds: ['learn-money-05'], landmark: 'summit' },
];

export const AI_SECTIONS: JourneySection[] = [
  { id: 'ai-foundations', title: { es: 'Arquitectura & Contexto', en: 'Architecture & Context' }, description: { es: 'Comprende los límites del modelo y estructura contexto.', en: 'Understand model boundaries and structure context.' }, lessonIds: ['learn-ai-01', 'learn-ai-02'], landmark: 'seed' },
  { id: 'ai-workflows', title: { es: 'Flujos & Automatización', en: 'Flows & Automation' }, description: { es: 'Encadena pasos, evalúa salidas y conecta herramientas.', en: 'Chain steps, evaluate outputs, and connect tools.' }, lessonIds: ['learn-ai-03', 'learn-ai-04'], landmark: 'compass' },
  { id: 'ai-agents', title: { es: 'Agentes & Guardrails', en: 'Agents & Guardrails' }, description: { es: 'Autonomía controlada con permisos y límites seguros.', en: 'Controlled autonomy with permissions and safe limits.' }, lessonIds: ['learn-ai-05'], landmark: 'summit' },
];

export const GROWTH_SECTIONS: JourneySection[] = [
  { id: 'growth-attention', title: { es: 'Atención & Hooks', en: 'Attention & Hooks' }, description: { es: 'Gana los primeros 3 segundos y aísla problemas reales.', en: 'Win the first 3 seconds and isolate real pain points.' }, lessonIds: ['learn-growth-01', 'learn-growth-02'], landmark: 'seed' },
  { id: 'growth-offer', title: { es: 'Oferta & Guiones', en: 'Offer & Scripts' }, description: { es: 'Haz ofertas irresistibles y redacta guiones que conviertan.', en: 'Craft irresistible offers and write converting scripts.' }, lessonIds: ['learn-growth-03', 'learn-growth-04'], landmark: 'compass' },
  { id: 'growth-distribution', title: { es: 'Máquina de Distribución', en: 'Distribution Machine' }, description: { es: 'Convierte 1 idea en 4 formatos y escala tu alcance.', en: 'Turn 1 idea into 4 formats and scale your reach.' }, lessonIds: ['learn-growth-05'], landmark: 'summit' },
];

export const HISTORY_SECTIONS: JourneySection[] = [
  { id: 'hist-foundations', title: { es: 'Terreno & Cálculo', en: 'Terrain & Calculation' }, description: { es: 'Gana la batalla en el mapa antes de marchar.', en: 'Win the battle on the map before marching.' }, lessonIds: ['learn-history-01', 'learn-history-02'], landmark: 'seed' },
  { id: 'hist-maneuver', title: { es: 'Maniobra Asimétrica', en: 'Asymmetric Maneuver' }, description: { es: 'La inteligencia táctica vence al volumen ciego.', en: 'Tactical intelligence beats blind volume.' }, lessonIds: ['learn-history-03', 'learn-history-04'], landmark: 'compass' },
  { id: 'hist-resilience', title: { es: 'Resiliencia Sistémica', en: 'Systemic Resilience' }, description: { es: 'La disciplina interna sostiene a los imperios.', en: 'Internal discipline sustains empires.' }, lessonIds: ['learn-history-05'], landmark: 'summit' },
];

export const MINDSET_SECTIONS: JourneySection[] = [
  { id: 'mind-control', title: { es: 'Dicotomía del Control', en: 'Dichotomy of Control' }, description: { es: 'Gobierna tus juicios; suelta lo incontrolable.', en: 'Govern your judgments; release the uncontrollable.' }, lessonIds: ['learn-mindset-01', 'learn-mindset-02'], landmark: 'seed' },
  { id: 'mind-reframing', title: { es: 'Amor Fati & Reencuadre', en: 'Amor Fati & Reframing' }, description: { es: 'El impedimento se convierte en el camino.', en: 'The impediment becomes the way.' }, lessonIds: ['learn-mindset-03', 'learn-mindset-04'], landmark: 'compass' },
  { id: 'mind-citadel', title: { es: 'La Ciudadela Interior', en: 'The Inner Citadel' }, description: { es: 'Imperturbabilidad ante el aplauso y la censura.', en: 'Imperturbability in the face of praise and blame.' }, lessonIds: ['learn-mindset-05'], landmark: 'summit' },
];

export const PERFORMANCE_SECTIONS: JourneySection[] = [
  { id: 'perf-deepwork', title: { es: 'Foco Profundo & Fricción', en: 'Deep Focus & Friction' }, description: { es: '90 minutos de foco puro superan a 8 horas dispersas.', en: '90 minutes of pure focus beat 8 scattered hours.' }, lessonIds: ['learn-perf-01', 'learn-perf-02'], landmark: 'seed' },
  { id: 'perf-biology', title: { es: 'Energía Circadiana', en: 'Circadian Energy' }, description: { es: 'Calibra dopamina, sol y descansos ultradianos.', en: 'Calibrate dopamine, sun, and ultradian breaks.' }, lessonIds: ['learn-perf-03', 'learn-perf-04'], landmark: 'compass' },
  { id: 'perf-shutdown', title: { es: 'Ritual de Cierre', en: 'Shutdown Ritual' }, description: { es: 'Desconecta la mente y elimina bucles abiertos.', en: 'Disconnect the mind and kill open loops.' }, lessonIds: ['learn-perf-05'], landmark: 'summit' },
];

export const DATA_SCIENCE_SECTIONS: JourneySection[] = [
  { id: 'data-foundations', title: { es: 'Señal vs Ruido', en: 'Signal vs Noise' }, description: { es: 'Distingue correlación de causalidad y fija tu North Star.', en: 'Separate correlation from causation and set your North Star.' }, lessonIds: ['learn-data-01', 'learn-data-02'], landmark: 'seed' },
  { id: 'data-experimentation', title: { es: 'Experimentación & A/B', en: 'Experimentation & A/B' }, description: { es: 'Calcula muestras reales y elimina el sesgo de sobreajuste.', en: 'Calculate real samples and eliminate overfitting bias.' }, lessonIds: ['learn-data-03', 'learn-data-04'], landmark: 'compass' },
  { id: 'data-decisions', title: { es: 'Decision Intelligence', en: 'Decision Intelligence' }, description: { es: 'Convierte datos en contratos de acción binaria.', en: 'Turn data into binary operational action contracts.' }, lessonIds: ['learn-data-05'], landmark: 'summit' },
];

export function getSectionsForTrack(trackId: string): JourneySection[] {
  if (trackId === 'data-science' || trackId === 'tech-datascience') return DATA_SCIENCE_SECTIONS;
  if (trackId === 'ai-automation' || trackId === 'ai') return AI_SECTIONS;
  if (trackId === 'viral-growth' || trackId === 'business') return GROWTH_SECTIONS;
  if (trackId === 'history-strategy' || trackId === 'history') return HISTORY_SECTIONS;
  if (trackId === 'mindset-stoic' || trackId === 'mindset') return MINDSET_SECTIONS;
  if (trackId === 'peak-performance' || trackId === 'performance') return PERFORMANCE_SECTIONS;
  return INVESTING_SECTIONS;
}

export type JourneyNodeState = 'completed' | 'current' | 'review' | 'locked';
export interface JourneyNode { lesson: AtomicLesson; state: JourneyNodeState; reviewIds: string[] }

/** The same ordered policy drives the trail and its primary CTA. Reviews never revoke completed work. */
export function getJourneyNodes(track: InteractiveTrack, brain: BrainState, completedApplyIds: string[] = [], now = Date.now()): JourneyNode[] {
  const done = new Set(brain.missionHistory.filter(record => record.completed).map(record => record.missionId));
  completedApplyIds.forEach(id => done.add(id));
  return track.lessons.map((lesson, index) => {
    if (done.has(`field-${lesson.id}`)) return { lesson, state: 'completed', reviewIds: [] };
    const preceding = track.lessons.slice(0, index);
    if (preceding.some(item => !done.has(`field-${item.id}`))) return { lesson, state: 'locked', reviewIds: [] };
    const reviewIds = preceding.filter(item => {
      const card = brain.fsrsCards?.[item.id];
      if (!card) return false; // Legacy completion remains valid; review cards are created on the next recall.
      return new Date(card.due).getTime() <= now || card.state === 1 || card.state === 3;
    }).map(item => item.id);
    return { lesson, state: reviewIds.length ? 'review' : 'current', reviewIds };
  });
}
