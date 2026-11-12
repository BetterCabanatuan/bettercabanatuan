/**
 * The city's Annual Procurement Plan, as imported from its PDF by
 * `npm run import:app` into procurement-plan.json. That file is generated;
 * this module types it and groups its rows by office.
 */
import planJson from './procurement-plan.json';

export type ProcurementSectionId =
  | 'general'
  | 'direct-acquisition'
  | 'common-use-supplies';

export interface ProcurementItem {
  id: string;
  section: ProcurementSectionId;
  /** Group heading the row sits under in the PDF, e.g. "Purchase of". */
  group?: string;
  /** As printed. Bulleted lists keep a line break before each bullet. */
  title: string;
  /** End-user or implementing unit, as printed: one code or several. */
  office: string;
  category: string;
  mode: string;
  earlyProcurement: boolean;
  criteria: string;
  /** YYYY-MM */
  start: string;
  /** YYYY-MM */
  end: string;
  fund: string;
  /** Estimated budget in pesos; null where the plan prints "-". */
  budget: number | null;
  strategy: string;
  remarks?: string;
  /** PDF page the row is printed on. */
  page: number;
}

export interface ProcurementSection {
  id: ProcurementSectionId;
  title: string;
  printedTotal: number;
}

export interface ProcurementPlan {
  source: {
    title: string;
    fiscalYear: number;
    url: string;
    pages: number;
    postedDate: string;
    approvedDate: string;
    printedTotal: number;
    printedEarlyProcurementTotal: number;
  };
  sections: ProcurementSection[];
  items: ProcurementItem[];
}

export const procurementPlan = planJson as ProcurementPlan;

export interface OfficeInfo {
  /** Key for filtering and grouping: the plan's code where it has one. */
  code: string;
  /** How the plan prints the office: its code, or its name where it has none. */
  label: string;
  /** Whether `label` is a code (and so worth showing beside a full name). */
  isCode: boolean;
  /** Full name, only where a department page on this portal confirms it. */
  name?: string;
  /** Department page slug under /government/departments. */
  slug?: string;
}

/**
 * Codes the plan uses for offices that have a department page here. A code
 * is listed only where that page confirms the office; the rest (CEEMO,
 * CTDPO, CAO and the national agencies) show as printed. Two offices the
 * plan names instead of coding carry that name as `printed`, under a key
 * of our own.
 */
const OFFICES: Record<
  string,
  { name: string; slug: string; printed?: string }
> = {
  CMO: { name: 'Office of the City Mayor', slug: 'executive' },
  SP: { name: 'Sangguniang Panlungsod', slug: 'legislative' },
  CEO: { name: 'Office of the City Engineer', slug: 'city-engineers-office' },
  CHO: { name: 'City Health Office', slug: 'cho' },
  CAgriO: { name: 'City Agriculture Office', slug: 'city-agriculture-office' },
  MOTORPOOL: {
    name: 'City Motor Pool Office',
    slug: 'motor-pool',
    printed: 'City Motorpool Office',
  },
  MVGCCGH: {
    name: 'MVG Cabanatuan City General Hospital',
    slug: 'mvg-city-general-hospital',
  },
  CSWDO: {
    name: 'City Social Welfare and Development Office',
    slug: 'cswdo',
  },
  CVO: { name: 'City Veterinary Office', slug: 'city-veterinary-office' },
  GSO: { name: 'City General Services Office', slug: 'gso' },
  CLCDO: {
    name: 'City Livelihood and Cooperatives Development Office',
    slug: 'clcdo',
  },
  CDRRMO: {
    name: 'City Disaster Risk Reduction and Management Office',
    slug: 'cdrrmo',
  },
  OCBO: {
    name: 'Office of the City Building Official',
    slug: 'city-building-official',
  },
  CCENRO: {
    name: 'Cabanatuan City Environment and Natural Resources Office',
    slug: 'cenro',
  },
  CPDO: { name: 'City Planning and Development Office', slug: 'cpdo' },
  HRMO: { name: 'City Human Resource Management Office', slug: 'chrmo' },
  CLO: {
    name: 'Office for City Legal Affairs',
    slug: 'city-legal-office',
    printed: 'City Legal Office',
  },
  CBLIPO: {
    name: 'City Business Licensing and Investment Promotion Office',
    slug: 'bplo',
  },
  CTO: { name: 'Office of the City Treasurer', slug: 'city-treasurers-office' },
  CBO: { name: 'City Budget Office', slug: 'budget-office' },
  LCRO: { name: 'City Civil Registry Office', slug: 'lcro' },
  CITO: { name: 'City Information and Tourism Office', slug: 'tourism' },
};

/** Spellings the plan uses for a listed office, including its typos. */
const ALIASES: Record<string, string> = {
  'City Motorpool Office': 'MOTORPOOL',
  'City Motorpool': 'MOTORPOOL',
  'CITY MOTORPOOL': 'MOTORPOOL',
  Motorpool: 'MOTORPOOL',
  'City Veterinary Office': 'CVO',
  'City Legal Office': 'CLO',
  CCERNO: 'CCENRO',
  'NGO(S)': 'NGO(s)',
};

/** A known code, its alias, or a sub-unit of one ("CSWDO - FDC" -> CSWDO). */
function canonical(token: string): string {
  if (OFFICES[token]) return token;
  if (ALIASES[token]) return ALIASES[token];
  const base = token.split(/\s*-\s*/)[0];
  if (OFFICES[base]) return base;
  return ALIASES[base] ?? token;
}

export interface OfficePart {
  /** As printed, sub-unit and all ("CMO - LYDO"). */
  text: string;
  /** The office it belongs to ("CMO"). */
  code: string;
}

/**
 * Each office a row names, in printed order. The plan separates them with
 * "/" or "," and once with only a space ("GSO CCENRO").
 */
export function officeParts(office: string): OfficePart[] {
  return office
    .split(/\s*[/,]\s*/)
    .flatMap(token =>
      /^[A-Z]{2,}( [A-Z]{2,})+$/.test(token) && !ALIASES[token]
        ? token.split(' ')
        : [token]
    )
    .map(token => token.trim())
    .filter(Boolean)
    .map(text => ({ text, code: canonical(text) }));
}

/** The offices a row names, in printed order, without repeats. */
export function officeCodes(office: string): string[] {
  return [...new Set(officeParts(office).map(part => part.code))];
}

export function officeInfo(code: string): OfficeInfo {
  const office = OFFICES[code];
  if (!office) return { code, label: code, isCode: !/\s/.test(code) };
  return {
    code,
    label: office.printed ?? code,
    isCode: !office.printed,
    name: office.name,
    slug: office.slug,
  };
}

/** The office listed first, which leads the row. */
export function leadOffice(item: ProcurementItem): string {
  return officeCodes(item.office)[0] ?? item.office;
}

export interface OfficeTotal extends OfficeInfo {
  total: number;
  count: number;
}

/** Planned budget by lead office, largest first. */
export function totalsByLeadOffice(items: ProcurementItem[]): OfficeTotal[] {
  const totals = new Map<string, OfficeTotal>();
  for (const item of items) {
    const code = leadOffice(item);
    const entry = totals.get(code) ?? {
      ...officeInfo(code),
      total: 0,
      count: 0,
    };
    entry.total += item.budget ?? 0;
    entry.count += 1;
    totals.set(code, entry);
  }
  return [...totals.values()].sort((a, b) => b.total - a.total);
}

export function totalBudget(items: ProcurementItem[]): number {
  return items.reduce((sum, item) => sum + (item.budget ?? 0), 0);
}
