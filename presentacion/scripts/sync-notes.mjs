import { readFile, writeFile } from 'node:fs/promises';
import { marked } from 'marked';

const source = await readFile(new URL('../../CONTENIDO-PRESENTACION.md', import.meta.url), 'utf8');
const sections = [];
let current = null;
for (const token of marked.lexer(source)) {
  if (token.type === 'heading' && token.depth === 2) {
    if (/^\d+\./.test(token.text)) {
      current = { title: token.text, markdown: token.raw };
      sections.push(current);
    } else {
      current = null;
    }
  } else if (current) {
    current.markdown += token.raw;
  }
}
if (sections.length !== 10) throw new Error(`Se esperaban 10 bloques numerados en CONTENIDO-PRESENTACION.md; hay ${sections.length}.`);
await writeFile(new URL('../src/notes.json', import.meta.url), JSON.stringify(sections, null, 2) + '\n');
console.log(`Notas sincronizadas desde CONTENIDO-PRESENTACION.md: ${sections.length} bloques.`);