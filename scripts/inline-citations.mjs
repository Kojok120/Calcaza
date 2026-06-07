#!/usr/bin/env node
/**
 * Phase 4 — Convert FIRST occurrence per post of common authority phrases
 * into inline links. Skips matches already inside a markdown link.
 *
 *  - el IRS / IRS  -> [el IRS](https://www.irs.gov)
 *  - la SSA / Seguro Social -> [la SSA](https://www.ssa.gov)
 *  - CMS / Medicare -> [CMS](https://www.cms.gov)
 *  - Schedule C -> [Schedule C](https://www.irs.gov/forms-pubs/about-schedule-c-form-1040)
 *  - Pub. 590-A -> [Pub. 590-A](https://www.irs.gov/forms-pubs/about-publication-590-a)
 */
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, '..');
const POSTS_DIR = path.join(ROOT, 'posts');

// Order matters: longer/more specific phrases first.
const RULES = [
  {
    name: 'Pub. 590-A',
    re: /\bPub\.\s*590-A\b/,
    label: 'Pub. 590-A',
    href: 'https://www.irs.gov/forms-pubs/about-publication-590-a',
  },
  {
    name: 'Schedule C',
    re: /\bSchedule C\b/,
    label: 'Schedule C',
    href: 'https://www.irs.gov/forms-pubs/about-schedule-c-form-1040',
  },
  {
    name: 'el IRS',
    re: /\bel IRS\b/,
    label: 'el IRS',
    href: 'https://www.irs.gov',
  },
  {
    name: 'la SSA',
    re: /\bla SSA\b/,
    label: 'la SSA',
    href: 'https://www.ssa.gov',
  },
  {
    name: 'Seguro Social',
    re: /\bSeguro Social\b/,
    label: 'Seguro Social',
    href: 'https://www.ssa.gov',
  },
  {
    name: 'CMS',
    re: /\bCMS\b/,
    label: 'CMS',
    href: 'https://www.cms.gov',
  },
  {
    name: 'Medicare',
    re: /\bMedicare\b/,
    label: 'Medicare',
    href: 'https://www.cms.gov',
  },
];

function isInsideExistingLink(content, index) {
  // Scan back for "[" without intervening "]"
  let bracketDepth = 0;
  for (let i = index - 1; i >= 0; i--) {
    const ch = content[i];
    if (ch === ']') bracketDepth++;
    else if (ch === '[') {
      if (bracketDepth === 0) {
        // We're inside an open bracket. Check that after the next ] there's "("
        // i.e. the opening bracket is the start of a markdown link or link text.
        // Find the closing ]
        const close = content.indexOf(']', index);
        if (close !== -1 && content[close + 1] === '(') return true;
        return false;
      }
      bracketDepth--;
    } else if (ch === '\n') {
      return false;
    }
  }
  return false;
}

function applyFirstOccurrence(content, rule) {
  // Find a first-occurrence index that:
  //  - is not inside an existing markdown link
  //  - is not the literal label that already follows "[" (avoid wrapping inside link text)
  let from = 0;
  while (from < content.length) {
    const slice = content.slice(from);
    const m = slice.match(rule.re);
    if (!m) return content;
    const matchIndex = from + m.index;

    if (isInsideExistingLink(content, matchIndex)) {
      from = matchIndex + m[0].length;
      continue;
    }

    // Skip if the surrounding text is something like "el IRS, en irs.gov" within
    // the same paragraph as a different but already-link form? That's fine,
    // we still link the bare phrase.
    const before = content.slice(0, matchIndex);
    const after = content.slice(matchIndex + m[0].length);
    return `${before}[${rule.label}](${rule.href})${after}`;
  }
  return content;
}

async function main() {
  const entries = await fs.readdir(POSTS_DIR, { withFileTypes: true });
  let totalChanges = 0;
  for (const e of entries) {
    if (!e.isDirectory()) continue;
    const file = path.join(POSTS_DIR, e.name, 'post.mdx');
    let content;
    try {
      content = await fs.readFile(file, 'utf8');
    } catch {
      continue;
    }
    const orig = content;
    const applied = [];
    for (const rule of RULES) {
      const next = applyFirstOccurrence(content, rule);
      if (next !== content) {
        applied.push(rule.name);
        content = next;
      }
    }
    if (content !== orig) {
      await fs.writeFile(file, content, 'utf8');
      totalChanges += applied.length;
      console.log(`${e.name}: ${applied.join(', ')}`);
    } else {
      console.log(`${e.name}: (no changes)`);
    }
  }
  console.log(`\nTotal new inline citations: ${totalChanges}`);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
