# QA and acceptance

## Required viewports

Review every substantive slide and transition at:

- 1920×1080;
- 1366×768;
- 1440×900 or comparable laptop viewport;
- 390×844;
- 412×915 when mobile delivery matters.

## Required browsers

At minimum:

- current Chromium/Chrome or Edge;
- current Safari on macOS when used internally on Mac;
- current mobile Safari or Chrome when touch use is expected.

## Automated checks

Run:

```bash
npm run build
node ../../scripts/validate-deck.mjs .
```

When Playwright or equivalent is available, verify:

- no console errors on load or navigation;
- next/previous update URL and content;
- rapid input does not desynchronize node and slide;
- resize retains a valid camera and readable content;
- logo remains within viewport;
- reduced-motion emulation avoids long camera travel;
- WebGL failure fallback remains navigable;
- keyboard controls work when focus is not inside an editable element.

## Manual transition review

For each route:

- current content exits before major camera movement;
- camera visibly leaves the current node;
- overview/waypoint is readable;
- next destination is identifiable before arrival;
- camera settles without micro-jitter;
- content appears only after arrival;
- no edge or neuron intersects text distractingly;
- controls and logo remain stable.

## Content review

- one takeaway per slide;
- headings are conclusions where appropriate;
- numbers and claims have traceable sources;
- no placeholder text is accidentally presented as final;
- no slide depends on presenter explanation to make its basic meaning understandable;
- final slide resolves the opening question or requested decision.

## Accessibility review

- complete keyboard traversal;
- visible focus;
- correct heading order;
- meaningful alt text or decorative empty alt;
- readable content with canvas hidden;
- reduced-motion mode tested, not merely coded;
- touch controls do not overlap system browser UI;
- print/PDF contains all essential content.

## Release evidence

A final handoff should record:

- build command and result;
- tested browsers and viewports;
- screenshots or screen recording of opening and at least one full node-to-node transition;
- reduced-motion result;
- fallback result;
- known limitations;
- remaining placeholders or approvals, especially the official logo.
