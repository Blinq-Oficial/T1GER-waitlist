import type { BankMission, CurriculumLevel } from '../missionBank';

export const businessMissions: BankMission[] = [
  // LEVEL 1: $100M Offers - Alex Hormozi
  {
    id: 'bus-m1-l1',
    nodeType: 'learn',
    competency: 'offer',
    difficulty: 'easy',
    type: 'book_lesson',
    title: 'La Ecuación del Valor',
    concept: 'Un Grand Slam Offer es una propuesta tan atractiva que los clientes se sienten estúpidos al decir que no. El valor no está en el producto, sino en la ecuación: maximizar el Resultado Soñado y la Certeza de Logro, mientras divides y minimizas a cero el Retraso de Tiempo y el Esfuerzo/Sacrificio requerido.',
    keyTakeaway: 'Valor = (Resultado Soñado × Certeza) / (Tiempo de Espera × Esfuerzo del Cliente).',
    quote: {
      text: 'Haz ofertas tan irresistibles que la gente se sienta estúpida diciendo que no.',
      author: 'Alex Hormozi',
      context: '$100M Offers'
    },
    sources: [{ type: 'book', title: '$100M Offers', author: 'Alex Hormozi' }],
    recallQuestion: 'Según la Ecuación del Valor de Hormozi, ¿qué factor debes MINIMIZAR para aumentar drásticamente el valor de tu oferta?',
    recallOptions: [
      { text: 'El tiempo de espera y el esfuerzo/sacrificio del cliente', correct: true },
      { text: 'El precio y los costos de adquisición', correct: false },
      { text: 'La certeza de que el cliente alcanzará su meta', correct: false }
    ],
    recallExplanation: 'Cuanto más rápido y con menos esfuerzo entregues el resultado deseado al cliente, mayor será el valor percibido y el precio premium que puedes cobrar.',
    xpReward: 100
  },
  {
    id: 'bus-m1-apply',
    nodeType: 'apply',
    competency: 'offer',
    difficulty: 'medium',
    type: 'real_world_task',
    title: 'Ingeniería de Grand Slam Offer',
    taskBrief: 'Audita tu oferta principal y formula 3 modificaciones concretas para reducir el esfuerzo del cliente a la mitad.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Qué paso doloroso o tardado eliminaste para tu cliente y cómo cambia esto tu garantía o promesa?',
    minReflectionLength: 60,
    xpReward: 350,
    frameworkSteps: [
      { title: 'Identificar Fricción', desc: 'Anota los 3 pasos donde los clientes suelen atascarse o abandonar.' },
      { title: 'Crear Atajo (Done-For-You / Plantilla)', desc: 'Reemplaza el trabajo manual del cliente con automatización, plantillas o soporte directo.' },
      { title: 'Redactar Garantía Incondicional', desc: 'Elimina todo el riesgo financiero o de tiempo con una promesa clara.' }
    ]
  },

  // LEVEL 2: Zero to One - Peter Thiel
  {
    id: 'bus-m2-l1',
    nodeType: 'learn',
    competency: 'mindset',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'De 0 a 1: Construir Monopolios',
    concept: 'La competencia perfecta destruye los márgenes y agota a las empresas. El progreso horizontal (1 a N) solo copia lo que ya existe (globalización). El progreso vertical (0 a 1) crea tecnología nueva. Para crear valor duradero, debes dominar un nicho diminuto y construir un monopolio creativo antes de expandirte.',
    keyTakeaway: 'Empieza en un mercado tan pequeño que puedas capturar el 80% de inmediato, luego escala.',
    quote: {
      text: 'La competencia es para los perdedores. Si quieres crear valor duradero, busca construir un monopolio creativo.',
      author: 'Peter Thiel',
      context: 'Zero to One'
    },
    sources: [{ type: 'book', title: 'Zero to One', author: 'Peter Thiel' }],
    recallQuestion: '¿Por qué Peter Thiel afirma que las mejores startups empiezan dominando mercados diminutos?',
    recallOptions: [
      { text: 'Porque es más fácil dominar y monopolizar un nicho pequeño antes de expandirse a mercados gigantes', correct: true },
      { text: 'Porque los mercados pequeños no tienen clientes exigentes', correct: false },
      { text: 'Porque requieren más capital de riesgo para competir con gigantes', correct: false }
    ],
    recallExplanation: 'Es mucho más fácil capturar el 80% de un nicho pequeño específico que capturar el 1% de un mercado gigante altamente competitivo.',
    xpReward: 120
  },
  {
    id: 'bus-m2-apply',
    nodeType: 'apply',
    competency: 'mindset',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'El Nicho Monopólico',
    taskBrief: 'Define tu sub-segmento de mercado ultra-específico donde no existan competidores directos con tu misma propuesta de valor.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Cuál es tu verdad contra-intuitiva? ¿Qué creencia importante de tu industria consideras que casi todos están equivocados?',
    minReflectionLength: 70,
    xpReward: 350,
    frameworkSteps: [
      { title: 'Subdividir el Mercado', desc: 'Reduce el perfil de cliente hasta encontrar un grupo desatendido con alta urgencia.' },
      { title: 'Ventaja 10x', desc: 'Asegúrate de que tu producto sea 10 veces mejor en al menos una dimensión clave.' },
      { title: 'Validar Foso Competitivo', desc: 'Identifica si tu ventaja proviene de tecnología propia, efectos de red o economías de escala.' }
    ]
  },

  // LEVEL 3: The Lean Startup - Eric Ries
  {
    id: 'bus-m3-l1',
    nodeType: 'learn',
    competency: 'operations',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'Ciclo Construir-Medir-Aprender',
    concept: 'Una startup es una institución humana diseñada para crear un nuevo producto o servicio bajo condiciones de extrema incertidumbre. El único objetivo en la fase inicial es el "Aprendizaje Validado". Un Producto Mínimo Viable (MVP) no es una versión barata de tu producto; es el experimento más rápido para comenzar a aprender.',
    keyTakeaway: 'Minimiza el tiempo total para completar el ciclo: Construir → Medir → Aprender.',
    quote: {
      text: 'El único camino para ganar en una startup es aprender más rápido que la competencia.',
      author: 'Eric Ries',
      context: 'The Lean Startup'
    },
    sources: [{ type: 'book', title: 'The Lean Startup', author: 'Eric Ries' }],
    recallQuestion: '¿Cuál es el verdadero propósito de un Producto Mínimo Viable (MVP)?',
    recallOptions: [
      { text: 'Maximizar el aprendizaje validado sobre los clientes con el menor esfuerzo posible', correct: true },
      { text: 'Generar ingresos inmediatos para financiar el desarrollo', correct: false },
      { text: 'Lanzar un producto completo pero con descuento', correct: false }
    ],
    recallExplanation: 'El MVP es un experimento para probar hipótesis críticas de valor y crecimiento, no un producto final terminado.',
    xpReward: 110
  },
  {
    id: 'bus-m3-apply',
    nodeType: 'apply',
    competency: 'operations',
    difficulty: 'medium',
    type: 'real_world_task',
    title: 'Diseño de Experimento MVP',
    taskBrief: 'Diseña un experimento de validación sin escribir código o sin comprar inventario (ej. prueba de humo, pre-venta o concierge MVP).',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: '¿Qué hipótesis específica vas a medir y qué métrica accionable determinará si avanzas o pivoteas?',
    minReflectionLength: 60,
    xpReward: 350,
    frameworkSteps: [
      { title: 'Hipótesis de Valor', desc: 'Formula la creencia fundamental que debe ser cierta para que tu negocio funcione.' },
      { title: 'Diseñar la Prueba', desc: 'Crea una landing page simple, mensaje directo o demo manual.' },
      { title: 'Definir Criterio de Éxito', desc: 'Establece un umbral numérico (ej. 10 reservas o 20% de conversión).' }
    ]
  },

  // LEVEL 4: Good to Great - Jim Collins
  {
    id: 'bus-m4-l1',
    nodeType: 'learn',
    competency: 'operations',
    difficulty: 'hard',
    type: 'book_lesson',
    title: 'El Efecto Volante y El Erizo',
    concept: 'Las grandes empresas no surgen por un golpe de suerte o un lanzamiento milagroso, sino por el "Efecto Volante" (Flywheel): empujar una rueda gigante y pesada vuelta tras vuelta hasta que el impulso acumulado se vuelve imparable. Esto se guía por el Concepto del Erizo: la intersección entre lo que te apasiona profundamente, en qué puedes ser el mejor del mundo, y qué impulsa tu motor económico.',
    keyTakeaway: 'La excelencia es el resultado acumulativo de empujar en una sola dirección consistente.',
    quote: {
      text: 'Lo bueno es enemigo de lo grandioso. La mayoría de las empresas no alcanzan la grandeza simplemente porque ya son bastante buenas.',
      author: 'Jim Collins',
      context: 'Good to Great'
    },
    sources: [{ type: 'book', title: 'Good to Great', author: 'Jim Collins' }],
    recallQuestion: '¿Qué tres círculos componen el Concepto del Erizo de Jim Collins?',
    recallOptions: [
      { text: 'Pasión profunda, en qué puedes ser el mejor del mundo, y qué impulsa tu motor económico', correct: true },
      { text: 'Precio bajo, marketing masivo y tecnología avanzada', correct: false },
      { text: 'Inversión de capital, contrataciones rápidas y expansión global', correct: false }
    ],
    recallExplanation: 'Las empresas extraordinarias operan exclusivamente en el centro de esos tres círculos: pasión, maestría competitiva y rentabilidad por unidad económica.',
    xpReward: 130
  },
  {
    id: 'bus-m4-apply',
    nodeType: 'apply',
    competency: 'operations',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Mapeo del Volante (Flywheel)',
    taskBrief: 'Dibuja la secuencia de 4 a 5 pasos donde el éxito de un paso acelera automáticamente al siguiente en tu negocio.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: 'Explica cómo cada vuelta de tu volante hace que la siguiente vuelta sea más fácil y rápida (efecto compuesto de negocio).',
    minReflectionLength: 75,
    xpReward: 400,
    frameworkSteps: [
      { title: 'Paso Inicial', desc: 'Identifica la acción central que genera satisfacción inmediata en el cliente.' },
      { title: 'Efecto Secundario', desc: 'Mapea cómo la satisfacción genera retención, recomendaciones o mejores datos.' },
      { title: 'Re-inversión', desc: 'Conecta cómo esos recursos mejoran el producto inicial cerrando el bucle.' }
    ]
  },

  // LEVEL 5: The E-Myth Revisited - Michael E. Gerber
  {
    id: 'bus-m5-l1',
    nodeType: 'learn',
    competency: 'operations',
    difficulty: 'medium',
    type: 'book_lesson',
    title: 'Trabajar EN el Negocio vs PARA el Negocio',
    concept: 'El mito del emprendedor (E-Myth) es creer que quien sabe hacer el trabajo técnico entiende cómo dirigir un negocio técnico. Si tu negocio depende de tu presencia física para funcionar, no tienes un negocio; tienes un auto-empleo agotador. Debes diseñar tu empresa como si fuera el prototipo de una franquicia: sistemas repetibles que cualquier persona competente pueda operar con manuales claros.',
    keyTakeaway: 'Construye sistemas que hagan que la gente común produzca resultados extraordinarios.',
    quote: {
      text: 'Tu negocio debe poder funcionar perfectamente sin ti; de lo contrario, no eres dueño de un negocio, eres prisionero de tu propio trabajo.',
      author: 'Michael E. Gerber',
      context: 'The E-Myth Revisited'
    },
    sources: [{ type: 'book', title: 'The E-Myth Revisited', author: 'Michael E. Gerber' }],
    recallQuestion: '¿Cuál es la diferencia fundamental entre trabajar "PARA" el negocio y trabajar "EN" el negocio?',
    recallOptions: [
      { text: 'Trabajar PARA el negocio es diseñar sistemas y procesos para que opere sin depender de ti; trabajar EN el negocio es hacer las tareas operativas diarias', correct: true },
      { text: 'Trabajar PARA el negocio es contratar freelancers externos', correct: false },
      { text: 'No hay diferencia; todo dueño debe ejecutar todas las tareas técnicas', correct: false }
    ],
    recallExplanation: 'Sistematizar tu empresa te permite delegar y escalar, transformando un auto-empleo dependiente en un activo real y escalable.',
    xpReward: 120
  },
  {
    id: 'bus-m5-apply',
    nodeType: 'apply',
    competency: 'operations',
    difficulty: 'medium',
    type: 'real_world_task',
    title: 'Creación de Tu Primer SOP (Procedimiento Operativo)',
    taskBrief: 'Elige la tarea repetitiva más consumidora de tu semana y redáctale un Manual Operativo paso a paso con capturas o checklist.',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: 'Pega el SOP que creaste y describe a quién podrías entrenar o delegar esta función.',
    minReflectionLength: 60,
    xpReward: 350,
    frameworkSteps: [
      { title: 'Desglosar la Tarea', desc: 'Anota cada clic, software y decisión requerida para completar la tarea.' },
      { title: 'Checklist a Prueba de Fallos', desc: 'Incluye criterios de calidad y cómo verificar que quedó bien hecha.' },
      { title: 'Prueba de Delegación', desc: 'Pídele a alguien que intente ejecutarla siguiendo únicamente tu documento.' }
    ]
  },

  // LEVEL 6: Blue Ocean Strategy - W. Chan Kim & Renée Mauborgne
  {
    id: 'bus-m6-l1',
    nodeType: 'learn',
    competency: 'marketing',
    difficulty: 'hard',
    type: 'book_lesson',
    title: 'Estrategia del Océano Azul',
    concept: 'Los océanos rojos representan todas las industrias existentes hoy en día (el espacio de mercado conocido donde la competencia tiñe el agua de sangre). Los océanos azules denotan espacios de mercado no disputados, creación de nueva demanda y oportunidades de crecimiento altamente rentable. Mediante la Matriz ERRC (Eliminar, Reducir, Realzar, Crear), rompes la disyuntiva tradicional entre bajo costo y alta diferenciación.',
    keyTakeaway: 'No compitas con los líderes; haz que la competencia sea irrelevante creando un nuevo espacio.',
    quote: {
      text: 'La única forma de vencer a la competencia es dejar de intentar vencer a la competencia.',
      author: 'W. Chan Kim & Renée Mauborgne',
      context: 'Blue Ocean Strategy'
    },
    sources: [{ type: 'book', title: 'Blue Ocean Strategy', author: 'W. Chan Kim & Renée Mauborgne' }],
    recallQuestion: '¿Qué busca lograr la Matriz ERRC (Eliminar, Reducir, Realzar, Crear) en la Estrategia del Océano Azul?',
    recallOptions: [
      { text: 'Romper la disyuntiva entre costo y diferenciación para desbloquear un nuevo valor para los clientes', correct: true },
      { text: 'Aumentar todos los gastos de marketing para superar a los rivales', correct: false },
      { text: 'Copiar todas las características de los competidores más grandes', correct: false }
    ],
    recallExplanation: 'Al eliminar y reducir factores costosos pero irrelevantes, y al mismo tiempo realzar y crear factores novedosos, creas un salto cuántico en valor con menor costo.',
    xpReward: 140
  },
  {
    id: 'bus-m6-apply',
    nodeType: 'apply',
    competency: 'marketing',
    difficulty: 'hard',
    type: 'real_world_task',
    title: 'Matriz ERRC de Océano Azul',
    taskBrief: 'Aplica el cuadro de las 4 acciones a tu industria: ¿Qué vas a Eliminar, Reducir, Realzar y Crear?',
    verificationMethod: 'honor_system',
    verificationTier: 2,
    reflectionPrompt: 'Escribe tu propuesta ERRC de 4 puntos y explica por qué tu solución no compite directamente con nadie en tu mercado local o nicho.',
    minReflectionLength: 80,
    xpReward: 400,
    frameworkSteps: [
      { title: 'Eliminar', desc: '¿Qué factores que tu industria da por sentados deben ser eliminados por completo?' },
      { title: 'Reducir', desc: '¿Qué factores deben reducirse muy por debajo del estándar de la industria?' },
      { title: 'Realzar', desc: '¿Qué factores deben elevarse muy por encima del estándar?' },
      { title: 'Crear', desc: '¿Qué factores nunca antes ofrecidos por la industria debes inventar?' }
    ]
  }
];

export const businessLevels: CurriculumLevel[] = [
  {
    levelId: 'bus-level-1',
    levelNumber: 1,
    title: '$100M Offers',
    subtitle: 'Alex Hormozi · La Ecuación del Valor & Grand Slam Offers',
    applyNodeId: 'bus-m1-apply',
    days: [
      { dayId: 'bus-1-d1', dayNumber: 1, missionIds: ['bus-m1-l1'] }
    ]
  },
  {
    levelId: 'bus-level-2',
    levelNumber: 2,
    title: 'Zero to One',
    subtitle: 'Peter Thiel · Monopolios Creativos & Ventaja 10x',
    applyNodeId: 'bus-m2-apply',
    days: [
      { dayId: 'bus-2-d1', dayNumber: 2, missionIds: ['bus-m2-l1'] }
    ]
  },
  {
    levelId: 'bus-level-3',
    levelNumber: 3,
    title: 'The Lean Startup',
    subtitle: 'Eric Ries · MVP y Ciclo Construir-Medir-Aprender',
    applyNodeId: 'bus-m3-apply',
    days: [
      { dayId: 'bus-3-d1', dayNumber: 3, missionIds: ['bus-m3-l1'] }
    ]
  },
  {
    levelId: 'bus-level-4',
    levelNumber: 4,
    title: 'Good to Great',
    subtitle: 'Jim Collins · El Efecto Volante (Flywheel) & El Erizo',
    applyNodeId: 'bus-m4-apply',
    days: [
      { dayId: 'bus-4-d1', dayNumber: 4, missionIds: ['bus-m4-l1'] }
    ]
  },
  {
    levelId: 'bus-level-5',
    levelNumber: 5,
    title: 'The E-Myth Revisited',
    subtitle: 'Michael E. Gerber · Sistemas y Prototipos de Franquicia',
    applyNodeId: 'bus-m5-apply',
    days: [
      { dayId: 'bus-5-d1', dayNumber: 5, missionIds: ['bus-m5-l1'] }
    ]
  },
  {
    levelId: 'bus-level-6',
    levelNumber: 6,
    title: 'Blue Ocean Strategy',
    subtitle: 'W. Chan Kim & Renée Mauborgne · La Matriz ERRC',
    applyNodeId: 'bus-m6-apply',
    days: [
      { dayId: 'bus-6-d1', dayNumber: 6, missionIds: ['bus-m6-l1'] }
    ]
  }
];
