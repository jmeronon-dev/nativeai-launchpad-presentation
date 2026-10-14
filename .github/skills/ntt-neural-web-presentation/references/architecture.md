# Architecture

## Layer model

Use five independent layers:

1. **Persistent scene layer** — one full-viewport WebGL canvas.
2. **Ambient interaction layer** — opening keywords and optional pointer glow.
3. **Content layer** — semantic slide sections.
4. **Presentation chrome** — navigation, progress, status, fullscreen.
5. **Brand layer** — fixed NTT DATA logo with the highest stable z-index below modals.

Do not place the logo or controls inside a transformed camera/slide root.

## Recommended modules

```text
src/
  main.js                 bootstrap and lifecycle
  content.js              presentation data
  neural-scene.js         Three.js scene, graph, pulses, camera rig
  deck-controller.js      finite-state navigation and URL state
  keyword-field.js        spring/repulsion interaction
  ui.js                   semantic slide rendering and chrome
  styles.css              tokens, layouts, accessibility, print
```

## Presentation state machine

Recommended states:

- `OVERVIEW_IDLE`
- `LEAVING_OVERVIEW`
- `SLIDE_ACTIVE`
- `LEAVING_NODE`
- `AT_WAYPOINT`
- `ENTERING_NODE`
- `FALLBACK_STATIC`

Events:

- `NEXT`
- `PREVIOUS`
- `GO_TO(index)`
- `GO_OVERVIEW`
- `TRANSITION_COMPLETE`
- `REDUCED_MOTION_CHANGED`
- `WEBGL_FAILED`
- `RESIZE`

Maintain one transition lock and one optional queued destination. Never allow two camera timelines to mutate the same camera simultaneously.

## Data model

```js
{
  meta: {
    title: "...",
    subtitle: "...",
    language: "es",
    theme: "ntt-neural"
  },
  overviewCamera: {
    position: [0, 0, 10],
    target: [0, 0, 0],
    fov: 48
  },
  keywords: ["AI", "Automation", "Value"],
  nodes: [
    {
      id: "node-vision",
      position: [-2.4, 1.2, 0.4],
      cameraOffset: [0.5, 0.2, 2.1],
      lookAtOffset: [0, 0, 0],
      fov: 39
    }
  ],
  slides: [
    {
      id: "vision",
      nodeId: "node-vision",
      order: 1,
      layout: "statement",
      title: "A clear takeaway",
      lead: "Supporting idea",
      notes: "Optional speaker note"
    }
  ]
}
```

## Graph construction

- Place destination nodes first using authored coordinates.
- Add ambient nodes with a deterministic seeded generator.
- Connect each node to a small number of nearest neighbours.
- Ensure the graph is connected; add bridge edges between components if needed.
- Keep destination nodes visually identifiable through scale, halo, or local density.
- Precompute edge endpoints and pulse routes.

## Camera rig

Use a perspective camera plus an independently animated target vector.

For a destination node at `P`:

```text
cameraPosition = P + authoredCameraOffset
cameraTarget   = P + authoredLookAtOffset
```

Animate position, target, and FOV in one GSAP timeline. Call `camera.lookAt(target)` on each update. Do not animate Euler rotation and `lookAt` concurrently.

## Transition transaction

Pseudo-flow:

```js
async function navigate(targetIndex) {
  if (transitioning) {
    queuedIndex = targetIndex;
    return;
  }

  transitioning = true;
  await ui.exitCurrent();

  if (currentIndex < 0) {
    await scene.overviewToNode(targetNode);
  } else {
    await scene.nodeToOverview(currentNode);
    await scene.overviewToNode(targetNode);
  }

  currentIndex = targetIndex;
  await ui.enterSlide(targetIndex);
  syncHashAndProgress();
  transitioning = false;

  if (queuedIndex !== null && queuedIndex !== currentIndex) {
    const next = queuedIndex;
    queuedIndex = null;
    navigate(next);
  }
}
```

A single combined timeline may replace the two awaited calls, provided it exposes phase callbacks and remains interrupt-safe.

## Optional reveal.js hybrid

Use only when required by an existing deck or speaker-view requirement:

- mount Three.js outside `.reveal` so Reveal transforms never affect the canvas;
- use Reveal events only as intent signals;
- delay content activation until camera arrival;
- prevent Reveal's transition from competing with GSAP;
- keep a custom reduced-motion path;
- test overview, speaker, print, and scroll modes separately.
