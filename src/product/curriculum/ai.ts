import type { BankMission, CurriculumLevel } from '../missionBank';

export const aiMissions: BankMission[] = [
  // LEVEL 1: The Coming Wave - Mustafa Suleyman
  {
    id: 'ai-m1-l1',
    nodeType: 'learn',
    competency: 'ai',
    difficulty: 'easy',
    type: 'book_lesson',
    title: 'La Próxima Ola y el Dilema de la Contención',
    concept: 'La Inteligencia Artificial y la biología sintética son tecnologías de propósito general que reducirán drásticamente el costo de la inteligencia y la síntesis biológica. A diferencia de tecnologías pasadas, la IA es recursiva: se mejora a sí misma de forma exponencial. El gran dilema del siglo XXI es la "Contención": cómo canalizar su inmenso poder productivo sin permitir la proliferación de capacidades catastróficas.',
    keyTakeaway: 'La IA no es una herramienta ordinaria; es un meta-invento que acelera todas las demás invenciones.',
    quote: {
      text: 'Estamos cruzando un umbral histórico: la inteligencia se está convirtiendo en una utilidad tan ubicua y barata como el agua corriente.',
      author: 'Mustafa Suleyman',
      context: 'The Coming Wave'
    },
    sources: [{ type: 'book', title: 'The Coming Wave', author: 'Mustafa Suleyman' }],
    recallQuestion: '¿Por qué Mustafa Suleyman define a la Inteligencia Artificial como una tecnología exponencialmente diferente a las anteriores?',
    recallOptions: [
      { text: 'Porque es auto-recursiva y acelera el desarrollo de todas las demás ciencias y tecnologías', correct: true },
      { text: 'Porque solo puede ser programada por gobiernos centrales', correct: false },
      { text: 'Porque requiere hardware que nunca se devalúa', correct: false }
    ],
    recallExplanation: 'La IA es recursiva: los modelos de IA se utilizan para diseñar mejores algoritmos, chips y fármacos, creando un ciclo de mejora exponencial.',
    xpReward: 100
  },
  {
    id: 'ai-m1-apply',
    nodeType: 'apply',
    competency: 'ai',
    difficulty: 'medium',
    type: 'real_world_task',
    title: 'Auditoría de Reemplazo y Amplificación',
    taskBrief: 'Haz un inventario de 3 tareas operativas de tu día a día que ya pueden ser automatizadas al 80% con modelos de frontera (ej. Claude 3.5 Sonnet o GPT-4o).',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Qué 3 tareas auditaste, qué herramienta de IA usarás y cuántas horas por semana liberarás?',
    minReflectionLength: 60,
    xpReward: 350,
    frameworkSteps: [
      { title: 'Identificar Tareas de Alto Volumen', desc: 'Anota tareas repetitivas de redacción, análisis de datos o resumen de documentos.' },
      { title: 'Diseñar el Pipeline de IA', desc: 'Configura un prompt reusable o script que ejecute la tarea de inmediato.' },
      { title: 'Medir el Ahorro de Tiempo', desc: 'Calcula el retorno de inversión en tiempo liberado para actividades de alto impacto.' }
    ]
  },

  // LEVEL 2: AI Superpowers - Kai-Fu Lee
  {
    id: 'ai-m2-l1',
    nodeType: 'learn',
    competency: 'ai',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'La Era de la Implementación y los Datos',
    concept: 'El campo de la IA ha pasado de la "Era del Descubrimiento" (donde unos pocos investigadores creaban algoritmos base) a la "Era de la Implementación" (donde la ventaja competitiva no la tiene quien inventa el modelo, sino quien tiene más datos propietarios, mayor potencia de cómputo y mejor velocidad de ejecución en el mundo real).',
    keyTakeaway: 'Los algoritmos base se democratizan; el foso defensivo reside en tus datos de clientes y tu velocidad de distribución.',
    quote: {
      text: 'Si los datos son el nuevo petróleo del siglo XXI, las empresas que posean los datos más limpios dominarán la economía.',
      author: 'Kai-Fu Lee',
      context: 'AI Superpowers'
    },
    sources: [{ type: 'book', title: 'AI Superpowers', author: 'Kai-Fu Lee' }],
    recallQuestion: 'En la "Era de la Implementación" descrita por Kai-Fu Lee, ¿cuál es el factor determinante para el éxito de una empresa con IA?',
    recallOptions: [
      { text: 'Tener datos propietarios limpios y una ejecución tenaz en el producto final', correct: true },
      { text: 'Inventar una nueva arquitectura de red neuronal desde cero', correct: false },
      { text: 'Evitar el uso de modelos de lenguaje pre-entrenados comerciales', correct: false }
    ],
    recallExplanation: 'Los modelos fundacionales se vuelven commodities; la verdadera ventaja de mercado proviene de combinar esos modelos con datos propietarios y experiencia de usuario superior.',
    xpReward: 120
  },
  {
    id: 'ai-m2-apply',
    nodeType: 'apply',
    competency: 'ai',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Construcción del Foso de Datos Propietarios',
    taskBrief: 'Diseña un mecanismo dentro de tu negocio o flujo de trabajo para capturar y estructurar datos que nadie más en tu mercado esté registrando.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Qué dato único de tus clientes o procesos vas a recopilar y cómo entrenará a tus agentes de IA personalizados?',
    minReflectionLength: 70,
    xpReward: 350,
    frameworkSteps: [
      { title: 'Auditar Datos Invisibles', desc: 'Identifica qué información valiosa de conversaciones o transacciones se pierde hoy en día.' },
      { title: 'Estructurar el Pipeline', desc: 'Crea una base de datos o almacenamiento en formato JSON/Vectorial para alimentar contexto a la IA.' },
      { title: 'Crear Bucle de Retroalimentación', desc: 'Asegúrate de que cada uso del producto genere mejores datos para afinar el modelo.' }
    ]
  },

  // LEVEL 3: Superintelligence & Life 3.0 - Nick Bostrom & Max Tegmark
  {
    id: 'ai-m3-l1',
    nodeType: 'learn',
    competency: 'ai',
    difficulty: 'hard',
    type: 'book_lesson',
    title: 'El Problema de la Alineación y AGI',
    concept: 'Una superinteligencia artificial no necesita tener emociones ni maldad para ser peligrosa; solo necesita ser extraordinariamente competente y optimizar una función objetivo mal especificada (ej. el famoso experimento mental del fabricante de clips de Bostrom). La Alineación de IA busca garantizar que los objetivos de los sistemas inteligentes coincidan de forma inquebrantable con los valores y la supervivencia humana.',
    keyTakeaway: 'Especificar exactamente qué quieres que optimice un sistema inteligente es uno de los mayores desafíos intelectuales.',
    quote: {
      text: 'El verdadero riesgo con la IA no es la malicia, sino la competencia extrema en una dirección equivocada.',
      author: 'Max Tegmark',
      context: 'Life 3.0'
    },
    sources: [{ type: 'book', title: 'Superintelligence', author: 'Nick Bostrom' }, { type: 'book', title: 'Life 3.0', author: 'Max Tegmark' }],
    recallQuestion: '¿En qué consiste el "Problema de la Alineación" (AI Alignment)?',
    recallOptions: [
      { text: 'Asegurar que los objetivos reales de la IA coincidan con las intenciones y valores humanos, evitando efectos secundarios imprevistos', correct: true },
      { text: 'Alinear los cables de los centros de datos cuánticos', correct: false },
      { text: 'Lograr que todos los países usen exactamente el mismo chip de GPU', correct: false }
    ],
    recallExplanation: 'Si un sistema superinteligente optimiza un objetivo literal sin límites ni restricciones éticas, puede causar consecuencias destructivas imprevistas.',
    xpReward: 130
  },
  {
    id: 'ai-m3-apply',
    nodeType: 'apply',
    competency: 'ai',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Diseño de un System Prompt Blindado con Guardrails',
    taskBrief: 'Escribe el System Prompt de un agente de IA para tu empresa con reglas estrictas de alineación, tono y prohibiciones explícitas.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: 'Pega tu System Prompt estructurado. ¿Qué casos límite (edge cases) y límites de seguridad definiste?',
    minReflectionLength: 80,
    xpReward: 400,
    frameworkSteps: [
      { title: 'Rol y Objetivo Primario', desc: 'Define con precisión milimétrica la identidad y el resultado que debe entregar el agente.' },
      { title: 'Restricciones y Prohibiciones (Never Rules)', desc: 'Enumera qué información nunca debe revelar y qué temas debe rechazar con cortesía.' },
      { title: 'Formato de Salida y Criterio de Verificación', desc: 'Exige que el modelo justifique su razonamiento antes de responder (Chain-of-Thought).' }
    ]
  },

  // LEVEL 4: Cognitive Architectures & Karpathy OS
  {
    id: 'ai-m4-l1',
    nodeType: 'learn',
    competency: 'ai',
    difficulty: 'hard',
    type: 'book_lesson',
    title: 'LLMs como Nuevos Sistemas Operativos',
    concept: 'Como explica Andrej Karpathy (ex-director de IA en Tesla y cofundador de OpenAI), un Modelo de Lenguaje de Frontera no es un simple chatbot de texto; es la CPU de una nueva arquitectura informática. La ventana de contexto es la memoria RAM, los embeddings y bases de datos vectoriales son el disco duro, y las llamadas a herramientas (function calling / APIs) son los periféricos y actuadores.',
    keyTakeaway: 'No uses a la IA solo para charlar; úsala como el motor de orquestación de tu sistema de software.',
    quote: {
      text: 'El lenguaje natural es el lenguaje de programación más poderoso del planeta.',
      author: 'Andrej Karpathy',
      context: 'Building LLM OS'
    },
    sources: [{ type: 'article', title: 'State of GPT & LLM OS Concept', author: 'Andrej Karpathy' }],
    recallQuestion: 'En la analogía de Andrej Karpathy sobre el "LLM como Sistema Operativo", ¿qué componente representa la ventana de contexto del modelo?',
    recallOptions: [
      { text: 'La memoria RAM de trabajo a la que el procesador (LLM) tiene acceso inmediato', correct: true },
      { text: 'El disco duro de almacenamiento a largo plazo', correct: false },
      { text: 'La tarjeta de sonido y periféricos físicos', correct: false }
    ],
    recallExplanation: 'La ventana de contexto permite al LLM retener y manipular información en tiempo real durante una sesión, exactamente como la memoria RAM en una computadora.',
    xpReward: 140
  },
  {
    id: 'ai-m4-apply',
    nodeType: 'apply',
    competency: 'ai',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Arquitectura de Context Window Management (RAG)',
    taskBrief: 'Diseña una base de conocimiento o documento maestro de contexto para que un LLM responda con 0% de alucinaciones sobre tu negocio.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Cómo estructuraste tu base de conocimiento para que la IA cite fuentes y nunca invente información?',
    minReflectionLength: 70,
    xpReward: 400,
    frameworkSteps: [
      { title: 'Estructurar Documentos Fuente', desc: 'Convierte tus políticas y datos en formato Markdown limpio y modular.' },
      { title: 'Inyectar Regla de Abstención', desc: 'Instruye al modelo: "Si la respuesta no está en el contexto provisto, di explícitamente \'No tengo esa información\'".' },
      { title: 'Prueba de Estrés contra Alucinaciones', desc: 'Hazle 3 preguntas trampa con datos falsos y verifica que no caiga en el engaño.' }
    ]
  },

  // LEVEL 5: Autonomous Agents & ReAct Pattern
  {
    id: 'ai-m5-l1',
    nodeType: 'learn',
    competency: 'ai',
    difficulty: 'hard',
    type: 'book_lesson',
    title: 'Agentes Autónomos y el Patrón ReAct',
    concept: 'Un agente de IA va más allá de predecir la siguiente palabra: percibe su entorno, razona sobre el estado actual, selecciona una herramienta externa (navegador web, terminal, base de datos), ejecuta una acción y observa el resultado en un bucle continuo. Este es el patrón ReAct (Reason + Act): combinar el razonamiento paso a paso con la ejecución de herramientas.',
    keyTakeaway: 'Los agentes exitosos no resuelven todo en un solo prompt; descomponen problemas complejos en bucles de acción y verificación.',
    quote: {
      text: 'Los verdaderos agentes autónomos no solo responden preguntas; cambian el estado del mundo real mediante herramientas.',
      author: 'Harrison Chase',
      context: 'LangChain & Autonomous Agents Architecture'
    },
    sources: [{ type: 'research', title: 'ReAct: Synergizing Reasoning and Acting in Language Models', author: 'Yao et al. / Princeton & Google Research' }],
    recallQuestion: '¿Cuál es la característica principal que distingue a un "Agente de IA" de un simple modelo de texto?',
    recallOptions: [
      { text: 'Su capacidad de usar herramientas externas en bucles de Razonamiento + Acción (ReAct) para interactuar con el entorno', correct: true },
      { text: 'Que responde con mayor velocidad de palabras por segundo', correct: false },
      { text: 'Que nunca comete errores de ortografía', correct: false }
    ],
    recallExplanation: 'Un agente autónomo tiene acceso a herramientas externas (APIs, calculadoras, navegadores) y puede evaluar el resultado de sus acciones para corregir su trayectoria.',
    xpReward: 150
  },
  {
    id: 'ai-m5-apply',
    nodeType: 'apply',
    competency: 'ai',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Diseño de Flujo de Trabajo Multi-Agente',
    taskBrief: 'Mapea una cadena de 2 o más agentes especializados para resolver un proceso complejo (ej. Agente Investigador → Agente Redactor → Agente Crítico de Calidad).',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: 'Describe los roles y la interacción entre tus agentes. ¿Qué rol tiene el agente supervisor o de control de calidad?',
    minReflectionLength: 75,
    xpReward: 450,
    frameworkSteps: [
      { title: 'Dividir Especialidades', desc: 'Asigna a cada agente un rol enfocado en lugar de pedirle a un solo prompt que haga todo.' },
      { title: 'Definir el Formato de Entrega', desc: 'Establece cómo el Agente A le pasa el resultado en limpio al Agente B.' },
      { title: 'Bucle de Crítica y Refinamiento', desc: 'Incluye un agente crítico que revise si la salida cumple todos los estándares antes de darla por terminada.' }
    ]
  },

  // LEVEL 6: Platform & Data Moats in AI
  {
    id: 'ai-m6-l1',
    nodeType: 'learn',
    competency: 'ai',
    difficulty: 'hard',
    type: 'book_lesson',
    title: 'Efectos de Red y Plataformas de IA',
    concept: 'En el software tradicional, los efectos de red ocurren cuando un producto se vuelve más valioso para los usuarios a medida que más personas lo usan (como WhatsApp o Uber). En la era de la IA, surge el "Efecto de Red de Datos de Doble Bucle": más usuarios generan más interacciones reales, lo que permite calibrar y afinar modelos de menor tamaño y costo que entregan respuestas más personalizadas y rápidas, atrayendo aún más usuarios.',
    keyTakeaway: 'Construye interfaces donde el uso natural del cliente genere datos de retroalimentación de alta calidad (RLHF).',
    quote: {
      text: 'El producto con el ciclo de retroalimentación más corto entre los datos del usuario y la mejora del modelo es el que se queda con todo el mercado.',
      author: 'Andrew Chen',
      context: 'The Cold Start Problem & AI Network Effects'
    },
    sources: [{ type: 'book', title: 'The Cold Start Problem', author: 'Andrew Chen' }],
    recallQuestion: '¿Cómo funciona el Efecto de Red de Datos en las aplicaciones modernas impulsadas por IA?',
    recallOptions: [
      { text: 'Cada interacción del usuario genera datos de preferencia que refinan el modelo, creando una experiencia superior que atrae más usuarios', correct: true },
      { text: 'Aumentando el costo de las suscripciones a medida que crece el número de servidores', correct: false },
      { text: 'Eliminando la necesidad de soporte al cliente de forma permanente', correct: false }
    ],
    recallExplanation: 'El bucle virtuoso de datos (Data Flywheel) hace que el producto mejore continuamente con el uso, levantando una barrera de entrada casi imposible de franquear para nuevos competidores.',
    xpReward: 160
  },
  {
    id: 'ai-m6-apply',
    nodeType: 'apply',
    competency: 'ai',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Diseño del Bucle de Volante de Datos (Data Flywheel)',
    taskBrief: 'Diseña una función o micro-interacción en tu producto donde la acción habitual del usuario califique o mejore automáticamente la precisión de la IA.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Cuál es el mecanismo de feedback (ej. botón de aceptar sugerencia, edición directa, thumbs up/down) que alimentará tu propio dataset de excelencia?',
    minReflectionLength: 75,
    xpReward: 450,
    frameworkSteps: [
      { title: 'Punto de Fricción', desc: 'Identifica dónde el usuario corrige o acepta sugerencias generadas por la IA.' },
      { title: 'Captura Implícita de Preferencia', desc: 'Registra la diferencia entre lo que la IA propuso y lo que el usuario finalmente eligió.' },
      { title: 'Dataset de Entrenamiento', desc: 'Usa esos pares (Prompt + Corrección Humana) para mejorar tus prompts del sistema y fine-tuning.' }
    ]
  }
];

export const aiLevels: CurriculumLevel[] = [
  {
    levelId: 'ai-level-1',
    levelNumber: 1,
    title: 'The Coming Wave',
    subtitle: 'Mustafa Suleyman · La Próxima Ola & Contención',
    applyNodeId: 'ai-m1-apply',
    days: [
      { dayId: 'ai-1-d1', dayNumber: 1, missionIds: ['ai-m1-l1'] }
    ]
  },
  {
    levelId: 'ai-level-2',
    levelNumber: 2,
    title: 'AI Superpowers',
    subtitle: 'Kai-Fu Lee · Implementación & Foso de Datos',
    applyNodeId: 'ai-m2-apply',
    days: [
      { dayId: 'ai-2-d1', dayNumber: 2, missionIds: ['ai-m2-l1'] }
    ]
  },
  {
    levelId: 'ai-level-3',
    levelNumber: 3,
    title: 'Superintelligence',
    subtitle: 'Nick Bostrom & Max Tegmark · Alineación & AGI',
    applyNodeId: 'ai-m3-apply',
    days: [
      { dayId: 'ai-3-d1', dayNumber: 3, missionIds: ['ai-m3-l1'] }
    ]
  },
  {
    levelId: 'ai-level-4',
    levelNumber: 4,
    title: 'LLM Cognitive OS',
    subtitle: 'Andrej Karpathy · Context Window & Arquitectura LLM',
    applyNodeId: 'ai-m4-apply',
    days: [
      { dayId: 'ai-4-d1', dayNumber: 4, missionIds: ['ai-m4-l1'] }
    ]
  },
  {
    levelId: 'ai-level-5',
    levelNumber: 5,
    title: 'Agentes Autónomos (ReAct)',
    subtitle: 'Harrison Chase · Razonamiento, Herramientas & Flujos Multi-Agente',
    applyNodeId: 'ai-m5-apply',
    days: [
      { dayId: 'ai-5-d1', dayNumber: 5, missionIds: ['ai-m5-l1'] }
    ]
  },
  {
    levelId: 'ai-level-6',
    levelNumber: 6,
    title: 'Plataformas & Redes de Datos',
    subtitle: 'Andrew Chen · Efectos de Red de Datos & Bucles RLHF',
    applyNodeId: 'ai-m6-apply',
    days: [
      { dayId: 'ai-6-d1', dayNumber: 6, missionIds: ['ai-m6-l1'] }
    ]
  }
];
