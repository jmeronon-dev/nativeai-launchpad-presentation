import { gsap } from 'gsap';

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
        <article class="process-step">
          <h3>${escapeHtml(step.title)}</h3>
          <p>${escapeHtml(step.text)}</p>
        </article>`,
    )
    .join('')}</div>`;
}

function renderSlideContent(slide, index, total) {
  const headingId = `slide-title-${slide.id}`;
  const primary = `
    <div>
      ${slide.kicker ? `<p class="slide-kicker" data-reveal>${escapeHtml(slide.kicker)}</p>` : ''}
      <h2 id="${headingId}" class="slide-title" tabindex="-1" data-reveal>${escapeHtml(slide.title)}</h2>
      ${slide.lead ? `<p class="slide-lead" data-reveal>${escapeHtml(slide.lead)}</p>` : ''}
      ${renderBody(slide.body)}
      ${renderProcess(slide.steps)}
      ${slide.callToAction ? `<p class="call-to-action" data-reveal>${escapeHtml(slide.callToAction)}</p>` : ''}
    </div>`;

  const metrics = renderMetrics(slide.metrics);
  const content = metrics && slide.layout !== 'process' ? `<div class="slide-grid">${primary}${metrics}</div>` : `${primary}${metrics}`;

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
        <span class="slide-index" aria-hidden="true">${String(index + 1).padStart(2, '0')} / ${String(total).padStart(2, '0')}</span>
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
    const overview = `<button class="progress-dot" type="button" data-index="-1" data-overview="true" aria-label="Portada"></button>`;
    const slides = this.presentation.slides
      .map(
        (slide, index) =>
          `<button class="progress-dot" type="button" data-index="${index}" aria-label="Ir a ${escapeHtml(slide.title)}"></button>`,
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
    if (this.logo.complete) {
      this.logo.naturalWidth > 0 ? showImage() : showFallback();
    }
  }

  setHandlers(handlers) {
    this.handlers = handlers;
    this.startButton.addEventListener('click', () => this.handlers.onStart?.());
    this.previousButton.addEventListener('click', () => this.handlers.onPrevious?.());
    this.nextButton.addEventListener('click', () => this.handlers.onNext?.());
    this.progress.addEventListener('click', (event) => {
      const button = event.target.closest('[data-index]');
      if (!button) return;
      this.handlers.onNavigate?.(Number(button.dataset.index));
    });
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
    panel.classList.add('is-active');
    panel.setAttribute('aria-hidden', 'false');
    panel.inert = false;
    this.updateNavigation(index);
    this.announce(`Slide ${index + 1} de ${this.presentation.slides.length}: ${slide.title}`);

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
