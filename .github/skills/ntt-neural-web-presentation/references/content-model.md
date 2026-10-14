# Content model

## Slide purpose

Every slide must have:

- one primary takeaway;
- one destination neuron;
- a reason for its position in the sequence;
- an intended audience response;
- optional evidence and source metadata;
- optional speaker notes.

## Recommended fields

```js
{
  id: "delivery-model",
  nodeId: "node-delivery-model",
  order: 3,
  layout: "split",
  kicker: "From effort to outcome",
  title: "Capacity becomes a measurable service",
  lead: "A single sentence that explains why this matters.",
  body: ["Point one", "Point two"],
  metrics: [{ value: "-12%", label: "unit cost" }],
  source: { label: "Internal baseline", date: "2026-09" },
  notes: "Speaker-only context",
  camera: { fov: 38 }
}
```

## Layout patterns

### Statement

Use for a decisive idea. One title, one supporting line, optional small proof.

### Split

Use when the audience must compare narrative and evidence, or current and target state.

### Process

Use for a genuine ordered sequence. Avoid numbering content that is not sequential.

### Data insight

Lead with the conclusion, not the chart type. Include a textual summary and source.

### Comparison

Define criteria before options. Make the recommendation reconstructable from the evidence.

### Case study

Situation → intervention → measurable outcome. Keep methodology in notes or appendix.

### Closing action

State the decision, owner, or next step. Reconnect visually to the network overview.

## Density rules

Defaults, not absolute limits:

- title: 3–12 words;
- lead: 12–28 words;
- body: 35–90 words total;
- bullets: maximum 4 in the main path;
- metrics: maximum 3 per slide;
- table: maximum 5 columns and 7 rows in the main path;
- one chart or one dominant diagram per slide.

Move detail to notes, appendix, or an optional drill-down node.

## Mapping story to space

Use position intentionally:

- central/high-connectivity nodes for strategic or integrative ideas;
- edge nodes for specialist detail;
- nearby nodes for closely related slides;
- larger spatial jumps for major section changes;
- final node positioned so the closing transition can return to a satisfying overview.

Do not imply false semantic relationships merely because random nodes happen to be adjacent.
