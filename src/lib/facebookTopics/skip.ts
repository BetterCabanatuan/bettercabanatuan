/**
 * Posts from the city Facebook page that never go on the site, whatever
 * topic rules they match. Patterns run on the NFKC-normalized post text.
 *
 * No imports: scripts/import-facebook-posts.mjs loads this file with
 * `--experimental-strip-types`.
 */

export interface SkipRule {
  reason: string;
  pattern: RegExp;
}

export const SKIP_RULES: SkipRule[] = [
  {
    // Near-daily rain-safety tips and greetings; they bury real advisories.
    reason: 'good-morning',
    pattern: /^\s*good morning,? cabanatuan/i,
  },
  {
    // Private companies' job ads the page reposts. PESO job fairs don't put
    // "hiring" in their first two lines.
    reason: 'private-hiring',
    pattern: /^\s*(?:[^\n]*\n+)?[^\n]*\bhiring\b/i,
  },
  {
    // The district representative's own posts, cross-posted to the page.
    reason: 'politician',
    pattern: /#(?:CongJay|JayVergara|LingkodVergara|HouseOfRepsPH)\b/i,
  },
];

/** Single posts to drop that no pattern catches. */
export const SKIP_POST_IDS: string[] = [
  // Personal throwback to the 1998 oath-taking, no hashtags.
  '1461248302712951',
];

export function skipReason(text: string, id?: string): string | null {
  if (id && SKIP_POST_IDS.includes(id)) return 'post-id';
  return SKIP_RULES.find(rule => rule.pattern.test(text))?.reason ?? null;
}
