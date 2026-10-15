export class DeckController {
  constructor({ presentation, scene, ui, keywordField, reducedMotionQuery }) {
    this.presentation = presentation;
    this.scene = scene;
    this.ui = ui;
    this.keywordField = keywordField;
    this.reducedMotionQuery = reducedMotionQuery;
    this.currentIndex = -1;
    this.transitioning = false;
    this.queuedIndex = null;
    this.ignoreHashChange = false;

    this.onKeyDown = this.onKeyDown.bind(this);
    this.onHashChange = this.onHashChange.bind(this);
    this.onPopState = this.onPopState.bind(this);
    this.onReducedMotionChange = this.onReducedMotionChange.bind(this);
    this.onMessage = this.onMessage.bind(this);
  }

  init() {
    this.ui.setHandlers({
      onStart: () => this.goTo(0, { source: 'button' }),
      onPrevious: () => this.previous('button'),
      onNext: () => this.next('button'),
      onNavigate: (index) => this.goTo(index, { source: 'progress' }),
    });

    window.addEventListener('keydown', this.onKeyDown);
    window.addEventListener('hashchange', this.onHashChange);
    window.addEventListener('popstate', this.onPopState);
    window.addEventListener('message', this.onMessage);
    this.reducedMotionQuery.addEventListener?.('change', this.onReducedMotionChange);

    const initialIndex = this.indexFromHash(window.location.hash);
    this.syncUrl(-1, 'replace');
    if (initialIndex >= 0) {
      window.setTimeout(() => this.goTo(initialIndex, { source: 'deep-link', historyMode: 'replace' }), 80);
    }
  }

  indexFromHash(hash) {
    const value = hash.replace(/^#/, '');
    if (!value || value === 'overview') return -1;
    return this.presentation.slides.findIndex((slide) => slide.id === value);
  }

  onHashChange() {
    this.navigateFromLocation();
  }

  onPopState() {
    this.navigateFromLocation();
  }

  navigateFromLocation() {
    if (this.ignoreHashChange) return;
    const index = this.indexFromHash(window.location.hash);
    if (index !== this.currentIndex) {
      this.goTo(index, { source: 'history', historyMode: 'none' });
    }
  }

  onReducedMotionChange(event) {
    const enabled = event.matches;
    this.scene.setReducedMotion(enabled);
    this.keywordField.setReducedMotion(enabled);
    if (!enabled && this.currentIndex < 0) this.keywordField.start();
    this.ui.setReducedMotion(enabled);
  }

  onKeyDown(event) {
    if (event.defaultPrevented || event.altKey || event.ctrlKey || event.metaKey) return;
    const target = event.target;
    const editable = target instanceof HTMLElement && target.closest('input, textarea, select, [contenteditable="true"]');
    if (editable) return;
    if (document.querySelector('dialog[open]')) return;

    const interactive = target instanceof HTMLElement && target.closest('button, a');
    if (interactive && (event.key === ' ' || event.key === 'Enter')) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'PageDown':
        event.preventDefault();
        this.next('keyboard');
        break;
      case 'ArrowLeft':
      case 'PageUp':
        event.preventDefault();
        this.previous('keyboard');
        break;
      case ' ':
        event.preventDefault();
        this.next('keyboard');
        break;
      case 'Home':
        event.preventDefault();
        this.goTo(-1, { source: 'keyboard' });
        break;
      case 'End':
        event.preventDefault();
        this.goTo(this.presentation.slides.length - 1, { source: 'keyboard' });
        break;
      default:
        break;
    }
  }

  currentWalkthrough() {
    const slide = this.presentation.slides[this.currentIndex];
    if (!slide?.walkthrough) return null;
    const frame = document.querySelector(`#slide-${slide.id} .walkthrough-frame iframe`);
    return frame?.contentWindow ?? null;
  }

  onMessage(event) {
    const frameWindow = this.currentWalkthrough();
    if (!frameWindow || event.source !== frameWindow || event.origin !== window.location.origin) return;
    if (event.data?.type !== 'launchpad-walkthrough') return;
    if (event.data.direction === 'next') this.next('keyboard', { skipWalkthrough: true });
    if (event.data.direction === 'previous') this.previous('keyboard', { skipWalkthrough: true });
  }

  next(source = 'api', { skipWalkthrough = false } = {}) {
    if (!skipWalkthrough && this.currentWalkthrough()?.launchpadWalkthrough?.next()) return;
    const last = this.presentation.slides.length - 1;
    const target = this.currentIndex < 0 ? 0 : Math.min(last, this.currentIndex + 1);
    if (target !== this.currentIndex) this.goTo(target, { source });
  }

  previous(source = 'api', { skipWalkthrough = false } = {}) {
    if (!skipWalkthrough && this.currentWalkthrough()?.launchpadWalkthrough?.previous()) return;
    const target = this.currentIndex <= 0 ? -1 : this.currentIndex - 1;
    if (target !== this.currentIndex) this.goTo(target, { source });
  }

  normalizeIndex(index) {
    if (!Number.isInteger(index)) return -1;
    return Math.max(-1, Math.min(this.presentation.slides.length - 1, index));
  }

  async goTo(requestedIndex, { source = 'api', historyMode = 'push' } = {}) {
    const targetIndex = this.normalizeIndex(requestedIndex);
    if (targetIndex === this.currentIndex && !this.transitioning) return;

    if (this.transitioning) {
      this.queuedIndex = targetIndex;
      return;
    }

    this.transitioning = true;
    this.ui.setLocked(true);
    const previousIndex = this.currentIndex;
    const shouldFocus = ['keyboard', 'button', 'progress', 'history', 'deep-link'].includes(source);

    try {
      if (targetIndex < 0) {
        if (previousIndex >= 0) {
          const fromNodeId = this.presentation.slides[previousIndex].nodeId;
          await this.ui.exitCurrent();
          await this.scene.transitionNodeToOverview(fromNodeId);
        }
        this.currentIndex = -1;
        this.keywordField.start();
        await this.ui.showOverview({ focus: shouldFocus });
      } else {
        const targetSlide = this.presentation.slides[targetIndex];
        this.keywordField.pause();

        if (previousIndex < 0) {
          await this.ui.hideOverview();
          await this.scene.transitionOverviewToNode(targetSlide.nodeId);
        } else {
          const previousSlide = this.presentation.slides[previousIndex];
          await this.ui.exitCurrent();
          await this.scene.transitionNodeToNode(previousSlide.nodeId, targetSlide.nodeId);
        }

        this.currentIndex = targetIndex;
        await this.ui.enterSlide(targetIndex, { focus: shouldFocus });
      }

      this.syncUrl(this.currentIndex, historyMode);
    } catch (error) {
      console.error('[DeckController] Navigation failed.', error);
      if (targetIndex < 0) {
        this.scene.setOverviewImmediate();
        this.currentIndex = -1;
        await this.ui.showOverview({ focus: shouldFocus });
      } else {
        const targetSlide = this.presentation.slides[targetIndex];
        this.scene.setNodeImmediate(targetSlide.nodeId);
        this.currentIndex = targetIndex;
        await this.ui.enterSlide(targetIndex, { focus: shouldFocus });
      }
      this.syncUrl(this.currentIndex, 'replace');
    } finally {
      this.transitioning = false;
      this.ui.setLocked(false);

      if (this.queuedIndex !== null && this.queuedIndex !== this.currentIndex) {
        const queued = this.queuedIndex;
        this.queuedIndex = null;
        queueMicrotask(() => this.goTo(queued, { source: 'keyboard' }));
      } else {
        this.queuedIndex = null;
      }
    }
  }

  syncUrl(index, mode = 'push') {
    if (mode === 'none') return;
    const hash = index < 0 ? '#overview' : `#${this.presentation.slides[index].id}`;
    const method = mode === 'replace' ? 'replaceState' : 'pushState';
    this.ignoreHashChange = true;
    window.history[method]({ slideIndex: index }, '', hash);
    queueMicrotask(() => {
      this.ignoreHashChange = false;
    });
  }

  dispose() {
    window.removeEventListener('keydown', this.onKeyDown);
    window.removeEventListener('hashchange', this.onHashChange);
    window.removeEventListener('popstate', this.onPopState);
    window.removeEventListener('message', this.onMessage);
    this.reducedMotionQuery.removeEventListener?.('change', this.onReducedMotionChange);
  }
}
