# T1GER — operaciones para la beta pública

Estado observado: 8 de octubre de 2026. Este informe distingue código construido, servicios activados y pruebas realizadas. No certifica capacidad para 1.000 usuarios simultáneos ni eficacia educativa validada con personas.

## 1. Cambios de esta entrega

### Protección del mentor

- Admisión transaccional en Firestore: cuatro solicitudes activas globales, reservas con caducidad, presupuesto diario compartido y límites por cuenta.
- Diez segundos entre solicitudes de una cuenta. Diez solicitudes diarias normales o cincuenta para cuentas Pro existentes.
- Reserva de dos llamadas de proveedor por solicitud para cubrir el fallback. Presupuesto predeterminado de 600 llamadas diarias; no equivale a 600 usuarios atendidos.
- Circuito que pausa nuevas llamadas durante un minuto tras tres fallos del proveedor. Liberación de las reservas al terminar.
- Mensajes distintos para servicio ocupado y cuota agotada. Se conserva la pregunta para reintentar.
- Se mantienen los modelos y condiciones de precio configurados anteriormente. Disponibilidad y cuotas gratuitas dependen del proveedor.

### Correo de aprendizaje, construido pero sin envío activado

- Preferencias privadas en Ajustes: opt-in, categorías, español/inglés, zona horaria y hora local.
- Verificación del email necesaria para activar la preferencia. Ningún usuario anterior se incorpora automáticamente.
- Bienvenida, repaso pendiente, continuación, Apply, resumen semanal, regreso y logros basados en progreso existente.
- Un correo por día y tres por semana por cuenta. Presupuesto compartido predeterminado de veinte intentos diarios para la primera activación controlada.
- Cola durable, exclusión mediante leases, reintentos limitados y claves de idempotencia. Los estados ambiguos requieren revisión.
- Baja por token opaco: GET muestra confirmación; POST modifica la preferencia. Compatible con baja de un clic.
- Webhook firmado y validación temporal; que Resend acepte un envío no significa que llegue al buzón. Rebotes y quejas bloquean nuevos envíos. Solo procesa eventos etiquetados `t1ger-learning-v1`; ignora mensajes de otros productos de la cuenta compartida.
- El frontend permite guardar preferencias mientras explica que la entrega todavía está pendiente.

El propietario autorizó la conexión Resend/Firebase/Vercel. La cuenta correcta de Resend tiene `t1ger.app` verificado; se comprobó que su clave «Vercel Integration» coincide con la existente. El webhook de entrega, rebote y queja ya está conectado y desplegado. No se ha enviado un email real de aprendizaje: `T1GER_EMAIL_READY=false` hasta completar identidad del operador y la prueba de entrega.

### Waitlist

- Migración aplicada en Supabase: rate limit compartido mediante HMAC, cola privada de bienvenida, trigger de nuevas altas, claims exclusivos y reintentos.
- No se han rellenado correos antiguos ni modificado las posiciones existentes.
- La respuesta pública ya no revela si una dirección pertenece a la lista, su posición ni su código de referido. Se conservan esos datos para el email privado.
- Timeouts para Supabase y Resend. Los fallos del proveedor conservan el alta válida.
- El nuevo sender conserva la clave de idempotencia del anterior. Un conflicto de payload o un trabajo con más de 23 horas desde su creación se retiene como `ambiguous`; no se cambia la clave para forzar un envío.
- Endpoint privado de recuperación de la cola: `POST /api/waitlist-emails`. `WAITLIST_CRON_SECRET` está guardado como Secret en Vercel Production y Firebase Secret Manager. El intento inmediato de nuevas altas funciona con el sender ya configurado en Vercel; no se ha certificado la entrega de ese remitente.

### Soporte y operación

- Formulario autenticado en Perfil/Ajustes para problemas, correcciones, exportación y eliminación. Devuelve un ticket y tolera reintentos sin duplicarlo.
- Tres solicitudes por cuenta al día. Las solicitudes de privacidad necesitan ejecución y revisión humana; enviar el formulario no borra la cuenta.
- Panel privado `/app/operations`: soporte y reportes, páginas de cincuenta casos y resolución de casos.
- Acceso mediante custom claim `t1gerOperator` emitido por servidor. Una cuenta normal y parámetros falsificados no permiten acceder.
- No se ha concedido el rol a ninguna cuenta nueva. Falta identificar el email de la cuenta del operador.
- Diagnósticos limitados sin preguntas del mentor, respuestas educativas, contraseñas ni contenido del formulario en los logs.
- Los reportes siguen siendo privados. Resolver un caso no ejecuta una sanción, un borrado ni un pago.

### Datos, analítica y mantenimiento

- Consultas del historial Web acotadas por propietario, catálogo de quince lecciones y límite de treinta registros. Apply busca su misión exacta.
- Eventos de lección, Apply y repaso preparados para la integración PostHog existente. El proyecto sigue pendiente de identificador público y región.
- Dependencias corregidas: auditorías npm sin vulnerabilidades conocidas al comprobar root, Web y servicio. Vitest actualizado a 4.1.11.
- Workflow de GitHub con lint, builds, tests, contratos de emulador y PostgreSQL desechable para verificar la migración. No utiliza secretos de producción.

## 2. Servicios desplegados y controles de infraestructura

Proyecto Firebase: `t1ger-69d6a`. Se desplegaron exclusivamente estas diez funciones del codebase `web-learning`:

1. `completeWebApplyMission`
2. `askT1gerMentor`
3. `learningEmailPreferences`
4. `emailUnsubscribe`
5. `reportWebIssue`
6. `createSupportRequest`
7. `t1gerOperations`
8. `sendLearningEmails`
9. `learningEmailWebhook`
10. `retryWaitlistEmails`

Las tres funciones de correo están ACTIVE y los dos jobs de Cloud Scheduler ENABLED, cada quince minutos. El worker de aprendizaje retorna sin enviar mientras `T1GER_EMAIL_READY=false`. El worker de waitlist recupera únicamente la cola privada existente. El primer despliegue de los workers falló al subir imágenes a Artifact Registry (503); el reintento terminó correctamente el 8 de octubre, 16:01 UTC.

No se desplegó todo el backend compartido con móvil. Las reglas live coinciden con las versionadas antes de esta entrega.

- Copia diaria nativa de Firestore, retención de siete días, ubicación `nam5`.
- Primera copia observada READY: 8 de octubre, 11:32:05 UTC.
- Alerta de errores operativos y canal de email de soporte configurados. El evento sintético fue aceptado por Cloud Logging; recepción efectiva de la alerta en el buzón pendiente de confirmar.
- Recuperación real completada en una base independiente `t1ger-restore-drill-20261008`: cinco perfiles recuperados y un registro de recompensa inmutable coincidente con el original. Se comprobó que un cliente autenticado no pudiera leer esa copia. Tras la prueba se eliminó exclusivamente la base del ensayo y se confirmó HTTP 404, conservando la base de producción y el backup.
- La tabla de Supabase no tiene un backup nativo confirmado en el plan observado. Hace falta establecer exportación/restauración privada para la waitlist; Firestore no respalda Supabase.

## 3. Evidencia de pruebas

| Prueba | Resultado y alcance |
| --- | --- |
| Root | 17 tests aprobados, incluidos errores/reintentos del correo, permisos del worker y transición desde el sender anterior |
| Web | 42 tests aprobados; los 3 contratos Gold que se omiten sin emulador también se ejecutaron y aprobaron con emulador |
| Servicio | 10 tests unitarios aprobados y build TypeScript correcto, incluido aislamiento de eventos de otros productos |
| Contratos reales de emuladores | Seguridad de propietario/anonimato, soporte, paginación 50+6, mentor, preferencias, baja y firma webhook aprobados |
| SQL en Supabase | Migración aplicada y contrato transaccional con rollback aprobado; sin insertar personas reales ni adelantar la secuencia de la waitlist |
| Persistencia local | 1.000 cuentas sintéticas, 2.000 llamadas, diez cuentas en paralelo, reintentos secuenciales: cero errores o recompensas duplicadas; p95 161 ms |
| Dos llamadas simultáneas en producción | Primera aplicación de una misión en una cuenta sintética: una recompensa, un reintento sin XP, cero XP duplicado; 8 de octubre, 15:09 UTC |
| Gating en producción | Correo no preparado y sin opt-in por defecto, operador denegado a cuenta normal y funciones privadas denegadas a anónimos |
| Recuperación de backup | Restauración nativa terminada, datos recuperados comprobados y lectura de cliente denegada; 8 de octubre, 15:14 UTC |
| Responsive de los nuevos formularios | 320 y 390 px; sin desbordamiento horizontal observado; guardado y ticket en preview; preferencias de email guardadas desactivadas con una cuenta sintética real en producción; inputs corregidos en modo claro y oscuro |
| Webhook HTTP en producción | Eventos sintéticos firmados: entrega aceptada, queja suprime envíos, entrega posterior conserva la queja y evento sin firma rechazado. Fixtures privados retirados; ningún correo real enviado |
| Gold congelada | Los seis archivos congelados siguen iguales a `74f4b48` |
| GitHub CI | Workflow `Verify release` aprobado en los commits `bed1ad4`, `3ad6881` y `b6c9b70`; incluidos PostgreSQL y emuladores |

La prueba de simultaneidad en el emulador antiguo presentó bloqueos de transacción; la comprobación pequeña en producción sí pasó. Esto no sustituye una prueba de carga cloud del sistema completo. No se han probado 1.000 personas concurrentes, la disponibilidad de OpenRouter a ese volumen ni la entregabilidad real de los correos.

## 4. Activación del correo — pasos que faltan

1. Facilitar nombre legal del operador. La dirección proporcionada permanece en un archivo local ignorado; no está en el repositorio ni publicada. Confirmar la dirección que deba aparecer en el footer comercial.
2. Configurar `T1GER_EMAIL_OPERATOR` con identidad y domicilio completos. El remitente y reply-to ya están configurados; mantener `T1GER_EMAIL_READY=false` hasta la prueba.
3. Hacer una prueba con un buzón controlado autorizado: aceptación, entrega, clic en destino, baja y supresión. No enviar a la lista histórica ni simular entregabilidad.
4. Activar una cohorte pequeña con presupuesto de veinte intentos diarios y revisar cola/quejas antes de aumentar. Desplegar el mismo gate en `learningEmailPreferences` y `sendLearningEmails`.

Los secretos de Firebase usan nombres propios de T1GER: `T1GER_RESEND_API_KEY`, `T1GER_RESEND_WEBHOOK_SECRET` y `WAITLIST_CRON_SECRET`. No se sustituyeron secretos del backend móvil. Vercel no permite convertir a Secret la clave gestionada por su integración Resend: permanece en su tipo original; la copia autorizada de Firebase sí está en Secret Manager. Ningún valor secreto ni domicilio personal está en Git.

Resend mantiene la idempotencia durante 24 horas: [documentación del proveedor](https://resend.com/changelog/idempotency-keys). El sistema retiene estados ambiguos antes de que termine esa protección.

## 5. Operación diaria para 1.000 cuentas

- Revisar fallos del mentor, admisión/cuotas y mensajes de proveedor; 600 reservas upstream diarias pueden ser insuficientes para uso intensivo de 1.000 cuentas.
- Atender soporte y reportes, con responsable y tiempo objetivo de respuesta. El panel no sustituye una persona responsable.
- Tramitar exportaciones/eliminaciones con inventario de Firestore, Auth, Storage, Supabase y proveedores externos. El backend móvil antiguo no cubre todos los nuevos datos y puede tocar contenido de otras personas: no se conectó un borrado incompleto.
- Comprobar backups diarios y ensayar recuperación periódica en una base aislada con clientes denegados. Firestore documenta el destino independiente en [REST restore](https://firebase.google.com/docs/firestore/reference/rest/v1/projects.databases/restore).
- Confirmar recepción de alertas, rebotes/quejas y cola de envíos antes de subir límites.
- Configurar PostHog con consentimiento opcional y masking. No capturar textos del mentor, formularios o datos privados en session replay.
- Mantener Founder/pagos pausados hasta verificar RPC, webhook, concesión de beneficios y reembolso end-to-end.
- Hacer pruebas cloud progresivas en staging. Detener el aumento si crecen p95, errores, lecturas/coste o rechazos del proveedor. Tener presupuesto y responsable de incidentes.
- Revisar fuentes, derechos de uso y aprobación editorial real. Las etiquetas de revisión del catálogo heredado no constituyen evidencia de revisión o licencia.
- Ejecutar validación humana de aprendizaje/retención. Una simulación de IA no acredita resultados con personas ni permite afirmar «la mejor educación» como hecho demostrado.

## 6. Rollback y límites del lanzamiento

- Frontend: volver al deployment anterior en Vercel. Si se vuelve al sender antiguo, desactivar V2 para esa versión y no drenar trabajos ambiguos sin revisar Resend.
- Mentor: reducir presupuesto diario o pausar admisión antes de cambiar modelos o habilitar gasto.
- Correo: `T1GER_EMAIL_READY=false`; desactivar workers si es necesario. No borrar la cola para ocultar errores.
- Las migraciones son aditivas. No borrar tablas/colas de producción para revertir la UI.
- Las pruebas de esta entrega justifican una beta controlada. No equivalen a garantía de escalabilidad, asesoría legal, validación humana ni lanzamiento de pagos.

## 7. Datos que debe proporcionar el propietario

- Nombre legal del operador y domicilio postal que autorice usar en emails comerciales.
- Email de la cuenta T1GER que debe tener acceso privado de operador.
- Identificador público y región del proyecto PostHog, o creación de ese proyecto por el propietario.
- Confirmación de recepción de alerta y buzón autorizado para prueba de entrega.
- Personas reales para validar la educación y responsable de revisión editorial/privacidad/soporte.

Estas dependencias requieren información, acceso o trabajo humano; no son funciones imposibles de implementar. Las partes pendientes de código o comprobación se indican expresamente arriba.
