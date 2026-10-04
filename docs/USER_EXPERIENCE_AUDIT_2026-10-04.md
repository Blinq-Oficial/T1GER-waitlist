# T1GER: revisión de la experiencia de uso
Fecha: 4 de octubre de 2026

## Método y alcance

Recorridos manuales en navegador: onboarding con una y varias rutas, inicio, primera lección, vista previa de lecciones bloqueadas, Apply pendiente, repaso, Discover, colección, herramientas y mentor. Se revisaron móvil de 390 × 844 y escritorio de 1280 × 800, modo claro y oscuro. Los estados de aprendizaje utilizados fueron fixtures locales de desarrollo; no se crearon cuentas ni se escribieron resultados sintéticos en producción.

La comparación usa pantallas y explicaciones oficiales de los productos. Es una evaluación heurística, con **cero participantes humanos**. No demuestra que T1GER tenga la misma calidad global, retención o eficacia educativa que Duolingo.

## Qué podría gustar y qué podría frustrar

Estas preferencias son hipótesis para validar; no son testimonios de usuarios.

- Valor que conviene hacer visible: aprender una idea, usarla en una decisión y conservar el trabajo como herramienta; tres rutas prácticas; repaso programado; mentor accesible cuando una explicación no basta.
- Fortalezas visuales: mascota propia, respuesta animada a los momentos de aprendizaje, consistencia entre modo claro y oscuro.
- Fricciones observadas: el titular y la mascota desplazaban la acción principal; había pantallas introductorias antes de elegir qué aprender; los bloqueos no explicaban su contenido; algunos estados vacíos no ofrecían un siguiente paso; las herramientas útiles quedaban escondidas.
- Riesgo de confianza: una presentación atractiva no basta para sostener la promesa educativa. Es necesario observar comprensión, transferencia y recuerdo con personas reales.

## Comparación y cambios implementados

Duolingo explica un recorrido guiado con contenido consultable en cada nodo y posibilidad de volver a las lecciones completadas. [Referencia oficial del recorrido](https://blog.duolingo.com/new-duolingo-home-screen-design/).

| Área | Problema observado | Mejora publicada en este cambio |
| --- | --- | --- |
| Inicio | Mucho espacio antes de actuar | Una siguiente acción según el estado real: aprender, retomar, repasar o explorar otra ruta |
| Recorrido | Nodos bloqueados sin suficiente contexto | Vista previa con objetivo, requisitos y acción correspondiente; no permite saltarse prerrequisitos |
| Onboarding | Cinco o seis pantallas | Tres pasos para una ruta; cuatro cuando hace falta elegir una ruta principal |
| Valor práctico | Trabajo guardado poco visible | Acceso directo a herramientas y contador basado en trabajos reales del perfil |
| Estados vacíos | Orientación insuficiente | Primer paso explícito en Apply y colección; limpiar búsqueda sin resultados |
| Discover | La ruta actual tenía un botón desactivado | Continuar la ruta sin realizar una escritura redundante |
| Mentor | Era posible escoger otra pregunta durante una respuesta y perder el nuevo borrador | Sugerencias e idioma desactivados mientras responde; interfaz inicial más compacta en móvil |
| Herramientas | Tarjetas demasiado altas y texto estrecho en móvil | Jerarquía compacta y tarjetas de dos columnas con texto legible |
| Navegación | Foco poco claro tras cambiar de pantalla | Enlace para saltar al contenido, foco en el contenido y compatibilidad con abrir enlaces en otra pestaña |

El Practice Hub de Duolingo reúne práctica enfocada y su acceso gratuito se amplió en febrero de 2026. T1GER tiene repaso y aplicación, pero esta revisión no añade práctica equivalente para todas las habilidades. [Guía oficial de Practice Hub](https://blog.duolingo.com/guide-to-duolingo-practice-hub/).

Brilliant presenta problemas interactivos, explicaciones visuales y rutas guiadas. Esto refuerza el objetivo de mostrar utilidad dentro de la actividad. T1GER ya tiene interacciones y trabajos guardables; no se cambiaron sus evaluaciones en este sprint. [Cómo empezar en Brilliant](https://brilliant.org/help/using-brilliant/how-do-i-get-started-on-brilliant/), [rutas de aprendizaje](https://brilliant.org/help/features/what-are-learning-paths/).

## Comprobaciones

- Inicio móvil: acción principal visible sin desplazarse; mentor y colección inmediatamente debajo.
- Mentor móvil: pregunta, idioma y envío accesibles; información de privacidad sigue disponible.
- Onboarding: tres pasos con una ruta y cuatro con varias; borrador conservado al recargar; primera lección corresponde a la ruta elegida.
- Lección bloqueada: permite consultar el objetivo, sin botón para empezarla; Escape cierra el diálogo y devuelve el foco al nodo.
- Repaso pendiente: conduce a Master; recorrido manual de revelar y valorar una respuesta.
- Discover: Continue path devuelve a Learn.
- Colección vacía: la búsqueda sin resultados puede limpiarse y recuperar su estado inicial.
- Sin desbordamiento horizontal observado en el inicio de escritorio y el mentor móvil.
- Suite automática: 36 pruebas pasan; 3 pruebas del emulador omitidas por requerir ese entorno. Las tres pruebas de acciones del recorrido pasan también después del ajuste final.
- Lint y compilación de Web pasan. El compilador sigue avisando de chunks grandes de Firebase y la mascota 3D; no se ha medido una mejora de rendimiento de carga.

## Límites importantes

Gold V2.1, su evaluación y los servicios de aprendizaje siguen congelados conforme al sprint de validación acordado. No se alteró su contenido ni se inventó evidencia de aprendizaje.

Para una aplicación pendiente de Gold, el botón dice **Resume lesson**. Una sesión con un checkpoint válido restaura su paso guardado. Si el trabajo procede de un estado antiguo sin ese checkpoint, el recorrido existente empieza antes; esta revisión no migra esos estados ni salta actividades evaluadas.

Aún faltan pruebas con 5–8 personas reales para evaluar claridad, esfuerzo, transferencia y recuerdo. La amplitud actual del currículo, la localización completa de la interfaz y la capacidad del mentor gratuito también limitan una comparación global con un producto maduro. No se asigna un “10/10” sin evidencia.

## Publicación

Cambios destinados al repositorio T1GER-waitlist y al despliegue de producción que sirve [T1GER Web](https://t1ger.app/app/learn). El modo preview usado para revisar el diseño solo se habilita en desarrollo; el sitio público conserva autenticación y protección de progreso.
