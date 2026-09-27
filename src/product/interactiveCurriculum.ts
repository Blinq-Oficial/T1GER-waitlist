import type { BankMission } from './missionBank';
import type {
  ActionPhase,
  AtomicLesson,
  ChallengePhase,
  ImpactPhase,
  InteractiveTrack,
  InteractiveTrackId,
  LocalizedText,
  RewardPhase,
} from './interactiveCurriculumTypes';
import { getOrbLearningDesign } from './orbLearningDesign';

const l = (es: string, en: string): LocalizedText => ({ es, en });

type LessonSeed = Omit<AtomicLesson, 'estimatedSeconds' | 'sources' | 'ingestion' | 'phases' | 'learningDesign'> & {
  source: AtomicLesson['sources'][number];
  impact: Omit<ImpactPhase, 'type' | 'durationSeconds'>;
  challenge: Omit<ChallengePhase, 'type' | 'durationSeconds'>;
  action: Omit<ActionPhase, 'type' | 'durationSeconds'>;
  reward: Omit<RewardPhase, 'type' | 'durationSeconds'>;
};

const makeLesson = (seed: LessonSeed): AtomicLesson => ({
  id: seed.id,
  trackId: seed.trackId,
  order: seed.order,
  slug: seed.slug,
  competency: seed.competency,
  difficulty: seed.difficulty,
  title: seed.title,
  objective: seed.objective,
  keyConcept: seed.keyConcept,
  learningDesign: getOrbLearningDesign(seed.id),
  estimatedSeconds: 180,
  prerequisiteIds: seed.prerequisiteIds,
  sources: [seed.source],
  ingestion: {
    schemaVersion: '1.0.0',
    generatedBy: 'ai_assisted',
    factualReview: 'approved',
    pedagogicalReview: 'approved',
    sourceIds: [seed.source.id],
  },
  phases: [
    { type: 'impact', durationSeconds: 45, ...seed.impact },
    { type: 'challenge', durationSeconds: 60, ...seed.challenge },
    { type: 'action', durationSeconds: 60, ...seed.action },
    { type: 'reward', durationSeconds: 15, ...seed.reward },
  ],
});

const sources = {
  bogle: { id: 'src-bogle-common-sense', kind: 'book', title: 'The Little Book of Common Sense Investing', author: 'John C. Bogle', rights: 'fair_use_summary' },
  housel: { id: 'src-housel-psychology', kind: 'book', title: 'The Psychology of Money', author: 'Morgan Housel', rights: 'fair_use_summary' },
  sec: { id: 'src-sec-investor', kind: 'article', title: 'Investor.gov education resources', author: 'U.S. Securities and Exchange Commission', url: 'https://www.investor.gov/', rights: 'public_domain' },
  openai: { id: 'src-openai-prompting', kind: 'article', title: 'Prompt engineering guidance', author: 'OpenAI', url: 'https://platform.openai.com/docs/guides/prompt-engineering', rights: 'fair_use_summary' },
  anthropic: { id: 'src-anthropic-agents', kind: 'article', title: 'Building effective agents', author: 'Anthropic', url: 'https://www.anthropic.com/research/building-effective-agents', rights: 'fair_use_summary' },
  lean: { id: 'src-lean-startup', kind: 'book', title: 'The Lean Startup', author: 'Eric Ries', rights: 'fair_use_summary' },
  momtest: { id: 'src-mom-test', kind: 'book', title: 'The Mom Test', author: 'Rob Fitzpatrick', rights: 'fair_use_summary' },
  hormozi: { id: 'src-hormozi-offers', kind: 'book', title: '$100M Offers', author: 'Alex Hormozi', rights: 'fair_use_summary' },
  voss: { id: 'src-voss-never-split', kind: 'book', title: 'Never Split the Difference', author: 'Chris Voss', rights: 'fair_use_summary' },
  yc: { id: 'src-yc-startup-school', kind: 'article', title: 'Y Combinator Startup School', author: 'Y Combinator', url: 'https://www.startupschool.org/', rights: 'fair_use_summary' },
  karpathy: { id: 'src-karpathy-state-of-gpt', kind: 'transcript', title: 'State of GPT', author: 'Andrej Karpathy', rights: 'fair_use_summary' },
  munger: { id: 'src-munger-almanack', kind: 'book', title: 'Poor Charlie’s Almanack', author: 'Charlie Munger', rights: 'fair_use_summary' },
  suntzu: { id: 'src-suntzu-art-of-war', kind: 'book', title: 'The Art of War', author: 'Sun Tzu', rights: 'fair_use_summary' },
  marcus: { id: 'src-marcus-meditations', kind: 'book', title: 'Meditations', author: 'Marcus Aurelius', rights: 'fair_use_summary' },
  kahneman: { id: 'src-kahneman-fast-slow', kind: 'book', title: 'Thinking, Fast and Slow', author: 'Daniel Kahneman', rights: 'fair_use_summary' },
  nickerson: { id: 'src-nickerson-confirmation', kind: 'article', title: 'Confirmation Bias: A Ubiquitous Phenomenon in Many Guises', author: 'Raymond S. Nickerson', url: 'https://doi.org/10.1037/1089-2680.2.2.175', rights: 'fair_use_summary' },
  availability: { id: 'src-tversky-kahneman-availability', kind: 'article', title: 'Availability: A heuristic for judging frequency and probability', author: 'Amos Tversky & Daniel Kahneman', url: 'https://doi.org/10.1016/0010-0285(73)90033-9', rights: 'fair_use_summary' },
  sunkCost: { id: 'src-arkes-blumer-sunk-cost', kind: 'article', title: 'The psychology of sunk cost', author: 'Hal R. Arkes & Catherine Blumer', url: 'https://doi.org/10.1016/0749-5978(85)90049-4', rights: 'fair_use_summary' },
  retrieval: { id: 'src-roediger-karpicke-retrieval', kind: 'article', title: 'Test-enhanced learning: Taking memory tests improves long-term retention', author: 'Henry L. Roediger III & Jeffrey D. Karpicke', url: 'https://pubmed.ncbi.nlm.nih.gov/16507066/', rights: 'fair_use_summary' },
  newport: { id: 'src-newport-deep-work', kind: 'book', title: 'Deep Work', author: 'Cal Newport', rights: 'fair_use_summary' },
  clear: { id: 'src-clear-atomic-habits', kind: 'book', title: 'Atomic Habits', author: 'James Clear', rights: 'fair_use_summary' },
  silver: { id: 'src-silver-signal-noise', kind: 'book', title: 'The Signal and the Noise', author: 'Nate Silver', rights: 'fair_use_summary' },
  googleDS: { id: 'src-google-decision-intelligence', kind: 'article', title: 'Introduction to Decision Intelligence & Data Science', author: 'Cassie Kozyrkov (Google)', url: 'https://kozyrkov.medium.com/', rights: 'fair_use_summary' },
  t1ger: { id: 'src-t1ger-playbook', kind: 'internal', title: 'T1GER Tactical Learning Playbook', author: 'T1GER', rights: 'owned' },
} as const;

const smartMoneyLessons: AtomicLesson[] = [
  makeLesson({
    id: 'learn-money-01', trackId: 'smart-money', order: 1, slug: 'cash-has-a-cost', competency: 'investing', difficulty: 'easy', prerequisiteIds: [], source: sources.housel,
    title: l('El efectivo también pierde', 'Cash loses too'),
    objective: l('Cuantificar el precio de dejar capital inmóvil.', 'Quantify the price of leaving capital idle.'),
    keyConcept: l('La seguridad aparente del efectivo tiene un coste: inflación y crecimiento compuesto no capturado.', 'The apparent safety of cash has a cost: inflation and missed compounding.'),
    impact: {
      eyebrow: l('SMART MONEY 01', 'SMART MONEY 01'), title: l('No invertir también es una decisión', 'Not investing is still a decision'),
      body: l('Cada dólar inmóvil compra menos con el tiempo. Antes de buscar la inversión perfecta, separa tu fondo de emergencia del dinero que puede trabajar.', 'Every idle dollar buys less over time. Before chasing the perfect investment, separate emergency cash from money that can work.'),
      tacticalRule: l('Protege tu colchón; asigna el excedente con una regla automática.', 'Protect your buffer; deploy the surplus with an automatic rule.'),
      metric: { value: '2', label: l('funciones distintas: liquidez y objetivos a largo plazo', 'different roles: liquidity and long-term goals') },
    },
    challenge: { title: l('Decisión de liquidez', 'Liquidity decision'), challenge: {
      kind: 'multiple_choice', prompt: l('Tienes $3,000 y tus gastos esenciales son $1,000 al mes. ¿Qué decisión tiene mejor control de riesgo?', 'You have $3,000 and essential expenses of $1,000 per month. Which decision controls risk best?'),
      options: [
        { id: 'a', label: l('Invertir los $3,000 hoy', 'Invest all $3,000 today') },
        { id: 'b', label: l('Evaluar primero el colchón necesario y los gastos próximos, antes de decidir cuánto invertir', 'Assess the needed buffer and upcoming expenses before deciding how much to invest'), correct: true },
        { id: 'c', label: l('Dejar todo inmóvil sin una fecha de revisión', 'Leave everything idle without a review date') },
      ],
      feedback: { correct: l('Control primero, crecimiento después.', 'Control first, growth second.'), incorrect: l('Una estrategia sin liquidez o sin fecha no es una estrategia.', 'A plan without liquidity or a review date is not a plan.'), explanation: l('El colchón evita vender bajo presión; el excedente empieza a capturar crecimiento.', 'The buffer prevents forced selling; the surplus starts capturing growth.') },
    } },
    action: { title: l('Calcula el coste de esperar', 'Calculate the cost of waiting'), widget: {
      engine: 'cash_cost', title: l('Radar de capital inmóvil', 'Idle capital radar'), instruction: l('Ajusta tu excedente y el tiempo que suele quedarse quieto.', 'Set your surplus and how long it usually stays idle.'),
      fields: [
        { id: 'cash', kind: 'range', label: l('Capital disponible', 'Available capital'), min: 100, max: 10000, step: 100, defaultValue: 1500, unit: l('USD', 'USD') },
        { id: 'years', kind: 'range', label: l('Años inmóvil', 'Years idle'), min: 1, max: 10, step: 1, defaultValue: 5, unit: l('años', 'years') },
      ], resultLabel: l('Crecimiento potencial no capturado', 'Potential growth not captured'), artifactTitle: l('Mi regla de capital disponible', 'My available-capital rule'), commitLabel: l('Guardar mi regla', 'Save my rule'),
    } },
    reward: { title: l('Regla creada', 'Rule created'), body: l('Tu primer artefacto financiero ya existe. T1GER recuperó energía.', 'Your first financial artifact now exists. T1GER recovered energy.'), xp: 120, petRecovery: 18 },
  }),
  makeLesson({
    id: 'learn-money-02', trackId: 'smart-money', order: 2, slug: 'compound-engine', competency: 'investing', difficulty: 'easy', prerequisiteIds: ['learn-money-01'], source: sources.housel,
    title: l('El tiempo es el multiplicador', 'Time is the multiplier'),
    objective: l('Convertir una cantidad mensual en una proyección de diez años.', 'Turn a monthly amount into a ten-year projection.'),
    keyConcept: l('La tasa ayuda; el tiempo y la constancia hacen la mayor parte del trabajo.', 'Rate helps; time and consistency do most of the work.'),
    impact: { eyebrow: l('SMART MONEY 02', 'SMART MONEY 02'), title: l('La riqueza crece en la parte aburrida', 'Wealth grows in the boring part'), body: l('Los resultados parecen lentos al principio porque los rendimientos aún trabajan sobre una base pequeña. Interrumpir el proceso reinicia la parte más poderosa.', 'Results look slow at first because returns still work on a small base. Interrupting the process resets its most powerful part.'), tacticalRule: l('Aporta primero; ajusta después. La automatización vence a la motivación.', 'Contribute first; adjust later. Automation beats motivation.'), metric: { value: '120', label: l('aportes mensuales en diez años', 'monthly deposits in ten years') } },
    challenge: { title: l('Elige la palanca', 'Choose the lever'), challenge: { kind: 'multiple_choice', prompt: l('Si solo puedes cambiar una cosa hoy, ¿qué decisión fortalece más el plan?', 'If you can change only one thing today, which decision strengthens the plan most?'), options: [
      { id: 'start', label: l('Empezar antes con un aporte sostenible y constante', 'Start earlier with a sustainable, consistent contribution'), correct: true },
      { id: 'rate', label: l('Esperar una inversión con una tasa perfecta', 'Wait for an investment with a perfect return') },
      { id: 'heroic', label: l('Hacer un aporte enorme y pausar cuando sea incómodo', 'Make one huge contribution and pause when it gets uncomfortable') },
    ], feedback: { correct: l('Protegiste la variable irrecuperable: el tiempo.', 'You protected the variable you cannot recover: time.'), incorrect: l('Una tasa o un aporte heroico no compensa un sistema que nunca empieza o no sobrevive.', 'A perfect rate or heroic deposit cannot fix a system that never starts or cannot survive.'), explanation: l('Empezar antes y mantener un aporte sostenible da al interés compuesto más tiempo para trabajar.', 'Starting earlier and keeping a sustainable contribution gives compounding more time to work.') } } },
    action: { title: l('Proyecta tu máquina', 'Project your engine'), widget: { engine: 'compound_growth', title: l('Simulador de aportes', 'Contribution simulator'), instruction: l('Elige un aporte sostenible y un horizonte real.', 'Choose a sustainable contribution and a real horizon.'), fields: [
      { id: 'monthly', kind: 'range', label: l('Aporte mensual', 'Monthly contribution'), min: 25, max: 1500, step: 25, defaultValue: 250, unit: l('USD', 'USD') },
      { id: 'years', kind: 'range', label: l('Horizonte', 'Horizon'), min: 5, max: 30, step: 5, defaultValue: 10, unit: l('años', 'years') },
      { id: 'rate', kind: 'range', label: l('Retorno anual supuesto', 'Assumed annual return'), min: 3, max: 10, step: 1, defaultValue: 8, unit: l('%', '%') },
      { id: 'reviewCadence', kind: 'select', label: l('Revisaré mi regla', 'I will review my rule'), defaultValue: 'yearly', options: [
        { value: 'quarterly', label: l('Cada 3 meses', 'Every 3 months') },
        { value: 'yearly', label: l('Una vez al año', 'Once a year') },
      ] },
    ], resultLabel: l('Valor futuro estimado', 'Estimated future value'), artifactTitle: l('Mi plan compuesto', 'My compounding plan'), commitLabel: l('Fijar aporte', 'Lock contribution') } },
    reward: { title: l('Motor activado', 'Engine activated'), body: l('Ya tienes una cifra que puedes ejecutar este mes.', 'You now have a number you can execute this month.'), xp: 130, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-money-03', trackId: 'smart-money', order: 3, slug: 'index-before-picking', competency: 'investing', difficulty: 'medium', prerequisiteIds: ['learn-money-02'], source: sources.bogle,
    title: l('Compra el mercado, no el ruido', 'Buy the market, not the noise'),
    objective: l('Comparar fondos indexados por diversificación y coste.', 'Compare index funds by diversification and cost.'),
    keyConcept: l('Un ETF indexado de bajo coste reduce el riesgo de depender de una sola empresa y limita la fuga por comisiones.', 'A low-cost index ETF reduces single-company dependence and limits fee leakage.'),
    impact: { eyebrow: l('SMART MONEY 03', 'SMART MONEY 03'), title: l('La comisión pequeña cobra durante décadas', 'The small fee charges for decades'), body: l('Dos fondos pueden seguir mercados parecidos y producir resultados distintos porque una comisión se descuenta cada año, incluso cuando tú no haces nada.', 'Two funds can track similar markets and still produce different results because a fee is deducted every year, even when you do nothing.'), tacticalRule: l('Compara índice, diversificación, ratio de gastos y liquidez antes del nombre de moda.', 'Compare index, diversification, expense ratio, and liquidity before the trendy name.'), metric: { value: '0.03%', label: l('es una comisión anual típica de ETF de bajo coste', 'is a typical annual fee for a low-cost ETF') } },
    challenge: { title: l('Detecta la fuga', 'Detect the leak'), challenge: { kind: 'error_detection', prompt: l('¿Qué dato invalida primero esta elección: “Elegí el fondo porque subió más este mes”?', 'Which fact first invalidates this choice: “I picked the fund because it rose most this month”?'), options: [
      { id: 'a', label: l('Usar rendimiento de un mes como tesis de largo plazo', 'Using one month of performance as a long-term thesis'), correct: true }, { id: 'b', label: l('Revisar el ratio de gastos', 'Checking the expense ratio') }, { id: 'c', label: l('Confirmar qué índice sigue', 'Confirming which index it tracks') },
    ], feedback: { correct: l('Encontraste el sesgo de recencia.', 'You found recency bias.'), incorrect: l('Busca el salto lógico, no solo un dato faltante.', 'Find the logical leap, not just a missing fact.'), explanation: l('Un mes no demuestra una ventaja persistente; coste y exposición sí son verificables.', 'One month does not prove a persistent edge; cost and exposure are verifiable.') } } },
    action: { title: l('Mide la fuga por comisiones', 'Measure fee leakage'), widget: { engine: 'etf_fee_drag', title: l('Comparador de coste', 'Cost comparator'), instruction: l('Compara dos ratios de gastos sobre tu plan.', 'Compare two expense ratios against your plan.'), fields: [
      { id: 'balance', kind: 'range', label: l('Capital inicial', 'Starting balance'), min: 500, max: 50000, step: 500, defaultValue: 5000, unit: l('USD', 'USD') }, { id: 'lowFee', kind: 'range', label: l('Fondo A', 'Fund A'), min: 0.03, max: 1, step: 0.01, defaultValue: 0.03, unit: l('% anual', '% yearly') }, { id: 'highFee', kind: 'range', label: l('Fondo B', 'Fund B'), min: 0.03, max: 2, step: 0.01, defaultValue: 0.75, unit: l('% anual', '% yearly') },
    ], resultLabel: l('Diferencia estimada en 20 años', 'Estimated difference after 20 years'), artifactTitle: l('Mi filtro de ETF', 'My ETF filter'), commitLabel: l('Guardar filtro', 'Save filter') } },
    reward: { title: l('Filtro blindado', 'Filter secured'), body: l('Ahora puedes descartar productos caros antes de estudiar el resto.', 'You can now reject expensive products before studying the rest.'), xp: 140, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-money-04', trackId: 'smart-money', order: 4, slug: 'dca-without-drama', competency: 'investing', difficulty: 'medium', prerequisiteIds: ['learn-money-03'], source: sources.sec,
    title: l('DCA sin adivinar el mercado', 'DCA without timing the market'),
    objective: l('Crear una orden recurrente compatible con el flujo de caja.', 'Create a recurring order that fits cash flow.'),
    keyConcept: l('Dollar-cost averaging convierte una decisión repetida en un sistema y reduce la tentación de esperar el momento perfecto.', 'Dollar-cost averaging turns a repeated decision into a system and reduces the temptation to wait for the perfect moment.'),
    impact: { eyebrow: l('SMART MONEY 04', 'SMART MONEY 04'), title: l('La fecha perfecta no llega', 'The perfect date never arrives'), body: l('Esperar claridad total suele significar comprar después de la subida. Un aporte programado elimina una negociación emocional cada mes.', 'Waiting for total clarity often means buying after the rise. A scheduled contribution removes one emotional negotiation each month.'), tacticalRule: l('Programa el aporte el día posterior al ingreso, no el día en que “te sientas seguro”.', 'Schedule the contribution the day after income, not when you “feel safe”.'), metric: { value: '12', label: l('decisiones menos al año con automatización mensual', 'fewer decisions per year with monthly automation') } },
    challenge: { title: l('Empareja conducta y efecto', 'Match behavior and effect'), challenge: { kind: 'matching', prompt: l('Conecta cada conducta con su consecuencia más probable.', 'Connect each behavior with its most likely consequence.'), pairs: [
      { id: 'auto', left: l('Aporte automático', 'Automatic contribution'), right: l('Menos decisiones emocionales', 'Fewer emotional decisions') }, { id: 'wait', left: l('Esperar noticias perfectas', 'Wait for perfect news'), right: l('Riesgo de comprar tarde', 'Risk of buying late') }, { id: 'oversize', left: l('Aporte demasiado grande', 'Oversized contribution'), right: l('Mayor probabilidad de cancelar el plan', 'Higher chance of canceling the plan') },
    ], feedback: { correct: l('Viste el sistema completo.', 'You saw the whole system.'), incorrect: l('Piensa en la conducta que cada regla provoca durante meses.', 'Think about the behavior each rule creates over months.'), explanation: l('El mejor plan es automático y lo bastante pequeño para sobrevivir meses difíciles.', 'The best plan is automatic and small enough to survive hard months.') } } },
    action: { title: l('Programa tu aporte', 'Schedule your contribution'), widget: { engine: 'dca_plan', title: l('Planificador DCA', 'DCA planner'), instruction: l('Define una cifra sostenible y el momento exacto.', 'Define a sustainable amount and exact timing.'), fields: [
      { id: 'monthly', kind: 'range', label: l('Aporte mensual', 'Monthly contribution'), min: 25, max: 1500, step: 25, defaultValue: 200, unit: l('USD', 'USD') }, { id: 'payday', kind: 'select', label: l('Momento del ingreso', 'Income timing'), defaultValue: '1', options: [{ value: '1', label: l('Inicio de mes', 'Start of month') }, { value: '15', label: l('Mitad de mes', 'Middle of month') }, { value: 'weekly', label: l('Cada semana', 'Weekly') }] },
    ], resultLabel: l('Compromiso anual', 'Annual commitment'), artifactTitle: l('Mi orden DCA', 'My DCA order'), commitLabel: l('Crear orden', 'Create order') } },
    reward: { title: l('Decisión automatizada', 'Decision automated'), body: l('Tu plan ya tiene cantidad y momento. Solo falta ejecutarlo en tu broker.', 'Your plan now has an amount and timing. Execute it in your broker.'), xp: 150, petRecovery: 22 },
  }),
  makeLesson({
    id: 'learn-money-05', trackId: 'smart-money', order: 5, slug: 'risk-before-return', competency: 'investing', difficulty: 'hard', prerequisiteIds: ['learn-money-04'], source: sources.sec,
    title: l('Sobrevive antes de ganar', 'Survive before you win'),
    objective: l('Definir un límite de pérdida antes de elegir activos.', 'Define a loss limit before choosing assets.'),
    keyConcept: l('El riesgo útil se decide antes de la operación: tamaño, pérdida tolerable y condición de salida.', 'Useful risk is decided before the trade: size, tolerable loss, and exit condition.'),
    impact: { eyebrow: l('SMART MONEY 05', 'SMART MONEY 05'), title: l('Una caída del 50% exige subir 100%', 'A 50% loss requires a 100% gain'), body: l('Las pérdidas grandes destruyen más que capital: rompen la confianza y fuerzan decisiones tardías. El tamaño de posición es tu primer cinturón de seguridad.', 'Large losses destroy more than capital: they break confidence and force late decisions. Position size is your first seat belt.'), tacticalRule: l('Define cuánto puedes perder antes de pensar cuánto puedes ganar.', 'Define how much you can lose before thinking about how much you can gain.'), metric: { value: '2:1', label: l('ganancia necesaria tras perder la mitad', 'gain required after losing half') } },
    challenge: { title: l('Encuentra el error de riesgo', 'Find the risk error'), challenge: { kind: 'error_detection', prompt: l('Un usuario coloca 40% de su cartera en una idea y decide “salir si se siente mal”. ¿Cuál es la falla principal?', 'A user puts 40% of the portfolio in one idea and plans to “exit if it feels bad”. What is the main flaw?'), options: [
      { id: 'a', label: l('No definió pérdida máxima ni condición observable', 'No maximum loss or observable exit condition'), correct: true }, { id: 'b', label: l('La inversión no tiene un nombre conocido', 'The investment lacks a famous name') }, { id: 'c', label: l('No revisa el precio cada cinco minutos', 'The price is not checked every five minutes') },
    ], feedback: { correct: l('El riesgo debe poder medirse antes.', 'Risk must be measurable beforehand.'), incorrect: l('La reputación y la vigilancia no sustituyen una regla.', 'Reputation and monitoring do not replace a rule.'), explanation: l('Tamaño y condición de salida convierten una opinión en un proceso.', 'Sizing and an exit condition turn an opinion into a process.') } } },
    action: { title: l('Escribe tu límite', 'Write your limit'), widget: { engine: 'risk_budget', title: l('Presupuesto de riesgo', 'Risk budget'), instruction: l('Calcula cuánto capital está realmente en juego.', 'Calculate how much capital is actually at stake.'), fields: [
      { id: 'portfolio', kind: 'range', label: l('Valor de cartera', 'Portfolio value'), min: 500, max: 100000, step: 500, defaultValue: 10000, unit: l('USD', 'USD') }, { id: 'riskPct', kind: 'range', label: l('Riesgo máximo por idea', 'Maximum risk per idea'), min: 0.5, max: 5, step: 0.5, defaultValue: 1, unit: l('%', '%') }, { id: 'stopPct', kind: 'range', label: l('Distancia de salida', 'Exit distance'), min: 2, max: 25, step: 1, defaultValue: 10, unit: l('%', '%') },
    ], resultLabel: l('Tamaño máximo de posición', 'Maximum position size'), artifactTitle: l('Mi protocolo de riesgo', 'My risk protocol'), commitLabel: l('Blindar protocolo', 'Secure protocol') } },
    reward: { title: l('Supervivencia configurada', 'Survival configured'), body: l('Tu límite ya existe antes de la próxima emoción.', 'Your limit now exists before the next emotional moment.'), xp: 170, petRecovery: 25 },
  }),
];

const aiLessons: AtomicLesson[] = [
  makeLesson({
    id: 'learn-ai-01', trackId: 'ai-automation', order: 1, slug: 'prompt-contract', competency: 'ai', difficulty: 'easy', prerequisiteIds: [], source: sources.openai,
    title: l('Un prompt es un contrato', 'A prompt is a contract'), objective: l('Construir instrucciones con objetivo, contexto, restricciones y formato.', 'Build instructions with goal, context, constraints, and format.'), keyConcept: l('La calidad mejora cuando el modelo sabe qué producir, para quién, con qué límites y en qué estructura.', 'Quality improves when the model knows what to produce, for whom, within which limits, and in what structure.'),
    impact: { eyebrow: l('IA Y AUTOMATIZACIÓN 01', 'AI AND AUTOMATION 01'), title: l('“Hazlo mejor” no contiene una decisión', '“Make it better” contains no decision'), body: l('Un modelo no lee tu intención. Completa patrones a partir del contexto que recibe. Una instrucción ambigua delega las decisiones importantes al azar.', 'A model does not read your intent. It completes patterns from the context it receives. An ambiguous instruction delegates important decisions to chance.'), tacticalRule: l('Objetivo + contexto + restricciones + formato de salida.', 'Goal + context + constraints + output format.'), metric: { value: '4', label: l('bloques para una instrucción utilizable', 'blocks for a usable instruction') } },
    challenge: { title: l('Detecta el bloque ausente', 'Detect the missing block'), challenge: { kind: 'multiple_choice', prompt: l('“Escribe tres asuntos de email para fundadores SaaS. Máximo 45 caracteres.” ¿Qué falta para reducir más la ambigüedad?', '“Write three email subject lines for SaaS founders. Maximum 45 characters.” What is missing to reduce ambiguity further?'), options: [
      { id: 'a', label: l('El objetivo o acción deseada del email', 'The desired goal or action of the email'), correct: true }, { id: 'b', label: l('Una palabra más técnica', 'One more technical word') }, { id: 'c', label: l('Pedir creatividad infinita', 'Ask for infinite creativity') },
    ], feedback: { correct: l('Sin resultado deseado, el texto no puede optimizarse.', 'Without a desired outcome, the copy cannot be optimized.'), incorrect: l('Más adjetivos no reemplazan una intención medible.', 'More adjectives do not replace measurable intent.'), explanation: l('El público y el formato existen; falta qué debe provocar el asunto.', 'Audience and format exist; the subject line still lacks a desired effect.') } } },
    action: { title: l('Construye tu prompt', 'Build your prompt'), widget: { engine: 'prompt_builder', title: l('Constructor de contrato', 'Prompt contract builder'), instruction: l('Completa los cuatro bloques con una tarea real de hoy.', 'Complete all four blocks with a real task from today.'), fields: [
      { id: 'goal', kind: 'text', label: l('Objetivo', 'Goal'), placeholder: l('Crear cinco ideas de contenido que generen demos', 'Create five content ideas that generate demos'), minLength: 8 }, { id: 'context', kind: 'text', label: l('Contexto', 'Context'), placeholder: l('Producto, usuario y situación', 'Product, user, and situation'), minLength: 8 }, { id: 'constraints', kind: 'text', label: l('Restricciones', 'Constraints'), placeholder: l('Límite, tono y datos que no debe inventar', 'Limits, tone, and facts it must not invent'), minLength: 8 }, { id: 'format', kind: 'text', label: l('Formato', 'Format'), placeholder: l('Tabla con gancho, idea y CTA', 'Table with hook, idea, and CTA'), minLength: 5 },
    ], resultLabel: l('Prompt listo para copiar', 'Prompt ready to copy'), artifactTitle: l('Mi prompt de cuatro bloques', 'My four-block prompt'), commitLabel: l('Crear prompt', 'Create prompt') } },
    reward: { title: l('Contrato listo', 'Contract ready'), body: l('Ya no dependes de pedir “algo mejor”.', 'You no longer depend on asking for “something better”.'), xp: 120, petRecovery: 18 },
  }),
  makeLesson({
    id: 'learn-ai-02', trackId: 'ai-automation', order: 2, slug: 'context-beats-cleverness', competency: 'ai', difficulty: 'easy', prerequisiteIds: ['learn-ai-01'], source: sources.openai,
    title: l('El contexto vence al truco', 'Context beats cleverness'), objective: l('Distinguir contexto útil de ruido.', 'Separate useful context from noise.'), keyConcept: l('El mejor contexto cambia la decisión del modelo; el resto solo consume atención.', 'The best context changes the model’s decision; the rest only consumes attention.'),
    impact: { eyebrow: l('IA Y AUTOMATIZACIÓN 02', 'AI AND AUTOMATION 02'), title: l('Más texto no siempre significa más precisión', 'More text does not always mean more precision'), body: l('Pegar documentos enteros puede ocultar la señal. Resume los hechos que cambian el resultado, incluye ejemplos y define qué fuente manda cuando hay conflicto.', 'Pasting entire documents can hide the signal. Summarize facts that change the result, include examples, and define which source wins on conflict.'), tacticalRule: l('Incluye contexto que altere una decisión o elimine una suposición.', 'Include context that changes a decision or removes an assumption.'), metric: { value: '3', label: l('capas: usuario, evidencia y criterio', 'layers: user, evidence, and criteria') } },
    challenge: { title: l('Ordena el contexto', 'Order the context'), challenge: { kind: 'ordering', prompt: l('Ordena estas capas antes de pedir una recomendación.', 'Order these layers before asking for a recommendation.'), options: [
      { id: 'user', label: l('Definir usuario y objetivo', 'Define user and goal') }, { id: 'evidence', label: l('Añadir hechos y ejemplos relevantes', 'Add relevant facts and examples') }, { id: 'criteria', label: l('Explicar el criterio de decisión', 'Explain the decision criteria') },
    ], orderedIds: ['user', 'evidence', 'criteria'], feedback: { correct: l('El modelo ya sabe para quién, con qué datos y cómo decidir.', 'The model now knows who, with what evidence, and how to decide.'), incorrect: l('Primero fija el problema; después la evidencia y el criterio.', 'Set the problem first, then evidence and criteria.'), explanation: l('Esa secuencia reduce respuestas correctas para el problema equivocado.', 'That sequence reduces answers that are correct for the wrong problem.') } } },
    action: { title: l('Construye tu paquete de contexto', 'Build your context pack'), widget: { engine: 'context_stack', title: l('Compresor de contexto', 'Context compressor'), instruction: l('Escribe solo datos que cambiarían la respuesta.', 'Write only facts that would change the answer.'), fields: [
      { id: 'user', kind: 'text', label: l('Usuario y objetivo', 'User and goal'), placeholder: l('Fundador sin equipo que necesita 10 entrevistas', 'Solo founder who needs 10 interviews'), minLength: 8 }, { id: 'evidence', kind: 'text', label: l('Evidencia disponible', 'Available evidence'), placeholder: l('Tres objeciones repetidas por clientes', 'Three objections repeated by customers'), minLength: 8 }, { id: 'criteria', kind: 'text', label: l('Criterio de decisión', 'Decision criteria'), placeholder: l('Priorizar impacto en siete días', 'Prioritize impact within seven days'), minLength: 8 },
    ], resultLabel: l('Contexto comprimido', 'Compressed context'), artifactTitle: l('Mi paquete de contexto', 'My context pack'), commitLabel: l('Guardar contexto', 'Save context') } },
    reward: { title: l('Señal aislada', 'Signal isolated'), body: l('Tu contexto ahora dirige la respuesta en vez de ahogarla.', 'Your context now directs the answer instead of drowning it.'), xp: 130, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-ai-03', trackId: 'ai-automation', order: 3, slug: 'route-the-work', competency: 'ai', difficulty: 'medium', prerequisiteIds: ['learn-ai-02'], source: sources.t1ger,
    title: l('Usa el modelo correcto', 'Use the right model'), objective: l('Asignar tareas por riesgo, coste y necesidad de razonamiento.', 'Route tasks by risk, cost, and reasoning needs.'), keyConcept: l('No toda tarea necesita el modelo más potente; algunas necesitan velocidad, estructura o aprobación humana.', 'Not every task needs the strongest model; some need speed, structure, or human approval.'),
    impact: { eyebrow: l('IA Y AUTOMATIZACIÓN 03', 'AI AND AUTOMATION 03'), title: l('Potencia sin ruteo quema presupuesto', 'Power without routing burns budget'), body: l('Clasificar un ticket y diseñar una estrategia no tienen el mismo riesgo. El ruteo correcto reserva razonamiento costoso para decisiones donde cambia el resultado.', 'Classifying a ticket and designing a strategy do not carry the same risk. Good routing reserves expensive reasoning for decisions where it changes the outcome.'), tacticalRule: l('Bajo riesgo: rápido. Alta ambigüedad: razonamiento. Alto impacto: humano aprueba.', 'Low risk: fast. High ambiguity: reasoning. High impact: human approves.'), metric: { value: '3×', label: l('criterios: riesgo, ambigüedad y volumen', 'criteria: risk, ambiguity, and volume') } },
    challenge: { title: l('Empareja tarea y ruta', 'Match task and route'), challenge: { kind: 'matching', prompt: l('Asigna cada trabajo a la ruta más sensata.', 'Assign each job to the most sensible route.'), pairs: [
      { id: 'classify', left: l('Clasificar 2,000 tickets', 'Classify 2,000 tickets'), right: l('Modelo rápido con salida estructurada', 'Fast model with structured output') }, { id: 'strategy', left: l('Diseñar una estrategia de expansión', 'Design an expansion strategy'), right: l('Modelo de razonamiento con contexto profundo', 'Reasoning model with deep context') }, { id: 'payment', left: l('Autorizar un reembolso grande', 'Approve a large refund'), right: l('Modelo propone; humano confirma', 'Model proposes; human confirms') },
    ], feedback: { correct: l('Ruteaste por riesgo, no por moda.', 'You routed by risk, not hype.'), incorrect: l('Separa volumen, ambigüedad e impacto irreversible.', 'Separate volume, ambiguity, and irreversible impact.'), explanation: l('La ruta óptima equilibra coste, latencia y control.', 'The optimal route balances cost, latency, and control.') } } },
    action: { title: l('Rutea un flujo real', 'Route a real workflow'), widget: { engine: 'model_router', title: l('Matriz de ruteo', 'Routing matrix'), instruction: l('Clasifica una tarea que repites esta semana.', 'Classify a task you repeat this week.'), fields: [
      { id: 'task', kind: 'text', label: l('Tarea', 'Task'), placeholder: l('Responder solicitudes de soporte', 'Respond to support requests'), minLength: 6 }, { id: 'risk', kind: 'select', label: l('Impacto si falla', 'Impact if it fails'), defaultValue: 'medium', options: [{ value: 'low', label: l('Bajo', 'Low') }, { value: 'medium', label: l('Medio', 'Medium') }, { value: 'high', label: l('Alto', 'High') }] }, { id: 'ambiguity', kind: 'select', label: l('Ambigüedad', 'Ambiguity'), defaultValue: 'medium', options: [{ value: 'low', label: l('Baja', 'Low') }, { value: 'medium', label: l('Media', 'Medium') }, { value: 'high', label: l('Alta', 'High') }] },
    ], resultLabel: l('Ruta recomendada', 'Recommended route'), artifactTitle: l('Mi matriz de modelos', 'My model routing matrix'), commitLabel: l('Guardar ruta', 'Save route') } },
    reward: { title: l('Ruta definida', 'Route defined'), body: l('Tu próximo flujo ya sabe dónde automatizar y dónde frenar.', 'Your next workflow knows where to automate and where to stop.'), xp: 140, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-ai-04', trackId: 'ai-automation', order: 4, slug: 'trigger-transform-action', competency: 'operations', difficulty: 'medium', prerequisiteIds: ['learn-ai-03'], source: sources.t1ger,
    title: l('Automatiza un flujo, no una app', 'Automate a workflow, not an app'), objective: l('Dibujar un sistema trigger-transform-action.', 'Map a trigger-transform-action system.'), keyConcept: l('Una automatización útil empieza con un evento observable, transforma datos y termina en una acción verificable.', 'A useful automation starts with an observable event, transforms data, and ends with a verifiable action.'),
    impact: { eyebrow: l('IA Y AUTOMATIZACIÓN 04', 'AI AND AUTOMATION 04'), title: l('“Quiero usar IA” no es un flujo', '“I want to use AI” is not a workflow'), body: l('La herramienta viene después. Primero define qué dispara el trabajo, qué información cambia y qué resultado debe aparecer en otro sistema.', 'The tool comes later. First define what triggers the work, what information changes, and what result must appear in another system.'), tacticalRule: l('Trigger observable, transformación limitada, acción comprobable.', 'Observable trigger, bounded transformation, verifiable action.'), metric: { value: 'T→T→A', label: l('la cadena mínima automatizable', 'the minimum automatable chain') } },
    challenge: { title: l('Ordena el flujo', 'Order the workflow'), challenge: { kind: 'ordering', prompt: l('Ordena una automatización de leads entrantes.', 'Order an inbound-lead automation.'), options: [
      { id: 'trigger', label: l('Llega un formulario nuevo', 'A new form arrives') }, { id: 'transform', label: l('La IA clasifica intención y extrae datos', 'AI classifies intent and extracts data') }, { id: 'action', label: l('CRM crea tarea y borrador de respuesta', 'CRM creates a task and response draft') },
    ], orderedIds: ['trigger', 'transform', 'action'], feedback: { correct: l('Cada paso tiene una entrada y una salida.', 'Each step has an input and output.'), incorrect: l('No empieces por la herramienta ni por una acción sin evento.', 'Do not start with the tool or an action without an event.'), explanation: l('La cadena puede probarse paso por paso y fallar de forma visible.', 'The chain can be tested step by step and fail visibly.') } } },
    action: { title: l('Dibuja tu automatización', 'Map your automation'), widget: { engine: 'workflow_map', title: l('Mapa TTA', 'TTA map'), instruction: l('Usa un proceso repetitivo de tu semana.', 'Use one repetitive process from your week.'), fields: [
      { id: 'trigger', kind: 'text', label: l('Trigger observable', 'Observable trigger'), placeholder: l('Llega una nueva respuesta de formulario', 'A new form response arrives'), minLength: 6 }, { id: 'transform', kind: 'text', label: l('Transformación', 'Transformation'), placeholder: l('Clasificar problema y urgencia', 'Classify problem and urgency'), minLength: 6 }, { id: 'action', kind: 'text', label: l('Acción final', 'Final action'), placeholder: l('Crear tarea y borrador en el CRM', 'Create task and draft in CRM'), minLength: 6 },
    ], resultLabel: l('Flujo ejecutable', 'Executable workflow'), artifactTitle: l('Mi primer flujo TTA', 'My first TTA workflow'), commitLabel: l('Guardar flujo', 'Save workflow') } },
    reward: { title: l('Flujo ensamblado', 'Workflow assembled'), body: l('Ya tienes un sistema que puede probarse antes de comprar herramientas.', 'You now have a system that can be tested before buying tools.'), xp: 150, petRecovery: 22 },
  }),
  makeLesson({
    id: 'learn-ai-05', trackId: 'ai-automation', order: 5, slug: 'agent-with-brakes', competency: 'ai', difficulty: 'hard', prerequisiteIds: ['learn-ai-04'], source: sources.anthropic,
    title: l('Un agente necesita frenos', 'An agent needs brakes'), objective: l('Definir herramientas, permisos, aprobación y condición de salida.', 'Define tools, permissions, approval, and stop conditions.'), keyConcept: l('La autonomía segura es una escalera: observar, proponer, ejecutar con aprobación y ejecutar dentro de límites.', 'Safe autonomy is a ladder: observe, propose, execute with approval, and execute within limits.'),
    impact: { eyebrow: l('IA Y AUTOMATIZACIÓN 05', 'AI AND AUTOMATION 05'), title: l('Más autonomía amplifica también el error', 'More autonomy also amplifies error'), body: l('Un agente que puede enviar, gastar o borrar necesita límites explícitos. El control no reduce valor: evita que una excepción destruya el sistema.', 'An agent that can send, spend, or delete needs explicit limits. Control does not reduce value; it prevents one exception from destroying the system.'), tacticalRule: l('Permiso mínimo, aprobación antes de lo irreversible y condición de parada.', 'Minimum permission, approval before irreversible action, and a stop condition.'), metric: { value: '4', label: l('niveles de autonomía progresiva', 'levels of progressive autonomy') } },
    challenge: { title: l('Detecta el agente peligroso', 'Detect the dangerous agent'), challenge: { kind: 'error_detection', prompt: l('¿Cuál configuración debe bloquearse antes de producción?', 'Which configuration must be blocked before production?'), options: [
      { id: 'a', label: l('Puede redactar respuestas, pero un humano envía', 'It can draft responses, but a human sends') }, { id: 'b', label: l('Puede borrar registros y gastar sin límite ni aprobación', 'It can delete records and spend without limit or approval'), correct: true }, { id: 'c', label: l('Registra cada llamada de herramienta', 'It logs every tool call') },
    ], feedback: { correct: l('Identificaste una acción irreversible sin control.', 'You identified an irreversible action without control.'), incorrect: l('Busca permisos amplios y consecuencias difíciles de revertir.', 'Look for broad permissions and hard-to-reverse consequences.'), explanation: l('El agente debe pedir aprobación o trabajar bajo límites verificables.', 'The agent must request approval or work within verifiable limits.') } } },
    action: { title: l('Diseña los frenos', 'Design the brakes'), widget: { engine: 'agent_guardrails', title: l('Canvas de agente seguro', 'Safe-agent canvas'), instruction: l('Define un agente real y el punto donde debe pedir permiso.', 'Define a real agent and the point where it must ask permission.'), fields: [
      { id: 'job', kind: 'text', label: l('Trabajo del agente', 'Agent job'), placeholder: l('Preparar seguimiento de leads', 'Prepare lead follow-ups'), minLength: 6 }, { id: 'tools', kind: 'text', label: l('Herramientas permitidas', 'Allowed tools'), placeholder: l('CRM en lectura y borradores de email', 'Read-only CRM and email drafts'), minLength: 6 }, { id: 'approval', kind: 'text', label: l('Requiere aprobación para', 'Approval required for'), placeholder: l('Enviar, borrar o gastar', 'Send, delete, or spend'), minLength: 6 }, { id: 'stop', kind: 'text', label: l('Condición de parada', 'Stop condition'), placeholder: l('Dato faltante, conflicto o tres fallos', 'Missing data, conflict, or three failures'), minLength: 6 },
    ], resultLabel: l('Contrato de autonomía', 'Autonomy contract'), artifactTitle: l('Mi agente con frenos', 'My agent with brakes'), commitLabel: l('Guardar guardrails', 'Save guardrails') } },
    reward: { title: l('Autonomía controlada', 'Autonomy controlled'), body: l('Tu agente ya sabe qué puede hacer y cuándo debe detenerse.', 'Your agent now knows what it can do and when it must stop.'), xp: 170, petRecovery: 25 },
  }),
];

const growthLessons: AtomicLesson[] = [
  makeLesson({
    id: 'learn-growth-01', trackId: 'viral-growth', order: 1, slug: 'three-second-hook', competency: 'marketing', difficulty: 'easy', prerequisiteIds: [], source: sources.t1ger,
    title: l('Gana los primeros tres segundos', 'Win the first three seconds'), objective: l('Escribir un gancho específico con tensión y recompensa.', 'Write a specific hook with tension and payoff.'), keyConcept: l('Un gancho detiene el scroll cuando promete una recompensa concreta y abre una brecha que el espectador quiere cerrar.', 'A hook stops the scroll when it promises a concrete payoff and opens a gap the viewer wants to close.'),
    impact: { eyebrow: l('VIRAL GROWTH 01', 'VIRAL GROWTH 01'), title: l('Si el inicio no retiene, el resto no existe', 'If the opening does not hold, the rest does not exist'), body: l('La introducción educada pierde contra una tensión visible. Empieza por el error, el contraste o el resultado; presenta tu nombre después.', 'A polite introduction loses to visible tension. Start with the mistake, contrast, or result; introduce yourself later.'), tacticalRule: l('Resultado específico + tensión inmediata + cero saludo.', 'Specific payoff + immediate tension + zero greeting.'), metric: { value: '3 s', label: l('para justificar el siguiente segundo', 'to justify the next second') } },
    challenge: { title: l('Elige el gancho que retiene', 'Choose the hook that holds'), challenge: { kind: 'multiple_choice', prompt: l('Estás produciendo un video sobre ventas B2B. ¿Cuál apertura retiene más según la psicología de atención?', 'You are producing a B2B sales video. Which opening retains best according to attention psychology?'), options: [
      { id: 'a', label: l('«¿Quieres aprender cómo aumentar tus ingresos este año?»', '«Do you want to learn how to increase your revenue this year?»') },
      { id: 'b', label: l('«Esta frase de 5 palabras está matando tus cierres antes de empezar la llamada»', '«This 5-word phrase is killing your closes before the call starts»'), correct: true },
      { id: 'c', label: l('«Hola a todos, bienvenidos a mi canal, hoy les traigo 3 consejos clave»', '«Hi everyone, welcome to my channel, today I have 3 key tips for you»') },
    ], feedback: { correct: l('¡Exacto! Abre una amenaza observable e inmediata. Cero saludos, cero preguntas retóricas que el cerebro ignora.', 'Exactly! Opens an immediate observable threat. Zero polite greetings, zero generic questions.'), incorrect: l('Saludar educadamente o hacer preguntas genéricas son las causas #1 de perder al 75% de la audiencia en 3 segundos.', 'Polite greetings and generic questions are the #1 reasons why 75% of viewers leave in 3 seconds.'), explanation: l('El espectador no te conoce: primero compra la tensión y la promesa; tu nombre lo aprenderá al final.', 'The viewer does not know you: first sell tension and payoff; your name comes at the end.') } } },
    action: { title: l('Escribe tu gancho', 'Write your hook'), widget: { engine: 'hook_lab', title: l('Laboratorio de hooks', 'Hook lab'), instruction: l('Convierte una idea real en una apertura de tres segundos.', 'Turn a real idea into a three-second opening.'), fields: [
      { id: 'audience', kind: 'text', label: l('Audiencia', 'Audience'), placeholder: l('Freelancers que no consiguen respuestas', 'Freelancers who get no replies'), minLength: 5 }, { id: 'pain', kind: 'text', label: l('Pérdida o deseo específico', 'Specific loss or desire'), placeholder: l('Sus propuestas mueren en la primera línea', 'Their proposals die in the first line'), minLength: 5 }, { id: 'mechanism', kind: 'text', label: l('Mecanismo o contraste', 'Mechanism or contrast'), placeholder: l('Un cambio de siete palabras', 'A seven-word change'), minLength: 4 },
    ], resultLabel: l('Gancho listo', 'Hook ready'), artifactTitle: l('Mi gancho de tres segundos', 'My three-second hook'), commitLabel: l('Guardar gancho', 'Save hook') } },
    reward: { title: l('Gancho armado', 'Hook armed'), body: l('Publica esta apertura hoy y mide retención, no opiniones.', 'Publish this opening today and measure retention, not opinions.'), xp: 120, petRecovery: 18 },
  }),
  makeLesson({
    id: 'learn-growth-02', trackId: 'viral-growth', order: 2, slug: 'pain-with-a-face', competency: 'marketing', difficulty: 'easy', prerequisiteIds: ['learn-growth-01'], source: sources.momtest,
    title: l('The Mom Test: valida sin mentiras', 'The Mom Test: validate without lies'), objective: l('Validar problemas reales preguntando por hechos del pasado, jamás por opiniones.', 'Validate real problems by asking about past facts, never opinions.'), keyConcept: l('La gente te mentirá si preguntas por el futuro para no herir tus sentimientos. Valida investigando comportamiento pasado y dinero ya gastado.', 'People will lie about future intent to be polite. Validate by uncovering past behavior and money already spent.'),
    impact: { eyebrow: l('THE MOM TEST 02', 'THE MOM TEST 02'), title: l('Los cumplidos matan startups', 'Compliments kill startups'), body: l('Preguntar «¿comprarías esto?» garantiza un «¡sí, me encanta!» falso. Rob Fitzpatrick demostró que solo hay validación cuando descubres qué intentó el cliente la semana pasada, qué herramientas ya paga y cuánto tiempo perdió.', 'Asking «would you buy this?» guarantees a polite, fake «yes!». Rob Fitzpatrick proved real validation only happens when you discover what they did last week, what tools they already pay for, and how much time they lost.'), tacticalRule: l('Habla de su vida, no de tu idea; pregunta por hechos pasados, nunca por promesas futuras.', 'Talk about their life, not your idea; ask about past facts, never future promises.'), metric: { value: '$0', label: l('vale una opinión o cumplido sin dinero comprometido', 'is what an opinion or compliment is worth without money committed') } },
    challenge: { title: l('Dilema: La Pregunta de Validación', 'Dilemma: The Validation Question'), challenge: { kind: 'multiple_choice', prompt: l('Estás validando un software de facturación para freelancers. Hablas con un diseñador independiente. Según The Mom Test, ¿cuál pregunta te da validación real?', 'You are validating invoicing software for freelancers with an independent designer. According to The Mom Test, which question yields true validation?'), options: [
      { id: 'a', label: l('«¿Pagarías $19/mes por una app que automatice tus facturas con un clic?»', '«Would you pay $19/mo for an app that automates your invoices in 1 click?»') },
      { id: 'b', label: l('«¿Cómo gestionaste tus facturas el mes pasado, cuánto tardaste y qué herramientas pagas hoy para eso?»', '«How did you handle your invoices last month, how long did it take, and what tools do you pay for today?»'), correct: true },
      { id: 'c', label: l('«¿Crees que una plataforma moderna con IA resolvería el estrés contable de la comunidad?»', '«Do you think a modern AI platform would solve accounting stress for the community?»') },
    ], feedback: { correct: l('¡Exacto! Regla de oro de The Mom Test: investiga hechos del pasado y dinero ya gastado. Cero promesas hipotéticas.', 'Exactly! Golden rule of The Mom Test: investigate past actions and money already spent. Zero hypothetical promises.'), incorrect: l('Preguntar por el futuro o por opiniones generales invita a la cortesía social. Los cumplidos te harán construir algo que nadie comprará.', 'Asking about future intent or general opinions invites polite lies. Compliments lead you to build things nobody buys.'), explanation: l('Si el cliente no ha intentado resolver el problema en el pasado ni gasta tiempo/dinero hoy, el dolor no existe en la realidad económica.', 'If the client has not attempted to solve it or spend time/money today, the pain does not exist in economic reality.') } } },
    action: { title: l('Aísla un momento de dolor', 'Isolate a pain moment'), widget: { engine: 'pain_to_promise', title: l('Mapa dolor-promesa Mom Test', 'Mom Test pain-to-promise map'), instruction: l('Usa una conversación real con hechos pasados, no una opinión abstracta.', 'Use a real conversation with past facts, not an abstract opinion.'), fields: [
      { id: 'person', kind: 'text', label: l('Persona concreta entrevistada', 'Concrete person interviewed'), placeholder: l('Diseñador freelance con 4 clientes activos', 'Freelance designer with 4 active clients'), minLength: 5 }, { id: 'moment', kind: 'text', label: l('Hecho pasado y fricción real', 'Past fact and real friction'), placeholder: l('El viernes tardó 3 horas conciliando pagos en Excel', 'On Friday spent 3 hours reconciling payments in Excel'), minLength: 8 }, { id: 'result', kind: 'text', label: l('Dinero/tiempo ya comprometido', 'Money/time already committed'), placeholder: l('Paga $15/mes por software que no le sirve', 'Pays $15/mo for software that fails them'), minLength: 8 },
    ], resultLabel: l('Validación Mom Test', 'Mom Test validation'), artifactTitle: l('Mi validación The Mom Test', 'My The Mom Test validation'), commitLabel: l('Guardar validación', 'Save validation') } },
    reward: { title: l('Validación sin autoengaño', 'Validation without delusion'), body: l('Ahora sabes cómo entrevistar sin recibir cumplidos vacíos.', 'You now know how to interview without getting empty compliments.'), xp: 130, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-growth-03', trackId: 'viral-growth', order: 3, slug: 'value-equation', competency: 'offer', difficulty: 'medium', prerequisiteIds: ['learn-growth-02'], source: sources.hormozi,
    title: l('Haz irresistible el valor', 'Make value irresistible'), objective: l('Aumentar resultado y certeza mientras se reduce espera y esfuerzo.', 'Increase outcome and certainty while reducing delay and effort.'), keyConcept: l('Una oferta se vuelve más valiosa cuando mejora el resultado percibido, aumenta la confianza y acorta el camino.', 'An offer becomes more valuable when it improves perceived outcome, raises confidence, and shortens the path.'),
    impact: { eyebrow: l('VIRAL GROWTH 03', 'VIRAL GROWTH 03'), title: l('Bajar el precio no arregla una oferta débil', 'Lowering price does not fix a weak offer'), body: l('Antes de descontar, aumenta evidencia, reduce pasos y acerca el primer resultado. El usuario compra una transformación con riesgo controlado.', 'Before discounting, increase proof, reduce steps, and move the first result closer. The user buys a transformation with controlled risk.'), tacticalRule: l('Sube resultado y certeza; baja espera y esfuerzo.', 'Raise outcome and certainty; lower delay and effort.'), metric: { value: '4', label: l('palancas de valor antes del descuento', 'value levers before discounting') } },
    challenge: { title: l('Ordena las mejoras', 'Order the improvements'), challenge: { kind: 'ordering', prompt: l('Ordena estas mejoras desde la base hasta el acelerador.', 'Order these improvements from foundation to accelerator.'), options: [
      { id: 'outcome', label: l('Definir un resultado específico', 'Define a specific outcome') }, { id: 'proof', label: l('Añadir evidencia de que funcionará', 'Add evidence it will work') }, { id: 'speed', label: l('Reducir el tiempo al primer resultado', 'Reduce time to first result') },
    ], orderedIds: ['outcome', 'proof', 'speed'], feedback: { correct: l('Primero sabes qué prometes; luego lo haces creíble y rápido.', 'First know the promise; then make it credible and fast.'), incorrect: l('La velocidad de una promesa confusa solo entrega confusión antes.', 'Speeding up a vague promise only delivers confusion sooner.'), explanation: l('Resultado, certeza y velocidad se acumulan.', 'Outcome, certainty, and speed compound.') } } },
    action: { title: l('Reingeniería tu oferta', 'Re-engineer your offer'), widget: { engine: 'offer_value', title: l('Mesa de valor', 'Value desk'), instruction: l('Evalúa una oferta real y elige la palanca más débil.', 'Evaluate a real offer and identify the weakest lever.'), fields: [
      { id: 'offer', kind: 'text', label: l('Oferta', 'Offer'), placeholder: l('Auditoría de embudo en 48 horas', 'Funnel audit in 48 hours'), minLength: 6 }, { id: 'outcome', kind: 'range', label: l('Resultado deseado', 'Desired outcome'), min: 1, max: 10, step: 1, defaultValue: 7 }, { id: 'certainty', kind: 'range', label: l('Certeza percibida', 'Perceived certainty'), min: 1, max: 10, step: 1, defaultValue: 5 }, { id: 'delay', kind: 'range', label: l('Espera', 'Delay'), min: 1, max: 10, step: 1, defaultValue: 5 }, { id: 'effort', kind: 'range', label: l('Esfuerzo del cliente', 'Customer effort'), min: 1, max: 10, step: 1, defaultValue: 5 },
    ], resultLabel: l('Puntuación de valor', 'Value score'), artifactTitle: l('Mi oferta reingenierizada', 'My re-engineered offer'), commitLabel: l('Guardar mejora', 'Save improvement') } },
    reward: { title: l('Palanca encontrada', 'Lever found'), body: l('Ya sabes qué mejorar antes de tocar el precio.', 'You now know what to improve before touching price.'), xp: 140, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-growth-04', trackId: 'viral-growth', order: 4, slug: 'six-second-script', competency: 'marketing', difficulty: 'medium', prerequisiteIds: ['learn-growth-03'], source: sources.t1ger,
    title: l('Guion de seis segundos', 'Six-second script'), objective: l('Construir un guion corto con hook, prueba y acción.', 'Build a short script with hook, proof, and action.'), keyConcept: l('Una pieza corta necesita una sola idea: interrumpir, demostrar y dirigir.', 'A short piece needs one idea: interrupt, prove, and direct.'),
    impact: { eyebrow: l('VIRAL GROWTH 04', 'VIRAL GROWTH 04'), title: l('Una idea por pieza', 'One idea per piece'), body: l('Intentar enseñar cinco cosas destruye ritmo y memoria. Un guion breve mueve al espectador desde una tensión hasta una acción sin desvíos.', 'Trying to teach five things destroys pace and memory. A short script moves the viewer from tension to action without detours.'), tacticalRule: l('Hook en 0–2, prueba en 2–5, acción en 5–6.', 'Hook at 0–2, proof at 2–5, action at 5–6.'), metric: { value: '6 s', label: l('para una idea completa y medible', 'for one complete, measurable idea') } },
    challenge: { title: l('Detecta el guion roto', 'Detect the broken script'), challenge: { kind: 'error_detection', prompt: l('¿Qué error reduce más la retención?', 'Which error hurts retention most?'), options: [
      { id: 'a', label: l('Abrir con logo y presentación durante tres segundos', 'Open with logo and introduction for three seconds'), correct: true }, { id: 'b', label: l('Mostrar una prueba visual en el segundo tres', 'Show visual proof at second three') }, { id: 'c', label: l('Cerrar con una acción específica', 'Close with a specific action') },
    ], feedback: { correct: l('Consumió la mitad del tiempo sin entregar tensión.', 'It spent half the runtime without delivering tension.'), incorrect: l('Busca el bloque que no compra el siguiente segundo.', 'Find the block that fails to buy the next second.'), explanation: l('La marca puede aparecer; no debe retrasar la promesa.', 'Brand can appear; it must not delay the promise.') } } },
    action: { title: l('Monta tu guion', 'Assemble your script'), widget: { engine: 'six_second_script', title: l('Timeline 0–6', 'Timeline 0–6'), instruction: l('Escribe una línea por bloque. Léelo en voz alta.', 'Write one line per block. Read it aloud.'), fields: [
      { id: 'hook', kind: 'text', label: l('0–2 s: interrupción', '0–2 s: interruption'), placeholder: l('Tu CTA está escondiendo la venta', 'Your CTA is hiding the sale'), minLength: 5 }, { id: 'proof', kind: 'text', label: l('2–5 s: prueba', '2–5 s: proof'), placeholder: l('Mira la diferencia entre estos dos botones', 'See the difference between these two buttons'), minLength: 5 }, { id: 'cta', kind: 'text', label: l('5–6 s: acción', '5–6 s: action'), placeholder: l('Copia esta versión', 'Copy this version'), minLength: 3 },
    ], resultLabel: l('Guion completo', 'Complete script'), artifactTitle: l('Mi guion de seis segundos', 'My six-second script'), commitLabel: l('Guardar guion', 'Save script') } },
    reward: { title: l('Guion listo', 'Script ready'), body: l('Grábalo una vez antes de editarlo diez.', 'Record it once before editing it ten times.'), xp: 150, petRecovery: 22 },
  }),
  makeLesson({
    id: 'learn-growth-05', trackId: 'viral-growth', order: 5, slug: 'distribution-machine', competency: 'marketing', difficulty: 'hard', prerequisiteIds: ['learn-growth-04'], source: sources.lean,
    title: l('Distribuye antes de producir más', 'Distribute before producing more'), objective: l('Convertir una idea en un sistema de canales con métricas.', 'Turn one idea into a channel system with metrics.'), keyConcept: l('Una idea gana alcance cuando se adapta al comportamiento de cada canal y conserva una tesis central medible.', 'An idea gains reach when adapted to each channel’s behavior while preserving one measurable thesis.'),
    impact: { eyebrow: l('VIRAL GROWTH 05', 'VIRAL GROWTH 05'), title: l('Crear más no corrige distribuir mal', 'Creating more does not fix weak distribution'), body: l('Una pieza fuerte puede convertirse en video, carrusel, email y conversación. Copiar y pegar no basta: cada formato necesita una entrada y una métrica propia.', 'One strong idea can become video, carousel, email, and conversation. Copy-paste is not enough: each format needs its own entry and metric.'), tacticalRule: l('Una tesis, tres adaptaciones, una métrica por canal.', 'One thesis, three adaptations, one metric per channel.'), metric: { value: '1→4', label: l('una idea convertida en cuatro pruebas', 'one idea turned into four tests') } },
    challenge: { title: l('Empareja canal y señal', 'Match channel and signal'), challenge: { kind: 'matching', prompt: l('Conecta el formato con la señal que importa primero.', 'Connect each format with the signal that matters first.'), pairs: [
      { id: 'short', left: l('Video corto', 'Short video'), right: l('Retención inicial', 'Opening retention') }, { id: 'email', left: l('Email', 'Email'), right: l('Respuesta o clic', 'Reply or click') }, { id: 'carousel', left: l('Carrusel', 'Carousel'), right: l('Avance y guardado', 'Swipe-through and saves') },
    ], feedback: { correct: l('Cada canal ya tiene una prueba concreta.', 'Each channel now has a concrete test.'), incorrect: l('No uses una sola métrica para conductas distintas.', 'Do not use one metric for different behaviors.'), explanation: l('La señal correcta te dice dónde falla la adaptación.', 'The right signal tells you where the adaptation fails.') } } },
    action: { title: l('Diseña tu máquina de distribución', 'Design your distribution machine'), widget: { engine: 'distribution_plan', title: l('Mapa 1→4', '1→4 map'), instruction: l('Parte de una idea que ya puedas defender.', 'Start from one idea you can already defend.'), fields: [
      { id: 'thesis', kind: 'text', label: l('Tesis central', 'Core thesis'), placeholder: l('Las propuestas pierden por falta de siguiente paso', 'Proposals lose because they lack a next step'), minLength: 8 }, { id: 'short', kind: 'text', label: l('Adaptación: video corto', 'Adaptation: short video'), placeholder: l('Antes y después en pantalla', 'Before and after on screen'), minLength: 5 }, { id: 'email', kind: 'text', label: l('Adaptación: email', 'Adaptation: email'), placeholder: l('Caso breve con plantilla', 'Short case with template'), minLength: 5 }, { id: 'conversation', kind: 'text', label: l('Adaptación: conversación', 'Adaptation: conversation'), placeholder: l('Pregunta de diagnóstico', 'Diagnostic question'), minLength: 5 },
    ], resultLabel: l('Sistema de distribución', 'Distribution system'), artifactTitle: l('Mi máquina 1→4', 'My 1→4 machine'), commitLabel: l('Guardar sistema', 'Save system') } },
    reward: { title: l('Máquina activada', 'Machine activated'), body: l('Tu próxima idea ya tiene cuatro oportunidades de aprender.', 'Your next idea now has four opportunities to teach you.'), xp: 170, petRecovery: 25 },
  }),
];

const historyLessons: AtomicLesson[] = [
  makeLesson({
    id: 'learn-history-01', trackId: 'history-strategy', order: 1, slug: 'terrain-and-calculation', competency: 'mindset', difficulty: 'easy', prerequisiteIds: [], source: sources.suntzu,
    title: l('El terreno y la información', 'Terrain and calculation'), objective: l('Evaluar factores objetivos antes de comprometer recursos.', 'Assess objective factors before committing resources.'), keyConcept: l('Quien elige el terreno y calcula primero gana la batalla antes de que comience.', 'Whoever chooses terrain and calculates first wins before fighting begins.'),
    impact: { eyebrow: l('ESTRATEGIA 01', 'STRATEGY 01'), title: l('Ganar antes de luchar', 'Win before fighting'), body: l('Sun Tzu enseñaba que el general victorioso calcula en su templo antes de mover un solo soldado. Si el terreno y las probabilidades no favorecen, no se combate.', 'Sun Tzu taught that the winning general calculates in the temple before moving one soldier. If terrain and odds are poor, you do not fight.'), tacticalRule: l('Evalúa terreno, disciplina y recursos antes del primer movimiento.', 'Evaluate terrain, discipline, and resources before the first move.'), metric: { value: '5', label: l('factores de cálculo previo', 'prior calculation factors') } },
    challenge: { title: l('Decisión de combate', 'Combat decision'), challenge: { kind: 'multiple_choice', prompt: l('¿Cuándo decide atacar un estratega según el Arte de la Guerra?', 'When does a strategist attack according to The Art of War?'), options: [
      { id: 'a', label: l('Cuando tiene más coraje y entusiasmo', 'When having more courage and enthusiasm') }, { id: 'b', label: l('Cuando el cálculo previo y la posición garantizan la victoria', 'When prior calculation and position guarantee victory'), correct: true }, { id: 'c', label: l('Tan pronto como ve al rival', 'As soon as the rival is seen') },
    ], feedback: { correct: l('La victoria es un cálculo, no un impulso.', 'Victory is a calculation, not an impulse.'), incorrect: l('El coraje sin cálculo es temeridad destructiva.', 'Courage without calculation is reckless destruction.'), explanation: l('El estratega gana primero en el mapa y luego entra en el campo.', 'The strategist wins first on the map and then takes the field.') } } },
    action: { title: l('Mapea tu posición', 'Map your position'), widget: { engine: 'strategy_map', title: l('Matriz de terreno táctico', 'Tactical terrain matrix'), instruction: l('Define tu terreno, tu ventaja y tu salida.', 'Define your terrain, edge, and exit.'), fields: [
      { id: 'terrain', kind: 'text', label: l('Terreno o mercado', 'Terrain or market'), placeholder: l('Nicho con poca competencia directa', 'Niche with little direct competition'), minLength: 5 }, { id: 'advantage', kind: 'text', label: l('Ventaja asimétrica', 'Asymmetric edge'), placeholder: l('Velocidad de ejecución y bajo coste fijo', 'Speed of execution and low fixed cost'), minLength: 5 }, { id: 'retreat', kind: 'text', label: l('Plan de contingencia', 'Contingency plan'), placeholder: l('Retirada si el coste supera $500', 'Retreat if cost exceeds $500'), minLength: 5 },
    ], resultLabel: l('Estrategia formulada', 'Formulated strategy'), artifactTitle: l('Mi cálculo de terreno', 'My terrain calculation'), commitLabel: l('Guardar estrategia', 'Save strategy') } },
    reward: { title: l('Posición asegurada', 'Position secured'), body: l('Has calculado el terreno antes de marchar.', 'You calculated the terrain before marching.'), xp: 120, petRecovery: 18 },
  }),
  makeLesson({
    id: 'learn-history-02', trackId: 'history-strategy', order: 2, slug: 'win-without-fighting', competency: 'mindset', difficulty: 'easy', prerequisiteIds: ['learn-history-01'], source: sources.suntzu,
    title: l('La victoria sin batalla', 'Win without fighting'), objective: l('Desarticular las opciones del adversario antes del choque directo.', 'Dismantle the rival’s options before direct collision.'), keyConcept: l('La suprema excelencia consiste en quebrar la resistencia del enemigo sin combatir.', 'Supreme excellence consists in breaking enemy resistance without fighting.'),
    impact: { eyebrow: l('ESTRATEGIA 02', 'STRATEGY 02'), title: l('La mejor victoria preserva recursos', 'The best victory preserves resources'), body: l('Sitiar murallas desgasta a quien ataca. Cortar suministros y forjar alianzas desarma al oponente sin derramar sangre.', 'Besieging walls exhausts the attacker. Severing supplies and forging alliances disarms opponents without bloodshed.'), tacticalRule: l('Ataca primero los planes y alianzas del adversario.', 'Attack the rival’s plans and alliances first.'), metric: { value: '0', label: l('bajas en la victoria suprema', 'casualties in supreme victory') } },
    challenge: { title: l('Prioridad estratégica', 'Strategic priority'), challenge: { kind: 'ordering', prompt: l('Ordena los niveles de ataque de Sun Tzu de mejor a peor.', 'Order Sun Tzu’s attack levels from best to worst.'), options: [
      { id: 'strategy', label: l('Atacar la estrategia del enemigo', 'Attack the enemy’s strategy') }, { id: 'alliances', label: l('Atacar sus alianzas', 'Attack their alliances') }, { id: 'cities', label: l('Asediar sus ciudades amuralladas', 'Besiege their walled cities') },
    ], orderedIds: ['strategy', 'alliances', 'cities'], feedback: { correct: l('Desarticular la mente y apoyos supera al asedio.', 'Breaking the mind and allies beats a siege.'), incorrect: l('Asediar ciudades es el último y peor recurso.', 'Besieging cities is the last and worst resort.'), explanation: l('Atacar la estrategia evita el desgaste frontal.', 'Attacking strategy prevents frontal attrition.') } } },
    action: { title: l('Desarticula la fricción', 'Dismantle friction'), widget: { engine: 'strategy_map', title: l('Plan de victoria sin choque', 'Collision-free victory plan'), instruction: l('Identifica cómo ganar neutralizando la fricción.', 'Identify how to win by neutralizing friction.'), fields: [
      { id: 'terrain', kind: 'text', label: l('Conflicto u obstáculo', 'Conflict or obstacle'), placeholder: l('Competidor bajando precios', 'Competitor slashing prices'), minLength: 5 }, { id: 'advantage', kind: 'text', label: l('Ataque a la estrategia', 'Attack to strategy'), placeholder: l('Mudar a un servicio premium exclusivo', 'Shift to an exclusive premium service'), minLength: 5 }, { id: 'retreat', kind: 'text', label: l('Alianza clave', 'Key alliance'), placeholder: l('Acuerdo de distribución con partners', 'Distribution deal with partners'), minLength: 5 },
    ], resultLabel: l('Plan indirecto', 'Indirect plan'), artifactTitle: l('Mi victoria sin combate', 'My non-combat victory'), commitLabel: l('Guardar plan', 'Save plan') } },
    reward: { title: l('Maestría indirecta', 'Indirect mastery'), body: l('Has dominado el arte de la victoria sin desgaste.', 'You mastered the art of victory without attrition.'), xp: 130, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-history-03', trackId: 'history-strategy', order: 3, slug: 'maneuver-over-mass', competency: 'mindset', difficulty: 'medium', prerequisiteIds: ['learn-history-02'], source: sources.suntzu,
    title: l('Desgaste contra maniobra', 'Attrition vs maneuver'), objective: l('Usar geometría táctica y flanqueo en lugar de empuje frontal.', 'Use tactical geometry and flanking instead of frontal push.'), keyConcept: l('La maniobra asimétrica permite a una fuerza menor rodear y neutralizar a un gigante.', 'Asymmetric maneuver allows a smaller force to envelop and neutralize a giant.'),
    impact: { eyebrow: l('ESTRATEGIA 03', 'STRATEGY 03'), title: l('La lección de Cannas', 'The lesson of Cannae'), body: l('En el 216 a.C., Aníbal cedió en el centro con tropas ligeras. Mientras Roma empujaba creyendo que vencía, sus alas fueron rodeadas por la caballería.', 'In 216 BC, Hannibal gave way in the center with light troops. While Rome pushed believing it won, its flanks were encircled.'), tacticalRule: l('Cede en el punto previsto; encierra en el punto ciego.', 'Yield at the planned point; encircle in the blind spot.'), metric: { value: '2:1', label: l('inferioridad numérica superada por maniobra', 'numerical disadvantage overcome by maneuver') } },
    challenge: { title: l('Detecta el error frontal', 'Detect frontal error'), challenge: { kind: 'error_detection', prompt: l('¿Qué error cometieron las legiones romanas en Cannas?', 'What mistake did Roman legions make at Cannae?'), options: [
      { id: 'a', label: l('Avanzar ciegamente en masa hacia el centro que retrocedía', 'Advancing blindly in mass toward the retreating center'), correct: true }, { id: 'b', label: l('Mantener reservas protegidas en los flancos', 'Keeping protected reserves on the flanks') }, { id: 'c', label: l('Detener la marcha para evaluar la posición', 'Stopping the march to assess position') },
    ], feedback: { correct: l('Cayeron en la trampa del falso avance.', 'They fell into the trap of false advance.'), incorrect: l('Busca la acción que facilitó el cerco.', 'Look for the action that enabled the encirclement.'), explanation: l('El ímpetu no calculado convirtió la ventaja numérica en una masa asfixiada.', 'Uncalculated momentum turned numerical superiority into a smothered mass.') } } },
    action: { title: l('Diseña tu maniobra', 'Design your maneuver'), widget: { engine: 'strategy_map', title: l('Maniobra asimétrica', 'Asymmetric maneuver'), instruction: l('Define dónde absorber y dónde flanquear.', 'Define where to absorb and where to flank.'), fields: [
      { id: 'terrain', kind: 'text', label: l('Punto de absorción', 'Absorption point'), placeholder: l('Aceptar margen bajo en entrada', 'Accept low margin on entry'), minLength: 5 }, { id: 'advantage', kind: 'text', label: l('Flanco decisivo', 'Decisive flank'), placeholder: l('Retención y monetización recurrente', 'Retention and recurring monetization'), minLength: 5 }, { id: 'retreat', kind: 'text', label: l('Límite de riesgo', 'Risk limit'), placeholder: l('Máximo 30 días de prueba', 'Maximum 30-day trial'), minLength: 5 },
    ], resultLabel: l('Maniobra armada', 'Maneuver armed'), artifactTitle: l('Mi maniobra asimétrica', 'My asymmetric maneuver'), commitLabel: l('Guardar maniobra', 'Save maneuver') } },
    reward: { title: l('Cerco completado', 'Encirclement complete'), body: l('Comprendes cómo la geometría vence a la fuerza bruta.', 'You understand how geometry defeats brute force.'), xp: 140, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-history-04', trackId: 'history-strategy', order: 4, slug: 'fog-of-war', competency: 'mindset', difficulty: 'medium', prerequisiteIds: ['learn-history-03'], source: sources.suntzu,
    title: l('La niebla de la guerra', 'The fog of war'), objective: l('Operar con márgenes de seguridad bajo incertidumbre extrema.', 'Operate with margins of safety under extreme uncertainty.'), keyConcept: l('En crisis, el 70% de la información es incompleta o errónea; los planes rígidos se quiebran.', 'In crisis, 70% of information is noisy; rigid plans snap.'),
    impact: { eyebrow: l('ESTRATEGIA 04', 'STRATEGY 04'), title: l('Clausewitz y la fricción', 'Clausewitz and friction'), body: l('Todo en la teoría es fácil; en la práctica, la fricción humana y los retrasos complican lo elemental. El líder audaz usa reglas simples y reservas flexibles.', 'All in theory is easy; in practice, human friction and delays complicate the elemental. The bold leader uses simple rules and flexible reserves.'), tacticalRule: l('Reglas de decisión simples + reservas no comprometidas.', 'Simple decision rules + uncommitted reserves.'), metric: { value: '70%', label: l('incertidumbre tolerable con margen de seguridad', 'tolerable uncertainty with safety margin') } },
    challenge: { title: l('Decisión en la niebla', 'Decision in the fog'), challenge: { kind: 'multiple_choice', prompt: l('¿Cuál es la mejor respuesta ante información contradictoria en una crisis?', 'What is the best response to contradictory information in a crisis?'), options: [
      { id: 'a', label: l('Paralizar todas las operaciones hasta tener certeza absoluta', 'Halt all operations until absolute certainty is reached') }, { id: 'b', label: l('Ejecutar con reservas de protección y comunicación redundante', 'Execute with protective reserves and redundant communication'), correct: true }, { id: 'c', label: l('Apostar todos los recursos a una sola intuición', 'Bet all resources on a single intuition') },
    ], feedback: { correct: l('El margen de seguridad absorbe el error.', 'The safety margin absorbs error.'), incorrect: l('La parálisis y la apuesta a ciegas son ambas fatales.', 'Paralysis and blind gambling are both fatal.'), explanation: l('Bajo niebla, la flexibilidad de las reservas salva la misión.', 'Under fog, reserve flexibility saves the mission.') } } },
    action: { title: l('Protocolo de incertidumbre', 'Uncertainty protocol'), widget: { engine: 'strategy_map', title: l('Reserva de seguridad', 'Safety reserve'), instruction: l('Establece tu regla cuando los datos sean confusos.', 'Set your rule when data is unclear.'), fields: [
      { id: 'terrain', kind: 'text', label: l('Escenario incierto', 'Uncertain scenario'), placeholder: l('Lanzamiento con métricas contradictorias', 'Launch with mixed metrics'), minLength: 5 }, { id: 'advantage', kind: 'text', label: l('Reserva protegida', 'Protected reserve'), placeholder: l('20% del presupuesto guardado intacto', '20% of budget kept intact'), minLength: 5 }, { id: 'retreat', kind: 'text', label: l('Criterio de aborto', 'Abort criteria'), placeholder: l('Cero conversión en 48 horas', 'Zero conversion in 48 hours'), minLength: 5 },
    ], resultLabel: l('Protocolo activo', 'Active protocol'), artifactTitle: l('Mi protocolo en la niebla', 'My fog-of-war protocol'), commitLabel: l('Guardar protocolo', 'Save protocol') } },
    reward: { title: l('Mente en la niebla', 'Mind in the fog'), body: l('Sabes actuar con firmeza cuando otros se paralizan.', 'You know how to act decisively when others freeze.'), xp: 150, petRecovery: 22 },
  }),
  makeLesson({
    id: 'learn-history-05', trackId: 'history-strategy', order: 5, slug: 'fall-of-empires', competency: 'mindset', difficulty: 'hard', prerequisiteIds: ['learn-history-04'], source: sources.suntzu,
    title: l('El colapso de los imperios', 'The fall of empires'), objective: l('Blindar la resiliencia estructural contra la complacencia.', 'Shield structural resilience against complacency.'), keyConcept: l('Los sistemas no mueren por enemigos externos; caen cuando su disciplina interna se pudre.', 'Systems do not die from outside rivals; they collapse when internal discipline rots.'),
    impact: { eyebrow: l('ESTRATEGIA 05', 'STRATEGY 05'), title: l('La trampa de la abundancia', 'The abundance trap'), body: l('Roma, Bizancio y las grandes dinastías decayeron cuando el confort sustituyó a la vigilancia y la moneda perdió valor. La longevidad exige regeneración constante.', 'Rome, Byzantium, and great dynasties decayed when comfort replaced vigilance and currency lost value. Longevity requires constant renewal.'), tacticalRule: l('Vigila tus costes, renueva tus estándares y no toleres la laxitud.', 'Watch costs, renew standards, and tolerate no slack.'), metric: { value: '1', label: l('disciplina diaria sostiene a todo un imperio', 'daily discipline sustains an entire empire') } },
    challenge: { title: l('Causa raíz del declive', 'Root cause of decline'), challenge: { kind: 'multiple_choice', prompt: l('¿Qué señal precede históricamente a la caída de una potencia?', 'What signal historically precedes the fall of a power?'), options: [
      { id: 'a', label: l('Un invierno inusualmente frío', 'An unusually cold winter') }, { id: 'b', label: l('Gasto desmedido, devaluación y pérdida de disciplina cívica', 'Unchecked spending, debasement, and loss of civic discipline'), correct: true }, { id: 'c', label: l('Un rival más pequeño protestando en la frontera', 'A smaller rival protesting on the border') },
    ], feedback: { correct: l('La fragilidad interna siempre precede al colapso.', 'Internal fragility always precedes collapse.'), incorrect: l('Los factores externos solo empujan lo que ya estaba quebrado.', 'External shocks only topple what was already fractured.'), explanation: l('La autodisciplina y el control fiscal son la muralla verdadera.', 'Self-discipline and fiscal sanity are the true wall.') } } },
    action: { title: l('Auditoría antifrágil', 'Antifragile audit'), widget: { engine: 'strategy_map', title: l('Chequeo de resiliencia', 'Resilience check'), instruction: l('Identifica qué hábito o proceso necesita disciplina.', 'Identify what habit or process needs discipline.'), fields: [
      { id: 'terrain', kind: 'text', label: l('Área vulnerable', 'Vulnerable area'), placeholder: l('Gasto hormiga o falta de rutinas fijas', 'Micro-expenses or lack of set routines'), minLength: 5 }, { id: 'advantage', kind: 'text', label: l('Estándar no negociable', 'Non-negotiable standard'), placeholder: l('Revisión semanal de números los lunes', 'Weekly financial review on Mondays'), minLength: 5 }, { id: 'retreat', kind: 'text', label: l('Regla de supervivencia', 'Survival rule'), placeholder: l('Cero deuda improductiva', 'Zero unproductive debt'), minLength: 5 },
    ], resultLabel: l('Blindaje definido', 'Shield defined'), artifactTitle: l('Mi auditoría antifrágil', 'My antifragile audit'), commitLabel: l('Guardar auditoría', 'Save audit') } },
    reward: { title: l('Imperio blindado', 'Empire shielded'), body: l('Has completado la maestría de Estrategia & Historia.', 'You completed the Strategy & History mastery.'), xp: 170, petRecovery: 25 },
  }),
];

const mindsetLessons: AtomicLesson[] = [
  makeLesson({
    id: 'learn-mindset-01', trackId: 'mindset-stoic', order: 1, slug: 'dichotomy-of-control', competency: 'mindset', difficulty: 'easy', prerequisiteIds: [], source: sources.marcus,
    title: l('La dicotomía del control', 'Dichotomy of control'), objective: l('Separar las variables internas de las externas para eliminar el estrés inútil.', 'Separate internal from external variables to eliminate useless stress.'), keyConcept: l('Tu paz y poder residen solo en tus juicios y acciones; todo lo externo no depende de ti.', 'Your peace and power lie only in your judgments and actions; externals are not up to you.'),
    impact: { eyebrow: l('MENTE & ESTOICISMO 01', 'MINDSET & STOICISM 01'), title: l('Deja de negociar con lo incontrolable', 'Stop negotiating with the uncontrollable'), body: l('Preocuparse por el mercado, la economía o la opinión ajena consume tu energía de ejecución. Pon tu atención donde tu voluntad tiene soberanía.', 'Worrying about markets, economy, or others’ opinions drains executive energy. Focus where your will is sovereign.'), tacticalRule: l('100% de enfoque en tu esfuerzo; 0% de queja sobre el resultado externo.', '100% focus on effort; 0% lament on external outcome.'), metric: { value: '2', label: l('esferas: lo que controlas y lo que no', 'realms: what you control and what you do not') } },
    challenge: { title: l('Filtra las variables', 'Filter variables'), challenge: { kind: 'multiple_choice', prompt: l('¿Cuál de estos factores depende enteramente de ti hoy?', 'Which of these factors depends entirely on you today?'), options: [
      { id: 'a', label: l('Que el cliente acepte tu propuesta', 'The client accepting your proposal') }, { id: 'b', label: l('La claridad, honestidad y preparación de tu propuesta', 'The clarity, honesty, and preparation of your proposal'), correct: true }, { id: 'c', label: l('Que el mercado no tenga volatilidad', 'The market experiencing zero volatility') },
    ], feedback: { correct: l('Solo tu preparación y conducta están en tu mano.', 'Only your preparation and conduct are in your hands.'), incorrect: l('El resultado depende de factores ajenos; tu esfuerzo es propio.', 'Outcomes depend on externals; your effort is your own.'), explanation: l('El estoico se juzga por la calidad de su tiro, no por el viento.', 'The Stoic judges the shot’s craft, not the wind.') } } },
    action: { title: l('Aplica la dicotomía', 'Apply the dichotomy'), widget: { engine: 'control_filter', title: l('Filtro estoico de control', 'Stoic control filter'), instruction: l('Aísla tu mayor preocupación actual y sepárala.', 'Isolate your current worry and separate it.'), fields: [
      { id: 'external', kind: 'text', label: l('Fuera de mi control', 'Outside my control'), placeholder: l('La reacción del cliente a mi precio', 'The client reaction to my price'), minLength: 5 }, { id: 'internal', kind: 'text', label: l('Bajo mi control total', 'Under my total control'), placeholder: l('La solidez de mis argumentos y mi calma', 'The strength of my arguments and calm'), minLength: 5 }, { id: 'response', kind: 'text', label: l('Mi respuesta deliberada', 'My deliberate response'), placeholder: l('Presentar sin titubear y escuchar con atención', 'Present firmly and listen closely'), minLength: 5 },
    ], resultLabel: l('Filtro activo', 'Filter active'), artifactTitle: l('Mi filtro de control', 'My control filter'), commitLabel: l('Guardar filtro', 'Save filter') } },
    reward: { title: l('Mente blindada', 'Mind shielded'), body: l('Has recuperado tu energía ejecutiva.', 'You reclaimed your executive energy.'), xp: 120, petRecovery: 18 },
  }),
  makeLesson({
    id: 'learn-mindset-02', trackId: 'mindset-stoic', order: 2, slug: 'loss-aversion-bias', competency: 'mindset', difficulty: 'easy', prerequisiteIds: ['learn-mindset-01'], source: sources.kahneman,
    title: l('Aversión a la pérdida y sesgos', 'Loss aversion and biases'), objective: l('Desactivar el miedo irracional a equivocarse o perder.', 'Defuse irrational fear of mistakes or loss.'), keyConcept: l('El cerebro sufre el doble por una pérdida que lo que disfruta una ganancia simétrica.', 'The human brain hurts twice as much from loss as it enjoys equal gain.'),
    impact: { eyebrow: l('MENTE & ESTOICISMO 02', 'MINDSET & STOICISM 02'), title: l('Kahneman y la trampa del miedo', 'Kahneman and the fear trap'), body: l('La aversión a la pérdida nos hace mantener malas inversiones por orgullo o rechazar oportunidades asimétricas por miedo. Rompe el sesgo con cálculo frío.', 'Loss aversion makes us hold bad investments from pride or reject asymmetric bets from fear. Break the bias with cold math.'), tacticalRule: l('Decide por valor esperado a futuro, jamás por apego al pasado.', 'Decide on future expected value, never on past attachment.'), metric: { value: '2x', label: l('intensidad emocional del dolor de perder', 'emotional intensity of loss pain') } },
    challenge: { title: l('Identifica el coste hundido', 'Identify sunk cost'), challenge: { kind: 'multiple_choice', prompt: l('Gastaste $1,000 en un proyecto que no funciona. ¿Qué debes hacer?', 'You spent $1,000 on a failing project. What should you do?'), options: [
      { id: 'a', label: l('Seguir metiendo dinero para no admitir que perdiste los $1,000', 'Keep injecting money to avoid admitting you lost $1,000') }, { id: 'b', label: l('Evaluar objetivamente si cada nuevo dólar generará retorno hacia adelante', 'Objectively evaluate if each new dollar yields forward return'), correct: true }, { id: 'c', label: l('Esperar que la suerte lo arregle', 'Wait for luck to fix it') },
    ], feedback: { correct: l('El dinero pasado no se recupera duplicando el error.', 'Past money cannot be recovered by doubling down on error.'), incorrect: l('Esa es exactamente la falacia del coste hundido.', 'That is the textbook sunk cost fallacy.'), explanation: l('El dinero gastado es irrecuperable; solo importa el futuro.', 'Sunk money is gone; only forward value matters.') } } },
    action: { title: l('Corta el lastre', 'Cut the ballast'), widget: { engine: 'control_filter', title: l('Detector de coste hundido', 'Sunk cost detector'), instruction: l('Evalúa una idea o proyecto dudoso.', 'Evaluate a doubtful idea or project.'), fields: [
      { id: 'external', kind: 'text', label: l('Coste pasado irrecuperable', 'Unrecoverable past cost'), placeholder: l('3 meses de trabajo en una función inútil', '3 months of work on a useless feature'), minLength: 5 }, { id: 'internal', kind: 'text', label: l('Hecho objetivo observable', 'Observable objective fact'), placeholder: l('Cero usuarios la utilizan en producción', 'Zero users utilize it in production'), minLength: 5 }, { id: 'response', kind: 'text', label: l('Decisión hacia adelante', 'Forward decision'), placeholder: l('Eliminar la función hoy y redirigir esfuerzo', 'Cut the feature today and redirect effort'), minLength: 5 },
    ], resultLabel: l('Decisión limpia', 'Clean decision'), artifactTitle: l('Mi corte de pérdidas', 'My loss cut'), commitLabel: l('Guardar decisión', 'Save decision') } },
    reward: { title: l('Sesgo eliminado', 'Bias cleared'), body: l('Ya no eres rehén de tus decisiones pasadas.', 'You are no longer hostage to past choices.'), xp: 130, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-mindset-03', trackId: 'mindset-stoic', order: 3, slug: 'amor-fati-obstacle', competency: 'mindset', difficulty: 'medium', prerequisiteIds: ['learn-mindset-02'], source: sources.marcus,
    title: l('Amor Fati: el obstáculo es el camino', 'Amor Fati: obstacle is the way'), objective: l('Transformar cualquier revés en una oportunidad de templanza y astucia.', 'Transform any setback into an opportunity for temperance and cunning.'), keyConcept: l('Lo que se interpone en el camino se convierte en el nuevo camino.', 'What stands in the way becomes the new way.'),
    impact: { eyebrow: l('MENTE & ESTOICISMO 03', 'MINDSET & STOICISM 03'), title: l('El combustible de la adversidad', 'The fuel of adversity'), body: l('Marco Aurelio no se quejaba de las plagas ni de las guerras; las usaba como gimnasio moral. Amor Fati no es resignación; es amar el destino para superarlo.', 'Marcus Aurelius did not curse plagues or wars; he used them as a moral gym. Amor Fati is not resignation; it is loving destiny to master it.'), tacticalRule: l('El fuego convierte cualquier obstáculo en más fuego.', 'Fire turns any obstacle into greater flame.'), metric: { value: '180°', label: l('giro mental de víctima a depredador', 'mental flip from victim to predator') } },
    challenge: { title: l('Elige la perspectiva', 'Choose perspective'), challenge: { kind: 'multiple_choice', prompt: l('Un proveedor clave te cancela a 24 horas del lanzamiento. ¿Cuál es la respuesta estoica?', 'A key supplier cancels 24h before launch. What is the Stoic response?'), options: [
      { id: 'a', label: l('Lamentarse y culpar al proveedor en redes sociales', 'Lament and blame the supplier on social media') }, { id: 'b', label: l('Aceptar el hecho sin drama y usar la presión para simplificar la oferta', 'Accept the fact without drama and use pressure to simplify the offer'), correct: true }, { id: 'c', label: l('Cancelar todo y rendirse', 'Cancel everything and surrender') },
    ], feedback: { correct: l('El obstáculo forzó una solución más ligera y ágil.', 'The obstacle forced a leaner, faster solution.'), incorrect: l('La queja quema tiempo valioso de respuesta.', 'Complaining burns precious response time.'), explanation: l('Quien domina Amor Fati usa la fricción a su favor.', 'Whoever masters Amor Fati uses friction to their advantage.') } } },
    action: { title: l('Reencuadra el problema', 'Reframe the problem'), widget: { engine: 'control_filter', title: l('Reencuadre Amor Fati', 'Amor Fati reframe'), instruction: l('Convierte un problema actual en una ventaja.', 'Turn a current problem into an advantage.'), fields: [
      { id: 'external', kind: 'text', label: l('El revés o bloqueo', 'The setback or block'), placeholder: l('Presupuesto de marketing reducido a la mitad', 'Marketing budget cut in half'), minLength: 5 }, { id: 'internal', kind: 'text', label: l('La virtud que entrena', 'The virtue it trains'), placeholder: l('Ingenio orgánico y copywriting más afilado', 'Organic ingenuity and sharper copy'), minLength: 5 }, { id: 'response', kind: 'text', label: l('El nuevo camino', 'The new way'), placeholder: l('Probar 10 piezas cortas orgánicas diarias', 'Test 10 daily short organic pieces'), minLength: 5 },
    ], resultLabel: l('Problema convertido', 'Problem converted'), artifactTitle: l('Mi reencuadre Amor Fati', 'My Amor Fati reframe'), commitLabel: l('Guardar reencuadre', 'Save reframe') } },
    reward: { title: l('Llama encendida', 'Flame lit'), body: l('Ahora cada tropiezo te hace más peligroso.', 'Now every stumble makes you more dangerous.'), xp: 140, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-mindset-04', trackId: 'mindset-stoic', order: 4, slug: 'internal-dialogue', competency: 'mindset', difficulty: 'medium', prerequisiteIds: ['learn-mindset-03'], source: sources.marcus,
    title: l('Control del diálogo interno', 'Internal dialogue mastery'), objective: l('Reemplazar la voz autocrítica automática por directivas operativas.', 'Replace automatic self-criticism with operational directives.'), keyConcept: l('Las palabras con las que describes tu realidad definen tu fisiología y claridad.', 'The words you use to describe your reality define your physiology and clarity.'),
    impact: { eyebrow: l('MENTE & ESTOICISMO 04', 'MINDSET & STOICISM 04'), title: l('Tú no eres tu primer pensamiento', 'You are not your first thought'), body: l('El cerebro primitivo reacciona con miedo y juicios catastróficos. La consciencia madura observa ese pensamiento, lo descarta y emite una orden fría.', 'The primitive brain reacts with catastrophe. Mature awareness observes that thought, discards it, and gives a calm command.'), tacticalRule: l('Describe hechos observables, nunca juicios catastróficos.', 'Describe observable facts, never catastrophic judgments.'), metric: { value: '1 s', label: l('para pausar antes de validar un pensamiento', 'to pause before validating a thought') } },
    challenge: { title: l('Detecta el diálogo tóxico', 'Detect toxic dialogue'), challenge: { kind: 'error_detection', prompt: l('¿Cuál de estas frases es un juicio catastrófico desestabilizador?', 'Which of these phrases is a destabilizing catastrophic judgment?'), options: [
      { id: 'a', label: l('Esta campaña tuvo 0 conversiones; probemos otro titular', 'This campaign had 0 conversions; let us test another headline') }, { id: 'b', label: l('Siempre fracaso, nunca seré capaz de vender nada', 'I always fail; I will never be able to sell anything'), correct: true }, { id: 'c', label: l('El coste por clic subió 15%; toca revisar el público', 'Cost per click rose 15%; time to review the audience') },
    ], feedback: { correct: l('Identificaste generalizaciones absolutas tóxicas.', 'You spotted toxic absolute generalizations.'), incorrect: l('Busca frases que ataquen tu identidad con “siempre” o “nunca”.', 'Look for phrases attacking identity with “always” or “never”.'), explanation: l('Los hechos son útiles; los juicios absolutos son destructivos.', 'Facts are useful; absolute judgments are destructive.') } } },
    action: { title: l('Reescribe tu diálogo', 'Rewrite your dialogue'), widget: { engine: 'control_filter', title: l('Corrector de diálogo interno', 'Internal dialogue corrector'), instruction: l('Desarma un pensamiento limitante recurrente.', 'Dismantle a recurring limiting thought.'), fields: [
      { id: 'external', kind: 'text', label: l('Pensamiento automático tóxico', 'Toxic automatic thought'), placeholder: l('No estoy listo para cobrar precios altos', 'I am not ready to charge high prices'), minLength: 5 }, { id: 'internal', kind: 'text', label: l('Realidad observable y fría', 'Observable cold reality'), placeholder: l('He entregado resultados tangibles a 5 clientes', 'I delivered tangible results to 5 clients'), minLength: 5 }, { id: 'response', kind: 'text', label: l('Directiva operativa', 'Operational directive'), placeholder: l('Fijar mi tarifa en $1,500 y respaldar con garantía', 'Set my rate at $1,500 and back with a guarantee'), minLength: 5 },
    ], resultLabel: l('Directiva lista', 'Directive ready'), artifactTitle: l('Mi diálogo interno operativo', 'My operational dialogue'), commitLabel: l('Guardar directiva', 'Save directive') } },
    reward: { title: l('Mente disciplinada', 'Mind disciplined'), body: l('Ahora eres el comandante de tus propios pensamientos.', 'You are now the commander of your own thoughts.'), xp: 150, petRecovery: 22 },
  }),
  makeLesson({
    id: 'learn-mindset-05', trackId: 'mindset-stoic', order: 5, slug: 'inner-citadel', competency: 'mindset', difficulty: 'hard', prerequisiteIds: ['learn-mindset-04'], source: sources.marcus,
    title: l('La ciudadela interior', 'The inner citadel'), objective: l('Construir invulnerabilidad psicológica ante la opinión ajena.', 'Build psychological invulnerability to external opinions.'), keyConcept: l('Quien no necesita aprobación externa no puede ser manipulado ni quebrado.', 'Whoever craves no external approval cannot be manipulated or broken.'),
    impact: { eyebrow: l('MENTE & ESTOICISMO 05', 'MINDSET & STOICISM 05'), title: l('Inmune a la lisonja y la censura', 'Immune to flattery and censure'), body: l('El sabio no se infla cuando lo aplauden ni se encoge cuando lo atacan. Su honor se rige por su propio estándar interno inquebrantable.', 'The wise neither puff up when cheered nor shrink when mocked. Their honor is ruled by their own unshakeable inner standard.'), tacticalRule: l('Trata el halago y la crítica superficial con la misma fría indiferencia.', 'Treat flattery and shallow critique with the same cool indifference.'), metric: { value: '0', label: l('peso a opiniones sin piel en el juego', 'weight given to opinions without skin in the game') } },
    challenge: { title: l('Reacción ante el ataque', 'Reaction to attack'), challenge: { kind: 'multiple_choice', prompt: l('Alguien deja un comentario insultante en tu trabajo. ¿Qué hace el líder estoico?', 'Someone leaves an insulting comment on your work. What does the Stoic leader do?'), options: [
      { id: 'a', label: l('Entrar en una discusión furiosa de 2 horas', 'Enter a furious 2-hour online debate') }, { id: 'b', label: l('Ignorarlo o extraer datos útiles sin alterar su pulso ni un segundo', 'Ignore it or extract useful data without altering their pulse for a second'), correct: true }, { id: 'c', label: l('Borrar la publicación y desanimarse', 'Delete the post and get discouraged') },
    ], feedback: { correct: l('El ruido ajeno no altera la rectitud de tu obra.', 'Outside noise does not change the justice of your work.'), incorrect: l('Reaccionar con ira le da poder al atacante sobre tu mente.', 'Reacting with anger hands the attacker power over your mind.'), explanation: l('Tu atención es demasiado valiosa para regalarla al rencor.', 'Your attention is too valuable to donate to bitterness.') } } },
    action: { title: l('Construye tu ciudadela', 'Build your citadel'), widget: { engine: 'control_filter', title: l('Estándar de la ciudadela', 'Citadel standard'), instruction: l('Define tus principios inviolables.', 'Define your inviolable principles.'), fields: [
      { id: 'external', kind: 'text', label: l('Ruido exterior a ignorar', 'External noise to ignore'), placeholder: l('Críticas de gente anónima sin proyectos propios', 'Critique from anonymous people with no projects'), minLength: 5 }, { id: 'internal', kind: 'text', label: l('Mi estándar de excelencia', 'My standard of excellence'), placeholder: l('Entregar máxima calidad y decir siempre la verdad', 'Deliver top quality and always tell the truth'), minLength: 5 }, { id: 'response', kind: 'text', label: l('Acción blindada', 'Armored action'), placeholder: l('Seguir construyendo sin mirar a los lados', 'Keep building without glancing sideways'), minLength: 5 },
    ], resultLabel: l('Ciudadela armada', 'Citadel armed'), artifactTitle: l('Mi ciudadela interior', 'My inner citadel'), commitLabel: l('Guardar ciudadela', 'Save citadel') } },
    reward: { title: l('Soberanía mental', 'Mental sovereignty'), body: l('Has completado la maestría de Mente & Estoicismo.', 'You completed the Mindset & Stoicism mastery.'), xp: 170, petRecovery: 25 },
  }),
];

// Stable legacy lesson IDs are intentionally preserved so existing progress and FSRS cards migrate safely.
// All learner-facing content is replaced by the evidence-based Psychology launch curriculum below.
const psychologyLessonContent = [
  {
    slug: 'confirmation-bias', source: sources.nickerson,
    title: l('Sesgo de confirmación', 'Confirmation bias'),
    objective: l('Buscar evidencia que pueda refutar una creencia, no solo confirmarla.', 'Seek evidence that could disprove a belief, not only confirm it.'),
    keyConcept: l('La mente tiende a buscar e interpretar información a favor de lo que ya cree.', 'The mind tends to seek and interpret information in ways that favor existing beliefs.'),
    impact: { eyebrow: l('PSICOLOGÍA 01', 'PSYCHOLOGY 01'), title: l('Tu mente edita la evidencia', 'Your mind edits the evidence'), body: l('Cuando una idea importa, solemos notar los datos que la apoyan y explicar los que la contradicen. Una decisión mejora cuando intentas demostrarte que estás equivocado.', 'When an idea matters, we tend to notice supporting evidence and explain away contradictions. Decisions improve when you try to prove yourself wrong.'), tacticalRule: l('Antes de decidir, escribe qué evidencia cambiaría tu opinión.', 'Before deciding, write what evidence would change your mind.'), metric: { value: '1', label: l('prueba contraria antes de decidir', 'disconfirming test before deciding') } },
    challenge: { prompt: l('Crees que una app nueva será útil. ¿Qué prueba reduce mejor tu sesgo?', 'You believe a new app will be useful. Which test best reduces your bias?'), options: [{ id: 'a', label: l('Leer solo reseñas de cinco estrellas', 'Read only five-star reviews') }, { id: 'b', label: l('Definir una semana de prueba y una condición clara para abandonarla', 'Define a one-week test and a clear condition for dropping it'), correct: true }, { id: 'c', label: l('Preguntar a un amigo que ya está de acuerdo', 'Ask a friend who already agrees') }], correct: l('Creaste una prueba capaz de cambiar tu opinión.', 'You created a test capable of changing your mind.'), incorrect: l('Eso protege la creencia en vez de ponerla a prueba.', 'That protects the belief instead of testing it.'), explanation: l('Una condición de falsación obliga a considerar evidencia contraria.', 'A falsification condition forces you to consider contrary evidence.') },
    action: { title: l('Diseña una prueba contraria', 'Design a disconfirming test'), instruction: l('Elige una decisión real y define cómo intentarás refutarla.', 'Choose a real decision and define how you will try to disprove it.'), labels: [l('Creencia actual', 'Current belief'), l('Evidencia que la debilitaría', 'Evidence that would weaken it'), l('Prueba de esta semana', 'Test this week')], artifact: l('Mi prueba contra el sesgo', 'My bias check') },
    reward: { title: l('Decisión más limpia', 'Cleaner decision'), body: l('Ahora tienes una forma concreta de cuestionar tu primera impresión.', 'You now have a concrete way to challenge your first impression.'), xp: 120, petRecovery: 18 },
  },
  {
    slug: 'loss-aversion', source: sources.kahneman,
    title: l('Aversión a la pérdida', 'Loss aversion'),
    objective: l('Separar el miedo a perder de la calidad real de una decisión.', 'Separate fear of loss from the actual quality of a decision.'),
    keyConcept: l('Las pérdidas suelen pesar más que ganancias comparables, lo que puede distorsionar decisiones bajo riesgo.', 'Losses often weigh more than comparable gains, which can distort decisions under risk.'),
    impact: { eyebrow: l('PSICOLOGÍA 02', 'PSYCHOLOGY 02'), title: l('El miedo cambia el cálculo', 'Fear changes the calculation'), body: l('Evitar toda pérdida puede impedir decisiones razonables. El objetivo no es ignorar el riesgo, sino compararlo con criterios definidos antes de sentir presión.', 'Avoiding every loss can block reasonable choices. The goal is not to ignore risk, but to compare it with criteria set before pressure arrives.'), tacticalRule: l('Define límites y criterios antes de conocer el resultado.', 'Set limits and criteria before you know the outcome.'), metric: { value: '2', label: l('columnas: riesgo y beneficio esperado', 'columns: risk and expected benefit') } },
    challenge: { prompt: l('¿Qué decisión controla mejor la aversión a la pérdida?', 'Which decision best controls loss aversion?'), options: [{ id: 'a', label: l('Cambiar la regla cada vez que aparece miedo', 'Change the rule whenever fear appears') }, { id: 'b', label: l('Comparar opciones con límites definidos de antemano', 'Compare options using limits defined in advance'), correct: true }, { id: 'c', label: l('Elegir siempre la opción que no puede perder', 'Always choose the option that cannot lose') }], correct: l('Los criterios previos reducen decisiones impulsivas.', 'Precommitted criteria reduce impulsive decisions.'), incorrect: l('Evitar cualquier pérdida también puede tener un coste.', 'Avoiding every loss can also carry a cost.'), explanation: l('Una regla previa permite evaluar el riesgo sin negar la emoción.', 'A prior rule lets you evaluate risk without denying emotion.') },
    action: { title: l('Crea una regla de decisión', 'Create a decision rule'), instruction: l('Convierte una decisión incierta en límites explícitos.', 'Turn an uncertain choice into explicit limits.'), labels: [l('Decisión', 'Decision'), l('Pérdida máxima aceptable', 'Maximum acceptable loss'), l('Condición para avanzar', 'Condition to proceed')], artifact: l('Mi regla ante pérdidas', 'My loss decision rule') },
    reward: { title: l('Riesgo con criterio', 'Risk with judgment'), body: l('El miedo ya no decide solo.', 'Fear no longer decides alone.'), xp: 130, petRecovery: 20 },
  },
  {
    slug: 'sunk-cost', source: sources.sunkCost,
    title: l('La trampa del coste hundido', 'The sunk-cost trap'),
    objective: l('Decidir con el valor futuro en vez de defender recursos ya gastados.', 'Decide using future value instead of defending resources already spent.'),
    keyConcept: l('Un coste irrecuperable no debería cambiar cuál opción es mejor desde hoy.', 'An unrecoverable cost should not change which option is best from today.'),
    impact: { eyebrow: l('PSICOLOGÍA 03', 'PSYCHOLOGY 03'), title: l('El pasado no vota', 'The past does not vote'), body: l('Tiempo, dinero o esfuerzo ya gastados pueden empujarte a continuar una mala opción. La pregunta útil es: si empezara hoy, ¿volvería a elegir esto?', 'Time, money, or effort already spent can push you to continue a poor choice. The useful question is: if I started today, would I choose this again?'), tacticalRule: l('Ignora lo irrecuperable; compara solo costes y beneficios futuros.', 'Ignore what cannot be recovered; compare only future costs and benefits.'), metric: { value: '0', label: l('peso del coste pasado en la próxima decisión', 'weight of past cost in the next decision') } },
    challenge: { prompt: l('Pagaste un curso que ya no responde a tu meta. ¿Qué criterio importa?', 'You paid for a course that no longer serves your goal. Which criterion matters?'), options: [{ id: 'a', label: l('Terminarlo porque ya pagaste', 'Finish it because you already paid') }, { id: 'b', label: l('Comparar el valor futuro de continuar con la mejor alternativa actual', 'Compare the future value of continuing with the best current alternative'), correct: true }, { id: 'c', label: l('Invertir más para justificar la compra', 'Invest more to justify the purchase') }], correct: l('La decisión empieza desde el presente.', 'The decision starts from the present.'), incorrect: l('El pago ya ocurrió; no mejora la opción futura.', 'The payment already happened; it does not improve the future option.'), explanation: l('Los costes hundidos explican el pasado, pero no deben gobernar el siguiente paso.', 'Sunk costs explain the past but should not govern the next step.') },
    action: { title: l('Reevalúa desde cero', 'Re-evaluate from zero'), instruction: l('Analiza un compromiso actual como si todavía no hubieras empezado.', 'Analyze a current commitment as if you had not started yet.'), labels: [l('Coste ya irrecuperable', 'Unrecoverable cost'), l('Valor futuro de continuar', 'Future value of continuing'), l('Mejor decisión desde hoy', 'Best decision from today')], artifact: l('Mi decisión sin coste hundido', 'My sunk-cost reset') },
    reward: { title: l('Pasado separado', 'Past separated'), body: l('Tu siguiente decisión ya no necesita justificar la anterior.', 'Your next decision no longer has to justify the previous one.'), xp: 140, petRecovery: 20 },
  },
  {
    slug: 'availability-heuristic', source: sources.availability,
    title: l('Heurística de disponibilidad', 'Availability heuristic'),
    objective: l('Evitar confundir lo fácil de recordar con lo frecuente o probable.', 'Avoid confusing what is easy to recall with what is frequent or likely.'),
    keyConcept: l('Los ejemplos vívidos o recientes vienen a la mente con facilidad y pueden inflar nuestra estimación de probabilidad.', 'Vivid or recent examples come to mind easily and can inflate our estimate of probability.'),
    impact: { eyebrow: l('PSICOLOGÍA 04', 'PSYCHOLOGY 04'), title: l('Recordable no significa probable', 'Memorable does not mean likely'), body: l('Una historia impactante puede dominar cien casos silenciosos. Antes de estimar riesgo, busca una tasa base o una muestra más amplia.', 'One striking story can dominate a hundred quiet cases. Before estimating risk, look for a base rate or a broader sample.'), tacticalRule: l('Pide la tasa base antes de confiar en la anécdota.', 'Ask for the base rate before trusting the anecdote.'), metric: { value: '1', label: l('tasa base antes de una conclusión', 'base rate before a conclusion') } },
    challenge: { prompt: l('Ves dos noticias sobre robos esta semana. ¿Cuál es el siguiente paso más sólido?', 'You see two theft stories this week. What is the soundest next step?'), options: [{ id: 'a', label: l('Asumir que el riesgo se duplicó', 'Assume the risk doubled') }, { id: 'b', label: l('Comparar datos históricos y locales antes de concluir', 'Compare historical and local data before concluding'), correct: true }, { id: 'c', label: l('Compartir las historias para confirmar la impresión', 'Share the stories to confirm the impression') }], correct: l('Buscaste frecuencia real, no facilidad de recuerdo.', 'You looked for actual frequency, not ease of recall.'), incorrect: l('Una historia vívida no revela por sí sola la tasa real.', 'A vivid story does not reveal the real rate by itself.'), explanation: l('Las tasas base corrigen la influencia de ejemplos recientes o dramáticos.', 'Base rates correct the pull of recent or dramatic examples.') },
    action: { title: l('Comprueba la tasa base', 'Check the base rate'), instruction: l('Elige una preocupación reciente y compárala con datos más amplios.', 'Choose a recent concern and compare it with broader data.'), labels: [l('Historia o ejemplo visible', 'Visible story or example'), l('Dato base que necesitas', 'Base-rate data you need'), l('Conclusión revisada', 'Revised conclusion')], artifact: l('Mi chequeo de disponibilidad', 'My availability check') },
    reward: { title: l('Señal sobre ruido', 'Signal over noise'), body: l('Ahora puedes separar una historia memorable de una tendencia real.', 'You can now separate a memorable story from a real trend.'), xp: 150, petRecovery: 22 },
  },
  {
    slug: 'retrieval-practice', source: sources.retrieval,
    title: l('Recordar para aprender', 'Retrieve to learn'),
    objective: l('Usar recuperación activa para fortalecer memoria a largo plazo.', 'Use active retrieval to strengthen long-term memory.'),
    keyConcept: l('Intentar recuperar una idea puede mejorar la retención futura más que releerla repetidamente.', 'Trying to retrieve an idea can improve later retention more than repeatedly rereading it.'),
    impact: { eyebrow: l('PSICOLOGÍA 05', 'PSYCHOLOGY 05'), title: l('La memoria necesita esfuerzo', 'Memory needs effort'), body: l('Releer se siente fluido, pero esa familiaridad puede confundirse con dominio. Cerrar el material y reconstruir la idea revela qué recuerdas y fortalece la ruta.', 'Rereading feels fluent, but that familiarity can be mistaken for mastery. Closing the material and reconstructing the idea reveals what you remember and strengthens the path.'), tacticalRule: l('Cierra, recupera, comprueba y corrige.', 'Close, retrieve, check, and correct.'), metric: { value: '4', label: l('pasos para una revisión activa', 'steps in an active review') } },
    challenge: { prompt: l('Quieres recordar una idea dentro de una semana. ¿Qué práctica es más útil?', 'You want to remember an idea in one week. Which practice is more useful?'), options: [{ id: 'a', label: l('Releerla cinco veces seguidas', 'Reread it five times in a row') }, { id: 'b', label: l('Cerrar el texto, explicarla de memoria y revisar errores', 'Close the text, explain it from memory, and check errors'), correct: true }, { id: 'c', label: l('Subrayar cada frase', 'Highlight every sentence') }], correct: l('La recuperación activa hace visible y entrena la memoria.', 'Active retrieval reveals and trains memory.'), incorrect: l('La familiaridad inmediata no garantiza recuerdo futuro.', 'Immediate familiarity does not guarantee future recall.'), explanation: l('Recuperar sin mirar exige reconstruir la idea y luego corregir huecos.', 'Retrieving without looking requires reconstructing the idea and then correcting gaps.') },
    action: { title: l('Crea una pregunta de memoria', 'Create a retrieval prompt'), instruction: l('Convierte algo que aprendiste hoy en una revisión futura.', 'Turn something you learned today into a future review.'), labels: [l('Idea clave', 'Key idea'), l('Pregunta sin pistas', 'Prompt without clues'), l('Respuesta breve verificable', 'Short checkable answer')], artifact: l('Mi tarjeta de recuperación', 'My retrieval card') },
    reward: { title: l('Memoria entrenada', 'Memory trained'), body: l('Completaste Psicología & Decisiones con una herramienta para seguir recordando.', 'You completed Psychology & Decisions with a tool for continued retention.'), xp: 170, petRecovery: 25 },
  },
] as const;

const psychologyLessons: AtomicLesson[] = mindsetLessons.map((lesson, index) => {
  const content = psychologyLessonContent[index];
  const fields = content.action.labels.map((label, fieldIndex) => ({
    id: ['situation', 'evidence', 'decision'][fieldIndex],
    kind: 'text' as const,
    label,
    placeholder: l('Escribe una respuesta concreta', 'Write a concrete response'),
    minLength: 5,
  }));
  return {
    ...lesson,
    slug: content.slug,
    title: content.title,
    objective: content.objective,
    keyConcept: content.keyConcept,
    sources: [content.source],
    ingestion: { ...lesson.ingestion, sourceIds: [content.source.id] },
    learningDesign: getOrbLearningDesign(lesson.id),
    phases: [
      { type: 'impact', durationSeconds: 45, ...content.impact },
      { type: 'challenge', durationSeconds: 60, title: l('Decide con evidencia', 'Decide with evidence'), challenge: { kind: 'multiple_choice', prompt: content.challenge.prompt, options: [...content.challenge.options], feedback: { correct: content.challenge.correct, incorrect: content.challenge.incorrect, explanation: content.challenge.explanation } } },
      { type: 'action', durationSeconds: 60, title: content.action.title, widget: { engine: 'control_filter', title: content.action.title, instruction: content.action.instruction, fields, resultLabel: l('Herramienta lista', 'Tool ready'), artifactTitle: content.action.artifact, commitLabel: l('Guardar herramienta', 'Save tool') } },
      { type: 'reward', durationSeconds: 15, ...content.reward },
    ],
  };
});

const perfLessons: AtomicLesson[] = [
  makeLesson({
    id: 'learn-perf-01', trackId: 'peak-performance', order: 1, slug: 'deep-work-advantage', competency: 'operations', difficulty: 'easy', prerequisiteIds: [], source: sources.newport,
    title: l('Deep Work: la ventaja injusta', 'Deep Work: the unfair advantage'), objective: l('Diseñar un bloque diario de foco extremo sin distracciones.', 'Design a daily block of extreme focus with zero distractions.'), keyConcept: l('La habilidad de concentrarse intensamente sin interrupción es cada vez más rara y más valiosa.', 'The ability to focus intensely without distraction is becoming increasingly rare and valuable.'),
    impact: { eyebrow: l('RENDIMIENTO 01', 'PERFORMANCE 01'), title: l('El precio del residuo de atención', 'The price of attention residue'), body: l('Mirar tu móvil 10 segundos deja un residuo mental que dura 20 minutos. El trabajo profundo produce en 90 minutos lo que a otros les toma una semana dispersa.', 'Glancing at your phone for 10 seconds leaves mental residue for 20 minutes. Deep work produces in 90 minutes what takes others a scattered week.'), tacticalRule: l('90 minutos continuos de foco monje cada mañana sin notificaciones.', '90 continuous minutes of monk focus every morning with zero notifications.'), metric: { value: '90 min', label: l('de oro cognitivo diario', 'of daily cognitive gold') } },
    challenge: { title: l('Elige la sesión profunda', 'Choose the deep session'), challenge: { kind: 'multiple_choice', prompt: l('¿Qué bloque produce mayor valor analítico y creativo?', 'Which block produces higher analytical and creative value?'), options: [
      { id: 'a', label: l('4 horas con WhatsApp abierto respondiendo dudas sobre la marcha', '4 hours with WhatsApp open answering pings on the fly') }, { id: 'b', label: l('90 minutos en modo avión trabajando en un solo documento clave', '90 minutes in airplane mode working on one key deliverable'), correct: true }, { id: 'c', label: l('6 horas navegando foros buscando inspiración', '6 hours browsing forums looking for inspiration') },
    ], feedback: { correct: l('La intensidad ininterrumpida multiplica el resultado.', 'Unbroken intensity multiplies output.'), incorrect: l('La interrupción frecuente destruye la profundidad cognitiva.', 'Frequent interruptions destroy cognitive depth.'), explanation: l('El valor de alto impacto requiere inmersión absoluta.', 'High-impact value requires absolute immersion.') } } },
    action: { title: l('Programa tu bloque', 'Schedule your block'), widget: { engine: 'focus_block', title: l('Bloque de Trabajo Profundo', 'Deep Work Block'), instruction: l('Fija tu sesión de concentración de mañana.', 'Set tomorrow’s concentration session.'), fields: [
      { id: 'minutes', kind: 'range', label: l('Minutos de foco', 'Focus minutes'), min: 30, max: 120, step: 15, defaultValue: 90 }, { id: 'distraction', kind: 'text', label: l('Distracción a eliminar', 'Distraction to eliminate'), placeholder: l('Teléfono en otra habitación y Slack cerrado', 'Phone in another room and Slack closed'), minLength: 5 }, { id: 'goal', kind: 'text', label: l('Único entregable de la sesión', 'Single session deliverable'), placeholder: l('Redactar la propuesta de venta completa', 'Draft the complete sales proposal'), minLength: 5 },
    ], resultLabel: l('Bloque blindado', 'Block shielded'), artifactTitle: l('Mi bloque Deep Work', 'My Deep Work block'), commitLabel: l('Guardar bloque', 'Save block') } },
    reward: { title: l('Foco activado', 'Focus activated'), body: l('Mañana tu mañana será un santuario de ejecución.', 'Tomorrow your morning will be a sanctuary of execution.'), xp: 120, petRecovery: 18 },
  }),
  makeLesson({
    id: 'learn-perf-02', trackId: 'peak-performance', order: 2, slug: 'friction-atomic-habits', competency: 'operations', difficulty: 'easy', prerequisiteIds: ['learn-perf-01'], source: sources.clear,
    title: l('Fricción y hábitos atómicos', 'Friction and atomic habits'), objective: l('Rediseñar el entorno para que lo productivo sea inevitable.', 'Redesign the environment so productivity is inevitable.'), keyConcept: l('No dependas de la fuerza de voluntad; diseña la fricción de tu espacio.', 'Do not rely on willpower; engineer your environment’s friction.'),
    impact: { eyebrow: l('RENDIMIENTO 02', 'PERFORMANCE 02'), title: l('La física del comportamiento humano', 'The physics of human behavior'), body: l('Hacer fácil lo bueno y casi imposible lo malo. Si el libro está abierto en tu mesa, lo lees. Si el teléfono está en un cajón con candado, trabajas.', 'Make the good easy and the bad nearly impossible. If the book is open on your desk, you read. If the phone is locked away, you work.'), tacticalRule: l('Regla de los 2 minutos: empieza tan pequeño que sea imposible decir que no.', '2-Minute Rule: start so small it is impossible to say no.'), metric: { value: '2 min', label: l('para iniciar cualquier hábito nuevo', 'to initiate any new habit') } },
    challenge: { title: l('Aplica ingeniería de fricción', 'Apply friction engineering'), challenge: { kind: 'matching', prompt: l('Conecta el hábito deseado con la reducción de fricción correcta.', 'Connect the desired habit with the right friction reduction.'), pairs: [
      { id: 'read', left: l('Leer 20 páginas al despertar', 'Read 20 pages upon waking'), right: l('Poner el libro sobre la almohada la noche anterior', 'Place the book on the pillow the night before') }, { id: 'focus', left: l('Eliminar scroll matutino', 'Kill morning scrolling'), right: l('Cargar el móvil en la cocina fuera del dormitorio', 'Charge phone in the kitchen away from bedroom') }, { id: 'exercise', left: l('Hacer 20 min de ejercicio', 'Do 20 min exercise'), right: l('Dejar ropa deportiva lista junto a la cama', 'Leave workout gear ready next to bed') },
    ], feedback: { correct: l('El entorno decide tu acción antes que la mente.', 'Surroundings decide action before the conscious mind.'), incorrect: l('Elige el cambio físico que reduce pasos al hábito.', 'Choose the physical tweak reducing steps to the habit.'), explanation: l('Los mejores hábitos son consecuencias del diseño del entorno.', 'Elite habits are direct results of environment design.') } } },
    action: { title: l('Ingenia tu entorno', 'Engineer your space'), widget: { engine: 'focus_block', title: l('Ajuste de fricción', 'Friction tune'), instruction: l('Elimina fricción de un hábito clave.', 'Eliminate friction from a key habit.'), fields: [
      { id: 'minutes', kind: 'range', label: l('Tiempo diario del hábito', 'Daily habit time'), min: 5, max: 60, step: 5, defaultValue: 15 }, { id: 'distraction', kind: 'text', label: l('Fricción a añadir al mal hábito', 'Friction to add to bad habit'), placeholder: l('Cerrar sesión y desinstalar apps de ocio', 'Log out and delete entertainment apps'), minLength: 5 }, { id: 'goal', kind: 'text', label: l('Fricción a quitar al buen hábito', 'Friction to remove from good habit'), placeholder: l('Dejar el documento y pestañas listas la noche anterior', 'Leave doc and tabs opened the night before'), minLength: 5 },
    ], resultLabel: l('Espacio rediseñado', 'Space redesigned'), artifactTitle: l('Mi diseño de fricción', 'My friction design'), commitLabel: l('Guardar diseño', 'Save design') } },
    reward: { title: l('Entorno invencible', 'Invincible space'), body: l('Tu espacio ahora trabaja a favor de tus metas.', 'Your space now pulls you toward your goals.'), xp: 130, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-perf-03', trackId: 'peak-performance', order: 3, slug: 'circadian-energy', competency: 'operations', difficulty: 'medium', prerequisiteIds: ['learn-perf-02'], source: sources.newport,
    title: l('Energía circadiana y dopamina', 'Circadian energy and dopamine'), objective: l('Calibrar la química cerebral para evitar el colapso de energía de la tarde.', 'Calibrate brain chemistry to prevent the afternoon slump.'), keyConcept: l('La luz solar matutina y retrasar la cafeína 90 minutos optimizan tu energía celular.', 'Morning sunlight and delaying caffeine 90 minutes optimize cellular energy.'),
    impact: { eyebrow: l('RENDIMIENTO 03', 'PERFORMANCE 03'), title: l('Neurobiología del rendimiento', 'Neurobiology of performance'), body: l('Tomar café inmediatamente al despertar bloquea la eliminación natural de adenosina, provocando el desplome de las 3:00 PM. 10 minutos de sol al amanecer fijan tu reloj biológico.', 'Drinking coffee instantly upon waking blocks adenosine clearance, triggering the 3:00 PM crash. 10 min of morning sun sets your master clock.'), tacticalRule: l('Sol en los ojos al despertar + café 90 min después.', 'Morning sun in eyes + coffee 90 min later.'), metric: { value: '90 min', label: l('de espera antes del primer café', 'wait before first cup of coffee') } },
    challenge: { title: l('Secuencia matutina biológica', 'Biological morning sequence'), challenge: { kind: 'ordering', prompt: l('Ordena la secuencia matutina para máxima energía sostenible.', 'Order the morning sequence for maximum sustainable energy.'), options: [
      { id: 'sun', label: l('10 min de luz solar natural en los ojos', '10 min of natural sunlight in eyes') }, { id: 'water', label: l('Hidratación con agua y minerales', 'Hydration with water and electrolytes') }, { id: 'coffee', label: l('Café tras 90 min de estar despierto', 'Coffee after 90 min awake') },
    ], orderedIds: ['water', 'sun', 'coffee'], feedback: { correct: l('Hidratación, sol y luego cafeína optimizan adenosina.', 'Hydration, sun, then caffeine optimize adenosine.'), incorrect: l('El café temprano sabotea tu energía de la tarde.', 'Early coffee sabotages your afternoon stamina.'), explanation: l('Esta secuencia previene el bajón vespertino.', 'This sequence prevents the afternoon crash.') } } },
    action: { title: l('Protocolo circadiano', 'Circadian protocol'), widget: { engine: 'focus_block', title: l('Rutina biológica matutina', 'Biological morning routine'), instruction: l('Configura tu protocolo de despertar.', 'Configure your wake-up protocol.'), fields: [
      { id: 'minutes', kind: 'range', label: l('Minutos de sol matutino', 'Morning sun minutes'), min: 5, max: 30, step: 5, defaultValue: 10 }, { id: 'distraction', kind: 'text', label: l('Regla de cafeína', 'Caffeine rule'), placeholder: l('Esperar 90 minutos tras despertar', 'Wait 90 minutes after waking'), minLength: 5 }, { id: 'goal', kind: 'text', label: l('Horario fijo de acostarse', 'Target sleep time'), placeholder: l('Luces tenues a las 10:00 PM', 'Dim lights at 10:00 PM'), minLength: 5 },
    ], resultLabel: l('Biología calibrada', 'Biology calibrated'), artifactTitle: l('Mi protocolo circadiano', 'My circadian protocol'), commitLabel: l('Guardar rutina', 'Save routine') } },
    reward: { title: l('Química optimizada', 'Chemistry optimized'), body: l('Tu energía ahora será estable de sol a sol.', 'Your energy will now remain stable all day.'), xp: 140, petRecovery: 20 },
  }),
  makeLesson({
    id: 'learn-perf-04', trackId: 'peak-performance', order: 4, slug: 'ultradian-rhythms', competency: 'operations', difficulty: 'medium', prerequisiteIds: ['learn-perf-03'], source: sources.newport,
    title: l('Gestión de energía vs. tiempo', 'Energy vs time management'), objective: l('Alinear las tareas más difíciles con los picos de ritmo ultradiano.', 'Align hardest tasks with ultradian biological peaks.'), keyConcept: l('El cerebro no rinde de forma plana; opera en ciclos biológicos de 90 minutos de esfuerzo y 15 de reposo.', 'The brain does not work linearly; it operates in 90-minute effort and 15-minute reset waves.'),
    impact: { eyebrow: l('RENDIMIENTO 04', 'PERFORMANCE 04'), title: l('No todos los minutos valen lo mismo', 'Not all minutes are equal'), body: l('Una hora con la mente fresca vale por 5 horas agotadas. Gestionar el calendario sin respetar la curva fisiológica es la causa número uno de fatiga ejecutiva.', 'One fresh hour equals 5 exhausted hours. Managing calendars without respecting physiology is the number one cause of executive burnout.'), tacticalRule: l('Pon tu tarea maestra en tu pico biológico; lo reactivo va al valle.', 'Put your master task in your peak; put admin chores in the valley.'), metric: { value: '90/15', label: l('minutos de foco y recuperación activa', 'minutes of focus and active reset') } },
    challenge: { title: l('Asignación de tareas', 'Task allocation'), challenge: { kind: 'multiple_choice', prompt: l('¿Cuándo debes agendar tu tarea más compleja del día?', 'When should you schedule your day’s most complex task?'), options: [
      { id: 'a', label: l('Al final de la tarde después de contestar todos los emails', 'Late afternoon after answering all emails') }, { id: 'b', label: l('En tu pico ultradiano matutino antes de cualquier distracción', 'In your morning ultradian peak before any distraction'), correct: true }, { id: 'c', label: l('Durante la comida', 'During lunch') },
    ], feedback: { correct: l('El capital cognitivo fresco se invierte en lo prioritario.', 'Fresh cognitive capital must fund your top priority.'), incorrect: l('Dejar lo difícil para el final garantiza mediocridad o postergación.', 'Leaving hard work for last ensures fatigue or delay.'), explanation: l('Protege tu primer bloque como el activo más valioso de tu empresa.', 'Protect your first block as your company’s top asset.') } } },
    action: { title: l('Asigna tus bloques', 'Assign your blocks'), widget: { engine: 'focus_block', title: l('Mapeo ultradiano', 'Ultradian mapping'), instruction: l('Separa tu tarea de alto impacto de lo reactivo.', 'Separate your needle-mover from reactive noise.'), fields: [
      { id: 'minutes', kind: 'range', label: l('Duración del bloque rey', 'King block duration'), min: 60, max: 120, step: 15, defaultValue: 90 }, { id: 'distraction', kind: 'text', label: l('Tarea maestra (alta energía)', 'Master task (high energy)'), placeholder: l('Escribir la propuesta comercial o código core', 'Write sales proposal or core code'), minLength: 5 }, { id: 'goal', kind: 'text', label: l('Tarea reactiva (baja energía)', 'Reactive task (low energy)'), placeholder: l('Responder emails y archivar facturas a las 4 PM', 'Answer emails and file invoices at 4 PM'), minLength: 5 },
    ], resultLabel: l('Mapa ultradiano', 'Ultradian map'), artifactTitle: l('Mi mapa de energía', 'My energy map'), commitLabel: l('Guardar bloques', 'Save blocks') } },
    reward: { title: l('Picos conquistados', 'Peaks conquered'), body: l('Ahora tu esfuerzo multiplica su impacto.', 'Now your effort multiplies its impact.'), xp: 150, petRecovery: 22 },
  }),
  makeLesson({
    id: 'learn-perf-05', trackId: 'peak-performance', order: 5, slug: 'shutdown-protocol', competency: 'operations', difficulty: 'hard', prerequisiteIds: ['learn-perf-04'], source: sources.newport,
    title: l('El protocolo de apagado diario', 'Daily shutdown protocol'), objective: l('Desconectar la mente del trabajo y erradicar el efecto Zeigarnik.', 'Disconnect mind from work and eradicate the Zeigarnik effect.'), keyConcept: l('Las tareas sin cerrar consumen memoria de fondo a menos que las anotes con un plan para mañana.', 'Unclosed loops drain background memory unless captured with a dated plan for tomorrow.'),
    impact: { eyebrow: l('RENDIMIENTO 05', 'PERFORMANCE 05'), title: l('El descanso profundo es parte del trabajo', 'Deep rest is part of work'), body: l('El cerebro no puede reparar sinapsis si sigues rumiando correos a las 11:00 PM. Cerrar tu libreta y declarar el fin de la jornada le devuelve la paz a tu mente.', 'The brain cannot restore synapses if you ruminate on email at 11:00 PM. Closing your notepad and declaring day’s end restores peace.'), tacticalRule: l('Revisión final de pendientes + plan para mañana + frase de cierre.', 'Final loose loops check + tomorrow’s plan + shutdown phrase.'), metric: { value: '100%', label: l('desconexión para una recuperación real', 'disconnection for true recovery') } },
    challenge: { title: l('Desactiva el efecto Zeigarnik', 'Kill Zeigarnik effect'), challenge: { kind: 'multiple_choice', prompt: l('¿Por qué el cerebro sigue estresado tras salir del trabajo?', 'Why does the brain stay stressed after leaving work?'), options: [
      { id: 'a', label: l('Porque no cerraste formalmente las tareas pendientes con un plan explícito', 'Because you did not formally capture pending tasks with an explicit plan'), correct: true }, { id: 'b', label: l('Porque no trabajó suficientes horas', 'Because you did not work enough hours') }, { id: 'c', label: l('Por el café tomado hace 8 horas', 'Because of coffee from 8 hours ago') },
    ], feedback: { correct: l('El cerebro mantiene vivas las tareas hasta que las ve aseguradas.', 'The brain loops tasks until it sees them secured.'), incorrect: l('El bucle no es de tiempo, sino de incertidumbre abierta.', 'The loop is not time; it is open ambiguity.'), explanation: l('El ritual de cierre le da permiso al sistema nervioso para relajarse.', 'The shutdown ritual grants the nervous system permission to relax.') } } },
    action: { title: l('Ejecuta el ritual', 'Execute the ritual'), widget: { engine: 'focus_block', title: l('Ritual de Apagado', 'Shutdown Ritual'), instruction: l('Crea tu orden de cierre diario.', 'Create your daily shutdown command.'), fields: [
      { id: 'minutes', kind: 'range', label: l('Minutos para el ritual', 'Ritual minutes'), min: 5, max: 20, step: 5, defaultValue: 10 }, { id: 'distraction', kind: 'text', label: l('Lista de pendientes de mañana', 'Tomorrow’s top 3 tasks'), placeholder: l('1. Llamada cliente 2. Enviar oferta 3. Revisión', '1. Client call 2. Send offer 3. Review'), minLength: 5 }, { id: 'goal', kind: 'text', label: l('Frase o comando de cierre', 'Shutdown phrase'), placeholder: l('Día completado. Cierro la máquina.', 'Day complete. Shutting down.'), minLength: 5 },
    ], resultLabel: l('Ritual fijado', 'Ritual locked'), artifactTitle: l('Mi protocolo de cierre', 'My shutdown protocol'), commitLabel: l('Guardar protocolo', 'Save protocol') } },
    reward: { title: l('Rendimiento supremo', 'Supreme performance'), body: l('Has completado la maestría de Rendimiento & Foco.', 'You completed Peak Performance & Focus mastery.'), xp: 170, petRecovery: 25 },
  }),
];

const dataScienceLessons: AtomicLesson[] = [
  makeLesson({
    id: 'learn-data-01', trackId: 'data-science', order: 1, slug: 'signal-vs-noise', competency: 'ai', difficulty: 'easy', prerequisiteIds: [], source: sources.silver,
    title: l('Señal vs. Ruido en Datos', 'Signal vs Noise in Data'),
    objective: l('Aprender a distinguir patrones causales reales de coincidencias aleatorias.', 'Distinguish real causal patterns from random noise.'),
    keyConcept: l('Correlación no es causalidad; buscar patrones sin mecanismo causal observable genera falsas predicciones.', 'Correlation is not causation; seeking patterns without observable causal mechanisms breeds false predictions.'),
    impact: {
      eyebrow: l('DATA SCIENCE 01', 'DATA SCIENCE 01'),
      title: l('La trampa de ver patrones en el azar', 'The trap of seeing patterns in randomness'),
      body: l('El cerebro humano busca significado desesperadamente. Si comparas suficientes variables, encontrarás correlaciones del 99% que son puro ruido (como el consumo de queso y muertes en sábanas). Sin un mecanismo causal, tu modelo fracasará en producción.', 'The human brain desperately looks for patterns. If you compare enough variables, you will find 99% correlations that are pure noise. Without a causal mechanism, your model will fail in production.'),
      tacticalRule: l('Nunca asumas causalidad sin un mecanismo explicable y una prueba de control.', 'Never assume causation without an explainable mechanism and a control test.'),
      metric: { value: '99%', label: l('de falsas correlaciones desaparecen al testear causalidad', 'of spurious correlations vanish upon causal testing') },
    },
    challenge: {
      title: l('Detecta el falso patrón', 'Spot the false pattern'),
      challenge: {
        kind: 'error_detection',
        prompt: l('Una tienda descubre que las ventas de helados correlacionan al 95% con los ataques de tiburón en la costa. ¿Cuál es el error?', 'A retailer finds ice cream sales correlate 95% with shark attacks at the beach. What is the error?'),
        options: [
          { id: 'a', label: l('Confundir correlación con causalidad: una tercera variable (el calor de verano) causa ambas', 'Confusing correlation with causation: a third variable (summer heat) drives both'), correct: true },
          { id: 'b', label: l('El tamaño de muestra de los helados fue insuficiente', 'Sample size of ice creams was insufficient') },
          { id: 'c', label: l('Los tiburones prefieren personas que comen helado', 'Sharks prefer people who eat ice cream') },
        ],
        feedback: {
          correct: l('¡Exacto! El calor de verano es la variable confusora común.', 'Correct! Summer heat is the confounding variable.'),
          incorrect: l('Cuidado con las correlaciones espurias.', 'Watch out for spurious correlations.'),
          explanation: l('Sin mecanismo causal directo, correlación no predice nada cuando las condiciones cambian.', 'Without a direct causal mechanism, correlation predicts nothing when conditions change.'),
        },
      },
    },
    action: {
      title: l('Filtra la señal del ruido', 'Filter signal from noise'),
      widget: {
        engine: 'data_signal_filter',
        title: l('Auditor de Causalidad', 'Causality Auditor'),
        instruction: l('Evalúa una hipótesis de datos verificando mecanismo y variable confusora.', 'Audit a data hypothesis by testing mechanism and confounding variables.'),
        fields: [
          { id: 'correlation', kind: 'text', label: l('Correlación observada', 'Observed correlation'), placeholder: l('Los usuarios que usan modo oscuro compran 20% más', 'Dark mode users buy 20% more'), minLength: 5 },
          { id: 'confounder', kind: 'text', label: l('Posible variable oculta (confusora)', 'Potential confounding variable'), placeholder: l('Usuarios técnicos más pudientes activan modo oscuro', 'Tech-savvy higher-income users toggle dark mode'), minLength: 5 },
          { id: 'experiment', kind: 'text', label: l('Prueba de control causal', 'Causal control test'), placeholder: l('Forzar aleatoriamente modo oscuro a 50% de nuevos usuarios', 'Randomly force dark mode on 50% of new users'), minLength: 5 },
        ],
        resultLabel: l('Hipótesis auditada', 'Audited hypothesis'),
        artifactTitle: l('Mi filtro causal', 'My causal filter'),
        commitLabel: l('Guardar filtro', 'Save filter'),
      },
    },
    reward: {
      title: l('Pensamiento analítico desbloqueado', 'Analytical thinking unlocked'),
      body: l('Has blindado tu análisis contra correlaciones falsas.', 'You have armored your analysis against spurious correlation.'),
      xp: 120,
      petRecovery: 18,
    },
  }),
  makeLesson({
    id: 'learn-data-02', trackId: 'data-science', order: 2, slug: 'north-star-metric', competency: 'ai', difficulty: 'easy', prerequisiteIds: ['learn-data-01'], source: sources.googleDS,
    title: l('Métricas North Star vs. Vanidad', 'North Star vs Vanity Metrics'),
    objective: l('Definir la métrica única que captura valor real entregado al usuario.', 'Define the single metric capturing core value delivered to users.'),
    keyConcept: l('Las métricas de vanidad (visitas, descargas) inflan el ego; la North Star mide el intercambio real de valor y retención.', 'Vanity metrics stroke the ego; the North Star measures actual value exchange and retention.'),
    impact: {
      eyebrow: l('DATA SCIENCE 02', 'DATA SCIENCE 02'),
      title: l('Tus visitas suben mientras tu negocio quiebra', 'Traffic grows while your business goes broke'),
      body: l('Celebrar 100,000 descargas no sirve si el 98% abandona la app al segundo día. Una métrica North Star mide la frecuencia con la que el usuario experimenta el "momento ajá". En Airbnb no son visitas, son noches reservadas. En Spotify, minutos escuchados.', 'Celebrating 100,000 downloads means nothing if 98% churn on day 2. A North Star measures how often users experience the "aha moment". In Airbnb it is not pageviews, it is nights booked. In Spotify, minutes listened.'),
      tacticalRule: l('Mide valor recibido por el cliente, no actividad superficial.', 'Measure value received by the client, not superficial activity.'),
      metric: { value: '1', label: l('métrica central que alinea producto, marketing y data', 'central metric aligning product, marketing, and data') },
    },
    challenge: {
      title: l('Detecta la métrica de vanidad', 'Identify vanity metric'),
      challenge: {
        kind: 'multiple_choice',
        prompt: l('Para una plataforma de cursos online, ¿cuál es la mejor métrica North Star?', 'For an online learning platform, which is the best North Star metric?'),
        options: [
          { id: 'a', label: l('Total de visitas a la página de inicio acumuladas', 'Cumulative homepage pageviews') },
          { id: 'b', label: l('Estudiantes que completan al menos 3 lecciones por semana', 'Students who complete at least 3 lessons per week'), correct: true },
          { id: 'c', label: l('Número de cuentas registradas en los últimos 5 años', 'Number of signups registered over last 5 years') },
        ],
        feedback: {
          correct: l('¡Correcto! Mide retención y valor educativo recurrente.', 'Correct! Measures recurring retention and educational value.'),
          incorrect: l('Las métricas acumulativas jamás bajan y ocultan el abandono.', 'Cumulative metrics never drop and hide churn.'),
          explanation: l('Completar lecciones mide el beneficio real que justifica que el usuario siga suscrito.', 'Completing lessons measures the actual benefit retaining the subscriber.'),
        },
      },
    },
    action: {
      title: l('Diseña tu métrica North Star', 'Design your North Star metric'),
      widget: {
        engine: 'north_star_builder',
        title: l('Constructor de North Star', 'North Star Architect'),
        instruction: l('Define tu momento clave de valor y la frecuencia de uso.', 'Define core value moment and retention frequency.'),
        fields: [
          { id: 'product', kind: 'text', label: l('Producto o servicio', 'Product or service'), placeholder: l('App de productividad y tareas', 'Productivity & task app'), minLength: 5 },
          { id: 'valueMoment', kind: 'text', label: l('Momento de valor (Aha Moment)', 'Value moment (Aha Moment)'), placeholder: l('Completar la primera lista diaria de 3 tareas', 'Completing daily 3-task priority list'), minLength: 5 },
          { id: 'frequency', kind: 'select', label: l('Frecuencia de éxito', 'Success cadence'), defaultValue: 'weekly', options: [{ value: 'daily', label: l('Diaria (DAU)', 'Daily (DAU)') }, { value: 'weekly', label: l('Semanal (WAU)', 'Weekly (WAU)') }, { value: 'monthly', label: l('Mensual (MAU)', 'Monthly (MAU)') }] },
        ],
        resultLabel: l('Métrica North Star definida', 'North Star metric defined'),
        artifactTitle: l('Mi métrica North Star', 'My North Star metric'),
        commitLabel: l('Fijar métrica', 'Lock metric'),
      },
    },
    reward: {
      title: l('Brújula fijada', 'Compass locked'),
      body: l('Ahora todo tu equipo sabe qué número mueve la aguja.', 'Now your entire team knows what metric moves the needle.'),
      xp: 130,
      petRecovery: 20,
    },
  }),
  makeLesson({
    id: 'learn-data-03', trackId: 'data-science', order: 3, slug: 'ab-testing-rigor', competency: 'ai', difficulty: 'medium', prerequisiteIds: ['learn-data-02'], source: sources.googleDS,
    title: l('A/B Testing sin Autoengaño', 'A/B Testing without Self-Deception'),
    objective: l('Calcular tamaño de muestra y evitar el problema del espía (peeking problem).', 'Calculate sample size and avoid the peeking problem.'),
    keyConcept: l('Revisar experimentos a diario y detenerlos temprano infla los falsos positivos hasta un 30%. Se requiere significancia estadística real.', 'Peeking at experiments daily and stopping early inflates false positives up to 30%. True statistical significance is required.'),
    impact: {
      eyebrow: l('DATA SCIENCE 03', 'DATA SCIENCE 03'),
      title: l('El sesgo del espía arruina tus experimentos', 'The peeking problem ruins your tests'),
      body: l('Si lanzas una moneda 10 veces y sale cara 7 veces, ¿la moneda está trucada? No, es varianza. En A/B testing, mirar el gráfico el día 2 y declarar ganador a la variante B es tirar dinero. Debes precalcular la muestra y esperar a p < 0.05.', 'If you flip a coin 10 times and get 7 heads, is it rigged? No, it is variance. In A/B testing, peeking on day 2 and declaring variation B the winner is burning money. You must precalculate sample size and wait for p < 0.05.'),
      tacticalRule: l('Nunca toques un test A/B hasta alcanzar el 100% de la muestra calculada.', 'Never touch an A/B test until reaching 100% of the calculated sample size.'),
      metric: { value: 'p < 0.05', label: l('umbral estándar de significancia estadística', 'standard statistical significance threshold') },
    },
    challenge: {
      title: l('Regla de parada en A/B testing', 'A/B stopping rule'),
      challenge: {
        kind: 'multiple_choice',
        prompt: l('En el día 3 de un test A/B con 100 visitas, la versión B convierte al 25% y la A al 10%. ¿Qué debes hacer?', 'On day 3 with 100 visitors, version B converts at 25% and A at 10%. What should you do?'),
        options: [
          { id: 'a', label: l('Dejar que el test corra hasta alcanzar el tamaño de muestra precalculado (ej. 2,000 visitas)', 'Let the test run until reaching the precalculated sample size (e.g. 2,000 visitors)'), correct: true },
          { id: 'b', label: l('Detener el test inmediatamente y aplicar la variante B a toda la web', 'Stop test immediately and roll out variation B to entire site') },
          { id: 'c', label: l('Cambiar el texto de la variante B para que mejore aún más', 'Tweak text of B to improve it even further mid-test') },
        ],
        feedback: {
          correct: l('¡Impecable! Con 100 visitas el error estándar es enorme.', 'Flawless! With 100 visits standard error is huge.'),
          incorrect: l('Detener temprano es la causa #1 de falsos positivos en analítica.', 'Early stopping is the #1 cause of false positives in analytics.'),
          explanation: l('La varianza inicial engaña. Solo el tamaño de muestra completo garantiza poder estadístico.', 'Early variance deceives. Only full sample size guarantees statistical power.'),
        },
      },
    },
    action: {
      title: l('Calcula tu test A/B', 'Calculate your A/B test'),
      widget: {
        engine: 'ab_test_calc',
        title: l('Calculadora de Muestra A/B', 'A/B Sample Size Calculator'),
        instruction: l('Determina cuántos visitantes necesitas para detectar una mejora real.', 'Calculate sample size needed to detect true conversion lift.'),
        fields: [
          { id: 'baselineRate', kind: 'range', label: l('Conversión actual (%)', 'Baseline conversion rate (%)'), min: 1, max: 20, step: 0.5, defaultValue: 5, unit: l('%', '%') },
          { id: 'mde', kind: 'range', label: l('Efecto mínimo detectable (MDE %)', 'Min detectable effect (MDE %)'), min: 5, max: 50, step: 5, defaultValue: 20, unit: l('%', '%') },
          { id: 'dailyTraffic', kind: 'range', label: l('Tráfico diario estimado', 'Estimated daily traffic'), min: 50, max: 5000, step: 50, defaultValue: 500, unit: l('visitas', 'visits') },
        ],
        resultLabel: l('Muestra requerida y días de test', 'Required sample & test duration'),
        artifactTitle: l('Mi protocolo de test A/B', 'My A/B test protocol'),
        commitLabel: l('Fijar test', 'Lock test'),
      },
    },
    reward: {
      title: l('Rigor científico dominado', 'Scientific rigor mastered'),
      body: l('Tus experimentos ahora producen certezas, no ilusiones estadísticas.', 'Your tests now produce certainty, not statistical mirages.'),
      xp: 140,
      petRecovery: 20,
    },
  }),
  makeLesson({
    id: 'learn-data-04', trackId: 'data-science', order: 4, slug: 'overfitting-vs-generalization', competency: 'ai', difficulty: 'medium', prerequisiteIds: ['learn-data-03'], source: sources.googleDS,
    title: l('Overfitting: Memorizar vs. Predecir', 'Overfitting: Memorizing vs Predicting'),
    objective: l('Evitar que tus modelos predictivos memoricen el pasado y fallen en el presente.', 'Prevent predictive models from memorizing historical noise.'),
    keyConcept: l('El sobreajuste ocurre cuando un modelo es tan complejo que memoriza el ruido de entrenamiento. La solución es simplificar y usar cross-validation.', 'Overfitting happens when a model is so complex it memorizes training noise. The remedy is simplicity and cross-validation.'),
    impact: {
      eyebrow: l('DATA SCIENCE 04', 'DATA SCIENCE 04'),
      title: l('99% de precisión en tu laptop, 0% en la vida real', '99% accuracy on your laptop, 0% in the real world'),
      body: l('Un estudiante que memoriza las preguntas del simulacro sacará un 100, pero reprobará el examen real con preguntas nuevas. En ciencia de datos, un modelo sobreajustado parece un milagro en el notebook de entrenamiento, pero quiebra tu negocio cuando entran clientes reales.', 'A student who memorizes practice quiz answers scores 100, but fails the real exam with new questions. In data science, an overfitted model looks miraculous in the training notebook, but bankrupts your business with fresh real-world users.'),
      tacticalRule: l('Divide tus datos: 80% entrenamiento y 20% prueba ciega (holdout test set).', 'Split your data: 80% training and 20% blind holdout test set.'),
      metric: { value: '80 / 20', label: l('partición de oro entre entrenamiento y validación ciega', 'golden split between training and blind holdout test') },
    },
    challenge: {
      title: l('Diagnostica el modelo', 'Diagnose the model'),
      challenge: {
        kind: 'error_detection',
        prompt: l('Tu modelo de churn tiene 99.8% de precisión en los datos de 2024, pero solo 51% cuando predice usuarios de 2025. ¿Qué está sucediendo?', 'Your churn model has 99.8% accuracy on 2024 data, but drops to 51% on 2025 users. What is happening?'),
        options: [
          { id: 'a', label: l('Sobreajuste severo (overfitting): memorizó el ruido del dataset 2024 en vez de patrones generales', 'Severe overfitting: memorized 2024 dataset noise instead of generalizable patterns'), correct: true },
          { id: 'b', label: l('Falta de potencia en el procesador de la computadora', 'Lack of CPU power on the machine') },
          { id: 'c', label: l('El modelo necesita 500 parámetros adicionales más complejos', 'The model needs 500 additional complex parameters') },
        ],
        feedback: {
          correct: l('¡Identificado! Rendimiento dispar entre train y test es la firma clásica de overfitting.', 'Identified! Divergence between train and test is the classic fingerprint of overfitting.'),
          incorrect: l('Añadir más complejidad empeoraría el sobreajuste.', 'Adding complexity makes overfitting worse.'),
          explanation: l('Regularización, menos variables irrelevantes y validación cruzada resuelven este dilema.', 'Regularization, feature reduction, and cross-validation cure this problem.'),
        },
      },
    },
    action: {
      title: l('Audita el sobreajuste', 'Audit overfitting'),
      widget: {
        engine: 'overfitting_check',
        title: l('Scanner de Sesgo y Varianza', 'Bias-Variance Scanner'),
        instruction: l('Compara el rendimiento en entrenamiento vs prueba y calcula la brecha de generalización.', 'Compare train vs test metrics to measure generalization gap.'),
        fields: [
          { id: 'trainAccuracy', kind: 'range', label: l('Precisión en Entrenamiento (Train %)', 'Train accuracy (%)'), min: 50, max: 100, step: 1, defaultValue: 98, unit: l('%', '%') },
          { id: 'testAccuracy', kind: 'range', label: l('Precisión en Prueba Ciega (Test %)', 'Test holdout accuracy (%)'), min: 40, max: 100, step: 1, defaultValue: 62, unit: l('%', '%') },
          { id: 'featureCount', kind: 'range', label: l('Número de variables/parámetros', 'Feature/variable count'), min: 2, max: 100, step: 2, defaultValue: 48, unit: l('variables', 'features') },
        ],
        resultLabel: l('Diagnóstico de generalización', 'Generalization diagnosis'),
        artifactTitle: l('Mi informe de validación cruzada', 'My cross-validation report'),
        commitLabel: l('Guardar auditoría', 'Save audit'),
      },
    },
    reward: {
      title: l('Modelos robustos', 'Robust models'),
      body: l('Tus sistemas predictivos ahora resistirán las sorpresas del mundo real.', 'Your predictive systems will now withstand real-world surprises.'),
      xp: 150,
      petRecovery: 22,
    },
  }),
  makeLesson({
    id: 'learn-data-05', trackId: 'data-science', order: 5, slug: 'decision-driven-analytics', competency: 'ai', difficulty: 'hard', prerequisiteIds: ['learn-data-04'], source: sources.googleDS,
    title: l('Decision-Driven Analytics', 'Decision-Driven Analytics'),
    objective: l('Convertir reportes pasivos en reglas de decisión binarias con impacto económico directo.', 'Transform passive reports into binary decision rules with direct economic impact.'),
    keyConcept: l('La analítica solo genera valor si altera una decisión antes de ejecutarla. Fija umbrales de acción antes de consultar los números.', 'Analytics only creates value if it alters a decision before execution. Fix action thresholds before consulting numbers.'),
    impact: {
      eyebrow: l('DATA SCIENCE 05', 'DATA SCIENCE 05'),
      title: l('El cementerio de dashboards que nadie mira', 'The graveyard of unused dashboards'),
      body: l('El 80% de los dashboards empresariales no sirven para nada porque no responden a ninguna decisión concreta. Cassie Kozyrkov (Chief Decision Scientist en Google) lo resume así: "Si ningún número en la pantalla va a cambiar lo que harás el lunes a las 9 AM, no pierdas tiempo midiéndolo".', '80% of corporate dashboards are useless because they address zero concrete decisions. Cassie Kozyrkov (Google Chief Decision Scientist) sums it up: "If no number on that screen will change what you do Monday at 9 AM, do not waste time measuring it."'),
      tacticalRule: l('Escribe la regla: Si la métrica es > X hacemos A; si es < X hacemos B, antes de pedir datos.', 'Write the rule: If metric > X do A; if < X do B, prior to pulling data.'),
      metric: { value: '100%', label: l('de métricas vinculadas a acciones operativas', 'of metrics tied to operational actions') },
    },
    challenge: {
      title: l('Diseña la regla de decisión', 'Design decision rule'),
      challenge: {
        kind: 'multiple_choice',
        prompt: l('Tu equipo quiere pagar $10,000 por un estudio de mercado. ¿Qué pregunta debes hacer antes de autorizarlo?', 'Your team wants to spend $10,000 on market research. What question must you ask before approving?'),
        options: [
          { id: 'a', label: l('¿Qué decisión específica cambiaremos si el resultado es negativo vs si es positivo?', 'What specific decision will we change if the result is negative vs if it is positive?'), correct: true },
          { id: 'b', label: l('¿El reporte vendrá con gráficos en 3D?', 'Will the report include 3D charts?') },
          { id: 'c', label: l('¿Cuántas páginas de PowerPoint tendrá el documento?', 'How many PowerPoint slides will the deck have?') },
        ],
        feedback: {
          correct: l('¡Exacto! Si la decisión no cambia independientemente del número, el análisis vale cero.', 'Correct! If the decision does not change regardless of the number, the analysis is worth zero.'),
          incorrect: l('El formato no importa; lo que importa es si altera tu conducta.', 'Format is irrelevant; what matters is whether it alters conduct.'),
          explanation: l('El valor de la información proviene exclusivamente de la pérdida evitada o ganancia obtenida al cambiar de decisión.', 'The value of information stems purely from loss prevented or gain captured by altering decisions.'),
        },
      },
    },
    action: {
      title: l('Crea tu contrato de decisión', 'Create decision contract'),
      widget: {
        engine: 'decision_analytics',
        title: l('Árbol de Decisión Binario', 'Binary Decision Matrix'),
        instruction: l('Establece la métrica, el umbral numérico y las dos acciones opuestas.', 'Set the metric, numeric threshold, and two contrasting actions.'),
        fields: [
          { id: 'metricName', kind: 'text', label: l('Métrica a medir', 'Metric to track'), placeholder: l('Costo de Adquisición de Cliente (CAC)', 'Customer Acquisition Cost (CAC)'), minLength: 3 },
          { id: 'threshold', kind: 'range', label: l('Umbral crítico de decisión', 'Critical decision threshold'), min: 10, max: 200, step: 5, defaultValue: 45, unit: l('USD', 'USD') },
          { id: 'actionAbove', kind: 'text', label: l('Acción si supera el umbral', 'Action if above threshold'), placeholder: l('Pausar canales de pago y auditar embudo', 'Pause paid ads and audit funnel'), minLength: 5 },
          { id: 'actionBelow', kind: 'text', label: l('Acción si está por debajo', 'Action if below threshold'), placeholder: l('Escalar presupuesto un 50%', 'Scale budget by 50%'), minLength: 5 },
        ],
        resultLabel: l('Contrato de decisión armado', 'Decision contract armed'),
        artifactTitle: l('Mi protocolo de decisión analítica', 'My analytical decision protocol'),
        commitLabel: l('Fijar contrato', 'Lock contract'),
      },
    },
    reward: {
      title: l('Científico de Decisiones', 'Decision Scientist'),
      body: l('Has completado la maestría de Ciencia de Datos & Decisiones.', 'You completed Data Science & Decisions mastery.'),
      xp: 170,
      petRecovery: 25,
    },
  }),
];

export const INTERACTIVE_TRACKS: InteractiveTrack[] = [
  {
    id: 'data-science', legacyTrackId: 'ai', title: l('Ciencia de Datos & Decisiones', 'Data Science & Decisions'), shortTitle: l('Data Science', 'Data Science'),
    promise: l('Aprende a separar señal de ruido, métricas North Star y pruebas A/B reales.', 'Learn to separate signal from noise, North Star metrics, and real A/B testing.'),
    outcome: l('Terminas con filtros de señal, calculadora A/B, métrica North Star y árbol de decisión.', 'Finish with signal filters, A/B calculator, North Star metric, and decision tree.'), lessons: dataScienceLessons,
  },
  {
    id: 'history-strategy', legacyTrackId: 'history', title: l('Estrategia & Historia', 'Strategy & History'), shortTitle: l('Historia', 'History'),
    promise: l('Aprende las tácticas de poder, guerra y liderazgo de los grandes imperios.', 'Learn power, warfare, and leadership tactics from great empires.'),
    outcome: l('Terminas con principios de terreno, maniobra, niebla de guerra y resiliencia.', 'Finish with principles of terrain, maneuver, fog of war, and resilience.'), lessons: historyLessons,
  },
  {
    id: 'mindset-stoic', legacyTrackId: 'mindset', title: l('Psicología & Decisiones', 'Psychology & Decisions'), shortTitle: l('Psicología', 'Psychology'),
    promise: l('Detecta sesgos, decide con evidencia y aprende de una forma que perdure.', 'Spot biases, decide with evidence, and learn in a way that lasts.'),
    outcome: l('Terminas con cinco herramientas prácticas para pensar, decidir y recordar mejor.', 'Finish with five practical tools to think, decide, and remember better.'), lessons: psychologyLessons,
  },
  {
    id: 'smart-money', legacyTrackId: 'investing', title: l('Smart Money & Capital', 'Smart Money & Capital'), shortTitle: l('Capital', 'Capital'),
    promise: l('Construye un sistema de capital que no dependa de adivinar.', 'Build a capital system that does not depend on guessing.'),
    outcome: l('Terminas con reglas de liquidez, aportes, selección de ETF, DCA y riesgo.', 'Finish with rules for liquidity, contributions, ETF selection, DCA, and risk.'), lessons: smartMoneyLessons,
  },
  {
    id: 'ai-automation', legacyTrackId: 'ai', title: l('IA & Automatizaciones', 'AI & Automation'), shortTitle: l('IA', 'AI'),
    promise: l('Pasa de prompts sueltos a sistemas con contexto, ruteo y control.', 'Move from isolated prompts to systems with context, routing, and control.'),
    outcome: l('Terminas con un prompt, un paquete de contexto, un flujo y un agente seguro.', 'Finish with a prompt, context pack, workflow, and safe agent.'), lessons: aiLessons,
  },
  {
    id: 'viral-growth', legacyTrackId: 'business', title: l('Influencia & Crecimiento', 'Influence & Growth'), shortTitle: l('Growth', 'Growth'),
    promise: l('Convierte atención en pruebas de mercado que puedas ejecutar hoy.', 'Turn attention into market tests you can execute today.'),
    outcome: l('Terminas con hook, segmento, oferta, guion y sistema de distribución.', 'Finish with a hook, segment, offer, script, and distribution system.'), lessons: growthLessons,
  },
  {
    id: 'peak-performance', legacyTrackId: 'performance', title: l('Rendimiento & Foco', 'Peak Performance & Focus'), shortTitle: l('Foco', 'Focus'),
    promise: l('Diseña bloques de Deep Work, optimiza tu energía circadiana y multiplica tu ejecución.', 'Design Deep Work blocks, optimize circadian energy, and multiply your output.'),
    outcome: l('Terminas con rituales de foco puro, reducción de fricción y protocolo de apagado.', 'Finish with deep focus rituals, friction reduction, and shutdown protocols.'), lessons: perfLessons,
  },
];

export const ALL_ATOMIC_LESSONS = INTERACTIVE_TRACKS.flatMap((track) => track.lessons);

export const getInteractiveTrack = (trackId: InteractiveTrackId): InteractiveTrack =>
  INTERACTIVE_TRACKS.find((track) => track.id === trackId) || INTERACTIVE_TRACKS[0];

export const getInteractiveLesson = (lessonId: string): AtomicLesson | undefined =>
  ALL_ATOMIC_LESSONS.find((lesson) => lesson.id === lessonId);

export const getInteractiveTrackIdFromLegacy = (trackId: string): InteractiveTrackId => {
  if (trackId === 'data-science' || trackId === 'tech-datascience') return 'data-science';
  if (trackId === 'ai' || trackId === 'ai-automation') return 'ai-automation';
  if (trackId === 'business' || trackId === 'viral-growth') return 'viral-growth';
  if (trackId === 'history' || trackId === 'history-strategy') return 'history-strategy';
  if (trackId === 'mindset' || trackId === 'mindset-stoic') return 'mindset-stoic';
  if (trackId === 'performance' || trackId === 'peak-performance') return 'peak-performance';
  return 'smart-money';
};

export const INTERACTIVE_MISSION_BANK: BankMission[] = ALL_ATOMIC_LESSONS.map((lesson) => ({
  id: lesson.id,
  nodeType: 'learn',
  competency: lesson.competency,
  difficulty: lesson.difficulty,
  type: 'book_lesson',
  title: lesson.title.es,
  concept: lesson.keyConcept.es,
  keyTakeaway: lesson.phases[0].tacticalRule.es,
  recallQuestion: lesson.learningDesign.retrievalPrompt.es,
  recallOptions: [
    { text: lesson.learningDesign.retrievalAnswer.es, correct: true },
    { text: lesson.learningDesign.misconception.es, correct: false },
    { text: 'Memorizar la idea sin probarla ni convertirla en una decisión real.', correct: false },
  ],
  recallExplanation: lesson.learningDesign.retrievalAnswer.es,
  sources: lesson.sources.map((source) => ({
    type: source.kind === 'paper' ? 'research' : source.kind === 'transcript' ? 'video' : source.kind === 'internal' ? 'article' : source.kind,
    title: source.title,
    author: source.author,
    url: source.url,
  })),
  xpReward: lesson.phases[3].xp,
}));

export const INTERACTIVE_FIELD_MISSION_BANK: BankMission[] = ALL_ATOMIC_LESSONS.map((lesson) => ({
  id: `field-${lesson.id}`,
  nodeType: 'apply',
  competency: lesson.competency,
  difficulty: lesson.difficulty,
  type: 'real_world_task',
  title: `Ejecuta: ${lesson.title.es}`,
  taskBrief: lesson.objective.es,
  reflectionPrompt: lesson.phases[2].widget.instruction.es,
  minReflectionLength: 20,
  verificationMethod: 'photo',
  verificationTier: 1,
  xpReward: 50,
}));

export const isInteractiveLessonId = (missionId: string): boolean =>
  ALL_ATOMIC_LESSONS.some((lesson) => lesson.id === missionId);
