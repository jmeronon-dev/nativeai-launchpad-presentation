---
name: ntt-neural-web-presentation
description: Design, build, revise, and quality-assure immersive NTT DATA HTML presentations where a persistent animated neural network acts as the navigation space, floating concepts react to the pointer, and slide changes travel between neural nodes with cinematic zoom-out/zoom-in camera transitions. Use for interactive web decks, executive technology presentations, neural/AI visual narratives, or any request that mentions HTML slides with node-based navigation, Three.js, GSAP, NTT DATA branding, or a fixed corporate logo.
---

# NTT Neural Web Presentation

Create production-grade HTML presentations that behave as one continuous digital space rather than a stack of disconnected slides.

The signature experience is mandatory unless the user explicitly changes it:

- The opening view contains a title, a concise supporting line, and floating key concepts.
- Key concepts have spring-based motion and are repelled by mouse or pointer movement.
- A large animated neural network occupies the main visual field and continuously transmits energy between connected neurons.
- The first navigation action moves the virtual camera from the overview into the neuron assigned to slide 1.
- Every later navigation action first leaves the current neuron, returns through a readable network overview or waypoint, then travels into the next neuron.
- The NTT DATA logo remains fixed at the bottom-right in every state, including the opening, transitions, content slides, fullscreen, and reduced-motion mode.
- The presentation remains fully usable without WebGL, without motion, with keyboard-only input, and on touch screens.

## Read before building

Read these files as needed instead of loading every detail at once:

- `references/product-brief.md` for the exact experience contract.
- `references/architecture.md` before choosing files, libraries, state management, or scene structure.
- `references/brand-and-art-direction.md` before creating tokens, typography, logo treatment, or slide composition.
- `references/motion-system.md` before implementing camera travel, energy pulses, pointer repulsion, or transitions.
- `references/content-model.md` before defining slide data or mapping content to nodes.
- `references/accessibility-performance.md` before declaring the deck complete.
- `references/qa-and-acceptance.md` before final delivery.
- `references/research-basis.md` when a design or technology choice needs justification.

Use `assets/starter/` as the preferred implementation base for a new deck. Preserve an existing user codebase when one is supplied; do not replace its stack only to match the starter.

## Default technical direction

Use the following architecture unless repository constraints justify a different choice:

- **Three.js** for the persistent neural scene, node geometry, connections, energy pulses, depth, and camera.
- **GSAP timelines** for deterministic camera choreography, content enter/exit, transition locking, and reversible motion.
- **Semantic HTML/CSS** for all readable content, controls, logo, tables, charts, and accessibility. Never render essential text into WebGL.
- **A small finite-state presentation controller** for overview, travel, active-slide, fallback, and transition states.
- **Vite with JavaScript modules** for development and a static production build.

Do not force reveal.js into the default solution. A custom persistent-world controller fits this experience better. Add reveal.js only when the user explicitly needs its speaker view, plugin ecosystem, or existing reveal.js compatibility, and then keep the Three.js scene persistent outside the slide transform hierarchy.

## Workflow

### 1. Establish the presentation contract

Extract or infer:

- audience and desired decision or outcome;
- presentation title, subtitle, language, and duration;
- number and purpose of slides;
- key concepts for the opening field;
- available content, data, images, charts, and citations;
- delivery devices, minimum viewport, browser requirements, offline/network policy, and hosting target;
- whether speaker notes, print/PDF, deep links, or touch navigation are required;
- the approved NTT DATA logo asset and any local brand guide.

Do not block on non-critical omissions. Make explicit assumptions, use editable placeholders, and continue. Never invent factual claims or brand assets.

### 2. Choose one narrative spine

Create a short presentation map before coding. Pick one governing structure, such as:

- problem → opportunity → solution → evidence → action;
- current state → target state → bridge;
- signal → interpretation → decision;
- capability journey through connected domains.

Give every slide one primary takeaway. Map each takeaway to one destination neuron. The neural map must reflect the story rather than distribute slides randomly.

### 3. Define the visual and motion contracts

Before implementation, write a compact design note containing:

- the one memorable visual idea;
- brand tokens and their roles;
- type scale and text-density limits;
- network character: sparse/dense, organic/geometric, calm/energetic;
- overview camera and node camera rules;
- transition phases and timing;
- reduced-motion equivalent;
- mobile simplifications.

The neural network is the visual hero. Keep slide surfaces calm, precise, and editorial so they do not compete with it.

### 4. Scaffold from data, not hard-coded navigation

Represent slides, node coordinates, camera targets, keywords, and optional energy routes in one source of truth. Use stable IDs and validate them.

Required relationships:

- every substantive slide has exactly one `nodeId`;
- every destination node maps to exactly one slide unless explicitly shared;
- slide and node IDs are unique and URL-safe;
- navigation order is explicit rather than dependent on DOM order;
- camera configuration has a safe default when a slide omits overrides.

Use the schema in `assets/presentation.schema.json` as the baseline.

### 5. Build the persistent neural world

The scene exists for the full session. Do not recreate it per slide.

Minimum scene behavior:

- responsive perspective camera and camera target rig;
- deterministic node layout with clearly identified destination neurons;
- connected graph that reads at overview scale;
- restrained depth fog or atmospheric falloff;
- continuous energy pulses travelling along edges;
- a focus halo or equivalent non-color cue for the active destination;
- adaptive renderer pixel ratio;
- pause/resume on document visibility changes;
- complete disposal of geometries, materials, textures, listeners, and animation frames.

Prefer instancing, points, and line buffers over hundreds of independent meshes.

### 6. Build the reactive opening concepts

Implement opening keywords as HTML elements above the canvas, not as canvas text.

Use a lightweight spring-and-repulsion model:

- each word has a home position, current position, velocity, spring force, damping, and pointer repulsion;
- the pointer pushes words away within a bounded radius;
- words naturally settle back without jitter;
- bounds prevent clipping;
- touch input may create a short-lived repulsion point;
- reduced-motion mode shows a stable, readable arrangement;
- the semantic equivalent of the concepts remains available to assistive technology.

Do not let the interaction obscure the title, logo, or navigation.

### 7. Implement camera-led navigation

Treat navigation as an atomic transaction. During a transition, either ignore repeated commands or queue only the latest valid target.

For overview → first slide:

1. de-emphasize the opening copy;
2. illuminate the destination route or node;
3. move directly toward the target neuron;
4. settle camera position, target, and field of view;
5. reveal the content only after the destination is visually established.

For slide → next/previous slide:

1. hide or quiet the current content;
2. pull back from the current neuron;
3. pass through the overview or a deliberate network waypoint;
4. highlight the next destination;
5. dive into the target neuron;
6. settle the camera;
7. reveal the new content and announce the slide change.

Never cross-fade between unrelated camera poses while pretending it is travel. The audience must understand that it moved through one connected neural system.

### 8. Author content as semantic overlays

All slide content sits in an HTML layer above the persistent scene. Use a small set of purposeful patterns, for example:

- decisive statement;
- split narrative and evidence;
- process/path;
- comparison;
- data insight;
- case study;
- closing action.

Keep a strong hierarchy and one focal point. Use charts only when they carry evidence. Keep dense tables out of the main path unless the audience genuinely needs them.

Avoid generic AI design defaults: decorative gradients with no role, repeated rounded cards, excessive glass effects, random glowing borders, all-caps labels everywhere, and motion on every element.

### 9. Add presentation controls and state

At minimum support:

- next/previous buttons;
- ArrowRight, ArrowLeft, Space, PageDown, and PageUp;
- Home to return to the overview and End to reach the final slide;
- touch-friendly hit targets;
- fullscreen when requested;
- visible progress that mirrors the neural destinations;
- URL hash or equivalent stable deep links when the deck may be shared;
- focus management after each slide change;
- an `aria-live` announcement that does not repeat all slide text.

Keep the NTT DATA logo outside animated content containers so camera and slide transforms never move it.

### 10. Implement fallbacks before decoration

Required modes:

- full WebGL + motion;
- WebGL + reduced motion;
- no WebGL with a branded static network or gradient background;
- print/PDF view with all essential content visible and no dependency on animation state.

Motion must communicate hierarchy, continuity, route, or causality. Remove motion that only decorates.

### 11. Verify performance, accessibility, and resilience

Use the budgets and checks in `references/accessibility-performance.md` and `references/qa-and-acceptance.md`.

Always verify:

- title and content remain readable at 1366×768 and 1920×1080;
- mobile layout works at 390×844 without cropped controls or logo;
- keyboard navigation never traps focus;
- reduced motion removes spatial travel rather than merely shortening it;
- contrast remains sufficient over every camera background;
- the deck recovers from rapid navigation and resize events;
- the active neuron and current slide remain synchronized;
- build output opens from a static server;
- all third-party dependencies and remote assets are documented.

Run the bundled validator:

```bash
node scripts/validate-deck.mjs assets/starter
```

For a generated deck copied elsewhere, run the same script with that project directory.

## Brand non-negotiables

- Use the current approved NTT DATA logo. Do not redraw it, distort it, recolor it arbitrarily, or synthesize a substitute when an official asset is required.
- The verified NTT brand blue is `#0072BC`; treat other supporting colors as derived presentation tokens unless an approved NTT DATA guide says otherwise.
- Preserve clear space around the logo and keep it fixed at the bottom-right.
- Do not animate, pulse, glow, rotate, or use the logo as a neuron.
- Do not package proprietary font files. Use system fallbacks or user-supplied licensed webfont references.

## Output contract

A completed delivery contains:

- a runnable HTML presentation project;
- one authoritative slide/node configuration;
- local or documented external assets;
- an approved-logo placement hook plus a text fallback for development only;
- responsive styles and reduced-motion rules;
- WebGL fallback behavior;
- keyboard, pointer, and touch navigation;
- build and run instructions;
- validator output and a concise QA report;
- an explicit list of assumptions, placeholders, and unverified content.

Do not claim the presentation is production-ready without build evidence and visual review at the required viewports.
