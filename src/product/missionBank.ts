export type Competency = 'offer' | 'sales' | 'marketing' | 'mindset' | 'operations' | 'investing' | 'accounting' | 'ai';
export type Difficulty = 'easy' | 'medium' | 'hard';
export type MissionType = 'flashcard' | 'scenario_quiz' | 'real_world_task' | 'book_and_build' | 'book_lesson';

export type TrackType = 'investing' | 'business' | 'ai' | 'history' | 'mindset' | 'performance';

export interface CurriculumDay {
  dayId: string;
  dayNumber: number;
  missionIds: string[]; 
  actionItems?: string[]; 
}

export interface CurriculumLevel {
  levelId: string;
  levelNumber: number;
  title: string;
  subtitle: string;
  days: CurriculumDay[];
  applyNodeId?: string; // The mandatory real-world task to unlock the next level
}

export interface CurriculumTrack {
  trackId: TrackType;
  title: string;
  levels: CurriculumLevel[];
}

export interface ToolComparison {
  name: string;
  category: string;
  bestFor: string;
  pros: string[];
  url?: string;
  recommended?: boolean;
}

export interface PlaybookStep {
  stepNumber: number;
  title: string;
  instruction: string;
  proTip?: string;
}

export interface ExecutivePlaybook {
  source: {
    title: string;
    author: string;
    type: 'book' | 'article' | 'video' | 'paper';
    keyQuote?: string;
    url?: string;
  };
  mentalModel: {
    title: string;
    concept: string;
    whyItMatters: string;
    goldenRule: string;
  };
  toolComparisons?: ToolComparison[];
  protocolSteps: PlaybookStep[];
  applyMissionPrompt: {
    deliverableTitle: string;
    actionDescription: string;
    estimatedMinutes: number;
  };
}

export interface QuizOption {
  text: string;
  correct: boolean;
}

export interface LearningSource {
  type: 'book' | 'article' | 'video' | 'research';
  title: string;
  author: string;
  url?: string;
}

export interface MicroLessonCard {
  id: string;
  type: 'concept' | 'diagram' | 'dilemma' | 'recall';
  title: string;
  subtitle?: string;
  content: string;
  highlight?: string;
  tags?: string[];
  visual?: {
    type: 'metric' | 'comparison' | 'formula' | 'checklist';
    items?: { label: string; value: string; desc?: string; positive?: boolean }[];
    equation?: { left: string; operator: string; right: string; result: string };
  };
  options?: QuizOption[];
  feedback?: { correct: string; incorrect: string };
}

export interface BankMission {
  id: string;
  nodeType?: 'learn' | 'apply'; // NEW: Distinguishes between theory and practice
  competency: Competency;
  difficulty: Difficulty;
  type: MissionType;
  contentType?: 'video' | 'article' | 'book_extract';
  title: string;
  sources?: LearningSource[];
  concept?: string;
  keyTakeaway?: string;          
  quote?: { text: string; author: string; context: string };
  videoUrl?: string;
  reading?: { title?: string; subtitle: string; paragraphs: string[]; takeaway: string };
  bookExtract?: { bookTitle: string; author: string; excerpt: string; keyFramework: string };
  recallQuestion?: string;       
  recallOptions?: QuizOption[];  
  recallExplanation?: string;    
  scenario?: string;
  options?: QuizOption[];
  failureCritique?: string;
  taskBrief?: string;
  frameworkSteps?: { title: string; desc: string }[];
  verificationMethod?: 'photo' | 'link' | 'honor_system' | 'paper_trade';
  verificationTier?: 1 | 2; // NEW: 1 = Verified (Leaderboard XP), 2 = Self-Reported (Personal XP only)
  reflectionPrompt?: string; // NEW: Structured reflection for Tier 2
  minReflectionLength?: number; // NEW: Validation for Tier 2 reflection
  minTimeMinutes?: number; // NEW: Validation for minimum time spent
  requiredTrades?: number;
  xpReward: number;
  microCards?: MicroLessonCard[];
  playbook?: ExecutivePlaybook;
}

/**
 * Builds an Executive Action Playbook (Learn -> Apply) from any BankMission.
 */
export function getMissionPlaybook(mission: BankMission): ExecutivePlaybook {
  if (mission.playbook) return mission.playbook;

  const sourceTitle = mission.sources?.[0]?.title || 'The Intelligent Investor / Principios de Inversión';
  const author = mission.sources?.[0]?.author || (mission.quote?.author || 'Benjamin Graham / Ray Dalio');
  const quote = mission.quote?.text || mission.concept || 'Un activo pone dinero en tu bolsillo. La claridad en el proceso supera a la emoción del momento.';

  return {
    source: {
      title: sourceTitle,
      author,
      type: 'book',
      keyQuote: quote,
      url: mission.sources?.[0]?.url,
    },
    mentalModel: {
      title: mission.title,
      concept: mission.concept || 'El criterio táctico separa a los aficionados de los operadores de élite.',
      whyItMatters: mission.keyTakeaway || 'Comprender este fundamento te permite tomar decisiones basadas en evidencia y no en impulsos.',
      goldenRule: 'Ejecuta con método: define tu regla de entrada y salida antes de comprometer capital o tiempo.',
    },
    toolComparisons: [
      {
        name: 'TradingView Paper',
        category: 'Simulador / Gráficos',
        bestFor: 'Práctica visual y análisis de mercado en tiempo real',
        pros: ['Datos en vivo gratuitos', 'Interfaz moderna', 'Sin riesgo de capital'],
        recommended: true,
      },
      {
        name: 'Interactive Brokers Demo',
        category: 'Brokerage Profesional',
        bestFor: 'Órdenes avanzadas y spreads internacionales',
        pros: ['Entorno institucional exacto', 'Amplia gama de activos globales'],
      },
    ],
    protocolSteps: mission.frameworkSteps?.map((step, idx) => ({
      stepNumber: idx + 1,
      title: step.title,
      instruction: step.desc,
      proTip: 'Verifica tus supuestos antes de confirmar.',
    })) || [
      {
        stepNumber: 1,
        title: 'Analizar el Escenario',
        instruction: 'Revisa los datos fundamentales y valida si cumple con tu marco estratégico.',
        proTip: 'Evita decisiones apresuradas.',
      },
      {
        stepNumber: 2,
        title: 'Configurar la Posición',
        instruction: 'Define el tamaño adecuado y el límite de riesgo antes de operar.',
        proTip: 'Nunca arriesgues más del 2% por operación.',
      },
      {
        stepNumber: 3,
        title: 'Registrar la Evidencia',
        instruction: 'Documenta la tesis de inversión en tu bitácora de T1GER para calibrar tu proceso.',
      },
    ],
    applyMissionPrompt: {
      deliverableTitle: mission.taskBrief || `Aplicar: ${mission.title}`,
      actionDescription: mission.reflectionPrompt || 'Ejecuta la tarea en tu entorno real o simulado y documenta el resultado.',
      estimatedMinutes: 5,
    },
  };
}

export function getMissionMicroCards(mission: BankMission): MicroLessonCard[] {
  if (mission.microCards?.length) return mission.microCards;

  const concept = mission.concept || 'Master the core foundational principle.';
  const takeaway = mission.keyTakeaway || 'Apply this model in your next business decision.';
  const question = mission.recallQuestion || mission.scenario || 'What is the core strategic takeaway?';
  const options = mission.recallOptions || mission.options || [
    { text: takeaway, correct: true },
    { text: 'Short-term outcomes always justify improper risk.', correct: false },
    { text: 'More complexity is always better than execution.', correct: false }
  ];

  return [
    {
      id: `${mission.id}-card-1`,
      type: 'concept',
      title: mission.title,
      subtitle: 'MODELO MENTAL',
      content: concept,
      highlight: takeaway,
      tags: [mission.competency.toUpperCase(), `${mission.xpReward} XP`]
    },
    {
      id: `${mission.id}-card-2`,
      type: 'diagram',
      title: 'Desglose Táctico',
      subtitle: 'FRAMEWORK VISUAL',
      content: takeaway,
      visual: {
        type: 'metric',
        items: [
          { label: 'Impacto', value: '+35%', desc: 'Claridad en toma de decisiones', positive: true },
          { label: 'Riesgo', value: '-60%', desc: 'Reducción de errores impulsivos', positive: true }
        ]
      }
    },
    {
      id: `${mission.id}-card-3`,
      type: 'dilemma',
      title: 'Simulación de Caso Real',
      subtitle: 'DECISIÓN EN ALTO RIESGO',
      content: mission.scenario || `Estás evaluando una oportunidad en ${mission.competency}. Un socio te propone una táctica rápida pero con fundamentos dudosos.`,
      highlight: '¿Cuál es la decisión táctica correcta?'
    },
    {
      id: `${mission.id}-card-4`,
      type: 'recall',
      title: 'Active Recall Check',
      subtitle: 'COMPROBACIÓN DE RETENCIÓN',
      content: question,
      options,
      feedback: {
        correct: mission.recallExplanation || '¡Exacto! Tienes el criterio blindado.',
        incorrect: mission.failureCritique || 'Recuerda: la base siempre es la consistencia y la evidencia.'
      }
    }
  ];
}

const investingMissions: BankMission[] = [
  // ==========================================
  // LIBRO 1: PADRE RICO, PADRE POBRE (Robert Kiyosaki)
  // ==========================================
  {
    id: 'inv-m1-l1',
    nodeType: 'learn',
    competency: 'investing',
    difficulty: 'easy',
    type: 'book_lesson',
    title: 'Activos Reales vs Pasivos Disfrazados',
    concept: 'Un activo es todo aquello que pone dinero en tu bolsillo sin tu presencia física. Un pasivo es lo que saca dinero de tu bolsillo todos los meses, incluso si crees que es una inversión (como un auto de lujo o tu vivienda habitual con hipoteca alta).',
    keyTakeaway: 'La clase media compra pasivos creyendo que son activos. Los ricos compran activos que financian sus lujos.',
    quote: {
      text: 'Los ricos adquieren activos. Los pobres y la clase media adquieren pasivos pensando que son activos.',
      author: 'Robert Kiyosaki',
      context: 'Padre Rico, Padre Pobre'
    },
    sources: [{
      type: 'book',
      title: 'Padre Rico, Padre Pobre',
      author: 'Robert Kiyosaki',
      url: 'https://www.richdad.com/'
    }],
    playbook: {
      source: {
        title: 'Padre Rico, Padre Pobre',
        author: 'Robert Kiyosaki',
        type: 'book',
        keyQuote: 'Los ricos adquieren activos. Los pobres y la clase media adquieren pasivos pensando que son activos.'
      },
      mentalModel: {
        title: 'Activos vs Pasivos Disfrazados',
        concept: 'Un activo pone flujo de caja neto en tu bolsillo cada mes. Un pasivo drena tu liquidez aunque aumente de valor en el papel.',
        whyItMatters: 'Si no sabes clasificar tus posesiones, trabajarás más duro pero tu patrimonio neto real no crecerá.',
        goldenRule: 'Regla de oro: Antes de comprar un lujo o pasivo, compra un activo que genere el flujo para pagarlo.'
      },
      toolComparisons: [
        {
          name: 'Copilot Money / Wallet',
          category: 'Auditoría de Balance',
          bestFor: 'Seguimiento automático de patrimonio neto y flujo de caja mensual',
          pros: ['Categorización automática', 'Visualización de flujo neto', 'Móvil'],
          recommended: true
        },
        {
          name: 'Google Sheets / Excel',
          category: 'Plantilla Personalizada',
          bestFor: 'Control manual y privacidad absoluta sin conectar bancos',
          pros: ['100% personalizable', 'Gratis', 'Sin suscripciones']
        }
      ],
      protocolSteps: [
        {
          stepNumber: 1,
          title: 'Listar tus Activos Generadores',
          instruction: 'Anota cuentas de inversión, negocios, depósitos a plazo o bienes raíces con renta positiva.',
          proTip: 'No incluyas autos ni ropa.'
        },
        {
          stepNumber: 2,
          title: 'Auditar tus Pasivos Fijos',
          instruction: 'Identifica deudas de tarjeta de crédito, créditos de consumo y suscripciones olvidadas.',
          proTip: 'Elimina primero la deuda con mayor tasa de interés.'
        },
        {
          stepNumber: 3,
          title: 'Calcular tu Flujo de Caja Libre',
          instruction: 'Resta tus gastos mensuales totales a tus ingresos. Esa diferencia es tu capital de inversión real.'
        }
      ],
      applyMissionPrompt: {
        deliverableTitle: 'Misión: Audita tu Balance Personal',
        actionDescription: 'Abre tu hoja de cálculo o app financiera y clasifica tus 3 mayores gastos como activo o pasivo.',
        estimatedMinutes: 5
      }
    },
    xpReward: 100
  },
  {
    id: 'inv-m1-l2',
    nodeType: 'learn',
    competency: 'investing',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'El Cuadrante del Flujo de Dinero',
    concept: 'Existen 4 formas de generar riqueza: Empleado (E), Autoempleado (A), Dueño de Negocio con Sistema (D) e Inversionista (I). La verdadera libertad financiera solo ocurre cuando tus ingresos provienen del lado derecho (D e I).',
    keyTakeaway: 'Cambiar tiempo por dinero tiene un techo biológico de 24 horas. Los sistemas y el capital trabajan mientras duermes.',
    quote: {
      text: 'Si no encuentras una forma de ganar dinero mientras duermes, trabajarás hasta que mueras.',
      author: 'Warren Buffett & Robert Kiyosaki',
      context: 'El Cuadrante del Flujo de Dinero'
    },
    sources: [{
      type: 'book',
      title: 'El Cuadrante del Flujo de Dinero',
      author: 'Robert Kiyosaki',
      url: 'https://www.richdad.com/'
    }],
    xpReward: 100
  },
  {
    id: 'inv-m1-apply',
    nodeType: 'apply',
    competency: 'investing',
    difficulty: 'medium',
    type: 'real_world_task',
    title: 'Calcular tu Balance Financiero Real',
    taskBrief: 'Calcula tu patrimonio neto real (Activos - Pasivos) y define tu capital mensual disponible para invertir.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: 'Escribe tu total estimado de activos, total de pasivos, y 1 gasto recurrente que vas a recortar este mes.',
    minReflectionLength: 80,
    xpReward: 250,
    frameworkSteps: [
      { title: 'Totalizar Activos', desc: 'Suma liquidez, inversiones y cuentas de ahorro.' },
      { title: 'Totalizar Deudas', desc: 'Suma tarjetas, préstamos y compromisos.' },
      { title: 'Fijar Compromiso', desc: 'Define un porcentaje mínimo (ej. 15%) de tus ingresos para invertir cada mes.' }
    ]
  },

  // ==========================================
  // LIBRO 2: LA PSICOLOGÍA DEL DINERO (Morgan Housel)
  // ==========================================
  {
    id: 'inv-m2-l1',
    nodeType: 'learn',
    competency: 'mindset',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'La Riqueza es lo que NO Ves',
    concept: 'Gastar dinero para demostrarle a la gente cuánto dinero tienes es la forma más rápida de tener menos dinero. El estatus es visible; la riqueza es la libertad, las opciones y la tranquilidad que no necesitas presumir.',
    keyTakeaway: 'La mayor rentabilidad financiera es el control sobre tu tiempo.',
    quote: {
      text: 'Gastar dinero para mostrarle a la gente que tienes dinero es la forma más rápida de quedarte sin dinero.',
      author: 'Morgan Housel',
      context: 'La Psicología del Dinero'
    },
    sources: [{
      type: 'book',
      title: 'La Psicología del Dinero',
      author: 'Morgan Housel'
    }],
    xpReward: 100
  },
  {
    id: 'inv-m2-l2',
    nodeType: 'learn',
    competency: 'mindset',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'La Fuerza del Interés Compuesto',
    concept: 'Más del 95% de la fortuna de Warren Buffett se acumuló después de sus 65 años. El secreto de la inversión no es buscar rentabilidades del 1000% en un mes, sino mantener un 10-15% constante durante 10, 20 o 30 años sin interrumpirlo.',
    keyTakeaway: 'La consistencia en el tiempo vence a la genialidad del momento.',
    sources: [{
      type: 'book',
      title: 'La Psicología del Dinero',
      author: 'Morgan Housel'
    }],
    xpReward: 100
  },
  {
    id: 'inv-m2-apply',
    nodeType: 'apply',
    competency: 'mindset',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Configurar tu Fondo de Paz Mental (3 Meses)',
    taskBrief: 'Calcula tu costo de vida mensual básico y diseña tu plan para acumular 3 meses de reserva intacta.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Cuánto cuesta exactamente 1 mes de tu vida básica? ¿Cuántos meses de liquidez tienes hoy y cuál es tu meta?',
    minReflectionLength: 60,
    xpReward: 300,
    frameworkSteps: [
      { title: 'Calcular Costo Esencial', desc: 'Arriendo/vivienda + comida + servicios básicos.' },
      { title: 'Multiplicar por 3', desc: 'Esa cifra es tu seguro contra decisiones impulsivas.' },
      { title: 'Separar la Cuenta', desc: 'Mantén este dinero en una cuenta de alto rendimiento separada de tu gasto diario.' }
    ]
  },

  // ==========================================
  // LIBRO 3: EL INVERSOR INTELIGENTE (Benjamin Graham / Buffett)
  // ==========================================
  {
    id: 'inv-m3-l1',
    nodeType: 'learn',
    competency: 'investing',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'Mr. Market: Inversor vs Especulador',
    concept: 'El mercado de valores es como un socio maníaco-depresivo llamado Mr. Market que cada día te ofrece comprar o vender acciones a precios irracionales. El inversor inteligente aprovecha el pánico para comprar y el optimismo ciego para vender.',
    keyTakeaway: 'El precio es lo que pagas; el valor es lo que recibes.',
    quote: {
      text: 'El inversor inteligente es un realista que vende a los optimistas y compra a los pesimistas.',
      author: 'Benjamin Graham',
      context: 'El Inversor Inteligente'
    },
    sources: [{
      type: 'book',
      title: 'El Inversor Inteligente',
      author: 'Benjamin Graham'
    }],
    xpReward: 100
  },
  {
    id: 'inv-m3-l2',
    nodeType: 'learn',
    competency: 'investing',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'Fondos Indexados (ETFs: VTI, S&P 500)',
    concept: 'Comprar una sola acción es apostar a un caballo; comprar un fondo indexado como VTI o VOO es ser dueño de los 500 caballos más rápidos del mundo. Históricamente, el 90% de los gestores profesionales pierden contra el índice en 10 años.',
    keyTakeaway: 'No busques la aguja en el pajar: compra todo el pajar.',
    sources: [{
      type: 'book',
      title: 'El Pequeño Libro para Invertir con Sentido Común',
      author: 'John C. Bogle (Fundador de Vanguard)'
    }],
    playbook: {
      source: {
        title: 'El Pequeño Libro para Invertir con Sentido Común',
        author: 'John C. Bogle',
        type: 'book',
        keyQuote: 'No busques la aguja en el pajar. Simplemente compra todo el pajar.'
      },
      mentalModel: {
        title: 'Indexación Pasiva de Bajo Costo',
        concept: 'Comprar el índice completo elimina el riesgo de quiebra individual y garantiza la rentabilidad histórica del capitalismo global.',
        whyItMatters: 'Comisiones del 2% anual pueden comerse el 40% de tus retornos en 25 años. Los ETFs cobran menos del 0.05%.',
        goldenRule: 'Aportes recurrentes y automáticos superan a intentar adivinar el momento exacto del mercado.'
      },
      toolComparisons: [
        {
          name: 'TradingView Paper Trading',
          category: 'Simulador en Tiempo Real',
          bestFor: 'Aprender a colocar órdenes sin riesgo de capital',
          pros: ['Gráficos profesionales', 'Datos en vivo', 'Sin depósito'],
          recommended: true
        },
        {
          name: 'Interactive Brokers / Charles Schwab',
          category: 'Brokerage Internacional',
          bestFor: 'Inversión real a largo plazo con comisiones mínimas',
          pros: ['ETFs globales (VTI, VOO, VT)', 'Regulación de primer nivel']
        }
      ],
      protocolSteps: [
        {
          stepNumber: 1,
          title: 'Crear Cuenta en TradingView',
          instruction: 'Abre TradingView y activa el panel inferior de Paper Trading.',
          proTip: 'Usa una cuenta demo de $10,000 para simular montos realistas.'
        },
        {
          stepNumber: 2,
          title: 'Buscar el Ticker VTI / SPY',
          instruction: 'Observa el gráfico histórico a 5 años y comprende su tendencia a largo plazo.',
          proTip: 'Los retrocesos del 10-20% son normales y saludables en la historia.'
        },
        {
          stepNumber: 3,
          title: 'Colocar tu Primera Orden Simulada',
          instruction: 'Ejecuta una orden de compra Market o Limit en tu simulador de T1GER.'
        }
      ],
      applyMissionPrompt: {
        deliverableTitle: 'Misión: Coloca tu Primer Paper Trade',
        actionDescription: 'Utiliza el simulador de T1GER o TradingView y coloca tu primera orden simulada en VTI.',
        estimatedMinutes: 5
      }
    },
    xpReward: 100
  },
  {
    id: 'inv-m3-apply',
    nodeType: 'apply',
    competency: 'investing',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Colocar tu Primer Paper Trade en T1GER',
    taskBrief: 'Utiliza el portafolio simulado de T1GER para ejecutar una orden en un fondo indexado y registrar tu tesis.',
    verificationMethod: 'paper_trade',
    verificationTier: 1,
    requiredTrades: 1,
    xpReward: 350,
    frameworkSteps: [
      { title: 'Seleccionar Activo', desc: 'Elige VTI (Mercado total) o AAPL/MSFT.' },
      { title: 'Fijar Monto Simulado', desc: 'Asigna un porcentaje prudente del portafolio ($1,000 - $10,000).' },
      { title: 'Documentar Tesis', desc: 'Escribe por qué este activo sobrevivirá los próximos 10 años.' }
    ]
  },

  // ==========================================
  // LIBRO 4: PRINCIPIOS (Ray Dalio)
  // ==========================================
  {
    id: 'inv-m4-l1',
    nodeType: 'learn',
    competency: 'investing',
    difficulty: 'hard',
    type: 'book_lesson',
    title: 'La Máquina Económica y Ciclos de Deuda',
    concept: 'La economía funciona como una máquina simple impulsada por la productividad, el ciclo de deuda a corto plazo y el ciclo de deuda a largo plazo. Entender dónde estamos en el ciclo te permite estructurar un portafolio "All Weather" que resiste cualquier tormenta.',
    keyTakeaway: 'No intentes predecir el futuro; construye un sistema que sobreviva todas las posibilidades.',
    quote: {
      text: 'Quien vive de la bola de cristal comerá vidrio molido.',
      author: 'Ray Dalio',
      context: 'Principios'
    },
    sources: [{
      type: 'book',
      title: 'Principios',
      author: 'Ray Dalio'
    }],
    xpReward: 100
  },
  {
    id: 'inv-m4-apply',
    nodeType: 'apply',
    competency: 'investing',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Auditoría "All Weather" de tu Portafolio',
    taskBrief: 'Evalúa la diversificación de tus activos. ¿Sobreviviría tu portafolio a una inflación extrema o a una recesión severa?',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: 'Si el mercado de valores cae 40% mañana, ¿qué activo de tu balance te protegería? (Ej: Oro, Bonos, Efectivo, Inmuebles)',
    minReflectionLength: 80,
    xpReward: 400,
    frameworkSteps: [
      { title: 'Estresar el Sistema', desc: 'Asume un escenario de alta inflación y estancamiento.' },
      { title: 'Identificar el Escudo', desc: 'Verifica qué porcentaje tienes en activos refugio.' },
      { title: 'Rebalanceo Teórico', desc: 'Define qué comprarías hoy para blindar tu patrimonio.' }
    ]
  },

  // ==========================================
  // LIBRO 5: LO MÁS IMPORTANTE PARA INVERTIR CON SENTIDO COMÚN (Howard Marks)
  // ==========================================
  {
    id: 'inv-m5-l1',
    nodeType: 'learn',
    competency: 'investing',
    difficulty: 'hard',
    type: 'book_lesson',
    title: 'Pensamiento de Segundo Nivel',
    concept: 'El pensamiento de primer nivel dice: "Es una buena empresa, compremos la acción". El de segundo nivel dice: "Es una buena empresa, pero todo el mundo lo sabe, por lo que la acción está sobrevalorada. Vendamos".',
    keyTakeaway: 'Para lograr rendimientos superiores al promedio, tu pensamiento debe ser diferente y mejor que el de la multitud.',
    quote: {
      text: 'No puedes hacer lo mismo que los demás y esperar un resultado diferente.',
      author: 'Howard Marks',
      context: 'Lo Más Importante'
    },
    sources: [{
      type: 'book',
      title: 'Lo Más Importante para Invertir',
      author: 'Howard Marks'
    }],
    xpReward: 100
  },
  {
    id: 'inv-m5-apply',
    nodeType: 'apply',
    competency: 'investing',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Análisis Contrarian de Segundo Nivel',
    taskBrief: 'Toma el activo de moda actual (cripto, IA, etc.) y escribe una tesis contrarian sobre por qué podría estar sobrevalorado.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Cuál es el consenso actual del mercado sobre este activo, y cuál es tu pensamiento de "Segundo Nivel" que difiere?',
    minReflectionLength: 70,
    xpReward: 300,
    frameworkSteps: [
      { title: 'Identificar el Consenso', desc: '¿Qué es lo que todo el mundo está comprando por FOMO?' },
      { title: 'Buscar la Falla', desc: '¿Qué riesgo sistémico están ignorando los optimistas?' },
      { title: 'Posición Contrarian', desc: 'Define a qué precio realmente valdría la pena entrar.' }
    ]
  },

  // ==========================================
  // LIBRO 6: UN PASO POR DELANTE DE WALL STREET (Peter Lynch)
  // ==========================================
  {
    id: 'inv-m6-l1',
    nodeType: 'learn',
    competency: 'investing',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'Invierte en lo que Conoces',
    concept: 'El inversor particular tiene una enorme ventaja sobre Wall Street: puede ver las tendencias de consumo antes que los analistas. Si tu esposa, tus hijos y tus amigos no paran de comprar un producto excelente, ahí tienes una pista de inversión antes de que llegue a los fondos institucionales.',
    keyTakeaway: 'Tu vida diaria es el mejor radar para encontrar empresas "Tenbaggers" (que multiplican por 10).',
    quote: {
      text: 'La mejor acción para comprar es a menudo una que ya tienes en tu cartera.',
      author: 'Peter Lynch',
      context: 'Un Paso por Delante de Wall Street'
    },
    sources: [{
      type: 'book',
      title: 'Un Paso por Delante de Wall Street',
      author: 'Peter Lynch'
    }],
    xpReward: 100
  },
  {
    id: 'inv-m6-apply',
    nodeType: 'apply',
    competency: 'investing',
    difficulty: 'medium',
    type: 'real_world_task',
    title: 'Radar de Consumo',
    taskBrief: 'Identifica 1 producto o servicio que usas fanáticamente cada semana y analiza si es una empresa pública.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Qué empresa descubriste en tu vida diaria? ¿Cotiza en bolsa (ticker) y cuál es su ventaja competitiva visible?',
    minReflectionLength: 80,
    xpReward: 350,
    frameworkSteps: [
      { title: 'Auditar Consumo', desc: 'Revisa tus suscripciones, supermercado o apps favoritas.' },
      { title: 'Investigar Ticker', desc: 'Busca si la empresa cotiza en bolsa (ej: NASDAQ/NYSE).' },
      { title: 'Tesis Simple', desc: 'Escribe por qué crees que sus ventas seguirán subiendo.' }
    ]
  }
];

import { businessMissions, businessLevels } from './curriculum/business';
import { aiMissions, aiLevels } from './curriculum/ai';
import { INTERACTIVE_FIELD_MISSION_BANK, INTERACTIVE_MISSION_BANK } from './interactiveCurriculum';

export const MISSION_BANK: BankMission[] = [
  ...investingMissions,
  ...businessMissions,
  ...aiMissions,
  ...INTERACTIVE_MISSION_BANK,
  ...INTERACTIVE_FIELD_MISSION_BANK,
];

export const CURRICULUM_TRACKS: Record<TrackType, CurriculumTrack> = {
  investing: {
    trackId: 'investing',
    title: 'RUTAS DE MAESTRÍA & LIBROS',
    levels: [
      {
        levelId: 'inv-level-1',
        levelNumber: 1,
        title: 'Padre Rico, Padre Pobre',
        subtitle: 'Robert Kiyosaki · Activos vs Pasivos y Flujo de Caja',
        applyNodeId: 'inv-m1-apply',
        days: [
          { dayId: 'inv-1-d1', dayNumber: 1, missionIds: ['inv-m1-l1'] },
          { dayId: 'inv-1-d2', dayNumber: 2, missionIds: ['inv-m1-l2'] },
        ]
      },
      {
        levelId: 'inv-level-2',
        levelNumber: 2,
        title: 'La Psicología del Dinero',
        subtitle: 'Morgan Housel · Emociones, Libertad e Interés Compuesto',
        applyNodeId: 'inv-m2-apply',
        days: [
          { dayId: 'inv-2-d1', dayNumber: 3, missionIds: ['inv-m2-l1'] },
          { dayId: 'inv-2-d2', dayNumber: 4, missionIds: ['inv-m2-l2'] },
        ]
      },
      {
        levelId: 'inv-level-3',
        levelNumber: 3,
        title: 'El Inversor Inteligente',
        subtitle: 'Benjamin Graham & Bogle · Mr. Market y Fondos Indexados',
        applyNodeId: 'inv-m3-apply',
        days: [
          { dayId: 'inv-3-d1', dayNumber: 5, missionIds: ['inv-m3-l1'] },
          { dayId: 'inv-3-d2', dayNumber: 6, missionIds: ['inv-m3-l2'] },
        ]
      },
      {
        levelId: 'inv-level-4',
        levelNumber: 4,
        title: 'Principios',
        subtitle: 'Ray Dalio · All Weather Portfolio y Ciclos de Deuda',
        applyNodeId: 'inv-m4-apply',
        days: [
          { dayId: 'inv-4-d1', dayNumber: 7, missionIds: ['inv-m4-l1'] },
        ]
      },
      {
        levelId: 'inv-level-5',
        levelNumber: 5,
        title: 'Lo Más Importante',
        subtitle: 'Howard Marks · Pensamiento de Segundo Nivel y Riesgo',
        applyNodeId: 'inv-m5-apply',
        days: [
          { dayId: 'inv-5-d1', dayNumber: 8, missionIds: ['inv-m5-l1'] },
        ]
      },
      {
        levelId: 'inv-level-6',
        levelNumber: 6,
        title: 'Un Paso por Delante de Wall Street',
        subtitle: 'Peter Lynch · El Borde Competitivo del Inversor Cotidiano',
        applyNodeId: 'inv-m6-apply',
        days: [
          { dayId: 'inv-6-d1', dayNumber: 9, missionIds: ['inv-m6-l1'] },
        ]
      }
    ]
  },
  business: {
    trackId: 'business',
    title: 'BUSINESS & ENTREPRENEURSHIP',
    levels: businessLevels
  },
  ai: {
    trackId: 'ai',
    title: 'ARTIFICIAL INTELLIGENCE',
    levels: aiLevels
  },
  history: {
    trackId: 'history',
    title: 'ESTRATEGIA & HISTORIA',
    levels: [
      {
        levelId: 'hist-level-1',
        levelNumber: 1,
        title: 'El Arte de la Guerra',
        subtitle: 'Sun Tzu · Terreno, Maniobra y Victoria Anticipada',
        applyNodeId: 'field-learn-history-01',
        days: [{ dayId: 'hist-1-d1', dayNumber: 1, missionIds: ['learn-history-01'] }]
      }
    ]
  },
  mindset: {
    trackId: 'mindset',
    title: 'MENTE & ESTOICISMO',
    levels: [
      {
        levelId: 'mind-level-1',
        levelNumber: 1,
        title: 'Meditaciones',
        subtitle: 'Marco Aurelio · Dicotomía del Control y Fortaleza Emocional',
        applyNodeId: 'field-learn-mindset-01',
        days: [{ dayId: 'mind-1-d1', dayNumber: 1, missionIds: ['learn-mindset-01'] }]
      }
    ]
  },
  performance: {
    trackId: 'performance',
    title: 'RENDIMIENTO & FOCO',
    levels: [
      {
        levelId: 'perf-level-1',
        levelNumber: 1,
        title: 'Deep Work',
        subtitle: 'Cal Newport · Concentración Extrema en un Mundo de Distracciones',
        applyNodeId: 'field-learn-perf-01',
        days: [{ dayId: 'perf-1-d1', dayNumber: 1, missionIds: ['learn-perf-01'] }]
      }
    ]
  }
};

export const COMPETENCY_LABELS: Record<Competency, string> = {
  offer: 'Offer Design',
  sales: 'Sales & Closing',
  marketing: 'Marketing & Leads',
  mindset: 'Learning Mindset',
  operations: 'Systems & Ops',
  investing: 'Investing Basics',
  accounting: 'Accounting',
  ai: 'Artificial Intelligence'
};

export interface StandardHabit {
  id: string;
  label: string;
  icon: string;
  category: 'morning' | 'business' | 'wellness';
}

export const STANDARD_HABITS: StandardHabit[] = [
  { id: 'sh1', label: 'Make your bed', icon: 'Bed', category: 'morning' },
  { id: 'sh2', label: 'Morning Cardio (20 min)', icon: 'Flame', category: 'morning' },
  { id: 'sh3', label: 'Cold Shower', icon: 'Droplets', category: 'morning' },
  { id: 'sh4', label: 'Deep Work Block (90 min)', icon: 'Brain', category: 'business' },
  { id: 'sh5', label: 'Daily Outreach (10 leads)', icon: 'Rocket', category: 'business' },
  { id: 'sh9', label: '20 Outbound B2B Touchpoints', icon: 'Send', category: 'business' },
  { id: 'sh10', label: 'Update CRM Pipeline', icon: 'BarChart2', category: 'business' },
  { id: 'sh6', label: 'Read 10 pages', icon: 'Book', category: 'wellness' },
  { id: 'sh7', label: 'No Sugar Day', icon: 'Zap', category: 'wellness' },
  { id: 'sh8', label: 'Plan Tomorrow', icon: 'Target', category: 'business' },
];

export const ALL_COMPETENCIES: Competency[] = ['offer', 'sales', 'marketing', 'mindset', 'operations', 'investing', 'accounting', 'ai'];
