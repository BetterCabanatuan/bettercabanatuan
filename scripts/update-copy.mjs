#!/usr/bin/env node
/**
 * Copy pass for the homepage bands.
 *
 * Rewrites the two subtitles that collided, adds the keys the new card and
 * band markup needs, and drops the keys that the "Browse all" demotion and the
 * collapsed news list made dead.
 *
 * Idempotent — safe to re-run. Prints a before/after diff of every key it
 * touches so the wording can be reviewed without opening the JSON.
 *
 *   node scripts/update-copy.mjs           # apply
 *   node scripts/update-copy.mjs --dry     # show only
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('..', import.meta.url));
const dry = process.argv.includes('--dry');

/**
 * Every homepage band's subtitle, in page order.
 *
 * The rule these exist to satisfy: no two bands on the homepage may open with
 * the same sentence. "Government Activity" and the news band both said
 * "Stay updated with the latest government activities and announcements", which
 * is two sections competing for the same words and saying nothing.
 */
const CHANGES = {
  en: {
    set: {
      'governmentActivity.description':
        'Meet the people who run the city, the offices that deliver its services, and the projects they are building.',
      'governmentActivity.viewSection': 'View section',
      'governmentActivity.viewAll': 'View all government sections',
      'news.badge': 'Official channel',
      'news.title': 'Announcements from the city government',
      'news.description':
        'Advisories, program updates, and public notices, as posted by the city government on its official Facebook page.',
      'services.viewAllCategory': 'Explore',
      'departments.viewDetails': 'View details',
      'projects.viewProject': 'View project',
    },
    remove: ['services.compact', 'governmentActivity.compact'],
  },
  fil: {
    set: {
      'governmentActivity.description':
        'Kilalanin ang mga taong humahawak ng pamahalaan, ang mga tanggapan na nagbibigay ng serbisyo, at ang mga proyekto nilang ginagawa.',
      'governmentActivity.viewSection': 'Tingnan ang seksyon',
      'governmentActivity.viewAll':
        'Tingnan ang lahat ng seksyon ng pamahalaan',
      'news.badge': 'Opisyal na channel',
      'news.title': 'Mga anunsyo mula sa pamahalaang lungsod',
      'news.description':
        'Mga abiso, update ng programa, at pampublikong paunawa, gaya ng inilathala ng pamahalaang lungsod sa opisyal nitong Facebook page.',
      'services.viewAllCategory': 'Tuklas',
      'departments.viewDetails': 'Tingnan ang detalye',
      'projects.viewProject': 'Tingnan ang proyekto',
    },
    remove: ['services.compact', 'governmentActivity.compact'],
  },
};

const get = (obj, path) =>
  path.split('.').reduce((o, k) => (o == null ? o : o[k]), obj);

const set = (obj, path, value) => {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys.slice(0, -1)) {
    if (typeof cur[k] !== 'object' || cur[k] === null) cur[k] = {};
    cur = cur[k];
  }
  cur[keys.at(-1)] = value;
};

const del = (obj, path) => {
  const keys = path.split('.');
  let cur = obj;
  for (const k of keys.slice(0, -1)) {
    if (typeof cur?.[k] !== 'object' || cur[k] === null) return;
    cur = cur[k];
  }
  delete cur[keys.at(-1)];
};

for (const [lang, { set: sets, remove }] of Object.entries(CHANGES)) {
  const file = join(root, `public/locales/${lang}/common.json`);
  const before = readFileSync(file, 'utf8');
  const data = JSON.parse(before);

  console.log(`\n${lang}`);

  for (const [path, value] of Object.entries(sets)) {
    const old = get(data, path);
    if (old === value) {
      console.log(`  = ${path} (already current)`);
      continue;
    }
    console.log(`  ~ ${path}`);
    if (old !== undefined) {
      console.log(`      - "${old}"`);
      console.log(`      + "${value}"`);
    } else {
      console.log(`      + "${value}"`);
    }
    set(data, path, value);
  }

  for (const path of remove) {
    if (get(data, path) === undefined) {
      console.log(`  = ${path} (already absent)`);
      continue;
    }
    console.log(`  - ${path} (no longer referenced by any component)`);
    del(data, path);
  }

  if (!dry) {
    // Trailing newline, two-space indent — matches the repo's Prettier config.
    writeFileSync(file, `${JSON.stringify(data, null, 2)}\n`);
  }
}

console.log(`\n${dry ? 'dry run, nothing written' : 'written'}`);
