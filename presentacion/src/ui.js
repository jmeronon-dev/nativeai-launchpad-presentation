import { gsap } from 'gsap';
import { marked, Renderer } from 'marked';
import { groups } from './content.js';

function escapeHtml(value = '') {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function renderBody(body) {
  if (!body) return '';
  if (Array.isArray(body)) {
    return `<div class="slide-body" data-reveal><ul>${body
      .map((item) => `<li>${escapeHtml(item)}</li>`)
      .join('')}</ul></div>`;
  }
  return `<div class="slide-body" data-reveal><p>${escapeHtml(body)}</p></div>`;
}

function renderMetrics(metrics = []) {
  if (!metrics.length) return '';
  return `<div class="metrics" data-reveal>${metrics
    .map(
      (metric) => `
        <div class="metric">
          <span class="metric-value">${escapeHtml(metric.value)}</span>
          <span class="metric-label">${escapeHtml(metric.label)}</span>
        </div>`,
    )
    .join('')}</div>`;
}

function renderProcess(steps = []) {
  if (!steps.length) return '';
  return `<div class="process-grid" data-reveal>${steps
    .map(
      (step) => `
        <article class="process-step" data-reveal>
          ${step.icon ? `<i class="process-icon" data-lucide="${escapeHtml(step.icon)}" aria-hidden="true"></i>` : ''}
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.text)}</p>
        </article>`,
    )
    .join('')}</div>`;
}

function renderFeatureCards(cards = []) {
  if (!cards.length) return '';
  return `<div class="feature-grid feature-grid--${cards.length}">${cards
    .map(
      (card) => `
        <article class="feature-card" data-reveal>
          <i class="feature-icon" data-lucide="${escapeHtml(card.icon)}" aria-hidden="true"></i>
          <h3>${escapeHtml(card.title)}</h3>
          <p>${escapeHtml(card.description)}</p>
          ${card.detail ? `<p class="feature-detail">${escapeHtml(card.detail)}</p>` : ''}
        </article>`,
    )
    .join('')}</div>`;
}

function renderSlideContent(slide, index, total) {
  const headingId = `slide-title-${slide.id}`;
  const primary = slide.walkthrough
    ? `
    <div class="walkthrough-slide-content">
      <h2 id="${headingId}" class="sr-only" tabindex="-1">${escapeHtml(slide.title)}</h2>
      <div class="walkthrough-frame" data-reveal><iframe src="${escapeHtml(slide.walkthrough.src)}" title="${escapeHtml(slide.walkthrough.title)}" loading="lazy" allowfullscreen></iframe></div>
    </div>`
    : `
    <div>
      ${slide.kicker ? `<p class="slide-kicker" data-reveal>${escapeHtml(slide.kicker)}</p>` : ''}
      <h2 id="${headingId}" class="slide-title" tabindex="-1" data-reveal>${escapeHtml(slide.title)}</h2>
      ${slide.lead ? `<p class="slide-lead" data-reveal>${escapeHtml(slide.lead)}</p>` : ''}
      ${renderBody(slide.body)}
      ${slide.quote ? `<blockquote class="slide-quote" data-reveal>${escapeHtml(slide.quote)}</blockquote>` : ''}
      ${renderFeatureCards(slide.featureCards)}
      ${slide.figure ? `<figure class="slide-figure" data-reveal><img src="${escapeHtml(slide.figure.src)}" alt="${escapeHtml(slide.figure.alt)}" loading="lazy" /></figure>` : ''}
      ${slide.definitions ? `<dl class="definitions" data-reveal>${slide.definitions.map(([term, definition]) => `<div><dt>${escapeHtml(term)}</dt><dd>${escapeHtml(definition)}</dd></div>`).join('')}</dl>` : ''}
      ${slide.diagram ? `<ol class="concept-diagram ${slide.connected ? 'is-connected' : ''}" data-reveal>${slide.diagram.map((item) => {
        const [title, text] = item.split('|');
        return `<li><strong>${escapeHtml(title)}</strong>${text ? `<span>${escapeHtml(text)}</span>` : ''}</li>`;
      }).join('')}</ol>` : ''}
      ${renderProcess(slide.steps)}
      ${slide.demo ? '<div class="demo-controls" data-reveal><button type="button" class="demo-previous" aria-label="Paso anterior" title="Paso anterior"><i data-lucide="arrow-left" aria-hidden="true"></i></button><output class="demo-position">01 / 06</output><button type="button" class="demo-next" aria-label="Siguiente paso" title="Siguiente paso"><i data-lucide="arrow-right" aria-hidden="true"></i></button></div>' : ''}
      ${slide.callToAction ? `<p class="call-to-action" data-reveal>${escapeHtml(slide.callToAction)}</p>` : ''}
    </div>`;

  const metrics = renderMetrics(slide.metrics);
  const image = slide.image ? `<figure class="slide-image ${slide.image === 'portrait' ? 'portrait' : 'product-mark'}" data-reveal><img src="./${slide.image === 'portrait' ? 'imagen-javi-personal.png' : 'ainative-launchpad.png'}" alt="${slide.image === 'portrait' ? 'Retrato del ponente' : 'AI Native Launchpad'}" loading="lazy" /></figure>` : '';
  const content = image ? `<div class="media-layout">${primary}${image}</div>` : metrics && slide.layout !== 'process' ? `<div class="slide-grid">${primary}${metrics}</div>` : `${primary}${metrics}`;

  return `
    <section
      id="slide-${escapeHtml(slide.id)}"
      class="slide-panel slide-panel--${escapeHtml(slide.layout)}"
      aria-labelledby="${headingId}"
      aria-roledescription="slide"
      aria-label="${index + 1} de ${total}"
      aria-hidden="true"
      inert
      data-slide-index="${index}"
    >
      <div class="slide-shell">
        <span class="slide-index" aria-hidden="true">${escapeHtml(groups[slide.group])} · ${escapeHtml(slide.timing)}</span>
        ${content}
      </div>
    </section>`;
}

export class PresentationUI {
  constructor(presentation, { reducedMotion = false } = {}) {
    this.presentation = presentation;
    this.reducedMotion = reducedMotion;
    this.currentIndex = -1;
    this.handlers = {};
    this.activeTimeline = null;

    this.app = document.querySelector('#app');
    this.hero = document.querySelector('#hero');
    this.heroCopy = document.querySelector('.hero-copy');
    this.heroTitle = document.querySelector('#presentation-title');
    this.slideStage = document.querySelector('#slide-stage');
    this.status = document.querySelector('#deck-status');
    this.previousButton = document.querySelector('#previous-button');
    this.nextButton = document.querySelector('#next-button');
    this.startButton = document.querySelector('#start-button');
    this.progress = document.querySelector('#progress-dots');
    this.logo = document.querySelector('#brand-logo');
    this.logoFallback = document.querySelector('#brand-fallback');
    this.fallback = document.querySelector('#webgl-fallback');

    this.renderSlides();
    this.renderProgress();
    this.renderIndex();
    this.setupDialogs();
    this.setupDemo();
    this.setupLogoFallback();
    this.updateNavigation(-1);
  }

  renderSlides() {
    this.slideStage.innerHTML = this.presentation.slides
      .map((slide, index) => renderSlideContent(slide, index, this.presentation.slides.length))
      .join('');
    this.panels = [...this.slideStage.querySelectorAll('.slide-panel')];
  }

  renderProgress() {
    const overview = `<span class="progress-dot" data-index="-1" data-overview="true"></span>`;
    const slides = this.presentation.slides
      .map(
        (slide, index) =>
          `<span class="progress-dot" data-index="${index}" data-group="${slide.group}"></span>`,
      )
      .join('');
    this.progress.innerHTML = overview + slides;
    this.progressDots = [...this.progress.querySelectorAll('.progress-dot')];
  }

  setupLogoFallback() {
    const showImage = () => {
      if (this.logo.naturalWidth > 0) {
        this.logo.hidden = false;
        this.logoFallback.hidden = true;
      }
    };
    const showFallback = () => {
      this.logo.hidden = true;
      this.logoFallback.hidden = false;
    };

    this.logo.addEventListener('load', showImage);
    this.logo.addEventListener('error', showFallback);
    if (this.presentation.meta.logo) this.logo.src = this.presentation.meta.logo;
    if (this.logo.complete) {
      this.logo.naturalWidth > 0 ? showImage() : showFallback();
    }
  }

  setHandlers(handlers) {
    this.handlers = handlers;
    this.startButton.addEventListener('click', () => this.handlers.onStart?.());
    this.previousButton.addEventListener('click', () => this.handlers.onPrevious?.());
    this.nextButton.addEventListener('click', () => this.handlers.onNext?.());
    document.querySelector('#slide-index-list').addEventListener('click', (event) => {
      const button = event.target.closest('[data-index]');
      if (!button) return;
      document.querySelector('#index-dialog').close();
      this.handlers.onNavigate?.(Number(button.dataset.index));
    });
    document.querySelector('#overview-button').addEventListener('click', () => this.handlers.onNavigate?.(-1));
  }

  renderIndex() {
    document.querySelector('#slide-index-list').innerHTML = `<button type="button" data-index="-1">Vista general</button>` + groups.map((group, groupIndex) => `<h3>${escapeHtml(group)}</h3>${this.presentation.slides.map((slide, index) => slide.group === groupIndex ? `<button type="button" data-index="${index}"><span>${String(index + 1).padStart(2, '0')}</span>${escapeHtml(slide.title)}</button>` : '').join('')}`).join('');
  }

  setupDialogs() {
    const indexDialog = document.querySelector('#index-dialog');
    const notesDialog = document.querySelector('#notes-dialog');
    const notesRenderer = new Renderer();
    notesRenderer.html = (token) => escapeHtml(token.text);
    document.querySelector('#slide-menu-button').addEventListener('click', () => indexDialog.showModal());
    document.querySelector('#notes-button').addEventListener('click', () => {
      const slide = this.presentation.slides[this.currentIndex];
      const notes = slide?.notes || this.presentation.meta.overviewNotes;
      document.querySelector('#speaker-notes').innerHTML = notes ? marked.parse(notes, { renderer: notesRenderer }) : '<p>AI Native Launchpad · Del contexto al workspace.</p>';
      notesDialog.showModal();
    });
    for (const dialog of [indexDialog, notesDialog]) {
      dialog.querySelector('[data-close-dialog]').addEventListener('click', () => dialog.close());
      dialog.addEventListener('click', (event) => { if (event.target === dialog) dialog.close(); });
    }
    document.querySelector('#fullscreen-button').addEventListener('click', async () => {
      try {
        if (document.fullscreenElement) await document.exitFullscreen();
        else await document.documentElement.requestFullscreen();
      } catch {
        this.announce('Pantalla completa no disponible en este navegador.');
      }
    });
  }

  setupDemo() {
    const panel = this.panels.find((item) => item.querySelector('.demo-controls'));
    if (!panel) return;
    const steps = [...panel.querySelectorAll('.process-step')];
    let currentStep = 0;
    const update = () => {
      steps.forEach((step, index) => step.toggleAttribute('data-demo-active', index === currentStep));
      panel.querySelector('.demo-position').textContent = `${String(currentStep + 1).padStart(2, '0')} / ${String(steps.length).padStart(2, '0')}`;
      panel.querySelector('.demo-previous').disabled = currentStep === 0;
      panel.querySelector('.demo-next').disabled = currentStep === steps.length - 1;
    };
    panel.querySelector('.demo-previous').addEventListener('click', () => { currentStep = Math.max(0, currentStep - 1); update(); });
    panel.querySelector('.demo-next').addEventListener('click', () => { currentStep = Math.min(steps.length - 1, currentStep + 1); update(); });
    update();
  }

  setReducedMotion(value) {
    this.reducedMotion = value;
  }

  setWebGLFallback(enabled) {
    this.app.classList.toggle('is-webgl-fallback', enabled);
    this.fallback.hidden = !enabled;
  }

  setLocked(locked) {
    this.app.toggleAttribute('data-transitioning', locked);
    this.previousButton.setAttribute('aria-disabled', String(locked));
    this.nextButton.setAttribute('aria-disabled', String(locked));
    for (const dot of this.progressDots) {
      dot.setAttribute('aria-disabled', String(locked));
    }
  }

  killActiveTimeline() {
    this.activeTimeline?.kill();
    this.activeTimeline = null;
  }

  hideOverview() {
    this.killActiveTimeline();
    this.hero.inert = true;
    this.hero.setAttribute('aria-hidden', 'true');
    if (!this.hero.classList.contains('is-visible')) return Promise.resolve();

    if (this.reducedMotion) {
      this.hero.classList.remove('is-visible');
      gsap.set(this.hero, { autoAlpha: 0 });
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.activeTimeline = gsap
        .timeline({
          onComplete: () => {
            this.hero.classList.remove('is-visible');
            this.activeTimeline = null;
            resolve();
          },
        })
        .to(this.heroCopy, { autoAlpha: 0, y: -18, duration: 0.24, ease: 'power2.in' })
        .to(this.hero, { autoAlpha: 0, duration: 0.12 }, '<0.08');
    });
  }

  showOverview({ focus = false } = {}) {
    this.killActiveTimeline();
    this.hideAllPanels();
    this.hero.classList.add('is-visible');
    this.hero.inert = false;
    this.hero.removeAttribute('aria-hidden');
    this.app.dataset.state = 'overview';
    this.currentIndex = -1;
    this.updateNavigation(-1);
    this.announce('Portada');

    if (this.reducedMotion) {
      gsap.set([this.hero, this.heroCopy], { autoAlpha: 1, y: 0 });
      if (focus) this.heroTitle?.focus({ preventScroll: true });
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.activeTimeline = gsap
        .timeline({
          onComplete: () => {
            this.activeTimeline = null;
            if (focus) this.heroTitle?.focus({ preventScroll: true });
            resolve();
          },
        })
        .set(this.hero, { autoAlpha: 1 })
        .fromTo(this.heroCopy, { autoAlpha: 0, y: 18 }, { autoAlpha: 1, y: 0, duration: 0.42, ease: 'power2.out' });
    });
  }

  exitCurrent() {
    const panel = this.panels[this.currentIndex];
    if (!panel) return Promise.resolve();
    this.killActiveTimeline();

    if (this.reducedMotion) {
      this.deactivatePanel(panel);
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.activeTimeline = gsap.timeline({
        onComplete: () => {
          this.deactivatePanel(panel);
          this.activeTimeline = null;
          resolve();
        },
      });
      this.activeTimeline.to(panel.querySelectorAll('[data-reveal]'), {
        autoAlpha: 0,
        y: -10,
        duration: 0.18,
        stagger: 0.015,
        ease: 'power2.in',
      });
      this.activeTimeline.to(panel, { autoAlpha: 0, duration: 0.12 }, '<0.05');
    });
  }

  enterSlide(index, { focus = false } = {}) {
    const panel = this.panels[index];
    const slide = this.presentation.slides[index];
    if (!panel || !slide) return Promise.resolve();

    this.killActiveTimeline();
    this.hideAllPanels();
    this.currentIndex = index;
    this.app.dataset.state = 'slide';
    panel.querySelector('.slide-shell').scrollTop = 0;
    panel.classList.add('is-active');
    panel.setAttribute('aria-hidden', 'false');
    panel.inert = false;
    this.updateNavigation(index);
    this.announce(`Diapositiva ${index + 1} de ${this.presentation.slides.length}: ${slide.title}`);

    const heading = panel.querySelector('.slide-title');
    const revealItems = panel.querySelectorAll('[data-reveal]');

    if (this.reducedMotion) {
      gsap.set(panel, { autoAlpha: 1 });
      gsap.set(revealItems, { autoAlpha: 1, y: 0 });
      if (focus) heading?.focus({ preventScroll: true });
      return Promise.resolve();
    }

    return new Promise((resolve) => {
      this.activeTimeline = gsap
        .timeline({
          onComplete: () => {
            this.activeTimeline = null;
            if (focus) heading?.focus({ preventScroll: true });
            resolve();
          },
        })
        .set(panel, { autoAlpha: 1 })
        .fromTo(
          revealItems,
          { autoAlpha: 0, y: 18 },
          { autoAlpha: 1, y: 0, duration: 0.42, stagger: 0.055, ease: 'power2.out' },
        );
    });
  }

  deactivatePanel(panel) {
    panel.classList.remove('is-active');
    panel.setAttribute('aria-hidden', 'true');
    panel.inert = true;
    gsap.set(panel, { autoAlpha: 0 });
  }

  hideAllPanels() {
    for (const panel of this.panels) {
      this.deactivatePanel(panel);
    }
  }

  updateNavigation(index) {
    const last = this.presentation.slides.length - 1;
    this.previousButton.disabled = index < 0;
    this.nextButton.disabled = index >= last;
    document.querySelector('#position-label').textContent = index < 0 ? 'Portada' : `${String(index + 1).padStart(2, '0')} / ${this.presentation.slides.length}`;
    this.app.dataset.activeNode = index < 0 ? '' : this.presentation.slides[index].nodeId;

    for (const dot of this.progressDots) {
      const isCurrent = Number(dot.dataset.index) === index;
      if (isCurrent) dot.setAttribute('aria-current', 'step');
      else dot.removeAttribute('aria-current');
    }
  }

  announce(message) {
    this.status.textContent = '';
    window.setTimeout(() => {
      this.status.textContent = message;
    }, 20);
  }

  dispose() {
    this.killActiveTimeline();
  }
}
