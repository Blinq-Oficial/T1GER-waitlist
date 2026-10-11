# T1GER — Cambios y verificación móvil/SEO

11 de octubre de 2026. Alcance: sitio público, acceso web, onboarding, navegación y pantallas principales de la app; guías públicas y plan de marketing EN/ES.

## Cambios

1. Eliminado el ancho mínimo de 320 px del body de la app, que producía desbordamiento cuando el navegador reservaba espacio para una barra de scroll.
2. Cabecera móvil compacta: XP en una línea, perfil visible, controles de tema y estadísticas con área táctil mayor.
3. Safe areas de pantalla para cabecera, navegación inferior, onboarding y lecciones; viewport-fit=cover en ambos HTML.
4. Campos de registro, ajustes y mentor de 16 px, para evitar el zoom automático habitual de iPhone en campos pequeños.
5. Deslizadores con área de interacción de al menos 44 px. Footer y menú móvil del sitio con objetivos táctiles mayores y menú desplazable en pantallas bajas.
6. Diálogos limitados a la altura disponible y desplazables; contenido y textos largos con anchura flexible.
7. Mentor dimensionado con VisualViewport: considera teclado, escala de zoom y navegación. Enter móvil añade una línea; enviar sigue disponible con botón o Ctrl/Cmd+Enter. Composición de texto respetada.
8. En dispositivos táctiles se evita el coste de filtros de desenfoque en las barras de la app y los efectos de hover que se quedan activos.
9. Pantallas compactas: bienvenida más breve y acción de la próxima lección antes de la mascota en el orden visual del dashboard.
10. Se conserva la mascota 3D. La animación en reposo se limita aproximadamente a 30 renderizados por segundo en móvil; las reacciones activas conservan su frecuencia. Las pausas al quedar fuera de pantalla o en segundo plano ya existían.
11. Manifest, iconos y nombre para abrir la web desde la pantalla de inicio. No se ha añadido modo offline ni se ha publicado una app nativa.
12. Seis guías originales EN/ES y tres páginas de índice, generadas en HTML estático; ejemplos visuales, práctica sin JS, fuentes, canonicals, hreflang, metadatos sociales y datos estructurados.
13. Sitemap de contenido público y noindex de la app. Enlace a las guías desde la portada; métricas agregadas de las guías sin parámetros de URL. PostHog continúa sujeto a configuración y elecciones existentes.
14. Plan de distribución bilingüe de 30 días con calendario, guiones, SEO, embudo, experimentos y tareas del fundador.

## Pruebas de interfaz realizadas

Navegador Chromium del entorno de trabajo, tamaños simulados. Las comprobaciones de desbordamiento comparan `documentElement.scrollWidth` con `clientWidth`, no solo con `innerWidth`.

| Tamaño | Recorridos comprobados | Resultado |
|---|---|---|
| 320 × 568 | Sitio público, menú, bienvenida, tres pasos del onboarding, formulario de registro, Learn, Discover, Apply, Master, More, cuenta, ajustes, mentor, comunidad, compañero, Focus, colección y progreso | Sin desbordamiento horizontal en los estados inspeccionados |
| 320 × 568 | Diálogo de lección bloqueada y modelo de Gold Lesson | Diálogo dentro de pantalla, salida y controles accesibles con scroll |
| 390 × 844 | Introducción, primera elección y modelo de Gold Lesson; lectura de guía ES | Flujo legible y sin desbordamiento horizontal |
| 430 × 932 | Dashboard y modo claro | Sin desbordamiento horizontal |
| 844 × 390 | Mentor en horizontal | Campo de escritura dentro de la región disponible |
| 1280 × 800 | Dashboard de escritorio | Sin desbordamiento horizontal |

Enter móvil se probó escribiendo una pregunta y verificando que conserva el borrador con un salto de línea. El HTML de una guía se inspeccionó con sus enlaces alternativos; la explicación de práctica se abre sin llamadas al backend.

Las pantallas privadas se probaron en **preview local**. No se creó una cuenta de producción, no se aceptaron nuevos términos, no se envió una pregunta real al proveedor de IA, no se enviaron correos y no se modificó progreso de una cuenta real.

## Verificación técnica

- Lint del sitio y TypeScript/ESLint de Web.
- 19 pruebas del sitio, incluidas guías bilingües y protección de indexación.
- 50 pruebas de Web. Tres contratos con emulador se ejecutan en CI; no se declaran ejecutados localmente en esta tanda.
- Regresiones nuevas: geometría del teclado sin confundir pinch zoom, Enter móvil y composición; ahorro de renderizados en reposo manteniendo reacciones activas; canonicals/alternativas recíprocas/contenido estático; rutas noindex.
- Compilación de ambos frontends. Se mantienen avisos de bundles grandes de Three/Firebase/curriculum; no hay una medición de Core Web Vitals que permita declarar solucionado todo el rendimiento.
- La publicación exige CI del commit y despliegue Production verificados; resultados finales se comunican con el commit.

## Lo que falta verificar con dispositivos/personas

- Teclado real de Safari iOS y Chrome Android, barras del sistema, rotación durante escritura y apertura desde pantalla de inicio.
- GPU/WebGL y rendimiento bajo red lenta, batería baja y dispositivos antiguos. El fallback estático de mascota se conserva.
- Lectores de pantalla de iOS/Android y texto ampliado por el sistema.
- Registro completo con una cuenta de prueba autorizada y una sesión de mentor real; este sprint no cambia sus contratos ni credenciales.
- Activación, comprensión y utilidad con participantes reales en ambos idiomas.
- Search Console y clave pública de PostHog: requieren elegir las cuentas del propietario. El plan describe los pasos.
- Traducción completa de la interfaz de la app a español, pendiente. Las guías públicas son bilingües y el mentor permite seleccionar idioma.

Esto es una mejora comprobable del producto móvil y su base SEO; no constituye certificación de funcionamiento perfecto en todos los teléfonos ni garantía de ranking o ventas.
