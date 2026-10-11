# T1GER — Distribución, marketing y SEO en inglés y español

Fecha: 11 de octubre de 2026. Horizonte: primeros 30 días. Responsable inicial: fundador. Presupuesto recomendado: orgánico; publicidad solo después de comprobar activación.

## 1. Qué vendemos y a quién

**Propuesta:** una idea útil, una experiencia interactiva, una aplicación que conservas y un repaso para recuperarla después. Dinero, IA y pensamiento cotidiano en sesiones breves. La primera victoria debe ser entender y usar algo, además de ganar XP.

Mensaje EN: **“Learn something you can use. One idea. One useful action.”**

Mensaje ES: **“Aprende algo que puedas usar. Una idea. Una acción útil.”**

Hipótesis de público inicial: estudiantes y profesionales de 18–25 años que quieren entender su dinero, utilizar IA o tomar mejores decisiones. Probar en comunidades de habla inglesa y española; todavía no tenemos evidencia de qué país, edad o canal convierte mejor. Admitir usuarios de 15 años no implica dirigir campañas de adquisición a menores.

No anunciar “la mejor educación demostrada”, sustitución de educación formal, resultados financieros garantizados ni aprendizaje validado por personas reales cuando esa validación siga pendiente. La curación de fuentes y el motor interactivo son una propuesta que debemos medir con personas.

## 2. Estado real y alcance bilingüe

| Disponible / preparado | Límite que debe quedar claro |
|---|---|
| App web en `t1ger.app/app/`, también en el navegador del teléfono | Las apps nativas de iOS/Android todavía no se han lanzado |
| Seis guías originales: tres conceptos, cada uno en EN y ES | Son ejemplos educativos revisables, no un catálogo completo de libros |
| Lectura pública sin cuenta, ejemplos visuales y pregunta de práctica | No equivale a completar una lección ni da XP |
| Mentor con elección de idioma EN/ES | La interfaz de la app sigue principalmente en inglés |
| Recorridos Learn → Apply → Master y progreso | La calidad educativa requiere pruebas humanas, no solo pruebas técnicas |
| Preferencias de correos en la app | No afirmar que todos los correos de aprendizaje estén activos; verificar el servicio antes de anunciarlos |
| Instrumentación de eventos PostHog preparada | Requiere clave pública de proyecto, configuración de región y elección del usuario |
| Métricas agregadas de Vercel en sitio y guías | Visitas no equivalen a personas identificadas ni atribución completa del embudo |

Lanzamos **contenido y distribución en ambos idiomas desde el inicio**. Antes de ampliar campañas de español, validar con participantes hispanohablantes si la interfaz inglesa impide terminar. El siguiente sprint de localización debe cubrir onboarding, lecciones, errores, navegación, emails y ayuda; traducir solo la portada no resuelve ese problema.

## 3. Embudo que aporta valor

1. Una búsqueda, un vídeo o una recomendación resuelve una duda concreta.
2. La persona lee la guía pública en su idioma, sin registro obligatorio.
3. El CTA abre la app web y explica que puede empezar ahora.
4. Elige un tema y una intención diaria en onboarding.
5. Termina una primera lección y su aplicación.
6. Recupera la idea mediante un repaso cuando corresponda.
7. Solo después probamos qué mejoras justifican pagar: profundidad, herramientas reutilizables, continuidad y ayuda útil. No activar ventas mientras el cobro o los beneficios estén pausados o sin probar.

Una sesión exitosa debe responder: “¿Qué entendí? ¿Dónde lo uso? ¿Qué me llevo?”. Reducir fricción antes de comprar tráfico.

## 4. SEO implementado en este sprint

- Guías en HTML estático: todo el artículo está en la respuesta del servidor y se lee sin JavaScript.
- URLs distintas para EN y ES, canonical propio y enlaces `hreflang` recíprocos, incluido `x-default`.
- Títulos, descripciones, Open Graph y datos estructurados Article/CollectionPage coherentes con el contenido visible.
- Sitemap con portada y páginas educativas públicas. Exclusión de pantallas de cuenta/app y avisos legales todavía no destinados a adquisición.
- `X-Robots-Tag: noindex, follow` y meta noindex para la app; esto controla indexación, **no sustituye autenticación**.
- Enlaces desde el footer del sitio a las guías; enlaces internos entre artículos y CTA directo a la app.
- Robots limita endpoints de API y autenticación. No bloquea `/app` para que Google pueda leer su instrucción noindex.
- Ejemplos originales, fuentes primarias visibles y distinción entre ejemplo e inversión recomendada. Sin reseñas, puntuaciones ni credenciales inventadas.

Google recomienda contenido útil y versiones localizadas accesibles mediante URLs separadas; `hreflang` ayuda a identificar las alternativas, pero no garantiza posiciones. [Contenido útil](https://developers.google.com/search/docs/fundamentals/creating-helpful-content), [versiones localizadas](https://developers.google.com/search/docs/specialty/international/localized-versions), [SEO y JavaScript](https://developers.google.com/search/docs/crawling-indexing/javascript/javascript-seo-basics).

### Páginas iniciales

| Tema | Inglés | Español |
|---|---|---|
| Poder adquisitivo | [Inflation and buying power](https://t1ger.app/guides/en/inflation-and-buying-power) | [Inflación y poder adquisitivo](https://t1ger.app/guides/es/inflacion-y-poder-adquisitivo) |
| Prompts útiles | [Write better AI prompts](https://t1ger.app/guides/en/write-better-ai-prompts) | [Cómo escribir prompts útiles](https://t1ger.app/guides/es/como-escribir-prompts-utiles) |
| Pensar con evidencia | [Confirmation bias](https://t1ger.app/guides/en/confirmation-bias-in-everyday-decisions) | [Sesgo de confirmación](https://t1ger.app/guides/es/sesgo-de-confirmacion-en-decisiones) |

### Próximas piezas, según demanda observada

| Grupo | Preguntas EN / ES que investigar | Siguiente pieza práctica |
|---|---|---|
| Dinero | “nominal vs real value” / “valor nominal y real” | Comparación visual con supuestos explícitos |
| Dinero | “emergency fund vs investing” / “fondo de emergencia o invertir” | Decisión por propósito y plazo, sin recomendación individual |
| IA | “AI prompt examples for students” / “ejemplos de prompts para estudiar” | Plantilla de explicación + pregunta + revisión |
| IA | “how to check AI answers” / “cómo comprobar respuestas de IA” | Ejercicio con un error verificable y fuentes |
| Pensamiento | “confirmation bias examples” / “ejemplos de sesgo de confirmación” | Una decisión cotidiana y evidencia contraria |
| Memoria | “active recall vs rereading” / “recuerdo activo o releer” | Probar recordar antes de ver la explicación |

Estas consultas son hipótesis, **no volúmenes de búsqueda medidos**. Elegir las siguientes páginas con Search Console, preguntas de usuarios y capacidad de producir una explicación mejor. Publicar inicialmente una pareja EN/ES por semana, revisada por una persona competente en el tema. No generar cientos de páginas casi idénticas.

## 5. Calendario de 30 días

| Días | Trabajo | Entregable / decisión |
|---|---|---|
| 1–3 | Verificar teléfonos reales, Search Console, sitemap, eventos disponibles; revisar ES con un lector nativo | Lista de fricciones y línea base del embudo |
| 4–7 | Invitar personalmente 10–20 usuarios adultos EN/ES; observar primera lección; producir tres ideas en ambos idiomas | 6 vídeos breves, 5 sesiones observadas, lista priorizada de errores |
| 8–14 | Publicar las seis variantes en canales propios; compartir guías en comunidades donde esté permitido; entrevistar usuarios que abandonan | Primeras hipótesis sobre tema y mensaje que llevan a una aplicación |
| 15–21 | Añadir una pareja de guías basada en preguntas reales; probar colaboración con 3–5 microcreadores educativos | Una colaboración pequeña, una demostración y un caso real con autorización |
| 22–30 | Repetir el tema con mayor activación; revisar cohortes de retorno; corregir fricciones ES; evaluar disposición a pagar | Informe por idioma/canal, siguiente sprint y decisión sobre experimento pagado |

Cadencia sostenible: tres ideas originales por semana, cada una adaptada a EN y ES; una pareja de artículos semanales; una sesión de feedback; una revisión de métricas. Adaptar cada pieza al idioma, sin mezclar ambos idiomas en un vídeo que dificulte entenderlo.

## 6. Canales y distribución

### Vídeos cortos: TikTok, Reels y Shorts

Estructura: situación visible → sorpresa útil → interacción → respuesta → aplicación en T1GER. Subtítulos grandes, una sola idea, llamada a abrir la web. La mascota reacciona a la idea; no desplaza la explicación. Grabar pantalla real del teléfono, nunca una función que aún no existe.

La mascota consistente es una inspiración de la comunicación de Duolingo. Su éxito no garantiza el nuestro. T1GER puede combinar un personaje reconocible con ejemplos útiles y un diseño tranquilo. [Caso oficial de Duolingo en TikTok](https://ads.tiktok.com/business/en-US/inspiration/ad-awards-duolingo-case-study).

### Comunidades

Empezar por clubes universitarios, comunidades de aprendizaje/IA/productividad y grupos donde el fundador participa realmente. Entregar una guía útil y solicitar feedback concreto; respetar reglas de promoción. No crear usuarios falsos, publicar testimonios sintéticos ni automatizar mensajes masivos.

### Creadores y alianzas

Buscar creadores pequeños que expliquen un concepto con precisión y tengan conversación real con su audiencia. Proponer una demostración de 30 segundos y una sesión de primera lección. Medir activación, no solo impresiones. Cualquier incentivo o colaboración comercial debe identificarse. La publicación y los mensajes requieren autorización del fundador; este sprint prepara el plan, no contacta a nadie.

### Email

Separar actualizaciones solicitadas de la waitlist móvil y recordatorios de aprendizaje elegidos por usuarios. No importar la waitlist automáticamente a campañas ajenas a su finalidad. Antes de enviar: servicio operativo, dominio y remitente configurados, bajas probadas y contenido que aporte una idea o una acción. Evitar culpabilizar al usuario por perder una racha.

## 7. Seis guiones listos para adaptar

**Dinero EN, 20–25 s:** “Your wallet still has ten dollars. Yesterday that bought five snacks. Today it buys four. What changed? Buying power. Try the example, then decide what job your money needs to do. T1GER is available on the web.”

**Dinero ES:** “Tu cartera sigue teniendo diez dólares. Antes compraban cinco snacks. Ahora compran cuatro. ¿Qué cambió? El poder adquisitivo. Prueba el ejemplo y piensa para qué necesitas tu dinero. T1GER ya está en la web.”

**IA EN:** “ ‘Write an email’ makes AI guess. Give it the goal, the situation and the format: three sentences, move Tuesday’s meeting to Thursday, leave the time blank. Then check the draft. Try a useful prompt in T1GER.”

**IA ES:** “ ‘Escribe un correo’ hace que la IA adivine. Dale objetivo, contexto y formato: tres frases, cambiar la reunión del martes al jueves, dejar la hora pendiente. Después revisa el resultado. Prueba un prompt útil en T1GER.”

**Pensamiento EN:** “You want this phone. You find five glowing reviews. Before buying, ask: what evidence would make me change my mind? Now look for that evidence. One small habit for a better decision. Practice it in T1GER.”

**Pensamiento ES:** “Quieres ese celular. Encuentras cinco reseñas buenísimas. Antes de comprar, pregunta: ¿qué evidencia me haría cambiar de opinión? Ahora búscala. Un hábito pequeño para decidir mejor. Pruébalo en T1GER.”

CTA de español: indicar en descripción que las guías están en español y que la interfaz de la app está actualmente en inglés. No prometer app móvil nativa.

## 8. Métricas y decisiones

| Métrica | Definición | Cómo usarla |
|---|---|---|
| Visitas educativas | Páginas públicas vistas; distinguir artículo e idioma | Detectar qué temas atraen interés |
| Embudo de creación | `signup_started` → `signup_completed` → `onboarding_completed` | Localizar fricción de acceso |
| Activación | Primera `lesson_completed` y primera `apply_completed` en 24 h | Medir si se obtiene valor práctico |
| Repaso | Primer `review_completed` cuando hay contenido debido | Verificar continuidad del motor |
| Retorno D1/D7 | Personas de una cohorte que vuelven al día siguiente / séptimo día | Investigar por qué vuelven; no confundir con visitas totales |
| Utilidad | “¿Qué usarías de esto fuera de la app?” después de la primera aplicación | Evidencia cualitativa de valor |
| Aprendizaje | Pregunta nueva de transferencia y recuerdo diferido | Evaluación humana; XP no es prueba de dominio |

Los nombres de eventos citados están en la lista permitida del código. PostHog necesita estar configurado y autorizado por el usuario para recogerlos. Cohortes y atribución de campaña todavía requieren configurar análisis; no hay un dashboard completo de campaña creado en este sprint.

Vercel aporta métricas agregadas. Las guías eliminan parámetros de URL antes de enviar la visita. No depender de UTMs arbitrarios para seguir personas ni enviar correos, preguntas del mentor o datos de cuenta a analítica. Usar nombres de campaña públicos y enlaces distintos a guías existentes; con la integración actual la atribución persistente entre guía, registro y lección no está resuelta.

Primer objetivo interno: 20 personas adultas prueban una lección; al menos 15 explican qué aprendieron y encuentran el CTA sin ayuda. Es un criterio de prueba propuesto, **no un benchmark ni resultado alcanzado**. Si fallan, corregir onboarding/enseñanza antes de publicidad. Retención y disposición a pagar se establecen con la línea base, no con cifras inventadas.

## 9. Presupuesto y criterio para anuncios

Mes inicial: cero gasto obligatorio. Priorizar tiempo del fundador y creadores que acepten probar. Si el flujo móvil funciona y aparecen aplicaciones útiles y retornos, considerar un experimento total de **hasta US$300** repartido entre un tema EN y uno ES. Esta cifra es un límite propuesto de experimento, no una tarifa de las plataformas ni autorización para gastar.

No evaluar anuncios por clic barato. Comparar coste por primera aplicación y señales de retorno. Detener el experimento si trae registros que no consiguen aprender. No vender una suscripción hasta tener precios, beneficios, cobro y cancelación verificados.

## 10. Pasos del fundador

1. **Search Console:** abrir la cuenta Google propietaria → Añadir propiedad de dominio `t1ger.app` → copiar el TXT indicado → añadirlo en el proveedor DNS → Verificar. En “Sitemaps”, enviar `https://t1ger.app/sitemap.xml`. Solicitar inspección de una guía EN y su alternativa ES. La indexación puede tardar y no está garantizada.
2. **PostHog:** crear/elegir proyecto y región → copiar su clave pública `phc_…` → configurar `VITE_POSTHOG_KEY` y `VITE_POSTHOG_HOST` en el proyecto Vercel y reconstruir ambos frontends. No pegar una clave privada. Probar las elecciones de privacidad y la recepción de un evento de prueba. La integración debe respetar las preferencias existentes.
3. **Dispositivos reales:** probar Safari de iPhone y Chrome de Android: registro, teclado del mentor, rotación, barra de direcciones, subir/bajar por una lección, volver atrás y añadir a pantalla de inicio. La simulación de tamaños no prueba teclado real, WebGL del dispositivo ni velocidades de red reales.
4. **Personas:** reunir 5 EN y 5 ES para observar qué entienden sin explicarles el producto; solicitar autorización separada para grabar una sesión o publicar su testimonio.
5. **Canales:** elegir cuentas oficiales y autorizar publicaciones/colaboraciones. Este plan no ha enviado correos ni publicado contenido en redes.

## 11. Próximas prioridades de producto para escalar adquisición

1. Localización completa ES y validación humana del inicio y de Gold Lesson.
2. Línea base de rendimiento en teléfonos reales y datos de Speed Insights; objetivos LCP ≤2.5 s, INP ≤200 ms y CLS ≤0.1 en el percentil 75, **pendientes de medir**. [Umbrales de Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds).
3. Panel de embudo y cohortes con eventos permitidos; corregir abandono por idioma/dispositivo.
4. Más lecciones con fuentes verificadas y ejemplos propios, revisadas antes de publicarlas.
5. Correos de aprendizaje operativos y pruebas de baja/entrega antes de promoverlos.
6. Monetización basada en entrevistas y uso sostenido; no diseñar solo recompensas para conseguir clics.

## Referencias de implementación

Google utiliza principalmente la versión móvil para indexar; el contenido principal debe estar accesible y mantener su calidad. [Mobile-first indexing](https://developers.google.com/search/docs/crawling-indexing/mobile/mobile-sites-mobile-first-indexing).

El teclado puede reducir el viewport visual sin cambiar el viewport de layout. Por eso el mentor mide `VisualViewport` y no depende solo de `100vh`. [MDN VisualViewport](https://developer.mozilla.org/en-US/docs/Web/API/VisualViewport).

El aprendizaje interactivo y la práctica visible son referencias de producto, no evidencia de superioridad de T1GER. [Brilliant: aprendizaje de programación](https://brilliant.org/topics/coding/).
