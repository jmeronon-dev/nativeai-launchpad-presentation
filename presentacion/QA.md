# QA · AI Native Launchpad

Revisión de la versión de 25 minutos el 14 de octubre de 2026. Ocho diapositivas más portada, walkthrough de 20 paradas en slide 7 y cierre de agradecimiento en slide 8. No se declara lista para producción corporativa hasta completar aprobaciones y pruebas pendientes.

## Guion y build

- `npm run sync-notes`: 9 bloques numerados importados desde `CONTENIDO-PRESENTACION.md`.
- `npm run validate`: **0 errores y 0 advertencias**. Ocho diapositivas, ocho nodos únicos y orden explícito.
- `npm run build`: correcto con Vite 8.3.2. Salida estática en `dist/`.
- `dist/launchpad-demo/`: 66 MB y 355 archivos; incluye el HTML y todos los fotogramas referenciados.
- Vite avisa de un bundle JS mayor de 500 kB: 717,39 kB minificado, 194,34 kB gzip. No es un error del build; no se midió la carga sobre redes lentas.
- Consola de Chromium: **0 errores y 0 advertencias**. Editor sin errores en los archivos JS revisados.

## Navegador y dispositivos

Chromium mediante Playwright. Revisadas la portada y las diapositivas de ponente, AI Native, conceptos, harness, walkthrough de slide 7 y cierre de slide 8.

- 1366×768: principios y roles de AI Native completos; conceptos, harness de cinco capas y cierre sin scroll interno. [AI Native](qa/replanteamiento-ai-native-25-desktop.png) · [Conceptos](qa/replanteamiento-conceptos-1366.png) · [Harness](qa/replanteamiento-harness-25-1366.png) · [Cierre](qa/replanteamiento-cierre-1366.png) · [Biografía](qa/replanteamiento-biografia-25-1366.png)
- 390×844: principios y roles en dos columnas, sin desbordamiento horizontal; la demo mantiene scroll vertical interno y cinco pasos. [AI Native móvil](qa/replanteamiento-ai-native-25-390.png) · [Demo móvil](qa/replanteamiento-demo-390.png)
- Slide 7 muestra solo la captura 16:10 y puntos centrados de navegación; header, footer, títulos y botones internos ocultos. Capturas: [1366](qa/replanteamiento-slide7-demo-clean-1366.png) · [390](qa/replanteamiento-slide7-demo-clean-390.png)
- 1920×1080: harness completo sin scroll horizontal o vertical; marca dentro del viewport.
- 412×915: AI Native con dos columnas, sin desbordamiento horizontal; marca dentro del viewport.
- Portada 1366×768: conceptos de 24,6 px en nueve tintes azules, con movimiento autónomo y sin colisiones en la captura. El campo queda en `z-index: 2`, detrás del texto en `z-index: 3`. [Captura](qa/replanteamiento-keywords-ntt-logo-1366.png)
- Portada 768×1024: nueve conceptos en tintes azules, redistribuidos sin colisiones; logo oficial visible abajo a la derecha. [Captura](qa/replanteamiento-keywords-ntt-logo-768.png)
- Portada 390×844: nueve conceptos de 16 px en tres filas, en tintes de azul y sin bullets, colisiones ni desbordamiento horizontal. Logo NTT DATA visible abajo a la derecha. [Captura](qa/replanteamiento-keywords-ntt-logo-390.png)
- La imagen de retrato carga con radio de 18 px y recorte en su contenedor.
- “Keep it simple” aparece como cita destacada de 52 px; la slide de biografía cabe sin scroll en 1366×768. [Captura](qa/replanteamiento-biografia-25-1366.png)
- Muestreo de capturas finales: 63.636 píxeles azulados en escritorio y 19.387 en móvil, coherentes con una red visible en el canvas.

## Comportamiento

- La ruta `#harness` y el nodo activo quedan sincronizados.
- La portada abre las notas del bloque 0; las notas se sincronizan desde los nueve bloques numerados.
- Demo: el control avanza de `01 / 05` a `02 / 05` y activa el paso correspondiente sin salir de la diapositiva.
- Walkthrough de slide 7: los puntos saltan entre las 20 paradas y la flecha derecha reproduce la transición al siguiente paso; las capturas cargan localmente.
- Slide 8: cierre “Gracias”, mensaje de validación humana y pregunta final; encuadre completo en escritorio y móvil.
- Los títulos ya no muestran contorno de foco; los botones mantienen un indicador accesible.
- Reveal escalonado de tarjetas, iconos Lucide y animación de red. En `prefers-reduced-motion`, navegación sin viaje y elementos visibles; comprobado en Chromium.
- La foto tiene esquinas redondeadas y carga desde el recurso local.
- Los conceptos recorren libremente la pantalla con velocidades distintas y rebote en bordes. Se atenúan al cruzar el copy y recuperan su color en zonas libres; con `prefers-reduced-motion` permanecen estables.

## Pendientes y límites

- Safari macOS/iOS, Android físico, lector de pantalla y proyección real: no comprobados.
- Fallback WebGL, impresión, pantalla completa y navegación completa por teclado no se revalidaron en esta revisión.
- FPS sostenidos, rendimiento en equipos modestos y contraste con auditor automático: no medidos.
- El logo oficial en SVG se sirve localmente sin modificaciones; confirmar la aprobación interna de marca si el evento requiere validación del brand owner. Confirmar aprobación del retrato.
- No se proporcionó URL de WebConfig en vivo. La demo integrada reproduce capturas locales; no ejecuta acciones ni modifica el producto. Feature Delivery produjo una propuesta textual y no implementó Checkout ni ejecutó tests.
- Las afirmaciones del producto proceden del guion; los documentos de referencia citados allí no están presentes en este workspace.