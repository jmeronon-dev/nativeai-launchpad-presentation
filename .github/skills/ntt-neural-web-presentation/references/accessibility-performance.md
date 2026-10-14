# Accessibility and performance

## Semantic baseline

- Keep the canvas `aria-hidden="true"` unless it exposes a meaningful textual alternative.
- Render every substantive word, number, table, chart summary, and control in HTML.
- Use one visible `h1` on the opening and logical headings for slides.
- Maintain DOM reading order independent of visual positioning.
- Announce slide changes with a concise `aria-live` status such as “Slide 3 of 8: Operating model”.
- Move focus to the slide heading after navigation only when it will not disrupt presenter keyboard use; otherwise provide a configurable focus policy.
- Use visible focus styles and 44×44 px minimum touch targets.
- Do not rely on color alone for current node, progress, success, warning, or comparison.

## Reduced motion

Support both:

- CSS `@media (prefers-reduced-motion: reduce)`;
- runtime `matchMedia` updates while the page is open.

Disable pointer physics, ambient oscillation, and spatial camera travel. Keep a short fade or instant state change.

## WebGL fallback

Detect renderer failure. Fallback must include:

- branded static background or locally generated neural illustration;
- fully operational HTML slides and controls;
- visible current-slide state;
- no blocking error overlay;
- optional non-technical status message in the console or diagnostics panel.

## Contrast and motion legibility

- Ensure text contrast against the darkest and brightest camera regions.
- Use a local scrim behind content when the scene cannot guarantee contrast.
- Do not place body text directly over high-frequency moving edges.
- Avoid flashes or rapid luminance changes.
- Keep energy pulses below seizure-risk frequencies and intensity.

## Default performance budgets

Desktop target:

- 60 fps on a current business laptop;
- 100–140 nodes;
- 180–320 edges;
- 16–28 energy pulses;
- device pixel ratio cap 1.5–1.75;
- no more than one lightweight post-processing pass.

Mobile target:

- stable 30 fps or better;
- 45–75 nodes;
- 80–150 edges;
- 8–14 pulses;
- device pixel ratio cap 1.0–1.25;
- no post-processing unless proven safe.

Adapt counts based on viewport, DPR, pointer type, and measured frame time.

## Lifecycle

Required:

- one animation loop;
- pause when `document.hidden`;
- resize with debouncing or lightweight direct handling;
- remove all listeners on teardown;
- kill GSAP timelines on teardown;
- dispose Three.js geometry, material, texture, and renderer resources;
- avoid allocating vectors and matrices in the hot path when practical.

## Asset policy

- Prefer local assets for presentation-critical media.
- Document every CDN dependency.
- Never hotlink an unapproved corporate logo.
- Lazy-load heavy media not needed on the opening.
- Compress raster images and avoid 4K assets when displayed small.
