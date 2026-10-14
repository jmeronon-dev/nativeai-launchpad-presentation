# AI Native Launchpad · Presentación

Ocho diapositivas más una portada, con notas sincronizadas desde [CONTENIDO-PRESENTACION.md](../CONTENIDO-PRESENTACION.md), red neuronal persistente, recursos locales y una demo guiada de 20 paradas en slide 7. Duración prevista: 25 minutos. Base: Vite, Three.js, GSAP y Lucide.

## Ejecutar

Requiere Node.js 22.12 o posterior.

```bash
cd presentacion
npm install
npm run dev
```

Para generar la entrega estática:

```bash
npm run validate
npm run build
npm run preview
```

El resultado de producción se genera en `dist/`.

## Personalizar contenido y mapa neuronal

Edita `src/content.js`. La presentación usa una única fuente de verdad:

- `meta`: título, eyebrow, subtítulo e idioma;
- `keywords`: conceptos interactivos de portada;
- `overviewCamera`: encuadre general de la red;
- `nodes`: neuronas destino y cámara local;
- `slides`: contenido, orden y relación mediante `nodeId`.

Cada slide debe tener un `nodeId` único y cada `nodeId` debe existir en `nodes`. El campo `order` gobierna la navegación: el runtime ordena las slides antes de renderizarlas.

Las notas se importan de los nueve bloques numerados en [CONTENIDO-PRESENTACION.md](../CONTENIDO-PRESENTACION.md) mediante `npm run sync-notes`. El parser Markdown genera [src/notes.json](src/notes.json); no editar ese archivo a mano. La sincronización se ejecuta antes de `dev` y `build`. La portada usa las notas del bloque 0 y las ocho diapositivas condensan los bloques 1–8 en [src/content.js](src/content.js).

Ejemplo mínimo:

```js
{
  id: 'strategy',
  nodeId: 'node-strategy',
  order: 1,
  layout: 'statement',
  kicker: 'La estrategia',
  title: 'Una conclusión clara por slide',
  lead: 'Texto de apoyo breve.',
  body: ['Idea 1', 'Idea 2', 'Idea 3'],
}
```

## Ajustar la cámara

Cada neurona admite:

```js
{
  id: 'node-strategy',
  position: [-2.2, 1.1, 0.2],
  cameraOffset: [0.1, 0.05, 2.2],
  lookAtOffset: [0, 0, 0],
  fov: 38,
  weight: 1.2,
}
```

- `position`: posición de la neurona en el mundo 3D.
- `cameraOffset`: distancia y ángulo de llegada respecto a la neurona.
- `lookAtOffset`: punto local al que mira la cámara.
- `fov`: campo de visión del encuadre.
- `weight`: énfasis visual del nodo.

No cambies estos valores de forma aislada: revisa siempre que el texto conserve contraste y que la neurona no invada el área principal de lectura.

## Logo NTT DATA

Añade el recurso corporativo aprobado en:

```text
public/brand/ntt-data-logo.svg
```

El `brand-lockup` se encuentra fuera de los contenedores de portada, slides y canvas; por ello permanece fijo abajo a la derecha durante todas las transiciones. No animes, deformes ni recolorees el logotipo.

El logo SVG local se obtiene del encabezado del sitio oficial de NTT DATA; [public/brand/README.md](public/brand/README.md) registra la procedencia. `presentation.meta.logo` ya lo activa. Se conserva el fallback textual si el asset no carga.

## Interacciones incluidas

- ratón/puntero que repele los conceptos flotantes;
- energía animada por las conexiones de la red;
- portada → zoom a la primera neurona;
- slide → zoom-out → vista global → zoom-in a la siguiente neurona;
- botones, teclado, progreso y deep links por hash;
- cola de navegación para entradas rápidas;
- foco y anuncios accesibles al cambiar de slide;
- `prefers-reduced-motion`;
- fallback visual cuando WebGL no está disponible;
- estilos de impresión.
- slide 7 muestra solo la captura del recorrido y puntos centrados de progreso/navegación; las flechas del teclado avanzan las transiciones. Slide 8 cierra la sesión con agradecimiento y abre preguntas.

Teclado: flechas izquierda/derecha, Espacio, PageUp/PageDown; Home vuelve a la vista general y End llega al cierre. Los iconos superiores abren portada, notas y pantalla completa. El contador inferior abre el índice completo. Escape cierra los diálogos y devuelve el foco. Los controles de la diapositiva de demo seleccionan el paso sin cambiar de diapositiva.

Las notas se abren en la misma pantalla: son para ensayo o consulta, no una vista de ponente privada. Los contenidos largos en móvil se desplazan dentro de la diapositiva. Se admite navegación mediante botones táctiles; no se requiere un gesto de swipe.

## Archivos de implementación

| Archivo | Responsabilidad |
| --- | --- |
| `src/content.js` | Configuración de la presentación |
| `src/neural-scene.js` | Escena, grafo, pulsos y cámara |
| `src/deck-controller.js` | Máquina de navegación y URL |
| `src/keyword-field.js` | Física de conceptos flotantes |
| `src/ui.js` | Render HTML, accesibilidad y controles |
| `src/styles.css` | Dirección visual, responsive, fallback e impresión |
| `src/main.js` | Bootstrap y ciclo de vida |

## Validación previa a entrega

```bash
npm run validate
npm run build
```

Evidencia y límites de verificación: [QA.md](QA.md). La validación estructural no sustituye la inspección visual del movimiento, el contraste ni el encuadre de cámara.

## Recursos y dependencias

- Three.js y GSAP: escena y cámara; Lucide: iconos; Marked: parsing del guion. Vite: desarrollo y build. Versiones fijadas por [package-lock.json](package-lock.json).
- El build empaqueta las dependencias. No usa CDN, fuentes descargables ni media remota; puede servirse en una red sin acceso a Internet.
- PNG del Launchpad y retrato copiados de [recursos](../recursos/). Se conserva el retrato suministrado, sin generar una identidad alternativa. Confirmar su aprobación antes del evento.
- `public/launchpad-demo/` contiene la demo HTML autocontenida y sus capturas locales (aprox. 53 MB). Conserva las 20 paradas del recorrido original; [su README](public/launchpad-demo/README.md) documenta origen y alcance.
- `dist/` es la entrega estática. Servir su contenido por HTTP, no abrir el HTML mediante `file://`. El código fuente de build necesita `CONTENIDO-PRESENTACION.md` en la raíz del repositorio para sincronizar las notas.

## Pendientes de presentación

No se proporcionó URL de WebConfig para conexión en vivo. La demo de slide 7 reproduce capturas reales locales y permite recorrerlas; no ejecuta acciones ni modifica Launchpad. Las afirmaciones de producto proceden del guion y deben verificarse contra la versión que se enseñe; sus documentos de referencia no están presentes en este workspace.

Los tiempos asignados suman 25 minutos: 1 minuto de apertura y 24 minutos para las ocho diapositivas. La demo dispone de 4 minutos; ensayar las transiciones dentro del total.
