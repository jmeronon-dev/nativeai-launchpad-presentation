# Informe de validación

**Paquete:** `ntt-neural-web-presentation`  
**Fecha:** 2026-10-04  
**Alcance:** skill, esquema, starter y validador

## Comprobaciones ejecutadas

Se han ejecutado correctamente:

```bash
node --check assets/starter/src/*.js
node --check assets/starter/vite.config.js
node --check scripts/validate-deck.mjs
node scripts/validate-deck.mjs assets/starter
npm run validate
```

Resultado del validador:

```text
Validation passed: assets/starter (0 errors, 0 warnings).
```

También se verificó que:

- `tests/evals.json` es JSON válido;
- `assets/presentation.schema.json` es JSON válido;
- todos los IDs de slide son únicos;
- todos los IDs de neurona son únicos;
- cada slide apunta a una neurona existente;
- el orden de slides es contiguo;
- existe soporte declarado para reducción de movimiento, fallback sin WebGL e impresión;
- el logo se encuentra fuera de los contenedores animados de portada y slides;
- la navegación implementa portada, siguiente, anterior, deep links y cola de comandos;
- el contenido esencial se renderiza como HTML semántico y no dentro del canvas.

## Comprobaciones no ejecutadas en este entorno

No se pudo completar `npm install` ni, por tanto, `npm run build`, porque el entorno de ejecución no pudo resolver el registro npm. La navegación local en navegador automatizado también fue bloqueada por la política administrativa del sandbox.

En consecuencia, este informe **no declara todavía la presentación como lista para producción**. Antes de publicar debe ejecutarse en un entorno con acceso a npm:

```bash
cd assets/starter
npm install
npm run validate
npm run build
npm run preview
```

Y debe completarse la revisión visual definida en `references/qa-and-acceptance.md`, incluyendo:

- 1920×1080, 1366×768, 1440×900, 390×844 y 412×915;
- Chrome/Edge actual y Safari actual cuando corresponda;
- al menos una transición completa neurona → overview → neurona;
- navegación rápida y redimensionado;
- teclado, foco y lector de pantalla básico;
- `prefers-reduced-motion`;
- fallback sin WebGL;
- impresión/PDF;
- recurso oficial de logo y su clear space.

## Elemento pendiente de marca

El SVG oficial de NTT DATA no se incluye en el paquete. Debe añadirse un recurso aprobado por la organización en:

```text
assets/starter/public/brand/ntt-data-logo.svg
```

El fallback textual incorporado solo sirve para desarrollo y nunca debe presentarse como sustituto del logotipo corporativo.
