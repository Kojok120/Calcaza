#!/usr/bin/env node
/**
 * Phase 1 — H2 variation.
 * Assign each calculator (by hash(slug) % 4) to one of 4 H2 label sets.
 * Rewrite the 6 standard-slot H2s in calculators/*\/content.mdx only.
 * Body untouched, extra H2s untouched.
 */
import { promises as fs } from 'fs';
import path from 'path';
import { createHash } from 'crypto';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const CALC_DIR = path.join(ROOT, 'calculators');

// 6 slot keys -> 4 label sets
const LABEL_SETS = {
  A: [
    'Qué calcula esta herramienta',
    'Cómo funciona el cálculo',
    'Cómo llenar los campos',
    'Ejemplos prácticos',
    'Errores comunes',
    'Calculadoras relacionadas',
  ],
  B: [
    'Situaciones más frecuentes',
    'Datos de entrada y supuestos',
    'Comparación de escenarios',
    'Trasfondo de la regla',
    'Puntos a tener en cuenta',
    'Otras calculadoras útiles',
  ],
  C: [
    'Tres casos típicos primero',
    'Qué ingresar y dónde',
    'La lógica del cálculo',
    'Fuente oficial',
    'Errores que se evitan',
    'Calculadoras relacionadas',
  ],
  D: [
    'Identifica tu caso',
    'Campos que requieren atención',
    'De dónde salen los números',
    'Cómo interpretar el resultado',
    'Confusiones frecuentes',
    'Calculadoras del mismo tema',
  ],
};

const SET_KEYS = ['A', 'B', 'C', 'D'];

// Slot semantic detectors (regex against the heading text, case-insensitive).
// Each H2 line is matched in order; first matching slot wins.
const SLOT_DETECTORS = [
  // 0: ¿Qué calcula? / Resumen
  {
    slot: 0,
    re: /^(?:¿?qué calcula|qué calcula|que calcula|para qué sirve|resumen)/i,
  },
  // 1: De dónde / fórmula / fuentes
  {
    slot: 1,
    re: /^(?:de dónde|de donde|la fórmula|las? fórmulas?|fuentes? oficial|fuente oficial|fuentes? \(|cómo funciona\b|como funciona\b)/i,
  },
  // 2: Cómo llenar / leer los campos
  {
    slot: 2,
    re: /^(?:cómo llenar|como llenar|cómo leer|como leer|campos|cómo se calcula\b)/i,
  },
  // 3: Ejemplos
  {
    slot: 3,
    re: /^(?:tres ejemplos|ejemplos prácticos|ejemplos resueltos|casos prácticos|ejemplos numéricos)/i,
  },
  // 4: Errores comunes
  {
    slot: 4,
    re: /^(?:errores comunes|errores que|confusiones|errores al)/i,
  },
  // 5: Relacionadas
  {
    slot: 5,
    re: /^(?:calculadoras relacionadas|también le puede interesar|tambien le puede interesar|otras calculadoras)/i,
  },
];

function hashSlug(slug) {
  const h = createHash('md5').update(slug).digest();
  return h.readUInt32BE(0);
}

function pickSet(slug) {
  return SET_KEYS[hashSlug(slug) % 4];
}

function rewriteContent(slug, mdx) {
  const setKey = pickSet(slug);
  const labels = LABEL_SETS[setKey];
  const lines = mdx.split('\n');
  const usedSlots = new Set();
  let changes = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const m = line.match(/^##\s+(.+?)\s*$/);
    if (!m) continue;
    const heading = m[1].trim();
    let matchedSlot = -1;
    for (const det of SLOT_DETECTORS) {
      if (det.re.test(heading)) {
        matchedSlot = det.slot;
        break;
      }
    }
    if (matchedSlot === -1) continue;
    if (usedSlots.has(matchedSlot)) continue; // only first occurrence
    usedSlots.add(matchedSlot);
    if (heading === labels[matchedSlot]) continue; // already correct
    lines[i] = `## ${labels[matchedSlot]}`;
    changes++;
  }

  return { content: lines.join('\n'), changes, setKey };
}

async function main() {
  const entries = await fs.readdir(CALC_DIR, { withFileTypes: true });
  const slugs = entries
    .filter((e) => e.isDirectory() && !e.name.startsWith('_'))
    .map((e) => e.name);

  const summary = { A: 0, B: 0, C: 0, D: 0 };
  let totalChanges = 0;
  for (const slug of slugs) {
    const file = path.join(CALC_DIR, slug, 'content.mdx');
    try {
      const orig = await fs.readFile(file, 'utf8');
      const { content, changes, setKey } = rewriteContent(slug, orig);
      summary[setKey]++;
      if (changes > 0 && content !== orig) {
        await fs.writeFile(file, content, 'utf8');
        totalChanges += changes;
        console.log(`[${setKey}] ${slug}: ${changes} H2 rewrites`);
      } else {
        console.log(`[${setKey}] ${slug}: no changes`);
      }
    } catch (err) {
      if (err.code === 'ENOENT') continue;
      throw err;
    }
  }
  console.log('\nSet distribution:', summary);
  console.log('Total H2 rewrites:', totalChanges);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
