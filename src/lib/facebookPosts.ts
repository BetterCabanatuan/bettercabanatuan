/**
 * Turns scraped Facebook posts into news items.
 *
 * Pure functions only: `scripts/import-facebook-posts.mjs` does the file I/O
 * and imports this module with `--experimental-strip-types`, so it must stay
 * free of imports and of TypeScript-only syntax that needs a transform (enums,
 * namespaces, parameter properties).
 */

export interface ScrapedPost {
  id: string;
  url: string;
  /** Unix seconds. */
  creation_time: number;
  text?: string | null;
}

export interface TopicRule {
  /** The news `topics` value, matching a service category slug. */
  topic: string;
  include: RegExp;
  exclude?: RegExp;
}

export interface ImportedNewsItem {
  title: string;
  date: string;
  summary?: string;
  sourceName: string;
  sourceUrl: string;
  topics: string[];
}

const MAX_TITLE_LENGTH = 140;
const MAX_SUMMARY_LENGTH = 240;
const MIN_SUMMARY_LENGTH = 80;

/**
 * The Facebook page styles headlines with Mathematical Alphanumeric Symbols
 * (𝗟𝗜𝗕𝗥𝗘𝗡𝗚, 𝐂𝐇𝐄𝐂𝐊-𝐔𝐏). NFKC folds those back to plain letters, which screen
 * readers and search can read; the zero-width characters are dropped too.
 */
export function normalizeText(text: string): string {
  return text.normalize('NFKC').replace(/[\u200B-\u200D\u2060\uFEFF]/g, '');
}

// Not \p{Emoji_Component}: that class includes 0–9 and '#', which would eat
// the "10" in "10-KILONG BIGAS".
const EDGE_SYMBOLS =
  /^[\p{Extended_Pictographic}\uFE0F\s]+|[\p{Extended_Pictographic}\uFE0F\s]+$/gu;

const MONTH =
  '(?:jan|feb|mar|apr|may|jun|jul|aug|sep|oct|nov|dec|enero|pebrero|marso|abril|mayo|hunyo|hulyo|agosto|setyembre|oktubre|nobyembre|disyembre)[a-z]*\\.?';
const WEEKDAY =
  '(?:mon|tue|wed|thu|fri|sat|sun|lunes|martes|miyerkules|huwebes|biyernes|sabado|linggo)[a-z]*';

const DATE_SEGMENT = new RegExp(
  [
    `^${MONTH}\\s+\\d{1,2}(?:\\s*[-–]\\s*\\d{1,2})?,?\\s*\\d{4}(?:\\s*\\(${WEEKDAY}\\))?$`,
    `^${MONTH},?\\s+\\d{4}$`,
    `^${WEEKDAY}(?:\\s*[-–]\\s*${WEEKDAY})?$`,
    '^\\d{4}-\\d{2}-\\d{2}$',
    '\\bweek of\\b',
  ].join('|'),
  'i'
);

/** Kicker lines the page puts above the real headline. */
const GENERIC_LINE =
  /^(?:announcement|check this out!?|good news\b.*|pabatid|paalala|tingnan|stay safe,? cabanatue[ñn]os!?|[—–-]*\s*city government advisory\s*[—–-]*)$/i;

/**
 * Kicker hashtags that are the whole headline, e.g. `#WALANGPASOK | August 10,
 * 2026`. The date stays in the title: every suspension notice has the same
 * hashtag, and posts with the same title collapse into one.
 */
const LABEL_HASHTAGS: Record<string, string> = {
  walangpasok: 'Walang pasok',
};

function isHashtagOnly(segment: string): boolean {
  return /^(?:#\S+\s*)+$/.test(segment);
}

function stripEdgeSymbols(text: string): string {
  return text.replace(EDGE_SYMBOLS, '').trim();
}

/**
 * Splits `#TINGNAN | JULY 29, 2026`-style kicker lines and keeps only the parts
 * that read as a headline. Returns '' when nothing on the line qualifies.
 */
function headlineFromLine(line: string): string {
  const segments = line.split('|').map(segment => stripEdgeSymbols(segment));
  const label = LABEL_HASHTAGS[segments[0]?.replace(/^#/, '').toLowerCase()];
  const date = segments.find(segment => DATE_SEGMENT.test(segment));
  if (label && date) {
    return `${label} — ${date.replace(/\s*\([^)]*\)$/, '')}`;
  }
  const kept = segments.filter(
    segment =>
      segment.length > 0 &&
      !isHashtagOnly(segment) &&
      !DATE_SEGMENT.test(segment) &&
      !GENERIC_LINE.test(segment)
  );
  return kept.join(' — ');
}

function truncate(text: string, max: number): string {
  if (text.length <= max) return text;
  const cut = text.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(' ');
  return `${(lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).trimEnd()}…`;
}

interface Headline {
  title: string;
  /** Index into the post's lines of the line the title came from. */
  lineIndex: number;
}

function findHeadline(lines: string[]): Headline | null {
  for (let i = 0; i < lines.length; i++) {
    const title = headlineFromLine(lines[i]);
    if (title) {
      return {
        title: truncate(title.replace(/\s+/g, ' '), MAX_TITLE_LENGTH),
        lineIndex: i,
      };
    }
  }
  return null;
}

/** The first line of the post that reads as a headline, or '' if none does. */
export function extractHeadline(text: string): string {
  return findHeadline(normalizeText(text).split('\n'))?.title ?? '';
}

/**
 * The text after the headline, as one plain sentence-ish run.
 *
 * Lines that share the headline's paragraph (usually a schedule and a venue)
 * are joined with ` · ` so they survive as a single summary line; following
 * paragraphs are added until the summary is long enough to be useful.
 */
export function extractSummary(text: string): string {
  const lines = normalizeText(text).split('\n');
  const headline = findHeadline(lines);
  if (!headline) return '';

  const paragraphs: string[][] = [[]];
  for (const raw of lines.slice(headline.lineIndex + 1)) {
    const line = stripEdgeSymbols(raw);
    if (!line) {
      if (paragraphs[paragraphs.length - 1].length) paragraphs.push([]);
      continue;
    }
    if (
      isHashtagOnly(line) ||
      /^https?:\/\/\S+$/.test(line) ||
      /^(?:video|photo) credits?:/i.test(line)
    ) {
      continue;
    }
    paragraphs[paragraphs.length - 1].push(line);
  }

  let summary = '';
  for (const paragraph of paragraphs) {
    if (!paragraph.length) continue;
    const joined = paragraph.join(' · ').replace(/\s+/g, ' ');
    summary = summary ? `${summary} ${joined}` : joined;
    // "…kabilang ang:" introduces the list that follows; keep going.
    if (summary.length >= MIN_SUMMARY_LENGTH && !summary.endsWith(':')) break;
  }
  return truncate(summary, MAX_SUMMARY_LENGTH);
}

export function matchTopics(text: string, rules: TopicRule[]): string[] {
  const normalized = normalizeText(text);
  return rules
    .filter(
      rule => rule.include.test(normalized) && !rule.exclude?.test(normalized)
    )
    .map(rule => rule.topic);
}

/** `YYYY-MM-DD` for the calendar day the post went up in Manila. */
export function toManilaDate(unixSeconds: number): string {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Manila',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(unixSeconds * 1000));
}

/**
 * Converts posts into news items for the topics they match, newest first.
 *
 * The page reposts the same announcement for days (the MR-SIA notice went up
 * seven times), so posts sharing a headline collapse to the newest one.
 */
export function postsToNewsItems(
  posts: ScrapedPost[],
  rules: TopicRule[],
  sourceName: string
): ImportedNewsItem[] {
  const byId = new Map<string, ScrapedPost>();
  for (const post of posts) {
    if (post?.id && post.url && post.text) byId.set(post.id, post);
  }

  const newestFirst = [...byId.values()].sort(
    (a, b) => b.creation_time - a.creation_time
  );

  const seenTitles = new Set<string>();
  const items: ImportedNewsItem[] = [];

  for (const post of newestFirst) {
    const text = post.text ?? '';
    const topics = matchTopics(text, rules);
    if (!topics.length) continue;

    const title = extractHeadline(text);
    if (!title) continue;

    const key = title.toLowerCase();
    if (seenTitles.has(key)) continue;
    seenTitles.add(key);

    const summary = extractSummary(text);
    items.push({
      title,
      date: toManilaDate(post.creation_time),
      ...(summary ? { summary } : {}),
      sourceName,
      sourceUrl: post.url,
      topics,
    });
  }

  return items;
}
