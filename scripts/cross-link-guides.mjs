#!/usr/bin/env node
/**
 * Phase 6 — Guide <-> Calc cross-linking.
 *
 * For each calculators/<slug>/content.mdx, find guides where the post's
 * relatedCalcSlugs includes this calc's slug. Fallback: posts with the
 * same category (max 2). Add a "## Lecturas relacionadas" section just
 * before the relations close (i.e. before the "Calculadoras relacionadas"
 * / "También le puede interesar" / "Otras calculadoras útiles" /
 * "Calculadoras del mismo tema" heading, OR if missing, at end of file).
 *
 * Idempotent: skips if the file already has "## Lecturas relacionadas".
 */
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath, pathToFileURL } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');
const CALC_DIR = path.join(ROOT, 'calculators');

const RELATED_HEADING_RE =
  /^##\s+(?:Calculadoras relacionadas|También le puede interesar|Tambien le puede interesar|Otras calculadoras útiles|Otras calculadoras utiles|Calculadoras del mismo tema)\b/m;

// Read each post meta.ts via dynamic import
async function loadPosts() {
  const dirs = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  const metas = [];
  for (const d of dirs) {
    if (!d.isDirectory()) continue;
    const metaFile = path.join(POSTS_DIR, d.name, 'meta.ts');
    try {
      await fs.access(metaFile);
    } catch {
      continue;
    }
    // Parse meta.ts as text — extract slug, category, title, relatedCalcSlugs
    const src = await fs.readFile(metaFile, 'utf8');
    const slug = extractStringField(src, 'slug');
    const title = extractStringField(src, 'title');
    const category = extractStringField(src, 'category');
    const related = extractArrayField(src, 'relatedCalcSlugs');
    if (slug && title && category) {
      metas.push({ slug, title, category, related });
    }
  }
  return metas;
}

function extractStringField(src, name) {
  const re = new RegExp(`${name}:\\s*['"\`]([^'"\`]+)['"\`]`);
  const m = src.match(re);
  return m ? m[1] : null;
}

function extractArrayField(src, name) {
  const re = new RegExp(`${name}:\\s*\\[([\\s\\S]*?)\\]`);
  const m = src.match(re);
  if (!m) return [];
  return [...m[1].matchAll(/['"]([^'"]+)['"]/g)].map((x) => x[1]);
}

async function loadCalculators() {
  const dirs = await fs.readdir(CALC_DIR, { withFileTypes: true });
  const calcs = [];
  for (const d of dirs) {
    if (!d.isDirectory() || d.name.startsWith('_')) continue;
    const metaFile = path.join(CALC_DIR, d.name, 'meta.ts');
    try {
      const src = await fs.readFile(metaFile, 'utf8');
      const slug = extractStringField(src, 'slug') ?? d.name;
      const category = extractStringField(src, 'category');
      calcs.push({ slug, category });
    } catch {
      continue;
    }
  }
  return calcs;
}

function pickGuidesForCalc(calc, posts) {
  const direct = posts.filter((p) => p.related.includes(calc.slug));
  if (direct.length > 0) return direct.slice(0, 3);
  const sameCat = posts.filter((p) => p.category === calc.category);
  return sameCat.slice(0, 2);
}

function buildLecturasSection(guides) {
  if (guides.length === 0) return '';
  const bullets = guides
    .map((g) => `- [${g.title}](/blog/${g.slug}/)`)
    .join('\n');
  return `## Lecturas relacionadas

${bullets}

`;
}

async function main() {
  const posts = await loadPosts();
  const calcs = await loadCalculators();
  let inserted = 0;
  let skipped = 0;
  for (const calc of calcs) {
    const file = path.join(CALC_DIR, calc.slug, 'content.mdx');
    let content;
    try {
      content = await fs.readFile(file, 'utf8');
    } catch {
      continue;
    }
    if (content.includes('## Lecturas relacionadas')) {
      skipped++;
      continue;
    }
    const guides = pickGuidesForCalc(calc, posts);
    if (guides.length === 0) {
      console.log(`SKIP ${calc.slug}: no guides found`);
      continue;
    }
    const block = buildLecturasSection(guides);

    // Insert before the related-calculators heading if present, else at EOF.
    const m = content.match(RELATED_HEADING_RE);
    let next;
    if (m) {
      const idx = content.indexOf(m[0]);
      next = `${content.slice(0, idx)}${block}${content.slice(idx)}`;
    } else {
      next = `${content.trimEnd()}\n\n${block}`;
    }
    await fs.writeFile(file, next, 'utf8');
    inserted++;
    console.log(`OK ${calc.slug}: ${guides.length} guide link(s)`);
  }
  console.log(
    `\nInserted: ${inserted}. Already had section: ${skipped}. Total calcs: ${calcs.length}.`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
