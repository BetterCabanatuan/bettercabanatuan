#!/usr/bin/env node
/**
 * Content placeholder audit — the gate behind docs/CONTENT-PLACEHOLDERS.md.
 *
 *   node scripts/check-content-placeholders.mjs           # report, exit 1 on any failure
 *   node scripts/check-content-placeholders.mjs --report  # report, always exit 0
 *
 * Two placeholder conventions exist in `content/**\/*.md`, and only one of them
 * is wired to a resolver:
 *
 *   1. `{TOKEN}`  resolved by `interpolate()` in src/lib/markdownLoader.ts, from
 *                 the companion `<slug>.json` first and a `VITE_<KEY>` env var
 *                 second. Resolved at load time, invisible to users.
 *   2. `[TEXT]`    NOT resolved. Reaches the DOM as literal text.
 *
 * Convention 2 is what shipped `[PHONE NUMBER]` to a live civic page. This
 * script fails the build on either an unresolved brace token or a bracketed
 * placeholder, so a starter-kit leftover cannot reach production again.
 *
 * A bracketed run is only reported when it *looks* like a placeholder — at least
 * two words, uppercase, no lowercase prose. Markdown link text is excluded
 * structurally (inline, reference, and shortcut forms), so ordinary links like
 * `[SSS](https://sss.gov.ph/)` are not false positives.
 */

import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join, relative, basename } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const contentDir = join(root, 'content');
const reportOnly = process.argv.includes('--report');

const C = {
  reset: '\x1b[0m',
  dim: '\x1b[2m',
  bold: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
};

/* ------------------------------------------------------------------ config */

/** The same token grammar `interpolate()` accepts. Keep the two in step. */
const TOKEN = /\{([A-Z0-9_]+)\}/g;

/**
 * A bracketed run is a placeholder when it is two or more uppercase words.
 * `[PHONE NUMBER]` qualifies; `[SSS]` does not (one word, and a real link);
 * `[read the guide]` does not (lowercase prose).
 */
function looksLikePlaceholder(text) {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 80) return false;
  if (/\s/.test(trimmed) === false) return false; // needs at least one space
  if (/[a-z]/.test(trimmed)) return false; // any lowercase → prose, not a token
  if (!/^[A-Z0-9][A-Z0-9 /+.,'()-]*$/.test(trimmed)) return false;
  return trimmed.split(/\s+/).filter(Boolean).length >= 2;
}

/* ------------------------------------------------------------------ walking */

function collectMarkdown(dir) {
  const out = [];
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) out.push(...collectMarkdown(full));
    else if (entry.endsWith('.md')) out.push(full);
  }
  return out;
}

/** Keys defined in a page's companion `<slug>.json`, or `null` if it has none. */
function companionKeys(mdPath) {
  const jsonPath = mdPath.replace(/\.md$/, '.json');
  if (!existsSync(jsonPath)) return null;
  try {
    return new Set(Object.keys(JSON.parse(readFileSync(jsonPath, 'utf8'))));
  } catch {
    return null;
  }
}

/** Every `VITE_*` key available at build time, across env files and CI. */
function viteKeys() {
  const keys = new Set();
  for (const name of Object.keys(process.env)) {
    if (name.startsWith('VITE_')) keys.add(name);
  }
  for (const envFile of [
    '.env',
    '.env.local',
    '.env.production',
    '.env.example',
  ]) {
    const full = join(root, envFile);
    if (!existsSync(full)) continue;
    for (const line of readFileSync(full, 'utf8').split('\n')) {
      const m = line.match(/^\s*(VITE_[A-Z0-9_]+)\s*=/);
      if (m) keys.add(m[1]);
    }
  }
  return keys;
}

/* ----------------------------------------------------------------- findings */

const env = viteKeys();
const findings = [];

for (const mdPath of collectMarkdown(contentDir)) {
  const rel = relative(root, mdPath);
  const lines = readFileSync(mdPath, 'utf8').split('\n');
  const keys = companionKeys(mdPath);

  lines.forEach((line, i) => {
    const lineNo = i + 1;

    // --- unresolved brace tokens
    for (const m of line.matchAll(TOKEN)) {
      const key = m[1];
      if (keys?.has(key)) continue;
      if (env.has(`VITE_${key}`)) continue;
      findings.push({
        file: rel,
        line: lineNo,
        kind: 'unresolved token',
        detail:
          `{${key}}` +
          (keys === null
            ? ' — no companion .json for this page'
            : ' — not in the companion .json'),
      });
    }

    // --- bracketed placeholders
    for (const m of line.matchAll(/\[([^\][]*)\]/g)) {
      const text = m[1];
      const after = line.slice(m.index + m[0].length);

      // Inline link `[text](url)`, reference link `[text][ref]`, definition
      // usage `[ref]`, and a link label closing a previous construct. All
      // legitimate markdown, never a placeholder.
      if (/^\s*\(/.test(after)) continue;
      if (/^\s*\[/.test(after)) continue;
      if (/^\s*:/.test(after)) continue;
      if (!looksLikePlaceholder(text)) continue;

      findings.push({
        file: rel,
        line: lineNo,
        kind: 'bracketed placeholder',
        detail: `[${text.trim()}] — renders literally; use {TOKEN} + companion .json`,
      });
    }
  });
}

/* ------------------------------------------------------------------ report */

console.log(`\n${C.bold}CONTENT PLACEHOLDER AUDIT${C.reset}`);
console.log(
  `${C.dim}source: content/**/*.md · resolver: src/lib/markdownLoader.ts${C.reset}\n`
);

if (findings.length === 0) {
  console.log(
    `${C.green}✓${C.reset} no unresolved placeholders in ${basename(contentDir)}/\n`
  );
  process.exit(reportOnly ? 0 : 0);
}

for (const f of findings) {
  console.log(
    `${C.red}✗${C.reset} ${C.cyan}${f.file}:${f.line}${C.reset}  ${C.yellow}${f.kind}${C.reset}`
  );
  console.log(`  ${f.detail}`);
}
console.log(
  `\n${C.red}${findings.length} unresolved placeholder(s)${C.reset} in ` +
    `${C.bold}${new Set(findings.map(f => f.file)).size}${C.reset} file(s).\n` +
    `${C.dim}Fix: replace with {TOKEN} and add the value to the page's companion .json,` +
    `\n     or delete the sentence. Bracketed placeholders have no resolver — they` +
    `\n     reach the page as literal text.${C.reset}\n`
);

process.exit(reportOnly ? 0 : 1);
