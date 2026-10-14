# Brand and art direction

## Brand baseline

NTT states that the group corporate identity was renewed from July 1, 2025 and identifies NTT Blue as:

- HEX `#0072BC`
- RGB `0, 114, 188`
- Pantone 285C

Use this as the verified primary brand color. If the user provides an approved NTT DATA brand guide, that guide takes precedence.

## Suggested presentation tokens

Only `--ntt-blue` is asserted here as an official brand color. The remaining colors are derived presentation tokens.

```css
:root {
  --ntt-blue: #0072bc;
  --ntt-blue-bright: #1597e5;
  --ntt-electric: #67d4ff;
  --ntt-energy: #c7f2ff;
  --ntt-ink: #061525;
  --ntt-ink-soft: #0d2940;
  --ntt-surface: #f5f9fc;
  --ntt-white: #ffffff;
  --ntt-muted: #9eb4c4;
}
```

Keep the palette blue-led. Any yellow, red, green, or purple accent must have a semantic purpose or come from approved source material.

## Logo rules

- Use an approved current NTT DATA asset.
- Preserve its aspect ratio and clear space.
- Place it `position: fixed` at bottom-right.
- Recommended visual width: `clamp(108px, 10vw, 154px)`.
- Recommended inset: `clamp(18px, 2.2vw, 32px)`.
- Keep it above the canvas and content transitions.
- Provide `alt="NTT DATA"` for an informative image, or empty alt plus adjacent accessible brand text if the logo is redundant.
- Do not glow, blur, rotate, pulse, morph, crop, mask, or use the mark as decoration.
- A text fallback may be used during development, but never present it as the official logo.

## Composition

The network is the single expressive hero. Content should use restrained editorial composition:

- strong headline;
- short lead or evidence line;
- one diagram, metric, or comparison when useful;
- generous negative space;
- a subtle line, coordinate, or node marker to connect content to the world.

Avoid a deck made from identical translucent cards. Use panels only when they solve contrast over a moving background.

## Typography

- Do not distribute or embed proprietary corporate font files.
- Use an approved hosted font only when the user supplies the license and URL.
- Safe fallback: `Arial, "Helvetica Neue", Helvetica, sans-serif`.
- Use a compact type scale suited to 16:9 and laptop projection.
- Limit body line length to roughly 45–75 characters.
- Avoid all-caps labels except genuine acronyms or tiny functional UI.

## Visual language

Preferred qualities:

- precise;
- technological without science-fiction cliché;
- energetic but controlled;
- global and executive;
- clean enough for business content;
- visibly custom to the narrative.

Avoid:

- purple/pink AI gradients;
- random lens flares;
- overused glassmorphism;
- generic circuit-board backgrounds;
- decorative particles that compete with energy routes;
- tiny data text;
- logo repetition inside slides.
