# NTT Neural Web Presentation Skill

A reusable Agent Skill for creating immersive HTML presentations in which a persistent neural network becomes the presentation's navigation space.

## What is included

- `SKILL.md`: the orchestration workflow and delivery contract.
- `references/`: architecture, art direction, motion, content, accessibility, performance, QA, and research notes.
- `assets/starter/`: a working Vite + Three.js + GSAP starter project.
- `assets/presentation.schema.json`: the slide/node data contract.
- `scripts/validate-deck.mjs`: deterministic structural validation.
- `tests/evals.json`: activation and quality evaluation prompts.

## Install as an Agent Skill

Upload or copy this folder into the skills/capabilities location supported by your Agent Skills host. Keep the folder intact and ensure the host can discover the root `SKILL.md`.

Suggested invocation:

> Usa la skill `ntt-neural-web-presentation` para crear una presentación HTML de 8 slides sobre nuestra estrategia de IA. Mantén el sistema neuronal como espacio de navegación y utiliza el logo oficial que adjunto.

## Run the starter

```bash
cd assets/starter
npm install
npm run dev
```

Replace `assets/starter/public/brand/ntt-data-logo.svg` with an approved corporate logo asset before production use.

## Validate

From the skill root:

```bash
node scripts/validate-deck.mjs assets/starter
```

The starter intentionally uses a text fallback when the official logo file is not present. That fallback is for development only.

## Documentation

- Spanish quick start: `GUIA_RAPIDA_ES.md`
- Starter instructions: `assets/starter/README.md`
- Validation evidence and remaining release gates: `QA-REPORT.md`
