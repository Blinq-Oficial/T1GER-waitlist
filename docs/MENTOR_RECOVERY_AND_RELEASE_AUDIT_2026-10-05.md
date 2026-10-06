# Recuperación del mentor y revisión de producto

Fecha: 5 de octubre de 2026 (pruebas de servidor después de medianoche UTC del día 6).

## Resultado y alcance

Se recupera la composición del chat original de T1GER APP y se conecta a una ruta real, gratuita y privada desde el servidor. Se devuelve el personaje 3D a Learn, al mentor y al cierre del onboarding. La revisión cubre las pantallas principales en escritorio y móvil; no equivale a validación con personas reales ni garantiza que ya no haya mejoras posibles.

## Cambios de producto

1. **Mentor:** cabecera compacta, bienvenida centrada con tigre 3D, cuatro sugerencias visuales ligadas al camino actual, burbujas y respuestas con párrafos/negritas, avatar pequeño en respuestas y compositor fijo dentro de la pantalla.
2. **Escritura:** el campo crece hasta 128 px; Enter envía, Shift+Enter añade una línea y la composición de texto IME no envía prematuramente. La pregunta se conserva si falla la respuesta o se cancela la introducción.
3. **Conversaciones:** iniciar una nueva conversación limpia el contexto visible; los registros guardados continúan en la cuenta. Se impide enviar o iniciar otra conversación mientras se está esperando, cargando o hay una respuesta pendiente de guardar. El reintento de guardado se mantiene.
4. **Privacidad:** información breve bajo el campo y controles ampliables. La nueva versión del aviso es `openrouter-novita-v1`; una confirmación anterior no cuenta para el nuevo proveedor. Se conserva la declaración 18+ y el control en el servidor. No hay adjuntos, transcripción ni respuestas locales presentadas como IA real.
5. **Mascota:** 3D en el siguiente paso de Learn, bienvenida/espera del mentor y final del onboarding. Master muestra de nuevo la mascota en su estado sin pendientes también en móvil. Los retratos 2D permanecen en navegación, cuenta y mensajes pequeños. Se mantienen las animaciones de lección, recompensa y Companion existentes.
6. **Gráficos:** ilustración original de herramientas guardadas, medallas de progreso con iconos diferentes y acabados distintos al desbloquearse. Los gráficos y cantidades siguen basándose en el progreso real.
7. **Móvil:** se retira el margen de escritorio que inflaba el menú inferior. El chat reserva espacio para navegación y controles; no queda tapado el compositor.
8. **Racha:** Companion usa la misma racha vigente que Learn, Profile y Progress, evitando mostrar una racha expirada del campo bruto del perfil. No se modifican recompensas.
9. **Dependencias:** override compatible de `@grpc/grpc-js >=1.13.6` y lockfile actualizado. `npm audit --prefix apps/web --omit=dev` devuelve cero vulnerabilidades. Permanecen dos avisos moderados de herramientas de desarrollo; no se ejecuta una actualización forzada que cambie la versión mayor del SDK.

## Recuperación de la conexión

- El modelo anterior `qwen/qwen3.8-27b:free` ya no figuraba como ruta activa en el catálogo consultado.
- Ruta principal: **Ling 3.1 Flash / Novita AI**, mediante OpenRouter.
- Ruta de respaldo: **Ling 3.0 Flash Sante free / Novita AI**, solo cuando la principal devuelve 404, 429 o 503. Máximo dos solicitudes y un plazo común de 40 segundos.
- Ambas rutas tienen precios cero en las comprobaciones actuales. Cada petición exige `max_price.prompt=0`, `max_price.completion=0`, `data_collection=deny`, `zdr=true`, proveedor Novita y ausencia de cambio automático a otros proveedores. No se configura una ruta de pago.
- La prueba directa respondía; producción devolvía 429. La ruta de respaldo resolvió la prueba completa desde la función publicada.
- La clave existente del servidor coincide con la clave autorizada localmente; solo se comparó en privado, sin publicarla. No se incluye en el frontend ni en Git.
- Se registra únicamente el tipo de fallo, modelo, estado HTTP o finalización incompleta. No se registran preguntas, respuestas, identificadores de cuenta ni claves en esa telemetría.
- La función `askT1gerMentor` se desplegó en `t1ger-69d6a`, `us-central1`. No se cambian reglas Firestore, catálogo educativo ni permisos de otros usuarios.

## Comprobaciones

### Servidor publicado: cuenta sintética existente

- Llamada sin sesión: rechazada.
- Sin declaración 18+ o con aviso antiguo: rechazada.
- Pregunta educativa en español: respuesta real en 5,3 segundos incluyendo guardado/lectura. Cálculo correcto: depósito $100, año 1 $110, año 2 $121, ganancia $21. Respuesta de 75 palabras con supuestos y sin promesa de rentabilidad.
- Conversación guardada y recargada con la misma consulta que usa Web.
- Lectura del historial de otra cuenta: rechazada.
- Los registros sintéticos son exclusivamente de la cuenta QA; no son datos de alumnos reales.

### Código

- Web: 40 tests pasaron; tres pruebas que requieren emuladores quedaron omitidas, no se contabilizan como aprobadas.
- Mentor: cuatro pruebas pasaron: acceso, precio/privacidad/historial, respaldo acotado y errores sanitizados.
- Lint Web y waitlist; builds separados y secuenciales waitlist → Web para conservar `dist/app`.
- Gold V2.1: seis archivos protegidos sin cambios frente a `74f4b48d7028660f8fc6bd2a325fd2b0d3fa193f`.

### UI

Revisión de Learn, Discover, Apply, Master, mentor, More, Library, Focus, Progress, Settings, Profile, Companion y Community. Sin desbordamiento horizontal en las dimensiones examinadas. Evidencia local de capturas y matriz en `.codex/research/mentor-release-2026-10-05/`.

Se probaron selección y avance del onboarding, elección de intención de cinco minutos y apertura de la primera lección; sugerencias del mentor; Shift+Enter; introducción al enviar; cancelar conservando la pregunta; temas claro/oscuro. El acceso de la cuenta QA funcionó en el dominio publicado. Los estados de diseño se prueban localmente con `preview=1`; ese parámetro no crea una sesión real en producción.

## Qué queda antes de una apertura amplia

- **Capacidad gratuita:** límites por cuenta T1GER de 10 / 50 intentos al día y capacidad compartida de OpenRouter/proveedor. El respaldo mejora disponibilidad, pero ambas rutas pueden limitarse. No es un servicio ilimitado ni hay garantía de disponibilidad.
- **PostHog:** integración preparada, desactivada hasta añadir la clave pública/región del proyecto y habilitar las preferencias correspondientes. Las conversaciones privadas permanecen excluidas de replay.
- **Legal:** los avisos siguen identificados como borradores mientras faltan operador legal, dirección postal confirmada y decisiones de retención. No se inventan estos datos.
- **Educación:** siguen pendientes sesiones con alumnos reales. Las pruebas sintéticas no demuestran retención, transferencia ni superioridad sobre Duolingo.
- **Móvil original:** no se modifica su código; debe incorporar la declaración/versionado actual para usar el mismo callable. No se copia su API key de desarrollo al navegador ni sus respuestas locales de emergencia.
- **Accesorios:** se sincronizan con el compañero móvil; el personaje Web conserva su aspecto animado original, como indica la interfaz. Push del navegador todavía no está activo.

## Referencias usadas

- [Duolingo: coherencia entre pestañas, jerarquía y espacio](https://blog.duolingo.com/core-tabs-redesign/).
- [Duolingo: lenguaje visual de sus ilustraciones](https://blog.duolingo.com/shape-language-duolingos-art-style/).
- [Duolingo: construcción del personaje y animación](https://blog.duolingo.com/building-character/).
- [Ling 3.1 Flash](https://openrouter.ai/inclusionai/ling-3.1-flash), [respaldo Ling 3.0 Flash Sante](https://openrouter.ai/inclusionai/ling-3.0-flash-sante:free).
- [OpenRouter: selección de proveedor](https://openrouter.ai/docs/guides/routing/provider-selection).
- [Novita: términos](https://novita.ai/legal/terms-of-service), [privacidad](https://novita.ai/legal/privacy-policy). La política distingue datos de su web de contenido procesado por cuenta de clientes; se conserva el aviso sin prometer ausencia de todos los registros técnicos.
- [Aviso gRPC y versión corregida](https://github.com/advisories/GHSA-m9gg-hp2v-232j).
