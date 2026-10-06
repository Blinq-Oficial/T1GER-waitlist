# T1GER: emails de cuenta, aprendizaje y soporte

Especificación del 6 de octubre de 2026. Estas secuencias no están activadas ni se han enviado a usuarios.

## Objetivo

Ayudar a terminar una idea útil, aplicarla y recuperarla después. El éxito es volver y aprender; clicks y aperturas son indicadores secundarios.

Inspiración documentada: Duolingo personaliza recordatorios con factores como el curso y la racha, y permite gestionar el horario. Aquí proponemos reglas simples y controlables antes de optimización algorítmica. [Recordatorios de Duolingo](https://blog.duolingo.com/hi-its-duo-the-ai-behind-the-meme/), [preferencias de horario](https://blog.duolingo.com/duolingo-101-how-to-learn-a-language-on-duolingo/).

## Reglas de todo el programa

- Un mensaje tiene una acción principal. Copy breve, una imagen estática de T1GER cuando aporte contexto y un botón visible en móvil. Ningún modelo 3D/WebGL dentro del email.
- HTML y texto; ALT descriptivo cuando la imagen aporte información, ALT vacío si es decorativa. El email se entiende con imágenes bloqueadas y en modo oscuro.
- Idioma elegido por el usuario, inicialmente español e inglés. No inferir idioma a partir del apellido o email.
- Recordatorios, resumen, reactivación y novedades son categorías optativas; no convertir automáticamente a la waitlist en suscripción a emails de aprendizaje.
- Separar consentimiento de email de preferencias de notificaciones push; el `prefs[id] ?? true` actual no sirve como consentimiento de email.
- Máximo propuesto: un email de aprendizaje por día y tres por semana, contando recordatorio, repaso, resumen y reactivación. El resumen semanal reemplaza un recordatorio de ese día. Mensajes indispensables de cuenta/seguridad tienen su política separada.
- Horario local elegido; franja de silencio propuesta 21:00–08:00. Zona horaria validada y cálculo que soporte cambios de hora. Si no hay zona horaria/horario, usar una hora acordada al activar el programa, no suponer que todos viven en Michigan.
- Revalidar elegibilidad inmediatamente antes de enviar: actividad completada, consentimiento retirado o baja cancela el trabajo pendiente.
- Prioridad si coinciden: seguridad → ayuda de acceso → repaso debido → práctica incompleta → resumen. No acumular todos los mensajes.
- Queja o rebote permanente: supresión. Rebote temporal: reintento limitado. Un “aceptado por proveedor” no se registra como “entregado”.
- Enlaces de aprendizaje abren la pantalla normal de T1GER; si hace falta login, conservar el destino. No incluir email/UID en URL ni tokens de sesión en mensajes.
- El email no contiene reflexiones, reglas financieras personales, preguntas al mentor ni respuestas privadas del alumno.
- El footer de campañas incluye preferencias y baja sin login, operador y dirección postal final. Esos datos todavía necesitan confirmación; el programa no puede activarse con placeholders.

## 1. Cuenta y seguridad

### Verificación de email

- Disparador: alta por contraseña cuando el email no está verificado; reenviar solo a petición con límite de frecuencia.
- Implementación inicial: conservar Firebase Auth para enlaces de acción y validación; comprobar branding, dominio, idioma y entrega en buzones de prueba.
- Propósito: confirmar posesión de email antes de incorporar el contacto a recordatorios y funciones que lo requieran. No tratar la bienvenida como verificación.
- Copy propuesto: “Confirma tu email para recibir tus recordatorios de T1GER.” / “Confirm your email to receive your T1GER reminders.”
- CTA: “Confirmar email” / “Confirm email”, enlace de acción emitido por Firebase.
- No bloquear lectura de lecciones por un fallo del proveedor de campañas. Confirmar la política de acceso antes de implementarla.

### Recuperación de contraseña

- Ya existe `sendPasswordResetEmail`; conservar ese flujo y probar la entrega y el retorno al dominio correcto.
- No revelar si una cuenta existe mediante mensajes diferentes ni permitir spam de enlaces de recuperación.
- Un cambio de proveedor de newsletters no implica reemplazar este flujo de autenticación.

### Otros mensajes de cuenta

Cambios de email, eliminación/exportación solicitada y, cuando se habiliten pagos, recibos y problemas de facturación. Incorporarlos únicamente al implementar esos procesos; no prometer acciones que la app todavía no ejecuta.

## 2. Bienvenida Web

**Entrada:** perfil de aprendizaje creado, con acceso verificado y política de bienvenida definida. Una sola vez por cuenta; no una vez por login.

**Objetivo:** empezar la primera lección. **Salida:** bienvenida enviada/suprimida; nunca se repite por cambiar de ruta.

- Asunto ES: “Tu primera idea útil te espera”. EN: “Your first useful idea is ready”.
- Preheader ES: “Una idea, una decisión y algo que recordar.” EN: “One idea, one decision, and something to remember.”
- Cuerpo ES: “Bienvenido a T1GER. Empieza con una idea pequeña, pruébala y conviértela en algo que puedas usar. Tu progreso te acompañará cuando vuelvas.”
- Cuerpo EN: “Welcome to T1GER. Start with one small idea, try it, and turn it into something you can use. Your progress will be here when you return.”
- CTA: “Empezar mi primera lección” / “Start my first lesson” → `/app/learn`.

## 3. Ayuda para terminar onboarding

**Entrada:** onboarding iniciado, cuenta verificada y permiso para esta ayuda. **Momento propuesto:** 24 horas sin completar; una sola vez en siete días. **Salida:** onboarding terminado, cuenta eliminada, baja o envío previo.

- Asunto: “Tu camino quedó guardado” / “Your starting point is saved”.
- Preheader: “Elige un tema y comienza con una idea.” / “Choose a topic and start with one idea.”
- Cuerpo ES: “Puedes retomar tu inicio cuando te venga bien. Elige el tema que más te interese y un ritmo que encaje en tu día.”
- Cuerpo EN: “You can pick up your setup when it suits you. Choose a topic you’re curious about and a pace that fits your day.”
- CTA: “Continuar mi inicio” / “Continue setup” → `/app/` con retorno al paso guardado.

No decir que algo quedó guardado si el estado durable no existe. Antes de activar, verificar el checkpoint correspondiente.

## 4. Práctica del día

**Entrada:** onboarding completo, categoría activada y una siguiente acción disponible. **Momento:** horario local preferido. **Salida del día:** objetivo de aprendizaje ya completado, práctica en curso, repaso con mayor prioridad o cap alcanzado.

- Asunto: “Una idea para hoy: {título_corto}” / “One idea for today: {short_title}”.
- Preheader: “Retoma tu siguiente paso.” / “Pick up your next step.”
- Cuerpo ES: “Tu próximo paso es {título_corto}. Cuando tengas unos minutos, retómalo y conviértelo en una decisión útil.”
- Cuerpo EN: “Your next step is {short_title}. When you have a few minutes, pick it up and turn it into a useful decision.”
- CTA: “Continuar aprendiendo” / “Continue learning” → `/app/learn`.

Personalización permitida: título curricular publicado y acción disponible. No inventar progreso ni usar “perderás todo” como presión. La racha corresponde a Apply; un email no la mantiene.

## 5. Terminar Apply

**Entrada:** lección con aplicación pendiente. **Momento:** al siguiente horario elegible después de 24 horas. **Salida:** Apply terminado, pendiente cancelado, otro mensaje prioritario o cap alcanzado. Sustituye al recordatorio genérico.

- Asunto: “Dale un uso a esa idea” / “Put that idea to work”.
- Preheader: “Te queda un pequeño paso para hacerla tuya.” / “One small step to make it yours.”
- Cuerpo ES: “Ya exploraste {título_corto}. Tu aplicación está pendiente. Retómala cuando puedas y guarda algo útil para volver a usarlo.”
- Cuerpo EN: “You’ve explored {short_title}. Your Apply step is waiting. Pick it up when you can and keep something useful to use again.”
- CTA: “Terminar mi aplicación” / “Finish my Apply step” → `/app/apply`, o al paso guardado de Gold cuando corresponda.

No enviar si solamente existe un click de apertura: el servidor debe confirmar el estado de esa lección. No incluir el contenido de la reflexión.

## 6. Repaso que ya está debido

**Entrada:** una tarjeta elegible tiene fecha de repaso vencida. **Momento:** siguiente horario local permitido, consolidar varios repasos en un email. **Salida:** cola al día, permiso retirado o cap alcanzado.

- Asunto: “Trae de vuelta una buena idea” / “Bring a good idea back”.
- Preheader: “Intenta recordarla antes de ver la respuesta.” / “Try recalling it before seeing the answer.”
- Cuerpo ES: “Hay {n} idea(s) listas para repasar. Intenta recordarlas primero y después comprueba lo que falta. Un pequeño repaso puede mostrarte qué conservar y qué practicar.”
- Cuerpo EN: “You have {n} idea(s) ready to review. Try recalling them first, then check what you missed. A short review can show what to keep and what to practice.”
- CTA: “Hacer mi repaso” / “Start my review” → `/app/master`.

El email no ofrece la respuesta a la pregunta de recuperación. No adelantar repasos ni cambiar el algoritmo para generar más emails.

## 7. Resumen semanal

**Entrada:** `weeklyReportOptIn` confirmado para email y al menos una actividad pertinente esa semana. **Momento:** día elegido y horario local; una vez por semana. **Salida:** baja, semana vacía o envío de ese periodo registrado.

- Asunto: “Esta semana: {n} ideas puestas en práctica” / “This week: {n} ideas put to work”.
- Preheader: “Lo que usaste y tu siguiente paso.” / “What you used, and your next step.”
- Cuerpo ES: “Esta semana completaste {n} aplicaciones y {r} repasos. Tienes {h} herramientas guardadas para volver a usar. Tu siguiente paso te espera en T1GER.”
- Cuerpo EN: “This week you completed {n} Apply steps and {r} reviews. You have {h} saved tools to use again. Your next step is waiting in T1GER.”
- CTA: “Ver mi progreso” / “See my progress” → `/app/progress`.

Se necesita una fuente fiable para contar repasos de un periodo. No utilizar el total de repeticiones FSRS como si fuera el número de repasos de esa semana. Si el agregado no existe, omitir esa cifra o construirlo antes de activar el resumen.

## 8. Hitos

**Entrada:** un hito verdadero de Apply o una ruta completada. **Momento:** siguiente ventana elegible; si coincide con resumen, incluirlo en ese resumen. **Salida:** identificador de hito ya enviado, baja o cap alcanzado.

- Asunto: “Completaste {nombre_del_hito}” / “You completed {milestone_name}”.
- Cuerpo ES: “Ese progreso es tuyo: {descripción_verificable}. Vuelve a tus herramientas cuando las necesites y sigue con el siguiente paso.”
- Cuerpo EN: “That progress is yours: {verified_description}. Come back to your tools when you need them and keep going with your next step.”
- CTA: “Ver lo que construí” / “See what I built” → `/app/library`.

Completar una ruta no se anuncia como dominar un tema. No transformar XP de práctica en una puntuación de conocimiento demostrada.

## 9. Regreso después de una pausa

**Entrada:** siete días sin actividad pertinente y suscripción vigente. **Momento:** una vez; opcional segundo mensaje a los 21 días. **Salida:** regreso, baja o segundo envío; después pausar reactivación durante 30 días.

- Asunto: “Tu siguiente paso sigue aquí” / “Your next step is still here”.
- Preheader: “Retoma cuando te venga bien.” / “Pick it up when it suits you.”
- Cuerpo ES: “Puedes volver con una sola idea. Tu progreso sigue guardado y no hace falta recuperar todos los días que pasaron.”
- Cuerpo EN: “You can return with one idea. Your progress is saved, and you don’t need to make up for every day you missed.”
- CTA: “Retomar mi camino” / “Return to my path” → `/app/learn`.

Suspender recordatorios recurrentes mientras se aplica esta política de inactividad. No enviar un recordatorio diario y una campaña de regreso a la misma persona.

## 10. Waitlist y productos de pago

- Mantener la finalidad de la waitlist móvil y su bienvenida separadas de la cuenta Web.
- El alta en waitlist debe permitir una baja de las actualizaciones posteriores. Retener únicamente lo necesario conforme a la política final.
- Cuando checkout esté probado: recibo, fallo de pago, renovación según normativa aplicable, cancelación y reembolso; siempre desde el estado confirmado del proveedor.
- No enviar upsells ni promesas de beneficios mientras no haya un producto Pro, precio, condiciones y permisos implementados de extremo a extremo.

## 11. Recibir y responder

- `Reply-To` conduce a un buzón vigilado. Confirmación de soporte con número de caso si se implementa un sistema de tickets.
- No remitir automáticamente preguntas privadas a un modelo de IA ni mandar autorespuestas sustantivas como si fueran decisiones humanas.
- Separar solicitudes de privacidad, pagos, fallos de progreso y reportes de seguridad; registrar responsable y resolución.
- Si se procesan mensajes/adjuntos por webhook: verificar firma, limitar tamaño y tipos, deduplicar eventos y restringir acceso al contenido.

## 12. Pruebas antes de activar

1. Remitente verificado, SPF/DKIM/DMARC y respuestas recibidas en buzón controlado.
2. Plantillas probadas en Gmail, Outlook y Mail de iPhone; imágenes bloqueadas, texto y tema oscuro.
3. Recordatorio cancelado si el alumno termina antes del envío.
4. Cambio de zona horaria y horario de verano no duplican el mensaje del día.
5. Baja accesible sin sesión; trabajo ya en cola se suprime.
6. Queja y rebote permanente suprimen futuros mensajes optativos.
7. Dos workers o un retry no producen dos entregas del mismo evento; simular timeout después de aceptación.
8. Fallo del proveedor conserva el trabajo recuperable; no vuelve a crear cuentas ni recompensas.
9. Cap diario/semanal y prioridad funcionan para mensajes simultáneos.
10. Login vuelve al destino del email; no transporta tokens de sesión en URL.
11. Métricas distinguen solicitado, aceptado, entregado, click, regreso y aprendizaje posterior.
12. Lanzamiento primero con buzones y cuentas de prueba autorizados; después con una tanda consentida y revisión de errores.

### Dependencias de activación

Operador/dirección final, dominio de envío validado, buzón que atienda respuestas, acceso seguro al proveedor elegido, política de consentimiento, cola y webhook desplegados y evidencia de las pruebas anteriores. Ninguna campaña masiva se ha enviado como parte de esta especificación.
