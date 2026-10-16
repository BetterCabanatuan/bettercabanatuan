/**
 * Imports scraped Facebook posts from the city page into the news feed.
 *
 *   npm run import:posts -- <scraper output dir or posts JSON> [...more]
 *   npm run import:posts -- <dir> --dry-run [--topic <slug>]
 *
 * Reads every `posts*.json` in a directory (or the files given), keeps posts
 * that match a topic rule, and rewrites src/data/news.facebook.yaml. That
 * file is generated: edit the rules, not the YAML. Hand-written items belong
 * in src/data/news.yaml and win over imported ones with the same link.
 *
 * Topic rules live one per service category in src/lib/facebookTopics/
 * <slug>.ts and load in the order of src/data/services.yaml. Posts matching
 * src/lib/facebookTopics/skip.ts never go on the site.
 *
 * --dry-run prints each topic's headlines (and the skipped and untagged
 * posts) instead of writing. Review the diff before committing: the rules
 * are keyword matches, so a post can slip in or out.
 */
import {
  existsSync,
  readFileSync,
  readdirSync,
  statSync,
  writeFileSync,
} from 'node:fs';
import { basename, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import {
  extractHeadline,
  normalizeText,
  postsToNewsItems,
} from '../src/lib/facebookPosts.ts';
import { skipReason } from '../src/lib/facebookTopics/skip.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const OUTPUT = join(root, 'src/data/news.facebook.yaml');
const DEFAULT_SOURCE_NAME = 'City Government of Cabanatuan';

const TOPICS_DIR = join(root, 'src/lib/facebookTopics');

/** One rule per service category that has a file, in services.yaml order. */
async function loadTopicRules() {
  const services = yaml.load(
    readFileSync(join(root, 'src/data/services.yaml'), 'utf-8')
  );
  const rules = [];
  for (const { slug } of services.categories) {
    const file = join(TOPICS_DIR, `${slug}.ts`);
    if (!existsSync(file)) continue;
    const { default: rule } = await import(file);
    if (rule.topic !== slug) {
      throw new Error(
        `${file} exports topic '${rule.topic}', expected '${slug}'`
      );
    }
    rules.push(rule);
  }
  return rules;
}

function collectInputFiles(args) {
  const files = [];
  for (const arg of args) {
    if (!existsSync(arg)) {
      throw new Error(`Not found: ${arg}`);
    }
    if (statSync(arg).isDirectory()) {
      for (const name of readdirSync(arg).sort()) {
        if (/^posts.*\.json$/.test(name)) files.push(join(arg, name));
      }
    } else {
      files.push(arg);
    }
  }
  return files;
}

function readSourceName(files) {
  for (const file of files) {
    const pageInfo = join(file, '..', 'page_info.json');
    if (existsSync(pageInfo)) {
      const name = JSON.parse(readFileSync(pageInfo, 'utf-8'))?.page_name;
      if (typeof name === 'string' && name.trim()) return name.trim();
    }
  }
  return DEFAULT_SOURCE_NAME;
}

function readFlag(args, name) {
  const at = args.indexOf(name);
  if (at === -1) return undefined;
  const [, value] = args.splice(at, 2);
  return value;
}

function printReport(posts, rules, items, onlyTopic) {
  const skipped = [];
  const untagged = [];
  for (const post of posts) {
    const text = normalizeText(post?.text ?? '');
    if (!text.trim()) continue;
    const reason = skipReason(text, post.id);
    if (reason) skipped.push(`${reason}: ${extractHeadline(text)}`);
    else if (!rules.some(r => r.include.test(text) && !r.exclude?.test(text))) {
      untagged.push(extractHeadline(text));
    }
  }
  for (const rule of rules) {
    if (onlyTopic && rule.topic !== onlyTopic) continue;
    const titles = items.filter(i => i.topics.includes(rule.topic));
    console.log(`\n## ${rule.topic} (${titles.length})`);
    for (const i of titles) {
      const others = i.topics.filter(t => t !== rule.topic);
      console.log(
        `  ${i.date}  ${i.title}${others.length ? `  [+${others.join(', ')}]` : ''}`
      );
    }
  }
  if (onlyTopic) return;
  console.log(`\n## skipped (${skipped.length})`);
  for (const line of [...new Set(skipped)]) console.log(`  ${line}`);
  console.log(`\n## untagged (${new Set(untagged).size} distinct)`);
  for (const line of [...new Set(untagged)]) console.log(`  ${line}`);
}

async function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  if (dryRun) args.splice(args.indexOf('--dry-run'), 1);
  const onlyTopic = readFlag(args, '--topic');
  if (!args.length) {
    console.error(
      'Usage: npm run import:posts -- <scraper output dir or posts JSON> [...more]'
    );
    process.exit(1);
  }

  const files = collectInputFiles(args);
  if (!files.length) {
    console.error('No posts*.json files found in the given paths.');
    process.exit(1);
  }

  const allPosts = files.flatMap(file => {
    const parsed = JSON.parse(readFileSync(file, 'utf-8'));
    if (!Array.isArray(parsed)) {
      throw new Error(`${file} is not a JSON array of posts`);
    }
    return parsed;
  });
  const posts = allPosts.filter(
    post => !skipReason(normalizeText(post?.text ?? ''), post?.id)
  );

  const rules = await loadTopicRules();
  const items = postsToNewsItems(posts, rules, readSourceName(files));

  if (dryRun) {
    printReport(allPosts, rules, items, onlyTopic);
    return;
  }

  const header = [
    '# GENERATED by scripts/import-facebook-posts.mjs — do not edit by hand.',
    '#',
    '# Posts from the official city Facebook page, merged into the news feed by',
    '# src/data/news.ts. To change what appears here, edit the rules in',
    '# src/lib/facebookTopics/ and re-run `npm run import:posts`.',
    `# Sources: ${files.map(f => basename(f)).join(', ')}`,
    '',
  ].join('\n');

  const body = yaml.dump(
    { items },
    { lineWidth: -1, quotingType: "'", forceQuotes: true }
  );
  writeFileSync(OUTPUT, `${header}${body}`);

  const counts = rules
    .map(
      rule =>
        `${rule.topic}: ${items.filter(i => i.topics.includes(rule.topic)).length}`
    )
    .join(', ');
  console.log(
    `Read ${posts.length} posts from ${files.length} file(s); wrote ${items.length} items to ${relative(root, OUTPUT)} (${counts}).`
  );
}

await main();
