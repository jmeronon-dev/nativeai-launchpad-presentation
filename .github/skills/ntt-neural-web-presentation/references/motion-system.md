# Motion system

## Motion principles

Every animation must communicate at least one of:

- spatial continuity;
- destination;
- hierarchy;
- route;
- causality;
- state change.

Remove motion that communicates none of these.

## Default timing

Suggested full-motion ranges:

| Phase | Duration | Easing |
|---|---:|---|
| Content exit | 0.18–0.28 s | `power2.in` |
| Pull back from node | 0.65–0.90 s | `power2.inOut` |
| Overview/waypoint read | 0.20–0.40 s | linear or subtle hold |
| Dive into target | 0.85–1.20 s | `power3.inOut` |
| Content reveal | 0.32–0.50 s | `power2.out` |

Typical node-to-node navigation should finish in about 1.8–2.7 seconds. The first overview-to-node trip can be shorter because the camera already starts at the overview.

## Camera choreography

Animate these together:

- camera position;
- look-at target;
- field of view;
- active-node halo intensity;
- route/pulse emphasis;
- optional scene exposure or fog density.

Do not combine heavy camera rotation, zoom, and content movement at the same instant. Sequence attention.

## Overview waypoint

The zoom-out phase must become legible for a moment. It does not need to return to the exact opening camera every time. A stable elevated waypoint is acceptable when it preserves continuity and reduces travel time.

Use one of these patterns consistently:

- exact overview;
- overview with slight route bias;
- a shared orbit waypoint around the graph.

## Destination cue

Before or during the dive:

- brighten the target node;
- increase pulse traffic toward it;
- reduce unrelated edge opacity slightly;
- optionally draw a temporary route path.

Do not use color alone. Add scale, halo, motion, or line weight.

## Energy transmission

A simple robust implementation:

- precompute edge start/end vectors;
- assign each pulse an edge index, progress, speed, and phase;
- interpolate with `lerpVectors` each frame;
- recycle to another edge at progress > 1;
- use additive or screen-like appearance with restrained opacity;
- cap pulse count by device tier.

During navigation, reserve a few pulses for the highlighted route instead of spawning a second particle system.

## Floating concept physics

For each concept:

```text
springForce = (home - position) * spring
repulsion   = normalized(position - pointer) * strength * falloff
velocity    = (velocity + springForce + repulsion) * damping
position   += velocity
```

Recommended starting values:

- repulsion radius: 110–170 px;
- spring: 0.012–0.025;
- damping: 0.84–0.92;
- max displacement: 70–150 px depending on viewport;
- max concepts: 10–18 desktop, 6–10 mobile.

Clamp speed and displacement to prevent unstable explosions.

## Reduced motion

When `prefers-reduced-motion: reduce` is active:

- stop ambient camera drift and keyword physics;
- use a static neural image or still WebGL frame;
- replace spatial travel with a short opacity transition of 0–200 ms;
- update active-node cue immediately;
- keep all information and navigation semantics unchanged.

Reduced motion is a different choreography, not the same choreography played faster.

## Interruption policy

Recommended policy:

- lock controls during the uninterruptible camera phase;
- keep buttons visually present but `aria-disabled="true"`;
- store only the most recent requested destination;
- after arrival, execute the queued destination if still relevant;
- cancel timelines on teardown or mode changes;
- never leave the camera between authored states.
