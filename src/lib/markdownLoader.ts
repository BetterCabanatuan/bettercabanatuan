/**
 * Utility to load markdown content dynamically based on slug
 */

/**
 * Replaces {PLACEHOLDER} tokens using JSON data first, then VITE_ env vars.
 *
 * Only `{BRACE}` tokens resolve. A `[BRACKETED]` placeholder has no resolver
 * and reaches the page as literal text — `npm run check:placeholders` fails the
 * build on both a token with no value and a bracketed leftover.
 */
function interpolate(
  content: string,
  data: Record<string, unknown> = {}
): string {
  return content.replace(/\{([A-Z0-9_]+)\}/g, (match, key) => {
    if (key in data) return String(data[key]);
    const value = import.meta.env[`VITE_${key}`];
    return value !== undefined ? String(value) : match;
  });
}

/**
 * The language segment a translated page carries in its file name:
 * `<slug>.fil.md`. Two or three lowercase letters, which is also what
 * scripts/check-content-placeholders.mjs strips to find the shared companion
 * `<slug>.json`. Keep the two in step.
 */
const LANGUAGE_SEGMENT = /^[a-z]{2,3}$/;

/**
 * The language code a translated Markdown file would carry, or `undefined`
 * when only the English file should be read.
 *
 * i18next reports `i18n.language` as whatever the detector or switcher set,
 * which can be a regional tag (`fil-PH`), an unsupported code, or `cimode` in
 * debug. Only the primary subtag matters here, and English never has a
 * suffixed file — the base `<slug>.md` is the English page.
 */
export function contentLanguage(lang?: string): string | undefined {
  const primary = lang?.trim().toLowerCase().split('-')[0];
  if (!primary || primary === 'en' || !LANGUAGE_SEGMENT.test(primary)) {
    return undefined;
  }
  return primary;
}

/**
 * Ordered Markdown basenames to try for a document in a given language:
 * the translated `<slug>.<lang>.md` first, then the English `<slug>.md`.
 *
 * `loadMarkdownContent` mirrors this order with two import statements rather
 * than looping over the list, because Vite can only analyse a dynamic import
 * whose extension is literal. This helper exists so the order and the
 * language rule are stated once and are unit-testable without a bundler.
 */
export function markdownCandidates(slug: string, lang?: string): string[] {
  const code = contentLanguage(lang);
  const base = `${slug}.md`;
  return code ? [`${slug}.${code}.md`, base] : [base];
}

export interface MarkdownContent {
  content: string;
  title?: string;
  description?: string;
  data?: Record<string, unknown>;
}

/**
 * Imports the raw Markdown for a document, preferring the translation when one
 * exists. Both import strings keep their variables inside the file name only,
 * which is the shape Vite turns into a glob at build time.
 */
async function importMarkdown(
  dir: string,
  categorySlug: string,
  documentSlug: string,
  lang?: string
): Promise<string> {
  const code = contentLanguage(lang);
  if (code) {
    try {
      const translated = await import(
        `../../content/${dir}/${categorySlug}/${documentSlug}.${code}.md?raw`
      );
      return translated.default;
    } catch {
      // No translation for this page yet — the English file is the fallback,
      // never a not-found state.
    }
  }
  const module = await import(
    `../../content/${dir}/${categorySlug}/${documentSlug}.md?raw`
  );
  return module.default;
}

/**
 * Loads markdown content from the appropriate content directory.
 * Also attempts to load a companion JSON file (same slug) for template
 * variable substitution and structured data.
 * @param documentSlug - The document slug (filename without .md extension)
 * @param categorySlug - The category slug (parent directory)
 * @param categoryType - Whether this is a 'service' or 'government' document
 * @param lang - The active UI language. When set and not English, the loader
 *   tries `<slug>.<lang>.md` before `<slug>.md`. The companion JSON is the
 *   same `<slug>.json` in either case, so a translation never restates a fee.
 */
export async function loadMarkdownContent(
  documentSlug: string,
  categorySlug: string,
  categoryType: 'service' | 'government',
  lang?: string
): Promise<MarkdownContent> {
  try {
    const dir = categoryType === 'government' ? 'government' : 'services';

    // Try to load companion JSON for template data
    let data: Record<string, unknown> = {};
    try {
      const jsonModule = await import(
        `../../content/${dir}/${categorySlug}/${documentSlug}.json`
      );
      data = jsonModule.default;
    } catch {
      // No companion JSON — that's fine
    }

    const raw = await importMarkdown(dir, categorySlug, documentSlug, lang);
    const content = interpolate(raw, data);

    const titleMatch = content.match(/^#\s+(.+)$/m);
    const title = titleMatch ? titleMatch[1] : undefined;

    const descriptionMatch = content.match(/^#\s+.+$\n\n(.+?)(?:\n\n|$)/s);
    const description = descriptionMatch
      ? descriptionMatch[1].replace(/^>\s*/, '').trim()
      : undefined;

    return { content, title, description, data };
  } catch {
    /*
     * Reached when the slug has no matching file, which is the ordinary way a
     * bad URL becomes a 404 — the caller's not-found guard handles it. It was
     * logged at `error`, so every mistyped or crawled URL painted a red console
     * error and buried the failures that were actually worth reading. A missing
     * document is a 404, not a fault; `debug` keeps it inspectable without
     * crying wolf.
     */
    console.debug(`No markdown document for slug "${documentSlug}"`);
    throw new Error(`Document not found: ${documentSlug}`);
  }
}
