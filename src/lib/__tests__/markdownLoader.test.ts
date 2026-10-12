import { describe, expect, it } from 'vitest';
import {
  contentLanguage,
  loadMarkdownContent,
  markdownCandidates,
} from '../markdownLoader';

/**
 * Every Markdown file under content/services, as Vite sees it at build time.
 * Lazy (not eager) so listing the paths costs nothing; only the keys are read.
 */
const servicePages = import.meta.glob('../../../content/services/*/*.md');

/**
 * One real service page that has no Filipino translation yet, found from the
 * glob at test time so a content edit cannot break the test. Returns
 * `undefined` only if every page has been translated, in which case the
 * fallback test has nothing to fall back from and skips.
 */
function untranslatedServicePage():
  | { categorySlug: string; documentSlug: string }
  | undefined {
  const paths = new Set(Object.keys(servicePages));
  for (const path of [...paths].sort()) {
    const m = path.match(/\/([^/]+)\/([^/.]+)\.md$/);
    if (!m) continue; // a `<slug>.<lang>.md` translation, not a base page
    const [, categorySlug, documentSlug] = m;
    const translated = path.replace(/\.md$/, '.fil.md');
    if (!paths.has(translated)) return { categorySlug, documentSlug };
  }
  return undefined;
}

describe('contentLanguage', () => {
  it('returns the code for a supported non-English language', () => {
    expect(contentLanguage('fil')).toBe('fil');
  });

  it('treats English as the base file, never a suffixed one', () => {
    // The English page *is* `<slug>.md`; a `<slug>.en.md` must never be tried.
    expect(contentLanguage('en')).toBeUndefined();
    expect(contentLanguage('en-US')).toBeUndefined();
  });

  it('treats a missing or blank language as English', () => {
    expect(contentLanguage()).toBeUndefined();
    expect(contentLanguage('')).toBeUndefined();
    expect(contentLanguage('   ')).toBeUndefined();
  });

  it('keeps only the primary subtag of a regional tag', () => {
    // i18next's browser detector can report `fil-PH`; the file is `.fil.md`.
    expect(contentLanguage('fil-PH')).toBe('fil');
    expect(contentLanguage('ceb-PH')).toBe('ceb');
  });

  it('normalises case', () => {
    expect(contentLanguage('FIL')).toBe('fil');
    expect(contentLanguage('EN')).toBeUndefined();
  });

  it('rejects anything that is not a 2-3 letter language segment', () => {
    // `cimode` is i18next's debug pseudo-language; the rest must never reach
    // an import path.
    expect(contentLanguage('cimode')).toBeUndefined();
    expect(contentLanguage('f')).toBeUndefined();
    expect(contentLanguage('fil1')).toBeUndefined();
    expect(contentLanguage('../etc')).toBeUndefined();
  });
});

describe('markdownCandidates', () => {
  it('tries the translated file first, then falls back to English', () => {
    expect(markdownCandidates('apply-for-a-permit', 'fil')).toEqual([
      'apply-for-a-permit.fil.md',
      'apply-for-a-permit.md',
    ]);
  });

  it('reads English straight from the base file', () => {
    expect(markdownCandidates('apply-for-a-permit', 'en')).toEqual([
      'apply-for-a-permit.md',
    ]);
  });

  it('reads the base file when no language is given', () => {
    expect(markdownCandidates('apply-for-a-permit')).toEqual([
      'apply-for-a-permit.md',
    ]);
  });

  it('uses the normalised code in the translated file name', () => {
    expect(markdownCandidates('apply-for-a-permit', 'fil-PH')).toEqual([
      'apply-for-a-permit.fil.md',
      'apply-for-a-permit.md',
    ]);
  });

  it('always ends with the English file so a translation can never 404', () => {
    for (const lang of ['fil', 'ceb', 'ilo', 'en', undefined, 'cimode']) {
      expect(markdownCandidates('x', lang).at(-1)).toBe('x.md');
    }
  });

  it('agrees with the segment the placeholder checker strips', () => {
    // scripts/check-content-placeholders.mjs maps `<slug>.<lang>.md` to
    // `<slug>.json` by removing a 2-3 letter segment. Every candidate this
    // helper produces must collapse back to the same companion file.
    const stripLang = (name: string) =>
      name.replace(/(\.[a-z]{2,3})?\.md$/, '.json');
    for (const name of markdownCandidates('renew-a-permit', 'fil')) {
      expect(stripLang(name)).toBe('renew-a-permit.json');
    }
  });
});

describe('loadMarkdownContent', () => {
  it('serves the English page when Filipino is requested and no translation exists', async () => {
    // The acceptance criterion for slice C4: switching the UI language must
    // never produce a not-found state for a page that only exists in English.
    const page = untranslatedServicePage();
    if (!page) return; // every page is translated; nothing to fall back from
    const { categorySlug, documentSlug } = page;

    const inFilipino = await loadMarkdownContent(
      documentSlug,
      categorySlug,
      'service',
      'fil'
    );
    const inEnglish = await loadMarkdownContent(
      documentSlug,
      categorySlug,
      'service',
      'en'
    );

    expect(inFilipino.title).toBeDefined();
    expect(inFilipino).toEqual(inEnglish);
  });

  it('rejects with a not-found error when neither the translated nor the English file exists', async () => {
    // Exercises the real fallback chain end to end: the `.fil.md` import
    // fails, the `.md` import fails, and the caller gets one not-found error
    // instead of a leaked import failure. No real content slug is used so
    // this test cannot be broken by a content edit.
    await expect(
      loadMarkdownContent(
        'no-such-document',
        'no-such-category',
        'service',
        'fil'
      )
    ).rejects.toThrow('Document not found: no-such-document');
  });
});
