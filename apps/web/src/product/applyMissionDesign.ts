import type { LearningLocale } from './interactiveCurriculumTypes';

type Copy = [string, string];
interface ApplyDesign { title: Copy; why: Copy; steps: Copy[]; done: Copy; minutes: number }
const designs: Record<string, ApplyDesign> = {
  'learn-money-01': {
    title: ['Dale un propósito a tu dinero', 'Give your money a purpose'], minutes: 5,
    why: ['Antes de estudiar inversiones, distingue el dinero que podrías necesitar pronto. Un colchón y un objetivo de largo plazo cumplen funciones diferentes.', 'Before exploring investments, distinguish money you may need soon. A buffer and a long-term goal serve different purposes.'],
    steps: [['Abre tus notas o tu presupuesto. Puedes trabajar con cantidades ficticias.', 'Open your notes or budget. You can use fictional amounts.'], ['Crea dos categorías: necesidades próximas y objetivos de largo plazo.', 'Create two categories: near-term needs and long-term goals.'], ['Asigna una cantidad a cada una y guarda una regla para no confundirlas. No hace falta mover dinero.', 'Assign an amount to each and save a rule to keep them separate. No money transfer is needed.']],
    done: ['He guardado mis dos categorías y una regla para mantenerlas separadas.', 'I saved my two categories and a rule to keep them separate.'],
  },
  'learn-money-02': {
    title: ['Ponle una fecha a tu futuro', 'Give your future a date'], minutes: 4,
    why: ['Una proyección solo es útil si entiendes sus supuestos. Convertirla en un recordatorio te permite revisar el plan sin prometer un rendimiento.', 'A projection is only useful when you understand its assumptions. A reminder helps you revisit the plan without promising a return.'],
    steps: [['Recupera la simulación de interés compuesto que acabas de guardar.', 'Revisit the compound-growth simulation you just saved.'], ['Anota el aporte, el horizonte y que el retorno es un supuesto, no una garantía.', 'Note the contribution, horizon and that returns are assumptions, not guarantees.'], ['Crea un recordatorio para revisar si ese aporte encaja con tu presupuesto. No actives una compra real.', 'Create a reminder to check whether that contribution fits your budget. Do not activate a real purchase.']],
    done: ['Mi simulación está guardada con sus supuestos y una fecha de revisión.', 'My simulation is saved with its assumptions and a review date.'],
  },
  'learn-money-03': {
    title: ['Compara antes de elegir', 'Compare before choosing'], minutes: 7,
    why: ['Dos fondos con nombres parecidos pueden exponerte a riesgos y costes distintos. Una comparación por escrito ayuda a separar datos de popularidad.', 'Two similarly named funds can expose you to different risks and costs. A written comparison separates facts from popularity.'],
    steps: [['Abre las fichas oficiales de dos ETF que sigan un mercado comparable.', 'Open the official fact sheets of two ETFs tracking a comparable market.'], ['En tus notas, compara índice, diversificación, ratio de gastos y fecha de la información.', 'In your notes, compare index, diversification, expense ratio and the information date.'], ['Escribe una diferencia y una pregunta pendiente. El objetivo es comparar, no comprar.', 'Write one difference and one open question. The goal is to compare, not buy.']],
    done: ['Tengo una comparación de dos fondos y sé qué dato debo investigar después.', 'I have a two-fund comparison and know which fact to investigate next.'],
  },
  'learn-money-04': {
    title: ['Ensaya tu hábito de aportes', 'Rehearse your contribution habit'], minutes: 4,
    why: ['Una regla de calendario reduce decisiones repetitivas. Ensayarla sin dinero real permite detectar un importe o una frecuencia que no encaja contigo.', 'A calendar rule reduces repeated decisions. Rehearsing without real money reveals an amount or frequency that does not fit.'],
    steps: [['Revisa el importe y la frecuencia de tu plan DCA.', 'Review the amount and frequency of your DCA plan.'], ['Crea un recordatorio recurrente marcado como simulación.', 'Create a recurring reminder labelled as a simulation.'], ['Añade una regla de pausa si necesitas ese dinero para gastos esenciales. Comprueba la próxima fecha.', 'Add a pause rule if you need that money for essential expenses. Check the next date.']],
    done: ['Mi recordatorio recurrente tiene importe simulado, fecha y regla de pausa.', 'My recurring reminder has a simulated amount, date and pause rule.'],
  },
  'learn-money-05': {
    title: ['Escribe tus límites', 'Write down your limits'], minutes: 6,
    why: ['Pensar en escenarios adversos antes de actuar ayuda a reconocer cuándo un plan no es adecuado. Un límite calculado no garantiza que una pérdida se detenga ahí.', 'Considering adverse scenarios before acting helps reveal when a plan is unsuitable. A calculated limit does not guarantee a loss will stop there.'],
    steps: [['Abre una nota titulada «Mi protocolo de riesgo» y usa tu simulación como ejemplo.', 'Open a note titled “My risk protocol” and use your simulation as an example.'], ['Escribe horizonte, cantidad que no puedes arriesgar y un escenario de caída. No uses dinero real para probarlo.', 'Write your horizon, the amount you cannot risk and a downside scenario. Do not test it with real money.'], ['Añade cuándo revisarías el plan y qué no entiendes todavía. Guarda la nota antes de cerrar.', 'Add when you would review the plan and what you do not yet understand. Save the note before closing.']],
    done: ['He guardado mis límites, un escenario adverso y una condición de revisión.', 'I saved my limits, a downside scenario and a review condition.'],
  },
  // VIRAL GROWTH / BUSINESS (Y Combinator & Alex Hormozi)
  'learn-growth-01': {
    title: ['Prueba tu gancho en el mundo real', 'Test your hook in the real world'], minutes: 5,
    why: ['El gancho que diseñaste solo existe en teoría hasta que se enfrenta al scroll de personas reales. Medir el impacto inicial elimina conjeturas.', 'The hook you crafted only exists in theory until it faces real-world scroll attention. Testing opening impact removes guesswork.'],
    steps: [
      ['Copia el gancho de 3 segundos que construiste en la lección.', 'Copy the 3-second hook you created in the lesson.'],
      ['Publícalo como primera línea de un post en redes o como apertura de un video/historia.', 'Post it as the first line on social media or the opening frame of a short video.'],
      ['Observa las primeras respuestas o retención sin alterar el texto.', 'Observe opening retention or replies without altering the copy.']
    ],
    done: ['He publicado mi gancho de 3 segundos y medí la respuesta inicial sin adornos.', 'I published my 3-second hook and observed initial response without fluff.'],
  },
  'learn-growth-02': {
    title: ['Entrevista sin sesgo a 1 persona real', 'Conduct 1 unbiased user interview'], minutes: 8,
    why: ['Preguntar opiniones futuras produce mentiras piadosas. Preguntar por comportamientos pasados y dinero gastado revela verdad pura.', 'Asking for future opinions produces polite lies. Asking about past behaviors and actual dollars spent reveals pure truth.'],
    steps: [
      ['Identifica a una persona que encaje en el dolor concreto que definiste en tu mapa.', 'Find one person who matches the exact problem moment from your map.'],
      ['Envíale un mensaje preguntando cómo resolvió ese problema la semana pasada y cuánto gastó (sin mencionar tu idea).', 'Message them asking how they handled that problem last week and what it cost (without pitching your idea).'],
      ['Anota sus palabras exactas sobre su dolor pasado en tus notas.', 'Record their exact phrasing regarding past pain in your notes.']
    ],
    done: ['Tengo las respuestas reales sobre dolores pasados de 1 persona sin haberle vendido nada.', 'I have real answers on past pain from 1 person without pitching anything.'],
  },
  'learn-growth-03': {
    title: ['Añade certeza y velocidad a tu oferta', 'Inject certainty and speed into your offer'], minutes: 6,
    why: ['Bajar precios atrae a los peores clientes. Aumentar la velocidad de entrega y la certeza de resultado multiplica el valor percibido.', 'Lowering prices attracts the worst clients. Increasing delivery speed and outcome certainty multiplies perceived value.'],
    steps: [
      ['Abre la oferta reingenierizada que guardaste en el simulador.', 'Open the re-engineered offer you saved in the simulator.'],
      ['Reescribe tu propuesta añadiendo 1 garantía medible y 1 acelerador de tiempo.', 'Rewrite your proposal adding 1 measurable guarantee and 1 time accelerator.'],
      ['Actualiza tu plantilla de propuesta o mensaje de venta con esta versión mejorada.', 'Update your proposal template or sales pitch with this improved structure.']
    ],
    done: ['Mi propuesta incluye una garantía de resultado y un plazo de entrega acelerado.', 'My proposal includes an outcome guarantee and an accelerated delivery timeframe.'],
  },
  'learn-growth-04': {
    title: ['Graba tu primer borrador sin cortes', 'Record your first uncut raw take'], minutes: 5,
    why: ['El perfeccionismo al editar mata la cadencia. Grabar una toma continua de tu guion revela dónde tropieza el ritmo.', 'Perfectionism in editing kills momentum. Recording one continuous take reveals where rhythm stumbles.'],
    steps: [
      ['Coloca el teléfono frente a ti con tu guion visible (Hook, Prueba, CTA).', 'Place your phone in front of you with your 3-part script visible (Hook, Proof, CTA).'],
      ['Graba una toma continua sin parar a corregir errores.', 'Record one continuous take without stopping for mistakes.'],
      ['Escúchala una sola vez y verifica si la tensión aparece antes del segundo 3.', 'Review it once to verify whether tension hits before second 3.']
    ],
    done: ['Tengo una grabación de prueba donde la tensión se presenta en los primeros 3 segundos.', 'I have a test recording where tension is established in the first 3 seconds.'],
  },
  'learn-growth-05': {
    title: ['Convierte 1 idea en 2 canales hoy', 'Repurpose 1 core thesis across 2 channels today'], minutes: 10,
    why: ['Crear contenido sin distribución sistemática agota tu energía. Una tesis sólida debe viajar por múltiples formatos con métricas claras.', 'Creating content without systematic distribution burns out your energy. One solid thesis should travel across formats with clear metrics.'],
    steps: [
      ['Toma la tesis central de tu mapa 1→4.', 'Take the core thesis from your 1→4 distribution map.'],
      ['Adáptala en un micro-post para tu canal principal y prepara un mensaje de seguimiento.', 'Adapt it into a micro-post for your primary channel and draft a follow-up outreach message.'],
      ['Programa o publica ambas versiones con su respectiva métrica de éxito fijada.', 'Schedule or publish both adaptations with their success metric locked in.']
    ],
    done: ['He desplegado la misma tesis en dos canales con métricas de seguimiento definidas.', 'I deployed the same thesis across two channels with tracked metrics.'],
  },
  // AI & AUTOMATION (Andrej Karpathy & Anthropic)
  'learn-ai-01': {
    title: ['Prueba tu prompt estructurado en producción', 'Test your structured prompt in production'], minutes: 5,
    why: ['Un prompt sin restricciones ni formato genera respuestas impredecibles. Comparar la salida estructurada contra un prompt vago demuestra la diferencia.', 'A prompt lacking constraints and format produces chaotic outputs. Comparing structured output against a vague prompt proves the difference.'],
    steps: [
      ['Copia el prompt de 4 bloques (Objetivo, Contexto, Restricciones, Formato) que guardaste.', 'Copy the 4-block prompt (Goal, Context, Constraints, Format) you saved.'],
      ['Pégalo en tu cliente LLM con datos reales de tu trabajo diario.', 'Paste it into your LLM with real data from your actual work.'],
      ['Verifica que el resultado cumpla el 100% del formato y las restricciones solicitadas.', 'Verify that the output strictly satisfies 100% of formatting and constraints.']
    ],
    done: ['Mi LLM produjo una respuesta estructurada que cumplió todas las restricciones.', 'My LLM produced a structured response adhering to every single constraint.'],
  },
  'learn-ai-02': {
    title: ['Crea tu archivo de contexto estable (.md)', 'Build your stable context file (.md)'], minutes: 6,
    why: ['Repetir las mismas instrucciones básicas en cada sesión consume tiempo y tokens. Un archivo de contexto maestro estandariza la voz de tu proyecto.', 'Repeating basic context across chat sessions wastes tokens and time. A master context file standardizes your project voice.'],
    steps: [
      ['Crea un archivo de notas llamado CONTEXTO_MAESTRO.md.', 'Create a note file named MASTER_CONTEXT.md.'],
      ['Pega las 3 capas: Identidad y Reglas, Estándares de calidad y 2 ejemplos de oro.', 'Paste the 3 layers: Permanent rules, Quality standards, and 2 golden examples.'],
      ['Guárdalo para adjuntarlo o referenciarlo en tus futuros flujos con agentes o LLMs.', 'Save it to attach or reference in future agent and LLM sessions.']
    ],
    done: ['Tengo mi archivo de contexto maestro guardado y listo para cualquier sesión de IA.', 'I have my master context file saved and ready for any future AI workflow.'],
  },
  'learn-ai-03': {
    title: ['Audita tu gasto y latencia de IA', 'Audit your AI latency and model cost'], minutes: 5,
    why: ['Usar el modelo más caro para tareas mecánicas de clasificación o formateo es tirar presupuesto y añadir latencia innecesaria.', 'Using the heaviest model for classification or formatting burns budget and adds latency.'],
    steps: [
      ['Revisa las últimas 5 tareas que delegaste a un modelo de IA.', 'Review the last 5 tasks you delegated to an AI model.'],
      ['Clasifica cada una: ¿era de alta ambigüedad/juicio o era repetitiva/mecánica?', 'Classify each: was it high-ambiguity/judgment or mechanical/repetitive?'],
      ['Reasigna las mecánicas a modelos rápidos (Flash/Mini) y reserva los modelos Frontier solo para razonamiento crítico.', 'Reassign mechanical ones to fast models (Flash/Mini) and reserve Frontier models for critical reasoning.']
    ],
    done: ['He asignado la ruta adecuada a mis tareas frecuentes de IA, reduciendo coste y latencia.', 'I assigned the right route to frequent AI tasks, reducing cost and latency.'],
  },
  'learn-ai-04': {
    title: ['Divide una tarea compleja en 3 micro-pasos', 'Split a complex task into 3 micro-steps'], minutes: 8,
    why: ['Los LLMs fallan cuando intentan investigar, analizar, redactar y formatear en un solo prompt masivo. Encadenar pasos garantiza precisión.', 'LLMs fail when attempting to research, analyze, draft, and format in one massive prompt. Chaining steps guarantees precision.'],
    steps: [
      ['Elige un proceso que hoy te tome más de 30 minutos.', 'Pick a workflow taking over 30 minutes.'],
      ['Escribe el diagrama de 3 pasos: Extracción de hechos -> Síntesis de insights -> Redacción final.', 'Write the 3-step diagram: Fact extraction -> Insight synthesis -> Final drafting.'],
      ['Ejecuta el paso 1 primero y pasa su resultado exacto al paso 2.', 'Execute step 1 first and pipe its exact output into step 2.']
    ],
    done: ['He ejecutado un flujo de IA encadenado con un resultado mucho más preciso.', 'I executed a chained AI workflow with significantly higher precision.'],
  },
  'learn-ai-05': {
    title: ['Añade guardrails a tu automatización', 'Add guardrails to your automation'], minutes: 6,
    why: ['Los agentes autónomos sin límites de gasto, borrado o confirmación humana son una bomba de tiempo en producción.', 'Autonomous agents without spend, delete, or human approval limits are a production liability.'],
    steps: [
      ['Identifica cualquier herramienta o script con permisos de escritura o envío.', 'Identify any tool or automation script with write or send permissions.'],
      ['Configura una regla de confirmación humana obligatoria antes de cualquier acción irreversible.', 'Add a mandatory human confirmation checkpoint before any irreversible action.'],
      ['Prueba la condición de parada provocando un error controlado para confirmar que el agente se detiene.', 'Test the stop condition with a controlled error to verify the agent safely halts.']
    ],
    done: ['Mis herramientas automatizadas tienen límites de seguridad y confirmación humana activados.', 'My automations have security limits and human checkpoints active.'],
  },
  // DATA SCIENCE & DECISIONS (Cassie Kozyrkov & Nate Silver)
  'learn-data-01': {
    title: ['Audita 1 métrica vanidosa de tu negocio', 'Audit 1 vanity metric in your business'], minutes: 5,
    why: ['Monitorear métricas que suben sin impactar ingresos ni retención desvía tu foco de lo que realmente importa.', 'Tracking metrics that surge without boosting revenue or retention distracts from what truly matters.'],
    steps: [
      ['Abre tus analíticas y localiza la métrica que más miras a diario.', 'Open your analytics and identify the metric you look at most frequently.'],
      ['Haz la prueba de decisión: «Si este número sube un 30% hoy, ¿qué decisión operativa cambia?»', 'Run the decision test: "If this number jumps 30% today, what operational decision changes?"'],
      ['Si la respuesta es "ninguna", desactiva su notificación y enfócate en conversión o retención.', 'If the answer is "none", silence its alert and refocus on conversion or retention.']
    ],
    done: ['He eliminado una métrica de vanidad y centrado mi atención en una métrica con impacto.', 'I removed a vanity metric and refocused attention on a decision-impacting metric.'],
  },
  'learn-data-02': {
    title: ['Fija tu North Star y su contra-métrica', 'Lock your North Star and counter-metric'], minutes: 6,
    why: ['Una métrica North Star sin una métrica de control de calidad incentiva trampas inconscientes.', 'A North Star metric without a quality counter-metric incentivizes perverse incentives.'],
    steps: [
      ['Anota tu métrica North Star principal en una nota.', 'Write down your primary North Star metric in your notes.'],
      ['Añade su contra-métrica de calidad (ej. satisfacción del cliente o costo por usuario).', 'Add its quality counter-metric (e.g. customer satisfaction or unit economics).'],
      ['Coloca ambas en un lugar visible de tu panel de trabajo semanal.', 'Place both side-by-side on your weekly operating dashboard.']
    ],
    done: ['Tengo mi métrica North Star emparejada con su contra-métrica de equilibrio.', 'I have my North Star metric paired with its balancing counter-metric.'],
  },
  'learn-data-03': {
    title: ['Registra la hipótesis y tamaño de muestra antes de lanzar', 'Log hypothesis and sample size before launching'], minutes: 7,
    why: ['Mirar los resultados de un test A/B a los dos días y declarar un ganador temprano produce un 80% de falsos positivos.', 'Checking A/B results after two days and calling early winners leads to an 80% false positive rate.'],
    steps: [
      ['Usa la calculadora A/B para anotar el tamaño de muestra mínimo requerido.', 'Use the A/B calculator to determine the required sample size for your baseline.'],
      ['Escribe la fecha estimada en la que se alcanzará la muestra calculada.', 'Record the estimated date when sample size will be reached.'],
      ['Comprométete por escrito a no declarar ganador ni detener el experimento antes de esa fecha.', 'Commit in writing to neither declare a winner nor stop the test prior to that date.']
    ],
    done: ['Mi experimento tiene hipótesis registrada, muestra calculada y fecha de cierre blindada.', 'My experiment has a logged hypothesis, calculated sample, and locked end date.'],
  },
  'learn-data-04': {
    title: ['Aplica una prueba ciega a tu siguiente decisión', 'Apply a blind holdout test to your next decision'], minutes: 6,
    why: ['Ajustar una estrategia a los últimos 3 clientes excepcionales garantiza que fallará con los siguientes 10 comunes.', 'Tailoring strategy to the last 3 unusual clients guarantees failure with the next 10 normal ones.'],
    steps: [
      ['Revisa cualquier regla operativa o de ventas que hayas creado recientemente.', 'Review any sales or operating rule created recently.'],
      ['Verifícala contra 5 casos anteriores independientes que no usaste para inventar la regla.', 'Test it against 5 independent past cases not used when creating the rule.'],
      ['Ajusta o descarta la regla si solo funcionaba en el caso anecdótico original.', 'Adjust or scrap the rule if it only worked on the anecdotal original case.']
    ],
    done: ['He validado mi regla de decisión contra datos independientes para evitar sobreajuste.', 'I validated my decision rule against independent data to avoid overfitting.'],
  },
  'learn-data-05': {
    title: ['Dibuja un árbol de decisión para tu mayor dilema actual', 'Draw a decision tree for your biggest current dilemma'], minutes: 8,
    why: ['Tomar decisiones complejas en la cabeza mezcla emociones con probabilidades. Un árbol visual separa el valor esperado del miedo.', 'Making complex decisions mentally blends emotion with probabilities. A visual tree clarifies expected value.'],
    steps: [
      ['Escribe el dilema central con dos ramas principales de acción.', 'Write your core dilemma with two primary decision branches.'],
      ['Asigna una probabilidad estimada (ej. 70% / 30%) y el resultado financiero/estratégico de cada rama.', 'Assign estimated probabilities (e.g. 70% / 30%) and outcomes to each branch.'],
      ['Calcula el valor esperado de cada camino y toma la decisión con el mejor balance riesgo/recompensa.', 'Calculate expected value for each path and choose the best risk/reward branch.']
    ],
    done: ['Tengo un árbol de decisión cuantificado para mi dilema actual.', 'I have a quantified decision tree for my current business dilemma.']
  },
  // MINDSET & STOICISM (Marcus Aurelius & Daniel Kahneman)
  'learn-mindset-01': {
    title: ['Escribe tu filtro estoico de dos columnas', 'Write your two-column stoic filter'], minutes: 4,
    why: ['El 90% de la ansiedad ejecutiva proviene de intentar controlar el comportamiento de otros o el mercado.', '90% of executive anxiety stems from attempting to control others or market noise.'],
    steps: [
      ['Abre una nota con dos columnas: «Bajo mi control directo» y «Fuera de mi control».', 'Open a note with two columns: "Under my direct control" and "Outside my control".'],
      ['Coloca tu mayor preocupación actual en la columna correspondiente.', 'Place your primary current stressor into its corresponding column.'],
      ['Define una sola acción física para lo que controlas y archiva mentalmente el resto.', 'Define one concrete physical action for what you control and dismiss the rest.']
    ],
    done: ['He separado lo que controlo de lo que no y definí una acción inmediata.', 'I separated what I control from what I do not and set one immediate action.']
  },
  'learn-mindset-02': {
    title: ['Haz un pre-mortem de tu proyecto actual', 'Conduct a pre-mortem on your active project'], minutes: 6,
    why: ['Imaginarse que todo saldrá perfecto es ingenuidad. Imaginar el peor escenario plausible permite preparar defensas antes de que ocurra.', 'Assuming everything will go right is naive. Imagining plausible failure lets you build defenses before disaster strikes.'],
    steps: [
      ['Pregúntate: «Si este proyecto fracasa estrepitosamente en 3 meses, ¿cuál fue la causa exacta?»', 'Ask: "If this project fails catastrophically in 3 months, what was the exact cause?"'],
      ['Anota las 2 causas más probables en tus notas.', 'List the 2 most likely failure causes in your notes.'],
      ['Escribe una contramedida preventiva para cada una hoy.', 'Write one preventive countermeasure for each today.']
    ],
    done: ['He identificado los 2 mayores riesgos de fracaso y dejé armada su prevención.', 'I identified the 2 biggest failure points and designed prevention measures.']
  },
  'learn-mindset-03': {
    title: ['Convierte un revés reciente en combustible', 'Turn a recent setback into tactical fuel'], minutes: 5,
    why: ['Lamentarse por lo ocurrido es quemar energía dos veces. El obstáculo es el camino cuando extraes la lección operativa.', 'Lamenting past events burns energy twice. The obstacle is the way when you extract operational lessons.']
    ,
    steps: [
      ['Identifica un error, rechazo o pérdida reciente en tu trabajo.', 'Identify a recent mistake, rejection, or loss in your work.'],
      ['Escribe en una frase: «Lo que esto me enseñó para siempre es...»', 'Write in one sentence: "What this permanently taught me is..."'],
      ['Implementa un cambio de sistema para que ese error sea imposible de repetir.', 'Implement a system tweak making that mistake impossible to repeat.']
    ],
    done: ['He transformado un revés en una mejora permanente de mi sistema de trabajo.', 'I converted a setback into a permanent upgrade to my operating system.']
  },
  'learn-mindset-04': {
    title: ['Reescribe una amenaza como oportunidad asimétrica', 'Reframe a threat as an asymmetric opportunity'], minutes: 5,
    why: ['El significado de un evento no está en el evento, sino en el marco con el que lo interpretas.', 'The meaning of an event does not reside in the event, but in your framing lens.'],
    steps: [
      ['Identifica una situación que actualmente te cause fricción o estrés.', 'Identify a situation causing friction or stress right now.'],
      ['Reescríbela cambiando el marco: en vez de "¿Por qué me pasa esto?", pregúntate "¿Qué ventaja oculta me da esto sobre quienes se quejan?"', 'Reframe: instead of "Why is this happening?", ask "What hidden advantage does this hand me over those who complain?"'],
      ['Anota la ventaja estratégica y compórtate en base a ella.', 'Record the strategic advantage and act upon it.']
    ],
    done: ['He cambiado el encuadre de una situación tensa y encontré su ventaja estratégica.', 'I reframed a tense situation and extracted its strategic advantage.']
  },
  'learn-mindset-05': {
    title: ['Haz una lista de cómo garantizar el fracaso y evítalo', 'List how to guarantee failure and invert it'], minutes: 5,
    why: ['Es mucho más fácil evitar la estupidez sistemática que intentar ser un genio brillante todos los días.', 'It is far easier to avoid systematic stupidity than to attempt brilliant genius daily.'],
    steps: [
      ['Pregúntate: «¿Cómo podría arruinar por completo mi negocio o mi salud en los próximos 6 meses?»', 'Ask: "How could I completely ruin my business or health over the next 6 months?"'],
      ['Anota las 3 conductas destructivas obvias.', 'List the 3 obvious destructive habits.'],
      ['Revisa si estás cometiendo alguna de ellas hoy y coloca una barrera física para bloquearla.', 'Check if you indulge in any today and place a physical barrier to block it.']
    ],
    done: ['He invertido el problema e implementé una barrera contra mi mayor hábito destructivo.', 'I inverted the problem and placed a barrier against my most destructive habit.']
  },
  // PEAK PERFORMANCE (Cal Newport & James Clear)
  'learn-perf-01': {
    title: ['Programa y ejecuta 1 bloque de concentración pura', 'Schedule and execute 1 pure Deep Work block'], minutes: 10,
    why: ['90 minutos de trabajo ininterrumpido sin teléfono ni pestañas secundarias producen más avance que 8 horas de trabajo reactivo.', '90 uninterrupted minutes without phone or stray tabs generates more output than 8 hours of reactive drift.'],
    steps: [
      ['Elige tu tarea prioritaria #1 de hoy (la palanca más dura e importante).', 'Select today\'s #1 priority lever (the hardest, highest-impact task).'],
      ['Pon tu teléfono en modo no molestar en otra habitación y cierra todas las apps de mensajería.', 'Put your phone on Do Not Disturb in another room and close all messaging apps.'],
      ['Programa un cronómetro de 90 minutos y trabaja exclusivamente en esa tarea.', 'Set a 90-minute timer and work exclusively on that single objective.']
    ],
    done: ['He completado un bloque de concentración profunda sin interrupciones.', 'I completed a deep focus block with zero interruptions.']
  },
  'learn-perf-02': {
    title: ['Diseña tu protocolo de desconexión nocturna', 'Design your evening shutdown protocol'], minutes: 5,
    why: ['Si tu cerebro siente que hay cabos sueltos, seguirá procesando ansiedad durante la noche, arruinando tu sueño y tu energía de mañana.', 'If your brain detects open loops, it churns anxiety overnight, ruining sleep and tomorrow\'s energy.'],
    steps: [
      ['15 minutos antes de terminar tu jornada, revisa tus notas y lista de tareas.', '15 minutes before ending work, review notes and active tasks.'],
      ['Anota las 3 prioridades del día siguiente y di en voz alta: «Jornada completada».', 'Record tomorrow\'s top 3 priorities and say aloud: "Day shutdown complete."'],
      ['Cierra la laptop y no vuelvas a revisar mensajes de trabajo hasta mañana.', 'Close your laptop and do not check work messages until tomorrow morning.']
    ],
    done: ['He cerrado todos mis cabos sueltos y ejecuté mi ritual de apagado.', 'I closed open loops and executed my shutdown protocol.']
  },
  'learn-perf-03': {
    title: ['Elimina 1 paso de fricción en tu hábito clave', 'Eliminate 1 point of friction from your key habit'], minutes: 5,
    why: ['La fuerza de voluntad se agota. Diseñar el entorno para que la acción correcta sea la más fácil garantiza la repetición.', 'Willpower depletes. Designing your environment so the right action is the easiest one ensures habit consistency.'],
    steps: [
      ['Identifica el hábito que más te cuesta empezar a diario.', 'Identify the habit you struggle to initiate daily.'],
      ['Reduce su fricción previa: deja el documento abierto, el teléfono lejos o la ropa lista desde la noche anterior.', 'Pre-reduce friction: keep document open, phone away, or gear ready the night before.'],
      ['Verifica que empezar te tome menos de 30 segundos.', 'Verify that starting requires under 30 seconds of effort.']
    ],
    done: ['He eliminado la fricción previa de mi hábito prioritario.', 'I removed prior friction from my highest-priority habit.']
  },
  'learn-perf-04': {
    title: ['Mapea tus horas biológicas de máximo rendimiento', 'Map your peak biological cognitive hours'], minutes: 5,
    why: ['No todas las horas son iguales. Colocar tareas mecánicas en tu momento de mayor lucidez mental es un desperdicio biológico.', 'Not all hours are equal. Placing mechanical tasks during peak mental clarity is biological waste.'],
    steps: [
      ['Anota tus 3 horas de máxima energía mental del día.', 'Identify your 3 peak mental energy hours.'],
      ['Protege ese bloque en tu calendario: prohíbe reuniones y llamadas durante ese período.', 'Protect that block on your calendar: ban meetings and calls during that window.'],
      ['Mueve las tareas administrativas y mensajes a tu bajón energético de la tarde.', 'Shift admin tasks and messaging to your afternoon energy dip.']
    ],
    done: ['He protegido mis horas de máximo rendimiento para trabajo de alta cognición.', 'I protected my peak biological window for high-cognition deep execution.']
  },
  'learn-perf-05': {
    title: ['Aplica la regla de las 5 cosas de Buffett', 'Apply Warren Buffett’s 5/25 priority rule'], minutes: 6,
    why: ['Tus mayores distracciones no son las cosas que no te interesan, sino las metas que te gustan medianamente pero que te desvían de lo crucial.', 'Your worst distractions are not things you dislike, but the secondary goals you mildly like that derail what matters.'],
    steps: [
      ['Escribe tus 20 metas u objetivos actuales en una lista.', 'List 20 current goals or projects.'],
      ['Encierra en un círculo tus 5 prioridades absolutas.', 'Circle your top 5 life/business altering priorities.'],
      ['Tacha las 15 restantes y trátalas como una lista de «Evitar a toda costa» hasta terminar las 5 principales.', 'Cross out the remaining 15 and treat them as an "Avoid at all costs" list until the top 5 are done.']
    ],
    done: ['Tengo mis 5 prioridades absolutas fijadas y bloqueé las 15 distracciones secundarias.', 'I locked in my top 5 priorities and blocked the 15 secondary distractions.']
  },
  // HISTORY & STRATEGY (Sun Tzu & Mary Beard)
  'learn-history-01': {
    title: ['Evalúa el terreno de tu mercado antes de comprometer capital', 'Assess market terrain before committing capital'], minutes: 6,
    why: ['Luchar en un terreno dominado por rivales con más capital es suicidio empresarial. Elegir el terreno asimétrico garantiza la ventaja.', 'Fighting on terrain dominated by entrenched competitors is suicide. Choosing asymmetric terrain guarantees an edge.'],
    steps: [
      ['Abre tu matriz de terreno táctico guardada en la lección.', 'Open the tactical terrain matrix saved in the lesson.'],
      ['Identifica los 3 puntos donde tus competidores son lentos, costosos o impersonales.', 'Identify 3 areas where competitors are slow, expensive, or impersonal.'],
      ['Define tu oferta para competir únicamente en esos 3 puntos y rechazar la batalla frontal.', 'Position your offer to compete solely on those 3 points, refusing frontal collision.']
    ],
    done: ['He delimitado mi terreno de ventaja y evité la competencia frontal.', 'I staked out my advantage terrain and avoided direct attrition.']
  },
  'learn-history-02': {
    title: ['Desarticula la objeción antes de que surja', 'Dismantle the objection before it surfaces'], minutes: 6,
    why: ['Discutir con un cliente para convencerlo es un asedio desgastante. Cambiar el marco previo desarma las dudas sin fricción.', 'Arguing with a client is an exhausting siege. Pre-empting the frame dissolves doubt without resistance.'],
    steps: [
      ['Identifica la objeción #1 que siempre te frena en ventas.', 'Identify the #1 objection you constantly encounter in sales.'],
      ['Reformula tu introducción o página de venta para responder esa objeción de antemano.', 'Reframe your opening or landing page to address that exact objection upfront.'],
      ['Prueba este nuevo encuadre en tu próxima interacción.', 'Test this new frame in your next client interaction.']
    ],
    done: ['He neutralizado la objeción principal antes de la llamada de cierre.', 'I neutralized the primary objection prior to the closing call.']
  },
  'learn-history-03': {
    title: ['Diseña tu maniobra de flanqueo comercial', 'Design your commercial flanking maneuver'], minutes: 6,
    why: ['Si empujas frontalmente donde el líder del mercado es fuerte, serás aplastado. Flanquear por un nicho ignorado permite ganar masa crítica.', 'Pushing where market leaders are strong gets you crushed. Flanking through an overlooked niche builds critical mass.'],
    steps: [
      ['Identifica el segmento desatendido que los grandes competidores consideran demasiado pequeño.', 'Identify the underserved segment big players consider too tiny to care about.'],
      ['Crea una oferta híper-personalizada para ese nicho específico.', 'Create a hyper-tailored offer specifically for that narrow group.'],
      ['Contacta a 2 prospectos de ese nicho hoy.', 'Reach out to 2 prospects in that niche today.']
    ],
    done: ['He lanzado mi maniobra de flanqueo hacia un nicho desatendido.', 'I launched my flanking maneuver into an overlooked niche.']
  },
  'learn-history-04': {
    title: ['Fija un disparador observable para actuar bajo incertidumbre', 'Set an observable trigger for acting under uncertainty'], minutes: 5,
    why: ['Esperar tener el 100% de la información para actuar significa llegar tarde. La regla de Colin Powell: actúa cuando tengas entre el 40% y el 70% de certeza.', 'Waiting for 100% certainty means acting too late. Colin Powell\'s rule: move when you have 40% to 70% of facts.'],
    steps: [
      ['Identifica una decisión que llevas postergando por "falta de datos".', 'Identify a decision you\'ve been delaying due to "incomplete data".'],
      ['Define cuál es el dato mínimo indispensable para decir sí o no.', 'Define the minimum indispensable data trigger to say yes or no.'],
      ['Toma la decisión hoy mismo si ya cuentas con más del 50% de evidencia.', 'Pull the trigger today if you already possess over 50% of the key evidence.']
    ],
    done: ['He tomado la decisión postergada basándome en mi disparador objetivo.', 'I executed the delayed decision based on my objective trigger.']
  },
  'learn-history-05': {
    title: ['Audita tu disciplina de ejecución táctica', 'Audit your tactical execution discipline'], minutes: 5,
    why: ['Los ejércitos de élite no ganan por entusiasmo, sino por repetición de protocolos bajo fuego. La consistencia silenciosa supera la motivación esporádica.', 'Elite armies win through disciplined protocols under fire, not transient hype. Quiet consistency beats sporadic motivation.'],
    steps: [
      ['Anota el protocolo no negociable que debes cumplir cada día sin importar cómo te sientas.', 'Write down your non-negotiable daily operating protocol regardless of mood.'],
      ['Evalúa si lo cumpliste hoy antes de que termine el día.', 'Score whether you executed it today before midnight.'],
      ['Marca tu casilla de victoria táctica.', 'Check off your tactical victory.']
    ],
    done: ['He evaluado y cumplido mi protocolo no negociable de hoy.', 'I evaluated and completed today\'s non-negotiable protocol.']
  },
};

export function getApplyDesign(lessonId: string, locale: LearningLocale) {
  const design = designs[lessonId];
  if (!design) return null;
  const i = locale === 'es' ? 0 : 1;
  return { title: design.title[i], why: design.why[i], steps: design.steps.map(step => step[i]), done: design.done[i], minutes: design.minutes };
}
