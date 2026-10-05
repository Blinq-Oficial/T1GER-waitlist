# T1GER — visual polish and analytics

Fecha: 5 de octubre de 2026. Alcance: Web y waitlist del repositorio unificado.

## Cambios de producto

- Botones principales naranjas con texto oscuro, relieve, respuesta al hover y a la pulsación. Se resolvió la precedencia entre estilos antiguos de tema y los nuevos controles.
- Contraste del texto del botón sobre el extremo más oscuro del degradado: **8,23:1**. Texto secundario del diálogo en claro: **5,53:1**. Estos son controles concretos, no una certificación de accesibilidad de toda la aplicación.
- Retrato de la mascota en navegación, acceso a cuenta, onboarding, Learn y bienvenida del mentor. Se reutiliza el PNG existente; no es un modelo 3D en ejecución. Las celebraciones existentes conservan el personaje 3D.
- Halo, iconos de aprender/aplicar/recordar y entrada suave en Learn; saludo breve del retrato; aparición del número de XP; transición del progreso; sello del día completado; botones y tarjetas con respuesta táctil.
- Las nuevas animaciones respetan `prefers-reduced-motion` y el saludo termina en menos de cinco segundos.
- Onboarding con ilustraciones por tema. Corrección de la superposición de títulos y descripciones en móvil.
- Corrección de la superposición de la mascota sobre el contenido de Learn en móvil. Su escena tiene una fila propia.
- Nuevo panel de ritmo: siete fechas reales, aplicaciones completadas, día actual y siguiente hito de constancia.
- Una racha antigua ya no se muestra como vigente cuando el último día registrado fue anterior a ayer. El cálculo visual usa la zona horaria de la cuenta. No modifica recompensas en el servidor.
- Nuevo pasaporte: XP real, nivel real, siguiente marca visual de 200 XP y accesos a herramientas guardadas y repasos pendientes. Las marcas son referencias visuales, no nuevos niveles ni premios.
- Racha y XP de la barra superior abren Progreso. Perfil usa la misma racha vigente. Se mantiene la elegibilidad existente de las insignias.
- Menos carga 3D en las superficies cotidianas y mayor jerarquía entre una acción principal, progreso y acciones secundarias.

## Referencias y criterio aplicado

Se revisó el índice de 40 referencias de [Five Shelves](https://design-inspo-bay.vercel.app/) y se seleccionaron las más pertinentes. No se afirma haber auditado los 40 sitios completos.

- [Apple iPhone](https://www.apple.com/iphone/): una idea por bloque, imágenes protagonistas, títulos breves y espacio alrededor de la acción.
- [Duolingo: lenguaje de formas](https://blog.duolingo.com/shape-language-duolingos-art-style/): formas simples, personaje consistente y detalles visuales fáciles de reconocer.
- [Duolingo: rachas](https://blog.duolingo.com/how-streaks-keep-duolingo-learners-committed-to-their-language-goals/): constancia visible y un siguiente paso concreto.
- [21st.dev / Motion Primitives](https://21st.dev/@ibelick/library/motion-primitives): números, entradas y transiciones como respuesta al uso. Se implementaron con CSS; no se copió una biblioteca completa ni se añadió Motion a Web.

La dirección visual combina superficies tranquilas, naranja cálido, vidrio en navegación e ilustraciones útiles. La evaluación local mejora problemas concretos; no demuestra equivalencia objetiva con Apple o Duolingo, mejora de conversión ni disposición a pagar. Esas conclusiones necesitan observación de usuarios y datos.

## Analytics preparado

### Vercel

Web ahora incluye los SDK de Web Analytics y Speed Insights que ya tenía la waitlist. Ambos sanitizan URLs: sin query string ni fragmentos, y rutas desconocidas agrupadas como `/other`.

El dashboard permite revisar tráfico por página, origen, dispositivo y rendimiento, según los productos habilitados y el plan. La inclusión de los SDK no prueba por sí sola que el dashboard esté habilitado: comprobar **Web Analytics** y **Speed Insights** en el proyecto de Vercel después de desplegar.

[Documentación oficial](https://vercel.com/docs/analytics). Vercel usa un identificador de visita que se reinicia diariamente; no sirve como identidad permanente ni para medir retención individual entre días.

### PostHog

Preparado, **inactivo hasta conectar el proyecto**. Variables públicas, sin secretos:

```text
VITE_POSTHOG_KEY=phc_...
VITE_POSTHOG_HOST=https://us.i.posthog.com
```

Para región europea usar `https://eu.i.posthog.com`. Añadir las variables al proyecto unificado de Vercel y volver a desplegar para que entren en los dos builds. No compartir una API key personal de administración.

Falta un paso del propietario: crear/elegir el proyecto de PostHog y proporcionar su token público de proyecto y región. Antes de activarlo, elegir retención, personas con acceso y límites de uso/coste en ese proyecto. No se ha contratado un plan ni creado una cuenta en este sprint.

### Elección y privacidad

- Eventos y replay apagados por defecto. Se activan desde **Analytics choices**, disponible en el acceso a cuenta, Settings y el pie de la waitlist.
- Sin banner obligatorio ni paso adicional en el registro.
- El SDK se importa sólo con proyecto configurado y consentimiento. No recopila en desarrollo. Respeta Global Privacy Control para la recopilación opcional.
- Eventos explícitos; autocapture, identificación de cuentas, perfiles personales, logs de consola y captura de excepciones apagados.
- No se envían email, nombre, UID, preguntas, respuestas, reflexiones ni texto del chat como propiedades de producto.
- URLs sanitizadas y propiedades restringidas a nombres de pasos, método, pantalla, acción y rutas conocidas.
- Replay sólo en Learn, Discover, More, Focus y Companion sin parámetros ni fragmentos. Cuenta y onboarding bloqueados también por DOM; chats, lecciones, perfil, comunidad, settings, progreso, colección y aplicaciones excluidos por ruta.
- Todos los textos y campos de replay enmascarados. Sin canvas, cuerpos/cabeceras de red, JSON-LD ni captura de requests de red.
- Se detiene el replay antes de cambiar de pantalla; sólo se reanuda tras renderizar una ruta permitida.
- Retirar la elección detiene replay y captura y reinicia la identidad del SDK. No borra automáticamente datos históricos del servicio externo.
- El identificador de navegador es seudónimo, no garantía de anonimato. Puede haber metadatos técnicos procesados por el proveedor.
- Replay reconstruye la interacción dentro de la web; **no graba la pantalla completa del ordenador**. La máscara impide leer el contenido del usuario.

[Privacidad de session replay de PostHog](https://posthog.com/docs/session-replay/privacy). Los tipos de configuración del SDK instalado también se comprobaron localmente.

### Eventos conectados

| Evento | Momento | Propiedades |
|---|---|---|
| `page_viewed` | Pantalla inicial/cambio de ruta | ruta sanitizada |
| `auth_viewed` | Vista de creación, acceso o recuperación | pantalla |
| `signup_started` | Enviar registro de email o iniciar Google desde registro | método |
| `signup_completed` | Autenticación con cuenta nueva completada | método |
| `signin_completed` | Acceso con cuenta existente completado | método |
| `auth_failed` | Error de autenticación instrumentado | método/pantalla, sin mensaje privado |
| `onboarding_step_viewed` | Abrir intereses, camino principal, ritmo o preparación | paso |
| `onboarding_step_completed` | Avanzar al siguiente paso | paso |
| `onboarding_completed` | Preferencias guardadas en la cuenta | sin datos personales |
| `learning_action_clicked` | Navegación de producto iniciada por usuario | ruta |
| `waitlist_completed` | Respuesta de registro de waitlist completada | sin email ni posición |

Google distingue cuenta nueva de acceso existente con el resultado de Firebase. Volver atrás en onboarding ya no cuenta como completar un paso. Algunos modos estrictos de desarrollo pueden volver a ejecutar efectos, pero desarrollo no envía eventos.

### Dashboard que conviene crear al conectar

1. **Adquisición:** visitas `/`, visitas `/app`, dispositivo, origen y páginas de entrada en Vercel.
2. **Registro:** `signup_started → signup_completed → onboarding_completed`, separados por email/Google. Ventana inicial sugerida: una hora, con la misma identidad de navegador.
3. **Onboarding:** pasos vistos/completados y abandono. Separar recorrido de un interés y varios intereses: el segundo incorpora un paso principal adicional.
4. **Activación de navegación:** onboarding completado → clic de ruta de lección → regreso a Learn/colección/repaso. Un clic no demuestra que se terminó la lección.
5. **Uso:** visitantes que vuelven a Learn, herramientas o Master entre días, sólo en la muestra que aceptó PostHog.
6. **Fricción:** revisar replays permitidos en móvil/escritorio, localizar acciones repetidas, navegación confusa y abandono. Contrastar con feedback voluntario.
7. **Rendimiento:** Core Web Vitals y diferencias por dispositivo en Speed Insights; inspeccionar carga de Firebase, currículo y escenas 3D.

No dividir eventos de PostHog consentidos por todas las visitas de Vercel para afirmar una conversión: son poblaciones e identidades distintas. Tampoco afirmar éxito pedagógico con XP o clics. La validación de aprendizaje usa la evidencia existente de Gold, por separado. No se añadió instrumentación dentro de la lección congelada.

## Validación y límites

- Web: 40 tests pasan; 3 tests de emulador se omiten sin entorno de emulación. Incluye racha por zona horaria, privacidad, Gold V2.1 y animaciones existentes.
- API de waitlist: 10 tests pasan.
- Lint raíz y Web; TypeScript y builds de waitlist y Web bajo `/app/` verificados.
- Revisión de UI local en escritorio y móvil de 390 × 844, claro/oscuro, selección de intereses, XP → Progreso y diálogo de analytics.
- Se comprobaron las seis fuentes congeladas de Gold V2.1 y no se editaron. No cambió la autoridad de recompensas, el scoring ni el backend de aprendizaje.
- Los avisos legales siguen identificados como borradores: operador legal, dirección completa, retención y detalles jurisdiccionales aún requieren cierre.
- El catálogo público de OpenRouter para `qwen/qwen3.8-27b:free` devuelve **cero endpoints** en la comprobación de este día. Este sprint no cambia el proveedor ni permite afirmar que el mentor está operativo. La UI existente conserva el tratamiento de errores de capacidad. Requiere resolver la disponibilidad del proveedor antes de promocionar el mentor como garantía del producto.
- Persisten avisos de tamaño en los chunks de Firebase y 3D. El retrato elimina escenas de varias superficies, pero no resuelve todo el presupuesto de rendimiento.
- No se afirma que los nuevos embudos o replays hayan recogido datos: falta conectar PostHog y verificar ingestión con una sesión consentida.

## Prioridades siguientes

1. Conectar PostHog, verificar un embudo consentido y un replay enmascarado; comprobar exclusión al entrar al mentor o a una lección.
2. Cerrar capacidad y configuración del mentor con un proveedor compatible y comprobar una respuesta real.
3. Sesiones reales de usuarios: entender una idea, aplicarla y recordarla después; no sustituir esta evidencia por simulaciones de IA.
4. Medir abandonos y rendimiento, corregir los fallos más frecuentes y probar cambios de uno en uno.
5. Diseñar Pro alrededor de utilidad demostrable: herramientas reutilizables, práctica personalizada y progreso retenido. Validar interés y precio antes de activar pagos; Founder permanece pausado.
