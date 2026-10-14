import './styles.css';
import { presentation as sourcePresentation } from './content.js';
import { NeuralScene } from './neural-scene.js';
import { PresentationUI } from './ui.js';
import { KeywordField } from './keyword-field.js';
import { DeckController } from './deck-controller.js';

function createRuntimePresentation(source) {
  return {
    ...source,
    slides: [...source.slides].sort((left, right) => left.order - right.order),
  };
}

async function bootstrap() {
  const presentation = createRuntimePresentation(sourcePresentation);

  document.documentElement.lang = presentation.meta.language || 'es';
  document.title = `${presentation.meta.title} | NTT DATA`;
  document.querySelector('#presentation-eyebrow').textContent =
    presentation.meta.eyebrow || 'NTT DATA · Presentación interactiva';
  document.querySelector('#presentation-title').textContent = presentation.meta.title;
  document.querySelector('#presentation-subtitle').textContent = presentation.meta.subtitle || '';

  const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
  const ui = new PresentationUI(presentation, { reducedMotion: reducedMotionQuery.matches });
  const keywordField = new KeywordField(document.querySelector('#keyword-field'), presentation.keywords, {
    reducedMotion: reducedMotionQuery.matches,
  });

  document.querySelector('#keyword-summary').textContent = `Conceptos clave: ${presentation.keywords.join(', ')}.`;

  const scene = new NeuralScene(document.querySelector('#neural-canvas'), presentation, {
    reducedMotion: reducedMotionQuery.matches,
    onFallback: (enabled) => ui.setWebGLFallback(enabled),
  });
  const webGLReady = scene.init();
  ui.setWebGLFallback(!webGLReady);

  const controller = new DeckController({
    presentation,
    scene,
    ui,
    keywordField,
    reducedMotionQuery,
  });
  controller.init();

  document.querySelector('#app').dataset.ready = 'true';

  const dispose = () => {
    controller.dispose();
    keywordField.dispose();
    ui.dispose();
    scene.dispose();
  };

  window.addEventListener('pagehide', dispose, { once: true });
}

bootstrap().catch((error) => {
  console.error('[Presentation] Bootstrap failed.', error);
  document.querySelector('#webgl-fallback')?.removeAttribute('hidden');
});
