# T1GER — cinco etapas de experiencia

Fecha de implementación: 11 de octubre de 2026. Rama: `codex/web-waitlist-monorepo`. Base: `2a7f9dd8fec3774222d1a678d1f4a331502516f0`.

## 1. Onboarding — `6e94fc0`

El visitante elige un camino y una intención diaria, explora un ejemplo guiado y obtiene feedback antes de crear su cuenta. El registro conserva sus elecciones. Los tres caminos de entrada tienen ejemplos propios: dinero, IA y pensamiento. La muestra es local y no concede XP, racha, progreso persistido ni acceso autenticado. El formulario de cuenta conserva sus comprobaciones existentes.

## 2. Lecciones — `9e0db1a`

Las primeras ideas tienen figuras originales: un mismo saldo compra menos snacks, una compra necesita evidencia favorable y contraria, y una petición a IA se vuelve más concreta con contexto. Elegir una opción no revela inmediatamente la respuesta: se comprueba, se explica y se puede reintentar con la pista. Las preguntas de opción múltiple usan radios nativos, compatibles con teclado. La ayuda recupera contenido ya explicado. Los ejercicios, fuentes, matemáticas y recompensas existentes siguen siendo los responsables del aprendizaje completo.

## 3. Dashboard — `6d8be19`

La acción principal precede al personaje en el celular. La jerarquía separa camino, etapa, lección y apoyo. Cada etapa ofrece una guía con objetivos reales del currículo. «My next step» desplaza y enfoca el nodo vigente. Los contadores grandes usan texto compacto y proporcionan el valor exacto a tecnologías de asistencia. El bloqueo de lecciones y los repasos previos usan la misma política existente.

## 4. Animaciones — `107ddf6`

El cierre de Money, Curriculum y Gold usa la mascota 3D aprobada dentro de una composición común, con anillo, sello y destellos breves. Un recibo diferencia práctica de diseño de trabajo realmente guardado. Revisitar una idea tiene un cierre propio. Las transiciones de respuesta, selección y etapa son cortas y no bloquean continuar. CSS respeta `prefers-reduced-motion`; el renderizador 3D conserva su política existente de reducción de movimiento y suspensión fuera de pantalla. No se incorporó una biblioteca de animación.

## 5. Retención — `0f07649`

Los desafíos diarios abren la siguiente acción pertinente: aprender, completar Apply, repasar o reutilizar herramientas. El pasaporte muestra días de aplicaciones guardadas dentro de la última semana, incluidas las del historial compartido. La barra de XP refleja el intervalo actual de 200 XP: 1.050 XP significa 50/200 hacia 1.200, no 1.050/1.200. Fechas futuras o fuera del rango de Date no cuentan actividad. Estos cálculos son presentación; no conceden recompensas ni recalculan la racha del servidor.

## Investigación: observaciones y límites

Se aplicó REA 6.4.0, con la skill del release `REA6.4.0` fijado en `a56f7bb668ab23fec8d33f7af353ac7ed2fe1895`. Se utilizó modo de artefacto estático porque el navegador conectado no expone el endpoint pasivo de REA. La navegación y las capturas se verificaron por separado en el navegador.

- Artefacto público observado: `https://d35aaqx5ub95lt.cloudfront.net/js/app-c397ede4.js`, obtenido desde la lista de scripts de la página de Duolingo. Se trató como texto inerte, sin ejecutar su bootstrap.
- SHA-256: `3facb5e973492319db245d56e8166e7564ee3cced48e91f26f6c27c8b71f2125`. Tamaño: 1.121.026 bytes.
- REA recuperó 342 módulos, recorrió 290.087 nodos AST y reportó cero fallos de parseo del único JavaScript analizado. Evidencia `ev_a0cc7c2001aa802943ccc77e9bfcdbb6b58b65c043bc0893550c053d255326a7`; autoridad `shipped-artifact`, confianza `derived`.
- El grafo es parcial. Imports/endpoints estáticos no prueban comportamiento en ejecución; no se reconstruyó el backend ni se obtuvieron datos de cuentas.
- En una sesión de invitado de Duolingo se observaron lecciones accesibles antes del perfil, un camino con unidades, desafíos diarios, selección de respuesta y feedback con Continue enfocado. Se probó una pregunta inicial; no se completó todo su catálogo ni se creó cuenta.
- La documentación primaria describe camino guiado, práctica integrada y guías de unidad: [Duolingo, diseño de la pantalla de inicio](https://blog.duolingo.com/new-duolingo-home-screen-design/).
- Herramienta y metodología: [REA](https://github.com/morluto/rea), [guía del navegador](https://rea.tools/guides/browser/).

Los resultados estáticos y las capturas se guardaron en `.codex/research/rea-five-stages/`, ignorado por Git. No se copiaron personajes, fuentes, sonidos ni componentes propietarios de Duolingo. La implementación usa las piezas existentes de T1GER y figuras originales.

## Verificación local

- Lint y TypeScript de Web aprobados tras corregir un import sin uso del cierre Gold.
- 56 pruebas Web aprobadas; tres contratos que necesitan emuladores se reservan para CI.
- 19 pruebas de waitlist/API aprobadas.
- Navegador: entrada de invitado y entrega al registro con elecciones conservadas; ejemplos de psicología e IA con error y reintento; radios de práctica por teclado; recorrido completo de IA hasta herramienta, reflexión, recuerdo y celebración en preview; dashboard inicial, Apply pendiente y repaso pendiente; guía de etapa y salto con foco al paso actual.
- Tamaños probados: 320×740, 390×844 y 1280×900. No se observó desbordamiento horizontal en las vistas comprobadas. Se revisaron composiciones en claro y oscuro. La inspección de bounds detectó y corrigió transforms antiguos que desplazaban el halo móvil respecto al personaje.
- Ninguna sesión de diseño escribe progreso de producción. No se crearon nuevas cuentas reales ni se aceptaron términos en las pruebas.
- Lint de waitlist y compilación de waitlist aprobados. El cierre de verificación de CSS corrige los selectores de transiciones de la muestra y de las barras de fases.

## Criterios de publicación

Antes de promover a main: compilación de waitlist y Web, checks del SHA publicado y contratos aislados de seguridad, recompensas, persistencia Gold y SQL. Después: despliegue Production del mismo SHA, rutas públicas, protección del worker, SEO/manifest y recorrido de invitado en producción. El historial de GitHub Actions y Vercel permite comprobar los resultados exactos.

## Lo que estas mejoras no demuestran

Esto no certifica equivalencia global con Duolingo, calidad «10/10», resultados educativos de personas reales, retención comercial ni rendimiento en todos los dispositivos físicos. Sigue siendo necesario observar una cohorte de alumnos reales, medir primera idea → registro → primera aplicación → repaso, y revisar abandonos antes de ampliar currículo o marketing. Los avisos y controles de privacidad de analytics se mantienen; los nuevos eventos sólo contienen IDs permitidos y respetan el consentimiento existente.
