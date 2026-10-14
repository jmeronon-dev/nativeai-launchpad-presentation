import * as THREE from 'three';
import { gsap } from 'gsap';

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

function vectorFrom(values = [0, 0, 0]) {
  return new THREE.Vector3(values[0], values[1], values[2]);
}

function midpointWithLift(a, b, lift = 0.35) {
  return new THREE.Vector3().addVectors(a, b).multiplyScalar(0.5).add(new THREE.Vector3(0, lift, 0.45));
}

export class NeuralScene {
  constructor(canvas, presentation, { reducedMotion = false, onFallback = () => {} } = {}) {
    this.canvas = canvas;
    this.presentation = presentation;
    this.reducedMotion = reducedMotion;
    this.onFallback = onFallback;
    this.random = seededRandom(20261004);
    this.renderer = null;
    this.scene = null;
    this.camera = null;
    this.cameraTarget = new THREE.Vector3();
    this.networkGroup = null;
    this.nodes = [];
    this.nodeById = new Map();
    this.edges = [];
    this.pulses = [];
    this.pulsePositions = null;
    this.pulseGeometry = null;
    this.focusHalo = null;
    this.routeLine = null;
    this.routeMaterial = null;
    this.cameraTimeline = null;
    this.cameraTimelineResolve = null;
    this.pendingDestination = null;
    this.frame = null;
    this.running = false;
    this.lastTime = performance.now();
    this.elapsed = 0;
    this.focusHaloBaseScale = 0.9;
    this.focusHaloAutoPulse = true;
    this.tempVector = new THREE.Vector3();
    this.activeNodeId = null;
    this.isFallback = false;
    this.onContextLost = this.onContextLost.bind(this);

    this.overviewState = {
      position: vectorFrom(this.presentation.overviewCamera.position),
      target: vectorFrom(this.presentation.overviewCamera.target),
      fov: this.presentation.overviewCamera.fov,
    };
    this.updateOverviewState();

    this.tick = this.tick.bind(this);
    this.onResize = this.onResize.bind(this);
    this.onVisibilityChange = this.onVisibilityChange.bind(this);
  }

  init() {
    try {
      this.renderer = new THREE.WebGLRenderer({
        canvas: this.canvas,
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      });
      if (!this.renderer.getContext()) throw new Error('WebGL context unavailable');
    } catch (error) {
      console.warn('[NeuralScene] WebGL unavailable; using static fallback.', error);
      this.isFallback = true;
      this.onFallback(true);
      return false;
    }

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x060b10);
    this.scene.fog = new THREE.FogExp2(0x060b10, 0.05);

    this.camera = new THREE.PerspectiveCamera(
      this.overviewState.fov,
      window.innerWidth / Math.max(window.innerHeight, 1),
      0.05,
      80,
    );
    this.camera.position.copy(this.overviewState.position);
    this.cameraTarget.copy(this.overviewState.target);
    this.camera.lookAt(this.cameraTarget);

    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.setClearColor(0x060b10, 1);

    this.networkGroup = new THREE.Group();
    this.scene.add(this.networkGroup);

    this.buildNetwork();
    this.buildFocusHalo();
    this.buildRouteLine();
    this.configureRenderer();
    this.bind();

    if (this.reducedMotion) this.renderOnce();
    else this.start();

    return true;
  }

  bind() {
    window.addEventListener('resize', this.onResize, { passive: true });
    document.addEventListener('visibilitychange', this.onVisibilityChange);
    this.canvas.addEventListener('webglcontextlost', this.onContextLost);
  }

  onContextLost(event) {
    event.preventDefault();
    this.stop();
    this.isFallback = true;
    this.killCameraTimeline();
    this.onFallback(true);
  }

  buildNetwork() {
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const ambientCount = mobile ? 48 : 104;
    const pulseCount = mobile ? 10 : 22;

    for (const destination of this.presentation.nodes) {
      const node = {
        id: destination.id,
        position: vectorFrom(destination.position),
        isDestination: true,
        weight: destination.weight ?? 1.2,
        config: destination,
      };
      this.nodes.push(node);
      this.nodeById.set(node.id, node);
    }

    for (let index = 0; index < ambientCount; index += 1) {
      const angle = this.random() * Math.PI * 2;
      const radius = 1.15 + Math.pow(this.random(), 0.65) * 3.45;
      const x = Math.cos(angle) * radius + (this.random() - 0.5) * 0.7;
      const y = Math.sin(angle) * radius * 0.58 + (this.random() - 0.5) * 0.65;
      const z = (this.random() - 0.5) * 2.8;
      this.nodes.push({
        id: `ambient-${index}`,
        position: new THREE.Vector3(x, y, z),
        isDestination: false,
        weight: 0.72 + this.random() * 0.5,
        config: null,
      });
    }

    const geometry = new THREE.SphereGeometry(0.075, 10, 8);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.96,
      toneMapped: false,
    });
    this.nodeMesh = new THREE.InstancedMesh(geometry, material, this.nodes.length);
    this.nodeMesh.instanceMatrix.setUsage(THREE.StaticDrawUsage);

    const matrix = new THREE.Matrix4();
    const scale = new THREE.Vector3();
    const quaternion = new THREE.Quaternion();
    const ambientColor = new THREE.Color(0x1597e5);
    const destinationColor = new THREE.Color(0xc7f2ff);

    this.nodes.forEach((node, index) => {
      const size = node.isDestination ? 1.7 * node.weight : node.weight;
      scale.setScalar(size);
      matrix.compose(node.position, quaternion, scale);
      this.nodeMesh.setMatrixAt(index, matrix);
      this.nodeMesh.setColorAt(index, node.isDestination ? destinationColor : ambientColor);
    });
    this.nodeMesh.instanceMatrix.needsUpdate = true;
    if (this.nodeMesh.instanceColor) this.nodeMesh.instanceColor.needsUpdate = true;
    this.networkGroup.add(this.nodeMesh);

    this.edges = this.createEdges();
    const edgePositions = new Float32Array(this.edges.length * 6);
    this.edges.forEach((edge, index) => {
      edgePositions.set(edge.start.toArray(), index * 6);
      edgePositions.set(edge.end.toArray(), index * 6 + 3);
    });
    const edgeGeometry = new THREE.BufferGeometry();
    edgeGeometry.setAttribute('position', new THREE.BufferAttribute(edgePositions, 3));
    const edgeMaterial = new THREE.LineBasicMaterial({
      color: 0x1597e5,
      transparent: true,
      opacity: 0.28,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.edgeLines = new THREE.LineSegments(edgeGeometry, edgeMaterial);
    this.networkGroup.add(this.edgeLines);

    this.pulsePositions = new Float32Array(pulseCount * 3);
    this.pulseGeometry = new THREE.BufferGeometry();
    this.pulseGeometry.setAttribute('position', new THREE.BufferAttribute(this.pulsePositions, 3));
    const pulseMaterial = new THREE.PointsMaterial({
      color: 0xc7f2ff,
      size: mobile ? 0.065 : 0.075,
      sizeAttenuation: true,
      transparent: true,
      opacity: 0.92,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.pulsePoints = new THREE.Points(this.pulseGeometry, pulseMaterial);
    this.networkGroup.add(this.pulsePoints);

    for (let index = 0; index < pulseCount; index += 1) {
      this.pulses.push({
        edgeIndex: Math.floor(this.random() * this.edges.length),
        progress: this.random(),
        speed: 0.09 + this.random() * 0.18,
      });
    }
    this.updatePulses(0);
  }

  createEdges() {
    const edgeMap = new Map();
    const nearestCount = 3;

    this.nodes.forEach((node, index) => {
      const nearest = this.nodes
        .map((other, otherIndex) => ({
          otherIndex,
          distance: index === otherIndex ? Number.POSITIVE_INFINITY : node.position.distanceToSquared(other.position),
        }))
        .sort((a, b) => a.distance - b.distance)
        .slice(0, nearestCount);

      for (const entry of nearest) {
        const low = Math.min(index, entry.otherIndex);
        const high = Math.max(index, entry.otherIndex);
        const key = `${low}:${high}`;
        if (!edgeMap.has(key)) {
          edgeMap.set(key, {
            start: this.nodes[low].position.clone(),
            end: this.nodes[high].position.clone(),
            startIndex: low,
            endIndex: high,
          });
        }
      }
    });

    const destinations = this.presentation.nodes;
    for (let index = 0; index < destinations.length - 1; index += 1) {
      const fromIndex = this.nodes.findIndex((node) => node.id === destinations[index].id);
      const toIndex = this.nodes.findIndex((node) => node.id === destinations[index + 1].id);
      const low = Math.min(fromIndex, toIndex);
      const high = Math.max(fromIndex, toIndex);
      const key = `${low}:${high}`;
      if (!edgeMap.has(key) && low >= 0 && high >= 0) {
        edgeMap.set(key, {
          start: this.nodes[low].position.clone(),
          end: this.nodes[high].position.clone(),
          startIndex: low,
          endIndex: high,
        });
      }
    }

    const connected = new Set([0]);
    const flood = () => {
      let changed = true;
      while (changed) {
        changed = false;
        for (const edge of edgeMap.values()) {
          if (connected.has(edge.startIndex) && !connected.has(edge.endIndex)) { connected.add(edge.endIndex); changed = true; }
          if (connected.has(edge.endIndex) && !connected.has(edge.startIndex)) { connected.add(edge.startIndex); changed = true; }
        }
      }
    };
    flood();
    while (connected.size < this.nodes.length) {
      const missing = this.nodes.findIndex((_, index) => !connected.has(index));
      const nearest = [...connected].sort((left, right) => this.nodes[left].position.distanceToSquared(this.nodes[missing].position) - this.nodes[right].position.distanceToSquared(this.nodes[missing].position))[0];
      edgeMap.set(`${nearest}:${missing}`, { start: this.nodes[nearest].position.clone(), end: this.nodes[missing].position.clone(), startIndex: nearest, endIndex: missing });
      flood();
    }
    return [...edgeMap.values()];
  }

  buildFocusHalo() {
    const texture = this.createGlowTexture();
    const material = new THREE.SpriteMaterial({
      map: texture,
      color: 0x67d4ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      depthTest: false,
      toneMapped: false,
    });
    this.focusHalo = new THREE.Sprite(material);
    this.focusHalo.scale.set(0.9, 0.9, 0.9);
    this.focusHalo.visible = false;
    this.scene.add(this.focusHalo);
  }

  createGlowTexture() {
    const canvas = document.createElement('canvas');
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext('2d');
    const gradient = context.createRadialGradient(64, 64, 4, 64, 64, 62);
    gradient.addColorStop(0, 'rgba(255,255,255,1)');
    gradient.addColorStop(0.14, 'rgba(199,242,255,0.95)');
    gradient.addColorStop(0.42, 'rgba(103,212,255,0.35)');
    gradient.addColorStop(1, 'rgba(103,212,255,0)');
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    const texture = new THREE.CanvasTexture(canvas);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }

  buildRouteLine() {
    const geometry = new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(),
      new THREE.Vector3(),
      new THREE.Vector3(),
    ]);
    this.routeMaterial = new THREE.LineBasicMaterial({
      color: 0x67d4ff,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      toneMapped: false,
    });
    this.routeLine = new THREE.Line(geometry, this.routeMaterial);
    this.routeLine.visible = false;
    this.scene.add(this.routeLine);
  }

  configureRenderer() {
    const mobile = window.matchMedia('(max-width: 720px)').matches;
    const cap = mobile ? 1.2 : 1.65;
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, cap));
    this.renderer.setSize(window.innerWidth, window.innerHeight, false);
  }

  updateOverviewState() {
    const mobile = window.matchMedia('(max-width: 560px)').matches;
    this.overviewState.position.copy(vectorFrom(mobile ? [0, 4, 24] : this.presentation.overviewCamera.position));
    this.overviewState.target.copy(vectorFrom(mobile ? [0, 4, 0] : this.presentation.overviewCamera.target));
  }

  onResize() {
    if (this.isFallback || !this.renderer || !this.camera) return;
    this.camera.aspect = window.innerWidth / Math.max(window.innerHeight, 1);
    this.camera.updateProjectionMatrix();
    this.configureRenderer();
    this.updateOverviewState();
    if (!this.cameraTimeline) this.setCameraImmediate(this.activeNodeId ? this.getNodeState(this.activeNodeId) : this.overviewState);
    this.renderOnce();
  }


  onVisibilityChange() {
    if (document.hidden) this.stop();
    else if (this.reducedMotion) this.renderOnce();
    else this.start();
  }

  start() {
    if (this.running || this.isFallback || this.reducedMotion) return;
    this.running = true;
    this.lastTime = performance.now();
    this.frame = requestAnimationFrame(this.tick);
  }

  stop() {
    this.running = false;
    if (this.frame) cancelAnimationFrame(this.frame);
    this.frame = null;
  }

  tick(now) {
    if (!this.running) return;
    const delta = Math.min((now - this.lastTime) / 1000, 0.05);
    this.lastTime = now;
    this.elapsed += delta;

    this.updatePulses(delta);

    if (this.focusHalo?.visible && this.focusHaloAutoPulse) {
      const pulse = 1 + Math.sin(this.elapsed * 2.6) * 0.08;
      this.focusHalo.scale.setScalar(this.focusHaloBaseScale * pulse);
      this.focusHalo.material.opacity = 0.68 + Math.sin(this.elapsed * 2.2) * 0.08;
    }

    this.renderOnce();
    this.frame = requestAnimationFrame(this.tick);
  }

  updatePulses(delta) {
    if (!this.edges.length || !this.pulseGeometry) return;
    for (let index = 0; index < this.pulses.length; index += 1) {
      const pulse = this.pulses[index];
      pulse.progress += delta * pulse.speed;
      if (pulse.progress >= 1) {
        pulse.progress %= 1;
        pulse.edgeIndex = Math.floor(this.random() * this.edges.length);
        pulse.speed = 0.09 + this.random() * 0.18;
      }
      const edge = this.edges[pulse.edgeIndex];
      const eased = pulse.progress * pulse.progress * (3 - 2 * pulse.progress);
      this.tempVector.lerpVectors(edge.start, edge.end, eased);
      this.pulsePositions[index * 3] = this.tempVector.x;
      this.pulsePositions[index * 3 + 1] = this.tempVector.y;
      this.pulsePositions[index * 3 + 2] = this.tempVector.z;
    }
    this.pulseGeometry.attributes.position.needsUpdate = true;
  }

  renderOnce() {
    if (this.isFallback || !this.renderer || !this.scene || !this.camera) return;
    this.camera.lookAt(this.cameraTarget);
    this.renderer.render(this.scene, this.camera);
  }

  getNodeState(nodeId) {
    const node = this.nodeById.get(nodeId);
    if (!node) throw new Error(`Unknown destination node: ${nodeId}`);
    const config = node.config ?? {};
    const mobile = window.matchMedia('(max-width: 560px)').matches;
    const cameraOffset = vectorFrom(mobile ? [0, 0, 5.6] : config.cameraOffset ?? [0, 0, 2.2]);
    const targetOffset = vectorFrom(mobile ? [0, 0, 0] : config.lookAtOffset ?? [0, 0, 0]);
    return {
      position: node.position.clone().add(cameraOffset),
      target: node.position.clone().add(targetOffset),
      fov: config.fov ?? 38,
    };
  }

  setActiveNode(nodeId) {
    this.activeNodeId = nodeId;
    if (this.isFallback || !this.focusHalo) return;
    const node = this.nodeById.get(nodeId);
    if (!node) {
      this.focusHalo.visible = false;
      return;
    }
    this.focusHalo.position.copy(node.position);
    this.focusHalo.visible = true;
    this.focusHaloAutoPulse = true;
    this.focusHalo.material.opacity = 0.72;
    this.focusHaloBaseScale = 0.9 * (node.weight ?? 1);
    this.focusHalo.scale.setScalar(this.focusHaloBaseScale);
    this.renderOnce();
  }

  setRoute(fromNodeId, toNodeId, visible = true) {
    if (this.isFallback || !this.routeLine) return;
    const from = fromNodeId ? this.nodeById.get(fromNodeId)?.position : this.overviewState.target;
    const to = this.nodeById.get(toNodeId)?.position;
    if (!from || !to) {
      this.routeLine.visible = false;
      return;
    }
    const points = [from.clone(), midpointWithLift(from, to), to.clone()];
    this.routeLine.geometry.setFromPoints(points);
    this.routeLine.visible = visible;
    this.routeMaterial.opacity = visible ? 0.52 : 0;
  }

  setCameraImmediate(state) {
    if (this.isFallback || !this.camera) return;
    this.camera.position.copy(state.position);
    this.cameraTarget.copy(state.target);
    this.camera.fov = state.fov;
    this.camera.updateProjectionMatrix();
    this.renderOnce();
  }

  setOverviewImmediate() {
    this.killCameraTimeline();
    this.pendingDestination = null;
    this.setCameraImmediate(this.overviewState);
    this.setActiveNode(null);
    if (this.routeLine) this.routeLine.visible = false;
  }

  setNodeImmediate(nodeId) {
    this.killCameraTimeline();
    this.pendingDestination = null;
    this.setActiveNode(nodeId);
    if (this.isFallback) return;
    this.setCameraImmediate(this.getNodeState(nodeId));
    if (this.routeLine) this.routeLine.visible = false;
  }

  addCameraSegment(timeline, state, duration, position, ease = 'power3.inOut') {
    timeline.to(
      this.camera.position,
      { x: state.position.x, y: state.position.y, z: state.position.z, duration, ease },
      position,
    );
    timeline.to(
      this.cameraTarget,
      { x: state.target.x, y: state.target.y, z: state.target.z, duration, ease },
      position,
    );
    timeline.to(
      this.camera,
      {
        fov: state.fov,
        duration,
        ease,
        onUpdate: () => this.camera.updateProjectionMatrix(),
      },
      position,
    );
  }

  timelinePromise(build) {
    this.killCameraTimeline();
    return new Promise((resolve, reject) => {
      let settled = false;
      const settle = () => {
        if (settled) return;
        settled = true;
        this.cameraTimeline = null;
        this.cameraTimelineResolve = null;
        this.renderOnce();
        resolve();
      };

      const timeline = gsap.timeline({
        onUpdate: () => this.renderOnce(),
        onComplete: () => {
          this.pendingDestination = null;
          settle();
        },
        onInterrupt: settle,
      });
      this.cameraTimeline = timeline;
      this.cameraTimelineResolve = settle;

      try {
        build(timeline);
      } catch (error) {
        settled = true;
        timeline.kill();
        this.cameraTimeline = null;
        this.cameraTimelineResolve = null;
        reject(error);
      }
    });
  }

  transitionOverviewToNode(nodeId) {
    if (this.isFallback) { this.setActiveNode(nodeId); return Promise.resolve(); }
    if (this.reducedMotion) {
      this.setNodeImmediate(nodeId);
      return Promise.resolve();
    }

    const target = this.getNodeState(nodeId);
    this.pendingDestination = { type: 'node', nodeId };
    this.setRoute(null, nodeId, true);
    this.setActiveNode(nodeId);
    this.routeMaterial.opacity = 0;

    return this.timelinePromise((timeline) => {
      timeline.to(this.routeMaterial, { opacity: 0.58, duration: 0.28, ease: 'power2.out' }, 0);
      this.addCameraSegment(timeline, target, 1.18, 0.1, 'power3.inOut');
      timeline.to(this.routeMaterial, { opacity: 0, duration: 0.24, ease: 'power2.in' }, 0.92);
      timeline.call(() => {
        this.routeLine.visible = false;
      });
    });
  }

  transitionNodeToNode(fromNodeId, toNodeId) {
    if (this.isFallback) { this.setActiveNode(toNodeId); return Promise.resolve(); }
    if (this.reducedMotion) {
      this.setNodeImmediate(toNodeId);
      return Promise.resolve();
    }

    const target = this.getNodeState(toNodeId);
    this.pendingDestination = { type: 'node', nodeId: toNodeId };
    this.setRoute(fromNodeId, toNodeId, true);
    this.routeMaterial.opacity = 0.18;

    return this.timelinePromise((timeline) => {
      this.addCameraSegment(timeline, this.overviewState, 0.82, 0, 'power2.inOut');
      timeline.to(this.routeMaterial, { opacity: 0.58, duration: 0.32, ease: 'power2.out' }, 0.52);
      timeline.call(() => this.setActiveNode(toNodeId), [], 0.68);
      this.addCameraSegment(timeline, target, 1.04, 0.94, 'power3.inOut');
      timeline.to(this.routeMaterial, { opacity: 0, duration: 0.24, ease: 'power2.in' }, 1.7);
      timeline.call(() => {
        this.routeLine.visible = false;
      });
    });
  }

  transitionNodeToOverview(_fromNodeId) {
    if (this.isFallback) { this.setActiveNode(null); return Promise.resolve(); }
    if (this.reducedMotion) {
      this.setOverviewImmediate();
      return Promise.resolve();
    }

    this.pendingDestination = { type: 'overview' };
    this.focusHaloAutoPulse = false;
    return this.timelinePromise((timeline) => {
      this.addCameraSegment(timeline, this.overviewState, 0.9, 0, 'power2.inOut');
      timeline.to(this.focusHalo.material, { opacity: 0, duration: 0.35 }, 0.5);
      timeline.call(() => {
        this.focusHalo.visible = false;
        this.focusHaloAutoPulse = true;
        this.activeNodeId = null;
      });
    });
  }

  setReducedMotion(value) {
    this.reducedMotion = value;
    if (value) {
      const pending = this.pendingDestination;
      this.killCameraTimeline();
      this.stop();
      if (pending?.type === 'node') this.setNodeImmediate(pending.nodeId);
      else if (pending?.type === 'overview') this.setOverviewImmediate();
      else this.renderOnce();
    } else if (!document.hidden) {
      this.start();
    }
  }

  killCameraTimeline() {
    const timeline = this.cameraTimeline;
    const resolve = this.cameraTimelineResolve;
    this.cameraTimeline = null;
    this.cameraTimelineResolve = null;
    timeline?.kill();
    resolve?.();
  }

  disposeMaterial(material) {
    if (!material) return;
    if (material.map) material.map.dispose();
    material.dispose();
  }

  dispose() {
    this.stop();
    this.killCameraTimeline();
    window.removeEventListener('resize', this.onResize);
    document.removeEventListener('visibilitychange', this.onVisibilityChange);
    this.canvas.removeEventListener('webglcontextlost', this.onContextLost);

    if (this.scene) {
      this.scene.traverse((object) => {
        object.geometry?.dispose?.();
        if (Array.isArray(object.material)) object.material.forEach((material) => this.disposeMaterial(material));
        else this.disposeMaterial(object.material);
      });
    }

    this.renderer?.dispose();
    this.renderer?.forceContextLoss?.();
  }
}
