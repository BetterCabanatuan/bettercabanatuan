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

export interface MarkdownContent {
  content: string;
  title?: string;
  description?: string;
  data?: Record<string, unknown>;
}

/**
 * Loads markdown content from the appropriate content directory.
 * Also attempts to load a companion JSON file (same slug) for template
 * variable substitution and structured data.
 * @param documentSlug - The document slug (filename without .md extension)
 * @param categorySlug - The category slug (parent directory)
 * @param categoryType - Whether this is a 'service' or 'government' document
 */
export async function loadMarkdownContent(
  documentSlug: string,
  categorySlug: string,
  categoryType: 'service' | 'government'
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

    const module = await import(
      `../../content/${dir}/${categorySlug}/${documentSlug}.md?raw`
    );
    const content = interpolate(module.default, data);

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
