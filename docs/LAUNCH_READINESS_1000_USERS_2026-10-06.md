# T1GER: preparación para 1.000 usuarios

Auditoría del 6 de octubre de 2026. Base de código: `7aa0100987efb13b704c6f4112fa14f0f99ac219`.

## 1. Decisión de lanzamiento

T1GER ya tiene un recorrido de aprendizaje utilizable. Recomiendo una beta con incorporación gradual mientras se completan las tareas críticas de operación. Todavía no hay evidencia para prometer disponibilidad del mentor para 1.000 usuarios activos, eficacia educativa superior o un lanzamiento comercial completo.

Mil cuentas registradas, mil personas activas al día y mil conexiones simultáneas son escenarios diferentes. No se ha ejecutado una prueba de carga de estos escenarios. La arquitectura Vercel + Firebase puede servir como base; esta revisión no justifica una migración a otra plataforma.

### Qué comprobé

- Código de Web, waitlist, funciones de aprendizaje, reglas de seguridad versionadas y documentos de validación.
- Configuración actual del mentor y consulta de cuota de OpenRouter sin generar respuestas ni gastar créditos.
- Documentación oficial de proveedores de email y requisitos de envío.
- Consulta DNS local de MX y DMARC para `t1ger.app`.

### Qué requiere acceso/configuración adicional

- Plan contratado, uso, facturación y alertas efectivas de Vercel, Firebase, Supabase y Resend.
- Backups programados y una restauración real en un entorno aislado.
- Entregabilidad de emails en buzones controlados, DKIM del remitente y configuración de recepción.
- Prueba de carga aislada y sesiones de aprendizaje con participantes humanos.
- Revisión de las reglas actualmente desplegadas antes de cualquier modificación: el archivo versionado es una fotografía, no prueba de la configuración vigente.

## 2. Lo que ya existe

| Área | Construido | Evidencia local |
|---|---|---|
| Acceso | Email/contraseña, Google y solicitud de recuperación | `apps/web/src/App.tsx`, `state.ts`; proxy de auth en `vercel.json` |
| Inicio | Onboarding, selección de intereses, ruta y tiempo diario | `Onboarding.tsx` |
| Aprender | Rutas Web de Investing, AI y Psychology; prerequisitos y vista de lecciones | `LearningHome.tsx`, `learningJourney.ts`, `Lesson.tsx` |
| Aplicar | Misiones, reflexiones y herramientas guardadas | Componente Apply de `App.tsx`, `state.ts` |
| Progreso | Recompensa y completado de Apply en transacción del servidor, reintentos sin duplicar XP | `services/learning/src/index.ts` |
| Recordar | Cola de recuperación y programación FSRS | `Review.tsx`, `brainService.ts`, `learningEvidence.ts` |
| Gold | Lección V2.1 con predicción, manipulación, transferencia y recuperación | `GoldLesson.tsx`, `learningEngine.ts`; sigue congelada |
| Motivación | Mascota 3D y retrato, reacciones, racha, XP, desafíos diarios | `Visual.tsx`, `Mascot3D.tsx`, `LearningMomentum.tsx` |
| Social | Amigos, grupos, desafíos, bloqueo y reportes | `socialService.ts`, funciones `challenges.ts` |
| Mentor | Callable autenticada, límites diarios por usuario, proveedor fijado y respaldo | `companion.ts`, `openRouterMentor.ts` |
| Email | Bienvenida de waitlist con Resend; implementación de confirmación de Founder | `api/_waitlist-core.js`, `stripe-webhook.js`; checkout sigue pausado |
| Medición | Vercel Analytics; integración opcional de PostHog con controles de privacidad | `src/lib/behaviorAnalytics.ts` |
| Cuenta | Preferencias, exportación parcial y contacto para eliminación | `App.tsx`, `CompanionTools.tsx` |

Las funciones sociales tienen consultas acotadas: liga 50 perfiles, grupos 10, actividades 30, comentarios 50. El listener de misiones de un usuario no tiene paginación. No es correcto describir todas las consultas como ilimitadas.

## 3. Bloqueadores antes de invitar a mil personas

| Prioridad | Tarea pendiente | Riesgo observado | Criterio de cierre |
|---|---|---|---|
| P0 | Capacidad y operación del mentor | Rutas de precio cero, historial de 429, dos instancias máximas, sin prueba de ráfagas | Presupuesto/capacidad elegidos, límite global y por usuario, cola o control de solicitudes concurrentes, alertas y pruebas de fallos |
| P0 | Alertas de producción | Logs presentes; no encontré configuración versionada de alertas de aplicación ni reporte de excepciones | Un fallo sintético dispara una alerta a un responsable; errores no incluyen preguntas ni credenciales |
| P0 | Backup y restauración | No encontré procedimiento verificado de restauración | Recuperar perfil, progreso, evidencia y waitlist en entorno aislado y registrar el resultado |
| P0 | Avisos legales finales | Web identifica operador y dirección incompletos y muestra avisos como borradores | Operador, domicilio, retención, proveedores y condiciones de 15–17 años revisados y publicados |
| P0 | Soporte operativo | Contacto Gmail y reportes sociales; falta flujo operativo documentado | Buzón con responsable, tickets o registro de casos, tiempos de respuesta y escalado |
| P0 | Ant abuso en entrada y APIs costosas | Rate limit de waitlist en memoria por proceso; callables inspeccionadas no declaran `enforceAppCheck` | Límite compartido en waitlist; evaluación gradual de App Check compatible con móvil; límites y protección de ráfagas |
| P0 | Prueba de lanzamiento reproducible | Vercel compila, pero no encontré CI versionada que exija toda la suite | Registro → onboarding → lección → Apply → recarga → repaso, en navegadores y móviles definidos; pruebas de seguridad y progreso en emulador |
| P0 para cobros | Pagos y beneficios | Founder pausado; pendiente revisar RPC/webhook y beneficios de extremo a extremo | Pago, duplicado, reembolso, cancelación y recuperación comprobados en modo de prueba antes de reactivar |

App Check requiere integrar primero los clientes que comparten backend. Activarlo abruptamente podría bloquear móvil. No reemplaza autenticación ni límites de uso. [Documentación de Firebase](https://firebase.google.com/docs/app-check/cloud-functions).

### Mentor: capacidad observada

La consulta de la cuenta a las 23:29 UTC devolvió un contador de variantes gratuitas de **50 solicitudes/día**, 4 usadas y 46 restantes. El catálogo devolvió precio de entrada y salida cero para ambos modelos configurados.

La ruta principal `inclusionai/ling-3.1-flash` no lleva el sufijo `:free`; no se debe atribuir automáticamente el contador de 50 a esa ruta. El respaldo `inclusionai/ling-3.0-flash-sante:free` sí lo lleva. La capacidad principal y la del proveedor siguen sin garantía comprobada. Un precio cero no demuestra que el servicio pueda absorber mil usuarios. El código impide que una ruta de pago se active silenciosamente.

Ejemplo de demanda, no una predicción: 1.000 usuarios activos × 20% que usan el mentor × 3 preguntas = **600 respuestas/día**. Dos intentos de proveedor para una pregunta pueden aumentar la demanda. Hay que elegir capacidad compatible y probar ráfagas; no basta multiplicar el límite de cada usuario. [Límites oficiales de OpenRouter](https://openrouter.ai/docs/api_reference/limits).

## 4. Emails: lo que falta construir

Resend ya envía la bienvenida de la waitlist. Web usa Firebase para recuperación de contraseña. No encontré en las funciones del repositorio un remitente de bienvenida Web, recordatorios de práctica, repasos por email ni informes semanales.

Settings guarda `notificationPreferences` y `weeklyReportOptIn`. El interruptor de informe semanal no demuestra que se esté enviando un informe. Falta conectar preferencias, eventos, planificación, entrega y bajas.

También hay un fallo de recuperación en la bienvenida de waitlist: si el registro se guarda y falla el envío, un nuevo intento encuentra `alreadyJoined` y no vuelve a enviar. La idempotencia de Resend evita duplicados durante su ventana; no sustituye una cola persistente con estado, reintentos y seguimiento.

### Alternativa de Resend

| Servicio | Encaje | Restricción para el escenario de mil usuarios |
|---|---|---|
| Resend | Reutilizar la integración existente y programar el comportamiento en T1GER | Free: 100/día y 3.000/mes. El ejemplo oficial de Pro contempla 50.000/mes por US$20; confirmar el plan de la cuenta |
| Brevo | Alternativa recomendada si queremos crear y gestionar automatizaciones en una interfaz | Free: 300/día; automatizaciones hasta 2.000 contactos. Starter/Standard dependen del volumen y contactos; 5.000 envíos incluyen solo 500 contactos, 10.000 incluyen 1.500 |
| Postmark | Alternativa orientada a email transaccional, streams separados y recepción | Prueba de 100/mes; Basic desde US$15, recepción en Pro/Platform; todavía requiere lógica de recordatorios |

Fuentes: [Resend Free](https://resend.com/blog/new-free-tier), [ejemplo de Pro](https://resend.com/changelog/pay-as-you-go-pricing), [planes y cuotas de Brevo](https://help.brevo.com/hc/en-us/articles/208589409-About-Brevo-s-pricing-plans), [Postmark](https://postmarkapp.com/pricing). Importes de referencia en USD; no son una cotización cerrada para nuestro consumo.

**Recomendación:** aprovechar Resend para el primer lanzamiento y construir los disparadores de aprendizaje. Brevo es la alternativa más útil entre las comparadas para gestionar campañas sin editar código. Cambiar el transportista de emails no completa por sí solo la lógica de progreso, zona horaria o bajas. Si se elige Brevo, migrar primero un segmento consentido y mantener la waitlist estable durante la transición.

### Volumen: modelo de presupuesto

| Escenario ilustrativo para 1.000 personas suscritas | Volumen mensual aproximado |
|---|---:|
| 1 resumen semanal por persona × 4 semanas | 4.000 |
| Hasta 3 recordatorios semanales por persona × 4 semanas | 12.000 |
| Bienvenida a todas las personas nuevas | 1.000 |
| Total de ese mes, sin mensajes de seguridad ni soporte | 17.000 |
| Recordatorio diario durante 30 días, sin supresión | 30.000 |

Son techos hipotéticos. La base elegible será menor si algunos no consienten, ya completaron su aprendizaje o se dan de baja. El primer día podría concentrar 1.000 bienvenidas: importan los límites diarios además de los mensuales.

### Arquitectura mínima

1. Eventos del servidor: alta de perfil, onboarding completado, Apply completado y repaso programado. La cola se escribe después de confirmar la transacción de aprendizaje, no por un click observado en el navegador.
2. Preferencias específicas de email, diferenciadas de push: categoría, idioma, horario, zona horaria, pausa y consentimiento/versionado.
3. Colección de salida privada con identificador determinista por usuario, categoría y ocasión; datos mínimos, fecha elegible, estado e intentos.
4. Un planificador reutiliza Firebase Scheduler. Consulta páginas acotadas, toma trabajos con exclusión temporal y vuelve a comprobar consentimiento y progreso antes de enviar.
5. Envío con plantilla HTML y texto, identificador de idempotencia, límite de ritmo y reintentos con espera incremental. Un timeout ambiguo no se interpreta automáticamente como rechazo.
6. Webhook autenticado/verificado: recibido, entregado, rebotado, queja y baja; eventos duplicados se ignoran con persistencia.
7. Supresión duradera de quejas y rebotes permanentes; bajas globales y por categoría, sin login ni enlace que caduca antes de poder darse de baja.
8. Panel privado de entregas, errores y reintentos. Un trabajo fallido nunca borra la cuenta o el aprendizaje.

No hace falta generar cada email con IA. Plantillas originales y datos reales reducen costes, mensajes inventados y dependencia del mentor.

El paquete de contenido, horarios y exclusiones está en [EMAIL_LIFECYCLE_BLUEPRINT_2026-10-06.md](EMAIL_LIFECYCLE_BLUEPRINT_2026-10-06.md).

## 5. Recibir emails y dar soporte

Enviar mensajes automáticos y atender respuestas son dos flujos operativos.

- Definir buzones `support@t1ger.app` y `privacy@t1ger.app` con acceso restringido y responsable.
- Remitente de aprendizaje en un subdominio verificado, por ejemplo `learn@mail.t1ger.app`; `Reply-To` al buzón de soporte.
- Para empezar, un buzón convencional con dominio es suficiente. Resend también ofrece recepción mediante webhook, útil si queremos registrar tickets; la API de recepción no constituye por sí sola un equipo de soporte. [Recepción de Resend](https://resend.com/features/inbound).
- La consulta al resolvedor local no devolvió un MX para el dominio raíz y `_dmarc.t1ger.app` respondió nombre inexistente. Es una observación puntual, no una auditoría completa de DNS ni prueba de fallos de envío. Falta verificar DNS autoritativo, DKIM y subdominios del remitente. La comprobación adicional por DNS-over-HTTPS no pudo conectarse.
- SPF/DKIM/DMARC y pruebas de Reply-To antes de invitar usuarios. No modificar los MX existentes sin inventariar los buzones actuales. [Guía de remitentes de Gmail](https://support.google.com/mail/answer/81126?hl=en).
- Emails comerciales: remitente claro, dirección postal válida, baja accesible y supresión efectiva; finalizar el encaje de cada mensaje con las jurisdicciones admitidas. [Guía CAN-SPAM de la FTC](https://www.ftc.gov/business-guidance/resources/can-spam-act-compliance-guide-business).

## 6. Lo que falta para un producto educativo sólido

### Selección de la mejor educación del internet

Existe un currículo estático con fuentes, objetivos, limitaciones, preguntas de recuperación y fechas de revisión (`education.ts`, `interactiveCurriculum.ts`). No encontré un sistema completo que explore internet, puntúe candidatos, compare pedagogía, asigne revisión editorial y publique automáticamente contenidos aprobados.

En `makeLesson`, los campos `factualReview: 'approved'` y `pedagogicalReview: 'approved'` se asignan como constantes. Son metadatos declarados; no prueban una revisión humana identificable de cada lección.

Antes de ampliar el catálogo necesitamos:

1. Registro de fuente y pasaje que sustenta cada afirmación, con autor, fecha, límites y derechos de uso revisados.
2. Criterios explícitos de autoridad, exactitud, utilidad, adecuación al alumno y actualidad; varias fuentes cuando un tema lo necesita.
3. Revisión factual y pedagógica con responsable, versión y evidencia; estado borrador hasta que sea aprobada.
4. Lección original que traduzca la idea a un objetivo pequeño, predicción, práctica, error común, aplicación y transferencia.
5. Prueba técnica y editorial de respuestas, unidades, suposiciones y ejemplos; evitar respuestas regaladas antes de la recuperación.
6. Evidencia humana previa/posterior y recuperación a 24–48 horas y 7 días antes de afirmar retención o superioridad.
7. Cadencia de revisión, corrección y retirada de contenido desactualizado; aviso cuando una corrección afecta una herramienta guardada.

La etiqueta `fair_use_summary` no otorga una licencia. La publicación comercial requiere revisar el uso concreto. [U.S. Copyright Office](https://www.copyright.gov/fair-use/).

El kit humano sigue sin resultados registrados; el feedback de interfaz de una persona y las simulaciones con IA no reemplazan pruebas de aprendizaje. Gold V2.1 debe conservar su versión durante la validación.

### Contenido y retención

- Priorizar profundidad y práctica útil dentro de las tres rutas disponibles en Web.
- Revisar qué recibe el usuario al terminar una ruta: siguiente recorrido, repasos y uso de las herramientas que ya construyó.
- Localización coherente: currículo bilingüe, interfaz actualmente mayoritariamente en inglés; definir idiomas de lanzamiento y emails.
- Feedback por lección: confusión, error factual y utilidad; captura voluntaria con contexto de pantalla, sin grabar preguntas privadas.
- Accesibilidad: teclado, lector de pantalla, zoom, objetivos táctiles, contraste y movimiento reducido en los recorridos elegidos de lanzamiento.

## 7. Datos, fiabilidad, privacidad y medición

### Datos y operación

- Paginar misiones e históricos cuando crezcan; medir lecturas de listeners al volver a la pestaña y tras reconexión.
- `brainState.missionHistory` vive en el perfil. Definir archivo/retención antes de un crecimiento prolongado: Firestore limita un documento a 1 MiB. [Cuotas de Firestore](https://firebase.google.com/docs/firestore/quotas).
- Confirmar índices y costes de consultas sociales. El job de desafíos liquida como máximo 100 por ejecución horaria: medir backlog y alertar antes de aumentarlo.
- Backup de Firestore y Supabase; historial de despliegue y reversión de Web/funciones. Restauración y eliminación son procesos diferentes.
- Versionar contratos compartidos con móvil; comprobar que un cambio de Web no elimina progreso móvil ni rompe consentimientos.
- Sustituir el seguimiento informal de incidencias por triage, responsable y estado de resolución.

### Privacidad y seguridad

- Eliminación de cuenta todavía se solicita por email; no encontré una función de cascada completa en este servicio. Definir autenticación, confirmación, borrado/retención en Firebase, datos sociales, evidencia, proveedores y waitlist según la solicitud.
- La exportación actual es parcial. Añadir un procedimiento para exportar todos los datos pertinentes del servicio compartido.
- Revisar la respuesta de waitlist para emails ya existentes: devuelve estado, posición y referencia sin verificar posesión del email. Evitar que sea una herramienta de enumeración; no se probaron emails reales en esta auditoría.
- Rotar antes del lanzamiento la clave de OpenRouter que se compartió en conversación y comprobar uso de secretos únicamente en servidor.
- Moderación: bloqueo y reportes existen, pero falta una bandeja de revisión, responsable, acciones administrativas y tiempos de atención.

### Medición

- PostHog está preparado; falta confirmar proyecto/región y activarlo con las preferencias existentes. El catálogo de eventos actual no incluye un funnel completo de finalización de Apply y repaso.
- La evidencia pedagógica privada de Gold contiene eventos distintos; no se debe asumir que ya alimenta un dashboard de marketing.
- Medir visita → cuenta → onboarding → primera lección → primer Apply → regreso → repaso; errores y tiempos por paso.
- Analítica actual usa identificador de navegador y no perfiles de persona. No demuestra retención de una misma cuenta entre dispositivos; para cohortes, diseñar agregado del servidor o identificación pseudónima con revisión de privacidad.
- Emails: entrega, rebote, baja, click y retorno a aprendizaje con Apply/recuperación posterior. La apertura de un email no demuestra aprendizaje y puede estar distorsionada por sistemas de privacidad.

## 8. Secuencia de ejecución

### Sprint A: operación para beta

Capacidad del mentor; alertas; presupuesto; backup/restauración; soporte; seguridad de entrada; prueba del recorrido; avisos legales y procedimiento de derechos.

### Sprint B: emails y retorno

Remitente y buzones; preferencias; cola; bienvenida Web; recordatorio contextual; repaso; resumen; bajas; webhooks; entrega en buzones de prueba. Después añadir recuperación de onboarding y reactivación.

### Sprint C: comprobar el valor

Activar funnel; incorporar personas por tandas; ejecutar protocolo humano de Gold; corregir las barreras documentadas; revisar fuentes y catálogo; decidir alcance de Pro con evidencia de uso y utilidad.

### Sprint D: lanzamiento comercial

Solo después: checkout probado, beneficios autorizados por servidor, cancelación y reembolso, facturación, emails de pago, límites claros de cada plan y textos legales correspondientes.

## 9. Lista de decisión de lanzamiento

- [ ] Capacidad del mentor y modo degradado comprobados.
- [ ] Cuenta, Google, recuperación de contraseña y reconexión probados en el conjunto de navegadores admitido.
- [ ] Progreso persiste y los reintentos no duplican recompensas.
- [ ] Fallo sintético dispara alerta y el responsable sabe actuar.
- [ ] Backup restaurado y reversión ensayada en un entorno aislado.
- [ ] Emails optativos, bajas y supresión funcionan; soporte recibe respuestas.
- [ ] Avisos legales finales y procesos de eliminación/exportación definidos.
- [ ] Reportes sociales tienen revisión y acciones operativas.
- [ ] Funnel de activación/retorno comprobado sin recopilar respuestas privadas.
- [ ] Fuentes, derechos y revisión editorial de las lecciones de lanzamiento documentados.
- [ ] Claims educativos ajustados a evidencia humana disponible.
- [ ] Prueba de carga reproducible y costes medidos; invitaciones por tandas con señales para detener incorporación.

Este documento es una auditoría y especificación. Las tareas abiertas no se convierten en funciones activas por estar descritas aquí.
