#!/usr/bin/env node

import fs from 'node:fs/promises';
import path from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const targetDirectory = path.resolve(process.argv[2] ?? 'assets/starter');
const errors = [];
const warnings = [];

const fail = (message) => errors.push(message);
const warn = (message) => warnings.push(message);
const isNonEmptyString = (value) => typeof value === 'string' && value.trim().length > 0;
const isFiniteVector3 = (value) =>
  Array.isArray(value) && value.length === 3 && value.every((entry) => Number.isFinite(entry));
const validId = (value) => typeof value === 'string' && /^[a-z0-9][a-z0-9-]*$/.test(value);

async function readText(relativePath) {
  const filePath = path.join(targetDirectory, relativePath);
  try {
    return await fs.readFile(filePath, 'utf8');
  } catch {
    fail(`Missing required file: ${relativePath}`);
    return '';
  }
}

function validateCamera(camera, label) {
  if (!camera || typeof camera !== 'object') {
    fail(`${label} must be an object.`);
    return;
  }
  if (!isFiniteVector3(camera.position)) fail(`${label}.position must contain three finite numbers.`);
  if (!isFiniteVector3(camera.target)) fail(`${label}.target must contain three finite numbers.`);
  if (!Number.isFinite(camera.fov) || camera.fov < 20 || camera.fov > 90) {
    fail(`${label}.fov must be between 20 and 90.`);
  }
}

function validatePresentation(presentation) {
  if (!presentation || typeof presentation !== 'object') {
    fail('src/content.js must export a presentation object.');
    return;
  }

  if (!isNonEmptyString(presentation.meta?.title)) fail('meta.title is required.');
  if (!isNonEmptyString(presentation.meta?.language)) fail('meta.language is required.');
  validateCamera(presentation.overviewCamera, 'overviewCamera');

  if (!Array.isArray(presentation.keywords) || presentation.keywords.length < 3 || presentation.keywords.length > 24) {
    fail('keywords must contain between 3 and 24 entries.');
  } else {
    presentation.keywords.forEach((word, index) => {
      if (!isNonEmptyString(word)) fail(`keywords[${index}] must be a non-empty string.`);
    });
    if (new Set(presentation.keywords.map((word) => word.trim().toLowerCase())).size !== presentation.keywords.length) {
      warn('keywords contains duplicate labels.');
    }
  }

  if (!Array.isArray(presentation.nodes) || presentation.nodes.length === 0) {
    fail('nodes must contain at least one destination node.');
    return;
  }
  if (!Array.isArray(presentation.slides) || presentation.slides.length === 0) {
    fail('slides must contain at least one slide.');
    return;
  }

  const nodeIds = new Set();
  for (const [index, node] of presentation.nodes.entries()) {
    const label = `nodes[${index}]`;
    if (!validId(node?.id)) fail(`${label}.id must be lowercase, URL-safe, and hyphenated when needed.`);
    if (nodeIds.has(node?.id)) fail(`Duplicate node id: ${node?.id}`);
    nodeIds.add(node?.id);
    if (!isFiniteVector3(node?.position)) fail(`${label}.position must contain three finite numbers.`);
    if (node?.cameraOffset !== undefined && !isFiniteVector3(node.cameraOffset)) {
      fail(`${label}.cameraOffset must contain three finite numbers.`);
    }
    if (node?.lookAtOffset !== undefined && !isFiniteVector3(node.lookAtOffset)) {
      fail(`${label}.lookAtOffset must contain three finite numbers.`);
    }
    if (node?.fov !== undefined && (!Number.isFinite(node.fov) || node.fov < 20 || node.fov > 90)) {
      fail(`${label}.fov must be between 20 and 90.`);
    }
  }

  const allowedLayouts = new Set(['statement', 'split', 'process', 'data', 'comparison', 'case-study', 'closing']);
  const slideIds = new Set();
  const orders = new Set();
  const nodeUsage = new Map();

  for (const [index, slide] of presentation.slides.entries()) {
    const label = `slides[${index}]`;
    if (!validId(slide?.id)) fail(`${label}.id must be lowercase, URL-safe, and hyphenated when needed.`);
    if (slideIds.has(slide?.id)) fail(`Duplicate slide id: ${slide?.id}`);
    slideIds.add(slide?.id);

    if (!validId(slide?.nodeId)) fail(`${label}.nodeId must be a URL-safe id.`);
    if (!nodeIds.has(slide?.nodeId)) fail(`${label}.nodeId references an unknown node: ${slide?.nodeId}`);
    nodeUsage.set(slide?.nodeId, (nodeUsage.get(slide?.nodeId) ?? 0) + 1);

    if (!Number.isInteger(slide?.order) || slide.order < 1) fail(`${label}.order must be an integer starting at 1.`);
    if (orders.has(slide?.order)) fail(`Duplicate slide order: ${slide?.order}`);
    orders.add(slide?.order);

    if (!allowedLayouts.has(slide?.layout)) fail(`${label}.layout is not supported: ${slide?.layout}`);
    if (!isNonEmptyString(slide?.title)) fail(`${label}.title is required.`);
    if ((slide?.title?.length ?? 0) > 110) warn(`${label}.title is longer than 110 characters.`);

    if (slide?.body !== undefined && !isNonEmptyString(slide.body) && !Array.isArray(slide.body)) {
      fail(`${label}.body must be a string or an array of strings.`);
    }
    if (Array.isArray(slide?.body)) {
      if (slide.body.length > 6) warn(`${label}.body contains more than six bullets.`);
      slide.body.forEach((item, itemIndex) => {
        if (!isNonEmptyString(item)) fail(`${label}.body[${itemIndex}] must be a non-empty string.`);
      });
    }
    if (Array.isArray(slide?.metrics) && slide.metrics.length > 4) {
      fail(`${label}.metrics may contain at most four metrics.`);
    }
    if (slide?.layout === 'process' && (!Array.isArray(slide.steps) || slide.steps.length < 2)) {
      warn(`${label} uses the process layout without at least two steps.`);
    }
  }

  const expectedOrders = presentation.slides.map((_, index) => index + 1);
  for (const order of expectedOrders) {
    if (!orders.has(order)) fail(`Slide order must be contiguous; missing order ${order}.`);
  }

  for (const nodeId of nodeIds) {
    const count = nodeUsage.get(nodeId) ?? 0;
    if (count === 0) fail(`Destination node is not mapped to a slide: ${nodeId}`);
    if (count > 1) fail(`Destination node is mapped to more than one slide: ${nodeId}`);
  }
}

async function main() {
  const requiredFiles = [
    'index.html',
    'package.json',
    'vite.config.js',
    'src/content.js',
    'src/main.js',
    'src/deck-controller.js',
    'src/keyword-field.js',
    'src/neural-scene.js',
    'src/styles.css',
    'src/ui.js',
  ];

  await Promise.all(requiredFiles.map((file) => readText(file)));

  const packageText = await readText('package.json');
  if (packageText) {
    try {
      const packageJson = JSON.parse(packageText);
      for (const dependency of ['three', 'gsap']) {
        if (!packageJson.dependencies?.[dependency]) fail(`package.json must include ${dependency}.`);
      }
      if (!packageJson.scripts?.build) fail('package.json must include a build script.');
    } catch (error) {
      fail(`package.json is invalid JSON: ${error.message}`);
    }
  }

  const indexHtml = await readText('index.html');
  if (indexHtml) {
    if (!indexHtml.includes('id="brand-logo"')) fail('index.html must include the fixed brand-logo hook.');
    if (!indexHtml.includes('id="neural-canvas"')) fail('index.html must include the neural-canvas hook.');
    if (!indexHtml.includes('id="keyword-field"')) fail('index.html must include the keyword-field hook.');
    if (!indexHtml.includes('id="slide-stage"')) fail('index.html must include the slide-stage hook.');
  }

  const css = await readText('src/styles.css');
  if (css) {
    if (!css.includes('--ntt-blue: #0072bc')) fail('The verified NTT Blue token (#0072BC) is missing.');
    if (!/@media\s*\(prefers-reduced-motion:\s*reduce\)/.test(css)) {
      fail('A prefers-reduced-motion CSS mode is required.');
    }
    if (!/@media\s+print/.test(css)) fail('A print stylesheet is required.');
    if (!/\.brand-lockup\s*\{[\s\S]*?position:\s*fixed/.test(css)) {
      fail('.brand-lockup must remain fixed outside animated slide content.');
    }
  }

  const contentFile = path.join(targetDirectory, 'src/content.js');
  try {
    const moduleUrl = `${pathToFileURL(contentFile).href}?validation=${Date.now()}`;
    const module = await import(moduleUrl);
    validatePresentation(module.presentation);
  } catch (error) {
    fail(`Unable to import src/content.js: ${error.message}`);
  }

  for (const message of warnings) console.warn(`WARN  ${message}`);
  for (const message of errors) console.error(`ERROR ${message}`);

  if (errors.length > 0) {
    console.error(`\nValidation failed with ${errors.length} error(s) and ${warnings.length} warning(s).`);
    process.exitCode = 1;
    return;
  }

  console.log(`Validation passed for ${targetDirectory}`);
  console.log(`0 errors, ${warnings.length} warning(s).`);
}

await main();
