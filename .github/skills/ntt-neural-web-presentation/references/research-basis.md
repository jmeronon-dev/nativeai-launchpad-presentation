# Research basis

This skill synthesizes current official documentation and public skill-design patterns. It does not copy third-party implementation code.

## Agent Skills structure

- OpenAI, “Build skills”: https://developers.openai.com/plugins/build/skills
- OpenAI, “Skills”: https://developers.openai.com/api/docs/guides/tools-skills
- OpenAI Academy, “Using skills”: https://openai.com/academy/skills/

Key conclusions used here:

- a skill is a folder anchored by one `SKILL.md`;
- the description must explain what the skill does and when it should activate;
- detailed policies, assets, schemas, and scripts belong in supporting files;
- workflows should define inputs, sequence, output contract, and final checks.

## Visual design and presentation patterns

- Anthropic public frontend-design skill: https://github.com/anthropics/skills/blob/main/skills/frontend-design/SKILL.md
- reveal.js presentation skills research: https://github.com/lestermarch/revealjs-skills
- reveal.js official documentation: https://revealjs.com/

Key conclusions used here:

- design should be specific to the subject and avoid template-like defaults;
- motion should express hierarchy, comparison, sequence, causality, or continuity;
- persistent custom-world navigation is better treated as a dedicated runtime than as a decorative slide transition;
- release quality requires narrative, visual, responsive, accessibility, runtime, and print evidence.

## Animation and 3D

- GSAP documentation: https://gsap.com/docs/v3/
- GSAP getting started and performance guidance: https://gsap.com/resources/get-started/
- Three.js manual: https://threejs.org/manual/
- Three.js examples: https://threejs.org/examples/

Key conclusions used here:

- timelines are appropriate for coordinated, deterministic multi-phase transitions;
- transforms and opacity are preferable to layout-changing animation;
- npm plus a build tool is the recommended Three.js setup for multi-module projects;
- resource disposal, adaptive complexity, and responsive rendering are required for production scenes.

## NTT and NTT DATA identity

- NTT official brand page: https://group.ntt/en/group/brand/
- NTT DATA official 2025 corporate logo update: https://www.nttdata.com/global/en/news/press-release/2025/may/050901

Verified facts used here:

- the NTT Group renewed its corporate identity from July 1, 2025;
- NTT Blue is `#0072BC` / RGB `0,114,188` / Pantone 285C;
- NTT DATA adopted the unified global dynamic-loop logo for domestic businesses from July 1, 2025.

Always prefer the current official asset supplied by the organization over recreating the logo from screenshots or third-party repositories.

## Version snapshot used by the starter

Verified on 2026-10-04 against official release pages:

- Three.js `r186` / npm `0.186.0`;
- GSAP `3.15.0`;
- Vite `8.3.2`.

The starter pins these versions for reproducibility. Upgrade deliberately after reading migration notes and rerunning the structural, browser, accessibility, and performance checks.
