# Gold Lesson V2.1 — señales corregidas; congelada para pruebas humanas

2 de octubre de 2026. Único alcance: Web `learn-money-02` y su repaso en Master. Esta entrega corrige integridad de evidencia; no demuestra aprendizaje humano.

## V2.1 Changes

Se reutilizan los diez pasos, cálculos, componentes, persistencia, Apply y FSRS existentes. No se añaden dependencias, servicios de IA, una arquitectura nueva ni un rediseño. El museo, los supuestos y la duración permanecen.

## Retrieval

Cada una de las tres variantes pide un resultado y una decisión objetiva de mecanismo independientes, antes de revelar feedback. Por ejemplo, $242 es correcto pero “la tasa aumenta cada año” es incorrecto. Si cualquiera falla, solo se permite **Again**. Si ambos aciertan, están disponibles Again/Hard/Good/Easy. La persistencia vuelve a limitar el rating, aunque un llamador solicite Easy contradictorio.

La reflexión escrita es opcional y no se evalúa. Las instrucciones piden Again/Hard si hubo ayuda o adivinación; el texto no se clasifica automáticamente. Una elección correcta tampoco prueba comprensión profunda.

El cálculo recibe “That calculation works”; el mecanismo recibe feedback separado. Se elimina “You found the relationship” como afirmación global.

## Manipulation

Los controles están bloqueados hasta comprometer Increase/Decrease/Stay roughly the same. Una predicción equivocada es admisible y se conserva. Después de alcanzar la meta, hay que identificar que una aportación mayor compensó menos periodos a la misma tasa. Mover sliders, consultar la pista o encontrar $255 no basta para continuar. Las interpretaciones equivocadas y corregidas se registran por separado.

## Apply

Dos selecciones construyen una regla condicional: menos tiempo puede exigir mayor aportación para el mismo objetivo y tasa positiva; empezar antes no vence todas las combinaciones de aportaciones y tasas. Se comprueba antes de guardar. Las combinaciones contradictorias quedan bloqueadas; sus intentos se conservan.

El artefacto guarda la regla estructurada, sus selecciones, el escenario, la intención de revisión y la reflexión opcional en campos separados. El texto libre puede expresar una idea incorrecta; permanece identificado como reflexión sin calificar, nunca como regla objetiva aprobada.

## Prediction

Elección de plan + motivo breve seleccionado. “I don’t know yet” y “I’m not sure yet” son válidos. La escritura es opcional, colapsada y sin mínimo de caracteres.

## Reward

Todas las rutas terminan con **“You practiced.”**, enumeran las habilidades practicadas y dicen **“We’ll bring this idea back later to see what sticks.”** Completar y obtener una recompensa no establece dominio.

## Evidence Model

Señales separadas: predicción, cálculo guiado, mecanismo, predicción de manipulación, interpretación de manipulación, transferencia, regla estructurada Apply, cálculo de recuperación, mecanismo de recuperación, reflexión y dificultad autodeclarada. El resumen de recuperación incluye ambos booleanos; no reemplaza los registros individuales.

Se mantienen IDs de lección/concepto y formato compatible de borrador versión 2. Las nuevas decisiones se exigen al llegar a los pasos correspondientes; no se inventan respuestas para borradores antiguos. El cálculo y mecanismo de recuperación se guardan al revelar y se restauran bloqueados tras recargar, con la variante fijada en el borrador.

Los IDs del paquete de recuperación son estables. FSRS y las señales se escriben en una transacción; repetir una respuesta guardada no vuelve a programar. El presupuesto existente de 100 eventos conserva el primer intento de cada señal/interacción y las correcciones recientes. El score de práctica heredado solo adapta cuatro primeras respuestas a la API existente: no aparece como porcentaje de dominio.

## Tests

- **32 pruebas unitarias pasan**, incluidas las seis regresiones pedidas y una de conservación del primer error tras 150 intentos.
- **3 pruebas con Auth/Firestore/Functions emulados pasan:** checkpoint, reintento idempotente y restricción de Easy contradictorio.
- **Contrato emulado pasa:** aislamiento por propietario, recompensas solo desde servidor, prerrequisitos, finalización idempotente y conservación de artefacto/evidencia.
- **Lint/TypeScript y build combinado waitlist + Web pasan.** Permanecen los avisos previos de tamaño de los bundles de Firebase y mascota.
- **Diez recorridos completos de UI:** las cinco rutas pedidas en escritorio y a 390 × 844. Son QA controlada con IA, no participantes ni medidas de aprendizaje. Estados accesibles y capturas se guardan localmente en `.codex/research/gold-v21-2026-10-02/`.
- **Cuenta desechable del emulador:** error $120 corregido a $121, predicción incierta, predicción de manipulación incorrecta, regla contradictoria corregida, tasa cero y recuperación $242/mecanismo incorrecto. Recarga conserva la respuesta y el bloqueo de Good/Easy; la lectura del perfil comprueba señales, artefacto, 350 XP totales y racha 1.
- **Master autenticado:** después de Again, la siguiente recuperación usa la variante de endowment con final común. Resultado y mecanismo correctos habilitan los ratings normales; Good completa el repaso, aumenta las repeticiones FSRS de 2 a 3 y mantiene 350 XP/racha 1.

## Regressions

El flujo de cuenta, prerrequisitos, Apply, XP y racha conserva el contrato canónico. No se cambia el scheduler. Los repases de otras lecciones conservan su implementación. La simulación de museo conserva fechas y cálculo originales.

La primera ejecución del test integrado se lanzó antes de que Auth terminase de iniciar y falló por conexión; con los emuladores listos, las tres pruebas pasaron. Las incidencias de selección/carga de pestañas se resolvieron en el controlador de QA.

## Human Validation

**Gold V2.1 queda congelada para el protocolo humano existente.** Próxima evidencia: 5–8 personas reales de 18–25 años, preguntas previas/posteriores, transferencias nuevas y recuperaciones distintas a 24–48 horas y siete días. No se han realizado estas sesiones ni demostrado retención.

El protocolo existente solo adapta su pregunta de observación a la elección de motivo y al mecanismo separado. No se cambian los instrumentos ni se usan preferencias o tiempos sintéticos para decidir el producto.

## Scale

**NO OTHER LESSON WAS MIGRATED.** No se formaliza T1GER Lesson Standard V1. La siguiente decisión sobre Gold depende de alumnos reales.
