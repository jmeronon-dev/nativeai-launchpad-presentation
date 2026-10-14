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
    this.frame = null;
    this.random = seededRandom(20261004);

    this.onPointerMove = this.onPointerMove.bind(this);
    this.onPointerLeave = this.onPointerLeave.bind(this);
    this.onPointerDown = this.onPointerDown.bind(this);
    this.onResize = this.onResize.bind(this);
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
      element.textContent = word;
      fragment.appendChild(element);

      const position = this.createHomePosition(index);
      this.items.push({
        element,
        homeXPct: position.x,
        homeYPct: position.y,
        homeX: 0,
        homeY: 0,
        x: 0,
        y: 0,
        vx: 0,
        vy: 0,
      });
    });
    this.container.appendChild(fragment);
    this.layout(true);
  }

  createHomePosition(index) {
    const band = index % 4;
    let x;
    let y;

    if (band === 0) {
      x = 8 + this.random() * 30;
      y = 8 + this.random() * 18;
    } else if (band === 1) {
      x = 64 + this.random() * 28;
      y = 12 + this.random() * 65;
    } else if (band === 2) {
      x = 10 + this.random() * 28;
      y = 72 + this.random() * 18;
    } else {
      x = 46 + this.random() * 30;
      y = 72 + this.random() * 17;
    }

    return { x, y };
  }

  bind() {
    window.addEventListener('pointermove', this.onPointerMove, { passive: true });
    window.addEventListener('pointerleave', this.onPointerLeave, { passive: true });
    window.addEventListener('pointerdown', this.onPointerDown, { passive: true });
    window.addEventListener('resize', this.onResize, { passive: true });
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

  layout(reset) {
    const width = this.container.clientWidth || window.innerWidth;
    const height = this.container.clientHeight || window.innerHeight;
    for (const item of this.items) {
      const rect = item.element.getBoundingClientRect();
      item.homeX = (item.homeXPct / 100) * width - rect.width / 2;
      item.homeY = (item.homeYPct / 100) * height - rect.height / 2;
      if (reset || this.reducedMotion) {
        item.x = item.homeX;
        item.y = item.homeY;
        item.vx = 0;
        item.vy = 0;
      }
      this.paint(item);
    }
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
    if (this.running || this.reducedMotion) return;
    this.running = true;
    this.frame = requestAnimationFrame(this.tick);
  }

  pause() {
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

      for (const item of this.items) {
        const rect = item.element.getBoundingClientRect();
        const centerX = item.x + rect.width / 2;
        const centerY = item.y + rect.height / 2;

        let forceX = (item.homeX - item.x) * 0.018;
        let forceY = (item.homeY - item.y) * 0.018;

        if (this.pointer.active) {
          const dx = centerX - this.pointer.x;
          const dy = centerY - this.pointer.y;
          const distanceSquared = dx * dx + dy * dy;
          if (distanceSquared > 0.01 && distanceSquared < radiusSquared) {
            const distance = Math.sqrt(distanceSquared);
            const falloff = 1 - distance / radius;
            const strength = falloff * falloff * 5.4;
            forceX += (dx / distance) * strength;
            forceY += (dy / distance) * strength;
          }
        }

        item.vx = (item.vx + forceX) * 0.88;
        item.vy = (item.vy + forceY) * 0.88;
        item.vx = Math.max(-8, Math.min(8, item.vx));
        item.vy = Math.max(-8, Math.min(8, item.vy));
        item.x += item.vx;
        item.y += item.vy;

        const maxDisplacement = Math.min(140, Math.max(70, width * 0.08));
        item.x = Math.max(item.homeX - maxDisplacement, Math.min(item.homeX + maxDisplacement, item.x));
        item.y = Math.max(item.homeY - maxDisplacement, Math.min(item.homeY + maxDisplacement, item.y));
        item.x = Math.max(-rect.width * 0.2, Math.min(width - rect.width * 0.8, item.x));
        item.y = Math.max(-rect.height * 0.2, Math.min(height - rect.height * 0.8, item.y));
        this.paint(item);
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
  }
}
