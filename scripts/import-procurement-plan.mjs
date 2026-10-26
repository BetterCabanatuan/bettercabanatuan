/**
 * Imports the city's Annual Procurement Plan (APP) PDF into the portal.
 *
 *   npm run import:app -- <APP pdf> [--dry-run]
 *
 * Rewrites src/data/procurement-plan.json. That file is generated: fix the
 * parser here, not the JSON. Needs poppler's `pdftotext` on the PATH.
 *
 * The PDF is an Excel export, so the table survives only as positioned
 * words. Rows are rebuilt from two properties of that export:
 *
 * - Columns sit at the same x on every page (the "Column 1..12" header on
 *   page 1), so each word belongs to the column whose band holds its centre.
 * - Every row has a start-date cell, and Excel lays each cell out relative
 *   to its row: centred on it, or for some cells top-aligned in it. A
 *   wrapped title is matched to its row by that geometry rather than by
 *   guessing where one title ends and the next begins; the lines of
 *   adjacent rows often touch.
 *
 * The plan prints a total under each section and three totals in the
 * sign-off. The import refuses to write unless the rows add up to all of
 * them, and lists any text it could not place in a row.
 */
import { execFileSync } from 'node:child_process';
import { writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const OUTPUT = fileURLToPath(
  new URL('../src/data/procurement-plan.json', import.meta.url)
);

const SOURCE = {
  title: 'Annual Procurement Plan F.Y. 2026',
  fiscalYear: 2026,
  url: 'https://www.cabanatuancity.gov.ph/uploads/files/procurement/6a5878e43d7118.12679050.pdf',
  pages: 49,
  postedDate: '2026-02-13',
  approvedDate: '2025-12-23',
};

/** Centres of the header's "Column N" labels, page 1, in PDF points. */
const COLUMN_CENTRES = [
  122.9, 228.0, 288.8, 346.1, 406.2, 480.2, 561.5, 632.9, 690.8, 754.4, 832.2,
  909.6,
];
/** Titles are left-aligned and run long, so column 1 ends at a fixed edge. */
const TITLE_RIGHT_EDGE = 200;

const FIELDS = [
  'title',
  'office',
  'category',
  'mode',
  'earlyProcurement',
  'criteria',
  'start',
  'end',
  'fund',
  'budget',
  'strategy',
  'remarks',
];
const START_COLUMN = FIELDS.indexOf('start');

/** Section headings as printed, in order, with the id each row carries. */
const SECTIONS = [
  { id: 'general', match: /^General Requirements/ },
  { id: 'direct-acquisition', match: /^Miscellaneous Items/ },
  { id: 'common-use-supplies', match: /^Common Use Supplies/ },
];

const DATE = /^[A-Z][a-z]{2}-\d{2}$/;
const AMOUNT = /^[\d,]+\.\d{2}$/;
const MONTHS = 'Jan Feb Mar Apr May Jun Jul Aug Sep Oct Nov Dec'.split(' ');

/** A sortable position across pages. */
const at = (page, y) => page * 10000 + y;

function columnOf(word) {
  if (word.xMax <= TITLE_RIGHT_EDGE) return 0;
  const centre = (word.xMin + word.xMax) / 2;
  let best = 1;
  for (let c = 1; c < COLUMN_CENTRES.length; c++) {
    if (
      Math.abs(COLUMN_CENTRES[c] - centre) <
      Math.abs(COLUMN_CENTRES[best] - centre)
    ) {
      best = c;
    }
  }
  return best;
}

function decodeEntities(text) {
  return text
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&amp;/g, '&');
}

function readPages(pdf) {
  const html = execFileSync('pdftotext', ['-bbox', pdf, '-'], {
    encoding: 'utf8',
    maxBuffer: 64 * 1024 * 1024,
    // Blank pages make pdftotext print "no word list" on stderr.
    stdio: ['ignore', 'pipe', 'ignore'],
  });
  return html
    .split('<page ')
    .slice(1)
    .map(page =>
      [
        ...page.matchAll(
          /<word xMin="([\d.]+)" yMin="([\d.]+)" xMax="([\d.]+)" yMax="([\d.]+)">([^<]*)<\/word>/g
        ),
      ].map(m => ({
        xMin: +m[1],
        yMin: +m[2],
        xMax: +m[3],
        yMax: +m[4],
        text: decodeEntities(m[5]),
      }))
    );
}

function clean(text) {
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Joins a wrapped cell. A line that opens with a bullet ("-", "•") starts a
 * new line, so lists survive; a word Excel broke at its hyphen ("Pag-" /
 * "Asa") is rejoined without a space.
 */
function joinLines(lines) {
  return lines
    .map(line => clean(line.text))
    .reduce((text, line) => {
      if (!text) return line;
      if (/^[-•]/.test(line)) return `${text}\n${line}`;
      if (/[A-Za-z]-$/.test(text)) return text + line;
      return `${text} ${line}`;
    }, '');
}

/** Words sharing a baseline with `word`, left to right. */
function baselineOf(words, word) {
  return words
    .filter(w => Math.abs(w.yMin - word.yMin) < 1)
    .sort((a, b) => a.xMin - b.xMin);
}

/** Words of one column, joined into lines that share a baseline. */
function linesOf(words) {
  const lines = [];
  for (const word of [...words].sort(
    (a, b) => a.yMin - b.yMin || a.xMin - b.xMin
  )) {
    const line = lines.find(l => Math.abs(l.yMin - word.yMin) < 1);
    if (line) {
      line.words.push(word);
      line.yMax = Math.max(line.yMax, word.yMax);
    } else {
      lines.push({ yMin: word.yMin, yMax: word.yMax, words: [word] });
    }
  }
  for (const line of lines) {
    line.words.sort((a, b) => a.xMin - b.xMin);
    line.text = line.words.map(w => w.text).join(' ');
  }
  return lines.sort((a, b) => a.yMin - b.yMin);
}

/**
 * Splits a column's lines into consecutive cells, one per row anchor (the
 * centre of the row's start-date cell). Dynamic programming over (lines
 * used, anchors used):
 *
 * - A centred cell spans its anchor and costs the distance between its
 *   centre and the anchor, so a well-centred split costs close to nothing.
 * - A top-aligned cell (the CCENRO items, some offices) starts below the
 *   previous anchor. It costs a flat amount, so it only wins where no
 *   centred reading fits.
 * - A row may have no text in this column.
 * - Text that fits no row is kept apart and reported, at a cost high
 *   enough that it is a last resort.
 *
 * Lines inside one cell sit at one exact pitch; the step to the next row's
 * cell rarely matches it. A cell never grows across a change of pitch, which
 * stops stacked two-line cells ("City Motorpool / Office", 11.6pt apart,
 * 12.2pt to the next row) from being read three lines at a time.
 */
const EMPTY_CELL_COST = 1;
const TOP_ALIGNED_COST = 2;
const FREE_TEXT_COST = 20;
const MAX_LINE_GAP = 6;
const PITCH_TOLERANCE = 0.1;

function splitColumn(lines, anchors) {
  const n = lines.length;
  const m = anchors.length;
  const cost = Array.from({ length: n + 1 }, () =>
    new Array(m + 1).fill(Infinity)
  );
  const step = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(null));
  cost[0][0] = 0;

  for (let i = 0; i <= n; i++) {
    for (let k = 0; k <= m; k++) {
      const base = cost[i][k];
      if (base === Infinity) continue;
      const relax = (ni, nk, c, how) => {
        if (base + c < cost[ni][nk]) {
          cost[ni][nk] = base + c;
          step[ni][nk] = { i, k, how };
        }
      };
      if (k < m) relax(i, k + 1, EMPTY_CELL_COST, 'empty');
      for (let j = i + 1; j <= n; j++) {
        if (j > i + 1) {
          const gap = lines[j - 1].yMin - lines[j - 2].yMax;
          const pitch = lines[j - 1].yMin - lines[j - 2].yMin;
          const cellPitch = lines[i + 1].yMin - lines[i].yMin;
          if (
            gap > MAX_LINE_GAP ||
            Math.abs(pitch - cellPitch) > PITCH_TOLERANCE
          ) {
            break;
          }
        }
        const top = lines[i].yMin;
        const bottom = lines[j - 1].yMax;
        if (k < m && (k + 1 === m || bottom < anchors[k + 1])) {
          const anchor = anchors[k];
          const belowPrevious = k === 0 || top > anchors[k - 1];
          const spans = top <= anchor && anchor <= bottom;
          let c = Infinity;
          if (spans) c = Math.abs((top + bottom) / 2 - anchor);
          if (belowPrevious && top <= anchor) {
            c = Math.min(c, TOP_ALIGNED_COST);
          }
          if (c < Infinity) relax(j, k + 1, c, 'cell');
        }
        if (!anchors.some(a => top <= a && a <= bottom)) {
          relax(j, k, FREE_TEXT_COST, 'free');
        }
      }
    }
  }

  if (cost[n][m] === Infinity) throw new Error('No consistent row split');
  const cells = new Array(m).fill(null);
  const free = [];
  let i = n;
  let k = m;
  while (i > 0 || k > 0) {
    const s = step[i][k];
    const group = lines.slice(s.i, i);
    if (s.how === 'cell') cells[s.k] = group;
    if (s.how === 'free') free.push(...group);
    i = s.i;
    k = s.k;
  }
  return { cells, free };
}

function parseMonth(text, page) {
  const [mon, yy] = text.split('-');
  const month = MONTHS.indexOf(mon) + 1;
  if (!month) throw new Error(`Unreadable month "${text}" on page ${page}`);
  return `20${yy}-${String(month).padStart(2, '0')}`;
}

function parseAmount(text) {
  if (!text || text === '-') return null;
  const amount = Number(text.replace(/,/g, ''));
  return Number.isFinite(amount) ? amount : NaN;
}

function parse(pdf) {
  const rows = [];
  const headings = [];
  const totals = [];
  const groups = [];
  const footer = [];
  const unplaced = [];

  readPages(pdf).forEach((words, index) => {
    const page = index + 1;
    if (words.length === 0) return;

    // Drop the plan's title block and column headings on page 1.
    let body = words;
    const header = words.filter(w => w.text === 'Column');
    if (page === 1 && header.length) {
      const bottom = Math.max(...header.map(w => w.yMax));
      body = body.filter(w => w.yMin > bottom + 1);
    }

    // The sign-off block starts at "Note: Insert additional rows".
    const note = body.find(
      w => w.text === 'Note:' && w.xMax <= TITLE_RIGHT_EDGE
    );
    if (note) {
      footer.push(...body.filter(w => w.yMin >= note.yMin - 1));
      body = body.filter(w => w.yMin < note.yMin - 1);
    }

    // Section headings and totals run across the columns rather than
    // sitting in cells, so they come out before the split.
    const taken = new Set();
    for (const word of body) {
      if (taken.has(word)) continue;
      const line = baselineOf(body, word);
      if (word.text === 'TOTAL:') {
        line.forEach(w => taken.add(w));
        const amount = line.find(w => AMOUNT.test(w.text));
        totals.push({
          pos: at(page, word.yMin),
          amount: parseAmount(amount?.text),
        });
        continue;
      }
      if (line[0] !== word || word.xMax > TITLE_RIGHT_EDGE) continue;
      const text = clean(line.map(w => w.text).join(' '));
      const section = SECTIONS.find(s => s.match.test(text));
      if (section) {
        line.forEach(w => taken.add(w));
        headings.push({ ...section, text, pos: at(page, word.yMin) });
        continue;
      }
      // A group heading ("Purchase of:") is a title ending in a colon with
      // a "-" remark and nothing else on its line. Wrapped titles also end
      // lines with colons ("such as but not limited to:"), never beside a
      // remark of their own.
      const title = line.filter(w => columnOf(w) === 0);
      const rest = line.filter(w => columnOf(w) !== 0);
      if (
        title.at(-1).text.endsWith(':') &&
        rest.length === 1 &&
        rest[0].text === '-' &&
        columnOf(rest[0]) === FIELDS.length - 1
      ) {
        line.forEach(w => taken.add(w));
        const label = clean(title.map(w => w.text).join(' ')).slice(0, -1);
        groups.push({ label, page, pos: at(page, word.yMin) });
      }
    }
    body = body.filter(w => !taken.has(w));

    const anchors = body
      .filter(w => columnOf(w) === START_COLUMN && DATE.test(w.text))
      .map(w => (w.yMin + w.yMax) / 2)
      .sort((a, b) => a - b);

    const columns = FIELDS.map(() => []);
    for (const word of body) columns[columnOf(word)].push(word);
    const split = columns.map(col => splitColumn(linesOf(col), anchors));

    anchors.forEach((y, k) => {
      const row = { page, pos: at(page, y) };
      FIELDS.forEach((field, c) => {
        const cell = split[c].cells[k];
        row[field] = cell ? joinLines(cell) : '';
      });
      rows.push(row);
    });

    split.forEach(({ free }, c) => {
      for (const line of free) {
        unplaced.push(`p${page} ${FIELDS[c]}: ${line.text}`);
      }
    });
  });

  return { rows, headings, totals, groups, footer, unplaced };
}

/**
 * The sign-off prints three amounts, top to bottom: the early procurement
 * total, the PS-DBM total and the grand total.
 */
function footerTotals(footer) {
  const amounts = footer
    .filter(w => AMOUNT.test(w.text))
    .sort((a, b) => a.yMin - b.yMin)
    .map(w => parseAmount(w.text));
  if (amounts.length !== 3) {
    throw new Error(
      `Expected 3 amounts in the sign-off, got ${amounts.length}`
    );
  }
  const [earlyProcurement, commonUseSupplies, grand] = amounts;
  return { earlyProcurement, commonUseSupplies, grand };
}

/** A title that names an action is a row of its own, not a group member. */
const ACTION =
  /^(Purchase|Procurement|Acquisition|Construction of|Improvement|Rehabilitation|Repair|Installation|Hiring)\b/i;

/**
 * Rows under a group heading ("Repair and Maintenance:", then "Office
 * Equipment", "Motor Vehicles" ...) carry its label: the children repeat
 * across groups and mean nothing alone. The group runs until a row names
 * an action of its own or belongs to another office.
 */
function groupsOf(rows, groups) {
  const groupOf = new Map();
  let current = null;
  let office = null;
  let next = 0;
  for (const row of rows) {
    while (next < groups.length && groups[next].pos < row.pos) {
      current = groups[next++];
      office = null;
    }
    if (!current) continue;
    office ??= row.office;
    if (ACTION.test(row.title) || row.office !== office) {
      current = null;
      continue;
    }
    groupOf.set(row, current.label);
  }
  return groupOf;
}

const sum = items => items.reduce((total, i) => total + (i.budget ?? 0), 0);
const same = (a, b) => Math.abs(a - b) < 0.005;

function build(pdf) {
  const { rows, headings, totals, groups, footer, unplaced } = parse(pdf);
  if (headings.length !== SECTIONS.length) {
    throw new Error(
      `Found ${headings.length} of ${SECTIONS.length} section headings`
    );
  }
  const printed = footerTotals(footer);

  const sectionAt = pos => headings.filter(h => h.pos < pos).at(-1)?.id ?? null;
  const groupOf = groupsOf(rows, groups);

  const problems = [];
  const items = rows.map((row, index) => {
    const budget = parseAmount(row.budget);
    if (Number.isNaN(budget)) {
      problems.push(`p${row.page}: budget "${row.budget}"`);
    }
    if (!row.title) problems.push(`p${row.page}: row without a title`);
    if (!row.office)
      problems.push(`p${row.page}: "${row.title}" has no office`);
    if (!['Yes', 'No'].includes(row.earlyProcurement)) {
      problems.push(
        `p${row.page}: early procurement "${row.earlyProcurement}"`
      );
    }
    const item = {
      id: `app-${SOURCE.fiscalYear}-${String(index + 1).padStart(3, '0')}`,
      section: sectionAt(row.pos),
      ...(groupOf.has(row) && { group: groupOf.get(row) }),
      // One title opens with a bullet that belongs to no list.
      title: row.title.replace(/^-\s*/, ''),
      office: row.office,
      // Thirty rows print "GOODS".
      category: row.category.replace(/^GOODS$/, 'Goods'),
      mode: row.mode === '-' ? '' : row.mode,
      earlyProcurement: row.earlyProcurement === 'Yes',
      criteria: row.criteria === '-' ? '' : row.criteria,
      start: parseMonth(row.start, row.page),
      end: parseMonth(row.end, row.page),
      fund: row.fund,
      budget,
      strategy: row.strategy === '-' ? '' : row.strategy,
      page: row.page,
    };
    if (row.remarks && row.remarks !== '-') item.remarks = row.remarks;
    return item;
  });

  const sections = headings.map((heading, s) => {
    const next = headings[s + 1]?.pos ?? Infinity;
    const total = totals.find(t => t.pos > heading.pos && t.pos < next);
    const parsed = sum(items.filter(i => i.section === heading.id));
    if (!total) problems.push(`${heading.id}: printed total not found`);
    else if (!same(total.amount, parsed)) {
      problems.push(
        `${heading.id}: rows add up to ${parsed.toFixed(2)}, plan prints ${total.amount.toFixed(2)}`
      );
    }
    return {
      id: heading.id,
      title: heading.text,
      printedTotal: total?.amount ?? null,
    };
  });

  const checks = [
    ['grand total', sum(items), printed.grand],
    [
      'PS-DBM total',
      sum(items.filter(i => i.section === 'common-use-supplies')),
      printed.commonUseSupplies,
    ],
  ];
  for (const [label, parsed, expected] of checks) {
    if (!same(parsed, expected)) {
      problems.push(
        `${label}: rows add up to ${parsed.toFixed(2)}, plan prints ${expected.toFixed(2)}`
      );
    }
  }

  // The FY 2026 plan flags two rows (PHP 30.5M) for early procurement but
  // prints PHP 226,263,698.50 as their total, a figure no set of rows makes.
  // That is the document's inconsistency, so it warns rather than fails.
  const warnings = [];
  const early = sum(items.filter(i => i.earlyProcurement));
  if (!same(early, printed.earlyProcurement)) {
    warnings.push(
      `early procurement: flagged rows add up to ${early.toFixed(2)}, plan prints ${printed.earlyProcurement.toFixed(2)}`
    );
  }

  const source = {
    ...SOURCE,
    printedTotal: printed.grand,
    printedEarlyProcurementTotal: printed.earlyProcurement,
  };
  return { source, items, sections, unplaced, problems, warnings };
}

function main() {
  const args = process.argv.slice(2);
  const dryRun = args.includes('--dry-run');
  const pdf = args.find(a => !a.startsWith('--'));
  if (!pdf) {
    console.error('Usage: npm run import:app -- <APP pdf> [--dry-run]');
    process.exit(1);
  }

  const { source, items, sections, unplaced, problems, warnings } = build(pdf);

  console.log(`${items.length} rows, total ${source.printedTotal}`);
  for (const s of sections) {
    const count = items.filter(i => i.section === s.id).length;
    console.log(`  ${s.id}: ${count} rows, printed total ${s.printedTotal}`);
  }
  if (unplaced.length) {
    console.log('\nText outside any row (check none of it is a lost title):');
    for (const line of unplaced) console.log(`  ${line}`);
  }
  if (warnings.length) {
    console.log('\nWarnings (in the source document, not the parse):');
    for (const w of warnings) console.log(`  ${w}`);
  }
  if (problems.length) {
    console.error('\nProblems:');
    for (const p of problems) console.error(`  ${p}`);
    process.exit(1);
  }
  if (dryRun) return;

  const lines = [
    '{',
    `  "source": ${JSON.stringify(source)},`,
    `  "sections": ${JSON.stringify(sections)},`,
    '  "items": [',
    items.map(i => `    ${JSON.stringify(i)}`).join(',\n'),
    '  ]',
    '}',
    '',
  ];
  writeFileSync(OUTPUT, lines.join('\n'));
  console.log(`\nWrote ${OUTPUT}`);
}

main();
