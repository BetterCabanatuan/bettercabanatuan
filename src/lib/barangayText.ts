/**
 * Barangay description helpers.
 *
 * The descriptions in `barangays.yaml` were generated from a template that
 * hardcoded "is a urban barangay". Rather than editing 89 records, the
 * leading sentence is normalised at load time from the structured
 * `classification` field, so the grammar is fixed everywhere at once.
 */

/**
 * Chooses "a" or "an" from the spelling of the following word.
 *
 * This is an orthographic rule, not a phonetic one: it reads the first letter
 * rather than the sound. That is exactly right for the two words it is used
 * with here ("urban", "rural") and deliberately not a full English
 * pronunciation table — words like "hour" or "university" would need a
 * phonetic exception list this codebase has no reason to carry.
 */
export function indefiniteArticle(word: string): 'a' | 'an' {
  return /^[aeiou]/i.test(word.trim()) ? 'an' : 'a';
}

/**
 * Rewrites the leading "is a urban barangay" / "is a rural barangay" clause
 * with the correct article, preserving everything after it.
 *
 * Idempotent: running it on already-correct text is a no-op.
 */
export function normalizeBarangayDescription(
  description: string,
  classification: string
): string {
  const classificationLower = classification.toLowerCase();

  return description.replace(
    /\b(is|as)\s+(a|an)\s+(urban|rural)\s+barangay\b/i,
    (match, verb: string, _article: string, _cls: string) => {
      // Only rewrite clauses whose classification matches this record, so a
      // record's own classification is what drives the article.
      if (_cls.toLowerCase() !== classificationLower) return match;
      return `${verb} ${indefiniteArticle(classificationLower)} ${classificationLower} barangay`;
    }
  );
}

/** Builds the canonical opening sentence for a barangay. */
export function barangayDescriptionLead(
  name: string,
  classification: string
): string {
  const cls = classification.toLowerCase();
  return `${name} is ${indefiniteArticle(cls)} ${cls} barangay in the city.`;
}
