# Starter · NTT Neural Web Presentation

Starter de presentación HTML inmersiva basado en Vite, Three.js y GSAP.

## Ejecutar

Requiere Node.js 22.12 o posterior.

```bash
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

El `brand-lockup` se encuentra fuera de los contenedores de portada, slides y canvas; por ello permanece fijo abajo a la derecha durante todas las transiciones. No animes ni recrees el logotipo. El fallback textual es solo para desarrollo.

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

Después realiza QA visual en los viewports y navegadores indicados en `../../references/qa-and-acceptance.md`. La validación estructural no sustituye la inspección visual del movimiento, el contraste ni el encuadre de cámara.
