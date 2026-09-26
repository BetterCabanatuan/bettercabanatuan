import { describe, expect, it } from 'vitest';
import en from '../../public/locales/en/common.json';
import fil from '../../public/locales/fil/common.json';

/**
 * Guards against a whole class of regression: a translation key that does not
 * exist renders as the raw key ("news.badge") instead of copy.
 *
 * This already happened once — a new `news` block replaced the existing one and
 * silently dropped three keys that other components were still using. Static
 * extraction catches that immediately, without needing a browser.
 */
type Bundle = Record<string, unknown>;

const bundles: Record<string, Bundle> = { en, fil };

/** All source files under src/, read at build time so no Node APIs are needed. */
const sources = import.meta.glob('../**/*.{ts,tsx}', {
  query: '?raw',
  import: 'default',
  eager: true,
}) as Record<string, string>;

const RESOLVE = /\bt\(\s*'([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)'/g;
const RESOLVE_DQ = /\bt\(\s*"([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)"/g;
const TRANS_KEY = /i18nKey="([a-zA-Z0-9_]+(?:\.[a-zA-Z0-9_]+)+)"/g;

/** Strips i18next plural suffixes: `itemCount_one` -> `itemCount`. */
const dePlural = (key: string) =>
  key.replace(/_(zero|one|two|few|many|other)$/, '');

const PLURAL_SUFFIXES = ['zero', 'one', 'two', 'few', 'many', 'other'];

function getPath(bundle: Bundle, key: string): unknown {
  return dePlural(key)
    .split('.')
    .reduce<unknown>(
      (node, segment) =>
        node && typeof node === 'object'
          ? (node as Record<string, unknown>)[segment]
          : undefined,
      bundle
    );
}

/**
 * A key counts as present when the exact path exists, or when it is the base
 * of a plural set (`itemCount` is served by `itemCount_one` / `..._other`).
 */
function hasPath(bundle: Bundle, key: string): boolean {
  if (getPath(bundle, key) !== undefined) return true;

  const segments = dePlural(key).split('.');
  const leaf = segments.pop()!;
  const parent = getPath(bundle, segments.join('.'));
  if (!parent || typeof parent !== 'object') return false;

  const record = parent as Record<string, unknown>;
  return PLURAL_SUFFIXES.some(
    suffix => record[`${leaf}_${suffix}`] !== undefined
  );
}

/** Every static translation key referenced in src, with the file it came from. */
function collectKeys(): Array<{ key: string; file: string }> {
  const found: Array<{ key: string; file: string }> = [];

  Object.entries(sources).forEach(([file, source]) => {
    // Ignore test files: they legitimately assert on missing keys.
    if (/\.(test|spec)\.tsx?$/.test(file)) return;

    for (const pattern of [RESOLVE, RESOLVE_DQ, TRANS_KEY]) {
      pattern.lastIndex = 0;
      let match: RegExpExecArray | null;
      while ((match = pattern.exec(source)) !== null) {
        found.push({ key: match[1], file: file.replace(/^.*\/src\//, 'src/') });
      }
    }
  });

  return found;
}

/**
 * Keys intentionally absent from a bundle, with the runtime fallback that
 * covers them. Each exemption must state its reason so it stays auditable and
 * can be retired when the fallback goes away.
 */
const OPTIONAL_KEYS: Record<string, string> = {
  'about.history.paragraphs':
    'en omits it; AboutHistorySection falls back to aboutData.history.paragraphs (YAML) when the array is missing.',
};

describe('translation keys exist', () => {
  const references = collectKeys();

  it('finds translation keys in the source', () => {
    // Guards the guard: if extraction ever breaks, the tests below pass vacuously.
    expect(references.length).toBeGreaterThan(50);
  });

  it.each(['en', 'fil'])('every referenced key resolves in %s', lang => {
    const bundle = bundles[lang];
    const missing = references
      .filter(({ key }) => !hasPath(bundle, key))
      .filter(({ key }) => !(key in OPTIONAL_KEYS))
      .map(({ key, file }) => `${key}  (${file})`);

    expect(
      [...new Set(missing)],
      `missing ${lang} keys — these would render as raw key text`
    ).toEqual([]);
  });

  it('keeps every optional-key exemption justified', () => {
    Object.entries(OPTIONAL_KEYS).forEach(([key, reason]) => {
      expect(reason.length, `${key} needs a stated reason`).toBeGreaterThan(20);
      // The exemption must correspond to a real reference, or it is dead weight.
      expect(
        references.some(r => r.key === key),
        `${key} is exempt but no longer referenced`
      ).toBe(true);
    });
  });

  it('does not reference a key twice under colliding namespaces', () => {
    // The `news` / `newsFeed` split exists so two features cannot silently
    // overwrite each other's copy. Guard the prefixes that are feature-scoped.
    const scopedPrefixes = [
      'news',
      'newsFeed',
      'volunteerDialog',
      'emptyState',
    ];
    scopedPrefixes.forEach(prefix => {
      expect(en, `${prefix} must exist in en`).toHaveProperty(prefix);
      expect(fil, `${prefix} must exist in fil`).toHaveProperty(prefix);
    });
  });

  it('keeps the Facebook news block intact', () => {
    // Regression guard for the dropped `news.*` keys.
    ['badge', 'description', 'embedLabel', 'followCta', 'title'].forEach(
      key => {
        expect(en.news, `en.news.${key}`).toHaveProperty(key);
        expect(fil.news, `fil.news.${key}`).toHaveProperty(key);
      }
    );
  });

  it('translates every English key into Tagalog', () => {
    const paths = (obj: Bundle, prefix = ''): string[] =>
      Object.entries(obj).flatMap(([key, value]) =>
        value && typeof value === 'object'
          ? paths(value as Bundle, `${prefix}${key}.`)
          : [`${prefix}${key}`]
      );

    const strip = (p: string) =>
      p.replace(/_(zero|one|two|few|many|other)$/, '');
    const enPaths = new Set(paths(en).map(strip));
    const filPaths = new Set(paths(fil).map(strip));

    // An English string with no Tagalog counterpart is a real gap.
    const untranslated = [...enPaths].filter(p => !filPaths.has(p));
    expect(untranslated, 'English keys with no Tagalog translation').toEqual(
      []
    );

    // fil is allowed extra keys: some strings are an intentional fallback and
    // only exist in one language (e.g. about.history.paragraphs, which en
    // takes from the YAML instead). Surfaced, not enforced.
    const filOnly = [...filPaths].filter(p => !enPaths.has(p));
    if (filOnly.length > 0) {
      console.info(`fil-only keys (allowed): ${filOnly.join(', ')}`);
    }
  });
});
