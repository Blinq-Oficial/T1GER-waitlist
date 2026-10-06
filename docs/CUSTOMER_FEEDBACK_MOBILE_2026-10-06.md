# Feedback real — correcciones de móvil y acceso

## Qué recibimos

Tres capturas compartidas por el fundador, con observaciones de una persona que usó la aplicación. Son feedback real de usabilidad; no constituyen una prueba controlada de aprendizaje ni retención. No se incluyen sus emails ni datos personales en este informe.

## Correcciones

| Observación | Causa y cambio |
| --- | --- |
| La fila de decisiones en Apply está comprimida | El contenedor usaba flex en una sola línea, aunque la descripción tenía reglas de grid. Ahora el título y estado tienen columnas propias; la regla va debajo, con separación, línea divisoria y ajuste de textos largos. |
| El check de 10 minutos se ve raro | Era un SVG en el flujo del texto. Ahora tiene una insignia circular naranja en la esquina de la tarjeta; el texto y el número mantienen su espacio. La selección sigue anunciándose con `aria-pressed`. |
| Falta espacio en la predicción de la lección | Se ajustaron tamaño y altura del título, separación de etiqueta, input y botón, y escala del gráfico en móvil. El botón deshabilitado tiene un estado neutro legible. |
| El campo de email de la waitlist invade el botón | `flex-1` permitía encoger la altura en un contenedor vertical. El input conserva 60 px y el botón 54 px; se usa flex horizontal solamente desde el breakpoint correspondiente. |
| Formulario superior difícil de tocar | En móvil el botón tiene su propia fila de 44 px; el input mide 48 px y tiene texto de 16 px. Ambos formularios usan teclado de email. |
| Google muestra el dominio Firebase | Se añadió `https://t1ger.app` a los orígenes del cliente web existente y `https://t1ger.app/__/auth/handler` a sus callbacks. La consola confirmó “OAuth client saved”. Se conservaron todos los valores anteriores y el cliente iOS. Vercel sirve los helpers mediante proxy transparente y Web selecciona `t1ger.app` como authDomain solamente en el host y proyecto de producción. |
| Fallo adicional encontrado en tablet | Entre 701 y 900 px la navegación tapaba el composer del mentor: medido a 768 px, composerBottom 960 > navTop 875.55. Se corrigió la altura de navegación y la reserva inferior del chat. Después: composerBottom 872 < navTop 923.55. |
| Campos demasiado pequeños para móvil | Se aumentó el texto a 16 px en los formularios normales de móvil. La API y los datos educativos permanecen iguales. |
| Ventana Google bloqueada | Mensaje específico para permitir ventanas de T1GER o usar email. Google solicita elegir cuenta explícitamente; no se amplían los scopes. |

## Verificación

- Web: 41 tests aprobados; 3 tests de evidencia que requieren emulador quedaron omitidos. No se contabilizan como aprobados.
- Waitlist/API: 10 tests aprobados, usando sustitutos de los servicios externos.
- Lint de Web y waitlist aprobado. Builds de waitlist y Web bajo `/app/` aprobados.
- Comprobaciones de las 13 pantallas principales a 320, 768 y 1280 px: sin desbordamiento horizontal ni controles que salgan del ancho disponible. Se repitió More tras cargar su módulo. Estas medidas no demuestran compatibilidad perfecta con todos los dispositivos.
- Revisión visual específica de Apply, ritmo de onboarding, predicción, formularios de waitlist y mentor de tablet. Email inválido se rechaza en el formulario local sin enviar una solicitud externa.
- Mentor: mediciones adicionales a 390×844, 844×390, 900×600 y 1280×800; el composer está dentro de la pantalla y fuera de la navegación inferior en los cuatro casos.
- Evidencia local ignorada por Git: `.codex/research/customer-feedback-2026-10-06/`.
- La lección Gold V2.1, sus interacciones, evaluación, evidencia, modelo matemático y CSS congelados conservan el contenido de referencia `74f4b48`.
- Los cambios de autenticación no cambian usuarios, contraseñas, reglas de Firestore ni roles. La prueba nueva protege la separación entre configuración de producción y preview/emulador.

## Entrega anterior terminada

`4e9265b`: recuperación del mentor a partir del diseño móvil original, proveedor gratuito real con alternativa acotada, historial privado, mascota 3D selectiva y mejoras visuales. `b2c3565`: acción principal de Apply antes de instrucciones desplegables e ilustración de la regla guardada. Ambos commits están en main y tuvieron despliegues Production exitosos; `b2c3565` corresponde al despliegue 6873223088.

## Límites y trabajo pendiente

- El mentor depende de capacidad gratuita del proveedor y conserva límites de uso. No se presenta como servicio ilimitado.
- Probar el selector de Google no equivale a completar un alta con una persona real; no se crean cuentas personales durante la auditoría. Google advierte que un cambio de callback puede tardar en propagarse.
- Falta ejecutar pruebas con Safari/iOS y Android físicos, incluido teclado virtual. Los tamaños simulados detectan composición y desbordamientos, no todos los comportamientos del sistema operativo.
- PostHog permanece preparado pero inactivo hasta disponer del identificador público y región del proyecto.
- Los avisos legales siguen como borradores hasta confirmar operador legal y dirección postal completa.
- Este feedback no reemplaza las sesiones y mediciones de validación humana del engine educativo.

## Referencias técnicas

Implementación de dominio y proxy basada en [Firebase: proxy de helpers de autenticación, opción 3](https://firebase.google.com/docs/auth/web/redirect-best-practices#option_3_proxy_auth_requests_to_firebaseappcom) y [personalización del dominio de Google sign-in](https://firebase.google.com/docs/auth/web/google-signin#customizing-the-redirect-domain-for-google-sign-in).
