/**
 * Imports scraped Facebook posts from the city page into the news feed.
 *
 *   npm run import:posts -- <scraper output dir or posts JSON> [...more]
 *   npm run import:posts -- data/facebook/lgucabanatuan
 *   npm run import:posts -- <dir> --dry-run [--topic <slug>]
 *
 * Reads every `posts*.json` in a directory, every `<YYYY>/<YYYY-MM>.json` of
 * an archive kept by scripts/facebook-sync, or the files given, and rewrites
 * src/data/news.facebook.json with one item per post. That file is generated:
 * edit the rules, not the JSON. Hand-written items belong in
 * src/data/news.yaml and win over imported ones with the same link.
 *
 * Every post goes on /government/news. Topic rules live one per service
 * category in src/lib/facebookTopics/<slug>.ts, load in the order of
 * src/data/services.yaml, and only decide which category pages also list a
 * post. Posts matching src/lib/facebookTopics/skip.ts never go on the site.
 *
 * The output is JSON, not YAML: it holds every post since the start of the
 * archive and ships in the site bundle, where JSON.parse is far cheaper than
 * a YAML parser. One item per line keeps the diffs reviewable.
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
import { join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import yaml from 'js-yaml';
import {
  extractHeadline,
  normalizeText,
  postsToNewsItems,
} from '../src/lib/facebookPosts.ts';
import { skipReason } from '../src/lib/facebookTopics/skip.ts';

const root = fileURLToPath(new URL('..', import.meta.url));
const OUTPUT = join(root, 'src/data/news.facebook.json');
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
        // An archive from scripts/facebook-sync: <YYYY>/<YYYY-MM>.json.
        if (/^\d{4}$/.test(name) && statSync(join(arg, name)).isDirectory()) {
          for (const month of readdirSync(join(arg, name)).sort()) {
            if (/^\d{4}-\d{2}\.json$/.test(month)) {
              files.push(join(arg, name, month));
            }
          }
        }
      }
    } else {
      files.push(arg);
    }
  }
  return files;
}

function readSourceName(files) {
  for (const file of files) {
    // page_info.json from the scraper, or page.json at the archive root.
    const pageInfo = [
      join(file, '..', 'page_info.json'),
      join(file, '..', '..', 'page.json'),
    ].find(existsSync);
    if (pageInfo) {
      const name = JSON.parse(readFileSync(pageInfo, 'utf-8'))?.page_name;
      if (typeof name === 'string' && name.trim()) return name.trim();
    }
  }
  return DEFAULT_SOURCE_NAME;
}

/**
 * The generated file: header fields, then one item per line. `sourceName` is
 * the same for every item, so it is stored once and filled in by news.ts;
 * empty `topics` are dropped.
 */
function toJson({ items, sourceName, ...header }) {
  const lines = items.map(({ sourceName: _, topics, ...item }) =>
    JSON.stringify(topics.length ? { ...item, topics } : item)
  );
  const head = JSON.stringify({ ...header, sourceName }, null, 2).slice(0, -2);
  return `${head},\n  "items": [\n    ${lines.join(',\n    ')}\n  ]\n}\n`;
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
      // Still published on /government/news; just on no category page.
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
  const untagged = items.filter(i => !i.topics.length).length;

  if (dryRun) {
    printReport(allPosts, rules, items, onlyTopic);
    return;
  }

  writeFileSync(
    OUTPUT,
    toJson({
      generated:
        'By scripts/import-facebook-posts.mjs. Do not edit by hand: change the rules in src/lib/facebookTopics/ and re-run `npm run import:posts`.',
      sources: args.map(arg => relative(root, resolve(arg))),
      sourceName: readSourceName(files),
      items,
    })
  );

  const counts = rules
    .map(
      rule =>
        `${rule.topic}: ${items.filter(i => i.topics.includes(rule.topic)).length}`
    )
    .join(', ');
  console.log(
    `Read ${posts.length} posts from ${files.length} file(s); wrote ${items.length} items to ${relative(root, OUTPUT)} (${counts}, untagged: ${untagged}).`
  );
}

await main();
