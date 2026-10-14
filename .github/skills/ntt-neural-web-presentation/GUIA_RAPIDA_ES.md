# Guía rápida · NTT Neural Web Presentation

Esta skill crea presentaciones HTML inmersivas en las que una red neuronal persistente funciona como espacio de navegación. La portada muestra conceptos flotantes que reaccionan al puntero; cada slide está vinculada a una neurona; y el cambio de sección se realiza mediante una secuencia de cámara `zoom-out → vista de red → zoom-in`.

## 1. Instalar la skill

Copia la carpeta completa `ntt-neural-web-presentation` en la ubicación de skills admitida por tu agente. El archivo raíz `SKILL.md` debe conservarse junto con `references/`, `assets/`, `scripts/` y `tests/`.

No copies únicamente `SKILL.md`: la arquitectura, los criterios visuales, el esquema de contenido, el starter y las validaciones están distribuidos en los archivos de soporte.

## 2. Invocarla

Prompt base recomendado:

```text
Usa la skill ntt-neural-web-presentation para crear una presentación HTML inmersiva.

Tema: [tema]
Audiencia: [audiencia]
Objetivo o decisión esperada: [objetivo]
Número aproximado de slides: [número]
Conceptos flotantes de portada: [lista]
Contenido disponible: [resumen o archivos]
Idioma: [idioma]
Entrega: proyecto ejecutable y build estático

Mantén una red neuronal persistente como mapa narrativo. La portada debe reaccionar al ratón; cada slide debe corresponder a una neurona; entre slides debe verse el recorrido zoom-out → red → zoom-in. Utiliza NTT Blue #0072BC y deja el logo oficial de NTT DATA fijo abajo a la derecha, fuera de cualquier contenedor animado.
```

## 3. Flujo que seguirá la skill

1. Define audiencia, mensaje central, duración y restricciones técnicas.
2. Diseña una única columna vertebral narrativa.
3. Asigna cada idea principal a una neurona destino.
4. Construye una escena Three.js persistente y una capa HTML semántica.
5. Orquesta la cámara y las entradas de contenido con GSAP.
6. Añade navegación por teclado, botones, táctil, URL y progreso.
7. Implementa `prefers-reduced-motion`, fallback sin WebGL y vista de impresión.
8. Ejecuta la validación estructural y documenta la revisión visual.

## 4. Editar el starter incluido

```bash
cd assets/starter
npm install
npm run dev
```

El contenido editable está centralizado en:

```text
assets/starter/src/content.js
```

Ahí se definen:

- metadatos de portada;
- conceptos flotantes;
- neuronas destino;
- posición y encuadre de cámara por neurona;
- slides, orden, layouts y notas.

## 5. Añadir el logo aprobado

Coloca el SVG corporativo vigente en:

```text
assets/starter/public/brand/ntt-data-logo.svg
```

El sistema ya mantiene ese elemento fijo abajo a la derecha durante portada, navegación y slides. La palabra `NTT DATA` que aparece cuando el SVG no existe es solamente un fallback técnico de desarrollo y no sustituye al logotipo oficial.

## 6. Validar

Desde la raíz de la skill:

```bash
node scripts/validate-deck.mjs assets/starter
```

O desde el starter:

```bash
npm run validate
npm run build
```

Antes de publicar, revisa al menos 1920×1080, 1366×768 y 390×844; navegación rápida; teclado; reducción de movimiento; fallback sin WebGL; impresión; y permanencia del logo dentro del viewport.

## 7. Archivos principales

| Ruta | Propósito |
| --- | --- |
| `SKILL.md` | Orquestación completa de la skill |
| `references/product-brief.md` | Contrato de experiencia |
| `references/architecture.md` | Arquitectura técnica y estados |
| `references/brand-and-art-direction.md` | Identidad, composición y tokens |
| `references/motion-system.md` | Física de conceptos y coreografía de cámara |
| `references/content-model.md` | Modelo slide ↔ neurona |
| `references/accessibility-performance.md` | Accesibilidad y rendimiento |
| `references/qa-and-acceptance.md` | Criterios de aceptación |
| `assets/starter/` | Proyecto HTML funcional de partida |
| `assets/presentation.schema.json` | Contrato de datos |
| `scripts/validate-deck.mjs` | Validación determinista |
| `tests/evals.json` | Casos de activación y calidad de la skill |
