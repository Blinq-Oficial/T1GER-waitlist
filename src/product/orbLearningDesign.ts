import type { GoldStandardLearningDesign, LocalizedText, OrbLearningDesign, OrbStoryBeat } from './interactiveCurriculumTypes';

const l = (es: string, en: string): LocalizedText => ({ es, en });
const beat = (titleEs: string, titleEn: string, bodyEs: string, bodyEn: string): OrbStoryBeat => ({
  title: l(titleEs, titleEn),
  body: l(bodyEs, bodyEn),
});
const design = (
  curiosity: LocalizedText,
  prediction: LocalizedText,
  storyBeats: OrbLearningDesign['storyBeats'],
  misconception: LocalizedText,
  summaryPoints: OrbLearningDesign['summaryPoints'],
  retrievalPrompt: LocalizedText,
  retrievalAnswer: LocalizedText,
  goldStandard?: GoldStandardLearningDesign,
): OrbLearningDesign => ({ curiosityQuestion: curiosity, predictionPrompt: prediction, storyBeats, misconception, summaryPoints, retrievalPrompt, retrievalAnswer, goldStandard });

export const ORB_LEARNING_DESIGNS: Record<string, OrbLearningDesign> = {
  'learn-money-01': design(
    l('¿Qué parte de tu efectivo es seguridad y qué parte es capital dormido?', 'Which part of your cash is safety, and which part is sleeping capital?'),
    l('Predice cuánto poder de compra pierde $1,000 tras cinco años al 3% de inflación.', 'Predict how much buying power $1,000 loses after five years at 3% inflation.'),
    [beat('La ilusión', 'The illusion', 'El saldo no baja, así que parece intacto. Pero el número es nominal: no muestra cuánto puede comprar.', 'The balance does not fall, so it looks intact. But that number is nominal; it does not show what it can buy.'), beat('La separación', 'The separation', 'El efectivo de emergencia compra tiempo y evita ventas forzadas. El excedente tiene otro trabajo: capturar crecimiento.', 'Emergency cash buys time and prevents forced selling. Surplus cash has another job: capture growth.'), beat('La regla', 'The rule', 'Una frontera explícita entre colchón y excedente elimina la decisión emocional de cada mes.', 'An explicit boundary between buffer and surplus removes the monthly emotional negotiation.')],
    l('Error común: creer que invertir todo es valiente o que dejar todo quieto es prudente. Ambos extremos ignoran el trabajo distinto de cada dólar.', 'Common error: believing investing everything is brave or leaving everything idle is prudent. Both extremes ignore the different job of each dollar.'),
    [l('El colchón protege decisiones futuras.', 'The buffer protects future decisions.'), l('La inflación reduce poder de compra aunque el saldo no cambie.', 'Inflation reduces buying power even when the balance stays flat.'), l('El excedente necesita una regla de despliegue, no una corazonada.', 'Surplus needs a deployment rule, not a hunch.')],
    l('¿Por qué el fondo de emergencia puede mejorar el rendimiento de una cartera?', 'Why can an emergency fund improve portfolio outcomes?'),
    l('Porque reduce la probabilidad de vender inversiones bajo presión.', 'Because it reduces the chance of selling investments under pressure.'),
  ),
  'learn-money-02': design(
    l('¿Qué pesa más en diez años: encontrar la tasa perfecta o no interrumpir los aportes?', 'What matters more over ten years: finding the perfect rate or not interrupting contributions?'),
    l('Elige mentalmente qué crecerá más: $100/mes por 20 años o $200/mes por 8.', 'Choose mentally which grows more: $100/month for 20 years or $200/month for 8.'),
    [beat('El inicio lento', 'The slow start', 'Al principio casi todo el saldo proviene de tus aportes. Parece que el sistema no funciona porque la base aún es pequeña.', 'At first, nearly all the balance comes from your deposits. The system looks weak because the base is still small.'), beat('El cruce', 'The crossover', 'Con tiempo suficiente, los rendimientos empiezan a generar rendimientos. La curva deja de depender sólo de tu esfuerzo.', 'With enough time, returns begin producing returns. The curve stops depending only on your effort.'), beat('La defensa', 'The defense', 'Automatizar un monto sostenible protege el proceso de impulsos, noticias y meses imperfectos.', 'Automating a sustainable amount protects the process from impulses, headlines, and imperfect months.')],
    l('Error común: subir el aporte tanto que el plan se rompe al primer gasto inesperado.', 'Common error: raising the contribution so high that the plan breaks at the first surprise expense.'),
    [l('Tiempo, tasa y aportes multiplican juntos.', 'Time, rate, and contributions multiply together.'), l('La constancia importa más cuando la curva parece aburrida.', 'Consistency matters most when the curve looks boring.'), l('Un aporte sostenible supera uno heroico e intermitente.', 'A sustainable contribution beats a heroic intermittent one.')],
    l('¿Qué variable no puedes recuperar después?', 'Which variable can you never recover later?'), l('El tiempo que el capital permaneció fuera del proceso compuesto.', 'The time capital spent outside the compounding process.'),
    {
      prediction: {
        prompt: l('Sin calcular: ¿qué plan termina con más dinero al 8% anual?', 'Without calculating: which plan finishes with more money at 8% annually?'),
        options: [
          { id: 'early', label: l('$100/mes durante 20 años', '$100/month for 20 years'), correct: true },
          { id: 'late', label: l('$200/mes durante 8 años', '$200/month for 8 years') },
        ],
        reveal: l('Empezar antes gana: cerca de $59k frente a $27k. La diferencia no es magia; son más meses produciendo rendimientos sobre rendimientos.', 'Starting earlier wins: about $59k versus $27k. The difference is not magic; it is more months earning returns on returns.'),
      },
      master: {
        prompt: l('¿Qué variable nunca puedes recuperar?', 'Which variable can never be recovered?'),
        options: [
          { id: 'time', label: l('Tiempo fuera del proceso compuesto', 'Time outside the compounding process'), correct: true },
          { id: 'rate', label: l('Una tasa de retorno más alta', 'A higher rate of return') },
          { id: 'deposit', label: l('El último aporte mensual', 'The latest monthly contribution') },
        ],
        explanation: l('Puedes aumentar aportes o cambiar una tasa futura. No puedes volver a comprar los años que dejaste fuera del proceso.', 'You can raise contributions or change a future rate. You cannot buy back years left outside the process.'),
      },
      outcome: l('Ahora entiendes por qué el tiempo y la constancia importan más que perseguir la tasa perfecta.', 'You now understand why time and consistency matter more than chasing the perfect rate.'),
    },
  ),
  'learn-money-03': design(
    l('¿Por qué dos fondos “parecidos” pueden dejarte resultados muy distintos?', 'Why can two “similar” funds leave you with very different outcomes?'),
    l('Antes de leer, ordena mentalmente estos filtros: rentabilidad mensual, índice, coste, diversificación.', 'Before reading, mentally rank these filters: monthly return, index, cost, diversification.'),
    [beat('La historia seductora', 'The seductive story', 'El fondo ganador del mes ofrece una explicación fácil y reciente. Eso no demuestra una ventaja repetible.', 'The fund that won this month offers an easy, recent story. It does not prove a repeatable edge.'), beat('La exposición real', 'The real exposure', 'El índice revela qué posees; la diversificación revela de qué dependes. El nombre comercial no hace ninguna de las dos.', 'The index reveals what you own; diversification reveals what you depend on. The product name does neither.'), beat('La fuga silenciosa', 'The silent leak', 'El ratio de gastos se descuenta cada año y también pierde el crecimiento futuro que ese dinero habría generado.', 'The expense ratio is deducted every year and also loses the future growth that money would have generated.')],
    l('Error común: comparar precios por participación. Un ETF de $500 no es “más caro” que uno de $50; importa la exposición y el coste porcentual.', 'Common error: comparing share prices. A $500 ETF is not “more expensive” than a $50 ETF; exposure and percentage cost matter.'),
    [l('Primero identifica el índice.', 'Identify the index first.'), l('Luego confirma diversificación y liquidez.', 'Then confirm diversification and liquidity.'), l('Finalmente minimiza costes para una exposición equivalente.', 'Finally minimize costs for equivalent exposure.')],
    l('¿Qué cuatro datos sobreviven al ruido de un mes?', 'Which four facts survive one month of noise?'), l('Índice, diversificación, ratio de gastos y liquidez.', 'Index, diversification, expense ratio, and liquidity.'),
  ),
  'learn-money-04': design(
    l('¿Cuántas veces al año negocias contigo mismo antes de invertir?', 'How many times a year do you negotiate with yourself before investing?'),
    l('Predice qué plan sobrevive mejor una caída: uno grande “cuando haya calma” o uno pequeño automático.', 'Predict which plan survives a downturn: a large one “when things calm down” or a small automatic one.'),
    [beat('La espera', 'The wait', 'La claridad suele llegar después de que el precio ya subió. Esperar seguridad convierte el sentimiento en señal de compra.', 'Clarity often arrives after price has risen. Waiting for safety turns feelings into a buy signal.'), beat('El sistema', 'The system', 'DCA fija monto y frecuencia antes de conocer la próxima noticia. No promete el mejor precio; promete participación consistente.', 'DCA fixes amount and frequency before the next headline. It does not promise the best price; it promises consistent participation.'), beat('La supervivencia', 'The survival test', 'El monto correcto es el que puedes sostener durante un mes malo sin cancelar ni tocar el colchón.', 'The right amount is one you can sustain through a bad month without canceling or touching the buffer.')],
    l('Error común: pensar que DCA elimina riesgo. Reduce decisiones emocionales; no elimina caídas ni garantiza rentabilidad.', 'Common error: thinking DCA removes risk. It reduces emotional decisions; it does not remove drawdowns or guarantee returns.'),
    [l('Define monto y frecuencia antes del ruido.', 'Define amount and frequency before the noise.'), l('Vincula el aporte al flujo de ingresos.', 'Tie the contribution to income flow.'), l('Revisa el sistema por calendario, no por miedo.', 'Review the system by calendar, not fear.')],
    l('¿Qué problema resuelve realmente DCA?', 'What problem does DCA actually solve?'), l('La repetición de decisiones emocionales sobre cuándo invertir.', 'Repeated emotional decisions about when to invest.'),
  ),
  'learn-money-05': design(
    l('¿Por qué perder 50% exige algo mucho más difícil que recuperar 50%?', 'Why does losing 50% require something much harder than recovering 50%?'),
    l('Antes de leer, define la pérdida máxima que aceptarías en una sola idea.', 'Before reading, define the maximum loss you would accept on one idea.'),
    [beat('La asimetría', 'The asymmetry', 'De 100 a 50 pierdes la mitad. Para volver de 50 a 100 necesitas duplicar: una ganancia del 100%.', 'From 100 to 50 you lose half. To return from 50 to 100 you must double: a 100% gain.'), beat('La decisión previa', 'The prior decision', 'El tamaño de posición convierte una tesis incierta en una pérdida tolerable. Se decide antes de sentir miedo.', 'Position size turns an uncertain thesis into a tolerable loss. It is decided before fear appears.'), beat('La salida observable', 'The observable exit', 'Una condición ligada a hechos evita el “saldré cuando se sienta mal”, que casi siempre llega tarde.', 'A fact-based exit condition avoids “I will leave when it feels bad,” which usually arrives late.')],
    l('Error común: usar un stop arbitrario sin relacionarlo con volatilidad, tesis o tamaño. El número solo no crea control.', 'Common error: using an arbitrary stop without relating it to volatility, thesis, or size. A number alone does not create control.'),
    [l('Protege primero la capacidad de seguir jugando.', 'Protect your ability to keep playing first.'), l('Tamaño y pérdida máxima son la misma ecuación.', 'Size and maximum loss are the same equation.'), l('La salida debe ser observable antes de entrar.', 'The exit must be observable before entry.')],
    l('¿Qué tres cosas deben existir antes de una operación?', 'Which three things must exist before a trade?'), l('Tamaño, pérdida máxima y condición de salida.', 'Size, maximum loss, and an exit condition.'),
  ),
  'learn-ai-01': design(
    l('¿Por qué el mismo modelo parece brillante con una instrucción y mediocre con otra?', 'Why can the same model look brilliant with one instruction and mediocre with another?'),
    l('Predice cuál bloque falta cuando una respuesta es correcta pero inútil.', 'Predict which block is missing when an answer is correct but useless.'),
    [beat('La ambigüedad', 'The ambiguity', 'El modelo completa huecos con supuestos probables. Cada hueco que dejas es una decisión que delegas sin control.', 'The model fills gaps with likely assumptions. Every gap is a decision you delegate without control.'), beat('El contrato', 'The contract', 'Objetivo, contexto, restricciones y formato convierten una petición vaga en un resultado que puedes evaluar.', 'Goal, context, constraints, and format turn a vague request into an output you can evaluate.'), beat('La prueba', 'The test', 'Un buen prompt no se juzga por cómo suena, sino por si produce un resultado repetible con criterios visibles.', 'A good prompt is not judged by how it sounds, but whether it produces repeatable output against visible criteria.')],
    l('Error común: asignar una “persona experta” y olvidar datos, restricciones y criterio de calidad.', 'Common error: assigning an “expert persona” while omitting data, constraints, and quality criteria.'),
    [l('Define el resultado antes del rol.', 'Define the outcome before the role.'), l('Entrega sólo el contexto que cambia la respuesta.', 'Provide only context that changes the answer.'), l('Especifica formato y criterio de aceptación.', 'Specify format and acceptance criteria.')],
    l('¿Cuáles son los cuatro bloques de un prompt ejecutable?', 'What are the four blocks of an executable prompt?'), l('Objetivo, contexto, restricciones y formato.', 'Goal, context, constraints, and format.'),
  ),
  'learn-ai-02': design(
    l('¿Qué información cambia una respuesta y cuál sólo ocupa tokens?', 'Which information changes an answer, and which only consumes tokens?'),
    l('Piensa en tres hechos que un modelo necesitaría para escribir como tu negocio.', 'Think of three facts a model would need to write like your business.'),
    [beat('El truco frágil', 'The fragile trick', 'Una frase ingeniosa puede mejorar una salida aislada, pero no enseña al modelo cómo funciona tu mundo.', 'A clever phrase can improve one output, but it does not teach the model how your world works.'), beat('Las tres capas', 'The three layers', 'Contexto estable explica identidad y reglas; contexto de tarea explica el objetivo; ejemplos muestran el estándar.', 'Stable context explains identity and rules; task context explains the goal; examples demonstrate the standard.'), beat('La compresión', 'The compression', 'El contexto debe ser suficiente para cambiar decisiones, pero corto para que la instrucción central no desaparezca.', 'Context must be sufficient to change decisions, but short enough that the core instruction remains visible.')],
    l('Error común: pegar documentos completos cuando bastaban cinco hechos y dos ejemplos.', 'Common error: pasting entire documents when five facts and two examples would suffice.'),
    [l('Separa contexto estable de contexto de tarea.', 'Separate stable context from task context.'), l('Usa ejemplos para mostrar calidad.', 'Use examples to demonstrate quality.'), l('Elimina datos que no cambian ninguna decisión.', 'Remove facts that change no decision.')],
    l('¿Qué prueba decide si un dato pertenece al contexto?', 'What test determines whether a fact belongs in context?'), l('Si eliminarlo no cambia una decisión del resultado, probablemente sobra.', 'If removing it changes no output decision, it probably does not belong.'),
  ),
  'learn-ai-03': design(
    l('¿Por qué usar el modelo más potente para todo puede empeorar un sistema?', 'Why can using the most powerful model for everything make a system worse?'),
    l('Clasifica mentalmente una tarea por riesgo, complejidad y coste de error.', 'Mentally classify a task by risk, complexity, and cost of error.'),
    [beat('La falsa seguridad', 'False security', 'Más capacidad no elimina instrucciones vagas ni datos malos. Sólo aumenta coste y latencia.', 'More capability does not fix vague instructions or bad data. It only raises cost and latency.'), beat('El ruteo', 'Routing', 'Tareas repetitivas y reversibles pueden usar rutas rápidas. Juicio ambiguo o acciones irreversibles necesitan más capacidad y revisión.', 'Repetitive reversible tasks can use fast routes. Ambiguous judgment or irreversible actions need more capability and review.'), beat('La escalada', 'Escalation', 'El sistema robusto empieza barato y escala por incertidumbre, no por prestigio del modelo.', 'A robust system starts cheap and escalates based on uncertainty, not model prestige.')],
    l('Error común: rutear por longitud del prompt en vez de por riesgo y ambigüedad.', 'Common error: routing by prompt length instead of risk and ambiguity.'),
    [l('Clasifica tarea, riesgo y reversibilidad.', 'Classify task, risk, and reversibility.'), l('Empieza con la ruta suficiente, no la máxima.', 'Start with the sufficient route, not the maximum one.'), l('Escala cuando la incertidumbre supera un umbral.', 'Escalate when uncertainty crosses a threshold.')],
    l('¿Qué dos señales obligan a escalar?', 'Which two signals force escalation?'), l('Alta incertidumbre y alto coste de error.', 'High uncertainty and high cost of error.'),
  ),
  'learn-ai-04': design(
    l('¿Qué parte de tu semana sigue copiando datos entre dos pantallas?', 'Which part of your week still copies data between two screens?'),
    l('Elige una tarea y nombra su evento inicial, transformación y acción final.', 'Choose one task and name its trigger, transformation, and final action.'),
    [beat('La unidad correcta', 'The right unit', 'Automatizar una app entera crea un proyecto. Automatizar un flujo concreto crea una victoria verificable.', 'Automating an entire app creates a project. Automating one concrete flow creates a verifiable win.'), beat('El esqueleto', 'The skeleton', 'Todo flujo necesita un trigger observable, una transformación definida y una acción con destino claro.', 'Every flow needs an observable trigger, a defined transformation, and an action with a clear destination.'), beat('La traza', 'The trace', 'Los logs convierten fallos invisibles en pasos reparables. Sin trazabilidad, la automatización sólo mueve errores más rápido.', 'Logs turn invisible failures into repairable steps. Without traceability, automation only moves errors faster.')],
    l('Error común: construir el camino feliz sin definir qué ocurre cuando falta un dato.', 'Common error: building the happy path without defining what happens when data is missing.'),
    [l('Empieza por un evento observable.', 'Start with an observable event.'), l('Haz una transformación pequeña y comprobable.', 'Make one small, testable transformation.'), l('Guarda salida, error y momento de ejecución.', 'Store output, error, and execution time.')],
    l('¿Cuáles son las tres piezas mínimas de un flujo?', 'What are the three minimum parts of a workflow?'), l('Trigger, transformación y acción.', 'Trigger, transformation, and action.'),
  ),
  'learn-ai-05': design(
    l('¿Qué acción nunca debería ejecutar un agente sin permiso?', 'Which action should an agent never execute without permission?'),
    l('Predice el peor resultado plausible si tu automatización recibe datos incorrectos.', 'Predict the worst plausible outcome if your automation receives bad data.'),
    [beat('Capacidad sin límite', 'Capability without limits', 'Un agente combina razonamiento y herramientas. El mismo poder que ahorra trabajo puede amplificar un supuesto equivocado.', 'An agent combines reasoning and tools. The same power that saves work can amplify a bad assumption.'), beat('La frontera', 'The boundary', 'Presupuesto, allowlists, límites de frecuencia y aprobación humana convierten intención en control ejecutable.', 'Budgets, allowlists, rate limits, and human approval turn intent into executable control.'), beat('La prueba de parada', 'The stop test', 'Un guardrail no existe hasta que demuestras que bloquea una acción fuera de límite.', 'A guardrail does not exist until you demonstrate that it blocks an out-of-bounds action.')],
    l('Error común: escribir “no hagas nada peligroso” en el prompt y llamarlo seguridad.', 'Common error: writing “do nothing dangerous” in the prompt and calling it security.'),
    [l('Limita herramientas y destinos.', 'Limit tools and destinations.'), l('Define presupuesto y frecuencia.', 'Define budget and frequency.'), l('Exige aprobación para acciones irreversibles.', 'Require approval for irreversible actions.')],
    l('¿Qué convierte una preferencia de seguridad en un guardrail?', 'What turns a safety preference into a guardrail?'), l('Una restricción ejecutable que bloquea y registra la acción.', 'An enforceable restriction that blocks and logs the action.'),
  ),
  'learn-growth-01': design(
    l('¿Qué promesa compra el segundo cuatro de tu contenido?', 'What promise earns second four of your content?'),
    l('Predice cuál apertura retiene más: presentarte o mostrar una pérdida específica.', 'Predict which opening retains more: introducing yourself or showing a specific loss.'),
    [beat('La subasta', 'The auction', 'Cada segundo compite con otro contenido. El espectador no debe atención; la apertura tiene que comprarla.', 'Every second competes with other content. The viewer owes no attention; the opening must earn it.'), beat('La tensión', 'The tension', 'Una pérdida, contraste o resultado específico abre una pregunta que el cerebro quiere cerrar.', 'A specific loss, contrast, or result opens a question the brain wants to close.'), beat('El pago', 'The payoff', 'El hook funciona cuando el contenido paga exactamente la curiosidad que abrió. Sin pago, la próxima pieza pierde confianza.', 'A hook works when the content pays off the exact curiosity it opened. Without payoff, the next piece loses trust.')],
    l('Error común: crear intriga sin prometer valor concreto. Eso produce click, no retención.', 'Common error: creating intrigue without promising concrete value. That produces a click, not retention.'),
    [l('Cero saludo antes de la tensión.', 'Zero greeting before tension.'), l('Una pérdida o resultado debe ser visible.', 'A loss or result must be visible.'), l('El cuerpo debe pagar la promesa del hook.', 'The body must pay off the hook promise.')],
    l('¿Cuáles son las tres piezas de un hook defendible?', 'What are the three parts of a defensible hook?'), l('Audiencia específica, tensión visible y payoff concreto.', 'Specific audience, visible tension, and concrete payoff.'),
  ),
  'learn-growth-02': design(
    l('¿Por qué tus amigos y clientes te mienten cuando les presentas tu idea?', 'Why do friends and clients lie to you when you pitch your idea?'),
    l('Convierte una pregunta hipotética sobre el futuro en una investigación de hechos pasados.', 'Turn a hypothetical future question into an investigation of past facts.'),
    [beat('El cumplido mortal', 'The deadly compliment', 'Cuando preguntas si usarían tu producto, dicen que sí para ser amables. Los cumplidos matan startups.', 'When you ask if they would use your product, they say yes to be kind. Compliments kill startups.'), beat('La regla de oro', 'The golden rule', 'Pregunta sobre su vida, no sobre tu idea. Indaga en qué intentaron la semana pasada y qué software ya pagan.', 'Ask about their life, not your idea. Inquire into what they tried last week and what tools they already pay for.'), beat('La evidencia económica', 'Economic evidence', 'Si no han intentado resolverlo ni han gastado tiempo o dinero en el pasado, el dolor no existe.', 'If they have not tried solving it or spent time or money in the past, the pain does not exist.')],
    l('Error común: preguntar «¿comprarías esto?» en vez de «¿cuánto gastaste resolviendo esto el mes pasado?».', 'Common error: asking «would you buy this?» instead of «how much did you spend solving this last month?».'),
    [l('Cero pitcheo de tu idea durante la entrevista.', 'Zero idea pitching during the interview.'), l('Pregunta solo por comportamientos pasados y dinero gastado.', 'Ask only about past behavior and money spent.'), l('Escucha el 80% del tiempo y toma notas literales.', 'Listen 80% of the time and write literal notes.')],
    l('¿Cuál es la regla sagrada de The Mom Test?', 'What is the sacred rule of The Mom Test?'), l('Hablar de su vida en el pasado, nunca de tu idea en el futuro.', 'Talk about their past life, never your future idea.'),
  ),
  'learn-growth-03': design(
    l('¿Qué deberías mejorar antes de bajar el precio?', 'What should you improve before lowering price?'),
    l('Identifica la palanca más débil de tu oferta: resultado, certeza, espera o esfuerzo.', 'Identify your offer’s weakest lever: outcome, certainty, delay, or effort.'),
    [beat('El descuento', 'The discount', 'Bajar precio trata la duda como si siempre fuera dinero. Muchas veces el comprador duda del resultado o del camino.', 'Lowering price treats every doubt as a money problem. Often the buyer doubts the outcome or the path.'), beat('La ecuación', 'The equation', 'El valor percibido sube con resultado y certeza; baja cuando espera y esfuerzo crecen.', 'Perceived value rises with outcome and certainty; it falls as delay and effort rise.'), beat('La primera victoria', 'The first win', 'Acercar un resultado pequeño y verificable reduce riesgo mejor que una promesa más grande y lejana.', 'Moving a small verifiable result closer reduces risk better than making a larger distant promise.')],
    l('Error común: añadir bonos que aumentan volumen y esfuerzo sin mejorar el resultado.', 'Common error: adding bonuses that increase volume and effort without improving the outcome.'),
    [l('Haz el resultado específico.', 'Make the outcome specific.'), l('Aumenta certeza con prueba y mecanismo.', 'Raise certainty with proof and mechanism.'), l('Reduce tiempo y esfuerzo hasta la primera victoria.', 'Reduce time and effort to the first win.')],
    l('¿Qué cuatro palancas componen el valor percibido?', 'Which four levers make up perceived value?'), l('Resultado, certeza, espera y esfuerzo.', 'Outcome, certainty, delay, and effort.'),
  ),
  'learn-growth-04': design(
    l('¿Puede tu idea sobrevivir si sólo tiene seis segundos?', 'Can your idea survive if it only has six seconds?'),
    l('Recorta mentalmente tu próximo video a interrupción, prueba y acción.', 'Mentally cut your next video down to interruption, proof, and action.'),
    [beat('La compresión', 'Compression', 'El límite obliga a elegir una sola transformación. Cada idea adicional compite con la principal.', 'The limit forces one transformation. Every extra idea competes with the main one.'), beat('La secuencia', 'The sequence', 'Primero interrumpes el patrón, luego demuestras el cambio y al final diriges una acción.', 'First interrupt the pattern, then demonstrate the change, then direct one action.'), beat('La lectura en voz alta', 'Read it aloud', 'El guion que cabe en una pantalla puede no caber en seis segundos. La voz revela densidad y ritmo.', 'A script that fits on screen may not fit in six seconds. Voice exposes density and rhythm.')],
    l('Error común: usar tres segundos para logo, nombre y contexto antes de entregar tensión.', 'Common error: spending three seconds on logo, name, and context before delivering tension.'),
    [l('0–2 s: interrumpe.', '0–2s: interrupt.'), l('2–5 s: demuestra.', '2–5s: demonstrate.'), l('5–6 s: dirige una acción.', '5–6s: direct one action.')],
    l('¿Cuál es la secuencia de un guion de seis segundos?', 'What is the sequence of a six-second script?'), l('Interrupción, prueba y acción.', 'Interruption, proof, and action.'),
  ),
  'learn-growth-05': design(
    l('¿Cuántas pruebas de mercado extraes de una sola idea?', 'How many market tests do you extract from one idea?'),
    l('Elige una tesis y predice cómo cambiaría en video, email y carrusel.', 'Choose one thesis and predict how it changes across video, email, and carousel.'),
    [beat('El desperdicio', 'The waste', 'Publicar una vez y abandonar la tesis confunde falta de distribución con falta de calidad.', 'Publishing once and abandoning the thesis confuses weak distribution with weak quality.'), beat('La adaptación', 'Adaptation', 'La idea central permanece; cambian la entrada, el formato y la acción natural de cada canal.', 'The central idea stays; the opening, format, and natural action of each channel change.'), beat('La lectura de señales', 'Reading signals', 'Retención, clic, guardado y respuesta diagnostican problemas distintos. Una sola métrica no explica todo.', 'Retention, click, save, and reply diagnose different problems. One metric cannot explain everything.')],
    l('Error común: copiar y pegar el mismo activo en todos los canales y llamarlo distribución.', 'Common error: copying the same asset into every channel and calling it distribution.'),
    [l('Conserva una tesis central.', 'Keep one core thesis.'), l('Adapta entrada y formato por canal.', 'Adapt opening and format by channel.'), l('Asigna una señal diagnóstica a cada versión.', 'Assign a diagnostic signal to each version.')],
    l('¿Qué cambia y qué permanece al distribuir?', 'What changes and what remains when distributing?'), l('Permanece la tesis; cambian entrada, formato, CTA y métrica.', 'The thesis remains; opening, format, CTA, and metric change.'),
  ),
  'learn-history-01': design(
    l('¿Por qué el 80% de las batallas históricas se decidían antes del primer choque?', 'Why were 80% of historical battles decided before the first clash?'),
    l('Predice qué factor pesa más: el número de soldados o la elección del terreno.', 'Predict which factor matters more: troop count or choice of terrain.'),
    [beat('La ilusión de la fuerza', 'The illusion of force', 'Tener más tropas no garantiza nada si el terreno te atrapa o agota tus suministros.', 'Having more troops guarantees nothing if terrain traps you or drains your supplies.'), beat('El cálculo previo', 'The prior calculation', 'El estratega calcula cinco factores: clima, terreno, doctrina, mando y disciplina. Si los números no favorecen, no combate.', 'The strategist calculates five factors beforehand: weather, terrain, doctrine, command, and discipline. If odds are poor, they do not fight.'), beat('La posición inexpugnable', 'The unassailable position', 'Colocarte donde no puedes ser derrotado y esperar el error del rival convierte la victoria en consecuencia, no en azar.', 'Standing where you cannot be defeated and awaiting the rival’s mistake turns victory into consequence, not chance.')],
    l('Error común: creer que el coraje sustituye al reconocimiento previo del terreno y la información.', 'Common error: believing courage replaces terrain reconnaissance and intelligence.'),
    [l('El terreno determina la táctica.', 'Terrain dictates tactics.'), l('Conoce a tu adversario y a ti mismo.', 'Know your rival and yourself.'), l('Gana primero en el mapa antes de marchar.', 'Win first on the map before marching.')],
    l('¿Cuál es la máxima fundamental de Sun Tzu sobre la victoria?', 'What is Sun Tzu’s core maxim on victory?'),
    l('Los guerreros victoriosos ganan primero y luego van a la guerra; los derrotados van a la guerra primero y luego buscan ganar.', 'Victorious warriors win first and then go to war, while defeated warriors go to war first and then seek to win.'),
  ),
  'learn-history-02': design(
    l('¿Cómo se somete al enemigo sin librar una sola batalla sangrienta?', 'How do you subdue the enemy without fighting a single bloody battle?'),
    l('Piensa qué desarma a un rival más rápido: destruir sus murallas o quebrar sus alianzas.', 'Think what disarms a rival faster: destroying their walls or breaking their alliances.'),
    [beat('El coste de la fuerza', 'The cost of force', 'Sitiar ciudades amuralladas consume meses y desgasta tus propias reservas.', 'Besieging walled cities drains months and burns your own reserves.'), beat('El ataque a la estrategia', 'Attacking strategy', 'La suprema excelencia consiste en desarticular los planes del adversario antes de que maduren.', 'Supreme excellence consists in breaking the enemy’s plans before they mature.'), beat('El aislamiento diplomático', 'Diplomatic isolation', 'Cortar sus suministros y aislarlo de aliados fuerza la rendición con mínima pérdida de vidas.', 'Cutting supplies and severing alliances forces surrender with minimal casualties.')],
    l('Error común: medir el éxito por el número de bajas causadas en lugar de objetivos estratégicos cumplidos.', 'Common error: measuring success by enemy casualties rather than strategic goals achieved.'),
    [l('La mejor victoria preserva tus propios recursos.', 'The best victory preserves your own resources.'), l('Ataca primero la mente y alianzas del rival.', 'Attack the rival’s mind and alliances first.'), l('La diplomacia armada supera al combate frontal.', 'Armed diplomacy beats frontal slaughter.')],
    l('¿Qué constituye la suprema excelencia en el mando estratégico?', 'What constitutes supreme excellence in strategic command?'),
    l('Someter al adversario sin librar combate directo.', 'Subduing the enemy without direct fighting.'),
  ),
  'learn-history-03': design(
    l('¿Por qué la fuerza bruta frontal pierde sistemáticamente ante la maniobra?', 'Why does frontal brute force lose consistently to maneuver?'),
    l('Analiza cómo Aníbal rodeó y destruyó un ejército romano dos veces mayor en Cannas.', 'Analyze how Hannibal encircled and crushed a Roman army twice his size at Cannae.'),
    [beat('El cebo central', 'The central bait', 'Aníbal colocó a sus tropas más débiles en el centro para retroceder ordenadamente ante la embestida romana.', 'Hannibal placed his weakest troops in the center to retreat orderly under the Roman assault.'), beat('El arco inverso', 'The inverted arc', 'A medida que Roma empujaba creyendo que ganaba, sus flancos quedaron atrapados entre la caballería de élite cartaginesa.', 'As Rome pushed forward believing it was winning, its flanks were trapped by elite Carthaginian cavalry.'), beat('El cerco perfecto', 'The perfect envelopment', 'La victoria no fue de músculo, sino de geometría táctica y gestión de las expectativas del enemigo.', 'Victory came not from muscle, but from tactical geometry and managing enemy expectations.')],
    l('Error común: confundir empuje agresivo con ventaja táctica real.', 'Common error: confusing aggressive push with real tactical leverage.'),
    [l('El centro cede para absorber energía.', 'The center yields to absorb momentum.'), l('Los flancos cierran la trampa.', 'The flanks spring the trap.'), l('La maniobra geométrica vence al volumen.', 'Geometric maneuver beats brute volume.')],
    l('¿Cuál fue el principio clave de la maniobra de Cannas?', 'What was the key principle of the Cannae maneuver?'),
    l('Usar el ímpetu y agresividad del enemigo para cerrarle el cerco.', 'Using the enemy’s own aggression and momentum to close the trap.'),
  ),
  'learn-history-04': design(
    l('¿Cómo tomar decisiones críticas cuando el 70% de los datos son confusos o falsos?', 'How do you make critical decisions when 70% of data is noisy or false?'),
    l('Identifica qué guía a un comandante en la niebla: la intuición ciega o reglas de decisión robustas.', 'Identify what guides a commander in the fog: blind hunch or robust decision heuristics.'),
    [beat('La fricción constante', 'Constant friction', 'En la teoría todo es simple; en el terreno real, el lodo, el miedo y las órdenes mal transmitidas crean caos.', 'In theory all is simple; in reality mud, fear, and garbled orders create friction and chaos.'), beat('El margen de seguridad', 'The margin of safety', 'Los planes que requieren precisión milimétrica fracasan. Los planes resilientes toleran errores masivos de comunicación.', 'Plans requiring millimeter precision collapse. Resilient plans tolerate major communications failures.'), beat('La iniciativa local', 'Local initiative', 'Dar libertad de ejecución a los mandos subordinados sobre el terreno vence a la microgestión centralizada.', 'Granting tactical freedom to frontline officers beats centralized micromanagement.')],
    l('Error común: paralizarse esperando certeza total que nunca llegará.', 'Common error: freezing while waiting for 100% certainty that never comes.'),
    [l('Asume fricción y retrasos en cada orden.', 'Assume friction and delays in every command.'), l('Diseña planes tolerantes a fallos.', 'Design fault-tolerant plans.'), l('Empodera la decisión en primera línea.', 'Empower frontline decision-making.')],
    l('¿Cómo define Clausewitz la fricción militar?', 'How does Clausewitz define military friction?'),
    l('La acumulación de innumerables pequeños factores que hacen que lo más sencillo resulte sumamente difícil.', 'The countless small factors that make the simplest things excruciatingly difficult.'),
  ),
  'learn-history-05': design(
    l('¿Qué debilita a los imperios más poderosos antes de que caigan?', 'What weakens mighty empires long before they fall?'),
    l('Compara si Roma cayó por invasiones bárbaras o por erosión interna previa.', 'Compare whether Rome fell to barbarian invasions or prior internal decay.'),
    [beat('La complacencia', 'Complacency', 'Generaciones nacidas en abundancia olvidan la disciplina y el rigor que construyeron las instituciones.', 'Generations born into abundance forget the discipline that forged their institutions.'), beat('La degradación del valor', 'Currency debasement', 'El gasto descontrolado y la devaluación constante de la moneda destruyen la confianza del ciudadano en el futuro.', 'Unchecked spending and persistent debasement destroy public confidence in the future.'), beat('La fractura cívica', 'Civic fracturing', 'Cuando los intereses facciosos superan al deber colectivo, el sistema se quiebra al primer choque externo.', 'When factional interests overwhelm collective duty, the system fractures on the first external shock.')],
    l('Error común: atribuir el colapso al enemigo exterior ignorando la fragilidad estructural interna.', 'Common error: blaming external enemies while ignoring structural internal fragility.'),
    [l('La disciplina precede a la prosperidad.', 'Discipline precedes prosperity.'), l('La devaluación mina la confianza en el sistema.', 'Debasement undermines institutional trust.'), l('La resiliencia exige renovación continua.', 'Resilience demands continuous renewal.')],
    l('¿Cuál es la principal causa histórica de declive sistémico?', 'What is the primary historical cause of systemic decline?'),
    l('La pérdida de disciplina institucional interna y la degradación de la cohesión cívica.', 'The loss of internal institutional discipline and the decay of civic cohesion.'),
  ),
  'learn-mindset-01': design(
    l('¿Qué porcentaje de tu estrés proviene de cosas que no puedes alterar?', 'What percentage of your daily stress stems from things you cannot alter?'),
    l('Separa mentalmente las variables de hoy en dos columnas: bajo tu control y fuera de tu control.', 'Mentally split today’s variables into two columns: within your control and outside your control.'),
    [beat('La división fundamental', 'The core divide', 'Tus pensamientos, decisiones y esfuerzo están bajo tu gobierno. La economía, las opiniones ajenas y el clima no lo están.', 'Your thoughts, decisions, and effort are under your rule. The economy, other opinions, and the weather are not.'), beat('El drenaje de energía', 'Energy drain', 'Cada minuto gastado en quejarse de lo incontrolable es energía que le robas a tu ejecución deliberada.', 'Every minute spent lamenting the uncontrollable is energy stolen from deliberate execution.'), beat('La fortaleza interior', 'The inner fortress', 'Cuando anclas tu serenidad únicamente en la calidad de tus acciones, nada externo puede desestabilizarte.', 'When your calm is anchored only in the quality of your own actions, nothing external can shake you.')],
    l('Error común: creer que el estoicismo es apatía o resignación pasiva.', 'Common error: believing Stoicism is cold apathy or passive resignation.'),
    [l('Identifica qué depende de ti.', 'Identify what is in your control.'), l('Acepta con calma lo que no puedes gobernar.', 'Accept what you cannot govern calmly.'), l('Dedica el 100% de tu energía a tu respuesta interna.', 'Pour 100% of your energy into your internal response.')],
    l('¿Dónde reside el único poder del estoico según Epicteto?', 'Where does the Stoic’s only true power reside according to Epictetus?'),
    l('En el juicio que emite y en las acciones que decide tomar ante los hechos.', 'In their own judgments and the deliberate actions they choose in response to events.'),
  ),
  'learn-mindset-02': design(
    l('¿Por qué perder $100 duele el doble de lo que alegra ganar $100?', 'Why does losing $100 hurt twice as much as gaining $100 feels good?'),
    l('Evalúa cómo la aversión a la pérdida te paraliza antes de lanzar un proyecto o cerrar una mala posición.', 'Evaluate how loss aversion paralyzes you before launching an idea or cutting a bad position.'),
    [beat('El sesgo evolutivo', 'The evolutionary bias', 'Para nuestros antepasados, evitar la muerte era vital; perder una oportunidad era secundario. El cerebro sobrevalora la pérdida.', 'For early humans, avoiding death was vital; missing a reward was secondary. The brain overweighs loss.'), beat('La trampa del coste hundido', 'The sunk cost trap', 'Mantener una inversión fallida solo para no admitir la pérdida inicial multiplica el daño a largo plazo.', 'Clinging to a failing bet just to avoid acknowledging the loss multiplies long-term damage.'), beat('La regla de decisión asimétrica', 'Asymmetric decision rule', 'Decidir mirando el valor esperado futuro y no el dinero gastado en el pasado libera la mente de ataduras emocionales.', 'Deciding based on expected future value rather than past sunk costs frees the mind from emotional drag.')],
    l('Error común: no cortar pérdidas temprano por el apego al orgullo personal.', 'Common error: refusing to cut losses early due to ego attachment.'),
    [l('Reconoce la aversión biológica a la pérdida.', 'Acknowledge the biological fear of loss.'), l('Ignora los costes que ya no puedes recuperar.', 'Ignore sunk costs you cannot recover.'), l('Decide basado en la expectativa hacia adelante.', 'Decide on forward-looking expected value.')],
    l('¿Qué sesgo documentado por Kahneman explica la reticencia a vender en pérdida?', 'Which bias documented by Kahneman explains the reluctance to sell at a loss?'),
    l('La aversión a la pérdida combinada con la falacia del coste hundido.', 'Loss aversion combined with the sunk cost fallacy.'),
  ),
  'learn-mindset-03': design(
    l('¿Cómo convertir cada obstáculo que encuentras en combustible puro?', 'How do you turn every obstacle you face into raw fuel?'),
    l('Recuerda el último contratiempo grave y busca la oportunidad oculta que forzó en ti.', 'Recall the last severe setback and find the hidden opportunity it forced into you.'),
    [beat('La resistencia natural', 'The natural friction', 'Cuando el camino se bloquea, la reacción inmediata es frustración y resentimiento.', 'When the path is blocked, the immediate human reaction is frustration and resentment.'), beat('El giro mental', 'The mental pivot', 'Marco Aurelio observó: el impedimento a la acción hace avanzar la acción. Lo que se interpone en el camino se convierte en el camino.', 'Marcus Aurelius noted: the impediment to action advances action. What stands in the way becomes the way.'), beat('Amor Fati en la práctica', 'Amor Fati in practice', 'No solo tolerar lo que ocurre, sino amarlo como una oportunidad de forjar paciencia, coraje o astucia.', 'Not merely tolerating what occurs, but loving it as a crucible to forge patience, courage, or resourcefulness.')],
    l('Error común: quejarse del obstáculo en lugar de usarlo como banco de pruebas.', 'Common error: complaining about obstacles rather than using them as testing grounds.'),
    [l('El obstáculo revela debilidades a subsanar.', 'The obstacle exposes weaknesses to fix.'), l('Cambia la pregunta de “¿por qué a mí?” a “¿cómo uso esto?”.', 'Shift from “why me?” to “how do I use this?”.'), l('El fuego convierte cualquier leña en llama.', 'Fire turns any fuel into flame.')],
    l('¿Qué enseña el principio del obstáculo es el camino?', 'What does the obstacle is the way principle teach?'),
    l('Que los reveses no detienen el progreso, sino que se convierten en la materia prima para crecer.', 'That setbacks do not halt progress; they become the raw material for growth.'),
  ),
  'learn-mindset-04': design(
    l('¿Qué te dices a ti mismo en el primer segundo tras cometer un error?', 'What do you say to yourself in the first second after making a mistake?'),
    l('Identifica la voz interna de autocrítica destructiva y sustitúyela por una evaluación neutral.', 'Identify the voice of destructive self-criticism and replace it with neutral diagnostics.'),
    [beat('El eco catastrófico', 'The catastrophic echo', 'Un error menor genera frases absolutas: “siempre arruino todo” o “no sirvo para esto”.', 'A minor slip triggers absolute statements: “I always mess up” or “I am not cut out for this”.'), beat('La separación del observador', 'Observer separation', 'Tú no eres tus pensamientos automáticos; eres la consciencia que decide si creerles o descartarlos.', 'You are not your automatic thoughts; you are the awareness choosing whether to believe or discard them.'), beat('El diagnóstico objetivo', 'Objective diagnosis', 'Sustituye juicios morales por preguntas operativas: ¿qué dato falló y cómo corrijo el sistema?', 'Replace moral self-judgments with operational questions: what data was flawed, and how do I fix the system?')],
    l('Error común: identificarse con la emoción transitoria de culpa.', 'Common error: over-identifying with transient guilt feelings.'),
    [l('Trata los fallos como datos experimentales.', 'Treat mistakes as experimental data points.'), l('Elimina las palabras “siempre” y “nunca”.', 'Eliminate the words “always” and “never”.'), l('Corrige el proceso, no castigues tu identidad.', 'Fix the process; do not beat down your identity.')],
    l('¿Cómo se desarma un bucle de rumiación negativa?', 'How do you dismantle a negative rumination loop?'),
    l('Describiendo los hechos de forma fría y haciendo una pregunta orientada a la acción inmediata.', 'Describing facts objectively and asking an action-oriented diagnostic question.'),
  ),
  'learn-mindset-05': design(
    l('¿Cómo construir una mente que no dependa del aplauso ni tema la crítica?', 'How do you build a mind that craves no applause and fears no criticism?'),
    l('Reflexiona: ¿cuántas decisiones tomaste este año solo para complacer a personas que no respetas?', 'Reflect: how many choices did you make this year just to please people you do not respect?'),
    [beat('La aprobación prestada', 'Borrowed approval', 'Buscar validación ajena pone la llave de tu autoestima en el bolsillo de extraños.', 'Seeking external validation puts the key to your self-worth in strangers’ pockets.'), beat('La brújula interna', 'The internal compass', 'El guerrero y el pensador definen su estándar antes de salir al mundo. Si la acción fue recta, el ruido exterior carece de peso.', 'The warrior and thinker set their standard before entering the arena. If the act was just, noise holds no weight.'), beat('La ecuanimidad', 'Equanimity', 'Tratar al éxito y al fracaso como dos impostores idénticos preserva la claridad mental a largo plazo.', 'Treating triumph and disaster as identical impostors preserves long-term lucidity.')],
    l('Error común: cambiar de rumbo ante la primera crítica superficial de redes sociales.', 'Common error: changing direction at the first wave of casual internet criticism.'),
    [l('Define tu propio estándar de excelencia.', 'Define your own standard of excellence.'), l('La crítica sin experiencia es solo ruido.', 'Criticism without skin in the game is mere noise.'), l('Mantén la mente imperturbable ante elogios y censuras.', 'Remain steady in the face of both praise and blame.')],
    l('¿Qué define a la mente verdaderamente libre según Séneca?', 'What defines a truly free mind according to Seneca?'),
    l('Aquella que no se eleva con la prosperidad ni se doblega con la adversidad.', 'One that neither inflates with prosperity nor bends under adversity.'),
  ),
  'learn-perf-01': design(
    l('¿Por qué 90 minutos de foco absoluto superan a 8 horas de trabajo interrumpido?', 'Why do 90 minutes of pure focus beat 8 hours of interrupted work?'),
    l('Calcula cuántas veces revisas WhatsApp, correo o redes durante una sesión típica de trabajo.', 'Count how many times you check notifications during a typical work session.'),
    [beat('La fragmentación letal', 'Lethal fragmentation', 'Cada interrupción de 2 segundos deja un “residuo de atención” que tarda hasta 20 minutos en limpiarse.', 'Every 2-second ping leaves an “attention residue” that takes up to 20 minutes to clear.'), beat('La ley del trabajo profundo', 'The law of deep work', 'La producción de alto valor no responde a horas sentado, sino a intensidad de atención multiplicada por tiempo ininterrumpido.', 'High-value output is not hours in a chair; it is intensity of attention multiplied by uninterrupted time.'), beat('El santuario cognitivo', 'The cognitive sanctuary', 'Aislar un bloque matutino sin teléfonos ni alertas crea una ventaja competitiva imposible de igualar.', 'Carving out an early block with zero phones or alerts creates an unassailable competitive advantage.')],
    l('Error común: confundir estar ocupado con estar creando valor real.', 'Common error: confusing being busy with producing actual high-leverage value.'),
    [l('El multitasking es una ilusión biológica.', 'Multitasking is a biological illusion.'), l('El residuo de atención degrada el razonamiento.', 'Attention residue degrades complex reasoning.'), l('Protege 90 minutos de oro cada mañana.', 'Guard 90 golden minutes every morning.')],
    l('¿Cuál es la fórmula del Deep Work formulada por Cal Newport?', 'What is Cal Newport’s formula for Deep Work?'),
    l('Trabajo de alto valor = Tiempo dedicado × Intensidad de la concentración.', 'High-value work produced = Time spent × Intensity of concentration.'),
  ),
  'learn-perf-02': design(
    l('¿Por qué cuesta tanto empezar un buen hábito y es tan fácil caer en la distracción?', 'Why is starting a good habit so hard while falling into distraction is so easy?'),
    l('Mide la fricción en segundos que existe entre tu mano y tu teléfono vs. tu mano y tu libro.', 'Measure the friction in seconds between your hand and phone vs. your hand and book.'),
    [beat('La regla de los 2 minutos', 'The 2-minute rule', 'Cualquier hábito nuevo debe poder iniciarse en menos de dos minutos. No intentes correr un maratón; ponte las zapatillas.', 'Every new habit should take under two minutes to start. Do not try to run a marathon; just tie your shoes.'), beat('El diseño de la fricción', 'Friction engineering', 'Reduce la fricción de lo productivo (deja la libreta abierta) y aumenta la fricción del vicio (guarda el teléfono en otra habitación).', 'Lower friction for good habits (leave the notepad open) and raise friction for vices (keep phone in another room).'), beat('La identidad atómica', 'Atomic identity', 'Cada pequeña acción es un voto por la persona en la que te estás convirtiendo.', 'Every small action is a vote for the type of person you wish to become.')],
    l('Error común: depender de la fuerza de voluntad en lugar de rediseñar el entorno físico.', 'Common error: relying on sheer willpower instead of redesigning physical surroundings.'),
    [l('Haz que lo productivo sea evidente y fácil.', 'Make productive habits obvious and frictionless.'), l('Haz que la distracción sea invisible y difícil.', 'Make distraction invisible and high-friction.'), l('La consistencia atómica supera a los esfuerzos heroicos.', 'Atomic consistency beats intermittent heroics.')],
    l('¿Cuál es la mejor manera de vencer la procrastinación según James Clear?', 'What is the best way to defeat procrastination according to James Clear?'),
    l('Reducir la fricción inicial para que el primer paso tome menos de dos minutos.', 'Reducing initial friction so the very first action takes under two minutes.'),
  ),
  'learn-perf-03': design(
    l('¿Qué hábito matutino de 10 minutos calibra tu energía y claridad para todo el día?', 'What 10-minute morning habit calibrates energy and clarity for your entire day?'),
    l('Descubre cómo la luz solar temprana programa tus relojes biológicos y niveles de dopamina.', 'Discover how early sunlight sets your biological clocks and baseline dopamine.'),
    [beat('El reloj celular', 'The cellular clock', 'Tus ojos tienen neuronas especializadas que le indican al núcleo supraquiasmático cuándo es hora de producir cortisol activo.', 'Your eyes have neurons telling the suprachiasmatic nucleus when to release active cortisol.'), beat('El bloqueo del bajón', 'Preventing the afternoon slump', 'Retrasar la ingesta de cafeína 60–90 minutos tras despertar evita el temido colapso de adenosina de la tarde.', 'Delaying caffeine 60–90 minutes after waking prevents the notorious afternoon adenosine crash.'), beat('La higiene lumínica nocturna', 'Night light hygiene', 'La luz brillante después de las 9:00 PM suprime la melatonina y destruye la arquitectura reparadora del sueño profundo.', 'Bright screens after 9:00 PM suppress melatonin and shatter deep restorative sleep architecture.')],
    l('Error común: mirar pantallas con luz artificial en la cama antes de salir al sol.', 'Common error: scrolling phones in bed under dim artificial light before seeing natural sun.'),
    [l('Obtén 10 minutos de luz solar directa al despertar.', 'Get 10 minutes of direct morning sunlight.'), l('Pospón el café 90 minutos para regular adenosina.', 'Postpone caffeine 90 minutes for adenosine clearance.'), l('Atenúa luces al anochecer para proteger el sueño.', 'Dim lights after dusk to protect deep recovery.')],
    l('¿Por qué es fundamental la luz natural matutina según la neurobiología moderna?', 'Why is early natural light essential in modern neurobiology?'),
    l('Porque activa el pico saludable de cortisol diurno e inicia el temporizador de melatonina para la noche.', 'Because it triggers a healthy daytime cortisol pulse and starts the 14-hour melatonin timer for sleep.'),
  ),
  'learn-perf-04': design(
    l('¿De qué te sirve tener 4 horas libres si tu energía ejecutiva está en cero?', 'What good are 4 open hours if your executive energy is depleted to zero?'),
    l('Analiza a qué hora del día tu cerebro rinde con máxima lucidez y si estás usando ese tiempo en tonterías.', 'Analyze what time of day your mind peaks and whether you are wasting it on low-leverage trivia.'),
    [beat('La falacia del tiempo', 'The time fallacy', 'Gestionar el calendario sin gestionar la glucosa, el descanso y el estrés crea agotamiento crónico.', 'Managing calendars without managing glucose, rest, and stress leads to chronic burnout.'), beat('Los ritmos ultradianos', 'Ultradian rhythms', 'El cerebro opera en ciclos de 90 minutos de alto rendimiento seguidos de 10 a 20 minutos de recuperación obligatoria.', 'The human brain operates in 90-minute high-focus cycles followed by 10–20 minutes of required downshift.'), beat('La asignación táctica', 'Tactical allocation', 'Reserva tu ventana de mayor energía biológica para la tarea que mueve la aguja, no para responder correos.', 'Reserve your peak biological window for the single needle-moving task, not for answering email.')],
    l('Error común: agotar tu mejor energía matutina en tareas reactivas de bajo impacto.', 'Common error: burning your best morning energy on reactive low-value chores.'),
    [l('Gestiona tu energía, no solo tus horas.', 'Manage your energy, not just your hours.'), l('Trabaja en bloques ultradianos de 90 minutos.', 'Work in 90-minute ultradian rhythms.'), l('El descanso estratégico es parte de la producción.', 'Strategic recovery is part of elite production.')],
    l('¿Cuál es la duración óptima de un ciclo de foco intenso según la fisiología del cerebro?', 'What is the optimal focus cycle length according to brain physiology?'),
    l('Aproximadamente 90 minutos seguidos de una pausa de descanso fisiológico.', 'Approximately 90 minutes followed by a brief physiological recovery window.'),
  ),
  'learn-perf-05': design(
    l('¿Cómo apagar la mente del trabajo al terminar la tarde sin rumiar problemas toda la noche?', 'How do you turn off work at the end of the day without ruminating all night?'),
    l('Prueba el ritual de cierre: si no le dices a tu cerebro que el día terminó, seguirá gastando RAM en segundo plano.', 'Try the shutdown ritual: if you do not declare the day closed, your brain runs background RAM all night.'),
    [beat('El efecto Zeigarnik', 'The Zeigarnik effect', 'Las tareas abiertas e incompletas permanecen vivas en la memoria de trabajo generando ansiedad difusa.', 'Unfinished, open tasks linger in working memory, creating background cognitive anxiety.'), beat('El plan de contingencia', 'The contingency plan', 'Al anotar exactamente qué harás con cada tema abierto mañana a primera hora, el cerebro libera la alerta.', 'By noting exactly how you will tackle open items tomorrow, the brain safely releases the alert.'), beat('La frase de apagado', 'The shutdown phrase', 'Cerrar la libreta o laptop y pronunciar un comando verbal explícito (“cierre completado”) entrena al sistema nervioso.', 'Closing the laptop and stating an explicit verbal command (“shutdown complete”) trains the nervous system.')],
    l('Error común: dejar la laptop abierta y revisar mensajes de trabajo a las 11:00 PM.', 'Common error: leaving laptops open and checking slack at 11:00 PM.'),
    [l('Vacía tus pendientes en una lista antes de parar.', 'Capture all loose loops into a trusted list before stopping.'), l('Asigna una acción para mañana.', 'Assign the first action for tomorrow.'), l('Desconecta formalmente y no vuelvas a entrar.', 'Formally disconnect and do not log back in.')],
    l('¿Qué problema psicológico resuelve el ritual de cierre?', 'What psychological problem does the shutdown ritual resolve?'),
    l('Elimina el efecto Zeigarnik asegurando al cerebro que las tareas pendientes están bajo control.', 'It silences the Zeigarnik effect by assuring the brain that pending tasks are safely captured.')
  ),
  'learn-data-01': design(
    l('¿Por qué el 90% de los patrones que ves en gráficos son ilusiones de tu cerebro?', 'Why are 90% of patterns you spot in charts sheer illusions of your brain?'),
    l('Predice por qué dos métricas que suben juntas casi nunca significan que una causa a la otra.', 'Predict why two metrics rising together almost never mean one causes the other.'),
    [
      beat('La ilusión del patrón', 'The pattern illusion', 'El cerebro humano evolucionó para ver amenazas y caras en las nubes. En big data, dos series cualesquiera pueden correlacionar 0.95 por pura coincidencia estacional.', 'The human brain evolved to spot threats and faces in clouds. In big data, any two series can show 0.95 correlation purely by seasonal luck.'),
      beat('El mecanismo causal', 'The causal mechanism', 'Para que los datos sean accionables, necesitas una hipótesis de causa verificable: si cambio X, Y debe moverse debido a Z.', 'For data to be actionable, you need a testable causal hypothesis: if I change X, Y moves because of Z.'),
      beat('El sesgo de confirmación', 'Confirmation bias', 'Si buscas en un dataset sin hipótesis previa, siempre encontrarás un gráfico que justifique lo que ya querías hacer.', 'If you search a dataset without a prior hypothesis, you will always find a chart justifying what you already wanted to do.')
    ],
    l('Error común: confundir correlación con causalidad y tomar decisiones caras basadas en ruido.', 'Common error: confusing correlation with causation and making expensive decisions on noise.'),
    [
      l('Plantea la hipótesis antes de mirar los datos.', 'State the hypothesis before looking at the data.'),
      l('Busca el mecanismo causal observable.', 'Look for the observable causal mechanism.'),
      l('Distingue coincidencia de significancia.', 'Distinguish coincidence from statistical significance.')
    ],
    l('¿Cuál es la regla de oro para validar una relación entre dos métricas?', 'What is the golden rule to validate a relation between two metrics?'),
    l('Exigir un mecanismo causal observable y contrastarlo con una prueba controlada.', 'Demand an observable causal mechanism and test it against a controlled experiment.')
  ),
  'learn-data-02': design(
    l('¿Por qué tus métricas favoritas pueden estar subiendo mientras tu negocio se muere?', 'Why can your favorite metrics climb while your business is quietly dying?'),
    l('Identifica cuál de tus números actuales infla el ego y cuál mide retención real.', 'Identify which of your current numbers flatters ego and which measures true retention.'),
    [
      beat('La trampa de vanidad', 'The vanity trap', 'Visitas web, descargas acumuladas y seguidores son acumulativos: siempre suben, pero no pagan las cuentas.', 'Pageviews, cumulative downloads, and follower counts are cumulative: they always rise, but pay no bills.'),
      beat('La métrica North Star', 'The North Star metric', 'Es el único número que captura el momento exacto en que el usuario recibe el valor principal prometido.', 'It is the single number capturing the exact moment the user receives core promised value.'),
      beat('La cohorte que no miente', 'Cohorts that never lie', 'Agrupar usuarios por semana de llegada y medir quién sigue activo a 30 días revela la verdad desnuda.', 'Grouping users by week of arrival and measuring who stays active at 30 days reveals raw reality.')
    ],
    l('Error común: celebrar picos de tráfico que no convierten en usuarios recurrentes.', 'Common error: celebrating traffic spikes that convert zero retained repeat users.'),
    [
      l('Mide valor entregado, no solo actividad.', 'Measure value delivered, not just activity.'),
      l('Analiza cohortes por fecha de entrada.', 'Analyze cohorts by join date.'),
      l('Elimina métricas acumulativas engañosas.', 'Discard misleading cumulative metrics.')
    ],
    l('¿Qué define a una verdadera métrica North Star?', 'What defines a true North Star metric?'),
    l('Mide la frecuencia con la que los usuarios experimentan el valor central del producto.', 'It measures how frequently users experience core product value.')
  ),
  'learn-data-03': design(
    l('¿Por qué mirar los resultados de un test A/B todos los días garantiza que tomes la decisión equivocada?', 'Why does peeking at A/B test results every day ensure you make the wrong decision?'),
    l('Predice qué pasa cuando declaras victoria en un test con solo 50 conversiones.', 'Predict what happens when declaring victory on a test with only 50 conversions.'),
    [
      beat('El problema del espía', 'The peeking problem', 'Si revisas un test continuo cada hora, la probabilidad de ver un falso positivo supera el 30% debido a varianza temporal.', 'If you check an ongoing test hourly, false positive probability exceeds 30% due to temporary variance.'),
      beat('La significancia estadística', 'Statistical significance', 'Un p-value < 0.05 significa que la diferencia observada tiene menos del 5% de probabilidad de ser casualidad.', 'A p-value < 0.05 means the observed delta has less than 5% probability of being sheer chance.'),
      beat('El tamaño de muestra previo', 'Pre-calculated sample size', 'Calcula cuántos usuarios necesitas antes de empezar y no toques el experimento hasta alcanzarlos.', 'Calculate required sample size upfront and do not touch the experiment until reached.')
    ],
    l('Error común: apagar una prueba B ganadora el día 2 sin poder estadístico suficiente.', 'Common error: shutting down a test on day 2 without statistical power.'),
    [
      l('Calcula el tamaño de muestra antes de lanzar.', 'Calculate sample size before launching.'),
      l('No tomes decisiones basadas en fluctuaciones iniciales.', 'Do not decide on early fluctuations.'),
      l('Comprueba significancia estadística y poder.', 'Verify statistical significance and power.')
    ],
    l('¿Qué se requiere antes de declarar un ganador en una prueba A/B?', 'What is required before declaring an A/B test winner?'),
    l('Alcanzar el tamaño de muestra calculado y un p-value estadísticamente significativo (< 0.05).', 'Reach target sample size and statistically significant p-value (< 0.05).')
  ),
  'learn-data-04': design(
    l('¿Por qué un modelo predictivo con 99% de precisión en tu laptop puede quebrar tu empresa mañana?', 'Why can a predictive model with 99% accuracy on your laptop bankrupt you tomorrow?'),
    l('Entiende la diferencia entre memorizar el examen y aprender la materia.', 'Understand the difference between memorizing the test and learning the subject.'),
    [
      beat('El monstruo del Overfitting', 'The overfitting beast', 'Un modelo con demasiados parámetros memoriza el ruido y las peculiaridades del pasado en vez de la regla general.', 'A model with too many parameters memorizes historical noise and quirks rather than the general rule.'),
      beat('El trade-off Sesgo vs Varianza', 'The Bias-Variance tradeoff', 'Modelos demasiado simples no capturan la realidad; modelos demasiado complejos se rompen ante datos nuevos.', 'Overly simple models underfit; overly complex models break upon seeing fresh data.'),
      beat('La validación cruzada', 'Cross-validation', 'Separa siempre un conjunto ciego de datos de prueba (test set) que el modelo jamás haya visto.', 'Always isolate a blind holdout test set that the model has never seen.')
    ],
    l('Error común: evaluar modelos usando los mismos datos con los que fueron entrenados.', 'Common error: evaluating models on the exact data they trained on.'),
    [
      l('Separa siempre datos de entrenamiento y prueba.', 'Always split train and test holdouts.'),
      l('Prefiere modelos simples y robustos.', 'Favor simple, robust architectures.'),
      l('Monitorea la degradación en producción.', 'Monitor drift in production.')
    ],
    l('¿Cómo detectas si un modelo sufre de sobreajuste (overfitting)?', 'How do you detect if a model suffers from overfitting?'),
    l('Alta precisión en datos de entrenamiento, pero caída drástica en datos nuevos o de prueba.', 'High accuracy on train data, but sharp performance drop on fresh test data.')
  ),
  'learn-data-05': design(
    l('¿De qué sirve un dashboard con 50 gráficos si nadie sabe qué hacer el lunes por la mañana?', 'What good is a 50-chart dashboard if nobody knows what to do Monday morning?'),
    l('Transforma un reporte pasivo de datos en una decisión binaria con impacto económico.', 'Transform a passive data report into a binary decision with financial impact.'),
    [
      beat('La trampa del cementerio de dashboards', 'The dashboard graveyard trap', 'La mayoría de dashboards en empresas solo sirven para que los ejecutivos asientan con la cabeza sin cambiar nada.', 'Most enterprise dashboards only serve to let executives nod without changing anything.'),
      beat('Decisiones antes de datos', 'Decisions before data', 'Formula la pregunta: «Si esta métrica está por debajo de X, detendremos la campaña; si está por encima, doblaremos presupuesto».', 'Frame the rule: “If metric is below X, we pause campaign; if above, we double budget.”'),
      beat('El coste de la inacción', 'The cost of inaction', 'Un dato solo tiene valor si cambia el curso de una acción y el beneficio supera el coste de recopilarlo.', 'Data only has value if it changes action and return exceeds collection cost.')
    ],
    l('Error común: pedir más análisis para postergar una decisión incómoda que ya es obvia.', 'Common error: requesting more analysis to postpone an obvious hard decision.'),
    [
      l('Fija los umbrales de decisión antes de medir.', 'Set decision thresholds before measuring.'),
      l('Vincula cada métrica a una acción concreta.', 'Tie each metric to a concrete action.'),
      l('Descarta reportes que no cambian decisiones.', 'Eliminate reports that alter no decisions.')
    ],
    l('¿Cuál es la prueba definitiva de que un análisis de datos valió la pena?', 'What is the ultimate test that a data analysis was worth it?'),
    l('Que alteró una decisión de negocio y generó un impacto económico verificable.', 'It altered a business decision and created verifiable economic impact.')
  ),
};

const PSYCHOLOGY_LEARNING_DESIGNS: Record<string, OrbLearningDesign> = {
  'learn-mindset-01': design(
    l('¿Qué evidencia podría hacerte cambiar de opinión?', 'What evidence could make you change your mind?'),
    l('Piensa en una creencia reciente y predice qué dato contrario tenderías a ignorar.', 'Think of a recent belief and predict which contrary fact you might ignore.'),
    [beat('La preferencia', 'The preference', 'Una creencia previa orienta qué información buscamos.', 'A prior belief steers which information we seek.'), beat('La interpretación', 'The interpretation', 'La misma evidencia puede parecer fuerte o débil según lo que esperamos.', 'The same evidence can look strong or weak depending on what we expect.'), beat('La salida', 'The exit', 'Definir por adelantado qué cambiaría tu opinión convierte la curiosidad en una prueba.', 'Defining what would change your mind turns curiosity into a test.')],
    l('Error común: reunir más argumentos a favor y llamarlo investigación.', 'Common error: collecting more supporting arguments and calling it research.'),
    [l('Busca evidencia contraria.', 'Seek contrary evidence.'), l('Define una condición de falsación.', 'Define a falsification condition.'), l('Actualiza tu opinión cuando cambian los datos.', 'Update your view when the evidence changes.')],
    l('¿Cuál es el antídoto práctico contra el sesgo de confirmación?', 'What is a practical antidote to confirmation bias?'),
    l('Buscar una prueba que pueda refutar tu creencia y decidir de antemano qué resultado la cambiaría.', 'Seek a test that could disprove your belief and decide in advance which result would change it.'),
  ),
  'learn-mindset-02': design(
    l('¿Cuándo el miedo a perder cambia una decisión razonable?', 'When does fear of loss distort a reasonable decision?'),
    l('Compara una decisión incierta usando criterios escritos antes de imaginar el peor resultado.', 'Compare an uncertain decision using criteria written before imagining the worst outcome.'),
    [beat('La asimetría', 'The asymmetry', 'Las pérdidas pueden pesar más que ganancias comparables.', 'Losses can weigh more than comparable gains.'), beat('La distorsión', 'The distortion', 'Ese peso puede llevarnos a evitar riesgos razonables o mantener una opción por miedo.', 'That weight can make us avoid reasonable risks or cling to an option from fear.'), beat('La regla previa', 'The prior rule', 'Límites definidos con calma protegen la decisión cuando llega la presión.', 'Limits set calmly protect the decision when pressure arrives.')],
    l('Error común: tratar toda pérdida posible como prueba de que una opción es mala.', 'Common error: treating any possible loss as proof that an option is bad.'),
    [l('Reconoce la emoción.', 'Recognize the emotion.'), l('Compara riesgo y beneficio.', 'Compare risk and benefit.'), l('Usa límites definidos de antemano.', 'Use precommitted limits.')],
    l('¿Por qué conviene definir un límite antes de conocer el resultado?', 'Why define a limit before knowing the outcome?'),
    l('Porque reduce la posibilidad de que el miedo inmediato cambie el criterio.', 'Because it reduces the chance that immediate fear changes the criterion.'),
  ),
  'learn-mindset-03': design(
    l('Si aún no hubieras invertido nada, ¿elegirías lo mismo hoy?', 'If you had invested nothing yet, would you make the same choice today?'),
    l('Separa lo ya perdido de los costes y beneficios que todavía pueden cambiar.', 'Separate what is already gone from costs and benefits that can still change.'),
    [beat('El compromiso', 'The commitment', 'Lo invertido crea una presión por justificar el pasado.', 'Past investment creates pressure to justify the past.'), beat('La trampa', 'The trap', 'Continuar puede sentirse coherente aunque empeore el futuro.', 'Continuing can feel consistent even when it worsens the future.'), beat('El reinicio', 'The reset', 'Evaluar desde hoy devuelve el foco a las alternativas reales.', 'Evaluating from today restores focus to real alternatives.')],
    l('Error común: gastar más solo para evitar admitir que el primer gasto no funcionó.', 'Common error: spending more only to avoid admitting the first spend did not work.'),
    [l('El pasado es irrecuperable.', 'The past is unrecoverable.'), l('El futuro aún se puede elegir.', 'The future can still be chosen.'), l('Compara alternativas desde hoy.', 'Compare alternatives from today.')],
    l('¿Qué pregunta neutraliza un coste hundido?', 'Which question neutralizes a sunk cost?'),
    l('Si empezara hoy sin inversión previa, ¿qué opción elegiría?', 'If I started today with no prior investment, which option would I choose?'),
  ),
  'learn-mindset-04': design(
    l('¿Lo recuerdas porque es frecuente o porque fue impactante?', 'Do you remember it because it is frequent or because it was striking?'),
    l('Antes de estimar un riesgo, predice qué tasa base necesitarías conocer.', 'Before estimating a risk, predict which base rate you would need.'),
    [beat('La facilidad', 'Ease', 'Los ejemplos recientes o vívidos aparecen primero en la mente.', 'Recent or vivid examples appear first in mind.'), beat('La inferencia', 'The inference', 'Esa facilidad puede confundirse con frecuencia o probabilidad.', 'That ease can be mistaken for frequency or probability.'), beat('La corrección', 'The correction', 'Una tasa base o muestra amplia vuelve a anclar la estimación.', 'A base rate or broader sample reanchors the estimate.')],
    l('Error común: convertir una anécdota memorable en una tendencia general.', 'Common error: turning a memorable anecdote into a general trend.'),
    [l('Detecta el ejemplo vívido.', 'Spot the vivid example.'), l('Busca la tasa base.', 'Find the base rate.'), l('Revisa la conclusión.', 'Revise the conclusion.')],
    l('¿Qué dato corrige mejor la heurística de disponibilidad?', 'Which data best corrects the availability heuristic?'),
    l('Una tasa base relevante o una muestra más amplia que el ejemplo recordado.', 'A relevant base rate or a broader sample than the remembered example.'),
  ),
  'learn-mindset-05': design(
    l('¿Podrías explicar la idea sin volver a verla?', 'Could you explain the idea without looking at it again?'),
    l('Cierra el material y reconstruye de memoria sus tres puntos esenciales.', 'Close the material and reconstruct its three essential points from memory.'),
    [beat('La fluidez', 'Fluency', 'Releer se siente fácil y puede crear una ilusión de dominio.', 'Rereading feels easy and can create an illusion of mastery.'), beat('La recuperación', 'Retrieval', 'Recordar sin mirar revela huecos y ejercita la ruta de acceso.', 'Recalling without looking reveals gaps and exercises the access path.'), beat('La corrección', 'Correction', 'Comprobar después evita consolidar errores.', 'Checking afterward prevents errors from becoming fixed.')],
    l('Error común: confundir familiaridad inmediata con recuerdo duradero.', 'Common error: confusing immediate familiarity with durable recall.'),
    [l('Cierra el material.', 'Close the material.'), l('Recupera sin pistas.', 'Retrieve without clues.'), l('Comprueba y corrige.', 'Check and correct.')],
    l('¿Qué secuencia convierte una lectura en práctica de recuperación?', 'Which sequence turns reading into retrieval practice?'),
    l('Cerrar, intentar recordar, comprobar la respuesta y corregir los huecos.', 'Close, attempt recall, check the answer, and correct the gaps.'),
  ),
};

export function getOrbLearningDesign(lessonId: string): OrbLearningDesign {
  const learningDesign = PSYCHOLOGY_LEARNING_DESIGNS[lessonId] || ORB_LEARNING_DESIGNS[lessonId];
  if (!learningDesign) throw new Error(`Missing Orb learning design for ${lessonId}`);
  return learningDesign;
}
