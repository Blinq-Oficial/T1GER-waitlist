# T1GER Learning Engine V2 — piloto para revisión

**Actualización:** [Gold V2.1](LEARNING_ENGINE_V2.1.md) sustituye las reglas de predicción, manipulación, Apply, recuperación y cierre descritas aquí. Este documento conserva el registro del piloto V2.

Fecha: 2 de octubre de 2026. Alcance: **una lección Web**, `learn-money-02`, “Time is the multiplier”. Las demás lecciones y la aplicación móvil conservan su implementación. La eficacia educativa con personas sigue pendiente de validación.

## Auditoría y mejoras de enseñanza

La versión anterior ya tenía una buena comparación con aportaciones iguales, un simulador, artefactos guardados y FSRS. Sin embargo, permitía leer explicaciones y avanzar sin interpretar la gráfica. El reto podía reforzar “empezar antes siempre gana”; Master dependía de una explicación escrita y de la propia calificación.

El piloto conserva los cálculos y los sistemas existentes. Exige una predicción antes del resultado, interpretación, un cálculo parcialmente resuelto, una meta de manipulación, un contraejemplo y una transferencia con duraciones iguales. Los errores enseñan la relación pertinente y permiten intentar de nuevo. La recuperación comprueba una respuesta objetiva antes de revelar la explicación; la explicación en palabras propias sigue siendo autoevaluada, no tiene una calificación de IA.

Estas son mejoras de diseño observables. Todavía no demuestran que los alumnos entiendan o recuerden más que con la versión anterior.

## Learning Engine V2

Cinco capas mínimas:

1. **Fuentes:** referencias enlazadas a afirmaciones, autoridad, confianza, fecha comprobada y revisión prevista.
2. **Concepto:** modelo mental, utilidad, prerrequisitos, relaciones, errores frecuentes y criterios de aprendizaje.
3. **Interacciones:** predicción, elección razonada, ejemplo incompleto, comparación visual, manipulación, transferencia, aplicación y recuperación.
4. **Sesión:** diez microbucles dentro de Hook → Learn → Interact → Apply → Master → Reward. La recuperación varía según las repeticiones reales de FSRS. La secuencia guiada del piloto es deliberadamente explícita; no es un generador adaptativo general.
5. **Evidencia:** exposición, respuestas, intentos, errores, reintentos, transferencia, Apply y recuperación guardados por usuario. No se presenta un porcentaje de dominio inventado.

No se construyó un DSL, una base de datos de cientos de ejercicios ni personalización mediante IA.

## Concept model

`investing.compounding-time`, versión 2, Investing.

**Modelo mental:** una aportación puede generar crecimiento y ese crecimiento puede generar más crecimiento. En un modelo con la misma tasa positiva constante y el mismo final, las aportaciones anteriores tienen más periodos para crecer. Las aportaciones y la tasa supuesta también importan.

Prerrequisitos: distinguir aportaciones y crecimiento, porcentajes básicos y liquidez frente a dinero a largo plazo. Relaciones declaradas: aportaciones, tasa e inflación. Próximos conceptos posibles: comisiones, horizonte y riesgo. Estas relaciones son metadatos; no activan ni migran otras lecciones.

Los criterios son distinguir aportaciones de crecimiento, completar un paso de capitalización, ajustar un escenario, transferir a fechas nuevas y recuperar el mecanismo con sus límites.

## Gold Lesson: recorrido exacto

| Paso | Acción del alumno | Condición y enseñanza |
| --- | --- | --- |
| 1. Predicción | Elige un plan y escribe una razón breve | Resultado oculto hasta responder. Ambos aportan $24.000 y terminan en el año 20. |
| 2. Revelación | Explora los años y muestra las aportaciones | Debe comparar al final. Curvas de valor y líneas discontinuas de aportaciones comparten ejes. |
| 3. Interpretación | Explica por qué Alex termina más alto | Total aportado y tasa iguales: cambia el tiempo disponible para crecer. Error → explicación → nuevo intento. |
| 4. Ejemplo guiado | Completa $100 → $110 → ? con 10% anual | $121; el segundo año comienza con $110. $120 recibe feedback sobre la nueva base. |
| 5. Manipulación | Empieza a los 30, termina a los 50 y ajusta la aportación | Aproxima el objetivo de $100/mes durante 30 años. $255/mes durante 20 años lo alcanza; mover un control arbitrariamente no basta. |
| 6. Contraste | Compara $100/mes durante 30 años con $300/mes durante 20 | La segunda opción termina más alta bajo el mismo supuesto del 8%. Empezar antes no domina todas las combinaciones. |
| 7. Transferencia | Calcula los periodos de un museo y compara dos fondos | Año 0→10 y año 5→15: diez periodos cada uno, mismo capital y 5% anual. Ambos modelan aproximadamente $1.629. |
| 8. Apply | Crea una ilustración y guarda una regla con intención de revisión | Aportaciones, crecimiento y valor separados. Ninguna transacción real. |
| 9. Recuerdo sin ayuda | Responde otro caso y explica el mecanismo antes de revelar | Sin gráfica ni notas. Un error objetiva obliga a Again. |
| 10. Cierre | Ve el modelo aprendido y vuelve a Learn | Una celebración; si falla el recuerdo, invita a seguir practicando. La recompensa no demuestra dominio. |

La duración objetivo es 3–6 minutos. No se ha medido todavía con alumnos reales; no hay una cuenta regresiva que fuerce respuestas rápidas.

## Misconceptions y feedback

- **Más valor significa más dinero aportado:** comparación con $24.000 aportados en ambos planes.
- **El crecimiento siempre añade la misma cantidad:** ejemplo $110 + 10% de $110 y recuperación $200 → $220 → $242.
- **Empezar antes siempre gana:** aportaciones mayores pueden cambiar el resultado; fechas diferentes pueden ofrecer la misma duración; al 0%, aportaciones iguales terminan iguales.
- **La proyección es una promesa:** supuestos visibles, incertidumbre y posibles pérdidas. Se enseña este límite; su explicación escrita no se clasifica automáticamente como correcta.

La selección y el cálculo son señales observadas por el cliente. No prueban intención ni comprensión profunda. El registro de un error indica una respuesta compatible con ese error, no un diagnóstico psicológico del alumno.

## Apply

Simulador reutiliza `calculateCompoundProjection`: depósitos al final de cada mes, tasa anual nominal dividida entre 12 y capitalización mensual. Incluye el caso de tasa cero. Excluye comisiones, impuestos, inflación y pérdidas. No recomienda una aportación ni un producto financiero.

Se guarda el escenario, su regla y una intención trimestral/anual en la colección existente. La intención no crea una notificación programada. La función canónica de Apply acredita **180 XP** una vez y conserva la racha. El primer intento de cuatro ejercicios produce un score compatible con la API anterior; no se muestra como porcentaje de dominio. Corregir errores no borra el primer intento.

## Master

Reutiliza la tarjeta FSRS `learn-money-02`. Alterna tres representaciones según `reps`: crecimiento sobre crecimiento, tasa cero y fondo de un museo con final común. La lección no se reproduce en el repaso. La respuesta y la explicación deben generarse antes de revelar; un resultado objetivo incorrecto impide Hard/Good/Easy.

La respuesta objetiva, la explicación y la dificultad elegida quedan registradas. Una transacción guarda conjuntamente evidencia y estado FSRS. Un identificador estable impide que reintentar la misma respuesta reprograme dos veces la tarjeta. Los repasos no vuelven a acreditar XP, racha ni historial de misiones.

“Good/Easy” sigue incluyendo autoevaluación de la explicación. No representa una certificación de comprensión ni sustituye una recuperación diferida con una persona.

## Sources y exactitud

| Fuente primaria | Afirmaciones sustentadas | Límites |
| --- | --- | --- |
| [SEC: Compound Interest Calculator](https://www.investor.gov/financial-tools-calculators/calculators/compound-interest-calculator) | Relación entre aportaciones, tiempo, tasa y capitalización | Las cifras T1GER se calculan independientemente con supuestos explícitos. |
| [SEC: What is Risk?](https://www.investor.gov/introduction-investing/investing-basics/what-risk) | Incertidumbre, pérdida e inflación | Una curva constante no reproduce mercados reales. |
| [IES: Organizing Instruction and Study to Improve Student Learning](https://ies.ed.gov/ncee/wwc/PracticeGuide/1) | Ejemplos resueltos, gráficos con explicación, preguntas explicativas y recuperación espaciada | La guía atribuye distintos niveles de evidencia a sus recomendaciones. No valida este piloto. |

Comprobadas el 2 de octubre de 2026; revisión prevista el 2 de octubre de 2027 o antes si cambian los supuestos o las fuentes. Enseñanza redactada por T1GER; sin reproducir textos de las fuentes.

Un libro mayor mensual independiente verifica la fórmula cerrada. Con el 8% nominal mensualizado, los planes con $24.000 de aportaciones terminan en $58.902,04 y $33.467,15. Los ejemplos de un depósito con 10%/5% usan periodos anuales, identificados expresamente.

## Engineering y persistencia

- `learningEngine.ts`: concepto, fuentes, secuencia, tipos de eventos, escenarios, validación y gates puros.
- `LearningInteractions.tsx`: feedback, elección, ejemplo, transferencia, comparación y recuperación reutilizables.
- `learningEvidence.ts`: checkpoints por propietario y transacciones de evidencia/FSRS.
- `GoldLesson.tsx`: composición del único piloto, controles y conexión a Apply.
- `goldLesson.css`: estilos aislados, escritorio con escenario/gráfica simultáneos y lectura limitada en tareas sin gráfica.
- `Lesson.tsx` selecciona únicamente `learn-money-02`; `Review.tsx` reutiliza recuperación V2 para esa tarjeta.

Cache local por UID conserva el paso y controles del simulador; los cambios de etapa guardan checkpoints en Firebase. Los errores de carga/guardado tienen recuperación y conservan la sesión. No se promete sincronización de cada tecla entre dispositivos: las respuestas todavía no comprobadas dentro de algunos ejercicios se reinician al recargar ese ejercicio. La evidencia privada conserva hasta 100 eventos recientes por concepto y borrador; no es un almacén histórico ilimitado.

Se conservaron IDs de lección/misión, función canónica de recompensa, reglas existentes, progresión, FSRS y colección de artefactos. No se cambiaron reglas ni funciones de producción. No se añadieron dependencias. La arquitectura pedagógica puede trasladarse a móvil; no se implementó ese traslado.

## Tests: resultados reales

- **25 pruebas unitarias Web pasan:** seis específicas de Gold más regresiones de configuración, cálculos, progresión, paridad y animación.
- **Dos pruebas de integración adicionales pasan** en `demo-t1ger-web`: checkpoint remoto conserva errores/valores; reintentar el mismo evento conserva una única recuperación, incrementa FSRS una sola vez y mantiene XP/racha/historial.
- **Contrato Auth/Firestore/Functions pasa:** propiedad privada, rechazo de XP manipulado, prerrequisitos, Gold Apply, artefactos y recompensa repetida sin duplicación.
- **Recorrido por interfaz:** prueba de preview con errores deliberados y prueba autenticada completa en emuladores. Primer fallo $120, corrección $121, manipulación $255, transferencia, Apply al 0%, recuerdo incorrecto Again y repaso posterior correcto en otro contexto.
- **Lectura SDK del usuario local:** Gold añade 180 XP al prerrequisito de 170; total 350, racha 1, práctica 75 por el error inicial conservado, escenario/regla guardados y FSRS actualizado. El repaso mantiene 350 XP.
- **TypeScript/lint Web y build conjunto de waitlist/Web pasan.** La compilación conserva los avisos previos de chunks grandes de Firebase/mascota.

Las credenciales de los scripts de fixture son ficticias y solo conectan a emuladores demo. Las dos pruebas de integración requieren `T1GER_EMULATOR_TEST=1`; la suite habitual las omite si el emulador no está activo. No se borraron datos ni se ejecutaron transacciones financieras de producción.

## Visual QA

Inspección y uso reales a **1280×900**, **768×1024** y **390×844**, en claro y oscuro. Se comprobaron comparación, feedback, manipulación, transferencia, Apply, recuperación y cierre. Móvil y tablet sin desbordamiento horizontal observado. Controles principales de al menos 44 px; no dependen de hover. La animación de revelación contempla movimiento reducido.

Correcciones surgidas de QA: variables de color que ocultaban una curva, control Restart pequeño, texto que afirmaba un guardado antes de realizarlo, meta “alcanzada” antes de cumplir la tarea, supuestos poco visibles en contraste y preguntas de recuperación demasiado largas como titulares.

Capturas locales en `.codex/qa/gold-lesson-v2/`. Estas verificaciones cubren los escenarios descritos, no todos los navegadores, lectores de pantalla ni dispositivos físicos. Adelantar una fecha de vencimiento en el emulador sirve para probar la interfaz; no constituye evidencia de retención diferida humana.

## Human test: protocolo listo, todavía no ejecutado

### Participantes y preparación

Reclutar **5–8 personas del público objetivo**, preferiblemente principiantes adultos en esta primera prueba. Registrar familiaridad previa, dispositivo y consentimiento para observar/anotar; no pedir importes financieros personales. Usar escenarios ficticios. No introducir el modelo mental antes de la lección.

Dar esta instrucción neutral: “Usa la lección como si estuvieras solo. Puedes decir lo que piensas; no te voy a explicar las respuestas. Puedes parar cuando quieras.” El observador registra dificultades y ayuda solicitada, pero no orienta la respuesta. Si hay un bloqueo técnico, anotarlo y ayudar solo a resolverlo.

### Sesión de 15–20 minutos

1. Pregunta previa sin enseñar: “¿Qué significa que el crecimiento también pueda crecer?”. Conservar respuesta textual.
2. Completar Gold sin explicación. Medir tiempo total y por etapa, pausas, errores iniciales frente a reintentos, uso de pistas, cambios de variables y abandono. No confundir leer mucho con pensar poco.
3. Observar especialmente la duración del museo: ¿razona periodos o elige “antes” por reflejo?
4. Preguntar después, sin mostrar el modelo: ¿Qué aprendiste? ¿Por qué puede importar empezar antes? ¿Cómo se lo explicarías a un amigo? ¿Qué lo hizo claro? ¿Qué fue aburrido/confuso? ¿Se sintió como tarea escolar? ¿Harías otra lección?
5. Transferencia independiente: un depósito de $500 crece 10% anual durante dos años, sin nuevas aportaciones. Pedir resultado y mecanismo. Después comparar dos depósitos iguales al 0%, y dos fondos con fechas distintas pero la misma duración. No usar nombres ni importes de la lección.

### Recuerdo diferido y rúbrica

Repetir sin notas a las **24–48 horas** y aproximadamente **una semana**, con otros importes/fechas. Preguntar mecanismo, calcular un paso y resolver una comparación nueva antes de feedback. Anotar si consultó el producto entre sesiones. No reducir la evaluación a reconocer opciones.

Para cada respuesta registrar **ausente / parcial / correcta**, con cita textual, en cuatro aspectos: crecimiento sobre crecimiento; duración real; control de aportaciones/tasa; incertidumbre del modelo. Una cuenta aritmética incorrecta con mecanismo correcto y una elección acertada con explicación incorrecta se registran por separado. Guardar resultados individuales, no un porcentaje de “mastery” creado para impresionar.

### Comparación y decisión

Si se compara con la versión antigua, asignar participantes distintos a cada versión y equilibrar familiaridad/dispositivo. No hacer que todos vean primero la antigua y después Gold con el mismo concepto: el orden contaminaría el resultado. Con 5–8 usuarios, la comparación es exploratoria y cualitativa, no una demostración estadística de superioridad.

Revisar si aparecen errores repetidos, respuestas por reconocimiento, fricción que impide practicar o fallos de transferencia/recuerdo. Documentar qué interacción causó cada problema, corregir y repetir las tareas afectadas. Solo considerar expansión después de revisar comprensión, transferencia y recuerdo diferido, junto con estabilidad técnica. No declarar éxito basándose exclusivamente en completar, XP o “me gustó”.

## Do not scale yet

**Ninguna otra lección fue migrada automáticamente.** El currículo permanece congelado para esta iniciativa. El siguiente paso es revisar este piloto y ejecutar la prueba humana; no producir ni convertir más lecciones todavía.
