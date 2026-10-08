# T1GER — entrada y onboarding

## Alcance

Tanda centrada en bienvenida, elección del tema, ritmo, registro y apertura de la primera lección. No introduce una certificación de «10/10» ni resultados de conversión no medidos.

## Referencias observadas

- El enlace de Mobbin proporcionado redirigió a su acceso público. La colección completa requiere sesión; no se afirma haber revisado todas sus pantallas.
- Se observó directamente una pantalla de onboarding en la web pública de Duolingo: mascota junto a una pregunta, opciones amplias, contenido acotado y una acción principal separada.
- La explicación del equipo de Duolingo sobre su [rediseño de pestañas](https://blog.duolingo.com/core-tabs-redesign/) destaca jerarquía, espaciado, coherencia y propósito. Estos principios orientaron la composición, sin reutilizar sus ilustraciones ni activos.

## Cambios

| Antes | Ahora |
| --- | --- |
| Formulario de cuenta como primera interacción | Bienvenida visual y elección de tema/ritmo antes del registro |
| Número de pasos variable y selección adicional de prioridad | Tres pasos estables; un tema para empezar, con los demás disponibles después |
| Opciones con elementos superpuestos y jerarquía desigual | Radios nativos, ilustración compacta, título, descripción y selección separados |
| Ritmo en columnas estrechas | Filas amplias con barras de intensidad y minutos legibles |
| Explicación textual de la primera lección | Tarjeta con ilustración del tema, duración, objetivo y ciclo Explore/Apply/Recall |
| Estado de onboarding completado compartido entre cuentas de la sesión | Estado vinculado al UID de la cuenta |

- Se conservan Firebase, las llamadas de registro, acceso con Google y recuperación de contraseña.
- Las elecciones viajan también en memoria al registro: la continuidad en la misma página no depende únicamente de localStorage.
- Los borradores guardados se validan y migran. Un borrador vacío o inválido no abre directamente el paso final; un borrador de cuenta tiene prioridad sobre el de invitado.
- El borrador de invitado se elimina después de guardar correctamente el perfil, sin borrar elecciones tras un error.
- La mascota 3D aparece en bienvenida y preparación final; el retrato ligero guía las elecciones.
- Radios accesibles mediante teclado, foco en la pregunta, indicador de progreso con nombre accesible y soporte de movimiento reducido.
- No se escribe un perfil ni se concede XP mientras el visitante elige su tema. La persistencia de cuenta se realiza después de autenticarse y confirmar el inicio de la lección.
- Los avisos legales siguen identificados como borradores mientras faltan datos del operador. La analítica sigue requiriendo consentimiento opcional.

## Comprobaciones

- 44 tests Web aprobados. Las tres pruebas que requieren emulador no cuentan como ejecutadas en este comando; el workflow de publicación las ejecuta con emulador.
- Build y lint locales correctos durante la implementación; el CI vuelve a comprobar la versión del commit publicado.
- Recorrido de invitado: selección, avance, retroceso, edición desde registro y continuidad de tema/minutos.
- Modos claro y oscuro. Inspección a 320 × 568 y 390 × 844, sin desbordamiento horizontal observado.
- Selección del ritmo mediante flecha del teclado.
- En preview, elegir Psicología y empezar abrió `learn-psychology-v1-01`, con la pregunta inicial de Confirmation bias. No se guardó progreso real.
- Las funciones de servidor, correo, pagos y los archivos congelados de Gold permanecen fuera del diff de esta tanda.

## Siguiente evidencia necesaria

La evaluación visual no demuestra un aumento de activación. Medir, con consentimiento, elección de tema → elección de ritmo → registro completado → onboarding guardado → primera lección completada → primer Apply. Comparar abandonos, tiempo por paso y reportes de personas reales en móvil antes de declarar equivalencia de usabilidad con Duolingo.
