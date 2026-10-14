function seededRandom(seed = 1) {
  let value = seed >>> 0;
  return () => {
    value += 0x6d2b79f5;
    let t = value;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export class KeywordField {
  constructor(container, words, { reducedMotion = false } = {}) {
    this.container = container;
    this.words = words;
    this.reducedMotion = reducedMotion;
    this.items = [];
    this.pointer = { x: -9999, y: -9999, active: false };
    this.running = false;
    this.enabled = true;
    this.frame = null;
    this.layoutWidth = 0;
    this.layoutHeight = 0;
    this.random = seededRandom(20261004);

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
    this.tick = this.tick.bind(this);

    this.createItems();
    this.bind();
    if (!this.reducedMotion) this.start();
  }

  createItems() {
    const fragment = document.createDocumentFragment();
    this.words.forEach((word, index) => {
      const element = document.createElement('span');
      element.className = 'keyword';
      element.dataset.tone = String(index % 9);
      element.textContent = word;
      fragment.appendChild(element);

      const position = this.createInitialPosition(index);
      const phase = index * 1.73 + this.random() * Math.PI;
      this.items.push({
        element,
        initialPosition: position,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
        phase,
        speed: 0.22 + this.random() * 0.36,
      });
    });
    this.container.appendChild(fragment);
    this.layout(true);
  }

  createInitialPosition(index) {
    return { column: index % 3, row: Math.floor(index / 3) };
  }

  bind() {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
  }

  onPointerMove(event) {
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.active = true;
  }

  onPointerLeave() {
    this.pointer.active = false;
  }

  onPointerDown(event) {
    if (event.pointerType === 'mouse') return;
    this.pointer.x = event.clientX;
    this.pointer.y = event.clientY;
    this.pointer.active = true;
    window.setTimeout(() => {
      this.pointer.active = false;
    }, 260);
  }

  onResize() {
    this.layout(false);
  }

  onVisibilityChange() {
    if (document.hidden) {
      this.running = false;
      cancelAnimationFrame(this.frame);
    } else if (this.enabled) {
      this.start();
    }
  }

  layout(reset) {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    const scaleX = this.layoutWidth ? width / this.layoutWidth : 1;
    const scaleY = this.layoutHeight ? height / this.layoutHeight : 1;
    const protectedAreas = this.getProtectedAreas();
    for (const item of this.items) {
      const rect = item.element.getBoundingClientRect();
      item.width = rect.width;
      item.height = rect.height;
      if (reset || this.reducedMotion) {
        const cellWidth = width / 3;
        const rowCount = Math.ceil(this.items.length / 3);
        item.x = (item.initialPosition.column + 0.5) * cellWidth - rect.width / 2;
        item.y = ((item.initialPosition.row + 1) * height) / (rowCount + 1) - rect.height / 2;
        item.vx = this.reducedMotion ? 0 : Math.cos(item.phase) * item.speed;
        item.vy = this.reducedMotion ? 0 : Math.sin(item.phase) * item.speed;
      } else {
        item.x *= scaleX;
        item.y *= scaleY;
        item.x = Math.max(8, Math.min(width - rect.width - 8, item.x));
        item.y = Math.max(16, Math.min(height - rect.height - 68, item.y));
      }
      this.paint(item);
      this.updateKeywordVisibility(item, protectedAreas);
    }
    this.layoutWidth = width;
    this.layoutHeight = height;
  }

  getProtectedAreas() {
    const hero = this.container.closest('.hero');
    if (!hero?.classList.contains('is-visible')) return [];
    return [...document.querySelectorAll('.hero-copy > :not(.sr-only), .hero-mark, .presentation-tools, .deck-controls, .brand-lockup')]
      .filter((element) => getComputedStyle(element).display !== 'none')
      .map((element) => {
        const rect = element.getBoundingClientRect();
        return { left: rect.left - 8, right: rect.right + 8, top: rect.top - 6, bottom: rect.bottom + 6 };
      });
  }

  updateKeywordVisibility(item, protectedAreas) {
    const overlapsCopy = protectedAreas.some((area) =>
      item.x < area.right && item.x + item.width > area.left && item.y < area.bottom && item.y + item.height > area.top,
    );
    item.element.style.opacity = overlapsCopy ? '0.14' : '0.86';
  }

  setReducedMotion(value) {
    this.reducedMotion = value;
    if (value) {
      this.pause();
      this.layout(true);
    } else {
      this.layout(false);
    }
  }

  start() {
    this.enabled = true;
    if (this.running || this.reducedMotion || document.hidden) return;
    this.running = true;
    this.frame = requestAnimationFrame(this.tick);
  }

  pause() {
    this.enabled = false;
    this.running = false;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  tick() {
    if (!this.running) return;

    if (!this.reducedMotion) {
      const width = this.container.clientWidth || window.innerWidth;
      const height = this.container.clientHeight || window.innerHeight;
      const radius = Math.min(170, Math.max(110, width * 0.11));
      const radiusSquared = radius * radius;
      const time = performance.now() / 1000;
      const compact = width <= 900;
      const minX = 8;
      const maxX = Math.max(minX, width - 8);
      const minY = 16;
      const maxY = Math.max(minY, height - 68);
      const protectedAreas = this.getProtectedAreas();

      for (const item of this.items) {
        const rect = { width: item.width, height: item.height };
        const centerX = item.x + rect.width / 2;
        const centerY = item.y + rect.height / 2;
        let forceX = Math.sin(time * 0.23 + item.phase) * 0.012;
        let forceY = Math.cos(time * 0.19 + item.phase * 1.3) * 0.012;

        if (this.pointer.active) {
          const dx = centerX - this.pointer.x;
          const dy = centerY - this.pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared > 0.01 && distanceSquared < radiusSquared) {
            const distance = Math.sqrt(distanceSquared);
            const falloff = 1 - distance / radius;
            const strength = falloff * falloff * 0.16;
            forceX += (dx / distance) * strength;
            forceY += (dy / distance) * strength;
          }
        }

        for (const other of this.items) {
          if (other === item) continue;
          const dx = centerX - (other.x + other.width / 2);
          const dy = centerY - (other.y + other.height / 2);
          const overlapX = (rect.width + other.width) / 2 + 12 - Math.abs(dx);
          const overlapY = (rect.height + other.height) / 2 + 12 - Math.abs(dy);
          if (overlapX <= 0 || overlapY <= 0) continue;
          if (overlapX < overlapY) {
            forceX += Math.sign(dx || Math.sin(item.phase - other.phase)) * Math.min(0.16, overlapX * 0.012);
          } else {
            forceY += Math.sign(dy || Math.cos(item.phase - other.phase)) * Math.min(0.16, overlapY * 0.012);
          }
        }

        item.vx += forceX;
        item.vy += forceY;
        const speed = Math.hypot(item.vx, item.vy);
        const maxSpeed = item.speed * (compact ? 1.65 : 1.8);
        if (speed > maxSpeed) {
          item.vx = (item.vx / speed) * maxSpeed;
          item.vy = (item.vy / speed) * maxSpeed;
        }
        item.x += item.vx;
        item.y += item.vy;

        if (item.x < minX || item.x + rect.width > maxX) {
          item.x = Math.max(minX, Math.min(maxX - rect.width, item.x));
          item.vx *= -1;
        }
        if (item.y < minY || item.y + rect.height > maxY) {
          item.y = Math.max(minY, Math.min(maxY - rect.height, item.y));
          item.vy *= -1;
        }

        this.paint(item);
        this.updateKeywordVisibility(item, protectedAreas);
      }
    }

    this.frame = requestAnimationFrame(this.tick);
  }

  paint(item) {
    item.element.style.transform = `translate3d(${item.x.toFixed(2)}px, ${item.y.toFixed(2)}px, 0)`;
  }

  dispose() {
    this.pause();
    window.removeEventListener('pointermove', this.onPointerMove);
    window.removeEventListener('pointerleave', this.onPointerLeave);
    window.removeEventListener('pointerdown', this.onPointerDown);
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
  }
}
